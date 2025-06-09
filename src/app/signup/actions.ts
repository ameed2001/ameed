
'use server';

import { z } from 'zod';
import { registerUser, type RegistrationResult } from '@/lib/db'; 
import { UserRole as PrismaUserRole } from '@prisma/client'; 

export interface SignupActionResponse {
  success: boolean;
  message: string;
  isPendingApproval?: boolean;
  redirectTo?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

const signupSchemaServer = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  confirmPassword: z.string().min(6, { message: "تأكيد كلمة المرور مطلوب." }),
  role: z.enum(["owner", "engineer"], { required_error: "يرجى اختيار الدور." }),
  phone: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});


export async function signupUserAction(
  data: z.infer<typeof signupSchemaServer>
): Promise<SignupActionResponse> {
  console.log("[SignupAction] Server Action: signupUserAction called with:", { name: data.name, email: data.email, role: data.role });

  const validation = signupSchemaServer.safeParse(data);
  if (!validation.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of validation.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(issue.message);
    }
    return {
      success: false,
      message: "البيانات المدخلة غير صالحة. يرجى مراجعة الحقول.",
      fieldErrors,
    };
  }
  
  const roleForDb: PrismaUserRole = data.role === 'engineer' ? PrismaUserRole.ENGINEER : PrismaUserRole.OWNER;

  const registrationResult: RegistrationResult = await registerUser({
      name: data.name,
      email: data.email, 
      password: data.password,
      role: roleForDb,
      phone: data.phone,
  });


  if (!registrationResult.success || !registrationResult.user) {
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

  const newUser = registrationResult.user;

  if (newUser.role === PrismaUserRole.ENGINEER && registrationResult.isPendingApproval) {
    console.log(`[SignupAction] Engineer account ${newUser.email} created, pending approval.`);
    return {
      success: true,
      message: "تم إنشاء حسابك كمهندس بنجاح. حسابك حاليًا قيد المراجعة والموافقة من قبل الإدارة. سيتم إعلامك عند التفعيل.",
      isPendingApproval: true
    };
  }

  console.log(`[SignupAction] ${newUser.role} account ${newUser.email} created and activated.`);
  // For owners, or engineers if approval is not required by system settings
  return {
    success: true,
    message: "تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.",
    redirectTo: "/login" // Redirect to login after successful registration
  };
}
