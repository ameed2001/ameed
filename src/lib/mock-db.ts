
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
  { id: 'u1', name: 'أحمد محمود', email: 'engineer_pending@example.com', password: "password123", role: 'Engineer', status: 'Pending Approval' },
  { id: 'u2', name: 'فاطمة علي', email: 'owner@example.com', password: "password123", role: 'Owner', status: 'Active' },
  { id: 'u3', name: 'المشرف العام', email: 'admin@example.com', password: "adminpass", role: 'Admin', status: 'Active' },
  { id: 'u4', name: 'خالد إبراهيم', email: 'engineer_approved@example.com', password: "password123", role: 'Engineer', status: 'Active' },
  { id: 'u5', name: 'سارة ياسين', email: 'sara_owner@example.com', password: "password123", role: 'Owner', status: 'Suspended' },
  { id: 'u6', name: 'مستخدم موجود', email: 'exists@example.com', password: "password123", role: 'Owner', status: 'Active' },
];

export let dbProjects: Project[] = [
  {
    id: '1',
    name: 'مشروع بناء فيلا النرجس',
    status: 'قيد التنفيذ',
    overallProgress: 65,
    description: 'فيلا سكنية فاخرة مكونة من طابقين وحديقة واسعة، تقع في حي النرجس الراقي. يتميز المشروع بتصميم معماري حديث واستخدام مواد بناء عالية الجودة.',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    location: "حي النرجس، الرياض",
    engineer: "م. خالد الأحمدي",
    clientName: "السيد عبدالله الراجحي",
    budget: 1200000,
    quantitySummary: 'تم استهلاك 120 متر مكعب من الباطون و 15 طن من حديد التسليح حتى الآن. تم الانتهاء من 80% من أعمال الهيكل الخرساني.',
    photos: [
      { id: 'p1', src: 'https://placehold.co/600x400.png', alt: 'أعمال الأساسات', dataAiHint: 'building foundation', caption: 'صب قواعد الأساسات بتاريخ 15 مارس 2024' },
      { id: 'p2', src: 'https://placehold.co/600x400.png', alt: 'أعمدة الطابق الأرضي', dataAiHint: 'concrete columns', caption: 'الانتهاء من أعمدة الطابق الأرضي بتاريخ 10 أبريل 2024' },
      { id: 'p3', src: 'https://placehold.co/600x400.png', alt: 'تقدم الهيكل', dataAiHint: 'construction site', caption: 'نظرة عامة على تقدم الهيكل الخرساني بتاريخ 1 مايو 2024' },
    ],
    timelineTasks: [
      { id: 't1', name: "التخطيط والتراخيص", startDate: "2024-03-01", endDate: "2024-03-15", status: 'مكتمل', progress: 100, color: "bg-green-500" },
      { id: 't2', name: "أعمال الحفر والأساسات", startDate: "2024-03-16", endDate: "2024-04-30", status: 'مكتمل', progress: 100, color: "bg-green-500" },
      { id: 't3', name: "الهيكل الخرساني للطابق الأرضي", startDate: "2024-05-01", endDate: "2024-06-30", status: 'قيد التنفيذ', progress: 80, color: "bg-yellow-500" },
      { id: 't4', name: "الهيكل الخرساني للطابق الأول", startDate: "2024-07-01", endDate: "2024-08-31", status: 'قيد التنفيذ', progress: 30, color: "bg-yellow-500" },
      { id: 't5', name: "أعمال التشطيبات الأولية", startDate: "2024-09-01", endDate: "2024-10-31", status: 'مخطط له', progress: 0, color: "bg-blue-500" },
      { id: 't6', name: "التشطيبات النهائية والتسليم", startDate: "2024-11-01", endDate: "2024-12-31", status: 'مخطط له', progress: 0, color: "bg-blue-500" },
    ],
    comments: [
      { id: 'c1', user: "م. خالد الأحمدي", text: "تم الانتهاء من صب سقف الطابق الأرضي اليوم. كل شيء يسير وفق الجدول.", date: "2024-06-20", avatar: "https://placehold.co/40x40.png?text=EN", dataAiHintAvatar: "engineer avatar" },
      { id: 'c2', user: "المالك", text: "عمل رائع! متى يمكنني زيارة الموقع للاطلاع على آخر التطورات؟", date: "2024-06-21", avatar: "https://placehold.co/40x40.png?text=OW", dataAiHintAvatar: "owner avatar" },
    ],
    linkedOwnerEmail: "owner@example.com"
  },
  {
    id: '2',
    name: 'تطوير مجمع الياسمين السكني',
    status: 'مكتمل',
    description: 'تطوير شامل لمجمع سكني يضم 5 مباني و مرافق ترفيهية.',
    overallProgress: 100,
    startDate: '2023-01-15',
    endDate: '2024-01-15',
    engineer: "م. سارة إبراهيم",
    clientName: "شركة التطوير العقاري",
    linkedOwnerEmail: "anotherowner@example.com",
    photos: [{ id: 'p_yasmin_1', src: 'https://placehold.co/600x400.png', alt: 'مجمع الياسمين', dataAiHint: 'residential complex', caption: 'مجمع الياسمين بعد التطوير'}],
    timelineTasks: [],
    comments: [],
  },
  {
    id: '3',
    name: 'إنشاء برج الأندلس التجاري',
    status: 'مخطط له',
    description: 'برج تجاري متعدد الاستخدامات بارتفاع 20 طابقًا في قلب المدينة.',
    overallProgress: 5,
    startDate: '2024-09-01',
    endDate: '2026-09-01',
    engineer: "م. عمر حسن",
    clientName: "مستثمرون الخليج",
    photos: [{ id: 'p_andalus_1', src: 'https://placehold.co/600x400.png', alt: 'برج الأندلس', dataAiHint: 'commercial tower', caption: 'تصميم برج الأندلس'}],
    timelineTasks: [],
    comments: [],
  },
  {
    id: '4',
    name: 'مشروع فيلا المالك الخاصة',
    status: 'قيد التنفيذ',
    overallProgress: 30,
    description: 'مشروع خاص للمالك owner@example.com قيد التنفيذ حالياً.',
    startDate: '2024-05-01',
    endDate: '2025-01-31',
    location: "حي الأمانة، جدة",
    engineer: "م. سارة عبدالله",
    clientName: "مالك المشروع (نفسه)",
    budget: 2500000,
    quantitySummary: 'تم البدء في أعمال الحفر والأساسات.',
    photos: [
      { id: 'pv1', src: 'https://placehold.co/600x400.png', alt: 'موقع المشروع قبل البدء', dataAiHint: 'land plot', caption: 'قطعة الأرض قبل بدء الأعمال' },
    ],
    timelineTasks: [
      { id: 'pt1', name: "التراخيص النهائية", startDate: "2024-05-01", endDate: "2024-05-15", status: 'مكتمل', progress: 100, color: "bg-green-500" },
      { id: 'pt2', name: "الحفر", startDate: "2024-05-16", endDate: "2024-06-15", status: 'قيد التنفيذ', progress: 40, color: "bg-yellow-500" },
    ],
    comments: [],
    linkedOwnerEmail: "owner@example.com"
  },
   {
    id: 'archived_1',
    name: 'تجديد فندق الواحة', // Name as per admin/projects
    status: 'مؤرشف', // Status as per admin/projects
    description: 'مشروع تجديد فندق الواحة الذي تم أرشفته.',
    overallProgress: 100, // Assuming completed before archiving
    startDate: '2022-01-01', // Example date
    endDate: '2023-01-01', // Example date
    engineer: "م. ليلى العلي", // From admin/projects
    clientName: "مجموعة فنادق عالمية", // From admin/projects
    linkedOwnerEmail: "owner@example.com", // Example, can be specific for owner view
    photos: [{id: 'parch1', src: 'https://placehold.co/600x400.png', alt: 'فندق الواحة', dataAiHint: 'hotel renovation', caption: 'فندق الواحة بعد التجديد'}],
    timelineTasks: [],
    comments: [],
  },
];


export let dbLogs: LogEntry[] = [
  { id: 'log1', timestamp: new Date(2024, 5, 8, 10, 30, 0), level: 'INFO', message: 'المستخدم "admin@example.com" قام بتسجيل الدخول.', user: 'admin@example.com' },
  { id: 'log2', timestamp: new Date(2024, 5, 8, 10, 35, 12), level: 'SUCCESS', message: 'تمت الموافقة على المهندس "أحمد محمود".', user: 'admin@example.com' },
  { id: 'log3', timestamp: new Date(2024, 5, 8, 11, 0, 5), level: 'INFO', message: 'تم إنشاء مشروع جديد: "مشروع بناء فيلا النرجس".', user: 'م. خالد الأحمدي' },
  { id: 'log4', timestamp: new Date(2024, 5, 8, 11, 15, 45), level: 'WARNING', message: 'محاولة تسجيل دخول فاشلة للحساب "user@test.com".' },
  { id: 'log5', timestamp: new Date(2024, 5, 8, 12, 5, 22), level: 'ERROR', message: 'فشل في الاتصال بخادم قاعدة البيانات (محاكاة).', },
  { id: 'log6', timestamp: new Date(2024, 5, 7, 15, 0, 0), level: 'INFO', message: 'تم تحديث إعدادات النظام.', user: 'admin@example.com' },
  { id: 'log7', timestamp: new Date(2024, 5, 7, 16, 20, 30), level: 'SUCCESS', message: 'تم حذف المستخدم "suspended@example.com".', user: 'admin@example.com' },
];

export let dbSettings: SystemSettings = {
  siteName: "المحترف لحساب الكميات",
  defaultLanguage: "ar",
  maintenanceMode: false,
  maxUploadSizeMB: 50,
  emailNotificationsEnabled: true,
};
