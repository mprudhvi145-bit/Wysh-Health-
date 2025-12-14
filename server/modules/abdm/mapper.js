
/**
 * PURE FUNCTION MAPPER
 * Converts Wysh Internal -> ABDM External
 */
export const AbdmMapper = {
  toConsentRequest(wyshConsent) {
    return {
      requestId: wyshConsent.requestId,
      timestamp: new Date().toISOString(),
      consent: {
        purpose: {
          code: wyshConsent.purposeCode || "CAREMGT",
          refUri: "http://terminology.hl7.org/CodeSystem/v3-ActReason",
          text: wyshConsent.purposeText || "Care Management"
        },
        patient: {
          id: wyshConsent.patientAbhaAddress
        },
        hiu: {
          id: "WYSH-HIU-ID" // Our Sandbox ID
        },
        requester: {
          name: "Dr. Sarah Chen", // Should come from context
          identifier: {
            type: "REGNO",
            value: "MH1001",
            system: "https://www.nmc.org.in"
          }
        },
        hiTypes: ["Prescription", "DiagnosticReport", "OPConsultation"],
        permission: {
          accessMode: "VIEW",
          dateRange: {
            from: wyshConsent.dateFrom,
            to: wyshConsent.dateTo
          },
          dataEraseAt: wyshConsent.dateTo,
          frequency: {
            unit: "HOUR",
            value: 1,
            repeats: 0
          }
        }
      }
    };
  },

  toHealthInformationRequest(transactionId, consentId) {
      return {
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          transactionId: transactionId,
          hiRequest: {
              consent: {
                  id: consentId
              },
              dateRange: {
                  from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days default
                  to: new Date().toISOString()
              },
              dataPushUrl: `${process.env.CLIENT_URL}/api/abdm/callbacks/data/push`,
              keyMaterial: {
                  cryptoAlg: "ECDH",
                  curve: "Curve25519",
                  dhPublicKey: {
                      expiry: new Date(Date.now() + 3600000).toISOString(),
                      parameters: "Curve25519/32byterandomkey",
                      keyValue: "MOCK_PUBLIC_KEY_BASE64" 
                  },
                  nonce: "random_nonce_base64"
              }
          }
      }
  }
};
