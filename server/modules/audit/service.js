import { AuditRepo } from "./repo.memory.js";

export const AuditService = {
  log(actorId, action, resource) {
    // fire-and-forget; never throw
    try {
      AuditRepo.write({ actorId, action, resource });
    } catch (err) {
      // swallow errors intentionally to not disrupt main flow
      console.error("Audit logging failed:", err);
    }
  },

  listByActor(actorId) {
    return AuditRepo.listByActor(actorId);
  }
};