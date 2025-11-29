import { GoogleGenAI, Type, Chat } from "@google/genai";

// Helper to safely get the API key in various environments
const getApiKey = (): string => {
  try {
    // 1. Try standard process.env (Node/Webpack/Build-time replacement)
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore ReferenceErrors
  }

  try {
    // 2. Try Vite-standard import.meta.env (Common in Vercel deployments)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    // Ignore
  }

  return '';
};

const apiKey = getApiKey();

// CRITICAL FIX: Use a placeholder 'dummy-key' if apiKey is empty.
// This prevents the GoogleGenAI constructor from throwing an error and crashing
// the entire app (Blank Screen) during the initial load.
// API calls will fail gracefully later if the key is invalid, but the UI will render.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-to-prevent-crash' });

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
    return "Error generating summary. Please check your API Key.";
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
  return ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: systemInstruction,
    }
  });
};

// Export the raw client for Live API usage in components
export const genAIClient = ai;