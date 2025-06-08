// mock-db.ts

// أنواع الأدوار
export type Role = 'Admin' | 'Engineer' | 'Owner' | 'GeneralUser';
export type UserStatus = 'Active' | 'Pending Approval' | 'Suspended';

// نموذج لتمثيل Use Case
export interface UseCase {
  id: number;
  title: string;
  role: Role;
  description: string;
  dependsOn?: number[]; // IDs of other use cases it depends on
}

// نموذج لتمثيل مستخدم 
// Updated User interface to include email, password, and status for login/signup and admin management
export interface User {
  id: string; // Changed to string to match crypto.randomUUID()
  name: string;
  email: string;
  password?: string; // Storing password for mock login; hash in real app
  role: Role;
  status: UserStatus;
}

// نموذج مشروع 
// Kept user's Project interface
export interface Project {
  id: number;
  name: string;
  engineerId: number;
  ownerId: number;
  status: 'active' | 'archived';
}

// بيانات الأدوار
export const roles: Role[] = ['Admin', 'Engineer', 'Owner', 'GeneralUser'];

// بيانات المستخدمين - Initialized with only the admin user.
export let dbUsers: User[] = [
  { id: crypto.randomUUID(), name: "Ameed Admin", email: "ameed@admin.com", password: "password123", role: "Admin", status: "Active" },
];

// بيانات المشاريع
export let dbProjects: Project[] = [
  { id: 1, name: 'مشروع الإسكان', engineerId: 0, ownerId: 0, status: 'active' }, // Placeholder IDs, engineer/owner IDs might need to match actual user IDs if linked
];

// بيانات الـ Use Cases
export const useCases: UseCase[] = [
  // General User
  { id: 1, title: 'Sign Up', role: 'GeneralUser', description: 'تسجيل كمستخدم جديد' },
  { id: 2, title: 'Login', role: 'GeneralUser', description: 'تسجيل الدخول', dependsOn: [1] },
  { id: 3, title: 'Manage Profile', role: 'GeneralUser', description: 'إدارة البيانات الشخصية', dependsOn: [2] },
  { id: 4, title: 'Forgot Password', role: 'GeneralUser', description: 'استعادة كلمة المرور' },

  // Owner
  { id: 5, title: 'View My Projects', role: 'Owner', description: 'عرض المشاريع المرتبطة بك', dependsOn: [2] },
  { id: 6, title: 'Monitor Construction Project Progress', role: 'Owner', description: 'متابعة تقدم المشروع', dependsOn: [5] },
  { id: 7, title: 'View Summarized Quantity Reports', role: 'Owner', description: 'عرض تقارير الكميات المجملة', dependsOn: [6] },
  { id: 8, title: 'View Progress Photos/Videos', role: 'Owner', description: 'مشاهدة الصور والفيديوهات', dependsOn: [6] },
  { id: 9, title: 'Add Comments/Inquiries', role: 'Owner', description: 'إرسال استفسارات وتعليقات', dependsOn: [6] },
  { id: 10, title: 'View Project Timeline', role: 'Owner', description: 'عرض الجدول الزمني للمشروع', dependsOn: [6] },

  // Engineer
  { id: 11, title: 'Create New Construction Project', role: 'Engineer', description: 'إنشاء مشروع جديد' },
  { id: 12, title: 'Link Owner to Project', role: 'Engineer', description: 'ربط المشروع بالمالك', dependsOn: [11] },
  { id: 13, title: 'Define Construction Stages', role: 'Engineer', description: 'تحديد مراحل المشروع', dependsOn: [12] },
  { id: 14, title: 'Input Structural Element Details', role: 'Engineer', description: 'إدخال تفاصيل العناصر الإنشائية', dependsOn: [13] },
  { id: 15, title: 'Validate Input Data', role: 'Engineer', description: 'التحقق من صحة البيانات', dependsOn: [14] },
  { id: 16, title: 'Calculate Material Quantities', role: 'Engineer', description: 'حساب كميات المواد', dependsOn: [15] },
  { id: 17, title: 'Generate Report Data', role: 'Engineer', description: 'توليد بيانات التقرير', dependsOn: [16] },
  { id: 18, title: 'View Quantity Reports', role: 'Engineer', description: 'عرض تقارير الكميات', dependsOn: [17] },
  { id: 19, title: 'Customize Report Display', role: 'Engineer', description: 'تخصيص عرض التقرير', dependsOn: [18] },
  { id: 20, title: 'Update Construction Progress', role: 'Engineer', description: 'تحديث تقدم المشروع', dependsOn: [13] },
  { id: 21, title: 'Add Progress Notes', role: 'Engineer', description: 'إضافة ملاحظات حول التقدم', dependsOn: [20] },
  { id: 22, title: 'Upload Progress Photos/Videos', role: 'Engineer', description: 'رفع الصور والفيديوهات', dependsOn: [20] },
  { id: 23, title: 'Manage Construction Projects', role: 'Engineer', description: 'إدارة المشاريع الحالية' },
  { id: 24, title: 'Archive Project', role: 'Engineer', description: 'أرشفة المشروع', dependsOn: [20] },

  // Admin
  { id: 25, title: 'View All Users', role: 'Admin', description: 'عرض كل المستخدمين' },
  { id: 26, title: 'Edit User Details', role: 'Admin', description: 'تعديل بيانات المستخدم', dependsOn: [25] },
  { id: 27, title: 'Reset User Password', role: 'Admin', description: 'إعادة تعيين كلمة المرور', dependsOn: [25] },
  { id: 28, title: 'View All Projects', role: 'Admin', description: 'عرض كل المشاريع' },
  { id: 29, title: 'Delete Project', role: 'Admin', description: 'حذف مشروع نهائيًا', dependsOn: [28] },
  { id: 30, title: 'Configure System Settings', role: 'Admin', description: 'إعدادات النظام' },
  { id: 31, title: 'Review System Logs', role: 'Admin', description: 'مراجعة سجلات النظام' },
];

// Helper functions for user management
export function findUserByEmail(email: string): User | undefined {
  return dbUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function addUser(userData: Omit<User, 'id' | 'status' | 'password'> & { password?: string, role: 'Owner' | 'Engineer' }): User {
  const newUser: User = {
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: userData.password, 
    role: userData.role,
    id: crypto.randomUUID(),
    status: userData.role === 'Engineer' ? 'Pending Approval' : 'Active',
  };
  dbUsers.push(newUser);
  return newUser;
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const userIndex = dbUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return null;
  }
  dbUsers[userIndex] = { ...dbUsers[userIndex], ...updates };
  return dbUsers[userIndex];
}

export function deleteUser(userId: string): boolean {
  const initialLength = dbUsers.length;
  dbUsers = dbUsers.filter(u => u.id !== userId);
  return dbUsers.length < initialLength;
}

// Add other necessary types and data for admin pages if they were removed:
// For example, ProjectStatusType and LogLevel types for other admin pages
export type ProjectStatusType = 'مكتمل' | 'قيد التنفيذ' | 'مخطط له' | 'مؤرشف';
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  user?: string; // User who performed the action, or system
}

export interface SystemSettings {
  siteName: string;
  defaultLanguage: 'ar' | 'en';
  maintenanceMode: boolean;
  maxUploadSizeMB: number;
  emailNotificationsEnabled: boolean;
}

// These were part of the original mock-db and might be needed by admin pages
// that were not part of the user's schema update.
// If Project types clash, we'll need to resolve that.
// For now, I'll assume the admin pages use a more detailed Project type.
export interface FullProject extends Project { // Extending the user's Project type
  location?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  engineer?: string; // This was engineerId in user's Project
  clientName?: string; // ownerId was in user's Project
  budget?: number;
  overallProgress: number;
  // status: ProjectStatusType; // This is 'active' | 'archived' in user's Project
  photos?: ProjectPhoto[];
  timelineTasks?: TimelineTask[];
  comments?: ProjectComment[];
  quantitySummary?: string;
  linkedOwnerEmail?: string;
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
  startDate: string;
  endDate: string;
  status: 'مكتمل' | 'قيد التنفيذ' | 'مخطط له';
  progress?: number; // Optional: specific progress for this task
  color: string; // Example: 'bg-blue-500'
}

export interface ProjectComment {
  id: string;
  user: string;
  avatar?: string;
  dataAiHintAvatar?: string;
  text: string;
  date: string;
}

// Re-populate dbProjects with richer structure if admin/project pages need it.
// For now, we'll keep the user's simpler dbProjects structure.
// If errors arise, we'll need to merge or choose one.

// Mock System Settings
export let dbSettings: SystemSettings = {
  siteName: "المحترف لحساب الكميات",
  defaultLanguage: "ar",
  maintenanceMode: false,
  maxUploadSizeMB: 25,
  emailNotificationsEnabled: true,
};

// Mock System Logs
export let dbLogs: LogEntry[] = [
  { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 1000 * 60 * 5), level: 'INFO', message: 'تم تسجيل دخول المستخدم admin@example.com بنجاح.', user: 'admin@example.com' },
  { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 1000 * 60 * 10), level: 'WARNING', message: 'محاولة تسجيل دخول فاشلة للحساب userX.', user: 'النظام' },
  { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 1000 * 60 * 15), level: 'SUCCESS', message: 'تم إنشاء مشروع "بناء فيلا سكنية" بنجاح.', user: 'engineer@example.com' },
  { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 1000 * 60 * 20), level: 'ERROR', message: 'فشل في الاتصال بخادم البريد الإلكتروني.', user: 'النظام' },
];

// Functions for Project management used by Admin/Projects page might need to be re-added
// For now, Admin/Projects page has its own state management based on initial dbProjects.
// If "deleteProject" is needed from mock-db by other parts, it should be added.
// Example:
export function deleteProject(projectId: string | number ): boolean {
  // const initialLength = dbProjects.length;
  // dbProjects = dbProjects.filter(p => p.id !== projectId);
  // return dbProjects.length < initialLength;
  // The above line is commented out because the user's project ID is a number,
  // but other project pages use string IDs and a more complex project structure.
  // This needs to be reconciled based on which project structure is canonical.
  // For now, to avoid breaking the Admin page that uses `dbDeleteProject(projectId: string)`,
  // we'll keep the original logic that expects string IDs and the FullProject structure
  // if that was the original intent for admin pages.
  // This highlights a discrepancy that needs resolving.
  // Let's assume the admin page uses string IDs for projects.
  // If user's `dbProjects` (with number IDs) is the source of truth, this function won't work.
  console.warn("deleteProject called, but project ID types and structures might be inconsistent.");
  return false; // Placeholder to avoid error, actual logic depends on chosen Project structure
}


// Helper for finding a project by ID (assuming string ID from FullProject context)
export function findProjectById(projectId: string): FullProject | undefined {
  // This function expects string IDs and the FullProject structure.
  // If user's `dbProjects` is the primary source, this needs adjustment.
  // For now, this is a placeholder.
  // return dbProjectsFull.find(p => p.id === projectId); // Assuming a dbProjectsFull array exists
  console.warn("findProjectById called, but relies on a potentially different project structure (FullProject).");
  return undefined;
}

// Helper for updating a project (assuming string ID and FullProject structure)
export function updateProject(projectId: string, updates: Partial<FullProject>): FullProject | null {
    console.warn("updateProject called, but relies on a potentially different project structure (FullProject).");
    // const projectIndex = dbProjectsFull.findIndex(p => p.id === projectId);
    // if (projectIndex === -1) return null;
    // dbProjectsFull[projectIndex] = { ...dbProjectsFull[projectIndex], ...updates };
    // return dbProjectsFull[projectIndex];
    return null; // Placeholder
}


// Helper for adding a project (assuming FullProject structure, but taking simpler input)
export function addProject(projectData: Omit<FullProject, 'id' | 'overallProgress' | 'status' | 'photos' | 'timelineTasks' | 'comments'>): FullProject {
    const newProject: FullProject = {
        ...projectData,
        id: crypto.randomUUID(),
        overallProgress: 0,
        status: 'مخطط له', // Default status
        photos: [],
        timelineTasks: [],
        comments: [],
        quantitySummary: projectData.quantitySummary || "لم يتم إضافة ملخص كميات بعد."
    };
    // dbProjectsFull.push(newProject); // Assuming a dbProjectsFull array exists
    // For now, to make it work with the user's simpler dbProjects array, we adapt:
    const simpleProject: Project = {
      id: dbProjects.length > 0 ? Math.max(...dbProjects.map(p => p.id)) + 1 : 1,
      name: newProject.name,
      engineerId: 0, // Placeholder
      ownerId: 0, // Placeholder
      status: 'active' // Match user's Project status type
    };
    dbProjects.push(simpleProject);
    // This is not ideal as it doesn't save the full details.
    // The FullProject structure should be used consistently if it's the desired one.
    console.warn("addProject is adding to the user's simpler 'dbProjects' array, potentially losing detail from FullProject structure.");
    return newProject; // Return the FullProject structure even if only a simpler version is saved to user's dbProjects
}

    