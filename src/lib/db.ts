// src/lib/db.ts
import { PrismaClient, UserRole, UserStatus, type User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'], // Uncomment for detailed Prisma logs
});

export { prisma, UserRole, UserStatus }; // Export enums if they are needed elsewhere directly

export interface RegistrationResult {
  success: boolean;
  user?: User;
  message?: string;
  isPendingApproval?: boolean;
  errorType?: 'email_exists' | 'other';
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}): Promise<RegistrationResult> {
  console.log('[db.ts] registerUser: محاولة تسجيل مستخدم جديد:', userData.email, 'بالدور:', userData.role);
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      console.warn('[db.ts] registerUser: البريد الإلكتروني مسجل بالفعل:', userData.email);
      return { success: false, message: "البريد الإلكتروني مسجل بالفعل.", errorType: 'email_exists' };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    console.log('[db.ts] registerUser: تم تشفير كلمة المرور لـ', userData.email);

    let initialStatus = UserStatus.ACTIVE;
    let isPending = false;

    if (userData.role === UserRole.ENGINEER) {
      const settings = await prisma.systemSettings.findFirst();
      if (settings?.engineerApprovalRequired) {
        initialStatus = UserStatus.PENDING_APPROVAL;
        isPending = true;
        console.log('[db.ts] registerUser: حساب المهندس', userData.email, 'يتطلب موافقة.');
      }
    }

    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        passwordHash: hashedPassword,
        role: userData.role,
        status: initialStatus,
        phone: userData.phone,
        // profileImage will be handled separately if needed
      },
    });
    console.log('[db.ts] registerUser: تم إنشاء المستخدم بنجاح:', newUser.email, 'الحالة:', initialStatus);

    // Log registration
    try {
        await prisma.logEntry.create({
            data: {
                action: 'USER_REGISTRATION',
                level: 'INFO',
                message: `New user registered: ${newUser.email}, Role: ${newUser.role}, Status: ${initialStatus}`,
                userId: newUser.id,
            }
        });
    } catch (logError) {
        console.error("[db.ts] registerUser: Failed to create log entry for registration:", logError);
    }


    return { success: true, user: newUser, isPendingApproval: isPending };
  } catch (error) {
    console.error("[db.ts] registerUser: خطأ أثناء تسجيل المستخدم:", error);
    return { success: false, message: "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.", errorType: 'other' };
  }
}

export interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
  errorType?: 'email_not_found' | 'invalid_password' | 'account_suspended' | 'pending_approval' | 'account_deleted' | 'other';
}

export async function loginUser(email: string, password_input: string): Promise<LoginResult> {
  console.log('[db.ts] loginUser: محاولة تسجيل دخول لـ:', email);
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn('[db.ts] loginUser: المستخدم غير موجود:', email);
      return { success: false, message: "البريد الإلكتروني غير مسجل.", errorType: 'email_not_found' };
    }

    const isPasswordValid = await bcrypt.compare(password_input, user.passwordHash);
    if (!isPasswordValid) {
      console.warn('[db.ts] loginUser: كلمة المرور غير صحيحة لـ:', email);
      return { success: false, message: "كلمة المرور غير صحيحة.", errorType: 'invalid_password' };
    }

    if (user.status === UserStatus.PENDING_APPROVAL) {
      console.warn('[db.ts] loginUser: حساب قيد المراجعة:', email);
      return { success: false, message: "حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه.", errorType: 'pending_approval' };
    }

    if (user.status === UserStatus.SUSPENDED) {
      console.warn('[db.ts] loginUser: حساب موقوف:', email);
      return { success: false, message: "حسابك موقوف. يرجى التواصل مع الإدارة.", errorType: 'account_suspended' };
    }
    
    if (user.status === UserStatus.DELETED) {
      console.warn('[db.ts] loginUser: حساب محذوف:', email);
      return { success: false, message: "هذا الحساب تم حذفه.", errorType: 'account_deleted' };
    }

    if (user.status !== UserStatus.ACTIVE) {
        console.warn('[db.ts] loginUser: حساب غير نشط أو بحالة غير معروفة:', email, 'الحالة:', user.status);
        return { success: false, message: "الحساب غير نشط أو في حالة غير صالحة للدخول.", errorType: 'other' };
    }

    console.log('[db.ts] loginUser: تم تسجيل دخول المستخدم بنجاح:', email);
    // Log login success
     try {
        await prisma.logEntry.create({
            data: {
                action: 'USER_LOGIN_SUCCESS',
                level: 'INFO',
                message: `User logged in successfully: ${user.email}`,
                userId: user.id,
            }
        });
    } catch (logError) {
        console.error("[db.ts] loginUser: Failed to create log entry for login success:", logError);
    }

    return { success: true, user };

  } catch (error) {
    console.error("[db.ts] loginUser: خطأ أثناء تسجيل الدخول:", error);
     // Log login failure due to system error
    try {
        await prisma.logEntry.create({
            data: {
                action: 'USER_LOGIN_FAILURE_SYSTEM_ERROR',
                level: 'ERROR',
                message: `System error during login attempt for ${email}: ${error instanceof Error ? error.message : String(error)}`,
            }
        });
    } catch (logError) {
        console.error("[db.ts] loginUser: Failed to create log entry for login failure:", logError);
    }
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.", errorType: 'other' };
  }
}

// Placeholder for other data access functions based on schema.prisma
// e.g., createProject, getProjectById, etc.
