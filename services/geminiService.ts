import { GoogleGenAI, Type, Chat } from "@google/genai";

// --- ENVIRONMENT SETUP START ---
// This section prevents the "process is not defined" crash in browsers (Vite/Vercel)
// and maps the VITE_ environment variable to the required process.env.API_KEY.

// 1. Polyfill 'process' if it doesn't exist
if (typeof process === 'undefined') {
  (window as any).process = { env: {} };
}

// 2. Map VITE_GEMINI_API_KEY to process.env.API_KEY if not already set
// This bridges the gap between Vercel's Vite environment and the Google SDK requirements.
if (!process.env.API_KEY) {
  try {
    // @ts-ignore - Handle Vite's import.meta.env safely
    if (import.meta && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      // @ts-ignore
      process.env.API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {
    console.warn("Could not map VITE_GEMINI_API_KEY");
  }
}
// --- ENVIRONMENT SETUP END ---

// Initialize the AI client securely using the standard process.env.API_KEY
// We wrap this in a try-catch to ensure the entire app doesn't crash if the key is missing/invalid.
let ai: GoogleGenAI;

try {
  // Strictly follow the guideline: The API key must be obtained exclusively from process.env.API_KEY.
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI client:", error);
  // Fallback to a dummy client structure to prevent runtime crashes in components
  // This allows the UI to render even if AI features are disabled due to missing key.
  ai = {
    models: {
      generateContent: async () => ({ text: "AI Configuration Error: API Key missing or invalid." }),
      generateImages: async () => ({ generatedImages: [] }),
      generateVideos: async () => ({ done: true }),
    },
    chats: {
      create: () => ({
        sendMessage: async () => ({ text: "AI Chat Error: API Key missing." }),
        sendMessageStream: async function* () { yield { text: "AI Error" }; }
      })
    },
    live: {
      connect: async () => ({
        sendRealtimeInput: () => {},
        close: () => {}
      })
    }
  } as unknown as GoogleGenAI;
}

const modelName = "gemini-2.5-flash";

export const generateSummary = async (jobTitle: string, experience: string, skills: string): Promise<string> => {
  try {
    const prompt = `Write a professional, engaging, and modern resume summary (approx 50-70 words) for a ${jobTitle}. 
    Key experience: ${experience}. 
    Key skills: ${skills}. 
    Focus on achievements and value proposition. Do not use markdown.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating summary. Please check your API Key settings.";
  }
};

export const improveBulletPoint = async (text: string, jobTitle: string): Promise<string> => {
  try {
    const prompt = `Rewrite the following resume bullet point to be more professional, impactful, and result-oriented using strong action verbs. 
    Context: The role is ${jobTitle}.
    Original text: "${text}"
    Return ONLY the improved bullet point text, no explanation.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Return original if error
  }
};

export const suggestSkills = async (jobTitle: string, currentSkills: string[]): Promise<string[]> => {
  try {
    const prompt = `Suggest 5 relevant technical and soft skills for a ${jobTitle} that are missing from this list: ${currentSkills.join(', ')}.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      },
    });

    const json = JSON.parse(response.text || '{"skills": []}');
    return json.skills || [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["Teamwork", "Communication", "Problem Solving"]; // Fallback
  }
};

export const createChatSession = (systemInstruction: string): Chat => {
  try {
    return ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: systemInstruction,
      }
    });
  } catch (e) {
    console.error("Failed to create chat session", e);
    throw e;
  }
};

// Export the raw client for Live API usage in components
export const genAIClient = ai;