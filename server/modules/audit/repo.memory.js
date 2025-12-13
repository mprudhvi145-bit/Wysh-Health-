import { randomUUID } from 'crypto';

const memAudit = [];

export const AuditRepo = {
  write(record) {
    const entry = {
      id: randomUUID(),
      createdAt: new Date(),
      ...record,
    };
    memAudit.push(entry);
    // Console log for immediate visibility during development
    console.log(`[AUDIT] ${entry.createdAt.toISOString()} | ${record.action} | ${record.resource} | ${record.actorId}`);
  },

  listByActor(actorId) {
    return memAudit.filter(a => a.actorId === actorId).sort((a, b) => b.createdAt - a.createdAt);
  },
};