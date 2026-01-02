
import { GoogleGenAI, Type } from "@google/genai";
import { GitaQuote } from "../types";

export const getDailyGitaQuote = async (): Promise<GitaQuote | null> => {
  try {
    // Correct initialization as per Google GenAI SDK guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a powerful and inspiring quote from the Bhagavad Gita for ISKCON devotees today.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verse: { type: Type.STRING },
            translation: { type: Type.STRING },
            purport: { type: Type.STRING },
            chapter: { type: Type.INTEGER },
            text: { type: Type.INTEGER }
          },
          required: ["verse", "translation", "purport", "chapter", "text"]
        }
      }
    });

    // Access .text property directly as per guidelines (it is a getter, not a method)
    const responseText = response.text;
    if (!responseText) return null;
    return JSON.parse(responseText.trim());
  } catch (error) {
    console.error("Error fetching Gita quote:", error);
    return null;
  }
};
