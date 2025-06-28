import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, Home, Shield, Zap, Target, Eye, GitCommit } from "lucide-react";

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto bg-white/95 shadow-xl border border-gray-200/80">
          <CardHeader className="text-center pb-4">
            <Zap className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl md:text-4xl font-bold text-app-red">عن منصتنا</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 text-right leading-relaxed px-6 md:px-10">
            <section className="mb-8">
              <h3 className="text-2xl font-semibold text-app-red mb-3 flex items-center justify-end gap-2">
                منصة المحترف لإدارة المشاريع الإنشائية <GitCommit />
              </h3>
              <p className="mb-3">
                مرحبًا بكم في "المحترف لحساب الكميات" — منصة رقمية متكاملة تجمع بين المهندسين وأصحاب المشاريع ومديري النظام في بيئة عمل واحدة. تم تصميم المنصة لتسهيل إدارة المشاريع الإنشائية من مرحلة التخطيط وحساب الكميات، وصولًا إلى المتابعة والتسليم.
              </p>
              <p>
                نهدف إلى توفير أدوات قوية وشفافة تعزز التواصل والثقة بين جميع الأطراف، وتضمن سير العمل بكفاءة ودقة عالية.
              </p>
            </section>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <section>
                    <h4 className="text-xl font-semibold text-app-red mb-3 flex items-center justify-end gap-2">
                        رسالتنا <Target />
                    </h4>
                    <p>
                        تتمثل رسالتنا في بناء جسر رقمي متين من الثقة والشفافية بين المهندسين وأصحاب المشاريع، من خلال توفير أدوات ذكية لإدارة المشاريع، ومتابعة التكاليف، وتوثيق التقدم، مما يضمن تحقيق الأهداف المشتركة بأعلى معايير الجودة.
                    </p>
                </section>
                <section>
                    <h4 className="text-xl font-semibold text-app-red mb-3 flex items-center justify-end gap-2">
                        رؤيتنا <Eye />
                    </h4>
                    <p>
                        نسعى لنكون المنصة الرائدة في العالم العربي التي يعتمد عليها المهندسون والملاك لإدارة مشاريعهم الإنشائية، من خلال الابتكار المستمر وتقديم حلول تقنية تلبي تحديات قطاع البناء وتساهم في نجاح المشاريع.
                    </p>
                </section>
            </div>


            <section className="mb-6">
              <h3 className="text-2xl font-semibold text-app-red mb-4 text-center border-t pt-6">ماذا تقدم المنصة؟</h3>
              <div className="space-y-8">
                
                <div data-ai-hint="engineer features">
                  <h4 className="text-xl font-bold text-blue-600 mb-3 flex items-center justify-end gap-2">
                    <HardHat /> للمهندسين
                  </h4>
                  <ul className="list-disc list-inside space-y-2 pr-4">
                    <li><strong>إدارة شاملة للمشاريع:</strong> إنشاء ومتابعة وتحديث حالة المشاريع من لوحة تحكم مركزية.</li>
                    <li><strong>حساب دقيق للتكاليف:</strong> أدوات متقدمة لتقدير تكاليف المواد وربط التقارير بالمشاريع والمالكين.</li>
                    <li><strong>توثيق التقدم:</strong> رفع صور وملاحظات من موقع العمل لمشاركتها مع المالك.</li>
                    <li><strong>ربط المالكين:</strong> دعوة المالكين لمتابعة مشاريعهم وتعزيز الشفافية.</li>
                  </ul>
                </div>

                <div data-ai-hint="owner features">
                  <h4 className="text-xl font-bold text-green-600 mb-3 flex items-center justify-end gap-2">
                    <Home /> للمالكين
                  </h4>
                   <ul className="list-disc list-inside space-y-2 pr-4">
                    <li><strong>متابعة حية للمشاريع:</strong> عرض تفصيلي لتقدم المشاريع ونسبة الإنجاز والجداول الزمنية.</li>
                    <li><strong>شفافية كاملة:</strong> الاطلاع على تقارير التكاليف والصور التي يرفعها المهندس.</li>
                    <li><strong>تواصل مباشر:</strong> إضافة تعليقات واستفسارات على صفحة المشروع للتواصل الفعال مع المهندس.</li>
                    <li><strong>أدوات تقديرية:</strong> استخدام حاسبة مبسطة لتقدير تكاليف المواد بشكل أولي.</li>
                  </ul>
                </div>
                
                <div data-ai-hint="admin features">
                  <h4 className="text-xl font-bold text-purple-600 mb-3 flex items-center justify-end gap-2">
                    <Shield /> للمسؤولين
                  </h4>
                   <ul className="list-disc list-inside space-y-2 pr-4">
                    <li><strong>تحكم كامل بالنظام:</strong> لوحة تحكم لإدارة جميع المستخدمين والمشاريع والإعدادات.</li>
                    <li><strong>مراقبة النشاط:</strong> مراجعة سجلات النظام لمتابعة جميع الأنشطة والأحداث الهامة.</li>
                    <li><strong>إدارة الصلاحيات:</strong> الموافقة على حسابات المهندسين، تعليق الحسابات، وإعادة تعيين كلمات المرور.</li>
                  </ul>
                </div>

              </div>
            </section>
            
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
