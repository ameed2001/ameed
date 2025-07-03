
"use client";

import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: "عميد سماره",
    role: "صاحب مشروع",
    avatarInitial: "عس",
    testimonial: "الموقع رائع وسهل الاستخدام! ساعدني كثيرًا في تقدير كميات المواد لمشروعي بسرعة ودقة. أنصح به بشدة.",
    dataAiHint: "user testimonial"
  },
  {
    name: "م. أحمد خالد",
    role: "مهندس إنشائي",
    avatarInitial: "أخ",
    testimonial: "ك مهندس، أجد هذا الموقع أداة قيمة جدًا. المعادلات دقيقة والواجهة سهلة. يوفر الكثير من الوقت والجهد.",
    dataAiHint: "engineer testimonial"
  },
  {
    name: "سارة عبدالله",
    role: "مستخدم جديد",
    avatarInitial: "سع",
    testimonial: "أخيرًا موقع عربي متكامل لحساب كميات البناء! تصميم جذاب وأدوات مفيدة للغاية. شكرًا للقائمين عليه.",
    dataAiHint: "user review"
  },
  {
    name: "شركة البناء الحديث",
    role: "مقاولات عامة",
    avatarInitial: "ش",
    testimonial: "نستخدم الموقع لتقديراتنا الأولية للمشاريع. يساعدنا في تقديم عروض أسعار سريعة لعملائنا. عمل ممتاز!",
    dataAiHint: "company feedback"
  }
];

const TestimonialsSection = () => {
  return (
    <section 
      className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            ماذا يقول المستخدمون عنا؟
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            آراء وشهادات من مهندسين وملاك مشاريع يثقون في منصتنا.
          </p>
          <div className="mt-4 w-24 h-1 bg-app-gold mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group h-64 w-full bg-white m-auto rounded-2xl overflow-hidden relative p-6 z-0 flex flex-col justify-start text-right shadow-lg"
              data-ai-hint={testimonial.dataAiHint}
            >
              <div
                className="circle absolute h-32 w-32 -top-16 -left-16 rounded-full bg-[#FF5800] group-hover:scale-[10] duration-500 z-[-1] transition-transform"
              ></div>
              <div className="z-20">
                <h3 className="font-bold text-2xl text-gray-800 group-hover:text-white duration-500">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-200 duration-500">
                  {testimonial.role}
                </p>
              </div>
              <div className="mt-auto z-20 opacity-0 group-hover:opacity-100 duration-500 transition-opacity">
                <p className="text-white text-sm italic">
                  "{testimonial.testimonial}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
