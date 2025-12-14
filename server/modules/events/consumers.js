
import { EventBus, EVENTS } from '../../lib/events.js';
import { AIService } from '../ai/service.js';
import { log } from '../../lib/logger.js';

export const initConsumers = () => {
    
    // 1. AI Processing Consumer
    EventBus.on(EVENTS.DOCUMENT_UPLOADED, async ({ documentId, userId }) => {
        log.info(`[Consumer] Processing AI ingestion for doc: ${documentId}`);
        try {
            // Trigger AI Analysis
            // We use a separate context or system user in real apps
            await AIService.ingestDocument(documentId, userId);
            log.info(`[Consumer] AI ingestion complete for doc: ${documentId}`);
        } catch (e) {
            log.error(`[Consumer] AI ingestion failed`, { documentId, error: e.message });
        }
    });

    // 2. Emergency Access Alerts
    EventBus.on(EVENTS.EMERGENCY_ACCESSED, async ({ wyshId, ip }) => {
        log.warn(`[ALERT] Emergency Profile Accessed for ${wyshId} from ${ip}`);
        // In prod: Send SMS/Email to patient
    });

    log.info("✅ Event Consumers Initialized");
};
