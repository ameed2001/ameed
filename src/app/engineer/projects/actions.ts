
'use server';

import { z } from 'zod';
import { updateProject as dbUpdateProject, type Project, type ProjectStatusType } from '@/lib/db';

export const updateProjectSchema = z.object({
  projectId: z.string(),
  name: z.string().min(3, { message: "اسم المشروع مطلوب (3 أحرف على الأقل)." }),
  location: z.string().min(3, { message: "موقع المشروع مطلوب." }),
  description: z.string().min(10, { message: "وصف المشروع مطلوب (10 أحرف على الأقل)." }),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "تاريخ البدء غير صالح." }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: "تاريخ الانتهاء غير صالح." }),
  status: z.enum(['مخطط له', 'قيد التنفيذ', 'مكتمل', 'مؤرشف']),
  clientName: z.string().min(3, { message: "اسم العميل/المالك مطلوب." }),
  budget: z.number().positive({ message: "الميزانية يجب أن تكون رقمًا موجبًا." }).optional(),
  linkedOwnerEmail: z.string().email({ message: "بريد المالك الإلكتروني غير صالح."}).optional(),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  message: "تاريخ الانتهاء يجب أن يكون بعد أو نفس تاريخ البدء.",
  path: ["endDate"],
});

export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;

export async function updateProjectAction(data: UpdateProjectFormValues): Promise<{ success: boolean; message?: string; project?: Project, fieldErrors?: any }> {
  const validation = updateProjectSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "بيانات غير صالحة.", fieldErrors: validation.error.flatten().fieldErrors };
  }
  
  const { projectId, ...projectUpdates } = validation.data;

  const result = await dbUpdateProject(projectId, projectUpdates);

  if (result.success) {
    return { success: true, message: "تم تحديث المشروع بنجاح.", project: result.project };
  } else {
    return { success: false, message: result.message || "فشل تحديث المشروع." };
  }
}
