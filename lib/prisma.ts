import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

function getPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (connectionString && (connectionString.includes("neon.tech") || connectionString.includes("pooler"))) {
    let pool = globalForPrisma.pool;
    if (!pool) {
      pool = new Pool({
        connectionString,
        connectionTimeoutMillis: 15000,
        idleTimeoutMillis: 30000,
      });
      if (process.env.NODE_ENV !== "production") globalForPrisma.pool = pool;
    }

    const adapter = new PrismaNeon(pool);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
