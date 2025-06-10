
'use server';

import { z } from 'zod';
import { type LoginActionResponse } from '@/types/auth';

// This schema is just for form validation, not used for DB lookup here
const adminLoginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password_input: z.string().min(1, { message: "كلمة المرور مطلوبة." }),
});

// Hardcoded admin credentials as per user request
const ADMIN_EMAIL = "ameed2001@admin.com";
const ADMIN_PASSWORD = "ameed2001";

export async function adminLoginAction(data: { email: string; password_input: string; }): Promise<LoginActionResponse> {
  console.log("[AdminLoginAction] Attempting admin login for email:", data.email);

  if (data.email === ADMIN_EMAIL && data.password_input === ADMIN_PASSWORD) {
    console.log("[AdminLoginAction] Admin login successful for:", data.email);
    
    const adminUser = {
      id: 'admin-hardcoded-001', // Placeholder ID, not from DB
      name: 'مسؤول الموقع', // Fixed admin name
      email: ADMIN_EMAIL,
      role: 'ADMIN', // Hardcoded role
    };

    return {
      success: true,
      message: "تم تسجيل دخول المسؤول بنجاح!",
      redirectTo: "/admin", // Redirect to admin dashboard
      user: adminUser,
    };
  } else {
    console.warn("[AdminLoginAction] Admin login failed for:", data.email);
    // Generic message for security, but can provide specific field errors if desired
    const fieldErrors: LoginActionResponse['fieldErrors'] = {};
    if (data.email !== ADMIN_EMAIL) {
        fieldErrors.email = ["البريد الإلكتروني للمسؤول غير صحيح."];
    }
    if (data.password_input !== ADMIN_PASSWORD && data.email === ADMIN_EMAIL) { // Only show password error if email was correct
        fieldErrors.password = ["كلمة مرور المسؤول غير صحيحة."];
    }
    
    return {
      success: false,
      message: "بيانات اعتماد المسؤول غير صحيحة.",
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : { email: ["بيانات اعتماد المسؤول غير صحيحة."], password: [" "] },
    };
  }
}
