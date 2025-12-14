
import { randomUUID } from 'crypto';

/**
 * FHIR R4 Generator for Wysh Care
 * Converts internal schema to NDHM compliant FHIR Bundles.
 */
export const FHIRBuilder = {
  createPrescriptionBundle(patient, doctor, prescription) {
    const bundleId = randomUUID();
    const date = new Date().toISOString();

    return {
      resourceType: "Bundle",
      id: bundleId,
      meta: {
        lastUpdated: date,
        profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle"]
      },
      identifier: {
        system: "https://www.wysh.care/bundle",
        value: bundleId
      },
      type: "document",
      timestamp: date,
      entry: [
        // 1. Composition (The Header)
        {
          fullUrl: `Composition/${bundleId}`,
          resource: {
            resourceType: "Composition",
            id: bundleId,
            status: "final",
            type: {
              coding: [{
                system: "http://snomed.info/sct",
                code: "440545006",
                display: "Prescription record"
              }]
            },
            subject: { reference: `Patient/${patient.id}`, display: patient.name },
            author: [{ reference: `Practitioner/${doctor.id}`, display: doctor.name }],
            title: "Prescription Document",
            section: [{
              title: "Medications",
              entry: prescription.items.map((_, i) => ({ reference: `MedicationRequest/${prescription.id}-${i}` }))
            }]
          }
        },
        // 2. Practitioner
        {
          fullUrl: `Practitioner/${doctor.id}`,
          resource: {
            resourceType: "Practitioner",
            id: doctor.id,
            name: [{ text: doctor.name }],
            identifier: [{ system: "https://doctor.ndhm.gov.in", value: doctor.licenseNumber }]
          }
        },
        // 3. Patient
        {
          fullUrl: `Patient/${patient.id}`,
          resource: {
            resourceType: "Patient",
            id: patient.id,
            name: [{ text: patient.name }],
            gender: patient.gender?.toLowerCase() || 'unknown'
          }
        },
        // 4. MedicationRequests
        ...prescription.items.map((item, i) => ({
          fullUrl: `MedicationRequest/${prescription.id}-${i}`,
          resource: {
            resourceType: "MedicationRequest",
            id: `${prescription.id}-${i}`,
            status: "active",
            intent: "order",
            medicationCodeableConcept: {
              text: item.medicine
            },
            dosageInstruction: [{
              text: `${item.dosage}, ${item.frequency} for ${item.duration}`
            }]
          }
        }))
      ]
    };
  }
};
