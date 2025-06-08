
// User Management
export type UserRole = 'Owner' | 'Engineer' | 'Admin';
export type UserStatus = 'Active' | 'Pending Approval' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
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
  startDate: string;
  endDate: string;
  progress?: number;
  color: string;
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
  id: string;
  name: string;
  status: ProjectStatusType;
  overallProgress: number;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  engineer?: string;
  clientName?: string;
  budget?: number;
  quantitySummary?: string;
  photos: ProjectPhoto[];
  timelineTasks: TimelineTask[];
  comments: ProjectComment[];
  linkedOwnerEmail?: string;
}

// System Logs
export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  user?: string;
}

// System Settings
export interface SystemSettings {
  siteName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maxUploadSizeMB: number;
  emailNotificationsEnabled: boolean;
}

// Initial Data Store
export let dbUsers: User[] = [
  { id: 'admin001', name: 'المدير عميد', email: 'ameed@admin.com', password: "2792001", role: 'Admin', status: 'Active' },
  { id: 'owner001', name: 'صاحب افتراضي', email: 'owner@example.com', password: "password123", role: 'Owner', status: 'Active' },
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
    id: `u${crypto.randomUUID()}`,
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

  if (updates.role && updates.role !== originalRole) {
      if (dbUsers[userIndex].role === 'Engineer' && dbUsers[userIndex].status === 'Active') {
        // This part might be handled by admin user page for explicit status changes.
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

export function addProject(projectData: Omit<Project, 'id' | 'overallProgress' | 'status' | 'photos' | 'timelineTasks' | 'comments'>): Project {
   const newProject: Project = {
    ...projectData,
    id: `p${crypto.randomUUID()}`,
    overallProgress: 0,
    status: 'مخطط له',
    photos: projectData.photos || [],
    timelineTasks: projectData.timelineTasks || [],
    comments: projectData.comments || [],
  };
  dbProjects.push(newProject);
   dbLogs.unshift({ id: `log${crypto.randomUUID()}`, timestamp: new Date(), level: 'INFO', message: `تم إنشاء مشروع جديد: "${newProject.name}".`, user: newProject.engineer || 'النظام' });
  return newProject;
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
export function addLogEntry(level: LogLevel, message: string, user?: string): LogEntry {
    const newLog: LogEntry = {
        id: `log${crypto.randomUUID()}`,
        timestamp: new Date(),
        level,
        message,
        user,
    };
    dbLogs.unshift(newLog);
    return newLog;
}
