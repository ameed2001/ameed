// src/db/users.ts
import { ObjectId, type Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './connect';
import { getSystemSettings } from './settings'; // Assuming getSystemSettings will be moved to settings.ts
import { logAction } from './logs'; // Assuming logAction will be moved to logs.ts

export type UserRole = 'ADMIN' | 'ENGINEER' | 'OWNER' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'DELETED';

export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistrationResult {
  success: boolean;
  userId?: string;
  message?: string;
  isPendingApproval?: boolean;
  errorType?: 'email_exists' | 'db_error' | 'settings_error' | 'other';
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password_input: string;
  role: UserRole; // Expecting uppercase from signupUserAction
  phone?: string;
}): Promise<RegistrationResult> {
  const { name, email, password_input, role, phone } = userData;
  console.log('[db/users.ts] registerUser (MongoDB): Attempting to register user:', email, 'with role:', role);

  try {
    const { db } = await connectToDatabase();
    if (!db) {
      console.error("[db/users.ts] registerUser: Database connection failed.");
      return { success: false, message: "فشل الاتصال بقاعدة البيانات.", errorType: 'db_error' };
    }
    const usersCollection: Collection<UserDocument> = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.warn('[db/users.ts] registerUser (MongoDB): Email already exists:', email);
      await logAction('USER_REGISTRATION_FAILURE_EMAIL_EXISTS', 'WARNING', `Registration attempt failed for existing email: ${email}`);
      return { success: false, message: "البريد الإلكتروني مسجل بالفعل.", errorType: 'email_exists' };
    }

    const settings = await getSystemSettings();
    if (!settings) {
      console.error('[db/users.ts] registerUser (MongoDB): System settings not found, cannot determine approval requirements.');
      await logAction('USER_REGISTRATION_FAILURE_SETTINGS_MISSING', 'ERROR', 'System settings not found during user registration.');
      return { success: false, message: "خطأ في إعدادات النظام، لا يمكن إكمال التسجيل.", errorType: 'settings_error' };
    }

    let initialStatus: UserStatus = 'ACTIVE';
    if (role === 'ENGINEER' && settings.engineerApprovalRequired) {
      initialStatus = 'PENDING_APPROVAL';
    }

    const hashedPassword = await bcrypt.hash(password_input, 10);

    const newUserDocument: Omit<UserDocument, '_id'> = {
      name,
      email,
      passwordHash: hashedPassword,
      role,
      status: initialStatus,
      phone: phone || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUserDocument);
    if (!result.insertedId) {
        console.error("[db/users.ts] registerUser: Failed to insert new user into database.");
        await logAction('USER_REGISTRATION_FAILURE_DB_INSERT', 'ERROR', `Database insert failed for ${email}`);
        return { success: false, message: "فشل إنشاء الحساب في قاعدة البيانات.", errorType: 'db_error' };
    }
    const newUserId = result.insertedId;

    console.log('[db/users.ts] registerUser (MongoDB): User registered successfully:', email, 'Status:', initialStatus, 'ID:', newUserId.toHexString());
    await logAction('USER_REGISTRATION_SUCCESS', 'INFO', `User ${email} registered. Role: ${role}, Status: ${initialStatus}.`, newUserId);

    return {
      success: true,
      userId: newUserId.toHexString(),
      isPendingApproval: initialStatus === 'PENDING_APPROVAL',
      message: initialStatus === 'PENDING_APPROVAL'
        ? "تم إنشاء حسابك كمهندس بنجاح. حسابك حاليًا قيد المراجعة والموافقة من قبل الإدارة."
        : "تم إنشاء حسابك بنجاح.",
    };

  } catch (error: any) {
    console.error("[db/users.ts] registerUser (MongoDB): Error during registration for", email, ":", error);
    let userMessage = "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.";
    let errorType: RegistrationResult['errorType'] = 'db_error';

    if (error.code === 11000) {
        userMessage = "البريد الإلكتروني مسجل بالفعل.";
        errorType = 'email_exists';
    }

    await logAction('USER_REGISTRATION_FAILURE_DB_ERROR', 'ERROR', `Database error during registration attempt for ${email}: ${error.message || String(error)}`);
    return { success: false, message: userMessage, errorType: errorType };
  }
}

export interface LoginResult {
  success: boolean;
  user?: Omit<UserDocument, 'passwordHash'> & { id: string };
  message?: string;
  errorType?: 'email_not_found' | 'invalid_password' | 'account_suspended' | 'pending_approval' | 'account_deleted' | 'db_error' | 'other';
}

export async function loginUser(email: string, password_input: string): Promise<LoginResult> {
  console.log('[db/users.ts] loginUser (MongoDB): Attempting login for:', email);
  try {
    const { db } = await connectToDatabase();
     if (!db) {
      console.error("[db/users.ts] loginUser: Database connection failed.");
      return { success: false, message: "فشل الاتصال بقاعدة البيانات.", errorType: 'db_error' };
    }
    const usersCollection: Collection<UserDocument> = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.warn('[db/users.ts] loginUser (MongoDB): Email not found:', email);
      await logAction('USER_LOGIN_FAILURE_EMAIL_NOT_FOUND', 'WARNING', `Login attempt for non-existent email: ${email}`);
      return { success: false, message: "البريد الإلكتروني غير مسجل.", errorType: 'email_not_found' };
    }

    const passwordMatch = await bcrypt.compare(password_input, user.passwordHash);
    if (!passwordMatch) {
      console.warn('[db/users.ts] loginUser (MongoDB): Invalid password for:\', email);
      await logAction('USER_LOGIN_FAILURE_INVALID_PASSWORD', 'WARNING', `Invalid password attempt for user: ${email}`, user._id);
      return { success: false, message: "كلمة المرور غير صحيحة.", errorType: 'invalid_password' };
    }

    if (user.status === 'PENDING_APPROVAL') {
      console.warn('[db/users.ts] loginUser (MongoDB): Account pending approval for:\', email);
      await logAction('USER_LOGIN_FAILURE_PENDING_APPROVAL', 'WARNING', `Login attempt for pending approval account: ${email}`, user._id);
      return { success: false, message: "حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه.", errorType: 'pending_approval' };
    }

    if (user.status === 'SUSPENDED') {
      console.warn('[db/users.ts] loginUser (MongoDB): Account suspended for:\', email);
      await logAction('USER_LOGIN_FAILURE_SUSPENDED', 'WARNING', `Login attempt for suspended account: ${email}`, user._id);
      return { success: false, message: "حسابك موقوف. يرجى التواصل مع الإدارة.", errorType: 'account_suspended' };
    }

    if (user.status === 'DELETED') {
      console.warn('[db/users.ts] loginUser (MongoDB): Account deleted for:\', email);
      await logAction('USER_LOGIN_FAILURE_DELETED', 'WARNING', `Login attempt for deleted account: ${email}`, user._id);
      return { success: false, message: "هذا الحساب تم حذفه.", errorType: 'account_deleted' };
    }

    if (user.status !== 'ACTIVE') {
        console.warn('[db/users.ts] loginUser (MongoDB): Account not active for:\', email, \'Status:\', user.status);
        await logAction('USER_LOGIN_FAILURE_NOT_ACTIVE', 'WARNING', `Login attempt for non-active account: ${email} (Status: ${user.status})`, user._id);
        return { success: false, message: "الحساب غير نشط. يرجى التواصل مع الإدارة.", errorType: 'other' };
    }

    console.log('[db/users.ts] loginUser (MongoDB): Login successful for:\', user.email);
    await logAction('USER_LOGIN_SUCCESS', 'INFO', `User logged in successfully: ${user.email}`, user._id);

    const { passwordHash, _id, ...userWithoutPasswordAndMongoId } = user;
    return {
        success: true,
        user: { ...userWithoutPasswordAndMongoId, id: _id!.toHexString() }
    };

  } catch (error: any) {
    console.error("[db/users.ts] loginUser (MongoDB): Error during login for", email, ":", error);
    await logAction('USER_LOGIN_FAILURE_DB_ERROR', 'ERROR', `Database error during login attempt for ${email}: ${error.message || String(error)}`);
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.", errorType: 'db_error' };
  }
}
