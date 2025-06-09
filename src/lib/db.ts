
// src/lib/db.ts
import { PrismaClient, UserRole, UserStatus, LogLevel } from '@prisma/client';
import type { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

export { prisma, UserRole, UserStatus, LogLevel };

export interface RegistrationResult {
  success: boolean;
  user?: User;
  message?: string;
  isPendingApproval?: boolean;
  errorType?: 'email_exists' | 'system_settings_fetch_error' | 'other';
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string; // Corrected: Changed from password_input to password
  role: UserRole;
  phone?: string;
}): Promise<RegistrationResult> {
  const { name, email, password, role, phone } = userData; // Corrected: Destructure password directly
  console.log('[db.ts] registerUser: Attempting to register new user:', email, 'with role:', role);
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.warn('[db.ts] registerUser: Email already registered:', email);
      return { success: false, message: "البريد الإلكتروني مسجل بالفعل.", errorType: 'email_exists' };
    }
    console.log('[db.ts] registerUser: Email check passed for', email);

    const hashedPassword = await bcrypt.hash(password, 10); // Corrected: Use password directly
    console.log('[db.ts] registerUser: Password hashed for', email);

    let initialStatus = UserStatus.ACTIVE;
    let isPending = false;
    let engineerApprovalRequired = true; 

    try {
        const settings = await prisma.systemSettings.findFirst();
        if (settings) {
            engineerApprovalRequired = settings.engineerApprovalRequired;
            console.log('[db.ts] registerUser: Fetched system settings. Approval required:', engineerApprovalRequired);
        } else {
            console.warn('[db.ts] registerUser: SystemSettings not found. Defaulting engineerApprovalRequired to true.');
            // Log this critical situation
             await prisma.logEntry.create({
                data: {
                    action: 'SYSTEM_SETTINGS_FETCH_FAILURE',
                    level: LogLevel.ERROR,
                    message: `SystemSettings not found during registration for ${email}. Defaulted engineerApprovalRequired to true.`,
                }
            });
            // For the registration flow, we might want to return an error here or proceed with default.
            // Proceeding with default true for now, but this indicates a setup issue.
             return { success: false, message: "خطأ في إعدادات النظام. يرجى التواصل مع الإدارة.", errorType: 'system_settings_fetch_error' };
        }
    } catch (settingsError) {
        console.error('[db.ts] registerUser: Error fetching SystemSettings:', settingsError);
        await prisma.logEntry.create({
            data: {
                action: 'SYSTEM_SETTINGS_FETCH_FAILURE',
                level: LogLevel.ERROR,
                message: `Error fetching SystemSettings during registration for ${email}: ${settingsError instanceof Error ? settingsError.message : String(settingsError)}`,
            }
        });
        return { success: false, message: "خطأ في قراءة إعدادات النظام. يرجى التواصل مع الإدارة.", errorType: 'system_settings_fetch_error' };
    }

    if (role === UserRole.ENGINEER) {
      if (engineerApprovalRequired) {
        initialStatus = UserStatus.PENDING_APPROVAL;
        isPending = true;
        console.log('[db.ts] registerUser: Engineer account', email, 'requires approval.');
      } else {
        console.log('[db.ts] registerUser: Engineer account', email, 'does not require approval.');
      }
    }

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
    console.log('[db.ts] registerUser: User created successfully:', email, 'Status:', initialStatus);

    await prisma.logEntry.create({
        data: {
            action: 'USER_REGISTRATION',
            level: LogLevel.INFO,
            message: `New user registered: ${newUser.email}, Role: ${newUser.role}, Status: ${initialStatus}`,
            userId: newUser.id,
        }
    });

    return { success: true, user: newUser, isPendingApproval: isPending };
  } catch (error) {
    console.error("[db.ts] registerUser: Error during user registration for", email, ":", error);
    await prisma.logEntry.create({
        data: {
            action: 'USER_REGISTRATION_FAILURE',
            level: LogLevel.ERROR,
            message: `Failed registration attempt for ${email}: ${error instanceof Error ? error.message : String(error)}`,
        }
    });
    return { success: false, message: "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.", errorType: 'other' };
  }
}

export interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
  errorType?: 'email_not_found' | 'invalid_password' | 'account_suspended' | 'pending_approval' | 'account_deleted' | 'other';
}

export async function loginUser(email_param: string, password_input: string): Promise<LoginResult> {
  const email = email_param;
  console.log('[db.ts] loginUser: Attempting login for:', email);
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn('[db.ts] loginUser: User not found:', email);
      return { success: false, message: "البريد الإلكتروني غير مسجل.", errorType: 'email_not_found' };
    }

    const isPasswordValid = await bcrypt.compare(password_input, user.passwordHash);
    if (!isPasswordValid) {
      console.warn('[db.ts] loginUser: Invalid password for:', email);
      return { success: false, message: "كلمة المرور غير صحيحة.", errorType: 'invalid_password' };
    }

    if (user.status === UserStatus.PENDING_APPROVAL) {
      console.warn('[db.ts] loginUser: Account pending approval:', email);
      return { success: false, message: "حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه.", errorType: 'pending_approval' };
    }

    if (user.status === UserStatus.SUSPENDED) {
      console.warn('[db.ts] loginUser: Account suspended:', email);
      return { success: false, message: "حسابك موقوف. يرجى التواصل مع الإدارة.", errorType: 'account_suspended' };
    }
    
    if (user.status === UserStatus.DELETED) {
      console.warn('[db.ts] loginUser: Account deleted:', email);
      return { success: false, message: "هذا الحساب تم حذفه.", errorType: 'account_deleted' };
    }

    if (user.status !== UserStatus.ACTIVE) {
        console.warn('[db.ts] loginUser: Account not active or invalid status:', email, 'Status:', user.status);
        return { success: false, message: "الحساب غير نشط أو في حالة غير صالحة للدخول.", errorType: 'other' };
    }

    console.log('[db.ts] loginUser: User logged in successfully:', email);
    await prisma.logEntry.create({
        data: {
            action: 'USER_LOGIN_SUCCESS',
            level: LogLevel.INFO,
            message: `User logged in successfully: ${user.email}`,
            userId: user.id,
        }
    });

    return { success: true, user };

  } catch (error) {
    console.error("[db.ts] loginUser: Error during login for", email, ":", error);
    await prisma.logEntry.create({
        data: {
            action: 'USER_LOGIN_FAILURE_SYSTEM_ERROR',
            level: LogLevel.ERROR,
            message: `System error during login attempt for ${email}: ${error instanceof Error ? error.message : String(error)}`,
        }
    });
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.", errorType: 'other' };
  }
}
