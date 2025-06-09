
'use server';

import { z } from 'zod';
// Updated import to use Prisma-based registerUser and UserRole
import { registerUser, UserRole as PrismaUserRole } from '@/lib/db'; 
import type { User } from '@prisma/client'; // Import User type from Prisma

export interface SignupActionResponse {
  success: boolean;
  message: string;
  isPendingApproval?: boolean;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export async function signupUserAction(data: { name: string; email: string; password: string; role: "owner" | "engineer"; confirmPassword?: string }): Promise<SignupActionResponse> {
  console.log("Server Action: signupUserAction called with:", { name: data.name, email: data.email, role: data.role });

  // Basic validation matching client-side
  if (data.password.length < 6) {
     return {
      success: false,
      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
      fieldErrors: { password: ["كلمة المرور يجب أن تكون 6 أحرف على الأقل."] }
    };
  }

  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      message: "كلمتا المرور غير متطابقتين.",
      fieldErrors: { confirmPassword: ["كلمتا المرور غير متطابقتين."] }
    };
  }
  
  // Map client role to Prisma UserRole enum
  const roleForDb: PrismaUserRole = data.role === 'engineer' ? PrismaUserRole.ENGINEER : PrismaUserRole.OWNER;

  const registrationResult = await registerUser({
      name: data.name,
      email: data.email, 
      password: data.password, // Pass plain password, hashing is done in registerUser
      role: roleForDb,
  });


  if (!registrationResult.success || !registrationResult.user) {
    return {
        success: false,
        message: registrationResult.message || "فشل إنشاء الحساب.",
        fieldErrors: registrationResult.message?.includes("البريد الإلكتروني مسجل") ? { email: [registrationResult.message] } : undefined,
    };
  }

  const newUser = registrationResult.user;

  if (newUser.role === PrismaUserRole.ENGINEER && registrationResult.isPendingApproval) {
    console.log(`Engineer account ${newUser.email} created, pending approval.`);
    return {
      success: true,
      message: "تم إنشاء حسابك كمهندس بنجاح. حسابك حاليًا قيد المراجعة والموافقة من قبل الإدارة. سيتم إعلامك عند التفعيل.",
      isPendingApproval: true
    };
  }

  console.log(`${newUser.role} account ${newUser.email} created and activated.`);
  return {
    success: true,
    message: "تم إنشاء حسابك كمالك بنجاح. يمكنك الآن تسجيل الدخول.",
    redirectTo: "/login"
  };
}

