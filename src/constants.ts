import { Regulation } from './types';

export const HIPAA_REGULATIONS: Regulation[] = [
  {
    id: 'privacy-rule',
    title: 'Privacy Rule',
    citation: '45 CFR § 164.502',
    description: 'Standards for the use and disclosure of Protected Health Information (PHI).',
    keyRequirements: [
      'PHI may not be used or disclosed except as permitted or required.',
      'Minimum Necessary standard applies to most uses and disclosures.',
      'Individual authorization required for non-routine uses.'
    ]
  },
  {
    id: 'security-rule',
    title: 'Security Rule',
    citation: '45 CFR § 164.308',
    description: 'Administrative, physical, and technical safeguards to ensure the confidentiality, integrity, and security of ePHI.',
    keyRequirements: [
      'Risk analysis and management.',
      'Access controls and authentication.',
      'Encryption and decryption of ePHI.'
    ]
  },
  {
    id: 'breach-notification',
    title: 'Breach Notification Rule',
    citation: '45 CFR § 164.404',
    description: 'Requirements for notifying individuals, the HHS, and sometimes the media following a breach of unsecured PHI.',
    keyRequirements: [
      'Notification within 60 days of discovery.',
      'Content of notification must include specific elements.',
      'Annual reporting for smaller breaches.'
    ]
  },
  {
    id: 'authorization',
    title: 'Authorization',
    citation: '45 CFR § 164.508',
    description: 'Specific requirements for valid authorizations to use or disclose PHI for purposes other than treatment, payment, or healthcare operations.',
    keyRequirements: [
      'Must be in plain language.',
      'Must contain specific core elements (description of PHI, persons authorized, expiration, etc.).',
      'Right to revoke must be stated.'
    ]
  },
  {
    id: 'minimum-necessary',
    title: 'Minimum Necessary',
    citation: '45 CFR § 164.502(b)',
    description: 'The requirement that covered entities take reasonable steps to limit PHI to the minimum necessary to accomplish the intended purpose.',
    keyRequirements: [
      'Applies to internal uses and external disclosures.',
      'Does not apply to disclosures for treatment.',
      'Requires policies and procedures to identify necessary PHI.'
    ]
  }
];

export const EXAMPLE_SCENARIOS = [
  {
    title: "Cloud Migration of Patient Records",
    scenario: "A hospital is migrating 50,000 patient records (including names, DOBs, and diagnoses) from an on-premise server to a public cloud provider's 'Global-Compute' region. The data is encrypted at rest but the hospital has not signed a BAA with the cloud provider. Access is granted to all hospital IT staff regardless of their role."
  },
  {
    title: "AI Model Training on De-identified Data",
    scenario: "A research team wants to train a new oncology AI model using 10,000 patient records. They have removed names and SSNs but kept zip codes, full dates of service, and rare disease codes. The data is being processed in a Sovereign Cloud region within the same jurisdiction as the patients."
  },
  {
    title: "Emergency Telehealth Consultation",
    scenario: "During a natural disaster, a clinician uses a non-HIPAA compliant consumer messaging app to send a photo of a patient's wound and their MRN to a specialist for immediate consultation. The clinician documents the emergency nature of the disclosure in the patient's chart later that day."
  }
];
