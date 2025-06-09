
// src/lib/db.ts
import { PrismaClient, UserRole, UserStatus, ProjectStatus, TaskStatus, LogLevel } from '@prisma/client';
import type { User, Project, ProjectPhoto, ProjectTimelineTask, ProjectComment, SystemSettings, LogEntry as DbLogEntry, UseCase } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Initialize Prisma Client
const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'], // Optional: Enable Prisma logging
});

// Helper to hash passwords
const saltRounds = 10;
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Re-export enums for easier access in other parts of the application
export { UserRole, UserStatus, ProjectStatus, TaskStatus, LogLevel };

// Re-export types that might be used in Server Actions or components
export type { User, Project, ProjectPhoto, ProjectTimelineTask, ProjectComment, SystemSettings, DbLogEntry as LogEntry, UseCase };


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
  console.log(`[DB Prisma] Searching for user with email: ${normalizedEmail}`);
  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (user) {
      console.log(`[DB Prisma] Found user: ${user.email}, Status: ${user.status}, Role: ${user.role}`);
    } else {
      console.log(`[DB Prisma] User ${normalizedEmail} not found.`);
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
  role: 'ENGINEER' | 'OWNER'; // Prisma Enum values
}): Promise<{ success: boolean; user?: User; message?: string }> {
  const normalizedEmail = userData.email.toLowerCase();
  console.log(`[DB Prisma] Attempting registration for email: ${normalizedEmail}, role: ${userData.role}`);

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    console.log(`[DB Prisma] Email ${normalizedEmail} already exists.`);
    return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
  }

  const hashedPassword = await hashPassword(userData.password);
  
  let settings: SystemSettings | null = null;
  try {
    settings = await prisma.systemSettings.findFirst();
  } catch (error) {
    console.error("[DB Prisma registerUser] Error fetching system settings:", error);
    // Continue with default engineerApprovalRequired = true if settings fetch fails
  }
  const engineerApprovalRequired = settings?.engineerApprovalRequired ?? true;

  const status: UserStatus = (userData.role === UserRole.ENGINEER && engineerApprovalRequired)
    ? UserStatus.PENDING_APPROVAL
    : UserStatus.ACTIVE;

  try {
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: normalizedEmail,
        passwordHash: hashedPassword, // Ensure your schema uses passwordHash
        role: userData.role, // This should align with UserRole enum (e.g., UserRole.ENGINEER)
        status: status,
      },
    });

    console.log(`[DB Prisma] Added new user:`, { email: newUser.email, role: newUser.role, status: newUser.status, id: newUser.id });
    // Optionally log this registration event to LogEntry table
    await createLogEntry({ 
        action: 'USER_REGISTER', 
        level: LogLevel.INFO, 
        message: `User ${newUser.email} registered as ${newUser.role}, status: ${status}.`,
        userId: newUser.id 
    });
    return { success: true, user: newUser, message: `تم تسجيل حساب ${newUser.role} بنجاح. الحالة: ${status}` };
  } catch (error: any) {
    console.error("[DB Prisma registerUser] Error creating user:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً (database constraint).' };
    }
    return { success: false, message: 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.' };
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const normalizedEmail = email.toLowerCase();
  console.log(`[DB Prisma] Attempting login for email: ${normalizedEmail}`);

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    console.log(`[DB Prisma] User ${normalizedEmail} not found after findUserByEmail call.`);
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', errorType: "email_not_found" };
  }
  console.log(`[DB Prisma] User ${normalizedEmail} found. Status: ${user.status}. Role: ${user.role}. Comparing passwords.`);
  
  const passwordMatch = await comparePassword(password, user.passwordHash);

  if (!passwordMatch) {
    console.log(`[DB Prisma] Password mismatch for ${normalizedEmail}.`);
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', errorType: "invalid_password" };
  }

  if (user.status === UserStatus.SUSPENDED) {
    console.log(`[DB Prisma] Account ${normalizedEmail} is suspended.`);
    return { success: false, message: 'حسابك موقوف. يرجى التواصل مع الإدارة', errorType: "account_suspended" };
  }

  if (user.status === UserStatus.PENDING_APPROVAL) {
    console.log(`[DB Prisma] Account ${normalizedEmail} is pending approval.`);
    return { success: false, message: 'حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه', errorType: "pending_approval" };
  }
  
  if (user.status === UserStatus.DELETED) {
    console.log(`[DB Prisma] Account ${normalizedEmail} is marked as deleted.`);
    return { success: false, message: 'هذا الحساب تم حذفه.', errorType: "other" };
  }

  console.log(`[DB Prisma] Login successful for ${user.email}.`);
  await createLogEntry({ 
      action: 'USER_LOGIN', 
      level: LogLevel.SUCCESS, 
      message: `User ${user.email} logged in.`,
      userId: user.id 
  });
  return { success: true, user };
}

export async function getSystemSettings(): Promise<SystemSettings | null> {
  try {
    const settings = await prisma.systemSettings.findFirst();
    if (!settings) {
        console.warn("[DB Prisma getSystemSettings] No system settings found in database. Consider seeding them.");
        // Optionally create default settings if none exist
        // return await prisma.systemSettings.create({ data: { siteName: "Default Site", ... }});
    }
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
  try {
    const entry = await prisma.logEntry.create({
      data: {
        action: logData.action,
        level: logData.level,
        message: logData.message,
        ipAddress: logData.ipAddress,
        userAgent: logData.userAgent,
        userId: logData.userId,
      },
    });
    return entry;
  } catch (error) {
    console.error("[DB Prisma createLogEntry] Error creating log entry:", error);
    return null;
  }
}

// TODO: Implement other data access functions using Prisma:
// approveEngineer, getPendingEngineers, updateUser, deleteUser, getUsers, suspendUser
// getProjects, addProject, findProjectById, updateProject, deleteProject

export { prisma };
