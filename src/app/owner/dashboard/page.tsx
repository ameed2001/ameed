
'use client';

export default function OwnerDashboardRebuiltPage() {
  console.log("Rendering OwnerDashboardRebuiltPage (Client Component - Rebuilt)");
  return (
    <div style={{ border: '2px dashed green', padding: '20px', margin: '10px', backgroundColor: 'lightgreen' }}>
      <h2 style={{ color: 'darkgreen', textAlign: 'center', marginBottom: '15px' }}>
        لوحة تحكم المالك (إعادة بناء بسيطة)
      </h2>
      <p style={{ textAlign: 'right' }}>
        إذا رأيت هذه الرسالة، فهذا يعني أن الصفحة الأساسية للوحة تحكم المالك يتم تحميلها ضمن التخطيط البسيط الجديد.
      </p>
    </div>
  );
}
