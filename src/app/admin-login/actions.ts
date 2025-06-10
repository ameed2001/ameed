
'use server';

import { z } from 'zod';
import { type LoginActionResponse } from '@/types/auth';

// const ADMIN_EMAIL = "ameed2001@admin.com"; // Original
// const ADMIN_PASSWORD = "ameed2001"; // Original

export async function adminLoginAction(data: { email: string; password_input: string; }): Promise<LoginActionResponse> {
  console.log("[AdminLoginAction] DEBUG: Action reached. Email:", data.email);

  // Temporarily bypass actual admin login logic for debugging
  if (data.email && data.password_input) {
    // Simulate a successful admin login response
    return {
      success: true,
      message: "DEBUG: Admin login action reached and processed successfully (SIMULATED)!",
      redirectTo: "/admin",
      user: { id: 'debug-admin', name: 'Debug Admin', email: data.email, role: 'ADMIN' } // Mock admin user
    };
  }

  // Simulate a failure if data is missing
  return { 
    success: false, 
    message: "DEBUG: Admin login action reached, but required data missing (SIMULATED)." 
  };
  
  /* Original Code:
  console.log("[AdminLoginAction] Attempting admin login for email:", data.email);

  if (data.email === ADMIN_EMAIL && data.password_input === ADMIN_PASSWORD) {
    console.log("[AdminLoginAction] Admin login successful for:", data.email);
    
    const adminUser = {
      id: 'admin-hardcoded-001',
      name: 'مسؤول الموقع',
      email: ADMIN_EMAIL,
      role: 'ADMIN',
    };

    return {
      success: true,
      message: "تم تسجيل دخول المسؤول بنجاح!",
      redirectTo: "/admin",
      user: adminUser,
    };
  } else {
    console.warn("[AdminLoginAction] Admin login failed for:", data.email);
    const fieldErrors: LoginActionResponse['fieldErrors'] = {};
    if (data.email !== ADMIN_EMAIL) {
        fieldErrors.email = ["البريد الإلكتروني للمسؤول غير صحيح."];
    }
    if (data.password_input !== ADMIN_PASSWORD && data.email === ADMIN_EMAIL) {
        fieldErrors.password = ["كلمة مرور المسؤول غير صحيحة."];
    }
    
    return {
      success: false,
      message: "بيانات اعتماد المسؤول غير صحيحة.",
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : { email: ["بيانات اعتماد المسؤول غير صحيحة."], password: [" "] },
    };
  }
  */
}
