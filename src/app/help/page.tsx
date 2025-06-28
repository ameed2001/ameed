
"use client";

import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { HelpCircle, HardHat, Home, UserPlus } from "lucide-react";

const generalFaqs = [
  {
    question: "ما هي منصة 'المحترف لحساب الكميات'؟",
    answer: "هي منصة رقمية متكاملة مصممة للمهندسين وأصحاب المشاريع ومديري النظام لإدارة المشاريع الإنشائية بكفاءة، بدءًا من التخطيط وتقدير الكميات، وصولًا إلى متابعة التقدم والتكاليف وإصدار التقارير."
  },
  {
    question: "كيف تعمل أدوات تقدير الكميات؟",
    answer: "توفر المنصة حاسبات متخصصة لتقدير كميات الباطون والحديد بناءً على الأبعاد والمواصفات الهندسية التي تدخلها. كما توفر أداة شاملة لتقدير التكاليف بناءً على أسعار المواد المحدثة."
  },
  {
    question: "هل يمكنني تتبع تقدم المشروع من خلال المنصة؟",
    answer: "نعم، يمكن للمهندسين تحديث نسبة الإنجاز، رفع صور من موقع العمل، وإدارة جدول زمني تفاعلي للمشروع. ويمكن للمالكين الاطلاع على كل هذه التحديثات بشكل فوري من خلال لوحة التحكم الخاصة بهم."
  },
  {
    question: "ما نوع التقارير التي يمكن إنشاؤها؟",
    answer: "يمكنك إنشاء تقارير مفصلة للتكاليف، ملخصات لكميات المواد، وقريبًا، سيتم إضافة ميزة إنشاء تقارير PDF مدعومة بالذكاء الاصطناعي ومخصصة لجماهير مختلفة (مثل المالكين أو المستثمرين)."
  },
  {
    question: "هل بياناتي آمنة على المنصة؟",
    answer: "بالتأكيد. نحن نولي أهمية قصوى لأمن البيانات ونستخدم أحدث بروتوكولات الأمان لحماية جميع معلومات المستخدمين والمشاريع."
  }
];

const engineerFaqs = [
  {
    question: "كيف أقوم بإنشاء مشروع جديد؟",
    answer: "من لوحة تحكم المهندس، يمكنك العثور على خيار 'إنشاء مشروع جديد'. سيتم توجيهك إلى نموذج لإدخال جميع التفاصيل الأساسية للمشروع مثل الاسم والموقع والوصف."
  },
  {
    question: "كيف يمكنني ربط مالك بمشروع؟",
    answer: "بعد إنشاء المشروع، يمكنك استخدام أداة 'ربط المالكين' حيث تقوم بإدخال البريد الإلكتروني للمالك المسجل في المنصة لربطه بالمشروع ومنحه صلاحية المتابعة."
  },
  {
    question: "هل يمكنني إدارة عدة مشاريع في نفس الوقت؟",
    answer: "نعم، تم تصميم لوحة تحكم المهندس لعرض وإدارة جميع مشاريعك النشطة والمؤرشفة في مكان واحد، مما يسهل عليك التنقل بينها ومتابعتها."
  }
];

const ownerFaqs = [
  {
    question: "كيف أرى تقدم المشروع الخاص بي؟",
    answer: "بمجرد أن يقوم المهندس المسؤول بربط حسابك بالمشروع، ستظهر جميع تفاصيله في لوحة التحكم الخاصة بك، بما في ذلك نسبة الإنجاز، الصور المرفوعة، الجدول الزمني، وتقارير التكاليف."
  },
  {
    question: "هل يمكنني التواصل مع المهندس عبر المنصة؟",
    answer: "نعم، يمكنك إضافة تعليقات واستفسارات مباشرة على صفحة المشروع المخصصة، وسيتلقى المهندس إشعارًا بذلك، مما يسهل التواصل وحفظ سجل للمناقشات."
  },
  {
    question: "هل لدي صلاحية الوصول إلى تقارير التكاليف؟",
    answer: "نعم، عندما يقوم المهندس بإعداد تقارير التكاليف أو الكميات ومشاركتها، ستكون متاحة لك للاطلاع عليها مباشرة من خلال صفحة المشروع."
  }
];

const newUserFaqs = [
    {
    question: "هل أحتاج إلى حساب لاستخدام الأدوات؟",
    answer: <>نعم، التسجيل إلزامي للاستفادة من جميع ميزات المنصة. يمكنك <Link href="/signup" className="text-app-red hover:underline font-semibold">التسجيل كمهندس</Link> أو <Link href="/owner-signup" className="text-app-red hover:underline font-semibold">كمالك مشروع</Link>.</>
    },
    {
    question: "ما الفرق بين حساب المهندس وحساب المالك؟",
    answer: "حساب المهندس مخصص لإدارة المشاريع، إدخال البيانات الفنية، حساب الكميات والتكاليف، وتحديث التقدم. أما حساب المالك فهو مخصص لمراقبة هذه البيانات، الاطلاع على التقارير، والتواصل مع فريق العمل."
    },
];

export default function HelpPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto bg-white/95 shadow-xl border border-gray-200/80">
          <CardHeader className="text-center pb-4">
            <HelpCircle className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl md:text-4xl font-bold text-app-red">مركز المساعدة والأسئلة الشائعة</CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
              تجد هنا إجابات للأسئلة الأكثر شيوعًا حول منصتنا. إذا لم تجد ما تبحث عنه، لا تتردد في <Link href="/contact" className="text-app-red hover:underline">مراسلتنا</Link>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10 px-4 md:px-8 py-6 text-right">
            
            <section>
              <h2 className="text-2xl font-semibold text-app-red mb-6 pb-2 border-b-2 border-app-gold">
                أسئلة عامة عن المنصة
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {generalFaqs.map((faq, index) => (
                  <AccordionItem value={`general-${index}`} key={index}>
                    <AccordionTrigger className="py-4 text-lg font-semibold text-right hover:text-app-gold transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-2 text-gray-700 leading-relaxed text-base bg-gray-50/70 pr-4 rounded-b-md">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
            
            <section>
               <h2 className="text-2xl font-semibold text-app-red mb-6 pb-2 border-b-2 border-app-gold">
                أسئلة حسب دور المستخدم
              </h2>
              <div className="space-y-6">

                {/* Engineer FAQs */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-blue-700 mb-3">
                    <HardHat /> للمهندسين
                  </h3>
                  <Accordion type="single" collapsible className="w-full border rounded-lg p-2 bg-blue-50/50">
                    {engineerFaqs.map((faq, index) => (
                      <AccordionItem value={`engineer-${index}`} key={`engineer-${index}`} className="border-b-blue-200 last:border-b-0">
                        <AccordionTrigger className="py-3 text-base text-right hover:text-blue-800">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-3 pt-1 text-gray-700 leading-relaxed text-sm bg-white/50 pr-4 rounded-b-md">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                
                {/* Owner FAQs */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-green-700 mb-3">
                    <Home /> للمالكين
                  </h3>
                   <Accordion type="single" collapsible className="w-full border rounded-lg p-2 bg-green-50/50">
                    {ownerFaqs.map((faq, index) => (
                      <AccordionItem value={`owner-${index}`} key={`owner-${index}`} className="border-b-green-200 last:border-b-0">
                        <AccordionTrigger className="py-3 text-base text-right hover:text-green-800">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-3 pt-1 text-gray-700 leading-relaxed text-sm bg-white/50 pr-4 rounded-b-md">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                {/* New User FAQs */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-gray-700 mb-3">
                    <UserPlus /> للتسجيل والمستخدمين الجدد
                  </h3>
                   <Accordion type="single" collapsible className="w-full border rounded-lg p-2 bg-gray-50/50">
                    {newUserFaqs.map((faq, index) => (
                      <AccordionItem value={`new-user-${index}`} key={`new-user-${index}`} className="border-b-gray-200 last:border-b-0">
                        <AccordionTrigger className="py-3 text-base text-right hover:text-gray-800">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-3 pt-1 text-gray-700 leading-relaxed text-sm bg-white/50 pr-4 rounded-b-md">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
