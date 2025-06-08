
'use server';

// Removed Zod import and schema for extreme simplification during debugging.
// We will rely on client-side Zod validation for now.
// import { z } from 'zod';

// const contactFormSchemaServer = z.object({
//   name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
//   email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
//   subject: z.string().min(5, { message: "الموضوع مطلوب (5 أحرف على الأقل)." }),
//   message: z.string().min(10, { message: "الرسالة مطلوبة (10 أحرف على الأقل)." }),
// });

export interface SendContactMessageResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// formData type will be inferred as 'any' or a generic object on the server side now.
// This is for debugging. In a real scenario, you'd want strong typing.
export async function sendContactMessageAction(
  formData: any // Changed from z.infer<typeof contactFormSchemaServer> for debugging
): Promise<SendContactMessageResponse> {
  console.log("========== Server Action: sendContactMessageAction (SUPER SIMPLIFIED - NO DELAY) ==========");
  console.log("Raw formData received:", formData);

  // No Zod validation on server for this test
  // No actual email sending logic

  // Simulate a short delay - REMOVED
  // await new Promise(resolve => setTimeout(resolve, 200));

  // In a real application, you would add your email sending logic here.
  // For example, using nodemailer or a third-party email service (SendGrid, Mailgun, etc.)
  //
  // try {
  //   // 1. Configure your email transport (e.g., nodemailer with SMTP or an API key for a service)
  //   // 2. Construct the email message:
  //   //    To: mediaplus64@gmail.com
  //   //    From: formData.email (or a no-reply address from your domain)
  //   //    Subject: formData.subject
  //   //    Body: formData.message (along with formData.name and formData.email)
  //   // 3. Send the email
  //   //
  //   // If successful:
  //   // return { success: true, message: "تم إرسال رسالتك بنجاح!" };
  //   // If error:
  //   // console.error("Email sending error:", error);
  //   // return { success: false, error: "حدث خطأ أثناء إرسال البريد الإلكتروني." };
  // } catch (e) {
  //   console.error("Exception during email sending attempt:", e);
  //   return { success: false, error: "حدث خطأ استثنائي أثناء محاولة إرسال البريد." };
  // }


  // Always return success for this test
  return { success: true, message: "تم استلام رسالتك (اختبار خادم مبسط جداً - بدون تأخير)." };
}
