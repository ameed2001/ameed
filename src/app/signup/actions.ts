
'use server';

import { z } from 'zod';
// Import types and functions for MongoDB from the updated db.ts
import { registerUser, type RegistrationResult, type UserRole } from '@/lib/db';

export interface SignupActionResponse {
  success: boolean;
  message: string;
  isPendingApproval?: boolean;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

// Schema for client-side validation, role will be 'OWNER' or 'ENGINEER' string
const signupSchemaClient = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  confirmPassword: z.string().min(6, { message: "تأكيد كلمة المرور مطلوب." }),
  role: z.enum(["OWNER", "ENGINEER"], { required_error: "يرجى اختيار الدور." }), // Ensure these match UserRole type
  phone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});


export async function signupUserAction(
  data: z.infer<typeof signupSchemaClient>
): Promise<SignupActionResponse> {
  console.log("[SignupAction MongoDB] Server Action called with:", {
    name: data.name,
    email: data.email,
    role: data.role,
    phone: data.phone
  });
  
  // The role from the client form is already 'OWNER' or 'ENGINEER' string.
  // This directly matches the UserRole type defined in db.ts.
  const registrationResult: RegistrationResult = await registerUser({
      name: data.name,
      email: data.email,
      password_input: data.password, // Pass the password
      role: data.role as UserRole, // Cast to UserRole, as z.enum ensures it's one of these
      phone: data.phone,
  });

  if (!registrationResult.success) {
    const fieldErrors: Record<string, string[]> = {};
    if (registrationResult.errorType === 'email_exists' && registrationResult.message) {
        fieldErrors.email = [registrationResult.message];
    }
    // Add more specific field error handling if needed
    return {
        success: false,
        message: registrationResult.message || "فشل إنشاء الحساب.",
        fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
    };
  }

  return {
    success: true,
    message: registrationResult.message || "تم إنشاء حسابك بنجاح!",
    isPendingApproval: registrationResult.isPendingApproval,
    redirectTo: registrationResult.isPendingApproval ? undefined : "/login" // Redirect to login only if not pending approval
  };
}
