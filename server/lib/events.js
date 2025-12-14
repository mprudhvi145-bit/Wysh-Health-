
import EventEmitter from 'events';
import { log } from './logger.js';

class AppEventBus extends EventEmitter {
    constructor() {
        super();
        this.on('error', (err) => {
            log.error('Uncaught Event Error', { error: err.message });
        });
    }

    publish(event, payload) {
        log.info(`[Event] Published: ${event}`);
        this.emit(event, payload);
    }
}

export const EventBus = new AppEventBus();

// Event Constants
export const EVENTS = {
    DOCUMENT_UPLOADED: 'DOCUMENT_UPLOADED',
    CONSENT_GRANTED: 'CONSENT_GRANTED',
    APPOINTMENT_COMPLETED: 'APPOINTMENT_COMPLETED',
    EMERGENCY_ACCESSED: 'EMERGENCY_ACCESSED'
};
