'use server';

import { z } from 'zod';

// This schema should ideally match or be imported from page.tsx
// type LoginFormValues = { email: string; password: string; };

export interface LoginActionResponse {
  success: boolean;
  message: string;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export async function loginUserAction(data: { email: string; password: string; }): Promise<LoginActionResponse> {
  console.log("Server Action: loginUserAction called with:", { email: data.email });

  // Simulate user authentication
  // In a real app, you'd query a database and verify the hashed password.

  if (data.email === "owner@example.com" && data.password === "password123") {
    // Simulate successful login for an owner
    console.log(`Owner ${data.email} logged in successfully.`);
    // In a real app, you'd set up a session/cookie here
    return { success: true, message: "تم تسجيل الدخول بنجاح!", redirectTo: "/" };
  } else if (data.email === "engineer_approved@example.com" && data.password === "password123") {
    // Simulate successful login for an approved engineer
    console.log(`Engineer ${data.email} (approved) logged in successfully.`);
    return { success: true, message: "تم تسجيل الدخول بنجاح كمهندس!", redirectTo: "/my-projects" }; // Or engineer dashboard
  } else if (data.email === "engineer_pending@example.com" && data.password === "password123") {
    // Simulate login attempt for an engineer whose account is pending approval
    console.log(`Engineer ${data.email} login attempt, account pending approval.`);
    return { 
      success: false, 
      message: "حسابك كمهندس لا يزال قيد المراجعة والموافقة. يرجى المحاولة لاحقًا أو التواصل مع الإدارة." 
    };
  } else if (data.email === "admin@example.com" && data.password === "adminpass") {
    // Simulate successful login for an admin
    console.log(`Admin ${data.email} logged in successfully.`);
    return { success: true, message: "تم تسجيل الدخول كمدير بنجاح!", redirectTo: "/admin" };
  }


  console.log(`Login failed for ${data.email}.`);
  return { 
    success: false, 
    message: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    fieldErrors: { email: ["البيانات المدخلة غير صحيحة"], password: ["البيانات المدخلة غير صحيحة"] }
  };
}
