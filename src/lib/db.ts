
// src/lib/db.ts
import { PrismaClient, UserRole, UserStatus, ProjectStatus, TaskStatus, LogLevel } from '@prisma/client';
import type { User, Project, ProjectPhoto, ProjectTimelineTask as PrismaProjectTimelineTask, ProjectComment as PrismaProjectComment, SystemSettings, LogEntry as DbLogEntry, UseCase, ProgressUpdate, Document, Comment, Material, QuantityReport, QuantityReportItem, ProjectStage, Task as PrismaTask } from '@prisma/client'; // Added all relevant types
import bcrypt from 'bcryptjs';

// Initialize Prisma Client
const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'], // Optional: Enable Prisma logging
});

// Helper to hash passwords
const saltRounds = 10;
async function hashPassword(password: string): Promise<string> {
  console.log("[DB Prisma hashPassword] Hashing password...");
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("[DB Prisma hashPassword] Password hashed.");
  return hash;
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Re-export enums for easier access in other parts of the application
export { UserRole, UserStatus, ProjectStatus, TaskStatus, LogLevel };

// Re-export types that might be used in Server Actions or components
// Note: Renamed some imported types to avoid conflict if needed, e.g. PrismaTask
export type { User, Project, ProjectPhoto, PrismaProjectTimelineTask, PrismaProjectComment, SystemSettings, DbLogEntry as LogEntry, UseCase, ProgressUpdate, Document, Comment, Material, QuantityReport, QuantityReportItem, ProjectStage, PrismaTask };


// --- User Management Functions ---

export type LoginResult = {
  success: true;
  user: User;
} | {
  success: false;
  message: string;
  errorType?: "email_not_found" | "invalid_password" | "account_suspended" | "pending_approval" | "other";
};


export async function findUserByEmail(email: string): Promise<User | null> {
  const normalizedEmail = email.toLowerCase();
  console.log(`[DB Prisma findUserByEmail] Searching for user with email: ${normalizedEmail}`);
  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (user) {
      console.log(`[DB Prisma findUserByEmail] Found user: ${user.email}, Status: ${user.status}, Role: ${user.role}`);
    } else {
      console.log(`[DB Prisma findUserByEmail] User ${normalizedEmail} not found.`);
    }
    return user;
  } catch (error) {
    console.error(`[DB Prisma findUserByEmail] Error fetching user ${normalizedEmail}:`, error);
    return null;
  }
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  role: UserRole; // Use Prisma Enum UserRole
}): Promise<{ success: boolean; user?: User; message?: string; isPendingApproval?: boolean }> {
  const normalizedEmail = userData.email.toLowerCase();
  console.log(`[DB Prisma registerUser] Attempting registration for email: ${normalizedEmail}, role: ${userData.role}`);

  console.log("[DB Prisma registerUser] Checking for existing user...");
  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    console.log(`[DB Prisma registerUser] Email ${normalizedEmail} already exists.`);
    return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
  }
  console.log("[DB Prisma registerUser] Email is unique. Proceeding with hashing password.");

  const hashedPassword = await hashPassword(userData.password);
  console.log("[DB Prisma registerUser] Password hashed. Fetching system settings...");

  let settings: SystemSettings | null = null;
  try {
    settings = await prisma.systemSettings.findFirst();
    console.log("[DB Prisma registerUser] System settings fetched:", settings);
  } catch (error) {
    console.error("[DB Prisma registerUser] Error fetching system settings:", error);
    // Continue with default engineerApprovalRequired = true if settings fetch fails
    console.log("[DB Prisma registerUser] Defaulting engineerApprovalRequired to true due to error or no settings.");
  }
  const engineerApprovalRequired = settings?.engineerApprovalRequired ?? true;
  console.log(`[DB Prisma registerUser] Engineer approval required: ${engineerApprovalRequired}`);

  const status: UserStatus = (userData.role === UserRole.ENGINEER && engineerApprovalRequired)
    ? UserStatus.PENDING_APPROVAL
    : UserStatus.ACTIVE;
  console.log(`[DB Prisma registerUser] Determined user status: ${status}`);

  try {
    console.log("[DB Prisma registerUser] Attempting to create user in database...");
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        role: userData.role,
        status: status,
        // phone and profileImage are optional and not provided here
      },
    });
    console.log("[DB Prisma registerUser] User created successfully in database:", { email: newUser.email, id: newUser.id });

    console.log("[DB Prisma registerUser] Attempting to create log entry for registration...");
    await createLogEntry({
        action: 'USER_REGISTER',
        level: LogLevel.INFO,
        message: `User ${newUser.email} registered as ${newUser.role}, status: ${status}.`,
        userId: newUser.id
    });
    console.log("[DB Prisma registerUser] Log entry created.");
    const isPending = status === UserStatus.PENDING_APPROVAL;
    return { success: true, user: newUser, message: `تم تسجيل حساب ${newUser.role} بنجاح. الحالة: ${status}`, isPendingApproval: isPending };
  } catch (error: any) {
    console.error("[DB Prisma registerUser] Error creating user in database:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً (database constraint).' };
    }
    return { success: false, message: 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.' };
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const normalizedEmail = email.toLowerCase();
  console.log(`[DB Prisma loginUser] Attempting login for email: ${normalizedEmail}`);

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    console.log(`[DB Prisma loginUser] User ${normalizedEmail} not found after findUserByEmail call.`);
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', errorType: "email_not_found" };
  }
  console.log(`[DB Prisma loginUser] User ${normalizedEmail} found. Status: ${user.status}. Role: ${user.role}. Comparing passwords.`);

  const passwordMatch = await comparePassword(password, user.passwordHash);

  if (!passwordMatch) {
    console.log(`[DB Prisma loginUser] Password mismatch for ${normalizedEmail}.`);
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', errorType: "invalid_password" };
  }

  if (user.status === UserStatus.SUSPENDED) {
    console.log(`[DB Prisma loginUser] Account ${normalizedEmail} is suspended.`);
    return { success: false, message: 'حسابك موقوف. يرجى التواصل مع الإدارة', errorType: "account_suspended" };
  }

  if (user.status === UserStatus.PENDING_APPROVAL) {
    console.log(`[DB Prisma loginUser] Account ${normalizedEmail} is pending approval.`);
    return { success: false, message: 'حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه', errorType: "pending_approval" };
  }

  if (user.status === UserStatus.DELETED) { // Added check for DELETED status
    console.log(`[DB Prisma loginUser] Account ${normalizedEmail} is marked as deleted.`);
    return { success: false, message: 'هذا الحساب تم حذفه.', errorType: "other" };
  }

  console.log(`[DB Prisma loginUser] Login successful for ${user.email}. Creating log entry.`);
  await createLogEntry({
      action: 'USER_LOGIN',
      level: LogLevel.SUCCESS, // Changed from INFO to SUCCESS for login
      message: `User ${user.email} logged in.`,
      userId: user.id
  });
  console.log("[DB Prisma loginUser] Log entry created for login.");
  return { success: true, user };
}

export async function getSystemSettings(): Promise<SystemSettings | null> {
  console.log("[DB Prisma getSystemSettings] Fetching system settings...");
  try {
    const settings = await prisma.systemSettings.findFirst();
    if (!settings) {
        console.warn("[DB Prisma getSystemSettings] No system settings found in database. Consider seeding them.");
    }
    console.log("[DB Prisma getSystemSettings] System settings fetched successfully.");
    return settings;
  } catch (error) {
    console.error("[DB Prisma getSystemSettings] Error fetching system settings:", error);
    return null;
  }
}

export async function createLogEntry(logData: {
  action: string;
  level: LogLevel;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}): Promise<DbLogEntry | null> {
  console.log(`[DB Prisma createLogEntry] Creating log: Action - ${logData.action}, Level - ${logData.level}`);
  try {
    const entry = await prisma.logEntry.create({
      data: {
        action: logData.action,
        level: logData.level,
        message: logData.message,
        ipAddress: logData.ipAddress,
        userAgent: logData.userAgent,
        userId: logData.userId,
        // createdAt is handled by @default(now())
      },
    });
    console.log(`[DB Prisma createLogEntry] Log entry created successfully, ID: ${entry.id}`);
    return entry;
  } catch (error) {
    console.error("[DB Prisma createLogEntry] Error creating log entry:", error);
    return null;
  }
}

// Placeholder for other admin functions
export async function getUsers(adminId: string): Promise<{ success: boolean; users?: User[]; message?: string }> {
    // TODO: Implement actual Prisma query, check admin role
    console.log(`[DB Prisma getUsers] Called by admin: ${adminId}`);
    try {
        const users = await prisma.user.findMany();
        return { success: true, users };
    } catch (error) {
        console.error("[DB Prisma getUsers] Error fetching users:", error);
        return { success: false, message: "Failed to fetch users." };
    }
}

export async function updateUser(adminId: string, userId: string, updates: Partial<User>): Promise<{ success: boolean; user?: User; message?: string }> {
    // TODO: Implement actual Prisma query, check admin role
    console.log(`[DB Prisma updateUser] Admin: ${adminId} updating user: ${userId} with `, updates);
     try {
        const user = await prisma.user.update({ where: { id: userId }, data: updates });
        return { success: true, user };
    } catch (error) {
        console.error(`[DB Prisma updateUser] Error updating user ${userId}:`, error);
        return { success: false, message: "Failed to update user." };
    }
}
export async function deleteUser(adminId: string, userId: string): Promise<{ success: boolean; message?: string }> {
    // TODO: Implement actual Prisma query, check admin role, consider soft delete (status = DELETED)
    console.log(`[DB Prisma deleteUser] Admin: ${adminId} deleting user: ${userId}`);
    try {
        await prisma.user.delete({ where: { id: userId }}); // Or update status to DELETED
        return { success: true, message: "User deleted successfully." };
    } catch (error) {
        console.error(`[DB Prisma deleteUser] Error deleting user ${userId}:`, error);
        return { success: false, message: "Failed to delete user." };
    }
}

export async function approveEngineer(adminId: string, engineerId: string): Promise<{ success: boolean; message?: string }> {
  console.log(`[DB Prisma approveEngineer] Admin: ${adminId} attempting to approve engineer: ${engineerId}`);
  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (!admin || admin.role !== UserRole.ADMIN) {
    return { success: false, message: 'ليست لديك صلاحية الموافقة على الحسابات' };
  }

  const engineer = await prisma.user.findUnique({ where: { id: engineerId } });
  if (!engineer || engineer.role !== UserRole.ENGINEER) {
    return { success: false, message: 'المستخدم غير موجود أو ليس مهندساً' };
  }

  if (engineer.status !== UserStatus.PENDING_APPROVAL) {
    return { success: false, message: 'حساب المهندس ليس في انتظار الموافقة' };
  }

  try {
    await prisma.user.update({
      where: { id: engineerId },
      data: { status: UserStatus.ACTIVE },
    });
    await createLogEntry({
        level: LogLevel.INFO,
        message: `Eng_approve: Admin ${admin.email} approved engineer ${engineer.email}.`,
        userId: admin.id,
        action: 'ENGINEER_APPROVE',
    });
    console.log(`[DB Prisma approveEngineer] Engineer ${engineerId} approved by ${adminId}.`);
    return { success: true, message: 'تمت الموافقة على حساب المهندس بنجاح.' };
  } catch (error) {
    console.error("[DB Prisma approveEngineer] Error approving engineer:", error);
    return { success: false, message: 'حدث خطأ أثناء الموافقة على الحساب.' };
  }
}

export async function suspendUser(adminId: string, userIdToSuspend: string): Promise<{ success: boolean; message?: string }> {
  console.log(`[DB Prisma suspendUser] Admin: ${adminId} attempting to suspend/unsuspend user: ${userIdToSuspend}`);
  // TODO: Add proper admin role check
  const userToSuspend = await prisma.user.findUnique({ where: { id: userIdToSuspend }});
  if (!userToSuspend) return { success: false, message: "المستخدم غير موجود." };
  if (userToSuspend.role === UserRole.ADMIN) return { success: false, message: "لا يمكن تعليق حساب مشرف آخر."};

  const newStatus = userToSuspend.status === UserStatus.SUSPENDED ? UserStatus.ACTIVE : UserStatus.SUSPENDED;
  try {
    await prisma.user.update({
        where: { id: userIdToSuspend },
        data: { status: newStatus },
    });
    const actionMessage = newStatus === UserStatus.SUSPENDED ? "تم تعليق المستخدم" : "تم إلغاء تعليق المستخدم";
    console.log(`[DB Prisma suspendUser] User ${userIdToSuspend} status changed to ${newStatus} by ${adminId}.`);
    return { success: true, message: `${actionMessage} ${userToSuspend.name} بنجاح.`};
  } catch (error) {
     console.error(`[DB Prisma suspendUser] Error changing status for user ${userIdToSuspend}:`, error);
    return { success: false, message: "فشل تغيير حالة المستخدم." };
  }
}


// TODO: Implement project related functions using Prisma
// getProjects, addProject, findProjectById, updateProject, deleteProject

export { prisma };

    