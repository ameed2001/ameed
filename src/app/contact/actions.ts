"use server";

import { z } from 'zod';

// نموذج التحقق من صحة البيانات (يُترك للاستخدام المستقبلي إذا لزم الأمر)
const contactFormSchema = z.object({
  name: z.string().min(3, { message: "يجب أن يحتوي الاسم على 3 أحرف على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  messageType: z.string().min(1, { message: "يرجى اختيار نوع الرسالة" }),
  subject: z.string().min(5, { message: "يجب أن يحتوي الموضوع على 5 أحرف على الأقل" }),
  message: z.string().min(10, { message: "يجب أن تحتوي الرسالة على 10 أحرف على الأقل" }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export interface SendContactMessageResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  error?: string;
}

// دالة محاكاة فارغة
export async function sendContactMessageAction(
  formData: ContactFormData
): Promise<SendContactMessageResponse> {
  console.log("Contact form submitted (simulation):", formData);
  // Simulate a successful response for UI testing
  return {
    success: true,
    message: "تم استلام رسالتك (محاكاة).",
  };
}
