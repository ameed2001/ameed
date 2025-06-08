
'use server';

import { z } from 'zod';
import { dbUsers, findUserByEmail } from '@/lib/mock-db';

export interface LoginActionResponse {
  success: boolean;
  message: string;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export async function loginUserAction(data: { email: string; password: string; }): Promise<LoginActionResponse> {
  console.log("Server Action: loginUserAction called with:", { email: data.email });

  const user = findUserByEmail(data.email);

  if (!user || user.password !== data.password) {
    console.log(`Login failed for ${data.email}. Invalid credentials.`);
    return { 
      success: false, 
      message: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      fieldErrors: { email: ["البيانات المدخلة غير صحيحة"], password: ["البيانات المدخلة غير صحيحة"] }
    };
  }

  if (user.role === "Engineer" && user.status === "Pending Approval") {
    console.log(`Engineer ${data.email} login attempt, account pending approval.`);
    return { 
      success: false, 
      message: "حسابك كمهندس لا يزال قيد المراجعة والموافقة من قبل الإدارة. يرجى المحاولة لاحقًا أو التواصل مع الإدارة." 
    };
  }
  
  if (user.status !== "Active") {
     console.log(`User ${data.email} login attempt, account not active (status: ${user.status}).`);
    return { 
      success: false, 
      message: "حسابك غير نشط حاليًا. يرجى التواصل مع الإدارة."
    };
  }

  let redirectTo = "/"; 
  if (user.role === "Engineer") {
    redirectTo = "/my-projects"; 
  } else if (user.role === "Admin") {
    redirectTo = "/admin"; 
  }

  console.log(`User ${data.email} (Role: ${user.role}) logged in successfully. Redirecting to ${redirectTo}`);
  return { 
    success: true, 
    message: "تم تسجيل الدخول بنجاح!", 
    redirectTo: redirectTo 
  };
}
