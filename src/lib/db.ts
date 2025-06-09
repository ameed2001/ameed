// src/lib/db.ts
// This file will be re-written to use the new Prisma schema.
// Content cleared.
import { PrismaClient, Prisma } from '@prisma/client';
import type { User, UserRole, UserStatus, SystemSettings, LogEntry, LogLevel, Project } from '@prisma/client';
import bcrypt from 'bcryptjs';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma, Prisma };
export type { User, UserRole, UserStatus, SystemSettings, LogEntry, LogLevel, Project };


export interface RegistrationResult {
  success: boolean;
  user?: User;
  message?: string;
  isPendingApproval?: boolean;
  errorType?: 'email_exists' | 'db_error' | 'other';
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password_input: string; 
  role: UserRole; // Use Prisma's UserRole enum
  phone?: string;
}): Promise<RegistrationResult> {
  const { name, email, password_input, role, phone } = userData;
  console.log('[db.ts] registerUser: Attempting to register user:', email, 'with role:', role);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.warn('[db.ts] registerUser: Email already exists:', email);
      await prisma.logEntry.create({
        data: {
          action: 'USER_REGISTRATION_FAILURE_EMAIL_EXISTS',
          level: LogLevel.WARNING,
          message: `Registration attempt failed for existing email: ${email}`,
        },
      });
      return { success: false, message: "البريد الإلكتروني مسجل بالفعل.", errorType: 'email_exists' };
    }

    const settings = await prisma.systemSettings.findFirst();
    if (!settings) {
        console.error('[db.ts] registerUser: System settings not found. Cannot determine engineer approval requirement.');
        // Log critical error
        await prisma.logEntry.create({
            data: {
                action: 'SYSTEM_SETTINGS_MISSING_FOR_REGISTRATION',
                level: LogLevel.ERROR,
                message: 'System settings not found during user registration, cannot proceed.',
            }
        });
        return { success: false, message: "خطأ في إعدادات النظام، لا يمكن إكمال التسجيل.", errorType: 'db_error' };
    }


    let initialStatus = UserStatus.ACTIVE;
    if (role === UserRole.ENGINEER && settings.engineerApprovalRequired) {
      initialStatus = UserStatus.PENDING_APPROVAL;
    }

    const hashedPassword = await bcrypt.hash(password_input, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role,
        status: initialStatus,
        phone,
      },
    });

    console.log('[db.ts] registerUser: User registered successfully:', newUser.email, 'Status:', newUser.status);
    await prisma.logEntry.create({
      data: {
        action: 'USER_REGISTRATION_SUCCESS',
        level: LogLevel.INFO,
        message: `User ${newUser.email} registered. Role: ${newUser.role}, Status: ${newUser.status}.`,
        userId: newUser.id,
      },
    });

    return {
      success: true,
      user: newUser,
      isPendingApproval: initialStatus === UserStatus.PENDING_APPROVAL,
      message: initialStatus === UserStatus.PENDING_APPROVAL
        ? "تم إنشاء حسابك كمهندس بنجاح. حسابك حاليًا قيد المراجعة والموافقة من قبل الإدارة."
        : "تم إنشاء حسابك بنجاح.",
    };

  } catch (error: any) {
    console.error("[db.ts] registerUser: Error during registration for", email, ":", error);
    let userMessage = "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.";
    let errorType: RegistrationResult['errorType'] = 'db_error';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta?.target === 'users_email_key') {
        userMessage = "البريد الإلكتروني مسجل بالفعل.";
        errorType = 'email_exists';
      }
    }
    
    await prisma.logEntry.create({
      data: {
        action: 'USER_REGISTRATION_FAILURE_DB_ERROR',
        level: LogLevel.ERROR,
        message: `Database error during registration attempt for ${email}: ${error.message || String(error)}`,
      },
    });
    return { success: false, message: userMessage, errorType: errorType };
  }
}


export interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
  errorType?: 'email_not_found' | 'invalid_password' | 'account_suspended' | 'pending_approval' | 'account_deleted' | 'db_error' | 'other';
}

export async function loginUser(email: string, password_input: string): Promise<LoginResult> {
  console.log('[db.ts] loginUser: Attempting login for:', email);
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn('[db.ts] loginUser: Email not found:', email);
      return { success: false, message: "البريد الإلكتروني غير مسجل.", errorType: 'email_not_found' };
    }

    const passwordMatch = await bcrypt.compare(password_input, user.passwordHash);
    if (!passwordMatch) {
      console.warn('[db.ts] loginUser: Invalid password for:', email);
      // Log failed login attempt
      await prisma.logEntry.create({
        data: {
          action: 'USER_LOGIN_FAILURE_INVALID_PASSWORD',
          level: LogLevel.WARNING,
          message: `Invalid password attempt for user: ${email}`,
          userId: user.id,
        },
      });
      return { success: false, message: "كلمة المرور غير صحيحة.", errorType: 'invalid_password' };
    }

    if (user.status === UserStatus.PENDING_APPROVAL) {
      console.warn('[db.ts] loginUser: Account pending approval for:', email);
      return { success: false, message: "حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه.", errorType: 'pending_approval' };
    }

    if (user.status === UserStatus.SUSPENDED) {
      console.warn('[db.ts] loginUser: Account suspended for:', email);
      return { success: false, message: "حسابك موقوف. يرجى التواصل مع الإدارة.", errorType: 'account_suspended' };
    }

    if (user.status === UserStatus.DELETED) {
      console.warn('[db.ts] loginUser: Account deleted for:', email);
      return { success: false, message: "هذا الحساب تم حذفه.", errorType: 'account_deleted' };
    }
    
    if (user.status !== UserStatus.ACTIVE) {
        console.warn('[db.ts] loginUser: Account not active for:', email, 'Status:', user.status);
        return { success: false, message: "الحساب غير نشط. يرجى التواصل مع الإدارة.", errorType: 'other' };
    }


    console.log('[db.ts] loginUser: Login successful for:', user.email);
    await prisma.logEntry.create({
      data: {
        action: 'USER_LOGIN_SUCCESS',
        level: LogLevel.INFO,
        message: `User logged in successfully: ${user.email}`,
        userId: user.id,
      },
    });
    return { success: true, user };

  } catch (error: any) {
    console.error("[db.ts] loginUser: Error during login for", email, ":", error);
    await prisma.logEntry.create({
      data: {
        action: 'USER_LOGIN_FAILURE_DB_ERROR',
        level: LogLevel.ERROR,
        message: `Database error during login attempt for ${email}: ${error.message || String(error)}`,
      },
    });
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.", errorType: 'db_error' };
  }
}
