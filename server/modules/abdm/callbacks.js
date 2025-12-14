
import { log } from '../../lib/logger.js';

export const AbdmCallbackController = {
  // Callback for Consent Request Initialization (HIU Flow)
  async onConsentInit(req, res) {
    const { requestId, timestamp, consentRequest } = req.body;
    log.info("ABDM Callback: Consent Initialized", { requestId, id: consentRequest?.id });
    
    // In a real app, update DB status from 'REQUESTING' to 'REQUESTED'
    res.status(202).send();
  },

  // Callback when Patient grants/denies consent (HIU Flow)
  async onConsentNotify(req, res) {
    const { notification } = req.body;
    log.info("ABDM Callback: Consent Notification", { 
        status: notification.status, 
        consentId: notification.consentId 
    });

    // In a real app, store the Consent Artefact ID and fetch the artefact
    res.status(202).send();
  },

  // Callback for Data Request (HIP Flow - When someone asks US for data)
  async onHealthInformationRequest(req, res) {
    const { transactionId, hiRequest } = req.body;
    log.info("ABDM Callback: Health Info Requested", { transactionId });

    // 1. Verify Consent Artefact Signature
    // 2. Queue job to generate FHIR Bundles
    // 3. Trigger /on-request to Gateway
    res.status(202).send();
  }
};
