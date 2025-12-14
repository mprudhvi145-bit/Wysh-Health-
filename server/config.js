
// Centralized Server Config
export const config = {
    isProduction: process.env.NODE_ENV === 'production',
    db: {
        url: process.env.DATABASE_URL
    },
    jwtSecret: process.env.JWT_SECRET || 'wysh-secure-dev-key',
    encryptionKey: process.env.ENCRYPTION_KEY_HEX,
    
    // Deployment specific flags
    features: {
        auditLog: true,
        multiTenancy: true,
        abdmSync: process.env.ABDM_SYNC_ENABLED === 'true'
    }
};
