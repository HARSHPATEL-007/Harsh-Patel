export interface UserContext {
  userId: string;
  role: 'admin' | 'clinician' | 'researcher' | 'auditor';
  organization: string;
}

export interface PHIElement {
  type: string;
  value: string;
  reason: string;
}

export interface Anomaly {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  regulationReference: string;
}

export interface SovereigntyClassification {
  field: string;
  classification: 'Sovereign-Bound' | 'Global-Compute';
  reason: string;
  encryptionRequired: boolean;
}

export interface Decision {
  id: string;
  scenario: string;
  timestamp: string;
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Requires Review';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  logicTrace: string[];
  phiDetected: PHIElement[];
  anomalies: Anomaly[];
  sovereignty: SovereigntyClassification[];
  recommendations: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  details: string;
  complianceFlag?: boolean;
}

export interface Regulation {
  id: string;
  title: string;
  citation: string;
  description: string;
  keyRequirements: string[];
}
