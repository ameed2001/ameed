
"use client";

import FeatureCard from './FeatureCard';
import { Button } from '@/components/ui/button';
import { Zap, ShieldCheck, Smartphone, Quote } from 'lucide-react';
// import Link from 'next/link'; // Link is no longer needed for this button
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Zap className="h-8 w-8 text-red-500" />,
    title: "سرعة ودقة في الحساب",
    description: "نوفر لك أدوات حساب سريعة ودقيقة تمكنك من الحصول على النتائج في ثوان معدودة مع ضمان الدقة العالية.",
    iconBgColor: "bg-red-100",
    dataAiHint: "speed accuracy",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-blue-500" />,
    title: "موثوقية عالية",
    description: "تم تطوير الحاسبات وفقًا للمعايير الهندسية المعتمدة عالميًا لضمان نتائج موثوقة يمكن الاعتماد عليها.",
    iconBgColor: "bg-blue-100",
    dataAiHint: "reliability security",
  },
  {
    icon: <Smartphone className="h-8 w-8 text-green-500" />,
    title: "سهولة الاستخدام",
    description: "واجهة سهلة الاستخدام ومتوافقة مع جميع الأجهزة تتيح لك إجراء الحسابات في أي وقت ومن أي مكان.",
    iconBgColor: "bg-green-100",
    dataAiHint: "ease use",
  },
];

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

const FeaturesSection = () => {
  const handleDiscoverFeaturesClick = () => {
    const authSection = document.getElementById('auth-cards-section');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-16 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-app-red">
          لماذا تختار موقعنا؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconBgColor={feature.iconBgColor}
              dataAiHint={feature.dataAiHint}
            />
          ))}
        </div>
        <div className="text-center mb-16 md:mb-20">
          <Button
            onClick={handleDiscoverFeaturesClick}
            className="bg-app-red hover:bg-red-700 text-white font-bold py-3 px-8 text-lg rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            اكتشف المزيد من المميزات
          </Button>
        </div>

        {/* User Testimonials Section */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-app-red">
          ماذا يقول المستخدمون عنا؟
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-white shadow-lg rounded-xl p-6 text-right flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
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

export default FeaturesSection;
