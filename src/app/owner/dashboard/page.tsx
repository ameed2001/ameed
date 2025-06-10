
// src/app/owner/dashboard/page.tsx
export default function OwnerDashboardPage() {
  return (
    <div style={{ border: '2px solid blue', padding: '20px', margin: '20px', direction: 'rtl' }}>
      <h1 style={{ fontSize: '22px', color: 'blue', marginBottom: '10px' }}>صفحة لوحة تحكم المالك - اختبار الحد الأدنى</h1>
      <p>إذا رأيت هذه الرسالة، فهذا يعني أن مسار /owner/dashboard يعمل وهذه الصفحة يتم عرضها.</p>
      <a href="/" style={{ color: 'darkblue', textDecoration: 'underline' }}>العودة إلى الصفحة الرئيسية</a>
    </div>
  );
}
