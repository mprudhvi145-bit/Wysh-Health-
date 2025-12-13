import { Repo as MemoryRepo } from "./repo.memory.js";
import { PrismaRepo } from "./repo.prisma.js";

const USE_DB = process.env.USE_DB === "true";

export const Repo = USE_DB ? PrismaRepo : MemoryRepo;