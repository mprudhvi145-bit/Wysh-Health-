
import { log } from '../../lib/logger.js';
import { AbdmCrypto } from '../../lib/abdm_crypto.js';

export const AbdmCallbackController = {
  
  // Middleware-like verification logic can be applied here
  // For sandbox, we log heavily.

  async onConsentInit(req, res) {
    const { requestId, consentRequest } = req.body;
    // const signature = req.headers['authorization'];
    // const isValid = AbdmCrypto.verifySignature(signature, req.body);
    
    log.info("ABDM Callback: Consent Initialized", { requestId, id: consentRequest?.id });
    res.status(200).send();
  },

  async onConsentNotify(req, res) {
    const { notification } = req.body;
    log.info("ABDM Callback: Consent Notification", { 
        status: notification.status, 
        consentId: notification.consentId,
        artefact: notification.consentArtefacts?.[0]
    });
    
    // Logic: Find internal consent by request ID and update status to GRANTED
    res.status(200).send();
  },

  async onHealthInformationRequest(req, res) {
    const { transactionId, hiRequest } = req.body;
    log.info("ABDM Callback: HI Request received (HIP Role)", { transactionId });
    // Logic: Verify consent artefact, generate FHIR bundle, push data
    res.status(200).send();
  },

  async onDataPush(req, res) {
      // HIU Role: Receive encrypted data
      const { transactionId, entries, keyMaterial } = req.body;
      log.info("ABDM Callback: Data Push Received (HIU Role)", { transactionId, count: entries?.length });
      
      // 1. Decrypt (using keyMaterial)
      // 2. Validate FHIR
      // 3. Save to Repo
      
      res.status(200).send();
  }
};
