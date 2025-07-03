"use client";

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

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
              className="group relative w-full h-80 bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden shadow-lg"
              data-ai-hint={testimonial.dataAiHint}
            >
              {/* The animated background */}
              <div className="
                absolute top-0 left-0 w-full h-24 rounded-t-2xl
                bg-gradient-to-bl from-amber-300 via-red-400 to-app-red
                transition-all duration-500
                group-hover:scale-95 group-hover:h-full group-hover:rounded-b-2xl
              "></div>

              {/* Avatar */}
              <div className="
                relative w-28 h-28 z-10
                transition-all duration-500
                group-hover:scale-110 group-hover:-translate-x-14 md:group-hover:-translate-x-16 group-hover:-translate-y-16
              ">
                <Avatar className="w-full h-full border-4 border-slate-50">
                  <AvatarImage src={`https://placehold.co/100x100.png?text=${testimonial.avatarInitial}`} alt={testimonial.name} />
                  <AvatarFallback className="bg-app-red text-white flex items-center justify-center">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Text Content */}
              <div className="z-10 transition-all duration-500 group-hover:-translate-y-10 text-gray-800 group-hover:text-white">
                <span className="text-2xl font-semibold">{testimonial.name}</span>
                <p className="text-gray-500 group-hover:text-gray-200">{testimonial.role}</p>
              </div>
              
              {/* Testimonial text shown on hover */}
              <div className="
                absolute bottom-6 left-0 w-full p-4
                text-center text-white
                opacity-0 z-20 transition-opacity duration-300
                group-hover:opacity-100 group-hover:delay-200
              ">
                <p className="italic text-sm">"{testimonial.testimonial}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
