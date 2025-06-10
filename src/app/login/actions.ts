
// src/app/login/actions.ts
'use server';

import { type LoginActionResponse } from '@/types/auth';
import { loginUser, type LoginResult } from '@/lib/db'; // Restored import

export async function loginUserAction(data: { email: string; password_input: string; }): Promise<LoginActionResponse> {
  console.log("[LoginAction JSON_DB] Attempting login for email:", data.email);

  const result: LoginResult = await loginUser(data.email, data.password_input);

  if (!result.success || !result.user) {
    console.error("[LoginAction JSON_DB] Login failed:", result.message, "ErrorType:", result.errorType);
    const fieldErrors: LoginActionResponse['fieldErrors'] = {};
    let generalMessage = result.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.";

    switch (result.errorType) {
      case "email_not_found":
        fieldErrors.email = [result.message || "البريد الإلكتروني غير مسجل."];
        generalMessage = result.message || "البريد الإلكتروني غير مسجل.";
        break;
      case "invalid_password":
        fieldErrors.password_input = [result.message || "كلمة المرور غير صحيحة."]; // Ensure field name matches form
        generalMessage = result.message || "كلمة المرور غير صحيحة.";
        break;
      case "account_suspended":
        generalMessage = result.message || "حسابك موقوف. يرجى التواصل مع الإدارة.";
        break;
      case "pending_approval":
        generalMessage = result.message || "حسابك قيد المراجعة. يرجى الانتظار حتى الموافقة عليه.";
        break;
      case "account_deleted":
        generalMessage = result.message || "هذا الحساب تم حذفه.";
        break;
      default:
        // For other or db_error, generalMessage is already set.
        // If no specific field errors, the form can display the general message.
        break;
    }

    return {
      success: false,
      message: generalMessage,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    };
  }

  const userFromDb = result.user; // This is Omit<UserDocument, 'password_hash'>
   const userForClient = { // This structure matches LoginActionResponse.user
      id: userFromDb.id,
      name: userFromDb.name,
      email: userFromDb.email,
      role: userFromDb.role,
  };


  let redirectTo = "/"; 
  switch (userFromDb.role) {
    case 'ENGINEER':
      redirectTo = "/my-projects";
      break;
    case 'ADMIN': // Admins typically use /admin-login, but handle if they use main form
      redirectTo = "/admin";
      break;
    case 'OWNER':
      redirectTo = "/owner/dashboard"; 
      break;
    case 'GENERAL_USER': 
       redirectTo = "/"; 
       break;
    default:
      console.warn(`[LoginAction JSON_DB] Unknown role for user ${userFromDb.email}: ${userFromDb.role}`);
      redirectTo = "/"; // Fallback to home for unknown roles
  }

  console.log(`[LoginAction JSON_DB] Login successful for ${userFromDb.email} (Role: ${userFromDb.role}). Redirecting to ${redirectTo}`);

  return {
    success: true,
    message: "تم تسجيل الدخول بنجاح!",
    redirectTo: redirectTo,
    user: userForClient,
  };
}
