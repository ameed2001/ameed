
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "كيف يمكنني حساب كميات الباطون؟",
    answer: "يمكنك استخدام أداة حساب كميات الباطون عبر إدخال الأبعاد المطلوبة (الطول، العرض، الارتفاع)، وسيقوم النظام تلقائيًا بحساب الحجم والمكونات بدقة."
  },
  {
    question: "هل الحسابات المقدمة دقيقة؟",
    answer: "نعم، الحسابات تعتمد على معادلات هندسية دقيقة ومعايير معتمدة، لكنها تقديرية ويُنصح دومًا بمراجعتها من قبل مهندس مختص قبل التنفيذ."
  },
  {
    question: "كيف يتم حساب تكلفة المواد؟",
    answer: "تعتمد تكلفة المواد على الأسعار المدخلة من قبل المستخدم. يمكنك إدخال السعر لكل وحدة (مثل سعر الطن أو الكيس) وسيتولى النظام حساب التكلفة الكاملة تلقائيًا."
  },
  {
    question: "هل يمكنني حفظ حساباتي؟",
    answer: "نعم، إذا كنت مستخدمًا مسجلاً، يمكنك حفظ حساباتك والرجوع إليها لاحقًا من خلال لوحة التحكم الخاصة بك."
  },
  {
    question: "لمن هذا الموقع موجه؟",
    answer: "الموقع مخصص للمهندسين، المقاولين، الطلاب، وأي شخص يعمل في مجال البناء ويحتاج إلى أدوات سريعة ودقيقة لحساب الكميات والتكاليف."
  },
  {
    question: "هل يمكنني استخدام الموقع بدون تسجيل؟",
    answer: "نعم، يمكنك إجراء الحسابات الأساسية بدون تسجيل، لكن التسجيل يمنحك ميزات إضافية مثل حفظ المشاريع وتتبعها."
  },
  {
    question: "هل يمكنني طلب ميزة جديدة أو اقتراح تعديل؟",
    answer: "بالتأكيد! نحن نرحب بجميع الاقتراحات عبر نموذج الاتصال، وسنعمل على دراستها وتطبيقها إن أمكن."
  },
  {
    question: "ماذا أفعل إذا واجهتني مشكلة تقنية؟",
    answer: "يرجى مراسلتنا من خلال نموذج الاتصال مع توضيح المشكلة، أو التواصل معنا عبر البريد المخصص للدعم الفني: support@mediaplus.com."
  },
  {
    question: "كيف يتم حماية بياناتي؟",
    answer: "نلتزم بحماية بياناتك باستخدام بروتوكولات أمان مشددة ولا نشارك أي معلومات شخصية مع أطراف خارجية."
  },
  {
    question: "هل الموقع متاح على الجوال؟",
    answer: "نعم، تم تصميم الموقع ليتوافق مع جميع الأجهزة، بما في ذلك الهواتف الذكية والأجهزة اللوحية."
  }
];

export default function HelpPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-3xl mx-auto bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-app-red text-center">❓ الأسئلة الشائعة</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-6 text-right">
            <p className="mb-8 text-center">
              تجد هنا إجابات على الأسئلة المتكررة. إذا لم تجد ما تبحث عنه، لا تتردد في التواصل معنا من خلال <a href="/contact" className="text-app-gold hover:underline">نموذج الاتصال</a> أو مركز المساعدة.
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
