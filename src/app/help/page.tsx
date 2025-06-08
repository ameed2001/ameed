import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "كيف يمكنني حساب كميات الباطون؟",
    answer: "اذهب إلى الصفحة الرئيسية، انقر على بطاقة 'حساب كميات الباطون'، ثم اختر العنصر الإنشائي (مثل القواعد، الأعمدة، إلخ). أدخل الأبعاد المطلوبة في النموذج واضغط على 'حساب'."
  },
  {
    question: "هل الحسابات المقدمة دقيقة؟",
    answer: "الموقع يقدم تقديرات بناءً على المعادلات الهندسية القياسية. ومع ذلك، يجب دائمًا مراجعة الحسابات من قبل مهندس مختص ومراعاة عوامل الموقع ونسبة الهدر."
  },
  {
    question: "كيف يتم حساب تكلفة المواد؟",
    answer: "من خلال بطاقة 'حساب الأسعار'، يمكنك إدخال الكميات المقدرة للباطون والحديد وأسعار الوحدات لكل منهما للحصول على التكلفة الإجمالية التقديرية للمواد."
  },
  {
    question: "هل يمكنني حفظ حساباتي؟",
    answer: "حاليًا، لا يوفر الموقع ميزة حفظ الحسابات مباشرة للمستخدمين. نوصي بتسجيل النتائج أو طباعتها. (ملاحظة: النسخة الحالية هي لأغراض العرض التوضيحي)."
  },
  {
    question: "لمن هذا الموقع موجه؟",
    answer: "الموقع موجه للمهندسين الإنشائيين، مقاولي البناء، طلاب الهندسة، وأي شخص مهتم بتقدير كميات مواد البناء لمشاريع إنشائية."
  }
];

export default function HelpPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-3xl mx-auto bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-app-red text-center">مركز المساعدة</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-6 text-right">
            <p className="mb-8 text-center">
              تجد هنا إجابات على الأسئلة الشائعة. إذا لم تجد ما تبحث عنه، لا تتردد في <a href="/contact" className="text-app-gold hover:underline">الاتصال بنا</a>.
            </p>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-b border-gray-300">
                  <AccordionTrigger className="py-4 text-xl font-semibold hover:no-underline text-right hover:text-app-gold transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-2 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
