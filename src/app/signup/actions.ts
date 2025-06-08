
'use server';

import { z } from 'zod';
import { dbUsers, findUserByEmail, registerUser } from '@/lib/mock-db'; // Changed addUser to registerUser
import type { User, UserRole } from '@/lib/mock-db';

export interface SignupActionResponse {
  success: boolean;
  message: string;
  isPendingApproval?: boolean;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export async function signupUserAction(data: { name: string; email: string; password: string; role: "owner" | "engineer"; confirmPassword?: string }): Promise<SignupActionResponse> {
  console.log("Server Action: signupUserAction called with:", { name: data.name, email: data.email, role: data.role });

  if (findUserByEmail(data.email)) {
    return {
      success: false,
      message: "هذا البريد الإلكتروني مسجل بالفعل.",
      fieldErrors: { email: ["هذا البريد الإلكتروني مسجل بالفعل."] }
    };
  }

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

  // The registerUser function in mock-db.ts expects 'Engineer' | 'Owner' (capitalized).
  const roleForDb: 'Engineer' | 'Owner' = data.role.charAt(0).toUpperCase() + data.role.slice(1) as 'Engineer' | 'Owner';

  const registrationResult = registerUser({
      name: data.name,
      email: data.email.toLowerCase(), // Ensure email is stored consistently lowercase
      password_hash: data.password, // Pass password as password_hash
      role: roleForDb,
  });


  if (!registrationResult.success || !registrationResult.user) {
    return {
        success: false,
        message: registrationResult.message || "فشل إنشاء الحساب.",
        // Potentially pass fieldErrors from registrationResult if it provides them
    };
  }

  const newUser = registrationResult.user;

  if (newUser.role === "Engineer") {
    console.log(`Engineer account ${newUser.email} created, pending approval.`);
    return {
      success: true,
      message: "تم إنشاء حسابك كمهندس بنجاح. حسابك حاليًا قيد المراجعة والموافقة من قبل الإدارة. سيتم إعلامك عند التفعيل.",
      isPendingApproval: true
    };
  }

  // For Owner role
  console.log(`${newUser.role} account ${newUser.email} created and activated.`);
  return {
    success: true,
    message: "تم إنشاء حسابك كمالك بنجاح. يمكنك الآن تسجيل الدخول.",
    redirectTo: "/login"
  };
}
