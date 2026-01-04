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

    const { action, videoTitle, existingNotes, userInput } = await req.json();
    
    let prompt = "";
    
    if (action === "summarize") {
      prompt = `You are a helpful study assistant. Summarize the following notes taken while watching "${videoTitle}". Make the summary concise but comprehensive, highlighting key points and concepts:\n\nNotes:\n${existingNotes}\n\nProvide a well-structured summary.`;
    } else if (action === "expand") {
      prompt = `You are a helpful study assistant. The user is watching "${videoTitle}" and has written this note: "${userInput}". Expand on this note with more details, explanations, and related concepts that would help them understand the topic better. Keep it educational and relevant.`;
    } else if (action === "quiz") {
      prompt = `You are a helpful study assistant. Based on these notes from "${videoTitle}":\n\n${existingNotes}\n\nGenerate 3-5 quiz questions to test understanding of the material. Format each question with the question text followed by the answer.`;
    } else if (action === "improve") {
      prompt = `You are a helpful study assistant. The user is watching "${videoTitle}" and has written: "${userInput}". Improve this note by making it clearer, more organized, and adding any missing context. Keep it concise but comprehensive.`;
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
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
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
