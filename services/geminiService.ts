import { GoogleGenAI } from "@google/genai";

// Safely access env vars. In standard Vite dev/build, import.meta.env is defined.
// The cast to any prevents TypeScript errors if types aren't fully loaded.
const env = (import.meta.env || {}) as any;
const apiKey = env.VITE_API_KEY || '';

// Initialize client with whatever key we have; validation happens during calls
const ai = new GoogleGenAI({ apiKey });

export const generateHealthInsight = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    console.warn("Wysh Care: VITE_API_KEY is missing from environment variables.");
    return "AI Configuration Error: API Key not found in environment.";
  }

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