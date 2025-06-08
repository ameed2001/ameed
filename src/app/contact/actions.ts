
'use server';

import { z } from 'zod';

// Schema for validating form data on the server
const contactFormSchemaServer = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  subject: z.string().min(5, { message: "الموضوع مطلوب (5 أحرف على الأقل)." }),
  message: z.string().min(10, { message: "الرسالة مطلوبة (10 أحرف على الأقل)." }),
});

export interface SendContactMessageResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function sendContactMessageAction(
  formData: z.infer<typeof contactFormSchemaServer>
): Promise<SendContactMessageResponse> {
  const validatedFields = contactFormSchemaServer.safeParse(formData);

  if (!validatedFields.success) {
    console.error("Server Action: Invalid form data", validatedFields.error.flatten().fieldErrors);
    return { 
      success: false, 
      error: "البيانات المدخلة غير صالحة. يرجى مراجعة الحقول." 
    };
  }

  const { name, email, subject, message } = validatedFields.data;
  const recipientEmail = "mediaplus64@gmail.com";

  console.log("========== Server Action: sendContactMessageAction ==========");
  console.log(`New contact message received to be sent to: ${recipientEmail}`);
  console.log("From:", name, `<${email}>`);
  console.log("Subject:", subject);
  console.log("Message:", message);
  console.log("==========================================================");

  // **ملاحظة للمطور:**
  // هذا هو المكان الذي يمكنك فيه دمج خدمة إرسال بريد إلكتروني.
  // على سبيل المثال، باستخدام Nodemailer مع مزود SMTP أو خدمة مثل Resend، SendGrid، AWS SES، إلخ.
  // تأكد من التعامل مع بيانات الاعتماد بشكل آمن، ويفضل أن يكون ذلك من خلال متغيرات البيئة.
  //
  // مثال توضيحي (يتطلب إعداد ومكتبات إضافية):
  //
  // import nodemailer from 'nodemailer';
  //
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: parseInt(process.env.SMTP_PORT || '587'),
  //   secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // });
  //
  // try {
  //   await transporter.sendMail({
  //     from: `"${name}" <${email}>`, //  أو استخدم عنوان "no-reply" من نطاقك
  //     to: recipientEmail,
  //     subject: `رسالة من نموذج التواصل: ${subject}`,
  //     html: `
  //       <h3>رسالة جديدة من نموذج التواصل على الموقع</h3>
  //       <p><strong>الاسم:</strong> ${name}</p>
  //       <p><strong>البريد الإلكتروني:</strong> ${email}</p>
  //       <p><strong>الموضوع:</strong> ${subject}</p>
  //       <p><strong>الرسالة:</strong></p>
  //       <p>${message.replace(/\n/g, '<br>')}</p>
  //     `,
  //   });
  //   return { success: true, message: "تم إرسال رسالتك بنجاح!" };
  // } catch (error) {
  //   console.error("Server Action: Failed to send email:", error);
  //   return { success: false, error: "حدث خطأ أثناء محاولة إرسال الرسالة." };
  // }

  // حاليًا، نقوم بمحاكاة النجاح لأن إرسال البريد الفعلي لم يتم تنفيذه.
  return { success: true, message: "تم استلام رسالتك بنجاح (محاكاة الإرسال)." };
}
