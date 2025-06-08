
'use server';

import { z } from 'zod';
import { dbUsers, findUserByEmail } from '@/lib/mock-db'; // dbUsers is imported here
import type { LoginActionResponse } from './actions'; // Assuming this is defined elsewhere or should be in this file

// Make sure LoginActionResponse is defined, or remove if defined elsewhere and correctly imported
// For example:
// export interface LoginActionResponse {
//   success: boolean;
//   message: string;
//   redirectTo?: string;
//   fieldErrors?: Record<string, string[] | undefined>;
// }

export async function loginUserAction(data: { email: string; password: string; }): Promise<LoginActionResponse> {
  console.log("[LoginAction] Attempting login for email:", data.email);
  // To log dbUsers, ensure it's accessible here. If it's from mock-db, it should be.
  // console.log("[LoginAction] Current dbUsers state at start of loginUserAction:", JSON.stringify(dbUsers, null, 2));


  const user = findUserByEmail(data.email);

  if (!user) {
    console.error("[LoginAction] User not found for email:", data.email);
    console.log("[LoginAction] dbUsers when user not found:", JSON.stringify(dbUsers, null, 2)); // Log dbUsers state
    return { 
      success: false, 
      message: "البريد الإلكتروني أو كلمة المرور غير صحيحة (المستخدم غير موجود).",
      fieldErrors: { email: ["البيانات المدخلة غير صحيحة"], password: ["البيانات المدخلة غير صحيحة"] }
    };
  }
  
  console.log("[LoginAction] User found:", JSON.stringify(user, null, 2));

  if (user.password_hash !== data.password) {
    console.error("[LoginAction] Password mismatch for user:", data.email);
    console.log("[LoginAction] Stored hash:", user.password_hash, "Received pass:", data.password);
    return { 
      success: false, 
      message: "البريد الإلكتروني أو كلمة المرور غير صحيحة (كلمة المرور خاطئة).",
      fieldErrors: { email: ["البيانات المدخلة غير صحيحة"], password: ["البيانات المدخلة غير صحيحة"] }
    };
  }

  if (user.role === "Engineer" && user.status === "Pending Approval") {
    console.log(`[LoginAction] Engineer ${data.email} login attempt, account pending approval.`);
    return { 
      success: false, 
      message: "حسابك كمهندس لا يزال قيد المراجعة والموافقة من قبل الإدارة. يرجى المحاولة لاحقًا أو التواصل مع الإدارة." 
    };
  }
  
  if (user.status !== "Active") {
     console.log(`[LoginAction] User ${data.email} login attempt, account not active (status: ${user.status}).`);
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
  } else if (user.role === "Owner") {
    redirectTo = "/owner/dashboard";
  }

  console.log(`[LoginAction] User ${data.email} (Role: ${user.role}) logged in successfully. Redirecting to ${redirectTo}`);
  return { 
    success: true, 
    message: "تم تسجيل الدخول بنجاح!", 
    redirectTo: redirectTo 
  };
}
