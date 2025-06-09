// src/app/login/actions.ts
'use server';

import { z } from 'zod';
import { loginUser, type LoginResult, type UserDocument } from '@/lib/db'; // Use UserDocument from db.ts
import { type LoginActionResponse } from '@/types/auth';

export async function loginUserAction(data: { email: string; password_input: string; }): Promise<LoginActionResponse> {
  console.log("[LoginAction JSON_DB] Attempting login for email:", data.email);

  // The loginUser function in db.ts expects 'password_input'
  const result: LoginResult = await loginUser(data.email, data.password_input);

  if (!result.success || !result.user) {
    console.error("[LoginAction JSON_DB] Login failed:", result.message);
    const fieldErrors: LoginActionResponse['fieldErrors'] = {};
    let generalMessage = result.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.";

    switch (result.errorType) {
      case "email_not_found":
        fieldErrors.email = [result.message || "البريد الإلكتروني غير مسجل."];
        generalMessage = result.message || "البريد الإلكتروني غير مسجل.";
        break;
      case "invalid_password":
        // Changed to 'password_input' to match form field name if needed for setError
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
        break;
    }

    return {
      success: false,
      message: generalMessage,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    };
  }

  const userFromDb = result.user; 
   const userForClient = {
      id: userFromDb.id,
      name: userFromDb.name,
      email: userFromDb.email,
      role: userFromDb.role,
  };


  let redirectTo = "/"; 
  switch (userFromDb.role) { // user.role is UserRole (uppercase)
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
      console.warn(`[LoginAction JSON_DB] Unknown role for user ${userFromDb.email}: ${userFromDb.role}`);
      redirectTo = "/";
  }

  console.log(`[LoginAction JSON_DB] Login successful for ${userFromDb.email} (Role: ${userFromDb.role}). Redirecting to ${redirectTo}`);

  return {
    success: true,
    message: "تم تسجيل الدخول بنجاح!",
    redirectTo: redirectTo,
    user: userForClient,
  };
}

