'use server';

import { z } from 'zod';
import { loginUser } from '@/lib/mock-db'; // استيراد دالة loginUser من قاعدة البيانات المحدثة
import type { LoginActionResponse } from './actions';

export async function loginUserAction(data: { email: string; password: string; }): Promise<LoginActionResponse> {
  console.log("[LoginAction] محاولة تسجيل دخول للبريد:", data.email);

  // استدعاء دالة تسجيل الدخول من قاعدة البيانات
  const result = await loginUser(data.email, data.password);

  if (!result.success) {
    console.error("[LoginAction] فشل تسجيل الدخول:", result.message);
    return { 
      success: false, 
      message: result.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      fieldErrors: { 
        email: ["البيانات المدخلة غير صحيحة"], 
        password: ["البيانات المدخلة غير صحيحة"] 
      }
    };
  }

  const user = result.user!;

  // تحديد الصفحة المستهدفة بناءً على دور المستخدم
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