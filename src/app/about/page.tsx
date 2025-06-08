import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-3xl mx-auto bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-app-red text-center">عن الموقع</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 text-right leading-relaxed">
            <section className="mb-6">
              <h3 className="text-2xl font-semibold text-app-red mb-3">🏗️ عن موقع المحترف لحساب الكميات</h3>
              <p className="mb-3">
                مرحبًا بكم في موقع "المحترف لحساب الكميات" — منصة هندسية رقمية متخصصة في حساب كميات الحديد والباطون بدقة وسرعة، ومتابعة مختلف مراحل المشروع الإنشائي بطريقة احترافية.
              </p>
              <p>
                تم تطوير هذا الموقع ليكون أداة موثوقة وسهلة الاستخدام لكل من المهندسين، المقاولين، وأصحاب العقارات، الذين يحتاجون إلى تقديرات دقيقة تساعدهم في تخطيط وتنفيذ مشاريعهم بكفاءة.
              </p>
            </section>

            <section className="mb-6">
              <h4 className="text-xl font-semibold text-app-red mb-3">🎯 رسالتنا</h4>
              <p className="mb-3">
                رسالتنا هي تبسيط عملية حساب الكميات الإنشائية التي غالبًا ما تكون معقدة وتستغرق وقتًا وجهدًا كبيرين، خاصة عند الاعتماد على الطرق اليدوية أو البرامج المتخصصة المكلفة.
              </p>
              <p>
                نحن نوفر بديلاً رقميًا ذكيًا وفعالًا، يمكّن المستخدم من إجراء حسابات دقيقة للحديد والباطون من خلال خطوات بسيطة، وبواجهة استخدام واضحة وسلسة.
              </p>
            </section>

            <section className="mb-6">
              <h4 className="text-xl font-semibold text-app-red mb-3">👁️ رؤيتنا</h4>
              <p>
                نسعى لأن نكون المرجع الأول عربيًا في مجال حوسبة الكميات الإنشائية عبر الإنترنت، من خلال تقديم أدوات موثوقة، ومحتوى إرشادي، وخدمات ذكية تساعد على تحسين جودة التصميم والتنفيذ وإدارة المشاريع في قطاع البناء العربي.
              </p>
            </section>

            <section className="mb-6">
              <h4 className="text-xl font-semibold text-app-red mb-3">⚙️ ما الذي يقدمه الموقع؟</h4>
              <div className="space-y-2">
                <p>🧱 حساب دقيق لكميات الحديد والباطون وفقًا للمخططات الهندسية والمعايير الفنية.</p>
                <p>💰 تقدير تكاليف المواد والعمالة بشكل تقريبي لمساعدتك على التخطيط المالي.</p>
                <p>📊 متابعة مراحل البناء خطوة بخطوة من الحفر وحتى التشطيب.</p>
                <p>📁 إدارة المستندات والمعلومات الإنشائية لكل مشروع بسهولة.</p>
                <p>📞 دعم فني مباشر لمساعدتك على تجاوز أي مشكلة أو استفسار.</p>
              </div>
            </section>

            <section>
              <h4 className="text-xl font-semibold text-app-red mb-3">💡 تطوير مستمر</h4>
              <p>
                نحن نعمل باستمرار على تحسين وتطوير الموقع، بناءً على ملاحظات واقتراحات المستخدمين، لنقدّم أفضل تجربة ممكنة تلبي الاحتياجات الهندسية والعملية بشكل فعّال.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
