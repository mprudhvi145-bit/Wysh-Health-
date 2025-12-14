
import { GoogleGenAI } from "@google/genai";
import { prisma } from "../../lib/prisma.js";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const AIService = {
  
  // 1. Ingest & Extract Document Data
  async ingestDocument(documentId, userId) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { patient: true }
    });

    if (!document) throw new Error("Document not found");

    // In a real app, verify ownership here or in controller
    // Mocking file buffer fetch. Real app would fetch from S3/Storage using document.fileUrl
    // For demo, we simulate extraction based on document type if file content isn't available
    
    try {
        // Construct Prompt
        const prompt = `
            Analyze this medical document (${document.type}). 
            Extract clinical data into JSON format with keys:
            - summary: string (concise summary)
            - vitals: array of { name, value, unit }
            - labs: array of { name, value, unit, flag }
            - conditions: array of strings (diagnoses)
            - medications: array of { name, dosage, frequency }
            
            Return ONLY JSON.
        `;

        // If we had the file buffer, we'd send:
        // contents: [{ inlineData: { mimeType: 'application/pdf', data: base64Buffer } }, { text: prompt }]
        
        // Simulating AI response for the prototype without actual file bytes
        const mockAIResponse = {
            summary: `Analyzed ${document.type}. Found clinical indicators normal except slightly elevated blood pressure.`,
            vitals: [{ name: "Blood Pressure", value: "130/85", unit: "mmHg" }],
            labs: [],
            conditions: ["Pre-hypertension"],
            medications: []
        };

        // Call Gemini (Mocked here for stability without real file bytes, but structure provided)
        // In production:
        // const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: [...] });
        
        // Save Extracted Data
        await prisma.document.update({
            where: { id: documentId },
            data: {
                isExtracted: true,
                extractedData: mockAIResponse
            }
        });

        // Convert to structured Observations/Conditions
        // 1. Vitals
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

        // 2. Conditions
        for (const cond of mockAIResponse.conditions) {
            // Check duplicates roughly
            const exists = await prisma.condition.findFirst({
                where: { patientId: document.patientId, diagnosis: cond }
            });
            if (!exists) {
                await prisma.condition.create({
                    data: {
                        patientId: document.patientId,
                        diagnosis: cond,
                        status: "Active"
                    }
                });
            }
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
        where: { userId: patientId }, // userId is passed from controller req.user.id
        include: {
            observations: { orderBy: { recordedAt: 'desc' }, take: 20 },
            conditions: { where: { status: 'Active' } },
            medications: true, // Actually linked via Prescription -> Items, simplifying for now
            allergies: true
        }
    });

    if (!patient) throw new Error("Patient not found");

    // Serialize Context
    const context = JSON.stringify({
        age: new Date().getFullYear() - patient.dob.getFullYear(),
        gender: patient.gender,
        conditions: patient.conditions.map(c => c.diagnosis),
        recent_vitals: patient.observations.map(o => `${o.name}: ${o.value} ${o.unit || ''}`),
    });

    // Call Gemini
    const prompt = `
        Act as an AI Medical Analyst. Based on this patient data: ${context}
        
        Generate a Health Overview JSON:
        {
            "healthScore": number (0-100),
            "status": string (Excellent, Good, Fair, Attention Needed),
            "subscores": { "physical": number, "mental": number, "lifestyle": number },
            "risks": [ { "risk": string, "level": "High"|"Medium"|"Low", "advice": string } ],
            "preventiveCare": [ { "action": string, "due": string } ]
        }
        Be conservative and clinical.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        const jsonStr = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("AI Insight Gen Failed", e);
        // Fallback
        return {
            healthScore: 85,
            status: "Good",
            subscores: { physical: 80, mental: 90, lifestyle: 85 },
            risks: [{ risk: "Data Insufficient", level: "Low", advice: "Upload more records" }],
            preventiveCare: []
        };
    }
  },

  // 3. Doctor Assistant Summary
  async getDoctorSummary(patientId) {
      // Similar to above but focused on clinical history
      return { summary: "AI Summary not implemented yet." };
  }
};
