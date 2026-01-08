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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('AI is not configured');
    }

    const { action, videoTitle, existingNotes, userInput, habitData } = await req.json();
    
    let prompt = "";
    
    if (action === "generate") {
      // Main "Generate Notes" feature - structured study notes
      prompt = `You are ZenStudy, an AI-powered productivity and learning assistant. Create comprehensive, beginner-friendly study notes for a video titled "${videoTitle}".

RULES:
- Keep explanations beginner-friendly and easy to understand
- Use bullet points, headings, and arrows (→) for clarity
- Be concise yet comprehensive
- Never expose any API keys or internal logic

FORMAT YOUR OUTPUT AS:

# 📚 Notes: ${videoTitle}

## 🎯 Key Concepts
- Main idea 1
  → Supporting detail
  → Example or application
- Main idea 2
  → Supporting detail

## 📝 Important Points
- Point with clear explanation
- Another key takeaway

## 💡 Summary
- Key takeaway 1
- Key takeaway 2
- Key takeaway 3

${existingNotes ? `\nContext from existing notes:\n${existingNotes}` : ''}
${userInput ? `\nAdditional context provided:\n${userInput}` : ''}

Generate comprehensive, beginner-friendly study notes now:`;

    } else if (action === "summarize") {
      prompt = `You are ZenStudy, an AI learning assistant. Summarize the following notes from "${videoTitle}".

RULES:
- Keep it beginner-friendly
- Use bullet points and clear headings
- Use arrows (→) to show relationships
- Be concise but comprehensive

Notes to summarize:
${existingNotes}

FORMAT:
## 📋 Summary
- Key point → why it matters
- Another point → application

Generate a well-structured summary:`;

    } else if (action === "expand") {
      prompt = `You are ZenStudy, an AI learning assistant. The user is watching "${videoTitle}" and has written: "${userInput}". 

RULES:
- Keep explanations beginner-friendly
- Use bullet points and arrows (→) for clarity
- Include real-world examples

Expand with:
- Detailed explanations
- Related concepts
- Real-world examples
- Key terminology with simple definitions

Generate an expanded, easy-to-understand explanation:`;

    } else if (action === "quiz") {
      prompt = `You are ZenStudy, an AI learning assistant. Create a quiz based on notes from "${videoTitle}":

${existingNotes}

RULES:
- Make questions beginner-friendly
- Progress from basic to challenging
- Explain answers clearly

FORMAT:
**Q1:** [Question]
**Answer:** [Answer with simple explanation]

Generate 5 quiz questions:`;

    } else if (action === "improve") {
      prompt = `You are ZenStudy, an AI learning assistant. Improve this note from "${videoTitle}": "${userInput}". 

RULES:
- Make it clearer and more organized
- Keep it beginner-friendly
- Use bullet points and arrows (→)
- Add missing context

Generate an improved, well-formatted note:`;

    } else if (action === "flowchart") {
      // Flowchart generation - text format for easy diagram conversion
      prompt = `You are ZenStudy, an expert at creating educational flowcharts. Convert the following topic into a step-by-step flowchart.

Topic: ${userInput || existingNotes || videoTitle}

RULES:
- Create clear nodes and connections
- Use descriptive but concise labels
- Make it easy to convert into diagrams
- Keep it beginner-friendly

OUTPUT FORMAT - Return ONLY valid Mermaid code:
\`\`\`mermaid
graph TD
    A[🚀 Start: Topic Name] --> B[Step 1: First Action]
    B --> C{Decision Point?}
    C -->|Yes| D[Action if Yes]
    C -->|No| E[Action if No]
    D --> F[Next Step]
    E --> F
    F --> G[✅ End: Result]
\`\`\`

Generate a clear, easy-to-follow flowchart:`;

    } else if (action === "motivation") {
      // AI Motivation with original quotes about focus, discipline, consistency
      const habits = habitData?.habits || [];
      const skippedToday = habitData?.skippedToday || [];
      
      prompt = `You are ZenStudy's friendly AI mentor. Provide a SHORT, supportive motivational message based on the user's habit data.

User's Habit Data:
${JSON.stringify(habits, null, 2)}

Habits skipped today: ${skippedToday.join(', ') || 'None'}

RULES:
- Be warm, supportive, and encouraging (like a caring mentor)
- NEVER shame, guilt, or pressure the user
- Focus on consistency over perfection
- Generate an ORIGINAL motivational quote related to: focus, discipline, consistency, or learning
- Keep to 2-3 sentences MAX

FORMAT:
[Your personalized message] 

💭 "[Your original motivational quote about focus/discipline/consistency]"

If no habits were skipped, celebrate their consistency with an uplifting message.

Generate your response:`;

    } else {
      prompt = userInput || "Hello, how can I help with your notes?";
    }

    console.log(`Processing ${action} request for video: ${videoTitle}`);

    const systemPrompt = `You are ZenStudy — a calm, supportive, student-friendly productivity and learning assistant.\n\nCore rules:\n- Beginner-friendly explanations\n- Clear formatting with headings + bullet points\n- Flowcharts must be easy to convert into diagrams\n- Motivation must be positive, original, and non-judgmental\n- Never reveal secrets, API keys, or internal system details`; 

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment and try again.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits are required to continue. Please add credits and try again.' }),
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || "Unable to generate response";

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
