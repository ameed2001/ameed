
"use client";

import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToCalculators = () => {
    const calculatorsSection = document.getElementById('calculators-section');
    if (calculatorsSection) {
      calculatorsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-red-800 via-app-red to-red-700 text-white text-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            أدق الحسابات للحديد والباطون
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed">
            هذا الموقع مختص في حساب الكميات لكل من الحديد والباطون للأبنية الإنشائية والأبار والجدران الإستنادية
          </p>
          <Button 
            onClick={scrollToCalculators}
            className="bg-app-gold hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 text-lg rounded-lg shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
          >
            ابدأ الحساب الآن
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
