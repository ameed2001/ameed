
'use server';

import { z } from 'zod';
import { registerUser, type RegistrationResult, type UserRole } from '@/lib/db';

export interface SignupActionResponse {
  success: boolean;
  message: string;
  isPendingApproval?: boolean;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

// This schema defines the shape of data COMING FROM THE CLIENT FORM
// after client-side Zod validation. It matches the `signupSchema`
// in `src/app/signup/page.tsx`.
const clientSignupFormSchema = z.object({
  name: z.string(), // Assuming min length validation is done on client
  email: z.string().email(), // Assuming email format validation is done on client
  password: z.string(), // Assuming min length validation is done on client
  confirmPassword: z.string(), // Server-side check for equality will be done
  role: z.enum(["owner", "engineer"]), // Expecting lowercase from client RadioGroup
  // phone: z.string().optional(), // phone is not currently in the client form
});
type ClientSignupFormDataType = z.infer<typeof clientSignupFormSchema>;

export async function signupUserAction(
  data: ClientSignupFormDataType // Use the type that reflects actual client data
): Promise<SignupActionResponse> {
  console.log("[SignupAction MongoDB] Server Action called with:", {
    name: data.name,
    email: data.email,
    role: data.role, // This will be 'owner' or 'engineer' (lowercase)
    // phone: data.phone // if phone was part of ClientSignupFormDataType
  });
  
  // Server-side validation for critical aspects like password confirmation
  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      message: "كلمتا المرور غير متطابقتين.",
      fieldErrors: { confirmPassword: ["كلمتا المرور غير متطابقتين."] }
    };
  }

  // Defensive check for role, though client-side Zod should make it required.
  // The error "Expected 'owner' | 'engineer', received null" suggests this might be an issue.
  if (!data.role) {
      return {
          success: false,
          message: "يرجى اختيار الدور. القيمة المستلمة للدور غير صالحة أو مفقودة.",
          fieldErrors: { role: ["يرجى اختيار الدور."] }
      };
  }

  // Convert role to uppercase for UserRole type compatibility in db.ts
  const roleForDb = data.role.toUpperCase() as UserRole;

  const registrationResult: RegistrationResult = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password, // This now correctly matches the field name used in registerUser
      role: roleForDb,
      // phone: data.phone, // Pass if/when phone is added to the form and schema
  });

  if (!registrationResult.success) {
    const fieldErrors: Record<string, string[]> = {};
    if (registrationResult.errorType === 'email_exists' && registrationResult.message) {
        fieldErrors.email = [registrationResult.message];
    }
    // Add more specific field error handling if needed from registrationResult.errorType
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
