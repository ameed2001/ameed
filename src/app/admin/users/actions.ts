
"use server";

import { z } from 'zod';
import { registerUser, type UserRole } from '@/lib/db';
import type { SignupActionResponse } from '@/app/signup/actions'; // Can re-use this response type

// Schema for admin creating a user - very similar to signup
const adminCreateUserSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  // confirmPassword is validated on client, not strictly needed here if password is provided directly
  role: z.enum(['ADMIN', 'ENGINEER', 'OWNER'], { required_error: "الدور مطلوب." }),
});

type AdminCreateUserFormValues = z.infer<typeof adminCreateUserSchema>;

export async function adminCreateUserAction(
  data: AdminCreateUserFormValues
): Promise<SignupActionResponse> {
  console.log("[AdminCreateUserAction] Attempting to create user by admin:", data.email, "Role:", data.role);

  // Data should already be validated by Zod on the client in AddUserDialog
  // but we can re-validate or do more checks if needed.

  // The registerUser function expects 'password_input' and an uppercase role.
  const registrationResult = await registerUser({
    name: data.name,
    email: data.email,
    password_input: data.password, // Ensure this matches what registerUser expects
    role: data.role as UserRole, // Role is already UserRole type from the form
  });

  if (!registrationResult.success) {
    // Map error messages or types if needed for admin context
    return {
      success: false,
      message: registrationResult.message || "فشل إنشاء حساب المستخدم.",
      fieldErrors: registrationResult.errorType === 'email_exists' && registrationResult.message 
        ? { email: [registrationResult.message] } 
        : undefined,
    };
  }

  // For admin creation, isPendingApproval might be less relevant, or admin might choose status.
  // For now, we'll just use the message from registerUser.
  return {
    success: true,
    message: registrationResult.message || "تم إنشاء حساب المستخدم بنجاح.",
    // isPendingApproval: registrationResult.isPendingApproval, // Could be useful to inform admin
  };
}
