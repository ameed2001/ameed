
'use server';

import { createReadStream, createWriteStream, promises as fsPromises, existsSync } from 'fs';
import { join, dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), '.data', 'db.json');

export type UserRole = 'ADMIN' | 'ENGINEER' | 'OWNER' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'DELETED';

export interface UserDocument {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SystemSettingsDocument {
  siteName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maxUploadSizeMB: number;
  emailNotificationsEnabled: boolean;
  engineerApprovalRequired: boolean; // default: false
}

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

export interface LogEntryDocument {
  id: string;
  action: string;
  level: LogLevel;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string; // ISO string
  user?: string; // User ID or name
}

export interface LogEntry {
  id: string;
  timestamp: string; // <-- make it string, not Date, to be serializable!
  level: LogLevel;
  message: string;
  user?: string;
  action?: string;
}

// ----- Project Related Types -----
export type ProjectStatusType = "مكتمل" | "قيد التنفيذ" | "مخطط له" | "مؤرشف";

export interface ProjectPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  dataAiHint?: string;
}

export type TaskStatus = "مكتمل" | "قيد التنفيذ" | "مخطط له";

export interface TimelineTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  status: TaskStatus;
  progress?: number;
}

export interface ProjectComment {
  id: string;
  user: string;
  text: string;
  date: string;
  avatar?: string;
  dataAiHintAvatar?: string;
}

export interface Project {
  id: number;
  name: string;
  engineer?: string;
  clientName?: string;
  status: ProjectStatusType;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
  budget?: number;
  overallProgress: number;
  quantitySummary: string;
  photos: ProjectPhoto[];
  timelineTasks: TimelineTask[];
  comments: ProjectComment[];
  linkedOwnerEmail?: string;
}

interface DatabaseStructure {
  users: UserDocument[];
  projects: Project[];
  settings: SystemSettingsDocument;
  logs: LogEntryDocument[];
  roles: string[];
  useCases: any[];
}

// Ensure the directory for db.json exists
const ensureDbDirExists = async () => {
  const dbDir = dirname(DB_PATH);
  try {
    await fsPromises.mkdir(dbDir, { recursive: true });
  } catch (error) {
    console.error('[db.ts] ensureDbDirExists: Failed to create database directory:', error);
    // Depending on your error handling strategy, you might want to rethrow or handle this
  }
};

async function readDb(): Promise<DatabaseStructure> {
  try {
    await ensureDbDirExists(); // Ensure directory exists before reading
    if (!existsSync(DB_PATH)) {
       console.warn('[db.ts] readDb: db.json does not exist. Returning default structure.');
       return {
        users: [],
        projects: [],
        settings: {
          siteName: 'المحترف لحساب الكميات',
          defaultLanguage: 'ar',
          maintenanceMode: false,
          maxUploadSizeMB: 25,
          emailNotificationsEnabled: true,
 engineerApprovalRequired: false, // Default to false
        },
        logs: [],
        roles: ["Admin", "Engineer", "Owner", "GeneralUser"],
        useCases: []
      };
    }

    const stream = createReadStream(DB_PATH, { encoding: 'utf-8' });
    let fileData = '';

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => {
        fileData += chunk;
      });

      stream.on('end', () => {
        try {
          const data = JSON.parse(fileData) as DatabaseStructure;
          resolve(data);
        } catch (parseError) {
          console.error('[db.ts] readDb: Error parsing db.json', parseError);
          reject(parseError);
        }
      });

      stream.on('error', (streamError) => {
         console.error('[db.ts] readDb: Error reading db.json stream', streamError);
         reject(streamError);
      });
    });

  } catch (error) {
    console.error('[db.ts] readDb: Error reading or parsing db.json. Returning a default structure.', error);
     // Return default structure only if initial check for file existence fails and we catch that specific error,
     // otherwise rethrow for actual read/parse errors.
     // For now, simplified: return default on any error as per original logic, but log the specific error.
     return {
       users: [],
      projects: [],
      logs: [],
      roles: ["Admin", "Engineer", "Owner", "GeneralUser"],
      useCases: []
    };
  }
}

async function writeDb(data: DatabaseStructure): Promise<void> {
  try {
    await ensureDbDirExists(); // Ensure directory exists before writing
    const stream = createWriteStream(DB_PATH, { encoding: 'utf-8' });
    const jsonData = JSON.stringify(data, null, 2);

    return new Promise((resolve, reject) => {
      stream.write(jsonData, 'utf-8');
      stream.end();

      stream.on('finish', () => {
        resolve();
      });

      stream.on('error', (streamError) => {
         console.error('[db.ts] writeDb: Error writing to db.json stream', streamError);
         reject(streamError);
      });
    });
  } catch (error) {
    throw new Error("Failed to write to the database file.");
  }
}

export async function logAction(
  action: string,
  level: LogLevel,
  message: string,
  userNameOrSystem?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
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
  try {
    const db = await readDb();
    if (db.settings) {
      return db.settings;
    } else {
      const defaultSettings: SystemSettingsDocument = {
        siteName: 'المحترف لحساب الكميات',
        defaultLanguage: 'ar',
        maintenanceMode: false,
        maxUploadSizeMB: 25,
        emailNotificationsEnabled: true,
        engineerApprovalRequired: true,
      };
      await logAction('SYSTEM_SETTINGS_MISSING', 'WARNING', 'System settings were missing from db.json, default values returned.');
      return defaultSettings;
    }
  } catch (error) {
    await logAction('SYSTEM_SETTINGS_FETCH_ERROR', 'ERROR', `Error fetching system settings: ${error instanceof Error ? error.message : String(error)}`);
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

export async function updateSystemSettings(settings: SystemSettingsDocument): Promise<{ success: boolean; message?: string }> {
  try {
    const db = await readDb();
    db.settings = { ...db.settings, ...settings };
    await writeDb(db);
    await logAction('SYSTEM_SETTINGS_UPDATE_SUCCESS', 'INFO', 'System settings updated.');
    return { success: true, message: "تم حفظ الإعدادات بنجاح." };
  } catch (error: any) {
    await logAction('SYSTEM_SETTINGS_UPDATE_FAILURE', 'ERROR', `Error updating system settings: ${error.message || String(error)}`);
    return { success: false, message: "فشل حفظ الإعدادات." };
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
  status?: UserStatus; // Allow overriding status for admin creation
}): Promise<RegistrationResult> {
  const { name, email, password_input, role, phone, status } = userData;
  console.log('[db.ts] registerUser: Starting registration for email:', email, 'with role:', role);
  try {
    console.log('[db.ts] registerUser: Reading database...');
    const db = await readDb();
    console.log('[db.ts] registerUser: Database read successfully.');
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      await logAction('USER_REGISTRATION_FAILURE', 'WARNING', `Registration attempt failed for existing email: ${email}`);
      return { success: false, message: "البريد الإلكتروني مسجل بالفعل.", errorType: 'email_exists' };
    }

    const settings = await getSystemSettings();
    // Use provided status or set to ACTIVE. Approval flow is disabled.
    let initialStatus: UserStatus = status || 'ACTIVE';

    const hashedPassword = await bcrypt.hash(password_input, 10);
    console.log('[db.ts] registerUser: Password hashed successfully.');
    const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    console.log('[db.ts] registerUser: Generated new user ID:', newUserId);
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
      profileImage: `https://placehold.co/100x100.png?text=${name.substring(0, 2).toUpperCase()}`
    };
    console.log('[db.ts] registerUser: Pushing new user to database object.');
    db.users.push(newUserDocument);
    console.log('[db.ts] registerUser: Writing database...');
    await writeDb(db);
    await logAction('USER_REGISTRATION_SUCCESS', 'INFO', `User ${email} registered. Role: ${role}, Status: ${initialStatus}.`, newUserId);
    console.log('[db.ts] registerUser: Registration successful for user:', newUserId);
    return {
      success: true,
      userId: newUserId,
      isPendingApproval: initialStatus === 'PENDING_APPROVAL',
      message: initialStatus === 'PENDING_APPROVAL'
        ? "تم إنشاء حسابك كمهندس بنجاح. حسابك حاليًا قيد المراجعة والموافقة من قبل الإدارة."
        : "تم إنشاء حسابك بنجاح.",
    };
  } catch (error: any) {
    console.error('[db.ts] registerUser: Caught error during registration:', error);
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
  try {
    const db = await readDb();
    const user = db.users.find(u => u.email === email);
    if (!user) {
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Login attempt for non-existent email: ${email}`);
      return { success: false, message: "البريد الإلكتروني غير مسجل.", errorType: 'email_not_found' };
    }
    const passwordMatch = await bcrypt.compare(password_input, user.password_hash);
    if (!passwordMatch) {
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Invalid password attempt for user: ${email}`, user.id);
      return { success: false, message: "كلمة المرور غير صحيحة.", errorType: 'invalid_password' };
    }
    if (user.status === 'PENDING_APPROVAL') {
      return { success: false, message: "حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه.", errorType: 'pending_approval' };
    }
    if (user.status === 'SUSPENDED') {
      return { success: false, message: "حسابك موقوف. يرجى التواصل مع الإدارة.", errorType: 'account_suspended' };
    }
    if (user.status === 'DELETED') {
      return { success: false, message: "هذا الحساب تم حذفه.", errorType: 'account_deleted' };
    }
    if (user.status !== 'ACTIVE') {
      return { success: false, message: "الحساب غير نشط. يرجى التواصل مع الإدارة.", errorType: 'other' };
    }
    await logAction('USER_LOGIN_SUCCESS', 'INFO', `User logged in successfully: ${user.email}`, user.id);
    const { password_hash, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error: any) {
    await logAction('USER_LOGIN_FAILURE', 'ERROR', `File DB error during login attempt for ${email}: ${error.message || String(error)}`);
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.", errorType: 'db_error' };
  }
}

// ----- Project Related Functions -----
export interface GetProjectsResult {
  success: boolean;
  projects?: Project[];
  message?: string;
}

export async function getProjects(userEmailOrId: string): Promise<GetProjectsResult> {
  try {
    const db = await readDb();
    const user = db.users.find(u => u.email === userEmailOrId || u.id === userEmailOrId);

    // Admin can see all projects
    if (userEmailOrId === 'admin-id' || user?.role === 'ADMIN') {
      return { success: true, projects: db.projects };
    }

    if (!user) {
        await logAction('PROJECT_FETCH_FAILURE', 'WARNING', `Project fetch attempted with unknown user ID/Email: ${userEmailOrId}`);
        return { success: true, projects: [] }; // Return empty array if user not found
    }

    let filteredProjects: Project[] = [];
    if (user.role === 'OWNER') {
      filteredProjects = db.projects.filter(p => p.linkedOwnerEmail === user.email);
    } else if (user.role === 'ENGINEER') {
      // The engineer's name is stored in the project's 'engineer' field.
      // This is a weak link; using an ID would be better in a real-world scenario.
      filteredProjects = db.projects.filter(p => p.engineer === user.name);
    }

    return { success: true, projects: filteredProjects };
  } catch (error: any) {
    await logAction('PROJECT_FETCH_FAILURE', 'ERROR', `Error fetching projects for ${userEmailOrId}: ${error.message || String(error)}`);
    return { success: false, message: "فشل تحميل المشاريع.", projects: [] };
  }
}

export interface UpdateResult {
  success: boolean;
  project?: Project;
  message?: string;
}

export async function updateProject(projectIdString: string, updates: Partial<Project>): Promise<UpdateResult> {
  const projectId = parseInt(projectIdString);
  if (isNaN(projectId)) {
    return { success: false, message: "معرف المشروع غير صالح." };
  }
  try {
    const db = await readDb();
    const projectIndex = db.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return { success: false, message: "المشروع غير موجود." };
    }
    const updatedProjectData = { ...db.projects[projectIndex], ...updates, id: db.projects[projectIndex].id };
    db.projects[projectIndex] = updatedProjectData;
    await writeDb(db);
    await logAction('PROJECT_UPDATE_SUCCESS', 'INFO', `Project ID ${projectId} updated. Fields: ${Object.keys(updates).join(', ')}`);
    return { success: true, project: updatedProjectData };
  } catch (error: any) {
    await logAction('PROJECT_UPDATE_FAILURE', 'ERROR', `Error updating project ID ${projectId}: ${error.message || String(error)}`);
    return { success: false, message: "فشل تحديث المشروع." };
  }
}

export async function findProjectById(projectIdString: string): Promise<Project | null> {
  const projectId = parseInt(projectIdString);
  if (isNaN(projectId)) {
    return null;
  }
  try {
    const db = await readDb();
    const project = db.projects.find(p => p.id === projectId);
    if (project) {
      return project;
    } else {
      return null;
    }
  } catch (error: any) {
    await logAction('PROJECT_FIND_BY_ID_FAILURE', 'ERROR', `Error finding project ID ${projectId}: ${error.message || String(error)}`);
    return null;
  }
}

export async function addProject(projectData: Omit<Project, 'id' | 'overallProgress' | 'photos' | 'timelineTasks' | 'comments'>): Promise<Project | null> {
  try {
    const db = await readDb();
    const newProjectId = db.projects.length > 0 ? Math.max(...db.projects.map(p => p.id)) + 1 : 1;
    const newProject: Project = {
      ...projectData,
      id: newProjectId,
      overallProgress: 0,
      photos: [],
      timelineTasks: [],
      comments: [],
    };
    db.projects.push(newProject);
    await writeDb(db);
    await logAction('PROJECT_ADD_SUCCESS', 'INFO', `Project "${newProject.name}" (ID: ${newProjectId}) added.`);
    return newProject;
  } catch (error: any) {
    await logAction('PROJECT_ADD_FAILURE', 'ERROR', `Error adding project: ${error.message || String(error)}`);
    return null;
  }
}

export interface DeleteResult {
  success: boolean;
  message?: string;
}

export async function deleteProject(projectIdString: string): Promise<DeleteResult> {
  const projectId = parseInt(projectIdString);
  if (isNaN(projectId)) {
    return { success: false, message: "معرف المشروع غير صالح." };
  }
  try {
    const db = await readDb();
    const initialLength = db.projects.length;
    db.projects = db.projects.filter(p => p.id !== projectId);
    if (db.projects.length === initialLength) {
      return { success: false, message: "المشروع غير موجود ليتم حذفه." };
    }
    await writeDb(db);
    await logAction('PROJECT_DELETE_SUCCESS', 'INFO', `Project ID ${projectId} deleted.`);
    return { success: true, message: "تم حذف المشروع بنجاح." };
  } catch (error: any) {
    await logAction('PROJECT_DELETE_FAILURE', 'ERROR', `Error deleting project ID ${projectId}: ${error.message || String(error)}`);
    return { success: false, message: "فشل حذف المشروع." };
  }
}

// User management functions for Admin Panel
export interface AdminUserUpdateResult {
  success: boolean;
  user?: UserDocument;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export async function getUsers(adminUserId: string): Promise<{ success: boolean, users?: UserDocument[], message?: string }> {
  try {
    const db = await readDb();
    const usersSafe = db.users.map(({ password_hash, ...rest }) => rest) as unknown as UserDocument[];
    return { success: true, users: usersSafe };
  } catch (error: any) {
    return { success: false, message: "فشل تحميل قائمة المستخدمين." };
  }
}

export async function updateUser(userId: string, updates: Partial<Omit<UserDocument, 'id' | 'password_hash' | 'createdAt'>> & { email?: string }): Promise<AdminUserUpdateResult> {
  try {
    const db = await readDb();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, message: "المستخدم غير موجود." };
    }
    const originalUser = db.users[userIndex];
    if (updates.email && updates.email !== originalUser.email) {
      const emailExists = db.users.some(u => u.email === updates.email && u.id !== userId);
      if (emailExists) {
        await logAction('USER_UPDATE_FAILURE_EMAIL_EXISTS', 'WARNING', `Admin attempt to update user ${userId} email to ${updates.email}, but email already exists.`, 'Admin');
        return {
          success: false,
          message: "هذا البريد الإلكتروني مستخدم بالفعل من قبل حساب آخر.",
          fieldErrors: { email: ["هذا البريد الإلكتروني مستخدم بالفعل."] }
        };
      }
    }
    const { password_hash, createdAt, ...restOfOriginalUser } = originalUser;
    db.users[userIndex] = {
      ...restOfOriginalUser,
      ...updates,
      id: originalUser.id,
      password_hash: originalUser.password_hash,
      createdAt: originalUser.createdAt,
      updatedAt: new Date().toISOString()
    };
    await writeDb(db);
    const { password_hash: _, ...updatedUserSafe } = db.users[userIndex];
    await logAction('USER_UPDATE_SUCCESS_BY_ADMIN', 'INFO', `Admin updated user ID ${userId}. Fields: ${Object.keys(updates).join(', ')}`, 'Admin');
    return { success: true, user: updatedUserSafe as UserDocument, message: "تم تحديث بيانات المستخدم بنجاح." };
  } catch (error: any) {
    await logAction('USER_UPDATE_FAILURE_BY_ADMIN', 'ERROR', `Error updating user ID ${userId} by admin: ${error.message || String(error)}`, 'Admin');
    return { success: false, message: "فشل تحديث بيانات المستخدم." };
  }
}

export async function adminResetUserPassword(adminUserId: string, targetUserId: string, newPassword_input: string): Promise<{ success: boolean, message?: string }> {
  try {
    const db = await readDb();
    const userIndex = db.users.findIndex(u => u.id === targetUserId);
    if (userIndex === -1) {
      return { success: false, message: "المستخدم المستهدف غير موجود." };
    }
    const newPasswordHash = await bcrypt.hash(newPassword_input, 10);
    db.users[userIndex].password_hash = newPasswordHash;
    db.users[userIndex].updatedAt = new Date().toISOString();
    await writeDb(db);
    await logAction('USER_PASSWORD_RESET_BY_ADMIN', 'INFO', `Admin ${adminUserId} reset password for user ${targetUserId}.`, adminUserId);
    return { success: true, message: "تم إعادة تعيين كلمة مرور المستخدم بنجاح." };
  } catch (error: any) {
    await logAction('USER_PASSWORD_RESET_FAILURE_BY_ADMIN', 'ERROR', `Error resetting password for user ID ${targetUserId} by admin ${adminUserId}: ${error.message || String(error)}`, adminUserId);
    return { success: false, message: "فشل إعادة تعيين كلمة مرور المستخدم." };
  }
}

export async function deleteUser(userId: string): Promise<DeleteResult> {
  try {
    const db = await readDb();
    const initialLength = db.users.length;
    db.users = db.users.filter(u => u.id !== userId);
    if (db.users.length === initialLength) {
      return { success: false, message: "المستخدم غير موجود ليتم حذفه." };
    }
    await writeDb(db);
    await logAction('USER_DELETE_SUCCESS_BY_ADMIN', 'INFO', `User ID ${userId} deleted by admin.`, 'Admin');
    return { success: true, message: "تم حذف المستخدم بنجاح." };
  } catch (error: any) {
    await logAction('USER_DELETE_FAILURE_BY_ADMIN', 'ERROR', `Error deleting user ID ${userId} by admin: ${error.message || String(error)}`, 'Admin');
    return { success: false, message: "فشل حذف المستخدم." };
  }
}

export async function approveEngineer(adminUserId: string, engineerUserId: string): Promise<{ success: boolean, message?: string }> {
  const result = await updateUser(engineerUserId, { status: 'ACTIVE', updatedAt: new Date().toISOString() });
  if (result.success) {
    await logAction('ENGINEER_APPROVAL_SUCCESS', 'INFO', `Admin ${adminUserId} approved engineer ${engineerUserId}.`, adminUserId);
    return { success: true, message: `تمت الموافقة على المهندس وتنشيط حسابه.` };
  }
  await logAction('ENGINEER_APPROVAL_FAILURE', 'WARNING', `Admin ${adminUserId} failed to approve engineer ${engineerUserId}: ${result.message}`, adminUserId);
  return { success: false, message: result.message || "فشل الموافقة على المهندس." };
}

export async function suspendUser(adminUserId: string, targetUserId: string): Promise<{ success: boolean, message?: string }> {
  const db = await readDb();
  const user = db.users.find(u => u.id === targetUserId);
  if (!user) return { success: false, message: "المستخدم غير موجود." };
  if (user.role === 'ADMIN') return { success: false, message: "لا يمكن تعليق حساب مسؤول آخر عبر هذا الإجراء." };
  const newStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
  const result = await updateUser(targetUserId, { status: newStatus, updatedAt: new Date().toISOString() });
  if (result.success) {
    const actionMessage = newStatus === 'SUSPENDED' ? "تعليق المستخدم" : "إلغاء تعليق المستخدم";
    await logAction(newStatus === 'SUSPENDED' ? 'USER_SUSPEND_SUCCESS' : 'USER_UNSUSPEND_SUCCESS', 'INFO', `Admin ${adminUserId} ${newStatus === 'SUSPENDED' ? 'suspended' : 'unsuspended'} user ${targetUserId}.`, adminUserId);
    return { success: true, message: `تم ${actionMessage} بنجاح.` };
  }
  await logAction(newStatus === 'SUSPENDED' ? 'USER_SUSPEND_FAILURE' : 'USER_UNSUSPEND_FAILURE', 'WARNING', `Admin ${adminUserId} failed to ${newStatus === 'SUSPENDED' ? 'suspend' : 'unsuspend'} user ${targetUserId}: ${result.message}`, adminUserId);
  return { success: false, message: result.message || "فشل تعديل حالة المستخدم." };
}

export async function getLogs(): Promise<LogEntry[]> {
  try {
    const db = await readDb();
    // Return serializable logs (timestamp as string, not Date)
    const logsForClient: LogEntry[] = db.logs.map(logDoc => ({
      ...logDoc,
      timestamp: logDoc.timestamp // keep as string for easy serialization
    }));
    return logsForClient;
  } catch (error) {
    await logAction('LOGS_FETCH_FAILURE', 'ERROR', `Error fetching logs: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}
