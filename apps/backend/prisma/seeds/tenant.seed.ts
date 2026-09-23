import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedDemoTenant(
  prisma: PrismaClient,
): Promise<void> {
  const email = "admin@demo-invoice.com";
  const password = "Demo@123456";

  const hashedPassword = await bcrypt.hash(password, 12);

  // ---------------------------------------------------------------------------
  // Tenant
  // ---------------------------------------------------------------------------

  const tenant = await prisma.tenant.upsert({
    where: {
      slug: "demo-company",
    },

    update: {
      name: "Demo Company",
      isActive: true,
    },

    create: {
      name: "Demo Company",
      slug: "demo-company",
      isActive: true,
    },
  });

  console.log(`✓ Tenant seeded: ${tenant.name}`);

  // ---------------------------------------------------------------------------
  // Tenant Profile
  // ---------------------------------------------------------------------------

  await prisma.tenantProfile.upsert({
    where: {
      tenantId: tenant.id,
    },

    update: {
      email: "info@demo-company.com",
      phone: "+880 2 12345678",
      mobile: "+880 1700000000",

      website: "https://demo-company.com",
      facebook: "https://facebook.com/demo-company",
      instagram: "https://instagram.com/demo-company",
      linkedin: "https://linkedin.com/company/demo-company",

      address: "House 10, Road 5, Banani",
      city: "Dhaka",
      state: "Dhaka",
      postalCode: "1213",
      country: "Bangladesh",

      businessName: "Demo Company Ltd.",
      taxNumber: "DEMO-TAX-001",
      registrationNumber: "DEMO-REG-001",
    },

    create: {
      tenantId: tenant.id,

      email: "info@demo-company.com",
      phone: "+880 2 12345678",
      mobile: "+880 1700000000",

      website: "https://demo-company.com",
      facebook: "https://facebook.com/demo-company",
      instagram: "https://instagram.com/demo-company",
      linkedin: "https://linkedin.com/company/demo-company",

      address: "House 10, Road 5, Banani",
      city: "Dhaka",
      state: "Dhaka",
      postalCode: "1213",
      country: "Bangladesh",

      businessName: "Demo Company Ltd.",
      taxNumber: "DEMO-TAX-001",
      registrationNumber: "DEMO-REG-001",
    },
  });

  console.log("✓ Tenant profile seeded");

  // ---------------------------------------------------------------------------
  // Tenant Settings
  // ---------------------------------------------------------------------------

  await prisma.tenantSettings.upsert({
    where: {
      tenantId: tenant.id,
    },

    update: {},

    create: {
      tenantId: tenant.id,

      currency: "BDT",
      timezone: "Asia/Dhaka",
      dateFormat: "YYYY-MM-DD",

      invoicePrefix: "INV",
      invoiceNextNumber: 1,

      paymentTermsDays: 30,
    },
  });

  console.log("✓ Tenant settings seeded");

  // ---------------------------------------------------------------------------
  // Owner Role
  // ---------------------------------------------------------------------------

  const role = await prisma.role.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant.id,
        name: "Owner",
      },
    },

    update: {
      description: "Demo company owner",
    },

    create: {
      tenantId: tenant.id,

      name: "Owner",
      description: "Demo company owner",
    },
  });

  console.log(`✓ Role seeded: ${role.name}`);

  // ---------------------------------------------------------------------------
  // Demo User
  // ---------------------------------------------------------------------------

  const user = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email,
      },
    },

    update: {
      firstName: "Demo",
      lastName: "Admin",
      roleId: role.id,
      isActive: true,
    },

    create: {
      tenantId: tenant.id,

      email,
      password: hashedPassword,

      firstName: "Demo",
      lastName: "Admin",

      roleId: role.id,

      isActive: true,
    },
  });

  console.log(`✓ Tenant user seeded: ${user.email}`);

  console.log("");
  console.log("Demo tenant credentials:");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}
