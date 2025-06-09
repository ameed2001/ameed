
'use server';

import { z } from 'zod';
import { registerUser, type RegistrationResult } from '@/lib/db';
import { UserRole } from '@prisma/client'; // Corrected import for UserRole

export interface SignupActionResponse {
  success: boolean;
  message: string;
  isPendingApproval?: boolean;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

// This schema is for client-side validation and data shaping before sending to server action
// Prisma UserRole: ADMIN, ENGINEER, OWNER, GENERAL_USER
const signupSchemaClient = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  confirmPassword: z.string().min(6, { message: "تأكيد كلمة المرور مطلوب." }),
  role: z.enum([UserRole.OWNER, UserRole.ENGINEER], { required_error: "يرجى اختيار الدور." }),
  phone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});


export async function signupUserAction(
  data: z.infer<typeof signupSchemaClient>
): Promise<SignupActionResponse> {
  console.log("[SignupAction] Server Action called with:", {
    name: data.name,
    email: data.email,
    role: data.role,
    phone: data.phone
  });

  // The role from the client form is already of type UserRole (OWNER or ENGINEER)
  // due to the z.enum([UserRole.OWNER, UserRole.ENGINEER]) schema definition.
  // So, no explicit mapping is needed here if the client sends the correct enum values.

  const registrationResult: RegistrationResult = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password, // Pass the password
      role: data.role, // Pass the Prisma UserRole enum directly
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
