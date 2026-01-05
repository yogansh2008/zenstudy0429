import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const { action, videoTitle, existingNotes, userInput, habitData } = await req.json();
    
    let prompt = "";
    
    if (action === "generate") {
      // Main "Generate Notes" feature - structured study notes
      prompt = `You are an expert educational content creator. Create comprehensive, well-structured study notes for a video titled "${videoTitle}".

Generate notes that are:
- Student-friendly and easy to understand
- Organized with clear headings and subpoints
- Concise yet comprehensive

Format the output as follows:
# Main Topic

## Key Concept 1
- Important point
- Supporting detail
  - Sub-detail if needed

## Key Concept 2
- Important point
- Another point

### Summary
- Key takeaway 1
- Key takeaway 2

${existingNotes ? `\nContext from existing notes:\n${existingNotes}` : ''}
${userInput ? `\nAdditional context provided:\n${userInput}` : ''}

Generate comprehensive study notes now:`;

    } else if (action === "summarize") {
      prompt = `You are a helpful study assistant. Summarize the following notes taken while watching "${videoTitle}". Make the summary concise but comprehensive, highlighting key points and concepts:

Notes:
${existingNotes}

Format as bullet points with clear headings. Provide a well-structured summary:`;

    } else if (action === "expand") {
      prompt = `You are a helpful study assistant. The user is watching "${videoTitle}" and has written this note: "${userInput}". 

Expand on this note with:
- More detailed explanations
- Related concepts
- Real-world examples
- Key terminology

Keep it educational, well-structured, and relevant.`;

    } else if (action === "quiz") {
      prompt = `You are a helpful study assistant. Based on these notes from "${videoTitle}":

${existingNotes}

Generate 5 quiz questions to test understanding of the material.

Format each question as:
**Q1:** [Question text]
**Answer:** [Correct answer with brief explanation]

Make questions progressively challenging from basic recall to application.`;

    } else if (action === "improve") {
      prompt = `You are a helpful study assistant. The user is watching "${videoTitle}" and has written: "${userInput}". 

Improve this note by:
- Making it clearer and more organized
- Adding missing context
- Fixing any inaccuracies
- Using better formatting

Keep it concise but comprehensive.`;

    } else if (action === "flowchart") {
      // Flowchart generation
      prompt = `You are an expert at creating educational flowcharts. Convert the following topic/notes into a clear, logical Mermaid flowchart.

Topic/Notes: ${userInput || existingNotes || videoTitle}

Create a Mermaid flowchart that:
- Has a clear Start node
- Shows the logical flow of concepts/steps
- Includes decision points if applicable
- Has a clear End node
- Uses descriptive but concise node labels

Return ONLY the Mermaid code block, nothing else. Example format:
\`\`\`mermaid
graph TD
    A[Start] --> B[Step 1]
    B --> C{Decision?}
    C -->|Yes| D[Action 1]
    C -->|No| E[Action 2]
    D --> F[End]
    E --> F
\`\`\`

Generate the Mermaid flowchart now:`;

    } else if (action === "motivation") {
      // AI Motivation for habits
      const habits = habitData?.habits || [];
      const skippedToday = habitData?.skippedToday || [];
      
      prompt = `You are ZenStudy's friendly AI mentor. Analyze the user's habit data and provide a SHORT, supportive motivational message.

User's Habit Data:
${JSON.stringify(habits, null, 2)}

Habits skipped today: ${skippedToday.join(', ') || 'None'}

Guidelines for your response:
- Be warm, supportive, and encouraging (like a caring mentor/coach)
- NEVER shame or guilt the user
- Focus on consistency over perfection
- Acknowledge patterns you notice (e.g., "Wednesdays seem challenging")
- Provide one actionable suggestion
- Keep it to 2-3 sentences MAX
- Use empathetic language

If no habits were skipped, provide an encouraging message about their consistency.

Generate a personalized motivational message:`;

    } else {
      prompt = userInput || "Hello, how can I help with your notes?";
    }

    console.log(`Processing ${action} request for video: ${videoTitle}`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate response";

    console.log('Successfully generated response');

    return new Response(JSON.stringify({ result: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-notes function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
