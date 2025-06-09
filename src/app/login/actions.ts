
// src/app/login/actions.ts
'use server';

import { z } from 'zod';
import { loginUser, type LoginResult, type UserRole } from '@/lib/db'; 
import { type LoginActionResponse } from '@/types/auth';
import type { UserDocument } from '@/lib/db';

export async function loginUserAction(data: { email: string; password_input: string; }): Promise<LoginActionResponse> {
  console.log("[LoginAction MongoDB] Attempting login for email:", data.email);

  // The loginUser function in db.ts expects 'password_input'
  const result: LoginResult = await loginUser(data.email, data.password_input);

  if (!result.success || !result.user) {
    console.error("[LoginAction MongoDB] Login failed:", result.message);
    const fieldErrors: LoginActionResponse['fieldErrors'] = {};
    let generalMessage = result.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.";

    switch (result.errorType) {
      case "email_not_found":
        fieldErrors.email = [result.message || "البريد الإلكتروني غير مسجل."];
        generalMessage = result.message || "البريد الإلكتروني غير مسجل.";
        break;
      case "invalid_password":
        fieldErrors.password = [result.message || "كلمة المرور غير صحيحة."];
        generalMessage = result.message || "كلمة المرور غير صحيحة.";
        break;
      case "account_suspended":
        generalMessage = result.message || "حسابك موقوف. يرجى التواصل مع الإدارة.";
        break;
      case "pending_approval":
        generalMessage = result.message || "حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه.";
        break;
      default:
        // Avoid overly generic error on email/password fields if the error isn't specific to them
        if (!result.message?.includes("البريد الإلكتروني") && !result.message?.includes("كلمة المرور")) {
             // generalMessage is already set
        } else {
            // If message is specific, let it be the general message without field errors
        }
        break;
    }

    return {
      success: false,
      message: generalMessage,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    };
  }

  // At this point, result.user is guaranteed to be defined
  const user = result.user; 

  let redirectTo = "/"; 
  switch (user.role) { // user.role is UserRole (uppercase)
    case 'ENGINEER':
      redirectTo = "/my-projects";
      break;
    case 'ADMIN':
      redirectTo = "/admin";
      break;
    case 'OWNER':
      redirectTo = "/owner/dashboard"; 
      break;
    case 'GENERAL_USER': 
       redirectTo = "/"; 
       break;
    default:
      // This should ideally not happen if roles are strictly managed
      console.warn(`[LoginAction MongoDB] Unknown role for user ${user.email}: ${user.role}`);
      redirectTo = "/";
  }

  console.log(`[LoginAction MongoDB] Login successful for ${user.email} (Role: ${user.role}). Redirecting to ${redirectTo}`);

  return {
    success: true,
    message: "تم تسجيل الدخول بنجاح!",
    redirectTo: redirectTo
  };
}
