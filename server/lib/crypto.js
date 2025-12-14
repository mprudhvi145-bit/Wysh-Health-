
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
// In production, these must be loaded from secure env vars
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY_HEX || '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f', 'hex');
const IV_LENGTH = 16;

export const CryptoLib = {
  // Encrypt sensitive text
  encrypt(text) {
    if (!text) return text;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  },

  // Decrypt sensitive text
  decrypt(text) {
    if (!text || !text.includes(':')) return text;
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  },

  // Generate Hash for Integrity Checks (NDHM style signature simulation)
  signArtefact(data) {
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHmac('sha256', ENCRYPTION_KEY).update(stringData).digest('hex');
  },

  // Verify Hash
  verifyArtefact(data, signature) {
    const computed = this.signArtefact(data);
    return computed === signature;
  }
};
