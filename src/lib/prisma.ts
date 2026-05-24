import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const isArmWindows =
  process.platform === "win32" && process.arch === "arm64";

function createPrismaClient() {
  if (isArmWindows && process.env.DATABASE_URL) {
    const pool =
      globalForPrisma.pool ??
      new Pool({ connectionString: process.env.DATABASE_URL });
    if (!globalForPrisma.pool) globalForPrisma.pool = pool;
    return new PrismaClient({
      adapter: new PrismaPg(pool),
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
