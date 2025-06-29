
'use server';

import { z } from 'zod';
import { resetPasswordWithToken } from '@/lib/db';

export const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل." }),
  confirmPassword: z.string(),
  token: z.string().min(1, { message: "الرمز غير موجود." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين.",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordActionResponse {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export async function resetPasswordAction(
  data: ResetPasswordFormValues,
): Promise<ResetPasswordActionResponse> {
  const validation = resetPasswordSchema.safeParse(data);

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      message: "البيانات المدخلة غير صالحة.",
      fieldErrors: {
          password: fieldErrors.password,
          confirmPassword: fieldErrors.confirmPassword,
      }
    };
  }

  const { token, password } = validation.data;
  
  const result = await resetPasswordWithToken(token, password);

  return result;
}
