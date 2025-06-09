
// prisma/seed.ts
import { PrismaClient, UserRole, UserStatus, LogLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // 1. Create SystemSettings
  const settings = await prisma.systemSettings.upsert({
    where: { id: 1 }, // Assuming only one row for settings, and ID is auto-incremented or fixed
    update: {}, // No specific updates needed if it exists
    create: {
      siteName: "المحترف لحساب الكميات",
      defaultLanguage: "ar",
      maintenanceMode: false,
      maxUploadSizeMb: 50, // Example value
      emailNotificationsEnabled: true,
      engineerApprovalRequired: true, // Default to true, engineers need approval
    },
  });
  console.log(`Created/Ensured system settings with id: ${settings.id}`);

  // 2. Create an Admin User
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const adminPassword = await bcrypt.hash('adminpassword', 10); // Change this password
    const adminUser = await prisma.user.create({
      data: {
        name: 'المشرف العام',
        email: adminEmail,
        passwordHash: adminPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        phone: '0000000000', // Optional
      },
    });
    console.log(`Created admin user: ${adminUser.email}`);

    await prisma.logEntry.create({
      data: {
        action: 'SEEDING_ADMIN_USER_CREATED',
        level: LogLevel.INFO,
        message: `Admin user ${adminUser.email} created during database seeding.`,
        userId: adminUser.id,
      },
    });

  } else {
    console.log(`Admin user ${adminEmail} already exists.`);
  }
  
  // 3. Log Seeding Completion
  await prisma.logEntry.create({
    data: {
        action: 'SEEDING_COMPLETED',
        level: LogLevel.INFO,
        message: 'Database seeding process completed successfully.'
    }
  });


  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    await prisma.logEntry.create({
        data: {
            action: 'SEEDING_ERROR',
            level: LogLevel.ERROR,
            message: `Error during database seeding: ${e.message}`
        }
    }).catch(logError => console.error("Error logging seeding error:", logError));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
