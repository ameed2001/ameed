'use server';

import { z } from 'zod';
import { logAction, findUserByEmail } from '@/lib/db';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordActionResponse {
  success: boolean;
  message: string;
}

export async function forgotPasswordAction(
  data: ForgotPasswordFormValues
): Promise<ForgotPasswordActionResponse> {
  const validation = forgotPasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      message: "البريد الإلكتروني المدخل غير صالح.",
    };
  }

  const { email } = validation.data;

  // In a real application, you would generate a reset token and send an email.
  // For this simulation, we will just log the action and always return a success message
  // to prevent email enumeration.

  const user = await findUserByEmail(email);

  if (user) {
    // User found.
    console.log(`[ForgotPasswordAction] Password reset requested for existing user: ${email}`);
    await logAction('PASSWORD_RESET_REQUEST_SUCCESS', 'INFO', `Password reset requested for user: ${email}`, user.id);
  } else {
    // User not found.
    console.log(`[ForgotPasswordAction] Password reset requested for non-existent email: ${email}`);
    await logAction('PASSWORD_RESET_REQUEST_NOT_FOUND', 'INFO', `Password reset requested for non-existent email: ${email}`);
  }

  // Always return a generic success message to the client.
  return {
    success: true,
    message: `إذا كان البريد الإلكتروني ${email} مسجلاً، ستصلك رسالة لإعادة تعيين كلمة المرور قريبًا.`,
  };
}
