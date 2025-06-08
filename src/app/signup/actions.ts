'use server';

import { z } from 'zod';

// This schema should ideally match or be imported from page.tsx
// For this example, we assume the structure of data passed in.
// type SignupFormValues = { name: string; email: string; password: string; role: "owner" | "engineer";};

export interface SignupActionResponse {
  success: boolean;
  message: string;
  isPendingApproval?: boolean;
  fieldErrors?: Record<string, string[] | undefined>; // For more detailed Zod-like errors if needed
}

export async function signupUserAction(data: { name: string; email: string; password: string; role: "owner" | "engineer"; confirmPassword?: string }): Promise<SignupActionResponse> {
  console.log("Server Action: signupUserAction called with:", { name: data.name, email: data.email, role: data.role });

  // Simulate database interaction and business logic
  // In a real app, you'd hash the password and save the user to a database.
  // Also, proper validation (e.g. with Zod) should happen here if not fully trusted from client.

  if (data.email === "exists@example.com") {
    return { 
      success: false, 
      message: "هذا البريد الإلكتروني مسجل بالفعل.",
      fieldErrors: { email: ["هذا البريد الإلكتروني مسجل بالفعل."] }
    };
  }
  
  // Basic password check (example, not for production)
  if (data.password.length < 6) {
     return { 
      success: false, 
      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
      fieldErrors: { password: ["كلمة المرور يجب أن تكون 6 أحرف على الأقل."] }
    };
  }


  if (data.role === "engineer") {
    // Simulate engineer account pending approval
    console.log(`Engineer account ${data.email} created, pending approval.`);
    return { 
      success: true, 
      message: "تم إنشاء الحساب بنجاح. حسابك كمهندس قيد المراجعة وسيتم تفعيله قريباً.", 
      isPendingApproval: true 
    };
  }

  // Owner account or other roles activated immediately
  console.log(`Owner account ${data.email} created and activated.`);
  return { 
    success: true, 
    message: "تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول." 
  };
}
