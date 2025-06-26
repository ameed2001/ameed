
'use server';

import { z } from 'zod';
import { updateUser as dbUpdateUser, changeUserPassword as dbChangeUserPassword } from '@/lib/db';
import type { AdminUserUpdateResult, ChangePasswordResult } from '@/lib/db';

const profileUpdateSchema = z.object({
  userId: z.string().min(1, { message: "معرف المستخدم مطلوب." }),
  name: z.string().min(3, { message: "الاسم مطلوب (3 أحرف على الأقل)." }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح." }),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

export async function updateProfileAction(
  data: ProfileUpdateFormValues
): Promise<AdminUserUpdateResult> {
  console.log(`[UpdateProfileAction] User ${data.userId} attempting to update profile.`);
  
  const updates = {
    name: data.name,
    email: data.email,
  };
  
  const result = await dbUpdateUser(data.userId, updates);

  return result;
}

const changePasswordSchema = z.object({
    userId: z.string().min(1, { message: "معرف المستخدم مطلوب." }),
    currentPassword: z.string().min(6, { message: "كلمة المرور الحالية مطلوبة." }),
    newPassword: z.string().min(6, { message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل." }),
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export async function changePasswordAction(
    data: ChangePasswordFormValues
): Promise<ChangePasswordResult> {
    console.log(`[ChangePasswordAction] User ${data.userId} attempting to change password.`);

    const result = await dbChangeUserPassword(data.userId, data.currentPassword, data.newPassword);

    return result;
}
