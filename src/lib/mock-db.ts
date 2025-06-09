
// src/lib/mock-db.ts
// هذا الملف أصبح الآن مهملًا (deprecated).
// يتم الآن التعامل مع جميع عمليات قاعدة البيانات من خلال Prisma Client
// في الملف: src/lib/db.ts

// يمكنك حذف هذا الملف إذا لم تعد هناك أي مكونات تستورده مباشرة.
// إذا كانت هناك استيرادات، يجب تحديثها لتشير إلى src/lib/db.ts
// واستخدام الدوال المعرفة هناك.

console.warn(
  "DEPRECATION WARNING: src/lib/mock-db.ts is deprecated. " +
  "Use src/lib/db.ts and Prisma client for database operations."
);

// اترك الملف فارغًا أو احذف محتواه بالكامل إذا كنت متأكدًا
// أنه لم يعد مستخدمًا.
// للحفاظ على التطبيق من التعطل فورًا إذا كان لا يزال هناك استيراد،
// يمكن ترك بعض الصادرات الوهمية الفارغة أو التي تُرجع أخطاءً.

export const dbUsers = [];
export const dbProjects = [];
export const dbSettings = {};
export const dbLogs = [];
export const roles = [];
export const useCases = [];

export function findUserByEmail(email: string) {
  console.error("MockDB Deprecated: findUserByEmail called. Use Prisma version.");
  return undefined;
}

export function registerUser(userData: any) {
  console.error("MockDB Deprecated: registerUser called. Use Prisma version.");
  return { success: false, message: "MockDB is deprecated." };
}

export function loginUser(email: string, password_hash: string) {
  console.error("MockDB Deprecated: loginUser called. Use Prisma version.");
  return { success: false, message: "MockDB is deprecated." };
}

// ... وهكذا لباقي الدوال إذا أردت ...

export default {
  // اترك هذا فارغًا أو قم بتصدير كائنات وهمية
};
