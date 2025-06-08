// app/contact/actions.ts
"use server";

import { z } from 'zod';
import nodemailer from 'nodemailer';

// نموذج التحقق من صحة البيانات
const contactFormSchema = z.object({
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
  messageType: z.string().min(1, { message: "يرجى اختيار نوع الرسالة." }),
  subject: z.string().min(5, { message: "الموضوع مطلوب (5 أحرف على الأقل)." }),
  message: z.string().min(10, { message: "الرسالة مطلوبة (10 أحرف على الأقل)." }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export interface SendContactMessageResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// أنواع الرسائل
const messageTypes: Record<string, string> = {
  technical_support: "دعم فني",
  feature_request: "اقتراح إضافة",
  modification_request: "اقتراح تعديل",
  technical_issue: "مشكلة فنية",
  general_inquiry: "استفسار عام",
};

export async function sendContactMessageAction(
  formData: ContactFormData
): Promise<SendContactMessageResponse> {
  try {
    // التحقق من صحة البيانات
    const validatedData = contactFormSchema.parse(formData);
    
    // إعداد خدمة البريد الإلكتروني
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const messageTypeLabel = messageTypes[validatedData.messageType] || validatedData.messageType;
    
    // إعداد البريد الإلكتروني الأساسي
    const mailOptions = {
      from: `"${validatedData.name}" <${process.env.EMAIL_USER}>`, // Sender's name in "from"
      to: 'mediaplus64@gmail.com',
      replyTo: validatedData.email, // Set reply-to to sender's email
      subject: `[${messageTypeLabel}] ${validatedData.subject}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #B40404; border-bottom: 2px solid #FFC107; padding-bottom: 10px;">
            رسالة جديدة من نموذج الاتصال
          </h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #B40404; margin-top: 0;">معلومات المرسل:</h3>
            <p><strong>الاسم:</strong> ${validatedData.name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${validatedData.email}</p>
            <p><strong>نوع الرسالة:</strong> <span style="background-color: #FFC107; color: #333; padding: 2px 8px; border-radius: 4px;">${messageTypeLabel}</span></p>
            <p><strong>الموضوع:</strong> ${validatedData.subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="color: #B40404; margin-top: 0;">محتوى الرسالة:</h3>
            <div style="white-space: pre-wrap; font-size: 16px; line-height: 1.8;">
              ${validatedData.message}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e3f2fd; border-radius: 8px; font-size: 14px; color: #666;">
            <p><strong>تاريخ الإرسال:</strong> ${new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>مصدر الرسالة:</strong> نموذج الاتصال في الموقع الإلكتروني</p>
          </div>
        </div>
      `,
      text: `
رسالة جديدة من نموذج الاتصال

معلومات المرسل:
الاسم: ${validatedData.name}
البريد الإلكتروني: ${validatedData.email}
نوع الرسالة: ${messageTypeLabel}
الموضوع: ${validatedData.subject}

محتوى الرسالة:
${validatedData.message}

---
تاريخ الإرسال: ${new Date().toLocaleString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
مصدر الرسالة: نموذج الاتصال في الموقع الإلكتروني
      `,
    };

    // إرسال البريد الإلكتروني الأساسي
    await transporter.sendMail(mailOptions);
    
    // إرسال بريد تأكيد للمرسل
    const confirmationMailOptions = {
      from: `"المحترف لحساب الكميات" <${process.env.EMAIL_USER}>`, // Site name in "from"
      to: validatedData.email,
      subject: 'تأكيد استلام رسالتك - المحترف لحساب الكميات',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #B40404;">شكراً لتواصلك معنا!</h2>
          
          <p>عزيز/عزيزة ${validatedData.name},</p>
          
          <p>تم استلام رسالتك بنجاح وسيقوم فريقنا بمراجعتها والرد عليك في أقرب وقت ممكن.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>ملخص رسالتك:</h3>
            <p><strong>نوع الرسالة:</strong> ${messageTypeLabel}</p>
            <p><strong>الموضوع:</strong> ${validatedData.subject}</p>
          </div>
          
          <p>إذا كان لديك أي استفسارات عاجلة، يمكنك التواصل معنا مباشرة:</p>
          <ul>
            <li>الهاتف/واتساب: +972 594 371 424</li>
            <li>البريد الإلكتروني: mediaplus64@gmail.com</li>
          </ul>
          
          <p style="margin-top: 30px;">مع أطيب التحيات,<br><strong>فريق المحترف لحساب الكميات</strong></p>
        </div>
      `,
      text: `
شكراً لتواصلك معنا!

عزيز/عزيزة ${validatedData.name},

تم استلام رسالتك بنجاح وسيقوم فريقنا بمراجعتها والرد عليك في أقرب وقت ممكن.

ملخص رسالتك:
نوع الرسالة: ${messageTypeLabel}
الموضوع: ${validatedData.subject}

إذا كان لديك أي استفسارات عاجلة:
- الهاتف/واتساب: +972 594 371 424
- البريد الإلكتروني: mediaplus64@gmail.com

مع أطيب التحيات,
فريق المحترف لحساب الكميات
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    return {
      success: true,
      message: "تم إرسال رسالتك بنجاح! لقد أرسلنا لك بريدًا إلكترونيًا للتأكيد.",
    };

  } catch (error) {
    console.error('Error sending contact email:', error);
    
    if (error instanceof z.ZodError) {
      // Return the first Zod error message
      return {
        success: false,
        error: error.errors[0]?.message || "خطأ في البيانات المدخلة.",
      };
    }
    
    // Generic error for other cases (e.g., nodemailer issues)
    return {
      success: false,
      error: "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى أو التواصل معنا عبر وسائل أخرى.",
    };
  }
}

    