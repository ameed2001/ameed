
'use server';

import { z } from 'zod';
import { dbUsers, findUserByEmail, addUser as dbAddUser } from '@/lib/mock-db';
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

  // Convert lowercase role from form to UserRole (uppercase first letter)
  const roleForDb: UserRole = data.role.charAt(0).toUpperCase() + data.role.slice(1) as UserRole;

  const newUserPayload: Pick<User, 'name' | 'email' | 'password' | 'role'> = {
      name: data.name,
      email: data.email.toLowerCase(), // Ensure email is stored consistently lowercase
      password: data.password, 
      role: roleForDb, // Use the correctly cased role
  };
  
  const newUser = dbAddUser(newUserPayload);


  if (newUser.role === "Engineer") {
    console.log(`Engineer account ${newUser.email} created, pending approval.`);
    return { 
      success: true, 
      message: "تم إنشاء حسابك كمهندس بنجاح. حسابك حاليًا قيد المراجعة والموافقة من قبل الإدارة. سيتم إعلامك عند التفعيل.", 
      isPendingApproval: true 
    };
  }

  // For Owner role (and Admin if it were allowed via signup, which it isn't here)
  console.log(`${newUser.role} account ${newUser.email} created and activated.`);
  return { 
    success: true, 
    message: "تم إنشاء حسابك كمالك بنجاح. يمكنك الآن تسجيل الدخول.",
    redirectTo: "/login" 
  };
}
