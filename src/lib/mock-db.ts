
// mock-db.ts

/**
 * أنواع الأدوار
 */
export type Role = 'Admin' | 'Engineer' | 'Owner' | 'GeneralUser'; // Broader Role for use cases
export type UserRole = 'Admin' | 'Engineer' | 'Owner'; // Specific for User objects
export type UserStatus = 'Active' | 'Pending Approval' | 'Suspended';

/**
 * نموذج المستخدم
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string; // Storing plain text password for now
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
}

// --- Log Structures (Retained and used by new functions) ---
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  user?: string; // User email or 'النظام'
}
export let dbLogs: LogEntry[] = [
  { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 1000 * 60 * 5), level: 'INFO', message: 'تم تسجيل دخول المستخدم admin@example.com بنجاح.', user: 'admin@example.com' },
  { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 1000 * 60 * 10), level: 'WARNING', message: 'محاولة تسجيل دخول فاشلة للحساب userX.', user: 'النظام' },
];


/**
 * بيانات المستخدمين الأولية
 */
export let dbUsers: User[] = [
  {
    id: crypto.randomUUID(),
    name: 'مدير النظام',
    email: 'admin@example.com',
    password_hash: 'adminpass', // Plain text password for now
    role: 'Admin',
    status: 'Active',
    createdAt: new Date()
  }
];

/**
 * تسجيل مستخدم جديد
 */
export function registerUser(userData: {
  name: string;
  email: string;
  password_hash: string; // Expecting plain text password from action
  role: 'Engineer' | 'Owner';
}): { success: boolean; user?: User; message?: string } {
  const existingUser = dbUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existingUser) {
    return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
  }

  const status: UserStatus = userData.role === 'Engineer' ? 'Pending Approval' : 'Active';

  const newUser: User = {
    id: crypto.randomUUID(),
    name: userData.name,
    email: userData.email.toLowerCase(),
    password_hash: userData.password_hash, // Storing plain text password
    role: userData.role,
    status,
    createdAt: new Date()
  };

  dbUsers.push(newUser);
  console.log("[registerUser] User added to dbUsers:", JSON.stringify(newUser, null, 2));
  console.log("[registerUser] dbUsers now contains:", JSON.stringify(dbUsers, null, 2));

  dbLogs.push({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    level: 'INFO',
    message: `تم تسجيل مستخدم جديد: ${newUser.name} (${newUser.role})`,
    user: 'System'
  });

  return { success: true, user: newUser };
}

/**
 * تسجيل الدخول
 */
export function loginUser(email: string, passwordInClear: string): { success: boolean; user?: User; message?: string } {
  const user = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    console.log(`[loginUser] User not found for email: ${email}`);
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }

  // Comparing plain text password with stored plain text password_hash
  if (user.password_hash !== passwordInClear) {
    console.log(`[loginUser] Password mismatch for user: ${email}`);
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }

  if (user.status === 'Suspended') {
    console.log(`[loginUser] Account suspended for user: ${email}`);
    return { success: false, message: 'حسابك موقوف. يرجى التواصل مع الإدارة' };
  }

  if (user.status === 'Pending Approval') {
    console.log(`[loginUser] Account pending approval for user: ${email}`);
    return { success: false, message: 'حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه' };
  }

  dbLogs.push({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    level: 'SUCCESS',
    message: `تم تسجيل دخول المستخدم ${user.email}`,
    user: user.email
  });
  console.log(`[loginUser] Login successful for user: ${email}`);
  return { success: true, user };
}

/**
 * الموافقة على حساب مهندس (بواسطة الأدمن)
 */
export function approveEngineer(adminId: string, engineerId: string): { success: boolean; message?: string } {
  const admin = dbUsers.find(u => u.id === adminId && u.role === 'Admin');
  if (!admin) {
    return { success: false, message: 'ليست لديك صلاحية الموافقة على الحسابات' };
  }

  const engineer = dbUsers.find(u => u.id === engineerId && u.role === 'Engineer');
  if (!engineer) {
    return { success: false, message: 'المستخدم غير موجود أو ليس مهندساً' };
  }

  if (engineer.status !== 'Pending Approval') {
    return { success: false, message: 'حساب المهندس ليس في انتظار الموافقة' };
  }

  engineer.status = 'Active';

  dbLogs.push({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    level: 'INFO',
    message: `تمت الموافقة على حساب المهندس ${engineer.name} بواسطة ${admin.name}`,
    user: admin.email
  });
  console.log(`[approveEngineer] Engineer ${engineer.name} approved by ${admin.name}`);
  return { success: true };
}

/**
 * الحصول على قائمة المهندسين المنتظرين الموافقة
 */
export function getPendingEngineers(adminId: string): User[] | { error: string } {
  const admin = dbUsers.find(u => u.id === adminId && u.role === 'Admin');
  if (!admin) {
    return { error: 'غير مصرح بالوصول' };
  }
  return dbUsers.filter(u => u.role === 'Engineer' && u.status === 'Pending Approval');
}

// --- Retained UserCase Structures & Data ---
export interface UseCase {
  id: number;
  title: string;
  role: Role; // Uses the broader Role type
  description: string;
  dependsOn?: number[];
}
export const roles: Role[] = ['Admin', 'Engineer', 'Owner', 'GeneralUser'];
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

// --- Retained Project Structures & Data ---
export type ProjectStatusType = 'مكتمل' | 'قيد التنفيذ' | 'مخطط له' | 'مؤرشف';

// Simplified Project structure for admin listing
export interface Project {
  id: number;
  name: string;
  engineerId?: number;
  ownerId?: number;
  status: ProjectStatusType; // Updated to use ProjectStatusType
  engineer?: string;
  clientName?: string;
}

export let dbProjects: Project[] = [
  { id: 1, name: 'مشروع الإسكان النموذجي', status: 'قيد التنفيذ', engineer: 'م. أحمد خالد', clientName: 'سامر عبدالله' },
  { id: 2, name: 'بناء فيلا سكنية', status: 'مخطط له', engineer: 'م. ليلى محمود', clientName: 'شركة التطوير العقاري' },
  { id: 3, name: 'تطوير مجمع تجاري', status: 'مكتمل', engineer: 'م. عمر حسن', clientName: 'مجموعة الاستثمار الدولية' },
];

// Retained function for admin page to delete projects by numeric ID
export function deleteProject(projectIdString: string): boolean {
  const projectId = parseInt(projectIdString, 10);
  if (isNaN(projectId)) {
    console.error("[deleteProject] Invalid project ID format:", projectIdString);
    return false;
  }
  const initialLength = dbProjects.length;
  dbProjects = dbProjects.filter(p => p.id !== projectId);
  const success = dbProjects.length < initialLength;
  if (success) {
    console.log("[deleteProject] Project with id", projectId, "deleted from dbProjects.");
    dbLogs.push({id: crypto.randomUUID(), timestamp: new Date(), level: 'INFO', message: `Admin deleted project ID ${projectId}`, user: 'AdminAction'});
  } else {
    console.log("[deleteProject] Project with id", projectId, "not found in dbProjects.");
  }
  return success;
}

// --- Retained Detailed Project Structures & Data ---
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
  color: string;
}

export interface ProjectComment {
  id: string;
  user: string;
  avatar?: string;
  dataAiHintAvatar?: string;
  text: string;
  date: string;
}

export interface FullProject {
  id: string; // UUID for detailed projects
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
    linkedOwnerEmail: "owner@example.com",
    photos: [
      { id: crypto.randomUUID(), src: "https://placehold.co/600x400.png?text=Villa+Exterior", alt: "الواجهة الخارجية للفيلا", caption: "الواجهة قيد الإنشاء", dataAiHint: "modern villa" },
      { id: crypto.randomUUID(), src: "https://placehold.co/600x400.png?text=Foundation+Works", alt: "أعمال الأساسات", caption: "صب القواعد", dataAiHint: "construction foundation" },
    ],
    timelineTasks: [
      { id: crypto.randomUUID(), name: "أعمال الحفر والأساسات", startDate: "2024-01-15", endDate: "2024-03-01", status: "مكتمل", progress: 100, color: "bg-green-500" },
      { id: crypto.randomUUID(), name: "الهيكل الخرساني", startDate: "2024-03-02", endDate: "2024-06-30", status: "قيد التنفيذ", progress: 70, color: "bg-yellow-500" },
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

export function addFullProject(projectData: Omit<FullProject, 'id' | 'overallProgress' | 'status' | 'photos' | 'timelineTasks' | 'comments'>): FullProject {
  const newProject: FullProject = {
    ...projectData,
    id: crypto.randomUUID(),
    overallProgress: 0,
    status: 'مخطط له',
    photos: [],
    timelineTasks: [],
    comments: [],
    quantitySummary: projectData.quantitySummary || "لم يتم إضافة ملخص كميات بعد."
  };
  dbProjectsFull.push(newProject);
  dbLogs.push({id: crypto.randomUUID(), timestamp: new Date(), level: 'INFO', message: `New detailed project added: ${newProject.name}`, user: 'System'});
  if (projectData.engineer) {
    const simplifiedProject: Project = {
      id: dbProjects.length > 0 ? Math.max(...dbProjects.map(p => p.id)) + 1 : 1,
      name: newProject.name,
      status: 'مخطط له',
      engineer: newProject.engineer,
      clientName: newProject.clientName
    };
    dbProjects.push(simplifiedProject);
  }
  return newProject;
}

export function updateFullProject(projectId: string, updates: Partial<FullProject>): FullProject | null {
  const projectIndex = dbProjectsFull.findIndex(p => p.id === projectId);
  if (projectIndex === -1) return null;
  const oldProject = dbProjectsFull[projectIndex];
  dbProjectsFull[projectIndex] = { ...oldProject, ...updates };
  dbLogs.push({id: crypto.randomUUID(), timestamp: new Date(), level: 'INFO', message: `Detailed project updated: ${dbProjectsFull[projectIndex].name}`, user: 'System'});

  const simplifiedProjectToUpdate = dbProjects.find(p => p.name === oldProject.name);
  if (simplifiedProjectToUpdate) {
    const simplifiedProjectIndex = dbProjects.indexOf(simplifiedProjectToUpdate);
    const simplifiedUpdates: Partial<Project> = {};
    if (updates.name) simplifiedUpdates.name = updates.name;
    if (updates.status) simplifiedUpdates.status = updates.status;
    if (updates.engineer) simplifiedUpdates.engineer = updates.engineer;
    if (updates.clientName) simplifiedUpdates.clientName = updates.clientName;
    dbProjects[simplifiedProjectIndex] = { ...dbProjects[simplifiedProjectIndex], ...simplifiedUpdates };
  }
  return dbProjectsFull[projectIndex];
}

export const addProject = addFullProject;
export const updateProject = updateFullProject;

// --- Retained System Settings ---
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

// Helper function for finding user by email, can be used internally by actions if needed.
export function findUserByEmail(email: string): User | undefined {
  console.log("[findUserByEmail] Searching for email:", email);
  const foundUser = dbUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (foundUser) {
    console.log("[findUserByEmail] User found:", JSON.stringify(foundUser, null, 2));
  } else {
    console.log("[findUserByEmail] User NOT found for email:", email);
  }
  return foundUser;
}

// Re-adding updateUser and deleteUser, adapted for the new User structure, as they are critical for admin page.
export function updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>): User | null {
  const userIndex = dbUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return null;
  }
  // Prevent changing id, email, createdAt, role directly for simplicity of this mock.
  // Role is part of Omit, so it cannot be changed here. Status can be.
  const { role, ...safeUpdates } = updates; 
  dbUsers[userIndex] = { ...dbUsers[userIndex], ...safeUpdates };
  dbLogs.push({id: crypto.randomUUID(), timestamp: new Date(), level: 'INFO', message: `User ${dbUsers[userIndex].email} updated by admin.`, user: 'AdminAction'});
  console.log("[updateUser] User updated:", JSON.stringify(dbUsers[userIndex], null, 2));
  return dbUsers[userIndex];
}

export function deleteUser(userId: string): boolean {
  const initialLength = dbUsers.length;
  const userToDelete = dbUsers.find(u => u.id === userId);
  if (!userToDelete) return false;

  dbUsers = dbUsers.filter(u => u.id !== userId);
  const success = dbUsers.length < initialLength;
  if (success) {
    dbLogs.push({id: crypto.randomUUID(), timestamp: new Date(), level: 'INFO', message: `User ${userToDelete.email} deleted by admin.`, user: 'AdminAction'});
    console.log("[deleteUser] User deleted with id:", userId);
  } else {
    console.log("[deleteUser] Failed to delete user with id:", userId);
  }
  return success;
}

    