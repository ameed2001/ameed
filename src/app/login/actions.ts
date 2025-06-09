
// src/app/login/actions.ts
'use server';

import { z } from 'zod';
// Import types and functions for MongoDB from the updated db.ts
import { loginUser, type LoginResult, type UserRole } from '@/lib/db'; 
import { type LoginActionResponse } from '@/types/auth';
import type { UserDocument } from '@/lib/db'; // Using UserDocument type from db.ts

export async function loginUserAction(data: { email: string; password: string; }): Promise<LoginActionResponse> {
  console.log("[LoginAction MongoDB] محاولة تسجيل دخول للبريد:", data.email);

  const result: LoginResult = await loginUser(data.email, data.password);

  if (!result.success || !result.user) {
    console.error("[LoginAction MongoDB] فشل تسجيل الدخول:", result.message);
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
        if (!result.message?.includes("البريد الإلكتروني") && !result.message?.includes("كلمة المرور")) {
            fieldErrors.email = ["البيانات المدخلة غير صحيحة."];
            fieldErrors.password = ["البيانات المدخلة غير صحيحة."];
        }
        generalMessage = result.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        break;
    }

    return {
      success: false,
      message: generalMessage,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    };
  }

  const user = result.user; // User object from MongoDB (without passwordHash)

  let redirectTo = "/"; // Default redirect
  // UserRole is a string type: 'ADMIN' | 'ENGINEER' | 'OWNER' | 'GENERAL_USER'
  switch (user.role) {
    case 'ENGINEER':
      redirectTo = "/my-projects";
      break;
    case 'ADMIN':
      redirectTo = "/admin";
      break;
    case 'OWNER':
      redirectTo = "/owner/dashboard"; 
      break;
    case 'GENERAL_USER': // Handle GENERAL_USER if applicable
       redirectTo = "/"; 
       break;
    default:
      redirectTo = "/";
  }

  console.log(`[LoginAction MongoDB] تم تسجيل دخول ${user.email} (الدور: ${user.role}) بنجاح. التوجيه إلى ${redirectTo}`);

  return {
    success: true,
    message: "تم تسجيل الدخول بنجاح!",
    redirectTo: redirectTo
    // Optionally, you can pass user data if needed by the client, but be careful with sensitive info
    // user: { id: user.id, name: user.name, email: user.email, role: user.role } 
  };
}
