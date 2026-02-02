
import { GoogleGenAI, Type } from "@google/genai";
import { UserRole, DiseaseType, AssessmentResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function performAssessment(
  role: UserRole,
  disease: DiseaseType,
  data: any
): Promise<AssessmentResult> {
  const isDoctor = role === UserRole.DOCTOR;
  const prompt = `
    Conduct a medical assessment for ${disease}. 
    User Role: ${role === UserRole.DOCTOR ? 'Medical Professional' : 'Patient/General Public'}.
    Input Data: ${JSON.stringify(data)}
    
    Requirements:
    - If Patient mode: Use simple, empathetic, and non-technical language.
    - If Doctor mode: Use professional medical terminology, provide differential diagnoses, and suggest specific clinical tests with rationale.
    - Provide a risk level: Low, Moderate, High, or Critical.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      riskLevel: { type: Type.STRING, description: 'One of: Low, Moderate, High, Critical' },
      summary: { type: Type.STRING, description: 'Brief summary of findings' },
      suggestions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: 'Actionable advice'
      },
      ...(isDoctor && {
        differentials: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: 'Potential differential diagnoses'
        },
        furtherTests: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              test: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ['test', 'reason']
          }
        }
      })
    },
    required: ['riskLevel', 'summary', 'suggestions']
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2, // Keep it grounded
    }
  });

  try {
    return JSON.parse(response.text.trim()) as AssessmentResult;
  } catch (err) {
    console.error("Failed to parse AI response", err);
    throw new Error("Assessment failed. Please try again.");
  }
}
