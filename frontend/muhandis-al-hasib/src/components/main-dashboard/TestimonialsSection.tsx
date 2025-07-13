
"use client";

import { Quote, User } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
            <Card 
              key={index} 
              className={cn(
                "bg-white dark:bg-gray-800/50 shadow-lg rounded-2xl flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 border-t-4 border-app-gold/50",
                "h-full" 
              )}
              data-ai-hint={testimonial.dataAiHint}
            >
              <CardContent className="p-6 text-right flex-grow">
                <Quote className="h-10 w-10 text-app-gold opacity-30 mb-4 transform scale-x-[-1]" />
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 italic">
                  "{testimonial.testimonial}"
                </p>
              </CardContent>
              <CardFooter className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl border-t dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-app-gold">
                    <AvatarImage src={`https://placehold.co/100x100.png?text=${testimonial.avatarInitial}`} alt={testimonial.name} />
                    <AvatarFallback className="bg-app-red text-white">{testimonial.avatarInitial}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-app-red dark:text-app-gold text-lg">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
