// src/lib/db.ts
import { ObjectId, type Collection, type MongoDb } from '@/db/connect'; // Use type MongoDb
import bcrypt from 'bcryptjs';
import { connectToDatabase } from "@/db/connect";

// --- Start of User-related types and functions ---
export type UserRole = 'ADMIN' | 'ENGINEER' | 'OWNER' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'DELETED';

export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  profile_image?: string;
  created_at: Date;
  updated_at: Date;
}

export interface RegistrationResult {
  success: boolean;
  userId?: string;
  message?: string;
  isPendingApproval?: boolean;
  errorType?: 'email_exists' | 'db_error' | 'settings_error' | 'other';
}

export interface SystemSettingsDocument {
  _id?: ObjectId;
  site_name: string;
  default_language: string;
  maintenance_mode: boolean;
  max_upload_size_mb: number;
  email_notifications_enabled: boolean;
  engineer_approval_required: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

export interface LogEntryDocument {
  _id?: ObjectId;
  action: string;
  level: LogLevel;
  message: string;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
  user_id?: ObjectId | string;
}


export async function getSystemSettings(): Promise<SystemSettingsDocument | null> {
  console.log('[db.ts] getSystemSettings: Attempting to retrieve system settings.');
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      console.error('[db.ts] getSystemSettings: Database connection failed.');
      return null;
    }
    const settingsCollection: Collection<SystemSettingsDocument> = db.collection('system_settings');
    let settings = await settingsCollection.findOne({});

    if (!settings) {
      console.warn('[db.ts] getSystemSettings: System settings not found in DB. Creating default settings.');
      const defaultSettings: Omit<SystemSettingsDocument, '_id'> = {
        site_name: process.env.SITE_NAME || 'المحترف لحساب الكميات',
        default_language: process.env.DEFAULT_LANGUAGE || 'ar',
        maintenance_mode: false,
        max_upload_size_mb: parseInt(process.env.MAX_UPLOAD_SIZE_MB || '25', 10),
        email_notifications_enabled: true,
        engineer_approval_required: true,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const insertResult = await settingsCollection.insertOne(defaultSettings as any); // Use 'as any' if type issues with Omit
      if (insertResult.insertedId) {
        settings = await settingsCollection.findOne({ _id: insertResult.insertedId });
        if (settings) {
          console.log('[db.ts] getSystemSettings: Default system settings created and retrieved.');
          await logAction('SYSTEM_SETTINGS_CREATED_DEFAULT', 'INFO', 'Default system settings created as none were found.');
        } else {
          console.error('[db.ts] getSystemSettings: Failed to retrieve default settings after creation.');
          return null;
        }
      } else {
        console.error('[db.ts] getSystemSettings: Failed to insert default settings.');
        return null;
      }
    } else {
      console.log('[db.ts] getSystemSettings: System settings retrieved successfully.');
    }
    return settings;
  } catch (error) {
    console.error('[db.ts] getSystemSettings: Error fetching/creating system settings:', error);
    return null;
  }
}


export async function registerUser(userData: {
  name: string;
  email: string;
  password_input: string;
  role: UserRole;
  phone?: string;
}): Promise<RegistrationResult> {
  const { name, email, password_input, role, phone } = userData;
  console.log('[db.ts] registerUser: Attempting to register user:', email, 'with role:', role);

  try {
    const { db } = await connectToDatabase();
    if (!db) {
      console.error("[db.ts] registerUser: Database connection failed.");
      return { success: false, message: "فشل الاتصال بقاعدة البيانات.", errorType: 'db_error' };
    }
    const usersCollection: Collection<UserDocument> = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.warn('[db.ts] registerUser: Email already exists:', email);
      await logAction('USER_REGISTRATION_FAILURE_EMAIL_EXISTS', 'WARNING', `Registration attempt failed for existing email: ${email}`);
      return { success: false, message: "البريد الإلكتروني مسجل بالفعل.", errorType: 'email_exists' };
    }

    const settings = await getSystemSettings();
    if (!settings) {
      console.error('[db.ts] registerUser: System settings not found, cannot determine approval requirements.');
      await logAction('USER_REGISTRATION_FAILURE_SETTINGS_MISSING', 'ERROR', 'System settings not found during user registration.');
      return { success: false, message: "خطأ في إعدادات النظام، لا يمكن إكمال التسجيل.", errorType: 'settings_error' };
    }
    
    let initialStatus: UserStatus = 'ACTIVE';
    if (role === 'ENGINEER' && settings.engineer_approval_required) {
      initialStatus = 'PENDING_APPROVAL';
    }

    const hashedPassword = await bcrypt.hash(password_input, 10);

    const newUserDocument: Omit<UserDocument, '_id'> = {
      name,
      email,
      password_hash: hashedPassword,
      role,
      status: initialStatus,
      phone: phone || undefined,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await usersCollection.insertOne(newUserDocument as any); // Use 'as any' if Omit causes issues
    if (!result.insertedId) {
        console.error("[db.ts] registerUser: Failed to insert new user into database.");
        await logAction('USER_REGISTRATION_FAILURE_DB_INSERT', 'ERROR', `Database insert failed for ${email}`);
        return { success: false, message: "فشل إنشاء الحساب في قاعدة البيانات.", errorType: 'db_error' };
    }
    const newUserId = result.insertedId;

    console.log('[db.ts] registerUser: User registered successfully:', email, 'Status:', initialStatus, 'ID:', newUserId.toHexString());
    await logAction('USER_REGISTRATION_SUCCESS', 'INFO', `User ${email} registered. Role: ${role}, Status: ${initialStatus}. UserID: ${newUserId.toHexString()}`);

    return {
      success: true,
      userId: newUserId.toHexString(),
      isPendingApproval: initialStatus === 'PENDING_APPROVAL',
      message: initialStatus === 'PENDING_APPROVAL'
        ? "تم إنشاء حسابك كمهندس بنجاح. حسابك حاليًا قيد المراجعة والموافقة من قبل الإدارة."
        : "تم إنشاء حسابك بنجاح.",
    };

  } catch (error: any) {
    console.error("[db.ts] registerUser: Error during registration for", email, ":", error);
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
  user?: Omit<UserDocument, 'password_hash'> & { id: string };
  message?: string;
  errorType?: 'email_not_found' | 'invalid_password' | 'account_suspended' | 'pending_approval' | 'account_deleted' | 'db_error' | 'other';
}

export async function loginUser(email: string, password_input: string): Promise<LoginResult> {
  console.log('[db.ts] loginUser: Attempting login for:', email);
  try {
    const { db } = await connectToDatabase();
     if (!db) {
      console.error("[db.ts] loginUser: Database connection failed.");
      return { success: false, message: "فشل الاتصال بقاعدة البيانات.", errorType: 'db_error' };
    }
    const usersCollection: Collection<UserDocument> = db.collection('users');
    
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.warn('[db.ts] loginUser: Email not found:', email);
      await logAction('USER_LOGIN_FAILURE_EMAIL_NOT_FOUND', 'WARNING', `Login attempt for non-existent email: ${email}`);
      return { success: false, message: "البريد الإلكتروني غير مسجل.", errorType: 'email_not_found' };
    }

    const passwordMatch = await bcrypt.compare(password_input, user.password_hash);
    if (!passwordMatch) {
      console.warn('[db.ts] loginUser: Invalid password for:', email);
      await logAction('USER_LOGIN_FAILURE_INVALID_PASSWORD', 'WARNING', `Invalid password attempt for user: ${email}`, user._id?.toHexString());
      return { success: false, message: "كلمة المرور غير صحيحة.", errorType: 'invalid_password' };
    }
    
    if (user.status === 'PENDING_APPROVAL') {
      console.warn('[db.ts] loginUser: Account pending approval for:', email);
      await logAction('USER_LOGIN_FAILURE_PENDING_APPROVAL', 'WARNING', `Login attempt for pending approval account: ${email}`, user._id?.toHexString());
      return { success: false, message: "حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه.", errorType: 'pending_approval' };
    }

    if (user.status === 'SUSPENDED') {
      console.warn('[db.ts] loginUser: Account suspended for:', email);
      await logAction('USER_LOGIN_FAILURE_SUSPENDED', 'WARNING', `Login attempt for suspended account: ${email}`, user._id?.toHexString());
      return { success: false, message: "حسابك موقوف. يرجى التواصل مع الإدارة.", errorType: 'account_suspended' };
    }
    
    if (user.status === 'DELETED') {
      console.warn('[db.ts] loginUser: Account deleted for:', email);
      await logAction('USER_LOGIN_FAILURE_DELETED', 'WARNING', `Login attempt for deleted account: ${email}`, user._id?.toHexString());
      return { success: false, message: "هذا الحساب تم حذفه.", errorType: 'account_deleted' };
    }

    if (user.status !== 'ACTIVE') {
        console.warn('[db.ts] loginUser: Account not active for:', email, 'Status:', user.status);
        await logAction('USER_LOGIN_FAILURE_NOT_ACTIVE', 'WARNING', `Login attempt for non-active account: ${email} (Status: ${user.status})`, user._id?.toHexString());
        return { success: false, message: "الحساب غير نشط. يرجى التواصل مع الإدارة.", errorType: 'other' };
    }

    console.log('[db.ts] loginUser: Login successful for:', user.email);
    await logAction('USER_LOGIN_SUCCESS', 'INFO', `User logged in successfully: ${user.email}`, user._id?.toHexString());
    
    const { password_hash, _id, ...userWithoutPasswordAndMongoId } = user;
    return { 
        success: true, 
        user: { ...userWithoutPasswordAndMongoId, id: _id!.toHexString() }
    };

  } catch (error: any) {
    console.error("[db.ts] loginUser: Error during login for", email, ":", error);
    await logAction('USER_LOGIN_FAILURE_DB_ERROR', 'ERROR', `Database error during login attempt for ${email}: ${error.message || String(error)}`);
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.", errorType: 'db_error' };
  }
}

export async function logAction(
  action: string,
  level: LogLevel,
  message: string,
  userId?: ObjectId | string | null,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  console.log(`[db.ts] logAction: Action: ${action}, Level: ${level}, Message: ${message}, UserID: ${userId || 'System'}`);
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      console.error('[db.ts] logAction: Database connection not available. Log attempt failed.');
      return;
    }
    const logsCollection: Collection<LogEntryDocument> = db.collection('logs');
    
    // Ensure index for efficient sorting if not already created
    // This is an example, you might want to manage indexes separately (e.g., at app startup or via MongoDB Atlas UI)
    try {
        await logsCollection.createIndex({ created_at: -1 });
    } catch(indexError) {
        console.warn("[db.ts] logAction: Could not ensure 'created_at' index on logs. This is non-critical for logging itself.", indexError);
    }

    const logEntry: LogEntryDocument = {
      action,
      level,
      message,
      created_at: new Date(),
    };
    if (userId) {
      try {
        logEntry.user_id = typeof userId === 'string' && ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
      } catch (e) {
        console.warn(`[db.ts] logAction: Could not convert userId string to ObjectId: ${userId}. Storing as string or original type.`, e);
        logEntry.user_id = userId;
      }
    }
    if (ipAddress) logEntry.ip_address = ipAddress;
    if (userAgent) logEntry.user_agent = userAgent;

    await logsCollection.insertOne(logEntry as any); // Use 'as any' if type issues
    console.log(`[db.ts] logAction: Logged successfully for action: ${action}`);
  } catch (error) {
    console.error('[db.ts] logAction: Failed to log action:', error);
  }
}

// Placeholder for other DB functions from the user's NoSQL example
export interface ProjectPhotoDocument {
  _id?: ObjectId;
  url: string;
  caption: string;
  upload_date: Date;
  project_id: ObjectId;
  progress_update_id?: ObjectId;
  task_id?: ObjectId;
}

export interface ProjectTaskDocument {
  _id?: ObjectId;
  name: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  status: string; 
  progress: number;
}

export interface ProjectStageDocument {
  _id?: ObjectId;
  name: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  progress: number;
  tasks: ProjectTaskDocument[];
}

export type ProjectStatusType = 'PLANNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';

export interface ProjectDocument {
  _id?: ObjectId;
  name: string;
  description?: string;
  location?: string;
  start_date?: Date;
  end_date?: Date;
  budget?: number;
  status?: ProjectStatusType;
  overall_progress?: number;
  owner_id?: ObjectId;
  engineers?: ObjectId[];
  created_at?: Date;
  updated_at?: Date;
  stages?: ProjectStageDocument[];
  quantitySummary?: string;
  photos?: ProjectPhotoDocument[];
  comments?: CommentDocument[];
  timelineTasks?: ProjectTaskDocument[];
  linkedOwnerEmail?: string;
}

export interface CommentDocument {
  _id?: ObjectId;
  text: string;
  created_at: Date;
  user_id: ObjectId | string; // Allow string for flexibility if not always ObjectId
  project_id: ObjectId;
  task_id?: ObjectId;
  update_id?: ObjectId;
  user?: string; 
  avatar?: string; 
  dataAiHintAvatar?: string;
  date?: string; 
}
