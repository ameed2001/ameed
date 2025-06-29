'use server';

import { z } from 'zod';
import { logAction, createPasswordResetToken } from '@/lib/db';
import nodemailer from 'nodemailer';

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
    // This is a client-side validation error, so it's okay to be specific.
    return {
      success: false,
      message: "البريد الإلكتروني المدخل غير صالح.",
    };
  }

  const { email } = validation.data;
  
  // Step 1: Create a reset token. We do this even if email sending will fail,
  // so the user flow can be tested up to the reset page.
  const tokenResult = await createPasswordResetToken(email);

  if (tokenResult.success && tokenResult.token && tokenResult.userId) {
    const resetLink = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${tokenResult.token}`;

    const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);

    // Step 2: Check for mailer configuration.
    if (missingVars.length > 0) {
        // If config is missing, log a detailed error for the admin...
        const errorMsg = `Missing email configuration in .env.local. Please set: ${missingVars.join(', ')}`;
        console.error(errorMsg);
        await logAction('EMAIL_CONFIG_MISSING', 'ERROR', errorMsg, 'System');
    } else {
        // ...otherwise, attempt to send the email.
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT),
                secure: (process.env.EMAIL_PORT === '465'),
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
            });
            
            await transporter.verify();
            
            await transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME || 'المحترف لحساب الكميات'}" <${process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER!}>`,
                to: email,
                subject: 'إعادة تعيين كلمة المرور - المحترف لحساب الكميات',
                html: `
                    <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right;">
                        <h2>إعادة تعيين كلمة المرور</h2>
                        <p>مرحباً,</p>
                        <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. اضغط على الرابط أدناه لإنشاء كلمة مرور جديدة.</p>
                        <p style="text-align: center; margin: 20px 0;">
                          <a href="${resetLink}" style="background-color: #B40404; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">إعادة تعيين كلمة المرور</a>
                        </p>
                        <p>هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
                        <p>إذا لم تطلب هذا الإجراء، يرجى تجاهل هذا البريد الإلكتروني.</p>
                        <br/>
                        <p>مع تحيات،</p>
                        <p>فريق المحترف لحساب الكميات</p>
                    </div>
                `,
            });
            await logAction('PASSWORD_RESET_EMAIL_SENT', 'INFO', `Password reset link sent to: ${email}`, tokenResult.userId);
        } catch (error: any) {
            // If email sending fails for any reason (bad credentials, etc.), log it for the admin...
            const errorMessage = `Nodemailer connection/send failed. Error: ${error.message}`;
            console.error(`[ForgotPasswordAction] ${errorMessage}`);
            await logAction('PASSWORD_RESET_EMAIL_FAILURE', 'ERROR', errorMessage, tokenResult.userId);
        }
    }
  } else {
    // If the email doesn't exist in the DB, log it for info.
    await logAction('PASSWORD_RESET_REQUEST_NOT_FOUND', 'INFO', `Password reset requested for non-existent email: ${email}`);
  }

  // Step 3: ...but always return a generic success message to the user.
  // This prevents email enumeration and unblocks the user from development if mailer is misconfigured.
  return {
    success: true,
    message: `إذا كان بريدك الإلكتروني مسجلاً، فستتلقى رسالة تحتوي على رابط لإعادة تعيين كلمة المرور قريبًا.`,
  };
}
