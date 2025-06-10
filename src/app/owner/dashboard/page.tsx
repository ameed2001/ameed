'use client';

export default function OwnerDashboardPage() {
  console.log("Rendering OwnerDashboardPage content (Highly Simplified for Server Error Test)");
  return (
    <div className="text-right p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-app-red mb-4">لوحة تحكم المالك (اختبار الخطأ من الخادم)</h1>
      <p className="text-lg text-gray-700">
        هذا هو محتوى صفحة لوحة تحكم المالك (مبسط للغاية).
      </p>
      <p className="mt-4 text-sm text-gray-500">
        إذا رأيت هذه الرسالة، فهذا يعني أن الصفحة والتخطيط الأساسي لقطاع المالك يعملان بعد التعديل.
      </p>
    </div>
  );
}
