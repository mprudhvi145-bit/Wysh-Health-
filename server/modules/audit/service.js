import { AuditRepo } from "./repo.memory.js";

export const AuditService = {
  log(actorId, action, resource, metadata = null) {
    // fire-and-forget; never throw
    try {
      AuditRepo.write({ actorId, action, resource, metadata });
    } catch (err) {
      // swallow errors intentionally to not disrupt main flow
      console.error("Audit logging failed:", err);
    }
  },

  listByActor(actorId) {
    return AuditRepo.listByActor(actorId);
  }
};