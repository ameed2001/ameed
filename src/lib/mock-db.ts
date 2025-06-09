// prisma/seed.ts
// This file will be used to seed initial data into the database
// based on the new schema.prisma.
// Content cleared to be re-written.
import { PrismaClient, UserRole, UserStatus, ProjectStatus, TaskStatus, LogLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // TODO: Populate with seed data according to the new schema
  // Example: Create SystemSettings
  const settings = await prisma.systemSettings.upsert({
    where: { id: 1 }, // Assuming only one row for settings
    update: {},
    create: {
      siteName: "المحترف لحساب الكميات (نظام جديد)",
      defaultLanguage: "ar",
      maintenanceMode: false,
      maxUploadSizeMb: 50,
      emailNotificationsEnabled: true,
      engineerApprovalRequired: true,
    },
  });
  console.log(`Created/Ensured system settings with id: ${settings.id}`);
  
  // Example: Create Admin User
  const adminPassword = await bcrypt.hash('adminpass123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin_new@example.com' },
    update: {},
    create: {
      name: 'المشرف العام للنظام الجديد',
      email: 'admin_new@example.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    }
  });
  console.log(`Created admin user: ${adminUser.email}`);


  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });