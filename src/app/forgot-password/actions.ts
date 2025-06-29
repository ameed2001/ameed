
'use server';

import { z } from 'zod';
import { logAction, createPasswordResetToken } from '@/lib/db';
import nodemailer from 'nodemailer';
import 'dotenv/config';

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
  
  const tokenResult = await createPasswordResetToken(email);

  if (tokenResult.success && tokenResult.token) {
    const resetLink = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${tokenResult.token}`;
    
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT || 587),
            secure: (process.env.EMAIL_PORT === '465'),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        
        await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
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

        await logAction('PASSWORD_RESET_EMAIL_SENT', 'INFO', `Password reset link sent successfully to: ${email}`);
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
        console.error("[ForgotPasswordAction] Nodemailer error:", errorMessage);
        await logAction(
            'PASSWORD_RESET_EMAIL_FAILURE', 
            'ERROR', 
            `Failed to send password reset link to: ${email}. Error: ${errorMessage}`
        );
    }
  } else {
    await logAction('PASSWORD_RESET_REQUEST_NOT_FOUND', 'INFO', `Password reset requested for non-existent or error-prone email: ${email}`);
  }

  return {
    success: true,
    message: `إذا كان بريدك الإلكتروني مسجلاً، فستتلقى رسالة تحتوي على رابط لإعادة تعيين كلمة المرور قريبًا.`,
  };
}
