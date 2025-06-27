
'use server';

import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

// ---- TYPE DEFINITIONS (Matching JSON structure) ----

export type UserRole = 'ADMIN' | 'ENGINEER' | 'OWNER' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'DELETED';

// Type for user objects in the JSON file
export interface UserDocument {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  profileImage?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

// Type for log entries in the JSON file
export interface LogEntry {
  id: string;
  timestamp: string; // ISO string
  level: LogLevel;
  message: string;
  user?: string;
  action?: string;
}

export type ProjectStatusType = "مكتمل" | "قيد التنفيذ" | "مخطط له" | "مؤرشف";
export type TaskStatus = "مكتمل" | "قيد التنفيذ" | "مخطط له";

// Type for project objects in the JSON file
export interface Project {
  id: number; // The JSON file uses numeric IDs for projects
  name: string;
  engineer?: string;
  clientName?: string;
  status: ProjectStatusType;
  startDate: string; // Date-only string (YYYY-MM-DD)
  endDate: string; // Date-only string (YYYY-MM-DD)
  description: string;
  location: string;
  budget?: number;
  overallProgress: number;
  quantitySummary: string;
  photos: ProjectPhoto[];
  timelineTasks: TimelineTask[];
  comments: ProjectComment[];
  linkedOwnerEmail?: string;
  createdAt?: string; // ISO string
}

export interface ProjectPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  dataAiHint?: string;
}

export interface TimelineTask {
  id: string;
  name: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  color: string;
  status: TaskStatus;
  progress?: number;
}

export interface ProjectComment {
  id: string;
  user: string;
  text: string;
  date: string; // ISO string
  avatar?: string;
  dataAiHintAvatar?: string;
}

export interface CostReportItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit_ILS: number;
  totalCost_ILS: number;
}

export interface CostReport {
  id: string;
  reportName: string;
  engineerId: string;
  engineerName: string;
  ownerId: string;
  ownerName: string;
  items: CostReportItem[];
  totalCost_ILS: number;
  createdAt: string; // ISO string
}

export interface SystemSettingsDocument {
  siteName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maxUploadSizeMB: number;
  emailNotificationsEnabled: boolean;
  engineerApprovalRequired: boolean;
}

// ---- DATABASE I/O HELPERS ----

const DB_PATH = path.join(process.cwd(), 'muhandis-al-hasib', '.data', 'db.json');

// A simple in-memory cache to avoid reading the file on every single operation within a request.
let dbCache: any = null;
let lastReadTime = 0;

async function readDb(force = false) {
  const now = Date.now();
  if (!force && dbCache && (now - lastReadTime < 100)) { // Cache for 100ms
    return dbCache;
  }
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    dbCache = JSON.parse(data);
    lastReadTime = now;
    return dbCache;
  } catch (error) {
    console.error("Error reading database file:", error);
    return { users: [], projects: [], logs: [], settings: {}, costReports: [] };
  }
}

async function writeDb(data: any) {
  try {
    dbCache = data; // Update cache immediately
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to database file:", error);
  }
}

// ---- HELPER FUNCTIONS ----

function toSafeDateString(d: any, defaultVal: string = ''): string {
    if (!d) return defaultVal;
    try {
        const date = new Date(d);
        return isNaN(date.getTime()) ? defaultVal : date.toISOString();
    } catch {
        return defaultVal;
    }
}

function toDateOnlyString(d: any): string {
    if (!d) return '';
    try {
        const date = new Date(d);
        if (isNaN(date.getTime())) return '';
        const tzOffset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - tzOffset);
        return localDate.toISOString().split('T')[0];
    } catch {
        return '';
    }
}

// ---- DATABASE FUNCTIONS ----

export async function logAction(
  action: string,
  level: LogLevel,
  message: string,
  userIdentifier?: string,
): Promise<void> {
  try {
    const db = await readDb(true); // Force read for logging
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      action,
      level,
      message,
      timestamp: new Date().toISOString(),
      user: userIdentifier || 'System',
    };
    db.logs.push(newLog);
    await writeDb(db);
  } catch (error) {
    console.error('[db.ts] logAction: Failed to log action:', action, error);
  }
}

export async function getSystemSettings(): Promise<SystemSettingsDocument> {
  const db = await readDb();
  if (db.settings && Object.keys(db.settings).length > 0) {
    return db.settings;
  }
  return {
    siteName: 'المحترف لحساب الكميات',
    defaultLanguage: 'ar',
    maintenanceMode: false,
    maxUploadSizeMB: 25,
    emailNotificationsEnabled: true,
    engineerApprovalRequired: true,
  };
}

export async function updateSystemSettings(settings: SystemSettingsDocument): Promise<{ success: boolean; message?: string }> {
  try {
    const db = await readDb();
    db.settings = settings;
    await writeDb(db);
    await logAction('SYSTEM_SETTINGS_UPDATE_SUCCESS', 'INFO', 'System settings updated.');
    return { success: true, message: "تم حفظ الإعدادات بنجاح." };
  } catch (error: any) {
    await logAction('SYSTEM_SETTINGS_UPDATE_FAILURE', 'ERROR', `Error updating system settings: ${error.message}`);
    return { success: false, message: "فشل حفظ الإعدادات." };
  }
}

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
  password_input: string;
  role: UserRole;
  phone?: string;
  status?: UserStatus;
}): Promise<RegistrationResult> {
  const { name, email, password_input, role, phone, status } = userData;
  try {
    const db = await readDb();
    const existingUser = db.users.find((u: UserDocument) => u.email === email);
    if (existingUser) {
      await logAction('USER_REGISTRATION_FAILURE', 'WARNING', `Registration attempt for existing email: ${email}`);
      return { success: false, message: "البريد الإلكتروني مسجل بالفعل.", errorType: 'email_exists' };
    }
    
    const settings = await getSystemSettings();
    const initialStatus: UserStatus = status || (role === 'ENGINEER' && settings.engineerApprovalRequired ? 'PENDING_APPROVAL' : 'ACTIVE');

    const hashedPassword = await bcrypt.hash(password_input, 10);
    const now = new Date().toISOString();
    const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newUser: UserDocument = {
      id: newUserId,
      name,
      email,
      password_hash: hashedPassword,
      role,
      status: initialStatus,
      phone: phone || undefined,
      profileImage: `https://placehold.co/100x100.png?text=${name.substring(0, 2).toUpperCase()}`,
      createdAt: now,
      updatedAt: now,
    };
    db.users.push(newUser);
    await writeDb(db);
    
    await logAction('USER_REGISTRATION_SUCCESS', 'INFO', `User ${email} registered. Role: ${role}, Status: ${initialStatus}.`, newUserId);
    return { success: true, userId: newUserId, isPendingApproval: initialStatus === 'PENDING_APPROVAL', message: "تم إنشاء حسابك بنجاح." };
  } catch (error: any) {
    await logAction('USER_REGISTRATION_FAILURE', 'ERROR', `File DB error during registration for ${email}: ${error.message}`);
    return { success: false, message: "حدث خطأ أثناء إنشاء الحساب.", errorType: 'db_error' };
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
    const userDoc = db.users.find((u: UserDocument) => u.email === email);

    if (!userDoc) {
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Login attempt for non-existent email: ${email}`);
      return { success: false, message: "البريد الإلكتروني غير مسجل.", errorType: 'email_not_found' };
    }

    const passwordMatch = await bcrypt.compare(password_input, userDoc.password_hash);
    if (!passwordMatch) {
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Invalid password for user: ${email}`, userDoc.id);
      return { success: false, message: "كلمة المرور غير صحيحة.", errorType: 'invalid_password' };
    }
    
    if (userDoc.status !== 'ACTIVE') {
      const errorMap: Record<UserStatus, { message: string; errorType: LoginResult['errorType'] }> = {
        'PENDING_APPROVAL': { message: "حسابك قيد المراجعة.", errorType: 'pending_approval' },
        'SUSPENDED': { message: "حسابك موقوف.", errorType: 'account_suspended' },
        'DELETED': { message: "هذا الحساب تم حذفه.", errorType: 'account_deleted' },
        'ACTIVE': { message: '', errorType: undefined }
      };
      const errorInfo = errorMap[userDoc.status] || { message: "الحساب غير نشط.", errorType: 'other' };
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Login attempt for inactive account (${userDoc.status}): ${email}`, userDoc.id);
      return { success: false, ...errorInfo };
    }

    await logAction('USER_LOGIN_SUCCESS', 'INFO', `User logged in: ${userDoc.email}`, userDoc.id);
    const { password_hash, ...user } = userDoc;
    return { success: true, user };
  } catch (error: any) {
    await logAction('USER_LOGIN_FAILURE', 'ERROR', `File DB error on login for ${email}: ${error.message}`);
    return { success: false, message: "حدث خطأ في قراءة البيانات.", errorType: 'db_error' };
  }
}


export interface GetProjectsResult {
  success: boolean;
  projects?: Project[];
  message?: string;
}

export async function getProjects(userId: string): Promise<GetProjectsResult> {
    try {
        const db = await readDb();
        const user = db.users.find((u: UserDocument) => u.id === userId);

        if (!user) {
            await logAction('PROJECT_FETCH_FAILURE', 'WARNING', `Project fetch attempt with unknown user ID: ${userId}`);
            // Also check if it's an email for owner-login edge cases
            const userByEmail = db.users.find((u: UserDocument) => u.email === userId);
            if (!userByEmail) {
                return { success: false, message: "المستخدم غير موجود." };
            }
            // If it was an email, proceed with that user object
            return getProjectsForUser(userByEmail, db.projects);
        }

        return getProjectsForUser(user, db.projects);

    } catch (error: any) {
        await logAction('PROJECT_FETCH_FAILURE', 'ERROR', `Error fetching projects for user ${userId}: ${error.message}`);
        return { success: false, message: "فشل تحميل المشاريع." };
    }
}

function getProjectsForUser(user: UserDocument, allProjects: Project[]): GetProjectsResult {
    let userProjects: Project[] = [];
    switch (user.role) {
        case 'ADMIN':
            userProjects = allProjects;
            break;
        case 'OWNER':
            userProjects = allProjects.filter(p => p.linkedOwnerEmail === user.email);
            break;
        case 'ENGINEER':
            userProjects = allProjects.filter(p => p.engineer === user.name);
            break;
        default:
            userProjects = [];
    }
    return { success: true, projects: userProjects.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()) };
}

export async function findProjectById(projectId: string): Promise<Project | null> {
    const db = await readDb();
    // projectId in JSON file is a number
    const project = db.projects.find((p: Project) => p.id.toString() === projectId);
    return project || null;
}

export async function addProject(projectData: Partial<Project>): Promise<Project | null> {
    const db = await readDb();
    const newId = db.projects.length > 0 ? Math.max(...db.projects.map((p: Project) => p.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newProject: Project = {
        id: newId,
        name: projectData.name || "مشروع جديد",
        location: projectData.location || "غير محدد",
        description: projectData.description || "",
        startDate: toDateOnlyString(projectData.startDate || now),
        endDate: toDateOnlyString(projectData.endDate || now),
        status: projectData.status || 'مخطط له',
        engineer: projectData.engineer,
        clientName: projectData.clientName,
        budget: projectData.budget,
        linkedOwnerEmail: projectData.linkedOwnerEmail,
        overallProgress: 0,
        quantitySummary: "",
        photos: [],
        timelineTasks: [],
        comments: [],
        createdAt: now,
    };
    db.projects.push(newProject);
    await writeDb(db);
    await logAction('PROJECT_ADD_SUCCESS', 'INFO', `Project "${projectData.name}" (ID: ${newId}) added.`);
    return newProject;
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<{ success: boolean; project?: Project; message?: string; }> {
    const db = await readDb();
    const projectIndex = db.projects.findIndex((p: Project) => p.id.toString() === projectId);
    if (projectIndex === -1) {
        return { success: false, message: "المشروع غير موجود." };
    }
    db.projects[projectIndex] = { ...db.projects[projectIndex], ...updates };
    await writeDb(db);
    await logAction('PROJECT_UPDATE_SUCCESS', 'INFO', `Project ID ${projectId} updated. Fields: ${Object.keys(updates).join(', ')}`);
    return { success: true, project: db.projects[projectIndex] };
}

export async function deleteProject(projectId: string): Promise<{ success: boolean; message?: string }> {
    const db = await readDb();
    const initialLength = db.projects.length;
    db.projects = db.projects.filter((p: Project) => p.id.toString() !== projectId);
    if (db.projects.length === initialLength) {
        return { success: false, message: "المشروع غير موجود." };
    }
    await writeDb(db);
    await logAction('PROJECT_DELETE_SUCCESS', 'INFO', `Project ID ${projectId} deleted.`);
    return { success: true, message: "تم حذف المشروع بنجاح." };
}

export async function getUsers(): Promise<{ success: boolean, users?: Omit<UserDocument, 'password_hash'>[], message?: string }> {
    const db = await readDb();
    return { success: true, users: db.users.map((u: UserDocument) => { const { password_hash, ...rest } = u; return rest; }) };
}

export interface AdminUserUpdateResult {
    success: boolean;
    user?: Omit<UserDocument, 'password_hash'>;
    message?: string;
    fieldErrors?: Record<string, string[]>;
}

export async function updateUser(userId: string, updates: Partial<UserDocument>): Promise<AdminUserUpdateResult> {
    const db = await readDb();
    if (updates.email) {
        const emailExists = db.users.find((u: UserDocument) => u.email === updates.email && u.id !== userId);
        if (emailExists) {
            return { success: false, message: "البريد الإلكتروني مستخدم بالفعل.", fieldErrors: { email: ["هذا البريد الإلكتروني مستخدم بالفعل."] } };
        }
    }
    const userIndex = db.users.findIndex((u: UserDocument) => u.id === userId);
    if (userIndex === -1) {
        return { success: false, message: "المستخدم غير موجود." };
    }
    db.users[userIndex] = { ...db.users[userIndex], ...updates, updatedAt: new Date().toISOString() };
    await writeDb(db);
    const { password_hash, ...updatedUser } = db.users[userIndex];
    await logAction('USER_UPDATE_SUCCESS_BY_ADMIN', 'INFO', `Admin updated user ID ${userId}.`);
    return { success: true, user: updatedUser, message: "تم تحديث المستخدم بنجاح." };
}

export async function deleteUser(userId: string): Promise<{ success: boolean, message?: string }> {
    const db = await readDb();
    const initialLength = db.users.length;
    db.users = db.users.filter((u: UserDocument) => u.id !== userId);
    if (db.users.length === initialLength) {
        return { success: false, message: "المستخدم غير موجود." };
    }
    await writeDb(db);
    await logAction('USER_DELETE_SUCCESS_BY_ADMIN', 'INFO', `User ID ${userId} deleted by admin.`);
    return { success: true, message: "تم حذف المستخدم بنجاح." };
}

export async function adminResetUserPassword(adminUserId: string, targetUserId: string, newPassword_input: string): Promise<{ success: boolean, message?: string }> {
    const db = await readDb();
    const userIndex = db.users.findIndex((u: UserDocument) => u.id === targetUserId);
    if (userIndex === -1) {
        return { success: false, message: "المستخدم غير موجود." };
    }
    const newPasswordHash = await bcrypt.hash(newPassword_input, 10);
    db.users[userIndex].password_hash = newPasswordHash;
    db.users[userIndex].updatedAt = new Date().toISOString();
    await writeDb(db);
    await logAction('USER_PASSWORD_RESET_BY_ADMIN', 'INFO', `Admin ${adminUserId} reset password for user ${targetUserId}.`);
    return { success: true, message: "تم إعادة تعيين كلمة مرور المستخدم بنجاح." };
}

export async function approveEngineer(adminUserId: string, engineerUserId: string): Promise<{ success: boolean, message?: string }> {
    const result = await updateUser(engineerUserId, { status: 'ACTIVE' });
    if(result.success) {
        await logAction('ENGINEER_APPROVAL_SUCCESS', 'INFO', `Admin ${adminUserId} approved engineer ${engineerUserId}.`);
        return { success: true, message: "تمت الموافقة على المهندس." };
    }
    return { success: false, message: result.message || "فشل الموافقة على المهندس." };
}

export async function suspendUser(adminUserId: string, targetUserId: string): Promise<{ success: boolean, message?: string }> {
    const db = await readDb();
    const userIndex = db.users.findIndex((u: UserDocument) => u.id === targetUserId);
    if (userIndex === -1) return { success: false, message: "المستخدم غير موجود." };
    const user = db.users[userIndex];
    if (user.role === 'ADMIN') return { success: false, message: "لا يمكن تعليق حساب مسؤول." };
    
    const newStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    db.users[userIndex].status = newStatus;
    db.users[userIndex].updatedAt = new Date().toISOString();
    await writeDb(db);
    
    const actionMessage = newStatus === 'SUSPENDED' ? "تم تعليق المستخدم" : "تم إلغاء تعليق المستخدم";
    await logAction(newStatus === 'SUSPENDED' ? 'USER_SUSPEND_SUCCESS' : 'USER_UNSUSPEND_SUCCESS', 'INFO', `Admin ${adminUserId} ${newStatus === 'SUSPENDED' ? 'suspended' : 'unsuspended'} user ${targetUserId}.`);
    return { success: true, message: `${actionMessage} بنجاح.` };
}

export async function getLogs(): Promise<LogEntry[]> {
    const db = await readDb();
    return (db.logs || []).sort((a: LogEntry, b: LogEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export interface ChangePasswordResult {
  success: boolean;
  message?: string;
  errorType?: 'user_not_found' | 'invalid_current_password' | 'db_error';
}

export async function changeUserPassword(userId: string, currentPassword_input: string, newPassword_input: string): Promise<ChangePasswordResult> {
    const db = await readDb();
    const userIndex = db.users.findIndex((u: UserDocument) => u.id === userId);
    if (userIndex === -1) return { success: false, message: "المستخدم غير موجود.", errorType: 'user_not_found' };
    
    const user = db.users[userIndex];
    const passwordMatch = await bcrypt.compare(currentPassword_input, user.password_hash);
    if (!passwordMatch) {
        return { success: false, message: "كلمة المرور الحالية غير صحيحة.", errorType: 'invalid_current_password' };
    }
    
    const newPasswordHash = await bcrypt.hash(newPassword_input, 10);
    db.users[userIndex].password_hash = newPasswordHash;
    db.users[userIndex].updatedAt = new Date().toISOString();
    await writeDb(db);
    
    await logAction('USER_PASSWORD_CHANGE_SUCCESS', 'INFO', `User ${userId} changed their password.`, userId);
    return { success: true, message: "تم تغيير كلمة المرور بنجاح." };
}

export async function addCostReport(reportData: Omit<CostReport, 'id' | 'createdAt'>): Promise<CostReport | null> {
    const db = await readDb();
    const newReport: CostReport = {
        ...reportData,
        id: `cost-report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
    };
    if (!db.costReports) {
      db.costReports = [];
    }
    db.costReports.push(newReport);
    await writeDb(db);
    await logAction('COST_REPORT_ADD_SUCCESS', 'INFO', `Cost report "${reportData.reportName}" (ID: ${newReport.id}) added by engineer ${reportData.engineerName}.`);
    return newReport;
}
