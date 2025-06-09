
// src/app/login/actions.ts
'use server';

import { z } from 'zod';
// Updated imports to use Prisma-based functions and types
import { loginUser, type LoginResult } from '@/lib/db'; 
import { UserRole as PrismaUserRole } from '@prisma/client'; // Corrected import for UserRole
import { type LoginActionResponse } from '@/types/auth';
import type { User } from '@prisma/client';


export async function loginUserAction(data: { email: string; password: string; }): Promise<LoginActionResponse> {
  console.log("[LoginAction] محاولة تسجيل دخول للبريد:", data.email);

  const result: LoginResult = await loginUser(data.email, data.password);

  if (!result.success) {
    console.error("[LoginAction] فشل تسجيل الدخول:", result.message);
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
        // For 'other' or undefined errorType, keep a general message
        // and potentially set errors on both fields if appropriate
        if (!result.message?.includes("البريد الإلكتروني") && !result.message?.includes("كلمة المرور")) {
            // Only set generic field errors if the message isn't already specific
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

  const user = result.user!;

  let redirectTo = "/";
  // Use PrismaUserRole for comparison
  switch (user.role) {
    case PrismaUserRole.ENGINEER:
      redirectTo = "/my-projects";
      break;
    case PrismaUserRole.ADMIN:
      redirectTo = "/admin";
      break;
    case PrismaUserRole.OWNER:
      redirectTo = "/owner/dashboard"; // Default for owner
      break;
    case PrismaUserRole.GENERAL_USER:
       redirectTo = "/"; // Default for general user
       break;
    default:
      redirectTo = "/";
  }

  console.log(`[LoginAction] تم تسجيل دخول ${user.email} (الدور: ${user.role}) بنجاح. التوجيه إلى ${redirectTo}`);

  return {
    success: true,
    message: "تم تسجيل الدخول بنجاح!",
    redirectTo: redirectTo
  };
}

