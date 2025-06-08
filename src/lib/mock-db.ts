// mock-db.ts

// أنواع الأدوار
export type Role = 'Admin' | 'Engineer' | 'Owner' | 'GeneralUser';
export type UserRole = 'Admin' | 'Engineer' | 'Owner'; // For actual app roles
export type UserStatus = 'Active' | 'Pending Approval' | 'Suspended';

// نموذج لتمثيل Use Case
export interface UseCase {
  id: number;
  title: string;
  role: Role; // Can be GeneralUser for some use cases
  description: string;
  dependsOn?: number[];
}

// نموذج لتمثيل مستخدم
export interface User {
  id: string; // Using string for UUIDs
  name: string;
  email: string;
  password_hash: string; // Changed from password
  role: UserRole; // Specific app roles
  status: UserStatus;
}

export type ProjectStatusType = 'مكتمل' | 'قيد التنفيذ' | 'مخطط له' | 'مؤرشف';

// نموذج مشروع وهمي (as used by admin/projects page)
export interface Project {
  id: number; // Kept as number based on admin/projects page usage
  name: string;
  engineerId: number; // Corresponds to User.id (but User.id is string, potential mismatch if not handled)
  ownerId: number;    // Corresponds to User.id (but User.id is string, potential mismatch if not handled)
  status: ProjectStatusType; // Updated to use ProjectStatusType
  engineer?: string; // Optional: for direct display on admin/projects page
  clientName?: string; // Optional: for direct display on admin/projects page
}


// بيانات الأدوار
export const roles: Role[] = ['Admin', 'Engineer', 'Owner', 'GeneralUser'];

// بيانات المستخدمين
export let dbUsers: User[] = [
  { id: crypto.randomUUID(), name: 'Admin User', email: 'ameed@admin.com', password_hash: 'password123', role: 'Admin', status: 'Active' },
  // { id: crypto.randomUUID(), name: 'Eng. Ahmad', email: 'eng@example.com', password_hash: 'password123', role: 'Engineer', status: 'Active' },
  // { id: crypto.randomUUID(), name: 'Owner Sami', email: 'owner@example.com', password_hash: 'password123', role: 'Owner', status: 'Active' },
];

// بيانات المشاريع (Exported as dbProjects to match admin page import)
export let dbProjects: Project[] = [
  { id: 1, name: 'مشروع الإسكان النموذجي', engineerId: 2, ownerId: 3, status: 'قيد التنفيذ', engineer: 'م. أحمد خالد', clientName: 'سامر عبدالله' },
  { id: 2, name: 'بناء فيلا سكنية', engineerId: 2, ownerId: 3, status: 'مخطط له', engineer: 'م. أحمد خالد', clientName: 'ليلى المصري' },
  { id: 3, name: 'تطوير مجمع تجاري', engineerId: 2, ownerId: 3, status: 'مكتمل', engineer: 'م. أحمد خالد', clientName: 'شركة الاستثمار' },
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

export function addUser(userData: Pick<User, 'name' | 'email' | 'password_hash' | 'role'>): User {
  const newUser: User = {
    ...userData,
    email: userData.email.toLowerCase(),
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
  const { id, role, email, ...safeUpdates } = updates;
  dbUsers[userIndex] = { ...dbUsers[userIndex], ...safeUpdates };
  return dbUsers[userIndex];
}

export function deleteUser(userId: string): boolean {
  const initialLength = dbUsers.length;
  dbUsers = dbUsers.filter(u => u.id !== userId);
  return dbUsers.length < initialLength;
}

// Helper function for project deletion (used by admin/projects page)
export function deleteProject(projectIdString: string): boolean {
  const projectId = parseInt(projectIdString, 10);
  if (isNaN(projectId)) {
    return false; // Invalid ID format
  }
  const initialLength = dbProjects.length;
  dbProjects = dbProjects.filter(p => p.id !== projectId);
  return dbProjects.length < initialLength;
}


// --- System Settings and Logs ---
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  user?: string;
}

export interface SystemSettings {
  siteName: string;
  defaultLanguage: 'ar' | 'en';
  maintenanceMode: boolean;
  maxUploadSizeMB: number;
  emailNotificationsEnabled: boolean;
}

export let dbSettings: SystemSettings = {
  siteName: "المحترف لحساب الكميات",
  defaultLanguage: "ar",
  maintenanceMode: false,
  maxUploadSizeMB: 25,
  emailNotificationsEnabled: true,
};

export let dbLogs: LogEntry[] = [
  { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 1000 * 60 * 5), level: 'INFO', message: 'تم تسجيل دخول المستخدم ameed@admin.com بنجاح.', user: 'ameed@admin.com' },
  { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 1000 * 60 * 10), level: 'WARNING', message: 'محاولة تسجيل دخول فاشلة للحساب userX.', user: 'النظام' },
];

// --- More Detailed Project Structure (FullProject) ---
// This structure is used by my-projects/[projectId] page and potentially create-project page.
// It uses string IDs for consistency with User IDs.
export interface FullProject {
  id: string;
  name: string;
  location?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  engineer?: string;
  clientName?: string;
  budget?: number;
  overallProgress: number;
  status: ProjectStatusType;
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
  progress?: number;
  color: string; // Example: 'bg-blue-500'
}

export interface ProjectComment {
  id: string;
  user: string; // Name of the user or "المالك", "المهندس (أنت)"
  avatar?: string;
  dataAiHintAvatar?: string;
  text: string;
  date: string; // YYYY-MM-DD
}

// This dbProjectsFull is for the more detailed project structure.
export let dbProjectsFull: FullProject[] = [
    {
    id: crypto.randomUUID(),
    name: "مشروع بناء فيلا الأحلام",
    location: "الرياض، حي الياسمين",
    description: "فيلا سكنية مكونة من طابقين مع مسبح وحديقة.",
    startDate: "2024-01-15",
    endDate: "2024-12-20",
    engineer: "م. خالد عبدالرحمن",
    clientName: "عبدالله السالم",
    budget: 2500000,
    overallProgress: 65,
    status: "قيد التنفيذ",
    linkedOwnerEmail: "owner@example.com", // Example linked owner
    photos: [
      { id: crypto.randomUUID(), src: "https://placehold.co/600x400.png?text=Villa+Exterior", alt: "الواجهة الخارجية للفيلا", caption: "الواجهة قيد الإنشاء", dataAiHint: "modern villa" },
      { id: crypto.randomUUID(), src: "https://placehold.co/600x400.png?text=Foundation+Works", alt: "أعمال الأساسات", caption: "صب القواعد", dataAiHint: "construction foundation" },
    ],
    timelineTasks: [
      { id: crypto.randomUUID(), name: "أعمال الحفر والأساسات", startDate: "2024-01-15", endDate: "2024-03-01", status: "مكتمل", progress: 100, color: "bg-green-500" },
      { id: crypto.randomUUID(), name: "الهيكل الخرساني", startDate: "2024-03-02", endDate: "2024-06-30", status: "قيد التنفيذ", progress: 70, color: "bg-yellow-500" },
      { id: crypto.randomUUID(), name: "أعمال التشطيبات الداخلية", startDate: "2024-07-01", endDate: "2024-10-31", status: "مخطط له", progress: 0, color: "bg-blue-500" },
    ],
    comments: [
      { id: crypto.randomUUID(), user: "م. خالد عبدالرحمن", text: "تم الانتهاء من صب أعمدة الطابق الأول.", date: "2024-05-10", avatar: "https://placehold.co/40x40.png?text=EN", dataAiHintAvatar: "engineer photo" },
      { id: crypto.randomUUID(), user: "المالك", text: "متى يمكنني زيارة الموقع؟", date: "2024-05-12", avatar: "https://placehold.co/40x40.png?text=OW", dataAiHintAvatar: "client photo" },
    ],
    quantitySummary: "الباطون: 120 م³ (حتى الآن), الحديد: 15 طن (حتى الآن)",
  },
];

export function findProjectById(projectId: string): FullProject | undefined {
  return dbProjectsFull.find(p => p.id === projectId);
}

// Renamed to avoid conflict with the simpler addProject which might be used by admin if it adds to dbProjects (number ID)
export function addFullProject(projectData: Omit<FullProject, 'id' | 'overallProgress' | 'status' | 'photos' | 'timelineTasks' | 'comments'>): FullProject {
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
    dbProjectsFull.push(newProject);

    // Also, add a simplified version to dbProjects for the admin panel if an engineer creates it
    // This part is a bit of a hack due to two different project structures.
    // A more robust solution would unify these.
    if (projectData.engineer) {
        const simplifiedProject: Project = {
            id: dbProjects.length > 0 ? Math.max(...dbProjects.map(p => p.id)) + 1 : 1, // Ensure unique numeric ID
            name: newProject.name,
            engineerId: 0, // Placeholder, actual engineer ID linking would be complex with string/number mismatch
            ownerId: 0, // Placeholder
            status: 'مخطط له',
            engineer: newProject.engineer,
            clientName: newProject.clientName
        };
        dbProjects.push(simplifiedProject);
    }
    return newProject;
}

// Renamed to avoid conflict
export function updateFullProject(projectId: string, updates: Partial<FullProject>): FullProject | null {
    const projectIndex = dbProjectsFull.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return null;

    const oldProject = dbProjectsFull[projectIndex];
    dbProjectsFull[projectIndex] = { ...oldProject, ...updates };

    // Also update the simplified version in dbProjects if it exists
    // This again assumes name is unique enough for this hacky sync.
    const simplifiedProjectIndex = dbProjects.findIndex(p => p.name === oldProject.name);
    if (simplifiedProjectIndex !== -1) {
        const simplifiedUpdates: Partial<Project> = {};
        if (updates.name) simplifiedUpdates.name = updates.name;
        if (updates.status) simplifiedUpdates.status = updates.status;
        if (updates.engineer) simplifiedUpdates.engineer = updates.engineer;
        if (updates.clientName) simplifiedUpdates.clientName = updates.clientName;
        dbProjects[simplifiedProjectIndex] = { ...dbProjects[simplifiedProjectIndex], ...simplifiedUpdates };
    }

    return dbProjectsFull[projectIndex];
}

// This is the function name the engineer/create-project page expects for adding.
// It will call addFullProject internally.
export const addProject = addFullProject;
// This is the function name my-projects/[projectId] page expects for updating.
export const updateProject = updateFullProject;
