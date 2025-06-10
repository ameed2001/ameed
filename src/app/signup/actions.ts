// src/app/signup/actions.ts
'use server';

import { z } from 'zod';
import { registerUser, type RegistrationResult, type UserRole } from '@/lib/db'; // UserRole is now from our own db.ts

export interface SignupActionResponse {
  success: boolean;
  message: string;
  isPendingApproval?: boolean;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

// Schema for data coming FROM THE CLIENT (lowercase roles)
const clientSignupFormSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  confirmPassword: z.string().min(6, { message: "تأكيد كلمة المرور مطلوب." }),
  role: z.enum(["owner", "engineer"], { required_error: "يرجى اختيار الدور." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});

type ClientSignupFormDataType = z.infer<typeof clientSignupFormSchema>;


export async function signupUserAction(
  formData: ClientSignupFormDataType 
): Promise<SignupActionResponse> {
  console.log("[SignupAction JSON_DB] Server Action called with (raw formData):", {
    name: formData.name,
    email: formData.email,
    role: formData.role, // This should be 'owner' or 'engineer'
  });

  // Validate the data received from the client against the client-side schema structure
  const validationResult = clientSignupFormSchema.safeParse(formData);

  if (!validationResult.success) {
    console.error("[SignupAction JSON_DB] Client data validation failed:", validationResult.error.flatten().fieldErrors);
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(validationResult.error.flatten().fieldErrors)) {
        if (value) fieldErrors[key] = value;
    }
    return {
      success: false,
      message: "البيانات المدخلة غير صالحة. يرجى التحقق من الحقول.",
      fieldErrors: fieldErrors,
    };
  }
  
  // At this point, validationResult.data contains the validated form data
  const data = validationResult.data;


  // Convert role to uppercase for UserRole type compatibility in db.ts
  const roleForDb = data.role.toUpperCase() as UserRole;
  if (roleForDb !== 'OWNER' && roleForDb !== 'ENGINEER' && roleForDb !== 'ADMIN' && roleForDb !== 'GENERAL_USER') {
    console.error(`[SignupAction JSON_DB] Invalid role after uppercase conversion: ${roleForDb}`);
    return {
        success: false,
        message: "الدور المحدد غير صالح.",
        fieldErrors: { role: ["الدور المحدد غير صالح."] }
    };
  }

  // The registerUser function now expects password_input
  const registrationResult: RegistrationResult = await registerUser({
      name: data.name,
      email: data.email,
      password_input: data.password, 
      role: roleForDb,
  });

  if (!registrationResult.success) {
    const fieldErrors: Record<string, string[]> = {};
    if (registrationResult.errorType === 'email_exists' && registrationResult.message) {
        fieldErrors.email = [registrationResult.message];
    }
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
    redirectTo: registrationResult.isPendingApproval ? undefined : "/login"
  };
}
