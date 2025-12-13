import { GoogleGenAI } from "@google/genai";

export const generateHealthInsight = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("Wysh Care: API_KEY is missing from environment variables.");
    return "AI Configuration Error: API Key not found in environment.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are Wysh AI, a futuristic medical assistant. Provide concise, professional, and data-driven medical or administrative insights. Keep responses under 100 words.",
      }
    });
    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "System Offline: Unable to contact neural core.";
  }
};

export const analyzeMedicalDocument = async (fileType: string, textContent: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "AI Module Offline: Please configure API_KEY.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Analyze the following medical text extracted from a ${fileType}. 
      Extract key findings, diagnoses, medications, and abnormal lab values. 
      Format the output as a concise clinical summary.
      
      Document Content:
      ${textContent}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Clinical Documentation Improvement (CDI) specialist. Summarize medical data accurately.",
      }
    });
    return response.text || "Could not analyze document.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Analysis Failed: Neural network interruption.";
  }
};