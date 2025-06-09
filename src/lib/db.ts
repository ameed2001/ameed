
// src/lib/db.ts
import { MongoClient, ObjectId, type Db, type Collection } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'muhandis_al_hasib_db';

if (!MONGODB_URI) {
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error("CRITICAL: MONGODB_URI environment variable is NOT SET.");
  console.error("Database functionality will be severely impacted or unavailable.");
  console.error("Please ensure MONGODB_URI is defined in your .env file.");
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
} else {
  console.log(`[db.ts] MONGODB_URI is set. Starts with: ${MONGODB_URI.substring(0, MONGODB_URI.indexOf('@') > 0 ? MONGODB_URI.indexOf('@') : 30)}...`);
  if(!MONGODB_DB_NAME){
    console.warn("[db.ts] MONGODB_DB_NAME is not set, using default: ", MONGODB_DB_NAME);
  } else {
    console.log("[db.ts] MONGODB_DB_NAME is set to: ", MONGODB_DB_NAME);
  }
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  if (!MONGODB_URI) {
    // This case is already logged loudly above.
    return { client: null, db: null };
  }

  if (cachedClient && cachedDb) {
    try {
      await cachedClient.db(MONGODB_DB_NAME).command({ ping: 1 });
      // console.log("[db.ts] Using cached MongoDB connection.");
      return { client: cachedClient, db: cachedDb };
    } catch (e) {
      console.warn("[db.ts] Cached MongoDB connection lost, attempting to reconnect.", e);
      cachedClient = null;
      cachedDb = null;
    }
  }

  let client: MongoClient;
  try {
    client = new MongoClient(MONGODB_URI);
  } catch (error) {
    console.error("[db.ts] Error creating MongoClient instance:", error);
    console.error("[db.ts] This often happens if MONGODB_URI is malformed or invalid.");
    return { client: null, db: null };
  }
  
  try {
    console.log("[db.ts] Attempting to connect to MongoDB...");
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    
    cachedClient = client;
    cachedDb = db;
    
    console.log("[db.ts] Successfully connected to MongoDB and database:", MONGODB_DB_NAME);
    return { client, db };
  } catch (error) {
    console.error("[db.ts] Failed to connect to MongoDB:", error);
    // Attempt to close client if it was instantiated but failed to connect fully
    if (client) {
        try {
            await client.close();
            console.log("[db.ts] MongoDB client closed due to connection error.");
        } catch (closeError) {
            console.error("[db.ts] Error closing MongoDB client after connection failure:", closeError);
        }
    }
    cachedClient = null; // Ensure cache is cleared on any connection error
    cachedDb = null;
    return { client: null, db: null };
  }
}

export type UserRole = 'ADMIN' | 'ENGINEER' | 'OWNER' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'DELETED';
export type ProjectStatusType = 'PLANNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
export type TaskStatusType = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

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

export interface SystemSettingsDocument {
  _id?: ObjectId;
  siteName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maxUploadSizeMb: number;
  emailNotificationsEnabled: boolean;
  engineerApprovalRequired: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface LogEntryDocument {
  _id?: ObjectId;
  action: string;
  level: LogLevel;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  userId?: ObjectId | string; 
}

export async function logAction(
  action: string, 
  level: LogLevel, 
  message: string, 
  userId?: ObjectId | string | null, 
  ipAddress?: string, 
  userAgent?: string
): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      console.error('[db.ts] logAction: Database connection not available. Could not log:', {action, level, message, userId});
      return;
    }
    const logsCollection: Collection<LogEntryDocument> = db.collection('logs');
    const logEntry: LogEntryDocument = {
      action,
      level,
      message,
      createdAt: new Date(),
    };
    if (userId) {
        logEntry.userId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    }
    if (ipAddress) logEntry.ipAddress = ipAddress;
    if (userAgent) logEntry.userAgent = userAgent;
    
    await logsCollection.insertOne(logEntry);
  } catch (error) {
    console.error('[db.ts] Failed to log action:', error);
  }
}

export async function getSystemSettings(): Promise<SystemSettingsDocument | null> {
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      console.error('[db.ts] getSystemSettings: Database connection not available.');
      return null;
    }
    const settingsCollection: Collection<SystemSettingsDocument> = db.collection('system_settings');
    let settings = await settingsCollection.findOne({});
    
    if (!settings) {
        console.warn('[db.ts] System settings not found. Creating default settings.');
        const defaultSettingsData: Omit<SystemSettingsDocument, '_id'> = {
            siteName: "المحترف لحساب الكميات",
            defaultLanguage: "ar",
            maintenanceMode: false,
            maxUploadSizeMb: 25,
            emailNotificationsEnabled: true,
            engineerApprovalRequired: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const result = await settingsCollection.insertOne(defaultSettingsData);
        // MongoDB's insertOne mutates the passed object with _id if it's a class instance,
        // but for plain objects, it's better to fetch or construct the settings object with the new _id.
        settings = await settingsCollection.findOne({ _id: result.insertedId });
        if (settings) {
          await logAction('SYSTEM_SETTINGS_CREATED_DEFAULT', 'INFO', 'Default system settings created as none were found.');
        } else {
          console.error('[db.ts] Failed to retrieve default settings after creation.');
          return null;
        }
    }
    return settings;
  } catch (error) {
    console.error('[db.ts] Error fetching/creating system settings:', error);
    await logAction('SYSTEM_SETTINGS_FETCH_ERROR', 'ERROR', `Error fetching system settings: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
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
  console.log('[db.ts] registerUser (MongoDB): Attempting to register user:', email, 'with role:', role);

  try {
    const { db } = await connectToDatabase();
    if (!db) {
      console.error("[db.ts] registerUser: Database connection failed.");
      return { success: false, message: "فشل الاتصال بقاعدة البيانات.", errorType: 'db_error' };
    }
    const usersCollection: Collection<UserDocument> = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.warn('[db.ts] registerUser (MongoDB): Email already exists:', email);
      await logAction('USER_REGISTRATION_FAILURE_EMAIL_EXISTS', 'WARNING', `Registration attempt failed for existing email: ${email}`);
      return { success: false, message: "البريد الإلكتروني مسجل بالفعل.", errorType: 'email_exists' };
    }

    const settings = await getSystemSettings();
    if (!settings) {
      console.error('[db.ts] registerUser (MongoDB): System settings not found, cannot determine approval requirements.');
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
        console.error("[db.ts] registerUser: Failed to insert new user into database.");
        await logAction('USER_REGISTRATION_FAILURE_DB_INSERT', 'ERROR', `Database insert failed for ${email}`);
        return { success: false, message: "فشل إنشاء الحساب في قاعدة البيانات.", errorType: 'db_error' };
    }
    const newUserId = result.insertedId;

    console.log('[db.ts] registerUser (MongoDB): User registered successfully:', email, 'Status:', initialStatus, 'ID:', newUserId.toHexString());
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
    console.error("[db.ts] registerUser (MongoDB): Error during registration for", email, ":", error);
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
  console.log('[db.ts] loginUser (MongoDB): Attempting login for:', email);
  try {
    const { db } = await connectToDatabase();
     if (!db) {
      console.error("[db.ts] loginUser: Database connection failed.");
      return { success: false, message: "فشل الاتصال بقاعدة البيانات.", errorType: 'db_error' };
    }
    const usersCollection: Collection<UserDocument> = db.collection('users');
    
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.warn('[db.ts] loginUser (MongoDB): Email not found:', email);
      await logAction('USER_LOGIN_FAILURE_EMAIL_NOT_FOUND', 'WARNING', `Login attempt for non-existent email: ${email}`);
      return { success: false, message: "البريد الإلكتروني غير مسجل.", errorType: 'email_not_found' };
    }

    const passwordMatch = await bcrypt.compare(password_input, user.passwordHash);
    if (!passwordMatch) {
      console.warn('[db.ts] loginUser (MongoDB): Invalid password for:', email);
      await logAction('USER_LOGIN_FAILURE_INVALID_PASSWORD', 'WARNING', `Invalid password attempt for user: ${email}`, user._id);
      return { success: false, message: "كلمة المرور غير صحيحة.", errorType: 'invalid_password' };
    }
    
    if (user.status === 'PENDING_APPROVAL') {
      console.warn('[db.ts] loginUser (MongoDB): Account pending approval for:', email);
      await logAction('USER_LOGIN_FAILURE_PENDING_APPROVAL', 'WARNING', `Login attempt for pending approval account: ${email}`, user._id);
      return { success: false, message: "حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه.", errorType: 'pending_approval' };
    }

    if (user.status === 'SUSPENDED') {
      console.warn('[db.ts] loginUser (MongoDB): Account suspended for:', email);
      await logAction('USER_LOGIN_FAILURE_SUSPENDED', 'WARNING', `Login attempt for suspended account: ${email}`, user._id);
      return { success: false, message: "حسابك موقوف. يرجى التواصل مع الإدارة.", errorType: 'account_suspended' };
    }
    
    if (user.status === 'DELETED') {
      console.warn('[db.ts] loginUser (MongoDB): Account deleted for:', email);
      await logAction('USER_LOGIN_FAILURE_DELETED', 'WARNING', `Login attempt for deleted account: ${email}`, user._id);
      return { success: false, message: "هذا الحساب تم حذفه.", errorType: 'account_deleted' };
    }

    if (user.status !== 'ACTIVE') {
        console.warn('[db.ts] loginUser (MongoDB): Account not active for:', email, 'Status:', user.status);
        await logAction('USER_LOGIN_FAILURE_NOT_ACTIVE', 'WARNING', `Login attempt for non-active account: ${email} (Status: ${user.status})`, user._id);
        return { success: false, message: "الحساب غير نشط. يرجى التواصل مع الإدارة.", errorType: 'other' };
    }

    console.log('[db.ts] loginUser (MongoDB): Login successful for:', user.email);
    await logAction('USER_LOGIN_SUCCESS', 'INFO', `User logged in successfully: ${user.email}`, user._id);
    
    const { passwordHash, _id, ...userWithoutPasswordAndMongoId } = user;
    return { 
        success: true, 
        user: { ...userWithoutPasswordAndMongoId, id: _id!.toHexString() }
    };

  } catch (error: any) {
    console.error("[db.ts] loginUser (MongoDB): Error during login for", email, ":", error);
    await logAction('USER_LOGIN_FAILURE_DB_ERROR', 'ERROR', `Database error during login attempt for ${email}: ${error.message || String(error)}`);
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.", errorType: 'db_error' };
  }
}

