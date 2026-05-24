import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const isArmWindows =
  process.platform === "win32" && process.arch === "arm64";

function createPrisma() {
  if (isArmWindows && process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    return {
      prisma: new PrismaClient({ adapter: new PrismaPg(pool) }),
      pool,
    };
  }
  return { prisma: new PrismaClient(), pool: null as Pool | null };
}

const { prisma, pool } = createPrisma();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@weekendplans.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@weekendplans.com",
      password: adminPassword,
      role: "admin",
    },
  });

  console.log("Seed complete. Admin: admin@weekendplans.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool?.end();
  });
