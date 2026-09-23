import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { seedAdmin } from "./seeds/admin.seed";
import { seedDemoTenant } from "./seeds/tenant.seed";


const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  await seedAdmin(prisma);

  await seedDemoTenant(prisma);

  console.log("\n✅ Database seed completed");
}

main()
  .catch((error) => {
    console.error("\n❌ Database seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
