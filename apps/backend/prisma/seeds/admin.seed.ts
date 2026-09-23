import { PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedAdmin(prisma: PrismaClient): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email) {
    throw new Error("ADMIN_EMAIL is required");
  }

  if (!password) {
    throw new Error("ADMIN_PASSWORD is required");
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: {
      email,
    },

    update: {
      isActive: true,
    },

    create: {
      email,
      password: hashedPassword,

      firstName: "System",
      lastName: "Administrator",

      role: AdminRole.SUPER_ADMIN,

      isActive: true,
    },
  });

  console.log(`✓ Admin seeded: ${admin.email}`);
}
