import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateHealthInsight = async (prompt: string): Promise<string> => {
  if (!apiKey) return "AI Configuration Missing: API Key not found.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are Wysh AI, a futuristic medical assistant for the Wysh Care platform. Provide concise, professional, and data-driven medical or administrative insights. Keep responses under 100 words.",
      }
    });
    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "System Offline: Unable to contact neural core.";
  }
};
