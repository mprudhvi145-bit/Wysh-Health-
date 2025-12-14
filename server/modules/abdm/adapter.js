
import { FHIRBuilder } from '../../lib/fhir.js';

export const AbdmAdapter = {
  // Translate internal consent to NDHM Consent Artefact
  mapConsentToArtefact(consent, patient, requester) {
    const now = new Date().toISOString();
    
    return {
      consentDetail: {
        schemaVersion: "2.0",
        consentId: consent.consentId || consent.id,
        createdAt: now,
        patient: {
          id: patient.abha?.address || patient.wyshId
        },
        careContexts: [], // To be filled if specific episodes linked
        purpose: {
          code: "CAREMGT",
          text: "Care Management",
          refUri: "http://terminology.hl7.org/CodeSystem/v3-ActReason"
        },
        hiTypes: ["Prescription", "DiagnosticReport", "OPConsultation"],
        permission: {
          accessMode: "VIEW",
          dateRange: {
            from: consent.validFrom?.toISOString() || now,
            to: consent.validTo?.toISOString() || now
          },
          dataEraseAt: consent.validTo?.toISOString() || now,
          frequency: {
            unit: "HOUR",
            value: 1,
            repeats: 0
          }
        },
        requester: {
          name: requester.name,
          identifier: {
            type: "HIU",
            value: "WYSH-HIU-ID", // Sandbox ID
            system: "https://healthid.ndhm.gov.in"
          }
        }
      }
    };
  },

  // Convert internal record to FHIR based on type
  convertRecordToFhir(record, patient, doctor) {
    if (record.type === 'Prescription') {
      return FHIRBuilder.createPrescriptionBundle(patient, doctor, record);
    }
    // Fallback for other types or throw error
    return null;
  }
};
