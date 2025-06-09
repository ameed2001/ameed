// src/lib/db.ts
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), '.data', 'db.json');

export type UserRole = 'ADMIN' | 'ENGINEER' | 'OWNER' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'DELETED';

export interface UserDocument {
  id: string; // Changed _id to id for consistency with provided db.json
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  profileImage?: string; // Changed from profile_image
  createdAt: string; // Changed from Date to string to match db.json
  updatedAt?: string; // Changed from Date to string
}

export interface SystemSettingsDocument {
  siteName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maxUploadSizeMB: number; // Changed from max_upload_size_mb
  emailNotificationsEnabled: boolean; // Changed from email_notifications_enabled
  engineerApprovalRequired: boolean; // Changed from engineer_approval_required
}

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

export interface LogEntryDocument {
  id: string; // Changed _id to id
  action: string;
  level: LogLevel;
  message: string;
  ipAddress?: string; // Changed from ip_address
  userAgent?: string; // Changed from user_agent
  timestamp: string; // Changed from createdAt, assuming timestamp is what's in db.json
  user?: string; // User's name or 'System'
}

interface DatabaseStructure {
  users: UserDocument[];
  projects: any[]; // Define later
  settings: SystemSettingsDocument;
  logs: LogEntryDocument[];
  roles: string[];
  useCases: any[]; // Define later
}

async function readDb(): Promise<DatabaseStructure> {
  try {
    const fileData = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(fileData) as DatabaseStructure;
  } catch (error) {
    console.error('[db.ts] readDb: Error reading or parsing db.json. Returning a default structure.', error);
    // If file doesn't exist or is corrupted, return a default structure.
    // This helps in first-run scenarios or if the file gets deleted.
    return {
      users: [],
      projects: [],
      settings: {
        siteName: 'المحترف لحساب الكميات',
        defaultLanguage: 'ar',
        maintenanceMode: false,
        maxUploadSizeMB: 25,
        emailNotificationsEnabled: true,
        engineerApprovalRequired: true,
      },
      logs: [],
      roles: ["Admin", "Engineer", "Owner", "GeneralUser"],
      useCases: []
    };
  }
}

async function writeDb(data: DatabaseStructure): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('[db.ts] writeDb: Error writing to db.json', error);
    // Decide how to handle write errors. Maybe throw to make it more visible.
    throw new Error("Failed to write to the database file.");
  }
}

export async function logAction(
  action: string,
  level: LogLevel,
  message: string,
  userNameOrSystem?: string, // Changed from userId
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  console.log(`[db.ts] logAction: Action: ${action}, Level: ${level}, Message: ${message.substring(0,100)}, User: ${userNameOrSystem || 'System'}`);
  try {
    const db = await readDb();
    const logEntry: LogEntryDocument = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      action,
      level,
      message,
      timestamp: new Date().toISOString(),
      user: userNameOrSystem || 'System',
    };
    if (ipAddress) logEntry.ipAddress = ipAddress;
    if (userAgent) logEntry.userAgent = userAgent;

    db.logs.push(logEntry);
    await writeDb(db);
  } catch (error) {
    console.error('[db.ts] logAction: Failed to log action:', action, error);
  }
}

export async function getSystemSettings(): Promise<SystemSettingsDocument> {
  console.log('[db.ts] getSystemSettings: Attempting to retrieve system settings.');
  try {
    const db = await readDb();
    if (db.settings) {
        console.log('[db.ts] getSystemSettings: System settings retrieved successfully.');
        return db.settings;
    } else {
        // This case should ideally be handled by readDb returning default settings
        console.warn('[db.ts] getSystemSettings: System settings not found in db.json. Returning hardcoded defaults.');
        const defaultSettings: SystemSettingsDocument = {
            siteName: 'المحترف لحساب الكميات',
            defaultLanguage: 'ar',
            maintenanceMode: false,
            maxUploadSizeMB: 25,
            emailNotificationsEnabled: true,
            engineerApprovalRequired: true,
        };
        // Optionally write these defaults back if they are missing
        // const currentDb = await readDb(); // Reread to ensure we have the latest
        // currentDb.settings = defaultSettings;
        // await writeDb(currentDb);
        await logAction('SYSTEM_SETTINGS_MISSING', 'WARNING', 'System settings were missing, default values returned.');
        return defaultSettings;
    }
  } catch (error) {
    console.error('[db.ts] getSystemSettings: Error fetching system settings:', error);
    await logAction('SYSTEM_SETTINGS_FETCH_ERROR', 'ERROR', `Error fetching system settings: ${error instanceof Error ? error.message : String(error)}`);
    // Fallback to hardcoded defaults in case of error
    return {
        siteName: 'المحترف لحساب الكميات',
        defaultLanguage: 'ar',
        maintenanceMode: false,
        maxUploadSizeMB: 25,
        emailNotificationsEnabled: true,
        engineerApprovalRequired: true,
    };
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
  role: UserRole;
  phone?: string;
}): Promise<RegistrationResult> {
  const { name, email, password_input, role, phone } = userData;
  console.log('[db.ts] registerUser (JSON): Attempting to register user:', email, 'with role:', role);

  try {
    const db = await readDb();

    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      console.warn('[db.ts] registerUser (JSON): Email already exists:', email);
      await logAction('USER_REGISTRATION_FAILURE', 'WARNING', `Registration attempt failed for existing email: ${email}`);
      return { success: false, message: "البريد الإلكتروني مسجل بالفعل.", errorType: 'email_exists' };
    }

    const settings = await getSystemSettings();
    // engineerApprovalRequired is a boolean
    let initialStatus: UserStatus = (role === 'ENGINEER' && settings.engineerApprovalRequired) ? 'PENDING_APPROVAL' : 'ACTIVE';

    const hashedPassword = await bcrypt.hash(password_input, 10);

    const newUserId = `user-${Date.now()}-${db.users.length + 1}`;
    const newUserDocument: UserDocument = {
      id: newUserId,
      name,
      email,
      password_hash: hashedPassword,
      role,
      status: initialStatus,
      phone: phone || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profileImage: `https://placehold.co/100x100.png?text=${name.substring(0,2).toUpperCase()}`
    };

    db.users.push(newUserDocument);
    await writeDb(db);

    console.log('[db.ts] registerUser (JSON): User registered successfully:', email, 'Status:', initialStatus, 'ID:', newUserId);
    await logAction('USER_REGISTRATION_SUCCESS', 'INFO', `User ${email} registered. Role: ${role}, Status: ${initialStatus}.`, newUserId);

    return {
      success: true,
      userId: newUserId,
      isPendingApproval: initialStatus === 'PENDING_APPROVAL',
      message: initialStatus === 'PENDING_APPROVAL'
        ? "تم إنشاء حسابك كمهندس بنجاح. حسابك حاليًا قيد المراجعة والموافقة من قبل الإدارة."
        : "تم إنشاء حسابك بنجاح.",
    };

  } catch (error: any) {
    console.error("[db.ts] registerUser (JSON): Error during registration for", email, ":", error);
    await logAction('USER_REGISTRATION_FAILURE', 'ERROR', `File DB error during registration attempt for ${email}: ${error.message || String(error)}`);
    return { success: false, message: "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.", errorType: 'db_error' };
  }
}

export interface LoginResult {
  success: boolean;
  user?: Omit<UserDocument, 'password_hash'>;
  message?: string;
  errorType?: 'email_not_found' | 'invalid_password' | 'account_suspended' | 'pending_approval' | 'account_deleted' | 'db_error' | 'other';
}

export async function loginUser(email: string, password_input: string): Promise<LoginResult> {
  console.log('[db.ts] loginUser (JSON): Attempting login for:', email);
  try {
    const db = await readDb();
    const user = db.users.find(u => u.email === email);

    if (!user) {
      console.warn('[db.ts] loginUser (JSON): Email not found:', email);
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Login attempt for non-existent email: ${email}`);
      return { success: false, message: "البريد الإلكتروني غير مسجل.", errorType: 'email_not_found' };
    }

    const passwordMatch = await bcrypt.compare(password_input, user.password_hash);
    if (!passwordMatch) {
      console.warn('[db.ts] loginUser (JSON): Invalid password for:', email);
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Invalid password attempt for user: ${email}`, user.id);
      return { success: false, message: "كلمة المرور غير صحيحة.", errorType: 'invalid_password' };
    }
    
    if (user.status === 'PENDING_APPROVAL') {
      console.warn('[db.ts] loginUser (JSON): Account pending approval for:', email);
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Login attempt for pending approval account: ${email}`, user.id);
      return { success: false, message: "حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه.", errorType: 'pending_approval' };
    }

    if (user.status === 'SUSPENDED') {
      console.warn('[db.ts] loginUser (JSON): Account suspended for:', email);
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Login attempt for suspended account: ${email}`, user.id);
      return { success: false, message: "حسابك موقوف. يرجى التواصل مع الإدارة.", errorType: 'account_suspended' };
    }
    
    if (user.status === 'DELETED') {
      console.warn('[db.ts] loginUser (JSON): Account deleted for:', email);
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Login attempt for deleted account: ${email}`, user.id);
      return { success: false, message: "هذا الحساب تم حذفه.", errorType: 'account_deleted' };
    }

    if (user.status !== 'ACTIVE') {
        console.warn('[db.ts] loginUser (JSON): Account not active for:', email, 'Status:', user.status);
        await logAction('USER_LOGIN_FAILURE', 'WARNING', `Login attempt for non-active account: ${email} (Status: ${user.status})`, user.id);
        return { success: false, message: "الحساب غير نشط. يرجى التواصل مع الإدارة.", errorType: 'other' };
    }

    console.log('[db.ts] loginUser (JSON): Login successful for:', user.email);
    await logAction('USER_LOGIN_SUCCESS', 'INFO', `User logged in successfully: ${user.email}`, user.id);
    
    const { password_hash, ...userWithoutPassword } = user;
    return { 
        success: true, 
        user: userWithoutPassword
    };

  } catch (error: any) {
    console.error("[db.ts] loginUser (JSON): Error during login for", email, ":", error);
    await logAction('USER_LOGIN_FAILURE', 'ERROR', `File DB error during login attempt for ${email}: ${error.message || String(error)}`);
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.", errorType: 'db_error' };
  }
}

// Placeholder for other DB functions (projects, tasks, etc.) to be adapted for JSON file.
// Example:
// export async function getProjectsByOwner(ownerId: string): Promise<any[]> {
//   const db = await readDb();
//   return db.projects.filter(p => p.owner_id === ownerId && p.status !== 'ARCHIVED');
// }
