
// prisma/seed.ts
import { PrismaClient, UserRole, UserStatus, ProjectStatus, TaskStatus, LogLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Hash passwords for initial users
  const adminPassword = await bcrypt.hash('adminpass', 10);
  const testOwnerPassword = await bcrypt.hash('test123', 10);
  const testEngineerPassword = await bcrypt.hash('engineerpass', 10);

  // 1. Create System Settings (if not exists)
  let settings = await prisma.systemSettings.findFirst();
  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: {
        siteName: 'المحترف لحساب الكميات',
        defaultLanguage: 'ar',
        maintenanceMode: false,
        maxUploadSizeMB: 25,
        emailNotificationsEnabled: true,
        engineerApprovalRequired: true, // Default to true for testing approval flow
      },
    });
    console.log(`Created system settings with id: ${settings.id}`);
  } else {
    console.log('System settings already exist, id:', settings.id);
    // Optionally update existing settings if needed
    // settings = await prisma.systemSettings.update({
    //   where: { id: settings.id },
    //   data: { engineerApprovalRequired: true },
    // });
    // console.log('Updated system settings.');
  }

  // 2. Create Users
  const usersData = [
    {
      id: '00000000-0000-0000-0000-000000000001', // Fixed UUID for admin
      name: 'مدير النظام',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      profileImage: '/profiles/admin.jpg',
    },
    {
      id: '00000000-0000-0000-0000-000000000002', // Fixed UUID for owner
      name: 'مالك تجريبي',
      email: 'owner@example.com',
      passwordHash: testOwnerPassword,
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
      profileImage: '/profiles/owner.jpg',
    },
    {
      id: '00000000-0000-0000-0000-000000000003', // Fixed UUID for engineer
      name: 'مهندس تجريبي',
      email: 'engineer@example.com',
      passwordHash: testEngineerPassword,
      role: UserRole.ENGINEER,
      // status depends on settings.engineerApprovalRequired
      status: settings.engineerApprovalRequired ? UserStatus.PENDING_APPROVAL : UserStatus.ACTIVE,
      profileImage: '/profiles/engineer.jpg',
    },
     {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'مستخدم عام',
      email: 'general@example.com',
      passwordHash: await bcrypt.hash('generalpass', 10),
      role: UserRole.GENERAL_USER,
      status: UserStatus.ACTIVE,
    },
  ];

  for (const userData of usersData) {
    try {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          // if user exists, update specific fields if necessary, or just ensure it is as defined
          name: userData.name,
          passwordHash: userData.passwordHash, // update password if changed
          role: userData.role,
          status: userData.status,
          profileImage: userData.profileImage,
        },
        create: userData,
      });
      console.log(`Upserted user: ${userData.email}`);
    } catch (e) {
      console.error(`Error upserting user ${userData.email}:`, e);
    }
  }
  
  // 3. Create Projects (and nested data)
  const project1Data = {
    id: 'prj-00000000-0000-0000-0000-000000000001', // Fixed UUID for project
    name: "مشروع فيلا الأحلام",
    description: "بناء فيلا سكنية فاخرة مكونة من طابقين وملحق خارجي.",
    location: "الرياض، حي الياسمين",
    startDate: new Date("2023-03-01"),
    endDate: new Date("2024-09-30"),
    budget: 2500000,
    status: ProjectStatus.IN_PROGRESS,
    overallProgress: 65,
    ownerId: usersData.find(u => u.email === 'owner@example.com')?.id, // Link to owner user
    projectUsers: {
      create: [{ userId: usersData.find(u => u.email === 'engineer@example.com')?.id ?? '', role: 'LEAD_ENGINEER' }]
    },
    stages: {
      create: [
        { 
          name: "التصميم والموافقات", 
          startDate: new Date("2023-03-01"), 
          endDate: new Date("2023-04-15"), 
          progress: 100,
          tasks: {
            create: [
              { name: "إعداد المخططات الأولية", status: TaskStatus.COMPLETED, startDate: new Date("2023-03-01"), endDate: new Date("2023-03-15")},
              { name: "الحصول على التراخيص", status: TaskStatus.COMPLETED, startDate: new Date("2023-03-16"), endDate: new Date("2023-04-15")},
            ]
          }
        },
        { name: "أعمال الحفر والأساسات", startDate: new Date("2023-04-16"), endDate: new Date("2023-06-30"), progress: 100 },
        { name: "الهيكل الخرساني", startDate: new Date("2023-07-01"), endDate: new Date("2023-12-31"), progress: 70 },
        { name: "التشطيبات الداخلية والخارجية", startDate: new Date("2024-01-01"), endDate: new Date("2024-08-30"), progress: 10 },
        { name: "تسليم المشروع", startDate: new Date("2024-09-01"), endDate: new Date("2024-09-30"), progress: 0 },
      ]
    },
    photos: {
      create: [
        { url: "https://placehold.co/600x400.png", caption: "بداية أعمال الحفر", uploadDate: new Date("2023-04-20") },
        { url: "https://placehold.co/600x400.png", caption: "صب سقف الطابق الأول", uploadDate: new Date("2023-09-15") }
      ]
    },
    comments: {
      create: [
        { text: "متى سيتم الانتهاء من أعمال السباكة في الطابق الأول؟", userId: usersData.find(u=>u.email === 'owner@example.com')?.id ?? '', createdAt: new Date("2023-11-05") },
        { text: "جاري العمل عليها حاليًا، من المتوقع الانتهاء خلال أسبوعين.", userId: usersData.find(u=>u.email === 'engineer@example.com')?.id ?? '', createdAt: new Date("2023-11-06") }
      ]
    },
    documents: {
      create: [
        { name: "المخططات الهندسية المعتمدة", url: "/documents/blueprints_v1.pdf", uploadDate: new Date("2023-03-01") },
        { name: "عقد المقاولة", url: "/documents/contract.pdf", uploadDate: new Date("2023-02-20") }
      ]
    }
  };

  try {
    await prisma.project.upsert({
      where: { id: project1Data.id },
      update: {}, // No specific update logic for existing project in this seed, just ensure it exists
      create: project1Data,
    });
    console.log(`Upserted project: ${project1Data.name}`);
  } catch (e) {
      console.error(`Error upserting project ${project1Data.name}: `, e);
  }


  // 4. Create Initial Log Entries
  const logEntry1 = {
    action: 'SYSTEM_SEED',
    level: LogLevel.INFO,
    message: 'تم تشغيل النظام بنجاح وتجهيز البيانات الأولية.',
    userId: usersData.find(u => u.email === 'admin@example.com')?.id, // Link to admin user
  };

  try {
    await prisma.logEntry.create({ data: logEntry1 });
    console.log(`Created initial log entry.`);
  } catch(e) {
      console.error("Error creating initial log entry:", e);
  }

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
