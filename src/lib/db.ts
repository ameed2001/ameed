
'use server';

import { getDb } from './mongodb';
import { ObjectId, type Collection, type WithId } from 'mongodb';
import bcrypt from 'bcryptjs';

// ---- TYPE DEFINITIONS ----

export type UserRole = 'ADMIN' | 'ENGINEER' | 'OWNER' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'DELETED';

// Schema for documents in MongoDB `users` collection
export interface UserSchema {
  _id: ObjectId;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type for client-side user object (without sensitive data)
export interface UserDocument {
  id: string; // _id as a string
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  profileImage?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

// Schema for documents in MongoDB `logs` collection
export interface LogSchema {
  _id: ObjectId;
  action: string;
  level: LogLevel;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  user?: string; // User ID or name
}

// Type for client-side log entry
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

// Schema for documents in MongoDB `projects` collection
export interface ProjectSchema {
    _id: ObjectId;
    name: string;
    engineer?: string;
    clientName?: string;
    status: ProjectStatusType;
    startDate: Date;
    endDate: Date;
    description: string;
    location: string;
    budget?: number;
    overallProgress: number;
    quantitySummary: string;
    photos: ProjectPhoto[];
    timelineTasks: TimelineTask[];
    comments: ProjectComment[];
    linkedOwnerEmail?: string;
    createdAt: Date;
}

// Type for client-side project object
export interface Project {
  id: string; // _id as string
  name: string;
  engineer?: string;
  clientName?: string;
  status: ProjectStatusType;
  startDate: string; // ISO string
  endDate: string; // ISO string
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
  endDate: string; // ISO string
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

export interface CostReportSchema {
  _id: ObjectId;
  reportName: string;
  engineerId: string;
  engineerName: string;
  ownerId: string;
  ownerName: string;
  items: CostReportItem[];
  totalCost_ILS: number;
  createdAt: Date;
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


// ---- HELPER FUNCTIONS ----

function mongoDocToUser(doc: WithId<UserSchema>): UserDocument {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: _id.toHexString(),
    createdAt: rest.createdAt.toISOString(),
    updatedAt: rest.updatedAt.toISOString(),
  };
}

function mongoDocToProject(doc: WithId<ProjectSchema>): Project {
    const { _id, ...rest } = doc;
    return {
        ...rest,
        id: _id.toHexString(),
        startDate: rest.startDate.toISOString().split('T')[0],
        endDate: rest.endDate.toISOString().split('T')[0],
        createdAt: rest.createdAt.toISOString(),
    };
}

function mongoDocToLogEntry(doc: WithId<LogSchema>): LogEntry {
  const { _id, timestamp, ...rest } = doc;
  return {
    ...rest,
    id: _id.toHexString(),
    timestamp: timestamp.toISOString(),
  };
}

function mongoDocToCostReport(doc: WithId<CostReportSchema>): CostReport {
    const { _id, createdAt, ...rest } = doc;
    return {
        ...rest,
        id: _id.toHexString(),
        createdAt: createdAt.toISOString(),
    };
}

// ---- DATABASE FUNCTIONS ----

export async function logAction(
  action: string,
  level: LogLevel,
  message: string,
  userIdentifier?: string,
): Promise<void> {
  try {
    const db = await getDb();
    const logsCollection: Collection<Omit<LogSchema, '_id'>> = db.collection('logs');
    const logEntry = {
      action,
      level,
      message,
      timestamp: new Date(),
      user: userIdentifier || 'System',
    };
    await logsCollection.insertOne(logEntry);
  } catch (error) {
    console.error('[db.ts] logAction: Failed to log action:', action, error);
  }
}

export async function getSystemSettings(): Promise<SystemSettingsDocument> {
  try {
    const db = await getDb();
    const settingsCollection = db.collection('settings');
    let settings = await settingsCollection.findOne({});
    if (settings) {
      const { _id, ...rest } = settings;
      return rest as SystemSettingsDocument;
    } else {
        const defaultSettings: SystemSettingsDocument = {
            siteName: 'المحترف لحساب الكميات',
            defaultLanguage: 'ar',
            maintenanceMode: false,
            maxUploadSizeMB: 25,
            emailNotificationsEnabled: true,
            engineerApprovalRequired: true,
        };
        await settingsCollection.insertOne({ ...defaultSettings, createdAt: new Date() });
        await logAction('SYSTEM_SETTINGS_MISSING', 'WARNING', 'System settings were missing, default values created.');
        return defaultSettings;
    }
  } catch (error) {
    console.error('[db.ts] getSystemSettings: Error fetching system settings:', error);
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
    const db = await getDb();
    const settingsCollection = db.collection('settings');
    await settingsCollection.updateOne({}, { $set: { ...settings, updatedAt: new Date() } }, { upsert: true });
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
  status?: UserStatus;
}): Promise<RegistrationResult> {
    const { name, email, password_input, role, phone, status } = userData;
    try {
        const db = await getDb();
        const usersCollection: Collection<Omit<UserSchema, '_id'>> = db.collection('users');
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            await logAction('USER_REGISTRATION_FAILURE', 'WARNING', `Registration attempt for existing email: ${email}`);
            return { success: false, message: "البريد الإلكتروني مسجل بالفعل.", errorType: 'email_exists' };
        }
        
        let initialStatus: UserStatus = status || 'ACTIVE'; // Admins can set status, otherwise defaults to active

        const hashedPassword = await bcrypt.hash(password_input, 10);
        const now = new Date();
        const result = await usersCollection.insertOne({
            name,
            email,
            password_hash: hashedPassword,
            role,
            status: initialStatus,
            phone: phone || undefined,
            profileImage: `https://placehold.co/100x100.png?text=${name.substring(0, 2).toUpperCase()}`,
            createdAt: now,
            updatedAt: now,
        });

        const newUserId = result.insertedId.toHexString();
        await logAction('USER_REGISTRATION_SUCCESS', 'INFO', `User ${email} registered. Role: ${role}, Status: ${initialStatus}.`, newUserId);
        return {
            success: true,
            userId: newUserId,
            isPendingApproval: initialStatus === 'PENDING_APPROVAL',
            message: "تم إنشاء حسابك بنجاح.",
        };
    } catch (error: any) {
        await logAction('USER_REGISTRATION_FAILURE', 'ERROR', `DB error during registration for ${email}: ${error.message}`);
        return { success: false, message: "حدث خطأ أثناء إنشاء الحساب.", errorType: 'db_error' };
    }
}

export interface LoginResult {
  success: boolean;
  user?: UserDocument;
  message?: string;
  errorType?: 'email_not_found' | 'invalid_password' | 'account_suspended' | 'pending_approval' | 'account_deleted' | 'db_error' | 'other';
}

export async function loginUser(email: string, password_input: string): Promise<LoginResult> {
  try {
    const db = await getDb();
    const usersCollection = db.collection<UserSchema>('users');
    const userDoc = await usersCollection.findOne({ email });

    if (!userDoc) {
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Login attempt for non-existent email: ${email}`);
      return { success: false, message: "البريد الإلكتروني غير مسجل.", errorType: 'email_not_found' };
    }

    const passwordMatch = await bcrypt.compare(password_input, userDoc.password_hash);
    if (!passwordMatch) {
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Invalid password for user: ${email}`, userDoc._id.toHexString());
      return { success: false, message: "كلمة المرور غير صحيحة.", errorType: 'invalid_password' };
    }

    if (userDoc.status !== 'ACTIVE') {
      const errorMap = {
        'PENDING_APPROVAL': { message: "حسابك قيد المراجعة.", errorType: 'pending_approval' },
        'SUSPENDED': { message: "حسابك موقوف.", errorType: 'account_suspended' },
        'DELETED': { message: "هذا الحساب تم حذفه.", errorType: 'account_deleted' },
      };
      const errorInfo = errorMap[userDoc.status] || { message: "الحساب غير نشط.", errorType: 'other' };
      await logAction('USER_LOGIN_FAILURE', 'WARNING', `Login attempt for inactive account (${userDoc.status}): ${email}`, userDoc._id.toHexString());
      return { success: false, ...errorInfo };
    }
    
    await logAction('USER_LOGIN_SUCCESS', 'INFO', `User logged in: ${userDoc.email}`, userDoc._id.toHexString());
    const { password_hash, ...user } = mongoDocToUser(userDoc);
    return { success: true, user };
  } catch (error: any) {
    await logAction('USER_LOGIN_FAILURE', 'ERROR', `DB error on login for ${email}: ${error.message}`);
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول.", errorType: 'db_error' };
  }
}

export interface GetProjectsResult {
  success: boolean;
  projects?: Project[];
  message?: string;
}

export async function getProjects(userIdentifier: string): Promise<GetProjectsResult> {
  try {
    const db = await getDb();
    const projectsCollection = db.collection<ProjectSchema>('projects');
    const usersCollection = db.collection<UserSchema>('users');

    let query = {};

    // Handles the generic admin ID string and any user who is an admin.
    if (userIdentifier === 'admin-id') {
      query = {}; // Admin sees all projects
    } else {
      // Find the user by their unique email or their potentially non-unique name
      const user = await usersCollection.findOne({ $or: [{ email: userIdentifier }, { name: userIdentifier }] });

      if (!user) {
        await logAction('PROJECT_FETCH_FAILURE', 'WARNING', `Project fetch with unknown user: ${userIdentifier}`);
        return { success: true, projects: [] };
      }

      // Assign query based on the found user's role
      switch (user.role) {
        case 'ADMIN':
          query = {}; // Admins see all projects
          break;
        case 'OWNER':
          query = { linkedOwnerEmail: user.email };
          break;
        case 'ENGINEER':
          query = { engineer: user.name };
          break;
        default:
          // If the user has an unrecognized role, they see no projects.
          return { success: true, projects: [] };
      }
    }
    
    const projectDocs = await projectsCollection.find(query).sort({ createdAt: -1 }).toArray();
    return { success: true, projects: projectDocs.map(mongoDocToProject) };
  } catch (error: any) {
    await logAction('PROJECT_FETCH_FAILURE', 'ERROR', `Error fetching projects for ${userIdentifier}: ${error.message}`);
    return { success: false, message: "فشل تحميل المشاريع.", projects: [] };
  }
}

export async function findProjectById(projectId: string): Promise<Project | null> {
    try {
        const db = await getDb();
        const projectsCollection = db.collection<ProjectSchema>('projects');
        const projectDoc = await projectsCollection.findOne({ _id: new ObjectId(projectId) });
        return projectDoc ? mongoDocToProject(projectDoc) : null;
    } catch (error) {
        await logAction('PROJECT_FIND_BY_ID_FAILURE', 'ERROR', `Error finding project ID ${projectId}: ${error}`);
        return null;
    }
}


export async function addProject(projectData: Partial<Project>): Promise<Project | null> {
    try {
        const db = await getDb();
        const projectsCollection: Collection<Omit<ProjectSchema, '_id'>> = db.collection('projects');
        const now = new Date();
        const newProjectData = {
            name: projectData.name || "مشروع جديد",
            location: projectData.location || "غير محدد",
            description: projectData.description || "",
            startDate: projectData.startDate ? new Date(projectData.startDate) : now,
            endDate: projectData.endDate ? new Date(projectData.endDate) : now,
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

        const result = await projectsCollection.insertOne(newProjectData);
        await logAction('PROJECT_ADD_SUCCESS', 'INFO', `Project "${projectData.name}" added.`);
        return { ...mongoDocToProject({ ...newProjectData, _id: result.insertedId }) };

    } catch (error: any) {
        await logAction('PROJECT_ADD_FAILURE', 'ERROR', `Error adding project: ${error.message}`);
        return null;
    }
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<{ success: boolean; project?: Project; message?: string; }> {
    try {
        const db = await getDb();
        const projectsCollection = db.collection<ProjectSchema>('projects');
        const updateDoc: any = { ...updates };
        delete updateDoc.id; 
        if(updates.startDate) updateDoc.startDate = new Date(updates.startDate);
        if(updates.endDate) updateDoc.endDate = new Date(updates.endDate);

        const result = await projectsCollection.findOneAndUpdate(
            { _id: new ObjectId(projectId) },
            { $set: updateDoc },
            { returnDocument: 'after' }
        );
        if (result) {
            await logAction('PROJECT_UPDATE_SUCCESS', 'INFO', `Project ID ${projectId} updated. Fields: ${Object.keys(updates).join(', ')}`);
            return { success: true, project: mongoDocToProject(result) };
        }
        return { success: false, message: "المشروع غير موجود." };
    } catch (error: any) {
        await logAction('PROJECT_UPDATE_FAILURE', 'ERROR', `Error updating project ID ${projectId}: ${error.message}`);
        return { success: false, message: "فشل تحديث المشروع." };
    }
}

export async function deleteProject(projectId: string): Promise<{ success: boolean; message?: string }> {
    try {
        const db = await getDb();
        const projectsCollection = db.collection('projects');
        const result = await projectsCollection.deleteOne({ _id: new ObjectId(projectId) });
        if (result.deletedCount === 0) {
            return { success: false, message: "المشروع غير موجود ليتم حذفه." };
        }
        await logAction('PROJECT_DELETE_SUCCESS', 'INFO', `Project ID ${projectId} deleted.`);
        return { success: true, message: "تم حذف المشروع بنجاح." };
    } catch (error: any) {
        await logAction('PROJECT_DELETE_FAILURE', 'ERROR', `Error deleting project ID ${projectId}: ${error.message}`);
        return { success: false, message: "فشل حذف المشروع." };
    }
}

export async function getUsers(adminUserId: string): Promise<{ success: boolean, users?: UserDocument[], message?: string }> {
  try {
    const db = await getDb();
    const usersDocs = await db.collection<UserSchema>('users').find().toArray();
    return { success: true, users: usersDocs.map(mongoDocToUser) };
  } catch (error: any) {
    return { success: false, message: "فشل تحميل قائمة المستخدمين." };
  }
}

export async function updateUser(userId: string, updates: Partial<Omit<UserDocument, 'id'>>): Promise<{ success: boolean, user?: UserDocument, message?: string, fieldErrors?: any }> {
  try {
    const db = await getDb();
    const usersCollection = db.collection<UserSchema>('users');

    if (updates.email) {
        const emailExists = await usersCollection.findOne({ email: updates.email, _id: { $ne: new ObjectId(userId) } });
        if (emailExists) {
            return { success: false, message: "البريد الإلكتروني مستخدم بالفعل.", fieldErrors: { email: ["هذا البريد الإلكتروني مستخدم بالفعل."] } };
        }
    }
    const updateDoc: any = { ...updates, updatedAt: new Date() };
    delete updateDoc.id;

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );
    
    if (result) {
      await logAction('USER_UPDATE_SUCCESS_BY_ADMIN', 'INFO', `Admin updated user ID ${userId}.`);
      return { success: true, user: mongoDocToUser(result), message: "تم تحديث المستخدم بنجاح." };
    }
    return { success: false, message: "المستخدم غير موجود." };
  } catch (error: any) {
    await logAction('USER_UPDATE_FAILURE_BY_ADMIN', 'ERROR', `Error updating user ${userId}: ${error.message}`);
    return { success: false, message: "فشل تحديث المستخدم." };
  }
}

export async function deleteUser(userId: string): Promise<{ success: boolean, message?: string }> {
  try {
    const db = await getDb();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
    if (result.deletedCount === 0) {
      return { success: false, message: "المستخدم غير موجود." };
    }
    await logAction('USER_DELETE_SUCCESS_BY_ADMIN', 'INFO', `User ID ${userId} deleted by admin.`);
    return { success: true, message: "تم حذف المستخدم بنجاح." };
  } catch (error: any) {
    await logAction('USER_DELETE_FAILURE_BY_ADMIN', 'ERROR', `Error deleting user ${userId}: ${error.message}`);
    return { success: false, message: "فشل حذف المستخدم." };
  }
}

export async function adminResetUserPassword(adminUserId: string, targetUserId: string, newPassword_input: string): Promise<{ success: boolean, message?: string }> {
    try {
        const db = await getDb();
        const newPasswordHash = await bcrypt.hash(newPassword_input, 10);
        const result = await db.collection<UserSchema>('users').updateOne(
            { _id: new ObjectId(targetUserId) },
            { $set: { password_hash: newPasswordHash, updatedAt: new Date() } }
        );
        if (result.modifiedCount === 0) {
            return { success: false, message: "المستخدم غير موجود." };
        }
        await logAction('USER_PASSWORD_RESET_BY_ADMIN', 'INFO', `Admin ${adminUserId} reset password for user ${targetUserId}.`);
        return { success: true, message: "تم إعادة تعيين كلمة مرور المستخدم بنجاح." };
    } catch (error: any) {
        await logAction('USER_PASSWORD_RESET_FAILURE_BY_ADMIN', 'ERROR', `Error resetting password for user ${targetUserId}: ${error.message}`);
        return { success: false, message: "فشل إعادة تعيين كلمة المرور." };
    }
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
    try {
        const db = await getDb();
        const usersCollection = db.collection<UserSchema>('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(targetUserId) });
        if (!user) return { success: false, message: "المستخدم غير موجود." };
        if (user.role === 'ADMIN') return { success: false, message: "لا يمكن تعليق حساب مسؤول." };
        
        const newStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
        const result = await updateUser(targetUserId, { status: newStatus });
        
        if (result.success) {
            const actionMessage = newStatus === 'SUSPENDED' ? "تعليق المستخدم" : "إلغاء تعليق المستخدم";
            await logAction(newStatus === 'SUSPENDED' ? 'USER_SUSPEND_SUCCESS' : 'USER_UNSUSPEND_SUCCESS', 'INFO', `Admin ${adminUserId} ${newStatus} user ${targetUserId}.`);
            return { success: true, message: `تم ${actionMessage} بنجاح.` };
        }
        return { success: false, message: result.message || "فشل تعديل حالة المستخدم." };
    } catch (error: any) {
        await logAction('USER_SUSPEND_FAILURE', 'ERROR', `Error suspending user ${targetUserId}: ${error.message}`);
        return { success: false, message: "فشل تعديل حالة المستخدم." };
    }
}

export async function getLogs(): Promise<LogEntry[]> {
    try {
        const db = await getDb();
        const logDocs = await db.collection<LogSchema>('logs').find().sort({ timestamp: -1 }).toArray();
        return logDocs.map(mongoDocToLogEntry);
    } catch (error) {
        console.error("Error fetching logs from DB:", error);
        return [];
    }
}


export interface ChangePasswordResult {
  success: boolean;
  message?: string;
  errorType?: 'user_not_found' | 'invalid_current_password' | 'db_error';
}

export async function changeUserPassword(userId: string, currentPassword_input: string, newPassword_input: string): Promise<ChangePasswordResult> {
    try {
        const db = await getDb();
        const usersCollection = db.collection<UserSchema>('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) return { success: false, message: "المستخدم غير موجود.", errorType: 'user_not_found' };

        const passwordMatch = await bcrypt.compare(currentPassword_input, user.password_hash);
        if (!passwordMatch) {
            return { success: false, message: "كلمة المرور الحالية غير صحيحة.", errorType: 'invalid_current_password' };
        }
        
        const newPasswordHash = await bcrypt.hash(newPassword_input, 10);
        await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { password_hash: newPasswordHash, updatedAt: new Date() } });
        
        await logAction('USER_PASSWORD_CHANGE_SUCCESS', 'INFO', `User ${userId} changed their password.`, userId);
        return { success: true, message: "تم تغيير كلمة المرور بنجاح." };
    } catch (error: any) {
        await logAction('USER_PASSWORD_CHANGE_FAILURE', 'ERROR', `Error changing password for user ${userId}: ${error.message}`);
        return { success: false, message: "فشل تغيير كلمة المرور.", errorType: 'db_error' };
    }
}

export async function addCostReport(reportData: Omit<CostReport, 'id' | 'createdAt'>): Promise<CostReport | null> {
    try {
        const db = await getDb();
        const reportsCollection: Collection<Omit<CostReportSchema, '_id'>> = db.collection('costReports');
        const newReportData = {
            ...reportData,
            createdAt: new Date(),
        };
        const result = await reportsCollection.insertOne(newReportData);
        await logAction('COST_REPORT_ADD_SUCCESS', 'INFO', `Cost report "${reportData.reportName}" added by engineer ${reportData.engineerName}.`);
        return mongoDocToCostReport({ ...newReportData, _id: result.insertedId });
    } catch (error: any) {
        await logAction('COST_REPORT_ADD_FAILURE', 'ERROR', `Error adding cost report: ${error.message}`);
        return null;
    }
}
