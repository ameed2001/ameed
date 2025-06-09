
// src/lib/db.ts
import { MongoClient, ObjectId, type Db, type Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import type { z } from 'zod';

// Define MongoDB URI and Database Name from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'construction_management_nosql';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}
if (!MONGODB_DB_NAME) {
  throw new Error('Please define the MONGODB_DB_NAME environment variable inside .env');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    try {
      // Ping the database to check if connection is still alive
      await cachedClient.db(MONGODB_DB_NAME).command({ ping: 1 });
      return { client: cachedClient, db: cachedDb };
    } catch (e) {
      console.warn("MongoDB connection lost, attempting to reconnect.", e);
      cachedClient = null;
      cachedDb = null;
    }
  }

  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    
    cachedClient = client;
    cachedDb = db;
    
    console.log("Successfully connected to MongoDB.");
    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

// Define User Roles and Statuses (as strings for MongoDB)
export type UserRole = 'ADMIN' | 'ENGINEER' | 'OWNER' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'DELETED';
export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';


// Define interfaces for your MongoDB documents
export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string; // Renamed from password_hash
  role: UserRole;
  status: UserStatus;
  phone?: string;
  profileImage?: string; // Renamed from profile_image
  createdAt: Date; // Renamed from created_at
  updatedAt: Date; // Renamed from updated_at
}

export interface SystemSettingsDocument {
  _id?: ObjectId;
  siteName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maxUploadSizeMb: number;
  emailNotificationsEnabled: boolean;
  engineerApprovalRequired: boolean;
  updatedAt?: Date; // Added for consistency
}

export interface LogEntryDocument {
  _id?: ObjectId;
  action: string;
  level: LogLevel;
  message: string;
  ipAddress?: string; // Renamed
  userAgent?: string; // Renamed
  createdAt: Date; // Renamed
  userId?: ObjectId | string; // Can be string if storing as string ID, or ObjectId
}

// Helper function for logging
export async function logAction(action: string, level: LogLevel, message: string, userId: ObjectId | string | null = null, ipAddress?: string, userAgent?: string): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    const logsCollection: Collection<LogEntryDocument> = db.collection('logs');
    const logEntry: LogEntryDocument = {
      action,
      level,
      message,
      createdAt: new Date(),
    };
    if (userId) logEntry.userId = userId instanceof ObjectId ? userId : new ObjectId(userId);
    if (ipAddress) logEntry.ipAddress = ipAddress;
    if (userAgent) logEntry.userAgent = userAgent;
    
    await logsCollection.insertOne(logEntry);
  } catch (error) {
    console.error('Failed to log action:', error);
    // In a real app, you might have a more robust logging fallback or error handling
  }
}


// Function to get a single system setting or all settings
export async function getSystemSettings(): Promise<SystemSettingsDocument | null> {
  try {
    const { db } = await connectToDatabase();
    const settingsCollection: Collection<SystemSettingsDocument> = db.collection('system_settings');
    // Assuming there's only one document for system settings
    const settings = await settingsCollection.findOne({});
    if (!settings) {
        // Create default settings if none exist
        console.warn('[db.ts] System settings not found. Creating default settings.');
        const defaultSettings: SystemSettingsDocument = {
            siteName: "نظام إدارة المشاريع الإنشائية",
            defaultLanguage: "ar",
            maintenanceMode: false,
            maxUploadSizeMb: 25,
            emailNotificationsEnabled: true,
            engineerApprovalRequired: true,
            updatedAt: new Date(),
        };
        await settingsCollection.insertOne(defaultSettings);
        await logAction('SYSTEM_SETTINGS_CREATED_DEFAULT', 'INFO', 'Default system settings created as none were found.');
        return defaultSettings;
    }
    return settings;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    await logAction('SYSTEM_SETTINGS_FETCH_ERROR', 'ERROR', `Error fetching system settings: ${error instanceof Error ? error.message : String(error)}`);
    return null; // Or throw error, depending on desired behavior
  }
}


export interface RegistrationResult {
  success: boolean;
  userId?: string; // Return string version of ObjectId
  message?: string;
  isPendingApproval?: boolean;
  errorType?: 'email_exists' | 'db_error' | 'settings_error' | 'other';
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password_input: string;
  role: UserRole;
  phone?: string;
}): Promise<RegistrationResult> {
  const { name, email, password_input, role, phone } = userData;
  console.log('[db.ts] registerUser (MongoDB): Attempting to register user:', email, 'with role:', role);

  try {
    const { db } = await connectToDatabase();
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

    const newUserDocument: UserDocument = {
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

    // MongoDB duplicate key error for 'email' index
    if (error.code === 11000 && error.message.includes('email_1')) {
        userMessage = "البريد الإلكتروني مسجل بالفعل.";
        errorType = 'email_exists';
    }
    
    await logAction('USER_REGISTRATION_FAILURE_DB_ERROR', 'ERROR', `Database error during registration attempt for ${email}: ${error.message || String(error)}`);
    return { success: false, message: userMessage, errorType: errorType };
  }
}


export interface LoginResult {
  success: boolean;
  user?: Omit<UserDocument, 'passwordHash'> & { id: string }; // Return user object without passwordHash
  message?: string;
  errorType?: 'email_not_found' | 'invalid_password' | 'account_suspended' | 'pending_approval' | 'account_deleted' | 'db_error' | 'other';
}

export async function loginUser(email: string, password_input: string): Promise<LoginResult> {
  console.log('[db.ts] loginUser (MongoDB): Attempting login for:', email);
  try {
    const { db } = await connectToDatabase();
    const usersCollection: Collection<UserDocument> = db.collection('users');
    
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.warn('[db.ts] loginUser (MongoDB): Email not found:', email);
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
    
    const { passwordHash, ...userWithoutPassword } = user;
    return { 
        success: true, 
        user: { ...userWithoutPassword, id: user._id!.toHexString() } 
    };

  } catch (error: any) {
    console.error("[db.ts] loginUser (MongoDB): Error during login for", email, ":", error);
    await logAction('USER_LOGIN_FAILURE_DB_ERROR', 'ERROR', `Database error during login attempt for ${email}: ${error.message || String(error)}`);
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.", errorType: 'db_error' };
  }
}


// TODO: Implement other data access functions as per the user's NoSQL examples
// (updateProfile, changePassword, generatePasswordResetToken, resetPasswordWithToken,
//  getOwnerProjects, getProjectProgress, getQuantityReportsSummary, getProjectPhotos,
//  addProjectComment, getProjectTimeline, createProject, getEngineerProjects, archiveProject,
//  addProjectMaterial, addProgressUpdate, addProjectPhoto, linkOwnerToProject,
//  getAllUsers, searchUsers, updateUser (admin), deleteUser (admin), adminResetUserPassword,
//  getAllProjects, updateSystemSettings, getSystemLogs)

// Example for a function based on user's NoSQL code:
/*
export async function updateSystemSettings(updateData: Partial<SystemSettingsDocument>, adminId: string | ObjectId): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    const settingsCollection: Collection<SystemSettingsDocument> = db.collection('system_settings');
    await settingsCollection.updateOne(
      {}, // Assuming a single settings document, update it without specific filter
      { $set: { ...updateData, updatedAt: new Date() } },
      { upsert: true } // Create if it doesn't exist
    );
    await logAction('SYSTEM_SETTINGS_UPDATE', 'INFO', 'Updated system settings', adminId);
  } catch (error) {
    console.error('Error updating system settings:', error);
    await logAction('SYSTEM_SETTINGS_UPDATE_ERROR', 'ERROR', `Error updating system settings: ${error instanceof Error ? error.message : String(error)}`, adminId);
    throw error; // Re-throw or handle as appropriate
  }
}
*/

// Ensure client is closed when the app shuts down (for serverless environments, this might be handled differently)
// process.on('SIGINT', async () => {
//   if (cachedClient) {
//     await cachedClient.close();
//     console.log('MongoDB client connection closed.');
//   }
//   process.exit(0);
// });
