import { randomUUID } from 'crypto';
import { log } from '../../lib/logger.js';

const memAudit = [];

export const AuditRepo = {
  write(record) {
    const entry = {
      id: randomUUID(),
      createdAt: new Date(),
      ...record,
    };
    memAudit.push(entry);
    // Log to standard out via structured logger for persistence/shipping
    log.info("Audit Log", {
        type: "AUDIT_EVENT",
        actorId: record.actorId,
        action: record.action,
        resource: record.resource,
        metadata: record.metadata || {}
    });
  },

  listByActor(actorId) {
    return memAudit.filter(a => a.actorId === actorId).sort((a, b) => b.createdAt - a.createdAt);
  },
};