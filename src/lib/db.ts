
// src/lib/db.ts
import { PrismaClient, UserRole as PrismaUserRole, UserStatus as PrismaUserStatus, LogLevel as PrismaLogLevel } from '@prisma/client';
import type { User } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

export { prisma, PrismaUserRole, PrismaUserStatus, PrismaLogLevel };

export interface RegistrationResult {
  success: boolean;
  userId?: string;
  message?: string;
  isPendingApproval?: boolean;
  errorType?: 'email_exists' | 'db_error' | 'other';
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password_input: string; // This name comes from the form/action
  role: 'ADMIN' | 'ENGINEER' | 'OWNER' | 'GENERAL_USER'; // Role string from action
  phone?: string;
}): Promise<RegistrationResult> {
  const { name, email, password_input, role, phone } = userData;
  console.log('[db.ts] registerUser: Calling PostgreSQL function register_user for:', email, 'with role:', role);

  try {
    // The SQL function `register_user` handles password hashing with `crypt()`.
    // It expects `p_role` as `user_role` enum. PostgreSQL should cast from string.
    const result = await prisma.$queryRawUnsafe<[{ register_user: string | null }]> (
      `SELECT register_user($1, $2, $3, $4::user_role, $5);`,
      name,
      email,
      password_input, // Send plain password
      role,
      phone ?? null // Pass null if phone is undefined
    );

    const newUserId = result[0]?.register_user;

    if (newUserId) {
      console.log('[db.ts] registerUser: PostgreSQL function returned new user ID:', newUserId);
      const newUser = await prisma.user.findUnique({ where: { id: newUserId }});
      if (!newUser) {
        console.error('[db.ts] registerUser: Failed to retrieve user details after SQL function call for ID:', newUserId);
        // Log this critical situation if possible, or handle as a severe error
        await prisma.logEntry.create({
            data: {
                action: 'REGISTRATION_USER_FETCH_FAIL',
                level: PrismaLogLevel.ERROR,
                message: `PostgreSQL function register_user returned ID ${newUserId}, but user could not be fetched from DB.`,
                userId: newUserId, // Log the ID we tried to fetch
            }
        });
        return { success: false, message: "فشل في استرداد تفاصيل المستخدم بعد التسجيل.", errorType: 'db_error' };
      }
      // Log successful registration via DB function by the system (userId will be null here or we use a system user id if available)
      // The SQL function itself logs with the new user's ID. This log is for the app layer.
      await prisma.logEntry.create({
            data: {
                action: 'USER_REGISTRATION_DB_FUNC_SUCCESS',
                level: PrismaLogLevel.INFO,
                message: `User ${newUser.email} registered successfully via DB function. Status: ${newUser.status}.`,
                userId: newUser.id, // Use the fetched user's ID
            }
        });
      return {
        success: true,
        userId: newUserId,
        isPendingApproval: newUser.status === PrismaUserStatus.PENDING_APPROVAL,
        message: newUser.status === PrismaUserStatus.PENDING_APPROVAL 
          ? "تم إنشاء حسابك كمهندس بنجاح. حسابك حاليًا قيد المراجعة والموافقة من قبل الإدارة."
          : "تم إنشاء حسابك بنجاح.",
      };
    } else {
      // This means the SQL function `register_user` did not return a UUID.
      // This could be because it raised an exception handled by the catch block,
      // or it completed but returned NULL (which shouldn't happen if it's designed to return UUID on success).
      console.warn('[db.ts] registerUser: PostgreSQL function register_user did not return a user ID. This might be an error caught by the catch block or an unexpected NULL return.');
      // The specific error (like 'Email already registered') should be caught in the catch block.
      // If we reach here, it's an unexpected scenario.
      return { success: false, message: "فشل التسجيل: لم يتم إرجاع معرّف المستخدم من قاعدة البيانات.", errorType: 'db_error' };
    }
  } catch (error: any) {
    console.error("[db.ts] registerUser: Error calling PostgreSQL function register_user for", email, ":", error.message);
    
    let userMessage = "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.";
    let errorType: RegistrationResult['errorType'] = 'db_error';

    // The user's SQL function raises 'Email already registered'
    if (error.message && (error.message.includes('Email already registered') || (error.code === 'P2010' && error.message.includes('Raw query failed.') && error.message.includes('Email already registered')))) {
      userMessage = "البريد الإلكتروني مسجل بالفعل.";
      errorType = 'email_exists';
    }
    
    await prisma.logEntry.create({
        data: {
            action: 'USER_REGISTRATION_DB_FUNC_FAILURE',
            level: PrismaLogLevel.ERROR,
            message: `Failed registration attempt for ${email} via DB func: ${error.message || String(error)}`,
        }
    });
    return { success: false, message: userMessage, errorType: errorType };
  }
}


export interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
  errorType?: 'invalid_credentials' | 'account_suspended' | 'pending_approval' | 'account_deleted' | 'db_error' | 'other';
}

export async function loginUser(email_param: string, password_input: string): Promise<LoginResult> {
  const email = email_param;
  console.log('[db.ts] loginUser: Calling PostgreSQL function login_user for:', email);
  try {
    const result = await prisma.$queryRawUnsafe<User[]>(
      `SELECT * FROM login_user($1, $2);`,
      email,
      password_input
    );

    if (result && result.length > 0) {
      const user = result[0];
      console.log('[db.ts] loginUser: PostgreSQL function login_user returned user:', user.email, 'Status:', user.status);

      // The user's SQL `login_user` function has `AND u.status = 'ACTIVE'`.
      // So, if a user is returned, they are active.
      // Specific messages for other statuses (PENDING_APPROVAL, SUSPENDED) need to be handled
      // if the user was found but was not active. This would require a different SQL approach or a pre-check.

      // For now, if SQL `login_user` returns a user, we assume success and active status.
      await prisma.logEntry.create({
          data: {
              action: 'USER_LOGIN_DB_FUNC_SUCCESS',
              level: PrismaLogLevel.INFO,
              message: `User logged in successfully via DB func: ${user.email}`,
              userId: user.id,
          }
      });
      return { success: true, user };

    } else {
      // SQL function returned no rows. This means:
      // 1. Email not found
      // 2. Password incorrect
      // 3. User found but status was not 'ACTIVE' (due to `AND u.status = 'ACTIVE'` in SQL function)
      console.warn('[db.ts] loginUser: PostgreSQL function login_user returned no user for:', email);
      
      // Attempt to get user to provide more specific feedback if email exists but status is not ACTIVE
      const potentialUser = await prisma.user.findUnique({ where: { email } });
      if (potentialUser) {
        if (potentialUser.status === PrismaUserStatus.PENDING_APPROVAL) {
          return { success: false, message: "حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه.", errorType: 'pending_approval' };
        }
        if (potentialUser.status === PrismaUserStatus.SUSPENDED) {
          return { success: false, message: "حسابك موقوف. يرجى التواصل مع الإدارة.", errorType: 'account_suspended' };
        }
        if (potentialUser.status === PrismaUserStatus.DELETED) {
           return { success: false, message: "هذا الحساب تم حذفه.", errorType: 'account_deleted' };
        }
      }
      // If user doesn't exist or password was wrong for an active user (or user with other unhandled status)
      return { success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة.", errorType: 'invalid_credentials' };
    }

  } catch (error: any) {
    console.error("[db.ts] loginUser: Error calling PostgreSQL function login_user for", email, ":", error);
    // Log this specific error
    await prisma.logEntry.create({
        data: {
            action: 'USER_LOGIN_DB_FUNC_SYS_ERROR',
            level: PrismaLogLevel.ERROR,
            message: `System error during login attempt for ${email} via DB func: ${error.message || String(error)}`,
        }
    });
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.", errorType: 'db_error' };
  }
}
