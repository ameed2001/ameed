
// app/contact/actions.ts
"use server";

import { z } from 'zod';
import nodemailer from 'nodemailer';

// 1. تعريف نموذج التحقق من الصحة مع رسائل خطأ مخصصة
const contactFormSchema = z.object({
  name: z.string()
    .min(3, { message: "يجب أن يحتوي الاسم على 3 أحرف على الأقل" })
    .max(50, { message: "يجب ألا يتجاوز الاسم 50 حرفًا" }),
  email: z.string()
    .email({ message: "البريد الإلكتروني غير صالح" })
    .max(100, { message: "يجب ألا يتجاوز البريد الإلكتروني 100 حرف" }),
  messageType: z.string()
    .min(1, { message: "يرجى اختيار نوع الرسالة" }),
  subject: z.string()
    .min(5, { message: "يجب أن يحتوي الموضوع على 5 أحرف على الأقل" })
    .max(100, { message: "يجب ألا يتجاوز الموضوع 100 حرف" }),
  message: z.string()
    .min(10, { message: "يجب أن تحتوي الرسالة على 10 أحرف على الأقل" })
    .max(1000, { message: "يجب ألا تتجاوز الرسالة 1000 حرف" }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export interface SendContactMessageResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  error?: string;
}

// 2. أنواع الرسائل مع تعريف كامل
const MESSAGE_TYPES = {
  technical_support: {
    label: "دعم فني",
    email: "support@mediaplus.com", // Replace with actual target emails
    color: "#2196F3"
  },
  feature_request: {
    label: "اقتراح إضافة",
    email: "product@mediaplus.com",
    color: "#4CAF50"
  },
  modification_request: {
    label: "اقتراح تعديل",
    email: "product@mediaplus.com",
    color: "#FFC107"
  },
  technical_issue: {
    label: "مشكلة فنية",
    email: "tech@mediaplus.com",
    color: "#F44336"
  },
  general_inquiry: {
    label: "استفسار عام",
    email: "info@mediaplus.com",
    color: "#9C27B0"
  }
} as const;

// 3. إنشاء موصل البريد الإلكتروني (بدون تخزين مؤقت حاليًا للتشخيص)
function getTransporter(): nodemailer.Transporter | null {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("EMAIL_USER or EMAIL_PASSWORD is not set in environment variables.");
    return null; // Return null instead of throwing, to be handled by caller
  }

  try {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      host: process.env.EMAIL_HOST, // smtp.gmail.com for gmail if EMAIL_SERVICE is gmail
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // false for port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Ensure this is an app password for Gmail
      },
      tls: {
        // do not fail on invalid certs if not in production
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
  } catch (error) {
    console.error("Failed to create Nodemailer transporter:", error);
    return null;
  }
}

// 4. دالة الإرسال الرئيسية
export async function sendContactMessageAction(
  formData: ContactFormData
): Promise<SendContactMessageResponse> {
  const transporter = getTransporter();

  if (!transporter) {
    return {
      success: false,
      error: "خطأ في إعدادات خادم البريد: بيانات اعتماد البريد (EMAIL_USER, EMAIL_PASSWORD) غير معرفة أو فشل إنشاء الناقل. يرجى مراجعة المسؤول.",
    };
  }

  try {
    // التحقق من الصحة
    const validatedData = contactFormSchema.safeParse(formData);
    
    if (!validatedData.success) {
      const errors = validatedData.error.flatten().fieldErrors;
      return {
        success: false,
        errors: Object.fromEntries(
          Object.entries(errors).map(([key, value]) => [key, value?.join(', ') || ''])
        ),
      };
    }

    const { name, email, messageType, subject, message } = validatedData.data;
    
    // الحصول على تفاصيل نوع الرسالة
    const messageTypeInfo = MESSAGE_TYPES[messageType as keyof typeof MESSAGE_TYPES] || {
      label: messageType, // Fallback label
      email: process.env.EMAIL_USER!, // Fallback to sending to EMAIL_USER if type is unknown
      color: '#607D8B' // Fallback color
    };
    
    // Ensure EMAIL_FROM is defined, otherwise fallback to EMAIL_USER for the 'from' address part
    const fromAddress = process.env.EMAIL_FROM || `"${name}" <${process.env.EMAIL_USER!}>`;


    const currentDate = new Date().toLocaleString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // 5. إعداد البريد الأساسي
    const mailOptions = {
      from: fromAddress, // Use the prepared fromAddress
      to: messageTypeInfo.email, 
      replyTo: email,
      subject: `[${messageTypeInfo.label}] ${subject}`,
      html: renderMainEmailTemplate({
        name,
        email,
        messageType: messageTypeInfo.label,
        subject,
        message,
        date: currentDate,
        color: messageTypeInfo.color
      }),
      text: renderTextEmailTemplate({
        name,
        email,
        messageType: messageTypeInfo.label,
        subject,
        message,
        date: currentDate
      }),
    };

    // 6. إرسال البريد
    await transporter.sendMail(mailOptions);

    // 7. إرسال بريد التأكيد
    const confirmationMailOptions = {
      from: fromAddress, // Use the same fromAddress
      to: email,
      subject: 'تم استلام رسالتك بنجاح',
      html: renderConfirmationTemplate({
        name,
        messageType: messageTypeInfo.label,
        subject,
        date: currentDate
      }),
      text: renderTextConfirmationTemplate({
        name,
        messageType: messageTypeInfo.label,
        subject,
        date: currentDate
      }),
    };

    await transporter.sendMail(confirmationMailOptions);

    return {
      success: true,
      message: "تم إرسال رسالتك بنجاح! سوف نتواصل معك قريبًا.",
    };

  } catch (error) {
    console.error('فشل إرسال الرسالة:', error);
    
    if (error instanceof z.ZodError) { // Should not happen if safeParse is used above, but as a safeguard.
      return {
        success: false,
        error: "خطأ في البيانات المدخلة: " + error.errors.map(e => e.message).join(', '),
      };
    }
    
    // Improved error handling for nodemailer
    if (error instanceof Error) {
      const nodemailerError = error as any; 
      if (nodemailerError.code === 'EAUTH') {
        return { success: false, error: "خطأ في مصادقة البريد الإلكتروني. يرجى التحقق من بيانات اعتماد البريد (EMAIL_USER, EMAIL_PASSWORD)." };
      }
      if (nodemailerError.code === 'ECONNECTION' || nodemailerError.code === 'ETIMEDOUT') {
        return { success: false, error: "فشل الاتصال بخادم البريد. يرجى التحقق من اتصال الشبكة وإعدادات الخادم (EMAIL_HOST, EMAIL_PORT)." };
      }
       if (nodemailerError.responseCode === 550) {
        return { success: false, error: "رفض خادم البريد الرسالة (خطأ 550). قد يكون البريد الإلكتروني للمستلم غير صحيح أو محظور."};
       }
    }
    
    return {
      success: false,
      error: "حدث خطأ غير متوقع أثناء محاولة إرسال رسالتك. يرجى المحاولة مرة أخرى لاحقًا أو التواصل معنا عبر الهاتف.",
    };
  }
}

// 8. دوال عرض القوالب (كما هي بدون تغيير)
function renderMainEmailTemplate(data: {
  name: string;
  email: string;
  messageType: string;
  subject: string;
  message: string;
  date: string;
  color: string;
}) {
  return `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${data.color}; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">رسالة جديدة من ${data.name}</h1>
        <p style="margin: 5px 0 0; font-size: 16px;">${data.messageType}</p>
      </div>
      
      <div style="padding: 20px;">
        <div style="margin-bottom: 20px;">
          <h3 style="color: ${data.color}; margin-bottom: 10px;">معلومات المرسل:</h3>
          <p><strong>الاسم:</strong> ${data.name}</p>
          <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>الموضوع:</strong> ${data.subject}</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid ${data.color};">
          <h3 style="color: ${data.color}; margin-top: 0;">محتوى الرسالة:</h3>
          <div style="white-space: pre-wrap; line-height: 1.6;">${data.message}</div>
        </div>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 14px; color: #666;">
        <p>تم الإرسال في: ${data.date}</p>
        <p>هذه رسالة آلية - لا ترد مباشرة على هذا البريد</p>
      </div>
    </div>
  `;
}

function renderTextEmailTemplate(data: {
  name: string;
  email: string;
  messageType: string;
  subject: string;
  message: string;
  date: string;
}) {
  return `
رسالة جديدة من نموذج الاتصال
-------------------------
الاسم: ${data.name}
البريد الإلكتروني: ${data.email}
نوع الرسالة: ${data.messageType}
الموضوع: ${data.subject}

الرسالة:
${data.message}

-------------------------
تاريخ الإرسال: ${data.date}
  `;
}

function renderConfirmationTemplate(data: {
  name: string;
  messageType: string;
  subject: string;
  date: string;
}) {
  return `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">تم استلام رسالتك بنجاح</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>عزيزي/عزيزتي ${data.name},</p>
        
        <p>نشكرك على تواصلك معنا. لقد تلقينا رسالتك وسيتم الرد عليها في أقرب وقت ممكن.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #4CAF50; margin-top: 0;">تفاصيل الرسالة:</h3>
          <p><strong>نوع الرسالة:</strong> ${data.messageType}</p>
          <p><strong>الموضوع:</strong> ${data.subject}</p>
          <p><strong>تاريخ الإرسال:</strong> ${data.date}</p>
        </div>
        
        <p>إذا كان لديك أي استفسار عاجل، لا تتردد في التواصل معنا عبر:</p>
        <ul style="padding-right: 20px;">
          <li>البريد الإلكتروني: <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></li>
          <li>الهاتف: +972 59 437 1424</li>
        </ul>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 14px; color: #666;">
        <p>مع أطيب التحيات،</p>
        <p style="font-weight: bold; color: #333;">فريق MediaPlus</p>
      </div>
    </div>
  `;
}

function renderTextConfirmationTemplate(data: {
  name: string;
  messageType: string;
  subject: string;
  date: string;
}) {
  return `
تم استلام رسالتك بنجاح
-------------------------
عزيزي/عزيزتي ${data.name},

نشكرك على تواصلك معنا. لقد تلقينا رسالتك وسيتم الرد عليها في أقرب وقت ممكن.

تفاصيل الرسالة:
- نوع الرسالة: ${data.messageType}
- الموضوع: ${data.subject}
- تاريخ الإرسال: ${data.date}

للتواصل العاجل:
البريد الإلكتروني: ${process.env.EMAIL_USER}
الهاتف: +972 59 437 1424

مع أطيب التحيات,
فريق MediaPlus
  `;
}

    