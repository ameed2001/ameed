
// User Management
export type UserRole = 'Owner' | 'Engineer' | 'Admin';
export type UserStatus = 'Active' | 'Pending Approval' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app, this would be a hash
  role: UserRole;
  status: UserStatus;
}

// Project Management
export type ProjectStatusType = 'مكتمل' | 'قيد التنفيذ' | 'مخطط له' | 'مؤرشف';

export interface ProjectPhoto {
  id: string;
  src: string;
  alt: string;
  dataAiHint: string;
  caption?: string;
}

export interface TimelineTask {
  id: string;
  name: string;
  status: 'مكتمل' | 'قيد التنفيذ' | 'مخطط له';
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  progress?: number; // Optional: 0-100
  color: string; // Tailwind bg color class e.g., 'bg-blue-500'
}

export interface ProjectComment {
  id: string;
  user: string; // Name of the user who commented
  text: string;
  date: string; // YYYY-MM-DD
  avatar?: string; // URL to avatar image
  dataAiHintAvatar?: string;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatusType;
  overallProgress: number; // Percentage 0-100
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  location?: string;
  engineer?: string; // Name of the engineer
  clientName?: string; // Name of the client/owner
  budget?: number;
  quantitySummary?: string; // Text summary for now
  photos: ProjectPhoto[];
  timelineTasks: TimelineTask[];
  comments: ProjectComment[];
  linkedOwnerEmail?: string; // Email of the owner linked to this project
}


// System Logs
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  user?: string; // Optional: ID or name of user associated with log
}

// System Settings
export interface SystemSettings {
  siteName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maxUploadSizeMB: number;
  emailNotificationsEnabled: boolean;
}


// --- Data Store (Local "Database") ---
// Initialize with only the admin user. Other users must sign up.
export let dbUsers: User[] = [
  { id: 'admin001', name: 'المدير عميد', email: 'ameed@admin.com', password: "2792001", role: 'Admin', status: 'Active' },
];

export let dbProjects: Project[] = [];

export let dbLogs: LogEntry[] = [];

export let dbSettings: SystemSettings = {
  siteName: "المحترف لحساب الكميات",
  defaultLanguage: "ar",
  maintenanceMode: false,
  maxUploadSizeMB: 50,
  emailNotificationsEnabled: true,
};

// --- Helper Functions ---

// User Helpers
export function findUserById(userId: string): User | undefined {
  return dbUsers.find(user => user.id === userId);
}

export function findUserByEmail(email: string): User | undefined {
  return dbUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export function addUser(userData: Omit<User, 'id' | 'status'>): User {
  const newUser: User = {
    ...userData,
    id: `u${crypto.randomUUID()}`, // Use crypto.randomUUID() for more unique IDs
    status: userData.role === 'Engineer' ? 'Pending Approval' : 'Active',
  };
  dbUsers.push(newUser);
  dbLogs.unshift({ id: `log${crypto.randomUUID()}`, timestamp: new Date(), level: 'INFO', message: `تم إنشاء حساب جديد للمستخدم ${newUser.email} بدور ${newUser.role}.`, user: 'النظام' });
  return newUser;
}

export function updateUser(userId: string, updates: Partial<Omit<User, 'id'>>): User | null {
  const userIndex = dbUsers.findIndex(user => user.id === userId);
  if (userIndex === -1) return null;

  const originalRole = dbUsers[userIndex].role;
  dbUsers[userIndex] = { ...dbUsers[userIndex], ...updates };

  // If role changed and the new role is Engineer, ensure status is handled (e.g., by admin page)
  if (updates.role && updates.role !== originalRole) {
      if (dbUsers[userIndex].role === 'Engineer' && dbUsers[userIndex].status === 'Active') {
        // Potentially reset status to 'Pending Approval' if an admin changes a user to Engineer
        // For now, this logic is mainly handled on the admin users page for approval.
      }
  }
  dbLogs.unshift({ id: `log${crypto.randomUUID()}`, timestamp: new Date(), level: 'INFO', message: `تم تحديث بيانات المستخدم ${dbUsers[userIndex].email}.`, user: 'النظام/المشرف' });
  return dbUsers[userIndex];
}

export function deleteUser(userId: string): boolean {
  const userIndex = dbUsers.findIndex(user => user.id === userId);
  if (userIndex === -1) return false;
  const deletedUserEmail = dbUsers[userIndex].email;
  dbUsers.splice(userIndex, 1);
  dbLogs.unshift({ id: `log${crypto.randomUUID()}`, timestamp: new Date(), level: 'INFO', message: `تم حذف المستخدم ${deletedUserEmail}.`, user: 'النظام/المشرف' });
  return true;
}

// Project Helpers
export function findProjectById(projectId: string): Project | undefined {
  return dbProjects.find(project => project.id === projectId);
}

// Function to add a new project to the dbProjects array
export function addProject(projectData: Omit<Project, 'id' | 'overallProgress' | 'status' | 'photos' | 'timelineTasks' | 'comments'>): Project {
  // Create a new project object with a unique ID, default progress, and status
  const newProject: Project = {
    ...projectData,
    id: `p${crypto.randomUUID()}`, // Use crypto.randomUUID() for more unique IDs
    overallProgress: 0, // Default progress
    status: 'مخطط له', // Default status
    photos: projectData.photos || [], // Initialize with empty array if not provided
    timelineTasks: projectData.timelineTasks || [], // Initialize with empty array
    comments: projectData.comments || [], // Initialize with empty array
  };
  dbProjects.push(newProject); // Add the new project to the array
   dbLogs.unshift({ id: `log${crypto.randomUUID()}`, timestamp: new Date(), level: 'INFO', message: `تم إنشاء مشروع جديد: "${newProject.name}".`, user: newProject.engineer || 'النظام' });
  return newProject; // Return the newly created project
}


export function updateProject(projectId: string, updates: Partial<Omit<Project, 'id'>>): Project | null {
  const projectIndex = dbProjects.findIndex(project => project.id === projectId);
  if (projectIndex === -1) return null;
  dbProjects[projectIndex] = { ...dbProjects[projectIndex], ...updates };
  dbLogs.unshift({ id: `log${crypto.randomUUID()}`, timestamp: new Date(), level: 'INFO', message: `تم تحديث بيانات المشروع "${dbProjects[projectIndex].name}".`, user: 'النظام/المهندس' });
  return dbProjects[projectIndex];
}

export function deleteProject(projectId: string): boolean {
  const projectIndex = dbProjects.findIndex(project => project.id === projectId);
  if (projectIndex === -1) return false;
  const deletedProjectName = dbProjects[projectIndex].name;
  dbProjects.splice(projectIndex, 1);
  dbLogs.unshift({ id: `log${crypto.randomUUID()}`, timestamp: new Date(), level: 'INFO', message: `تم حذف المشروع "${deletedProjectName}".`, user: 'النظام/المشرف' });
  return true;
}

// Log Helpers
// Function to add a new log entry
export function addLogEntry(level: LogLevel, message: string, user?: string): LogEntry {
    const newLog: LogEntry = {
        id: `log${crypto.randomUUID()}`, // Generate unique ID
        timestamp: new Date(),
        level,
        message,
        user,
    };
    dbLogs.unshift(newLog); // Add to the beginning of the array for chronological order (newest first)
    return newLog;
}
