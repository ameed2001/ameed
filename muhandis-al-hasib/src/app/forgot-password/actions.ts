
'use server';

import { z } from 'zod';
import { logAction, findUserByEmail, createPasswordResetToken } from '@/lib/db';
import nodemailer from 'nodemailer';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordActionResponse {
  success: boolean;
  message: string;
}

const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];

export async function forgotPasswordAction(
  data: ForgotPasswordFormValues
): Promise<ForgotPasswordActionResponse> {
  const validation = forgotPasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      message: "البيانات المدخلة غير صالحة.",
    };
  }

  const { email } = validation.data;
  
  // Log the attempt but don't fail early
  await logAction('PASSWORD_RESET_REQUESTED', 'INFO', `Password reset requested for email: ${email}`);

  const user = await findUserByEmail(email);

  // We proceed as if everything is fine even if user is not found, to prevent email enumeration
  if (user) {
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
        console.error(`[ForgotPasswordAction] Email settings are incomplete. Missing: ${missingVars.join(', ')}`);
        await logAction('PASSWORD_RESET_FAILURE_CONFIG', 'ERROR', `Failed to send password reset. Email settings are incomplete. Missing: ${missingVars.join(', ')}`, user.id);
        // Still return a generic success message to the user
        return { success: true, message: "إذا كان بريدك الإلكتروني مسجلاً، فستتلقى رسالة تحتوي على تعليمات إعادة تعيين كلمة المرور." };
    }
    
    const tokenResult = await createPasswordResetToken(email);

    if (tokenResult.success && tokenResult.token) {
      const resetLink = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${tokenResult.token}`;
      
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT),
          secure: (process.env.EMAIL_PORT === '465'),
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"${process.env.EMAIL_FROM_NAME || 'المحترف لحساب الكميات'}" <${process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'إعادة تعيين كلمة المرور الخاصة بك',
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right;">
              <h2>إعادة تعيين كلمة المرور</h2>
              <p>مرحباً ${user.name},</p>
              <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. انقر على الرابط أدناه لإعادة تعيينها:</p>
              <p><a href="${resetLink}" style="background-color: #B40404; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">إعادة تعيين كلمة المرور</a></p>
              <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.</p>
              <p>هذا الرابط صالح لمدة ساعة واحدة.</p>
            </div>
          `,
        });

        await logAction('PASSWORD_RESET_EMAIL_SENT', 'SUCCESS', `Password reset email sent to: ${email}`, user.id);
      } catch (error: any) {
        console.error('[ForgotPasswordAction] Nodemailer failed to send email:', error);
        await logAction('PASSWORD_RESET_EMAIL_FAILURE', 'ERROR', `Failed to send password reset email to ${email}: ${error.message}`, user.id);
      }
    }
  }

  // Always return a generic success message
  return {
    success: true,
    message: `إذا كان بريدك الإلكتروني مسجلاً، فستتلقى رسالة تحتوي على تعليمات إعادة تعيين كلمة المرور.`,
  };
}
