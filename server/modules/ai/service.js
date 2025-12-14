
import { GoogleGenAI } from "@google/genai";
import { prisma } from "../../lib/prisma.js";
import { getBreaker } from "../../lib/circuitBreaker.js";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const aiBreaker = getBreaker("AI_SERVICE");

export const AIService = {
  
  // 1. Ingest & Extract Document Data
  async ingestDocument(documentId, userId) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { patient: true }
    });

    if (!document) throw new Error("Document not found");

    try {
        // Construct Prompt
        const prompt = `
            Analyze this medical document (${document.type}). 
            Extract clinical data into JSON format...
        `;

        // WRAP IN CIRCUIT BREAKER
        const mockAIResponse = await aiBreaker.execute(async () => {
            // Simulated AI Call
            // const result = await ai.models.generateContent(...);
            
            // Mock Success logic for now
            return {
                summary: `Analyzed ${document.type}. Found clinical indicators normal except slightly elevated blood pressure.`,
                vitals: [{ name: "Blood Pressure", value: "130/85", unit: "mmHg" }],
                labs: [],
                conditions: ["Pre-hypertension"],
                medications: []
            };
        }, () => {
            // FALLBACK if AI is down
            return {
                summary: "AI Service Unavailable. Document saved without analysis.",
                vitals: [],
                labs: [],
                conditions: [],
                medications: []
            };
        });
        
        // Save Extracted Data
        await prisma.document.update({
            where: { id: documentId },
            data: {
                isExtracted: true,
                extractedData: mockAIResponse
            }
        });

        // Convert to structured Observations/Conditions (Only if AI succeeded)
        if (mockAIResponse.conditions) {
            for (const vital of mockAIResponse.vitals) {
                await prisma.observation.create({
                    data: {
                        patientId: document.patientId,
                        category: "VITAL",
                        name: vital.name,
                        value: vital.value,
                        unit: vital.unit,
                        source: "AI_EXTRACT"
                    }
                });
            }
            // ... (rest of parsing)
        }

        return mockAIResponse;

    } catch (error) {
        console.error("AI Ingestion Failed", error);
        throw new Error("Failed to process document with AI");
    }
  },

  // 2. Generate Health Insights (Patient View)
  async getHealthOverview(patientId) {
    // Fetch longitudinal record
    const patient = await prisma.patient.findUnique({
        where: { userId: patientId }, 
        include: {
            observations: { orderBy: { recordedAt: 'desc' }, take: 20 },
            conditions: { where: { status: 'Active' } },
            medications: true, 
            allergies: true
        }
    });

    if (!patient) throw new Error("Patient not found");

    // WRAP IN CIRCUIT BREAKER
    return aiBreaker.execute(async () => {
        // Real logic would be here
        // await ai.models.generateContent(...)
        
        // Mock success
        return {
            healthScore: 85,
            status: "Good",
            subscores: { physical: 80, mental: 90, lifestyle: 85 },
            risks: [{ risk: "Data Insufficient", level: "Low", advice: "Upload more records" }],
            preventiveCare: []
        };
    }, () => {
        // Fallback
        return {
            healthScore: 0,
            status: "Service Unavailable",
            subscores: { physical: 0, mental: 0, lifestyle: 0 },
            risks: [],
            preventiveCare: []
        };
    });
  },

  // ...
};
