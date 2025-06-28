
"use client";

import { Quote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const testimonials = [
  {
    name: "عميد سماره",
    testimonial: "الموقع رائع وسهل الاستخدام! ساعدني كثيرًا في تقدير كميات المواد لمشروعي بسرعة ودقة. أنصح به بشدة.",
    dataAiHint: "user testimonial"
  },
  {
    name: "م. أحمد خالد",
    testimonial: "ك مهندس، أجد هذا الموقع أداة قيمة جدًا. المعادلات دقيقة والواجهة سهلة. يوفر الكثير من الوقت والجهد.",
    dataAiHint: "engineer testimonial"
  },
  {
    name: "سارة عبدالله",
    testimonial: "أخيرًا موقع عربي متكامل لحساب كميات البناء! تصميم جذاب وأدوات مفيدة للغاية. شكرًا للقائمين عليه.",
    dataAiHint: "user review"
  },
  {
    name: "شركة البناء الحديث",
    testimonial: "نستخدم الموقع لتقديراتنا الأولية للمشاريع. يساعدنا في تقديم عروض أسعار سريعة لعملائنا. عمل ممتاز!",
    dataAiHint: "company feedback"
  }
];

const TestimonialsSection = () => {
  return (
    <section 
      className="py-16 md:py-20 bg-white"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          ماذا يقول المستخدمون عنا؟
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-white/95 shadow-lg rounded-xl p-6 text-right flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
              data-ai-hint={testimonial.dataAiHint}
            >
              <CardHeader className="p-0 mb-2 text-right">
                <div className="mb-2">
                  <Quote className="h-8 w-8 text-app-gold opacity-75 transform scale-x-[-1]" />
                </div>
                <CardTitle className="text-xl font-semibold text-app-red">{testimonial.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-gray-700 flex-grow">
                <p className="text-base leading-relaxed italic">"{testimonial.testimonial}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
