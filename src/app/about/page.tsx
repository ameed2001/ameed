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
          <CardContent className="text-lg text-gray-700 space-y-6 text-right leading-relaxed">
            <p>
              مرحبًا بكم في موقع "المحترف لحساب الكميات"! تم تصميم هذا الموقع ليكون أداة مساعدة للمهندسين، المقاولين، وأصحاب المشاريع في تقدير كميات مواد البناء الأساسية مثل الباطون والحديد بدقة وسهولة.
            </p>
            <p>
              يهدف المشروع إلى تبسيط عملية حساب الكميات التي غالبًا ما تكون معقدة وتستغرق وقتًا طويلًا عند إجرائها يدويًا أو باستخدام برامج متخصصة قد تكون مكلفة أو صعبة الاستخدام. من خلال واجهة مستخدم بسيطة ومباشرة، يمكنكم إدخال أبعاد العناصر الإنشائية المختلفة والحصول على تقديرات سريعة للكميات المطلوبة.
            </p>
            <p>
              بالإضافة إلى حساب الكميات، يوفر الموقع إرشادات عملية للمهندسين وأصحاب المباني لضمان سير العمل بكفاءة ووفقًا للمعايير الهندسية. كما يتضمن أداة لحساب التكاليف التقديرية للمواد لمساعدتكم في التخطيط المالي لمشاريعكم.
            </p>
            <p>
              نأمل أن يكون هذا الموقع عونًا لكم في مشاريعكم الإنشائية، ونسعى دائمًا لتطويره وتحسينه بناءً على ملاحظاتكم واقتراحاتكم.
            </p>
            <p className="font-semibold text-app-red">
              تم تطوير هذا الموقع كجزء من مشروع تخرج لطلاب قسم هندسة أنظمة الحاسوب في جامعة فلسطين التقنية - خضوري.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
