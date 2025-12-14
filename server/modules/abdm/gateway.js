
import { AbdmCrypto } from '../../lib/abdm_crypto.js';
import { log } from '../../lib/logger.js';

const GATEWAY_URL = process.env.ABDM_GATEWAY_URL || 'https://dev.abdm.gov.in/gateway';

export const AbdmGateway = {
  async post(path, body) {
    const { timestamp, signature } = AbdmCrypto.generateAuthHeader(body);
    
    // Simulate Network Call
    log.info(`[ABDM-GATEWAY] POST ${path}`, { timestamp });
    
    // In production, use axios/fetch:
    /*
    const response = await fetch(`${GATEWAY_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CM-ID': 'sbx', // Consent Manager ID
            'Authorization': `Bearer ${signature}`, // Simplified for Sandbox
            'X-HIU-ID': 'WYSH-HIU-ID',
            'X-Request-ID': body.requestId
        },
        body: JSON.stringify(body)
    });
    */

    // MOCK RESPONSE
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ status: 'ACK', error: null });
        }, 500);
    });
  }
};
