"use client"; // Added 'use client' for maximum client-side rendering

export default function OwnerDashboardPage() {
  return (
    <div className="text-right p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-app-red mb-4">لوحة تحكم المالك (مبسطة جداً)</h1>
      <p className="text-lg text-gray-700">
        إذا رأيت هذه الرسالة، فالصفحة الأساسية تعمل.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        الهدف من هذا التبسيط هو تحديد مصدر الخطأ "Error reaching server".
      </p>
      <p className="mt-2 text-sm text-gray-500">
        تمت إزالة الهيدر والفوتر مؤقتًا من هذا التخطيط للاختبار.
      </p>
    </div>
  );
}
