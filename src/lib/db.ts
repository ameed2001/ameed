
// src/lib/db.ts
import { PrismaClient, UserRole, UserStatus, ProjectStatus, TaskStatus, LogLevel as PrismaLogLevel, SystemSettings as PrismaSystemSettings, User as PrismaUser, Project as PrismaProject, ProjectPhoto as PrismaProjectPhoto, ProjectStage as PrismaProjectStage, Task as PrismaTask, Document as PrismaDocument, Comment as PrismaComment, Material as PrismaMaterial, QuantityReport as PrismaQuantityReport, QuantityReportItem as PrismaQuantityReportItem, ProgressUpdate as PrismaProgressUpdate, PasswordResetToken as PrismaPasswordResetToken, LogEntry as PrismaLogEntry, ProjectUser as PrismaProjectUser } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Re-export Prisma types with potentially more generic names if needed by the app
export type { PrismaUser as User, PrismaProject as Project, PrismaSystemSettings as SystemSettings, PrismaLogEntry as LogEntry, PrismaProjectPhoto as ProjectPhoto, PrismaProjectStage as ProjectStage, PrismaTask as Task, PrismaProjectTimelineTask, PrismaProjectComment, PrismaDocument as Document, PrismaComment as Comment, PrismaMaterial as Material, PrismaQuantityReport as QuantityReport, PrismaQuantityReportItem as QuantityReportItem, PrismaProgressUpdate as ProgressUpdate, PrismaPasswordResetToken as PasswordResetToken, PrismaProjectUser as ProjectUser };

// Re-export enums for easier access
export { UserRole, UserStatus, ProjectStatus, TaskStatus, PrismaLogLevel as LogLevel };


const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'], // Uncomment for verbose Prisma logging during development
});

const saltRounds = 10;
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function findUserByEmail(email: string): Promise<PrismaUser | null> {
  const normalizedEmail = email.toLowerCase();
  // console.log(`[DB] findUserByEmail: Searching for ${normalizedEmail}`);
  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    // if (user) {
    //   console.log(`[DB] findUserByEmail: Found user ${user.email}`);
    // } else {
    //   console.log(`[DB] findUserByEmail: User ${normalizedEmail} not found.`);
    // }
    return user;
  } catch (error) {
    console.error(`[DB] findUserByEmail: Error fetching user ${normalizedEmail}:`, error);
    return null;
  }
}

export async function getSystemSettings(): Promise<PrismaSystemSettings | null> {
  // console.log("[DB] getSystemSettings: Fetching...");
  try {
    const settings = await prisma.systemSettings.findFirst();
    // if (!settings) {
    //   console.warn("[DB] getSystemSettings: No system settings found. Defaults will apply.");
    // } else {
    //   console.log("[DB] getSystemSettings: Fetched successfully.");
    // }
    return settings;
  } catch (error) {
    console.error("[DB] getSystemSettings: Error fetching system settings:", error);
    return null;
  }
}

export async function createLogEntry(logData: {
  action: string;
  level: PrismaLogLevel;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}): Promise<PrismaLogEntry | null> {
  // console.log(`[DB] createLogEntry: Action - ${logData.action}, Level - ${logData.level}`);
  try {
    const entry = await prisma.logEntry.create({
      data: {
        action: logData.action,
        level: logData.level,
        message: logData.message,
        ipAddress: logData.ipAddress,
        userAgent: logData.userAgent,
        userId: logData.userId,
      },
    });
    // console.log(`[DB] createLogEntry: Log entry created, ID: ${entry.id}`);
    return entry;
  } catch (error) {
    console.error("[DB] createLogEntry: Error:", error);
    return null;
  }
}

export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  role: UserRole; // Use Prisma Enum UserRole
}): Promise<{ success: boolean; user?: PrismaUser; message?: string; isPendingApproval?: boolean }> {
  const normalizedEmail = userData.email.toLowerCase();
  console.log(`[DB] registerUser: Attempting for ${normalizedEmail}, role: ${userData.role}`);

  try {
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      console.warn(`[DB] registerUser: Email ${normalizedEmail} already exists.`);
      return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً' };
    }

    const hashedPassword = await hashPassword(userData.password);
    
    const settings = await getSystemSettings();
    const engineerApprovalRequired = settings?.engineerApprovalRequired ?? true;

    const status: UserStatus = (userData.role === UserRole.ENGINEER && engineerApprovalRequired)
      ? UserStatus.PENDING_APPROVAL
      : UserStatus.ACTIVE;

    console.log(`[DB] registerUser: Creating user ${normalizedEmail} with status ${status}`);
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        role: userData.role,
        status: status,
      },
    });
    console.log(`[DB] registerUser: User ${newUser.email} created with ID: ${newUser.id}`);

    await createLogEntry({
      action: 'USER_REGISTER',
      level: PrismaLogLevel.INFO,
      message: `User ${newUser.email} registered as ${newUser.role}, status: ${status}.`,
      userId: newUser.id,
    });

    const message = status === UserStatus.PENDING_APPROVAL 
      ? "تم إنشاء حسابك كمهندس بنجاح. حسابك حاليًا قيد المراجعة والموافقة."
      : "تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.";

    return { 
      success: true, 
      user: newUser, 
      message: message, 
      isPendingApproval: status === UserStatus.PENDING_APPROVAL 
    };
  } catch (error: any) {
    console.error(`[DB] registerUser: Error for ${normalizedEmail}:`, error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return { success: false, message: 'البريد الإلكتروني مسجل مسبقاً (DB constraint).' };
    }
    return { success: false, message: 'حدث خطأ أثناء إنشاء الحساب.' };
  }
}

export type LoginResult = {
  success: true;
  user: PrismaUser;
} | {
  success: false;
  message: string;
  errorType?: "email_not_found" | "invalid_password" | "account_suspended" | "pending_approval" | "other";
};

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const normalizedEmail = email.toLowerCase();
  console.log(`[DB] loginUser: Attempting for ${normalizedEmail}`);

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    console.warn(`[DB] loginUser: User ${normalizedEmail} not found.`);
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', errorType: "email_not_found" };
  }

  const passwordMatch = await comparePassword(password, user.passwordHash);

  if (!passwordMatch) {
    console.warn(`[DB] loginUser: Password mismatch for ${normalizedEmail}.`);
    return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة', errorType: "invalid_password" };
  }

  if (user.status === UserStatus.SUSPENDED) {
    console.warn(`[DB] loginUser: Account ${normalizedEmail} is suspended.`);
    return { success: false, message: 'حسابك موقوف. يرجى التواصل مع الإدارة', errorType: "account_suspended" };
  }

  if (user.status === UserStatus.PENDING_APPROVAL) {
    console.warn(`[DB] loginUser: Account ${normalizedEmail} is pending approval.`);
    return { success: false, message: 'حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه', errorType: "pending_approval" };
  }
  
  if (user.status === UserStatus.DELETED) {
    console.warn(`[DB] loginUser: Account ${normalizedEmail} is deleted.`);
    return { success: false, message: 'هذا الحساب تم حذفه.', errorType: "other" };
  }

  console.log(`[DB] loginUser: Login successful for ${user.email}.`);
  await createLogEntry({
      action: 'USER_LOGIN',
      level: PrismaLogLevel.SUCCESS,
      message: `User ${user.email} logged in.`,
      userId: user.id
  });
  return { success: true, user };
}


export async function getUsers(adminId: string): Promise<{ success: boolean; users?: PrismaUser[]; message?: string }> {
    console.log(`[DB] getUsers: Called by admin: ${adminId}`);
    // TODO: Implement admin role check for adminId if necessary
    try {
        const users = await prisma.user.findMany();
        return { success: true, users };
    } catch (error) {
        console.error("[DB] getUsers: Error fetching users:", error);
        return { success: false, message: "Failed to fetch users." };
    }
}

export async function updateUser(userId: string, updates: Partial<PrismaUser>): Promise<{ success: boolean; user?: PrismaUser; message?: string }> {
    console.log(`[DB] updateUser: Updating user: ${userId} with `, updates);
     try {
        // Ensure passwordHash is not updated directly if password is provided
        if ('password' in updates && typeof updates.password === 'string') {
            (updates as any).passwordHash = await hashPassword(updates.password);
            delete updates.password;
        }
        const user = await prisma.user.update({ where: { id: userId }, data: updates });
        return { success: true, user };
    } catch (error) {
        console.error(`[DB] updateUser: Error updating user ${userId}:`, error);
        return { success: false, message: "Failed to update user." };
    }
}

export async function deleteUser(adminId: string, userIdToDelete: string): Promise<{ success: boolean; message?: string }> {
    console.log(`[DB] deleteUser: Admin: ${adminId} attempting to delete user: ${userIdToDelete}`);
    // TODO: Implement admin role check
    try {
        // Option 1: Actual delete
        // await prisma.user.delete({ where: { id: userIdToDelete }});
        // Option 2: Soft delete (mark as DELETED)
        await prisma.user.update({
            where: { id: userIdToDelete },
            data: { status: UserStatus.DELETED }
        });
        await createLogEntry({
            action: 'USER_DELETE', level: PrismaLogLevel.WARNING,
            message: `User ${userIdToDelete} marked as DELETED by admin ${adminId}.`, userId: adminId
        });
        return { success: true, message: "تم حذف المستخدم بنجاح (وضع علامة للحذف)." };
    } catch (error) {
        console.error(`[DB] deleteUser: Error deleting user ${userIdToDelete}:`, error);
        return { success: false, message: "فشل حذف المستخدم." };
    }
}

export async function approveEngineer(adminId: string, engineerId: string): Promise<{ success: boolean; message?: string }> {
  console.log(`[DB] approveEngineer: Admin ${adminId} attempting to approve engineer ${engineerId}`);
  // TODO: Validate adminId has ADMIN role
  const admin = await prisma.user.findUnique({ where: { id: adminId }});
  if (!admin || admin.role !== UserRole.ADMIN) {
    return { success: false, message: 'ليست لديك الصلاحية لهذا الإجراء.' };
  }

  const engineer = await prisma.user.findUnique({ where: { id: engineerId } });
  if (!engineer || engineer.role !== UserRole.ENGINEER) {
    return { success: false, message: 'المستخدم ليس مهندسًا أو غير موجود.' };
  }
  if (engineer.status !== UserStatus.PENDING_APPROVAL) {
    return { success: false, message: 'حساب المهندس ليس في انتظار الموافقة.' };
  }

  try {
    await prisma.user.update({
      where: { id: engineerId },
      data: { status: UserStatus.ACTIVE },
    });
    await createLogEntry({
        action: 'ENGINEER_APPROVE', level: PrismaLogLevel.INFO,
        message: `Engineer ${engineer.email} approved by admin ${admin.email}.`, userId: adminId
    });
    return { success: true, message: 'تمت الموافقة على حساب المهندس بنجاح.' };
  } catch (error) {
    console.error(`[DB] approveEngineer: Error for engineer ${engineerId}:`, error);
    return { success: false, message: 'حدث خطأ أثناء الموافقة على المهندس.' };
  }
}

export async function suspendUser(adminId: string, userIdToSuspend: string): Promise<{ success: boolean; message?: string }> {
  console.log(`[DB] suspendUser: Admin ${adminId} attempting to suspend/activate user ${userIdToSuspend}`);
  // TODO: Validate adminId has ADMIN role
  const admin = await prisma.user.findUnique({ where: { id: adminId }});
   if (!admin || admin.role !== UserRole.ADMIN) {
    return { success: false, message: 'ليست لديك الصلاحية لهذا الإجراء.' };
  }

  const userToModify = await prisma.user.findUnique({ where: { id: userIdToSuspend }});
  if (!userToModify) return { success: false, message: "المستخدم غير موجود." };
  if (userToModify.role === UserRole.ADMIN && userToModify.id !== adminId) { // Admin cannot suspend another admin
      return { success: false, message: "لا يمكن تعليق حساب مشرف آخر." };
  }
   if (userToModify.id === adminId && userToModify.status === UserStatus.ACTIVE) { // Admin cannot suspend self
      return { success: false, message: "لا يمكنك تعليق حسابك الخاص." };
  }


  const newStatus = userToModify.status === UserStatus.SUSPENDED ? UserStatus.ACTIVE : UserStatus.SUSPENDED;
  try {
    await prisma.user.update({
        where: { id: userIdToSuspend },
        data: { status: newStatus },
    });
    const actionMessage = newStatus === UserStatus.SUSPENDED ? "تعليق" : "إعادة تفعيل";
    await createLogEntry({
        action: newStatus === UserStatus.SUSPENDED ? 'USER_SUSPEND' : 'USER_ACTIVATE',
        level: PrismaLogLevel.WARNING,
        message: `User ${userToModify.email} status changed to ${newStatus} by admin ${admin.email}.`,
        userId: adminId
    });
    return { success: true, message: `تم ${actionMessage} حساب ${userToModify.name} بنجاح.`};
  } catch (error) {
     console.error(`[DB] suspendUser: Error changing status for user ${userIdToSuspend}:`, error);
    return { success: false, message: "فشل تغيير حالة المستخدم." };
  }
}


// Placeholder for other Prisma-based functions
// Example: Get all projects (adjust based on user role/permissions later)
export async function getAllProjects(): Promise<PrismaProject[]> {
  return prisma.project.findMany({
    include: {
      owner: true, // Include owner details
      projectUsers: { include: { user: true } }, // Include engineers linked to the project
      photos: true,
      // Add other relations as needed
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getProjectById(projectId: string): Promise<PrismaProject | null> {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: true,
      projectUsers: { include: { user: true } },
      stages: { include: { tasks: true } },
      tasks: true, // Direct tasks not under stages
      materials: true,
      quantityReports: { include: { items: true } },
      progressUpdates: { include: { photos: true, comments: { include: { user: true } } } },
      photos: true,
      comments: { include: { user: true }, orderBy: { createdAt: 'desc' } },
      documents: true,
    }
  });
}

export async function createProject(projectData: Omit<PrismaProject, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'overallProgress'> & { engineerIds?: string[] }): Promise<PrismaProject> {
  const { engineerIds, ...restOfProjectData } = projectData;
  return prisma.project.create({
    data: {
      ...restOfProjectData,
      status: ProjectStatus.PLANNED, // Default status
      overallProgress: 0,
      projectUsers: engineerIds ? {
        create: engineerIds.map(engId => ({
          userId: engId,
          role: 'ENGINEER' // Or a more specific role if defined
        }))
      } : undefined
    }
  });
}

export async function updateProject(projectId: string, projectData: Partial<Omit<PrismaProject, 'id' | 'createdAt' | 'updatedAt'>> & { newEngineerIds?: string[], removedEngineerIds?: string[] }): Promise<PrismaProject | null> {
  const { newEngineerIds, removedEngineerIds, ...restOfProjectData } = projectData;
  try {
    return await prisma.$transaction(async (tx) => {
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: {
          ...restOfProjectData,
          updatedAt: new Date(), // Manually set updatedAt
        },
      });

      if (newEngineerIds && newEngineerIds.length > 0) {
        await tx.projectUser.createMany({
          data: newEngineerIds.map(engId => ({
            projectId: projectId,
            userId: engId,
            role: 'ENGINEER'
          })),
          skipDuplicates: true,
        });
      }

      if (removedEngineerIds && removedEngineerIds.length > 0) {
        await tx.projectUser.deleteMany({
          where: {
            projectId: projectId,
            userId: { in: removedEngineerIds }
          }
        });
      }
      return updatedProject;
    });
  } catch (error) {
    console.error(`[DB] updateProject: Error updating project ${projectId}:`, error);
    return null;
  }
}

export async function deleteProject(adminId: string, projectId: string): Promise<{success: boolean; message?:string}> {
    // TODO: Add admin role check
    console.log(`[DB] deleteProject: Admin ${adminId} attempting to delete project ${projectId}`);
    try {
        await prisma.project.delete({
            where: {id: projectId}
        });
         await createLogEntry({
            action: 'PROJECT_DELETE', level: PrismaLogLevel.WARNING,
            message: `Project ${projectId} DELETED by admin ${adminId}.`, userId: adminId
        });
        return {success: true, message: "تم حذف المشروع وجميع بياناته المرتبطة."};
    } catch (error) {
        console.error(`[DB] deleteProject: Error deleting project ${projectId}:`, error);
        return {success: false, message: "فشل حذف المشروع."};
    }
}


// Export Prisma client instance if needed directly elsewhere (though typically through these functions)
export { prisma };

// Type for ProjectTimelineTask (if it was from mock-db, and Prisma generates ProjectStage which has Tasks)
// Prisma's Task model under ProjectStage would be the equivalent.
// If a direct "TimelineTask" concept distinct from staged tasks is needed, it should be in schema.prisma.
// For now, assuming tasks within stages cover this.
interface PrismaProjectTimelineTask {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  color: string; // Tailwind bg color class e.g., 'bg-blue-500'
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED'; // Ensure these match your TaskStatus enum if applicable
  progress?: number;
}

// Type for ProjectComment (if it was from mock-db)
// Prisma's Comment model covers this, ensure fields match.
interface PrismaProjectComment {
  id: string;
  user: string; // Or better, userId linking to User model
  text: string;
  date: string; // ISO Date string
  avatar?: string;
  dataAiHintAvatar?: string;
}
