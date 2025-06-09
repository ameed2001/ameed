
'use server';

import { z } from 'zod';
// Import UserRole from @prisma/client is no longer valid.
// UserRole type is now defined in src/lib/db.ts
import { registerUser, type RegistrationResult, type UserRole } from '@/lib/db';

export interface SignupActionResponse {
  success: boolean;
  message: string;
  isPendingApproval?: boolean;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

// This schema defines the shape of data COMING FROM THE CLIENT FORM
const clientSignupFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
  role: z.enum(["owner", "engineer"]), // Expecting lowercase from client RadioGroup
});
type ClientSignupFormDataType = z.infer<typeof clientSignupFormSchema>;

export async function signupUserAction(
  data: ClientSignupFormDataType
): Promise<SignupActionResponse> {
  console.log("[SignupAction] Server Action called with:", {
    name: data.name,
    email: data.email,
    role: data.role, // This will be 'owner' or 'engineer' (lowercase)
  });
  
  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      message: "كلمتا المرور غير متطابقتين.",
      fieldErrors: { confirmPassword: ["كلمتا المرور غير متطابقتين."] }
    };
  }

  if (!data.role) {
      return {
          success: false,
          message: "يرجى اختيار الدور. القيمة المستلمة للدور غير صالحة أو مفقودة.",
          fieldErrors: { role: ["يرجى اختيار الدور."] }
      };
  }

  // Convert role to uppercase for UserRole type compatibility in db.ts
  // UserRole type expects 'OWNER' or 'ENGINEER' (uppercase)
  const roleForDb = data.role.toUpperCase() as UserRole;
  if (roleForDb !== 'OWNER' && roleForDb !== 'ENGINEER' && roleForDb !== 'ADMIN' && roleForDb !== 'GENERAL_USER') {
    // This check is defensive, as clientSignupFormSchema already limits it
    console.error(`[SignupAction] Invalid role after uppercase conversion: ${roleForDb}`);
    return {
        success: false,
        message: "الدور المحدد غير صالح.",
        fieldErrors: { role: ["الدور المحدد غير صالح."] }
    };
  }

  const registrationResult: RegistrationResult = await registerUser({
      name: data.name,
      email: data.email,
      password_input: data.password, // Pass the raw password
      role: roleForDb,
      // phone: data.phone, // Pass if/when phone is added
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
