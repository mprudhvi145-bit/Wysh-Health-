import { config } from '../config';
import { authService } from './authService';

// Helper to determine backend URL
const getBackendUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api/ai/health-insight';
  }
  return `${config.apiBaseUrl}/ai/health-insight`;
};

interface AIResponse {
  text?: string;
  error?: string;
  status?: string;
}

export const generateHealthInsight = async (prompt: string): Promise<string> => {
  try {
    const token = authService.getToken();
    
    const response = await fetch(getBackendUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({
        prompt,
        systemInstruction: "You are Wysh AI, a futuristic medical assistant. Provide concise, professional, and data-driven medical or administrative insights. Keep responses under 100 words.",
      }),
    });

    const data: AIResponse = await response.json();

    if (!response.ok) {
      console.warn("AI Service Warning:", data.error);
      return data.error || "Unable to generate insight.";
    }

    return data.text || "No insight generated.";
  } catch (error) {
    console.error("AI Network Error:", error);
    return "System Offline: Unable to contact neural core.";
  }
};

export const analyzeMedicalDocument = async (fileType: string, textContent: string): Promise<string> => {
  try {
    const token = authService.getToken();
    
    const prompt = `
      Analyze the following medical text extracted from a ${fileType}. 
      Extract key findings, diagnoses, medications, and abnormal lab values. 
      Format the output as a concise clinical summary.
      
      Document Content:
      ${textContent}
    `;

    const response = await fetch(getBackendUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({
        prompt,
        systemInstruction: "You are an expert Clinical Documentation Improvement (CDI) specialist. Summarize medical data accurately.",
      }),
    });

    const data: AIResponse = await response.json();

    if (!response.ok) {
      console.warn("Document Analysis Warning:", data.error);
      return data.error || "Could not analyze document.";
    }

    return data.text || "No analysis available.";
  } catch (error) {
    console.error("Document Analysis Network Error:", error);
    return "Analysis Failed: Connection interrupted.";
  }
};