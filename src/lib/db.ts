
'use server';
// src/lib/db.ts
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
  engineerApprovalRequired: boolean;
}

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

export interface LogEntryDocument { // This is the structure in db.json
  id: string;
  action: string;
  level: LogLevel;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string; // ISO string
  user?: string; // User ID or name
}

export interface LogEntry { // This is the type expected by the AdminLogsPage component
  id: string;
  timestamp: Date; // Date object
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

export type TaskStatus = "مكتمل" | "قيد التنفيذ" | "مخطط له"; // Can be different from ProjectStatusType

export interface TimelineTask {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  color: string;     // Tailwind bg color class e.g., 'bg-blue-500'
  status: TaskStatus;
  progress?: number;  // Optional progress for tasks
}

export interface ProjectComment {
  id: string;
  user: string;
  text: string;
  date: string; // ISO string for dates
  avatar?: string;
  dataAiHintAvatar?: string;
}

export interface Project {
  id: number; // Ensure this matches db.json (number)
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

async function readDb(): Promise<DatabaseStructure> {
  try {
    const fileData = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(fileData) as DatabaseStructure;
  } catch (error) {
    console.error('[db.ts] readDb: Error reading or parsing db.json. Returning a default structure.', error);
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
        console.warn('[db.ts] getSystemSettings: System settings not found in db.json. Returning hardcoded defaults.');
        // This default ensures the app can run even if settings are missing, but logs a warning.
        const defaultSettings: SystemSettingsDocument = {
            siteName: 'المحترف لحساب الكميات',
            defaultLanguage: 'ar',
            maintenanceMode: false,
            maxUploadSizeMB: 25,
            emailNotificationsEnabled: true,
            engineerApprovalRequired: true,
        };
        // Optionally, log this event or attempt to write defaults back to db.json if that's desired.
        await logAction('SYSTEM_SETTINGS_MISSING', 'WARNING', 'System settings were missing from db.json, default values returned.');
        return defaultSettings;
    }
  } catch (error) {
    console.error('[db.ts] getSystemSettings: Error fetching system settings:', error);
    await logAction('SYSTEM_SETTINGS_FETCH_ERROR', 'ERROR', `Error fetching system settings: ${error instanceof Error ? error.message : String(error)}`);
    // Return a safe default in case of error
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
    console.log('[db.ts] loginUser (JSON): Login successful for:', user.email);
    await logAction('USER_LOGIN_SUCCESS', 'INFO', `User logged in successfully: ${user.email}`, user.id);
    const { password_hash, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error: any) {
    console.error("[db.ts] loginUser (JSON): Error during login for", email, ":", error);
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
  console.log(`[db.ts] getProjects (JSON): Fetching projects for user/email: ${userEmailOrId}`);
  try {
    const db = await readDb();
    const user = db.users.find(u => u.email === userEmailOrId || u.id === userEmailOrId);
    let filteredProjects: Project[];

    if (user && user.role === 'OWNER') {
      filteredProjects = db.projects.filter(p => p.linkedOwnerEmail === user.email);
    } else if (user && (user.role === 'ENGINEER' || user.role === 'ADMIN')) {
      // Engineers/Admins see all projects or projects they are assigned to.
      // For simplicity, let's assume they see all projects for now.
      // This can be refined if there's an engineer_id on projects.
      filteredProjects = db.projects;
    } else if (!user && userEmailOrId === 'admin-id') { // Special case for admin page if not relying on email
        filteredProjects = db.projects;
    }
     else {
      // If user not found, or general user, return empty or handle as error
      console.warn(`[db.ts] getProjects: User not found or not authorized: ${userEmailOrId}`);
      filteredProjects = [];
    }
    
    console.log(`[db.ts] getProjects (JSON): Found ${filteredProjects.length} projects.`);
    return { success: true, projects: filteredProjects };
  } catch (error: any) {
    console.error("[db.ts] getProjects (JSON): Error fetching projects:", error);
    await logAction('PROJECT_FETCH_FAILURE', 'ERROR', `Error fetching projects: ${error.message || String(error)}`);
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
    console.warn(`[db.ts] updateProject (JSON): Invalid project ID format: ${projectIdString}`);
    return { success: false, message: "معرف المشروع غير صالح." };
  }
  console.log(`[db.ts] updateProject (JSON): Updating project ID ${projectId}`);
  try {
    const db = await readDb();
    const projectIndex = db.projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      console.warn(`[db.ts] updateProject (JSON): Project with ID ${projectId} not found.`);
      return { success: false, message: "المشروع غير موجود." };
    }

    const updatedProjectData = { ...db.projects[projectIndex], ...updates, id: db.projects[projectIndex].id };
    db.projects[projectIndex] = updatedProjectData;
    await writeDb(db);

    console.log(`[db.ts] updateProject (JSON): Project ID ${projectId} updated successfully.`);
    await logAction('PROJECT_UPDATE_SUCCESS', 'INFO', `Project ID ${projectId} updated. Fields: ${Object.keys(updates).join(', ')}`);
    return { success: true, project: updatedProjectData };
  } catch (error: any) {
    console.error(`[db.ts] updateProject (JSON): Error updating project ID ${projectId}:`, error);
    await logAction('PROJECT_UPDATE_FAILURE', 'ERROR', `Error updating project ID ${projectId}: ${error.message || String(error)}`);
    return { success: false, message: "فشل تحديث المشروع." };
  }
}

export async function findProjectById(projectIdString: string): Promise<Project | null> {
    const projectId = parseInt(projectIdString);
    if (isNaN(projectId)) {
        console.warn(`[db.ts] findProjectById (JSON): Invalid project ID format: ${projectIdString}`);
        return null;
    }
    console.log(`[db.ts] findProjectById (JSON): Searching for project ID ${projectId}`);
    try {
        const db = await readDb();
        const project = db.projects.find(p => p.id === projectId);
        if (project) {
            console.log(`[db.ts] findProjectById (JSON): Project found: ${project.name}`);
            return project;
        } else {
            console.warn(`[db.ts] findProjectById (JSON): Project with ID ${projectId} not found.`);
            return null;
        }
    } catch (error: any) {
        console.error(`[db.ts] findProjectById (JSON): Error finding project ID ${projectId}:`, error);
        await logAction('PROJECT_FIND_BY_ID_FAILURE', 'ERROR', `Error finding project ID ${projectId}: ${error.message || String(error)}`);
        return null;
    }
}

export async function addProject(projectData: Omit<Project, 'id' | 'overallProgress' | 'status' | 'photos' | 'timelineTasks' | 'comments'>): Promise<Project | null> {
    console.log(`[db.ts] addProject (JSON): Adding new project: ${projectData.name}`);
    try {
        const db = await readDb();
        const newProjectId = db.projects.length > 0 ? Math.max(...db.projects.map(p => p.id)) + 1 : 1;
        
        const newProject: Project = {
            ...projectData,
            id: newProjectId,
            overallProgress: 0,
            status: 'مخطط له', // Default status
            photos: [],
            timelineTasks: [],
            comments: [],
        };

        db.projects.push(newProject);
        await writeDb(db);

        console.log(`[db.ts] addProject (JSON): Project added successfully with ID ${newProjectId}.`);
        await logAction('PROJECT_ADD_SUCCESS', 'INFO', `Project "${newProject.name}" (ID: ${newProjectId}) added.`);
        return newProject;
    } catch (error: any) {
        console.error(`[db.ts] addProject (JSON): Error adding project:`, error);
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
    console.log(`[db.ts] deleteProject (JSON): Deleting project ID ${projectId}`);
    try {
        const db = await readDb();
        const initialLength = db.projects.length;
        db.projects = db.projects.filter(p => p.id !== projectId);

        if (db.projects.length === initialLength) {
            console.warn(`[db.ts] deleteProject (JSON): Project with ID ${projectId} not found for deletion.`);
            return { success: false, message: "المشروع غير موجود ليتم حذفه." };
        }

        await writeDb(db);
        console.log(`[db.ts] deleteProject (JSON): Project ID ${projectId} deleted successfully.`);
        await logAction('PROJECT_DELETE_SUCCESS', 'INFO', `Project ID ${projectId} deleted.`);
        return { success: true, message: "تم حذف المشروع بنجاح." };
    } catch (error: any) {
        console.error(`[db.ts] deleteProject (JSON): Error deleting project ID ${projectId}:`, error);
        await logAction('PROJECT_DELETE_FAILURE', 'ERROR', `Error deleting project ID ${projectId}: ${error.message || String(error)}`);
        return { success: false, message: "فشل حذف المشروع." };
    }
}

// User management functions for Admin Panel
export interface AdminUserUpdateResult {
    success: boolean;
    user?: UserDocument; // Return updated user without password hash
    message?: string;
}

export async function getUsers(adminUserId: string): Promise<{success: boolean, users?: UserDocument[], message?: string}> {
    // In a real app, verify adminUserId has admin role
    console.log(`[db.ts] getUsers (JSON): Admin ${adminUserId} fetching all users.`);
    try {
        const db = await readDb();
        // Exclude password_hash for safety, although not strictly necessary if only admin sees this
        const usersSafe = db.users.map(({ password_hash, ...rest }) => rest) as unknown as UserDocument[];
        return { success: true, users: usersSafe };
    } catch (error: any) {
        console.error("[db.ts] getUsers (JSON): Error fetching users:", error);
        return { success: false, message: "فشل تحميل قائمة المستخدمين." };
    }
}

export async function updateUser(userId: string, updates: Partial<UserDocument>): Promise<AdminUserUpdateResult> {
    console.log(`[db.ts] updateUser (JSON): Updating user ID ${userId}`);
    try {
        const db = await readDb();
        const userIndex = db.users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return { success: false, message: "المستخدم غير موجود." };
        }

        // Prevent password_hash from being updated directly if it's part of 'updates'
        // Password changes should go through a dedicated function that re-hashes.
        if (updates.password_hash) {
            console.warn(`[db.ts] updateUser: Attempt to update password_hash directly for user ${userId}. This is not allowed. Use a dedicated password reset function.`);
            delete updates.password_hash; 
        }
        
        const originalUser = db.users[userIndex];
        db.users[userIndex] = { ...originalUser, ...updates, id: originalUser.id, updatedAt: new Date().toISOString() };
        
        await writeDb(db);
        const { password_hash, ...updatedUserSafe } = db.users[userIndex];
        return { success: true, user: updatedUserSafe as UserDocument, message: "تم تحديث بيانات المستخدم بنجاح." };
    } catch (error: any) {
        console.error(`[db.ts] updateUser (JSON): Error updating user ID ${userId}:`, error);
        return { success: false, message: "فشل تحديث بيانات المستخدم." };
    }
}


export async function deleteUser(userId: string): Promise<DeleteResult> {
    console.log(`[db.ts] deleteUser (JSON): Deleting user ID ${userId}`);
    try {
        const db = await readDb();
        const initialLength = db.users.length;
        db.users = db.users.filter(u => u.id !== userId);

        if (db.users.length === initialLength) {
            return { success: false, message: "المستخدم غير موجود ليتم حذفه." };
        }
        await writeDb(db);
        return { success: true, message: "تم حذف المستخدم بنجاح." };
    } catch (error: any) {
        console.error(`[db.ts] deleteUser (JSON): Error deleting user ID ${userId}:`, error);
        return { success: false, message: "فشل حذف المستخدم." };
    }
}

export async function approveEngineer(adminUserId: string, engineerUserId: string): Promise<{success: boolean, message?: string}> {
    // Admin check would go here in a real app
    console.log(`[db.ts] approveEngineer (JSON): Admin ${adminUserId} attempting to approve engineer ${engineerUserId}`);
    const result = await updateUser(engineerUserId, { status: 'ACTIVE', updatedAt: new Date().toISOString() });
    if (result.success) {
        return { success: true, message: `تمت الموافقة على المهندس وتنشيط حسابه.` };
    }
    return { success: false, message: result.message || "فشل الموافقة على المهندس." };
}

export async function suspendUser(adminUserId: string, targetUserId: string): Promise<{success: boolean, message?: string}> {
    // Admin check + ensure not suspending self or other admins through this simple flow
    console.log(`[db.ts] suspendUser (JSON): Admin ${adminUserId} attempting to suspend/unsuspend user ${targetUserId}`);
    
    const db = await readDb();
    const user = db.users.find(u => u.id === targetUserId);
    if (!user) return { success: false, message: "المستخدم غير موجود."};
    if (user.role === 'ADMIN') return { success: false, message: "لا يمكن تعليق حساب مسؤول آخر عبر هذا الإجراء."};

    const newStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    const result = await updateUser(targetUserId, { status: newStatus, updatedAt: new Date().toISOString() });
    
    if (result.success) {
        const actionMessage = newStatus === 'SUSPENDED' ? "تعليق المستخدم" : "إلغاء تعليق المستخدم";
        return { success: true, message: `تم ${actionMessage} بنجاح.` };
    }
    return { success: false, message: result.message || "فشل تعديل حالة المستخدم." };
}

export async function getLogs(): Promise<LogEntry[]> {
  console.log('[db.ts] getLogs: Attempting to retrieve logs.');
  try {
    const db = await readDb();
    // Convert LogEntryDocument[] to LogEntry[] (string timestamp to Date object)
    const logsWithDateObjects: LogEntry[] = db.logs.map(logDoc => ({
      ...logDoc,
      timestamp: new Date(logDoc.timestamp) 
    }));
    console.log(`[db.ts] getLogs: Retrieved ${logsWithDateObjects.length} logs successfully.`);
    return logsWithDateObjects;
  } catch (error) {
    console.error('[db.ts] getLogs: Error fetching logs:', error);
    await logAction('LOGS_FETCH_FAILURE', 'ERROR', `Error fetching logs: ${error instanceof Error ? error.message : String(error)}`);
    return []; // Return empty array on error
  }
}
// Removed direct export of dbSettings, dbLogs, dbUsers
// Functions like getSystemSettings, getLogs, getUsers should be used instead.
    