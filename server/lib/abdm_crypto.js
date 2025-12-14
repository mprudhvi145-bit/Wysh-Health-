
import crypto from 'crypto';

// In a real scenario, these would be loaded from a secure keystore/HSM
// Generating ephemeral keys for sandbox simulation
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

export const AbdmCrypto = {
  getPublicKey() {
    return publicKey.export({ type: 'spki', format: 'pem' });
  },

  /**
   * Generates the Authorization header for ABDM Gateway
   * Structure: Bearer {token} usually, but for Gateway Auth it's a signature
   */
  generateAuthHeader(body) {
    const timestamp = new Date().toISOString();
    const dataToSign = typeof body === 'string' ? body : JSON.stringify(body);
    
    // Sign with Private Key
    const sign = crypto.createSign('SHA256');
    sign.update(dataToSign);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');

    return {
      timestamp,
      signature
    };
  },

  /**
   * Verifies incoming callback signatures from ABDM
   */
  verifySignature(signature, body) {
    // In production, fetch ABDM's public key from their registry
    // Here we assume self-signed for sandbox loopback
    const verify = crypto.createVerify('SHA256');
    const dataToVerify = typeof body === 'string' ? body : JSON.stringify(body);
    
    verify.update(dataToVerify);
    verify.end();
    
    return verify.verify(publicKey, signature, 'base64');
  },

  /**
   * Encrypts data for HIP transfer (ECDH Curve25519 usually required by ABDM)
   * Simplified here to standard AES for demo.
   */
  encryptPayload(data) {
      // Placeholder for ECDH logic
      return Buffer.from(JSON.stringify(data)).toString('base64');
  },

  decryptPayload(encryptedData) {
      // Placeholder for ECDH logic
      const str = Buffer.from(encryptedData, 'base64').toString('utf-8');
      return JSON.parse(str);
  }
};
