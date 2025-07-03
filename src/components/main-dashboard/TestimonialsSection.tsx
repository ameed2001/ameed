"use client";

import { Quote, CheckCircle } from 'lucide-react';
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
            <div
              key={index}
              className="card-flipper h-80" // Set a fixed height for consistency
              data-ai-hint={testimonial.dataAiHint}
            >
              <div className="card-flipper-inner">
                {/* Front of the card */}
                <div className="card-flipper-front bg-white dark:bg-gray-800/50 p-6 flex flex-col text-right rounded-xl">
                  <Quote className="h-10 w-10 text-app-gold opacity-30 mb-4 transform scale-x-[-1] self-start" />
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 italic flex-grow">
                    "{testimonial.testimonial}"
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 w-full">
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
                  </div>
                </div>

                {/* Back of the card */}
                <div className="card-flipper-back bg-gradient-to-br from-app-red to-app-gold p-6 flex flex-col justify-center items-center text-center text-white">
                   <Avatar className="h-20 w-20 border-4 border-white/50 mb-4">
                      <AvatarImage src={`https://placehold.co/100x100.png?text=${testimonial.avatarInitial}`} alt={testimonial.name} />
                      <AvatarFallback className="bg-app-red text-white text-3xl">{testimonial.avatarInitial}</AvatarFallback>
                    </Avatar>
                    <h4 className="text-2xl font-bold">{testimonial.name}</h4>
                    <p className="text-white/80 mb-4">{testimonial.role}</p>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                        <span>مستخدم موثوق</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
