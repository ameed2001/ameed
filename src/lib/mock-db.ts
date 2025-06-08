
// mock-db.ts

export type UserRole = 'Admin' | 'Engineer' | 'Owner';
export type UserStatus = 'Active' | 'Pending Approval' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string; // Storing plain text password for now, ensure this matches login check
  role: UserRole;
  status: UserStatus;
}

// Initial dbUsers with only admin
export let dbUsers: User[] = [
  { id: crypto.randomUUID(), name: 'Admin User', email: 'ameed@admin.com', password_hash: 'password123', role: 'Admin', status: 'Active' },
];

export function findUserByEmail(email: string): User | undefined {
  console.log("[findUserByEmail] Searching for email:", email);
  console.log("[findUserByEmail] Current dbUsers state before find:", JSON.stringify(dbUsers, null, 2));
  const foundUser = dbUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (foundUser) {
    console.log("[findUserByEmail] User found:", JSON.stringify(foundUser, null, 2));
  } else {
    console.log("[findUserByEmail] User NOT found for email:", email);
  }
  return foundUser;
}

export function addUser(userData: Pick<User, 'name' | 'email' | 'password_hash' | 'role'>): User {
  const newUser: User = {
    ...userData, // This will spread name, email, password_hash, role
    email: userData.email.toLowerCase(), // Ensure email is stored consistently lowercase
    id: crypto.randomUUID(),
    // Role is already cased correctly by signup action before calling addUser
    status: userData.role === 'Engineer' ? 'Pending Approval' : 'Active', // Owners and Admins are active immediately
  };
  dbUsers.push(newUser);
  console.log("[addUser] User added to dbUsers:", JSON.stringify(newUser, null, 2));
  console.log("[addUser] dbUsers now contains:", JSON.stringify(dbUsers, null, 2));
  return newUser;
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const userIndex = dbUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return null;
  }
  // Prevent changing id, email, or role directly through this simple update function for now
  const { id, email, role, ...safeUpdates } = updates;
  dbUsers[userIndex] = { ...dbUsers[userIndex], ...safeUpdates };
  console.log("[updateUser] User updated:", JSON.stringify(dbUsers[userIndex], null, 2));
  return dbUsers[userIndex];
}

export function deleteUser(userId: string): boolean {
  const initialLength = dbUsers.length;
  dbUsers = dbUsers.filter(u => u.id !== userId);
  const success = dbUsers.length < initialLength;
  if (success) {
    console.log("[deleteUser] User deleted with id:", userId);
    console.log("[deleteUser] dbUsers now:", JSON.stringify(dbUsers, null, 2));
  } else {
    console.log("[deleteUser] Failed to delete user with id:", userId);
  }
  return success;
}


// --- Project Structures & Data (Simplified for Admin, Full for Details) ---
export type ProjectStatusType = 'مكتمل' | 'قيد التنفيذ' | 'مخطط له' | 'مؤرشف';

// Simplified Project structure for admin listing
export interface Project {
  id: number; // Admin page uses numeric ID for projects
  name: string;
  engineerId?: number; 
  ownerId?: number;   
  status: ProjectStatusType;
  engineer?: string; // For display convenience in admin
  clientName?: string; // For display convenience in admin
}

// This is the array for the admin projects page
export let dbProjects: Project[] = [
  { id: 1, name: 'مشروع الإسكان النموذجي', status: 'قيد التنفيذ', engineer: 'م. أحمد خالد', clientName: 'سامر عبدالله' },
  { id: 2, name: 'بناء فيلا سكنية', status: 'مخطط له', engineer: 'م. ليلى محمود', clientName: 'شركة التطوير العقاري' },
  { id: 3, name: 'تطوير مجمع تجاري', status: 'مكتمل', engineer: 'م. عمر حسن', clientName: 'مجموعة الاستثمار الدولية' },
];

// Function for admin page to delete projects by numeric ID
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
  } else {
    console.log("[deleteProject] Project with id", projectId, "not found in dbProjects.");
  }
  return success;
}


// Detailed Project Structure (for project details page)
export interface FullProject {
  id: string; // UUID for detailed projects
  name: string;
  location?: string;
  description?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  engineer?: string;  // Name of engineer
  clientName?: string; // Name of client/owner
  budget?: number;
  overallProgress: number; // Percentage
  status: ProjectStatusType;
  photos?: ProjectPhoto[];
  timelineTasks?: TimelineTask[];
  comments?: ProjectComment[];
  quantitySummary?: string;
  linkedOwnerEmail?: string; // Email of the owner linked to this project
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
  color: string; // Example: 'bg-blue-500' for styling
}

export interface ProjectComment {
  id: string;
  user: string; // Name of the user or role like "المالك"
  avatar?: string;
  dataAiHintAvatar?: string;
  text: string;
  date: string; // YYYY-MM-DD
}

// Array for detailed projects
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
    console.log("[addFullProject] Detailed project added:", JSON.stringify(newProject, null, 2));
    
    // Sync with simplified dbProjects if engineer is present (for admin view)
    if (projectData.engineer) {
        const simplifiedProject: Project = {
            id: dbProjects.length > 0 ? Math.max(...dbProjects.map(p => p.id)) + 1 : 1,
            name: newProject.name,
            status: 'مخطط له',
            engineer: newProject.engineer,
            clientName: newProject.clientName
        };
        dbProjects.push(simplifiedProject);
        console.log("[addFullProject] Simplified project synced to dbProjects:", JSON.stringify(simplifiedProject, null, 2));
    }
    return newProject;
}

export function updateFullProject(projectId: string, updates: Partial<FullProject>): FullProject | null {
    const projectIndex = dbProjectsFull.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return null;

    const oldProject = dbProjectsFull[projectIndex];
    dbProjectsFull[projectIndex] = { ...oldProject, ...updates };
    console.log("[updateFullProject] Detailed project updated:", JSON.stringify(dbProjectsFull[projectIndex], null, 2));

    // Sync updates to the simplified dbProjects list
    const simplifiedProjectToUpdate = dbProjects.find(p => p.name === oldProject.name); // Assuming name is a quasi-key for sync
    if (simplifiedProjectToUpdate) {
        const simplifiedProjectIndex = dbProjects.indexOf(simplifiedProjectToUpdate);
        const simplifiedUpdates: Partial<Project> = {};
        if (updates.name) simplifiedUpdates.name = updates.name;
        if (updates.status) simplifiedUpdates.status = updates.status;
        if (updates.engineer) simplifiedUpdates.engineer = updates.engineer;
        if (updates.clientName) simplifiedUpdates.clientName = updates.clientName;
        dbProjects[simplifiedProjectIndex] = { ...dbProjects[simplifiedProjectIndex], ...simplifiedUpdates };
        console.log("[updateFullProject] Simplified project synced in dbProjects:", JSON.stringify(dbProjects[simplifiedProjectIndex], null, 2));
    }
    return dbProjectsFull[projectIndex];
}

// Aliases for project functions used by different pages
export const addProject = addFullProject;
export const updateProject = updateFullProject;


// --- System Settings and Logs (as previously defined) ---
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  user?: string; // User email or 'النظام'
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


// --- Original Use Cases and Roles (from user's earlier definition) ---
export type Role = 'Admin' | 'Engineer' | 'Owner' | 'GeneralUser'; // This Role type is broader
export interface UseCase {
  id: number;
  title: string;
  role: Role;
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
  // ... other use cases from user's list
];
// Note: The users array { id: number; name: string; role: Role; } was part of the user's last full mock-db paste,
// but it conflicts with the User interface { id: string; email; password_hash; role: UserRole; status: UserStatus; }
// needed for login/signup. The latter is kept for dbUsers. The `users` array with numeric IDs is omitted
// to avoid confusion, as `dbUsers` (with string IDs and more fields) is the primary user store.
