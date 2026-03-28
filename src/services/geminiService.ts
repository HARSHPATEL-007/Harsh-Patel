import { GoogleGenAI, Type } from "@google/genai";
import { Decision, PHIElement, Anomaly, SovereigntyClassification } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeScenario(scenario: string): Promise<Decision> {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `
    You are a production-grade HIPAA Compliance and AI Auditability Engine.
    Your task is to analyze healthcare AI scenarios for HIPAA compliance, Zero-Trust security, and Sovereign Cloud architecture.
    
    CRITICAL: You must provide specific citations to HIPAA regulations (45 CFR § references).
    
    Analyze the scenario for:
    1. PHI/PII detection (identify specific elements).
    2. Compliance status (Compliant, Non-Compliant, Requires Review).
    3. Risk level (Low, Medium, High, Critical).
    4. Chain-of-thought logic trace for your decision.
    5. Sovereignty classification (Sovereign-Bound vs Global-Compute) for data fields.
    6. Anomalies and deviations from HIPAA workflows.
    7. Actionable recommendations.
    
    Output MUST be in valid JSON format matching the Decision interface.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      complianceStatus: { type: Type.STRING, enum: ["Compliant", "Non-Compliant", "Requires Review"] },
      riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
      summary: { type: Type.STRING },
      logicTrace: { type: Type.ARRAY, items: { type: Type.STRING } },
      phiDetected: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            value: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["type", "value", "reason"]
        }
      },
      anomalies: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            regulationReference: { type: Type.STRING }
          },
          required: ["severity", "category", "description", "regulationReference"]
        }
      },
      sovereignty: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            field: { type: Type.STRING },
            classification: { type: Type.STRING, enum: ["Sovereign-Bound", "Global-Compute"] },
            reason: { type: Type.STRING },
            encryptionRequired: { type: Type.BOOLEAN }
          },
          required: ["field", "classification", "reason", "encryptionRequired"]
        }
      },
      recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["complianceStatus", "riskLevel", "summary", "logicTrace", "phiDetected", "anomalies", "sovereignty", "recommendations"]
  };

  const result = await ai.models.generateContent({
    model,
    contents: scenario,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema
    }
  });

  const decisionData = JSON.parse(result.text);
  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    scenario,
    ...decisionData
  };
}
