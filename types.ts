
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR'
}

export enum DiseaseType {
  DIABETES = 'DIABETES',
  HYPERTENSION = 'HYPERTENSION'
}

export interface PatientProfile {
  age: string;
  gender: string;
  height: string;
  weight: string;
  symptoms: string[];
  lifestyle: string;
}

export interface ClinicalData {
  hba1c?: string;
  glucose?: string;
  bloodPressureSys?: string;
  bloodPressureDia?: string;
  lipidProfile?: string;
  history?: string;
}

export interface AssessmentResult {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  summary: string;
  suggestions: string[];
  differentials?: string[];
  furtherTests?: {
    test: string;
    reason: string;
  }[];
}
