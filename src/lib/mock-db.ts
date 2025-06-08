
// mock-db.ts - نظام متكامل لإدارة المستخدمين والمشاريع الإنشائية

/**
 * أنواع البيانات الأساسية
 */
export type Role = 'Admin' | 'Engineer' | 'Owner' | 'GeneralUser';
export type UserRole = 'Admin' | 'Engineer' | 'Owner';
export type UserStatus = 'Active' | 'Pending Approval' | 'Suspended';
export type ProjectStatusType = 'مكتمل' | 'قيد التنفيذ' | 'مخطط له' | 'مؤرشف';

/**
 * واجهة المستخدم
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  phone?: string;
  profileImage?: string;
}

/**
 * نموذج لتمثيل Use Case
 */
export interface UseCase {
  id: number;
  title: string;
  role: Role;
  description: string;
  dependsOn?: number[]; // IDs of other use cases it depends on
}


/**
 * واجهة المشروع (متوافقة مع admin/projects/page.tsx و my-projects)
 */
export interface Project {
  id: number; 
  name: string;
  engineerId?: string; 
  ownerId?: string;   
  engineer?: string; 
  clientName?: string; 
  status: ProjectStatusType; 
  startDate?: string;
  endDate?: string;
  linkedOwnerEmail?: string;
  description?: string;
  location?: string;
  budget?: number;
  overallProgress?: number;
  quantitySummary?: string;
  photos?: ProjectPhoto[];
  timelineTasks?: ProjectTimelineTask[];
  comments?: ProjectComment[];
}


/**
 * واجهة صور المشروع
 */
export interface ProjectPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  dataAiHint?: string;
}

/**
 * واجهة مهام الجدول الزمني للمشروع
 */
export interface ProjectTimelineTask {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  color: string;     // Tailwind bg color class e.g., 'bg-blue-500'
  status: 'مكتمل' | 'قيد التنفيذ' | 'مخطط له'; // Matching ProjectStatusType subset
  progress?: number; // Optional progress for the task itself
}

/**
 * واجهة تعليقات المشروع
 */
export interface ProjectComment {
  id: string;
  user: string; 
  text: string;
  date: string; 
  avatar?: string; 
  dataAiHintAvatar?: string;
}


/**
 * واجهة إعدادات النظام
 */
export interface SystemSettings {
  siteName: string;
  defaultLanguage: 'ar' | 'en';
  maintenanceMode: boolean;
  maxUploadSizeMB: number;
  emailNotificationsEnabled: boolean; 
  engineerApprovalRequired: boolean;
}

/**
 * واجهة سجلات النظام
 */
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  user?: string; 
  ipAddress?: string; 
  action?: string; 
}

// ========== قاعدة البيانات الوهمية ========== //

export let dbUsers: User[] = [
  {
    id: 'admin-001',
    name: 'مدير النظام',
    email: 'admin@example.com',
    password_hash: 'adminpass', 
    role: 'Admin',
    status: 'Active',
    createdAt: new Date('2023-01-01'),
    phone: '+966501234567',
    profileImage: '/profiles/admin.jpg'
  },
  {
    id: 'user-001', 
    name: 'مستخدم تجريبي',
    email: 'test@example.com',
    password_hash: 'test123',
    role: 'Owner',
    status: 'Active',
    createdAt: new Date(),
    profileImage: '/profiles/admin.jpg'
  }
];


export let dbProjects: Project[] = [
    {
      id: 1, 
      name: "مشروع فيلا الأحلام",
      engineer: "م. خالد عبد العزيز",
      clientName: "السيد/ محمد الحسن",
      status: "قيد التنفيذ",
      startDate: "2023-03-01",
      endDate: "2024-09-30",
      description: "بناء فيلا سكنية فاخرة مكونة من طابقين وملحق خارجي.",
      location: "الرياض، حي الياسمين",
      budget: 2500000,
      overallProgress: 65,
      quantitySummary: "تم إنجاز أعمال الخرسانة للطابق الأرضي والأول. جاري العمل على التشطيبات الداخلية.",
      photos: [
        { id: "p1-img1", src: "https://placehold.co/600x400.png", alt: "موقع المشروع - مرحلة الأساسات", caption: "بداية أعمال الحفر", dataAiHint: "construction site" },
        { id: "p1-img2", src: "https://placehold.co/600x400.png", alt: "الهيكل الخرساني للطابق الأول", caption: "صب سقف الطابق الأول", dataAiHint: "concrete structure" }
      ],
      timelineTasks: [
        { id: "t1-1", name: "التصميم والموافقات", startDate: "2023-03-01", endDate: "2023-04-15", color: "bg-blue-500", status: "مكتمل" },
        { id: "t1-2", name: "أعمال الحفر والأساسات", startDate: "2023-04-16", endDate: "2023-06-30", color: "bg-yellow-500", status: "مكتمل" },
        { id: "t1-3", name: "الهيكل الخرساني", startDate: "2023-07-01", endDate: "2023-12-31", color: "bg-red-500", status: "قيد التنفيذ", progress: 70 },
        { id: "t1-4", name: "التشطيبات الداخلية والخارجية", startDate: "2024-01-01", endDate: "2024-08-30", color: "bg-green-500", status: "مخطط له" },
        { id: "t1-5", name: "تسليم المشروع", startDate: "2024-09-01", endDate: "2024-09-30", color: "bg-purple-500", status: "مخطط له" }
      ],
      comments: [
        { id: "c1-1", user: "المالك (محمد الحسن)", text: "متى سيتم الانتهاء من أعمال السباكة في الطابق الأول؟", date: "2023-11-05", avatar: "https://placehold.co/40x40.png?text=MH", dataAiHintAvatar: "owner avatar" },
        { id: "c1-2", user: "المهندس (خالد)", text: "جاري العمل عليها حاليًا، من المتوقع الانتهاء خلال أسبوعين.", date: "2023-11-06", avatar: "https://placehold.co/40x40.png?text=KA", dataAiHintAvatar: "engineer avatar" }
      ],
      linkedOwnerEmail: "owner@example.com"
    },
    {
      id: 2,
      name: "بناء مجمع تجاري",
      engineer: "م. سارة الأحمدي",
      clientName: "شركة الاستثمارات الحديثة",
      status: "مخطط له",
      startDate: "2024-01-15",
      endDate: "2025-06-30",
      description: "إنشاء مجمع تجاري متعدد الاستخدامات مع مواقف سيارات تحت الأرض.",
      location: "جدة، طريق الملك فهد",
      budget: 15000000,
      overallProgress: 10,
      photos: [{ id: "p2-img1", src: "https://placehold.co/600x400.png", alt: "تصميم المجمع التجاري", caption: "التصميم المبدئي", dataAiHint:"shopping mall" }],
      timelineTasks: [],
      comments: [],
      linkedOwnerEmail: "invest@example.com"
    },
     {
      id: 3,
      name: "توسعة مستشفى المدينة",
      engineer: "م. عمر فاروق",
      clientName: "وزارة الصحة",
      status: "مكتمل",
      startDate: "2022-05-01",
      endDate: "2023-10-31",
      description: "إضافة جناح جديد للمستشفى وزيادة السعة الاستيعابية.",
      location: "الدمام، حي الأطباء",
      budget: 8000000,
      overallProgress: 100,
      photos: [{ id: "p3-img1", src: "https://placehold.co/600x400.png", alt: "الجناح الجديد للمستشفى", caption: "بعد الاكتمال", dataAiHint: "hospital building" }],
      timelineTasks: [],
      comments: [],
    }
];


export const roles: Role[] = ['Admin', 'Engineer', 'Owner', 'GeneralUser'];

export const useCases: UseCase[] = [
  { id: 1, title: 'Sign Up', role: 'GeneralUser', description: 'تسجيل كمستخدم جديد' },
  { id: 2, title: 'Login', role: 'GeneralUser', description: 'تسجيل الدخول', dependsOn: [1] },
  { id: 3, title: 'Manage Profile', role: 'GeneralUser', description: 'إدارة البيانات الشخصية', dependsOn: [2] },
  { id: 4, title: 'Forgot Password', role: 'GeneralUser', description: 'استعادة كلمة المرور' },
  { id: 5, title: 'View My Projects', role: 'Owner', description: 'عرض المشاريع المرتبطة بك', dependsOn: [2] },
  { id: 6, title: 'Monitor Construction Project Progress', role: 'Owner', description: 'متابعة تقدم المشروع', dependsOn: [5] },
  { id: 7, title: 'View Summarized Quantity Reports', role: 'Owner', description: 'عرض تقارير الكميات المجملة', dependsOn: [6] },
  { id: 8, title: 'View Progress Photos/Videos', role: 'Owner', description: 'مشاهدة الصور والفيديوهات', dependsOn: [6] },
  { id: 9, title: 'Add Comments/Inquiries', role: 'Owner', description: 'إرسال استفسارات وتعليقات', dependsOn: [6] },
  { id: 10, title: 'View Project Timeline', role: 'Owner', description: 'عرض الجدول الزمني للمشروع', dependsOn: [6] },
  { id: 11, title: 'Create New Construction Project', role: 'Engineer', description: 'إنشاء مشروع جديد', dependsOn: [2]}, 
  { id: 12, title: 'Link Owner to Project', role: 'Engineer', description: 'ربط المشروع بالمالك', dependsOn: [11] },
  { id: 13, title: 'Define Construction Stages', role: 'Engineer', description: 'تحديد مراحل المشروع', dependsOn: [11] },
  { id: 14, title: 'Input Structural Element Details', role: 'Engineer', description: 'إدخال تفاصيل العناصر الإنشائية', dependsOn: [13] },
  { id: 15, title: 'Validate Input Data', role: 'Engineer', description: 'التحقق من صحة البيانات', dependsOn: [14] },
  { id: 16, title: 'Calculate Material Quantities', role: 'Engineer', description: 'حساب كميات المواد', dependsOn: [15] },
  { id: 17, title: 'Generate Report Data', role: 'Engineer', description: 'توليد بيانات التقرير', dependsOn: [16] },
  { id: 18, title: 'View Quantity Reports', role: 'Engineer', description: 'عرض تقارير الكميات', dependsOn: [17] },
  { id: 19, title: 'Customize Report Display', role: 'Engineer', description: 'تخصيص عرض التقرير', dependsOn: [18] },
  { id: 20, title: 'Update Construction Progress', role: 'Engineer', description: 'تحديث تقدم المشروع', dependsOn: [13] },
  { id: 21, title: 'Add Progress Notes', role: 'Engineer', description: 'إضافة ملاحظات حول التقدم', dependsOn: [20] },
  { id: 22, title: 'Upload Progress Photos/Videos', role: 'Engineer', description: 'رفع الصور والفيديوهات', dependsOn: [20] },
  { id: 23, title: 'Manage Construction Projects', role: 'Engineer', description: 'إدارة المشاريع الحالية', dependsOn: [2] },
  { id: 24, title: 'Archive Project', role: 'Engineer', description: 'أرشفة المشروع', dependsOn: [20] },
  { id: 25, title: 'View All Users', role: 'Admin', description: 'عرض كل المستخدمين', dependsOn: [2] },
  { id: 26, title: 'Edit User Details', role: 'Admin', description: 'تعديل بيانات المستخدم', dependsOn: [25] },
  { id: 27, title: 'Reset User Password', role: 'Admin', description: 'إعادة تعيين كلمة المرور', dependsOn: [25] },
  { id: 28, title: 'View All Projects', role: 'Admin', description: 'عرض كل المشاريع', dependsOn: [2] },
  { id: 29, title: 'Delete Project', role: 'Admin', description: 'حذف مشروع نهائيًا', dependsOn: [28] },
  { id: 30, title: 'Configure System Settings', role: 'Admin', description: 'إعدادات النظام', dependsOn: [2] },
  { id: 31, title: 'Review System Logs', role: 'Admin', description: 'مراجعة سجلات النظام', dependsOn: [2] },
];


export let dbSettings: SystemSettings = {
  siteName: 'المحترف لحساب الكميات',
  defaultLanguage: 'ar',
  maintenanceMode: false,
  maxUploadSizeMB: 25,
  emailNotificationsEnabled: true,
  engineerApprovalRequired: true,
};

export let dbLogs: LogEntry[] = [
  {
    id: crypto.randomUUID(),
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    level: 'INFO',
    message: 'تم تشغيل النظام بنجاح.',
    user: 'System',
    action: 'SYSTEM_START'
  },
  {
    id: crypto.randomUUID(),
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    level: 'SUCCESS',
    message: `تم تسجيل دخول المستخدم ${dbUsers[0]?.email || 'admin@example.com'}`,
    user: dbUsers[0]?.email || 'admin@example.com',
    action: 'USER_LOGIN'
  },
  {
    id: crypto.randomUUID(),
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    level: 'WARNING',
    message: 'محاولة تسجيل دخول فاشلة للمستخدم nonexisting@example.com',
    user: 'nonexisting@example.com',
    ipAddress: '192.168.1.100',
    action: 'LOGIN_FAILURE'
  },
];

// ========== دوال إدارة المستخدمين ========== //

export function registerUser(userData: {
  name: string;
  email: string;
  password_hash: string;
  role: 'Engineer' | 'Owner'; 
}): { success: boolean; user?: User; message?: string } {
  console.log("[MockDB registerUser] Attempting to register:", userData.email, "Role:", userData.role);
  const existingUser = dbUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (existingUser) {
    console.log("[MockDB registerUser] Email already exists:", userData.email);
    return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
  }

  const status: UserStatus = (userData.role === 'Engineer' && dbSettings.engineerApprovalRequired)
    ? 'Pending Approval'
    : 'Active';

  const newUser: User = {
    id: crypto.randomUUID(),
    name: userData.name,
    email: userData.email.toLowerCase(),
    password_hash: userData.password_hash, 
    role: userData.role,
    status,
    createdAt: new Date()
  };

  dbUsers.push(newUser);
  console.log("[MockDB registerUser] User registered:", newUser.email, "Status:", newUser.status);
  console.log("[MockDB registerUser] dbUsers count:", dbUsers.length);


  dbLogs.push({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    level: 'INFO',
    message: `تم تسجيل مستخدم جديد: ${newUser.name} (${newUser.role}), الحالة: ${newUser.status}`,
    user: newUser.email,
    action: 'USER_REGISTER'
  });

  return { success: true, user: newUser };
}


export function findUserByEmail(email: string): User | undefined {
  console.log("[MockDB findUserByEmail] Searching for email:", email);
  const user = dbUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    console.log("[MockDB findUserByEmail] Found user:", user.email, "Role:", user.role, "Status:", user.status);
  } else {
    console.log("[MockDB findUserByEmail] User not found for email:", email);
  }
  return user;
}


export function loginUser(email: string, password_hash: string): { success: boolean; user?: User; message?: string } {
  console.log(`[MockDB loginUser] Attempting login for email: ${email}`);
  const user = findUserByEmail(email);

  if (!user) {
    console.log(`[MockDB loginUser] User not found: ${email}`);
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }
  console.log(`[MockDB loginUser] User found: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
  console.log(`[MockDB loginUser] Provided Pwd: ${password_hash}, Stored Pwd: ${user.password_hash}`);


  if (user.password_hash !== password_hash) { // Direct comparison for mock
    console.log(`[MockDB loginUser] Password mismatch for ${email}`);
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
  }

  if (user.status === 'Suspended') {
    console.log(`[MockDB loginUser] Account suspended for ${email}`);
    return { success: false, message: 'حسابك موقوف. يرجى التواصل مع الإدارة' };
  }

  if (user.status === 'Pending Approval') {
    console.log(`[MockDB loginUser] Account pending approval for ${email}`);
    return { success: false, message: 'حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه' };
  }
  
  console.log(`[MockDB loginUser] Login successful for ${email}`);
  dbLogs.push({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    level: 'SUCCESS',
    message: `تم تسجيل دخول المستخدم ${user.email}`,
    user: user.email,
    action: 'USER_LOGIN'
  });

  return { success: true, user };
}


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
    user: admin.email,
    action: 'ENGINEER_APPROVE'
  });

  return { success: true, message: 'تمت الموافقة على حساب المهندس بنجاح.' };
}


export function getPendingEngineers(adminId: string): { success: boolean; users?: User[]; message?: string } {
  const admin = dbUsers.find(u => u.id === adminId && u.role === 'Admin');
  if (!admin) {
    return { success: false, message: 'غير مصرح بالوصول' };
  }
  const pending = dbUsers.filter(u => u.role === 'Engineer' && u.status === 'Pending Approval');
  return { success: true, users: pending };
}


export function updateUser(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'createdAt' | 'email'>> 
): { success: boolean; user?: User; message?: string } {
  const userIndex = dbUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return { success: false, message: 'المستخدم غير موجود' };
  }

  const { email, ...safeUpdates } = updates as any;

  dbUsers[userIndex] = {
    ...dbUsers[userIndex],
    ...safeUpdates,
  };

  dbLogs.push({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    level: 'INFO',
    message: `تم تحديث بيانات المستخدم: ${dbUsers[userIndex].name} (ID: ${userId})`,
    user: dbUsers[userIndex].email, 
    action: 'USER_UPDATE'
  });

  return { success: true, user: dbUsers[userIndex] };
}


export function deleteUser(userId: string): { success: boolean; message?: string } {
  const userIndex = dbUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return { success: false, message: 'لم يتم العثور على المستخدم' };
  }

  const userToDelete = dbUsers[userIndex];
  if (userToDelete.role === 'Admin' && dbUsers.filter(u => u.role === 'Admin').length === 1) {
      return { success: false, message: 'لا يمكن حذف المسؤول الوحيد في النظام.' };
  }

  dbUsers.splice(userIndex, 1);

  dbLogs.push({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    level: 'WARNING',
    message: `تم حذف المستخدم ${userToDelete.name} (ID: ${userId})`,
    user: 'System/Admin', 
    action: 'USER_DELETE'
  });
  return { success: true, message: 'تم حذف المستخدم بنجاح' };
}

// ========== دوال إدارة المشاريع ========== //

export function getProjects(userId: string): { success: boolean; projects?: Project[]; message?: string } {
  const user = dbUsers.find(u => u.id === userId);
  if (!user) {
    return { success: false, message: 'المستخدم غير موجود.' };
  }
  // For this mock, Admins and Engineers can see all projects. Owners see their linked projects.
  // In a real scenario, Engineer might only see projects they are assigned to.
  if (user.role === 'Admin' || user.role === 'Engineer') {
    return { success: true, projects: [...dbProjects] };
  }
  if (user.role === 'Owner') {
    const ownerProjects = dbProjects.filter(p => p.linkedOwnerEmail === user.email);
    return { success: true, projects: ownerProjects };
  }
  return { success: false, message: 'ليس لديك صلاحية لعرض المشاريع.' };
}


export function addProject(projectData: Omit<Project, 'id' | 'overallProgress' | 'status' | 'photos' | 'timelineTasks' | 'comments'>): Project | null {
    const newId = dbProjects.length > 0 ? Math.max(...dbProjects.map(p => p.id)) + 1 : 1;
    const newProject: Project = {
        ...projectData,
        id: newId,
        status: "مخطط له", 
        overallProgress: 0,
        photos: [{id: "placeholder", src: "https://placehold.co/600x400.png", alt: "Project placeholder", dataAiHint: "construction project"}],
        timelineTasks: [],
        comments: [],
    };
    dbProjects.push(newProject);
    dbLogs.push({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level: 'INFO',
      message: `تم إنشاء مشروع جديد: ${newProject.name} (ID: ${newProject.id})`,
      user: projectData.engineer || 'System', 
      action: 'PROJECT_CREATE'
    });
    return newProject;
}

export function findProjectById(projectIdInput: string | number): Project | null {
    const projectId = typeof projectIdInput === 'string' ? parseInt(projectIdInput, 10) : projectIdInput;
    if (isNaN(projectId)) {
        console.error("[MockDB findProjectById] Invalid project ID:", projectIdInput);
        return null;
    }
    return dbProjects.find(p => p.id === projectId) || null;
}


export function updateProject(
  projectIdString: string,
  updates: Partial<Omit<Project, 'id'>>
): { success: boolean; project?: Project; message?: string } {
  const projectId = parseInt(projectIdString, 10);
  if (isNaN(projectId)) {
    return { success: false, message: "معرف المشروع غير صالح" };
  }

  const projectIndex = dbProjects.findIndex(p => p.id === projectId);
  if (projectIndex === -1) {
    return { success: false, message: "المشروع غير موجود" };
  }

  const currentProject = dbProjects[projectIndex];
  const updatedProjectData = { ...currentProject, ...updates };

  if (updates.photos) {
    updatedProjectData.photos = [...(currentProject.photos || []), ...updates.photos].filter(
      (photo, index, self) => index === self.findIndex((p) => p.id === photo.id)
    );
  }
  if (updates.timelineTasks) {
    updatedProjectData.timelineTasks = [...(currentProject.timelineTasks || []), ...updates.timelineTasks].filter(
      (task, index, self) => index === self.findIndex((t) => t.id === task.id)
    );
  }
  if (updates.comments) {
    updatedProjectData.comments = [...(currentProject.comments || []), ...updates.comments].filter(
      (comment, index, self) => index === self.findIndex((c) => c.id === comment.id)
    );
  }

  dbProjects[projectIndex] = updatedProjectData;

  dbLogs.push({
    id: crypto.randomUUID(),
    timestamp: new Date(),
    level: 'INFO',
    message: `تم تحديث المشروع: ${updatedProjectData.name} (ID: ${projectId})`,
    user: 'System/User', 
    action: 'PROJECT_UPDATE'
  });

  return { success: true, project: updatedProjectData, message: "تم تحديث المشروع بنجاح." };
}


export function deleteProject(projectId: number): { success: boolean; message?: string } {
  const initialLength = dbProjects.length;
  const projectIndex = dbProjects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    return { success: false, message: 'لم يتم العثور على المشروع' };
  }
  
  const projectName = dbProjects[projectIndex].name;
  dbProjects.splice(projectIndex, 1);

  if (dbProjects.length < initialLength) {
    dbLogs.push({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level: 'WARNING',
      message: `تم حذف المشروع ${projectName} (ID: ${projectId})`,
      user: 'System/Admin',
      action: 'PROJECT_DELETE'
    });
    return { success: true, message: `تم حذف المشروع "${projectName}" بنجاح` };
  }
  return { success: false, message: 'لم يتم العثور على المشروع ليتم حذفه' }; // Should not happen if index found
}


// ========== دوال إضافية لإدارة المستخدمين (كانت مفقودة من النسخ السابقة) ==========

export function getUsers(adminId: string): { success: boolean; users?: User[]; message?: string } {
  console.log("[MockDB getUsers] Called by adminId:", adminId);
  const admin = dbUsers.find(u => u.id === adminId && u.role === 'Admin');
  if (!admin) {
    console.warn("[MockDB getUsers] Unauthorized or admin not found for ID:", adminId);
    return { success: false, message: 'غير مصرح لك بعرض قائمة المستخدمين.' };
  }
  console.log("[MockDB getUsers] Admin authorized. Returning all users. Count:", dbUsers.length);
  return { success: true, users: [...dbUsers] }; // Return a copy
}

export function suspendUser(adminId: string, userIdToSuspend: string): { success: boolean; message?: string } {
  console.log(`[MockDB suspendUser] Admin ${adminId} attempting to suspend/unsuspend user ${userIdToSuspend}`);
  const admin = dbUsers.find(u => u.id === adminId && u.role === 'Admin');
  if (!admin) {
    console.warn("[MockDB suspendUser] Admin not authorized or not found:", adminId);
    return { success: false, message: 'ليست لديك صلاحية تعليق الحسابات.' };
  }

  const userIndex = dbUsers.findIndex(u => u.id === userIdToSuspend);
  if (userIndex === -1) {
    console.warn("[MockDB suspendUser] User to suspend not found:", userIdToSuspend);
    return { success: false, message: 'المستخدم المراد تعليقه غير موجود.' };
  }

  if (dbUsers[userIndex].id === adminId) { 
    console.warn("[MockDB suspendUser] Admin attempting to suspend self:", adminId);
    return { success: false, message: 'لا يمكنك تعليق حسابك الخاص.' };
  }
  
  const userToModify = dbUsers[userIndex];
  if (userToModify.status === 'Suspended') {
    userToModify.status = 'Active'; 
    dbLogs.push({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level: 'INFO',
      message: `تم إلغاء تعليق حساب المستخدم ${userToModify.name} بواسطة ${admin.name}`,
      user: admin.email,
      action: 'USER_UNSUSPEND'
    });
    console.log(`[MockDB suspendUser] User ${userIdToSuspend} unsuspended by ${adminId}`);
    return { success: true, message: `تم إلغاء تعليق حساب المستخدم ${userToModify.name}.` };
  } else {
    userToModify.status = 'Suspended';
    dbLogs.push({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level: 'WARNING',
      message: `تم تعليق حساب المستخدم ${userToModify.name} بواسطة ${admin.name}`,
      user: admin.email,
      action: 'USER_SUSPEND'
    });
    console.log(`[MockDB suspendUser] User ${userIdToSuspend} suspended by ${adminId}`);
    return { success: true, message: `تم تعليق حساب المستخدم ${userToModify.name} بنجاح.` };
  }
}


// Default export for easier consumption if needed, though named exports are preferred.
export default {
  dbUsers,
  dbProjects,
  dbSettings,
  dbLogs,
  roles,
  useCases,
  registerUser,
  loginUser,
  approveEngineer,
  getPendingEngineers,
  updateUser,
  deleteUser,
  getProjects,
  addProject,
  findProjectById,
  updateProject, 
  deleteProject,
  findUserByEmail,
  getUsers,
  suspendUser,
};

// Ensure all necessary functions and data are exported
// This export statement should be the single source of truth for exports
// to avoid conflicts with default export if both are used.
// export {
//   dbUsers,
//   dbProjects,
//   dbSettings,
//   dbLogs,
//   roles,
//   useCases,
//   registerUser,
//   loginUser,
//   approveEngineer,
//   getPendingEngineers,
//   updateUser,
//   deleteUser,
//   getProjects,
//   addProject,
//   findProjectById,
//   updateProject as updateProjectDb, // Alias if needed to avoid name collision
//   deleteProject as deleteProjectDb, // Alias if needed
//   findUserByEmail,
//   getUsers,
//   suspendUser,
// };
