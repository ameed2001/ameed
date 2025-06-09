// src/app/login/actions.ts (أو المسار الفعلي لدالة الـ Server Action)
'use server';

import { z } from 'zod';
import { loginUser, type LoginResult } from '@/lib/mock-db';
import { type LoginActionResponse } from '@/types/auth'; // <--- هنا التعديل: استيراد من ملف الأنواع

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
        fieldErrors.email = ["البيانات المدخلة غير صحيحة."];
        fieldErrors.password = ["البيانات المدخلة غير صحيحة."];
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
  switch (user.role) {
    case "Engineer":
      redirectTo = "/my-projects";
      break;
    case "Admin":
      redirectTo = "/admin";
      break;
    case "Owner":
      redirectTo = "/owner/dashboard";
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
