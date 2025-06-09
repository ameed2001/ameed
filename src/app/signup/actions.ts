
'use server';

import { z } from 'zod';
import { registerUser, type RegistrationResult } from '@/lib/db'; 
// UserRole is now PrismaUserRole from @prisma/client, but registerUser in db.ts takes string
// import { UserRole as PrismaUserRole } from '@prisma/client'; 

export interface SignupActionResponse {
  success: boolean;
  message: string;
  isPendingApproval?: boolean;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

// This schema is for client-side validation and data shaping before sending to server action
const signupSchemaClient = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  confirmPassword: z.string().min(6, { message: "تأكيد كلمة المرور مطلوب." }),
  role: z.enum(["OWNER", "ENGINEER"], { required_error: "يرجى اختيار الدور." }), // Adjusted to match common string values
  phone: z.string().optional(), // Assuming phone is optional
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});


export async function signupUserAction(
  data: z.infer<typeof signupSchemaClient> // Use the client schema for input type
): Promise<SignupActionResponse> {
  // Server-side validation should ideally re-validate or trust client validation if simple
  // For this example, we'll pass data through. A more robust app might re-validate.
  console.log("[SignupAction] Server Action: signupUserAction called with:", { 
    name: data.name, 
    email: data.email, 
    role: data.role,
    phone: data.phone 
  });

  // The `registerUser` function in `src/lib/db.ts` now expects `password_input`
  // and role as 'ENGINEER' or 'OWNER' etc.
  const registrationResult: RegistrationResult = await registerUser({
      name: data.name,
      email: data.email, 
      password_input: data.password, // Pass the password directly
      role: data.role, // Pass role as 'OWNER' or 'ENGINEER'
      phone: data.phone,
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

  // Success case
  return {
    success: true,
    message: registrationResult.message || "تم إنشاء حسابك بنجاح!", // Use message from registrationResult
    isPendingApproval: registrationResult.isPendingApproval,
    redirectTo: registrationResult.isPendingApproval ? undefined : "/login" // Redirect to login if not pending
  };
}

