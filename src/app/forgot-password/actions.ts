
'use server';

import { z } from 'zod';
import { logAction, findUserByEmail, resetPasswordForUser } from '@/lib/db';
import nodemailer from 'nodemailer';
import 'dotenv/config'; // To load .env variables

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordActionResponse {
  success: boolean;
  message: string;
}

// Helper to generate a random temporary password
function generateTempPassword(length = 10) {  
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
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
  
  const user = await findUserByEmail(email);

  if (user) {
    console.log(`[ForgotPasswordAction] Password reset requested for existing user: ${email}`);
    
    // 1. Generate a new temporary password
    const tempPassword = generateTempPassword();

    // 2. Update the user's password in the database
    const resetResult = await resetPasswordForUser(email, tempPassword);

    if (!resetResult.success) {
      await logAction('PASSWORD_RESET_FAILURE_DB', 'ERROR', `Failed to update password in DB for user: ${email}`, user.id);
      // Return a generic success message to prevent disclosing DB issues
      return {
        success: true,
        message: `إذا كان بريدك الإلكتروني مسجلاً، فستتلقى رسالة لإعادة تعيين كلمة المرور قريبًا.`,
      };
    }
    
    // 3. Send the email with the temporary password
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT || 587),
            secure: (process.env.EMAIL_PORT === '465'), // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        
        await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: user.email,
            subject: 'إعادة تعيين كلمة المرور - المحترف لحساب الكميات',
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; text-align: right;">
                    <h2>إعادة تعيين كلمة المرور</h2>
                    <p>مرحباً ${user.name},</p>
                    <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. تم إنشاء كلمة مرور مؤقتة جديدة لك.</p>
                    <p><strong>كلمة المرور المؤقتة:</strong> <span style="font-weight: bold; font-size: 1.2em; color: #B40404;">${tempPassword}</span></p>
                    <p>نوصي بشدة بتسجيل الدخول وتغيير كلمة المرور هذه من صفحة ملفك الشخصي في أقرب وقت ممكن.</p>
                    <p>إذا لم تطلب هذا الإجراء، يرجى تجاهل هذا البريد الإلكتروني.</p>
                    <br/>
                    <p>مع تحيات،</p>
                    <p>فريق المحترف لحساب الكميات</p>
                </div>
            `,
        });

        await logAction('PASSWORD_RESET_EMAIL_SENT', 'INFO', `Password reset email sent successfully to: ${email}`, user.id);
    } catch (error) {
        console.error("[ForgotPasswordAction] Failed to send email:", error);
        await logAction('PASSWORD_RESET_EMAIL_FAILURE', 'ERROR', `Failed to send password reset email to: ${email}`, user.id);
        // Even if email fails, we return a generic success message
    }

  } else {
    // User not found.
    console.log(`[ForgotPasswordAction] Password reset requested for non-existent email: ${email}`);
    await logAction('PASSWORD_RESET_REQUEST_NOT_FOUND', 'INFO', `Password reset requested for non-existent email: ${email}`);
  }

  // Always return a generic success message to the client to prevent email enumeration.
  return {
    success: true,
    message: `إذا كان بريدك الإلكتروني مسجلاً، فستتلقى رسالة لإعادة تعيين كلمة المرور قريبًا.`,
  };
}
