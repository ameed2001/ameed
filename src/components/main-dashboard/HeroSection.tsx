"use client";

import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const handleStartClick = () => {
    const authSection = document.getElementById('auth-cards-section');
    if (authSection) {
      authSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      className="relative w-full py-12 md:py-16 lg:py-20 text-white text-center"
      style={{
        backgroundImage: `url('https://i.imgur.com/9YdRlNn.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
      data-ai-hint="construction site crane"
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            احسب بدقة، ابنِ بثقة — وادِر مشروعك من الألف إلى الياء
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-4 leading-relaxed">
            منصة هندسية متكاملة لحساب كميات الحديد والباطون بدقة عالية، ومتابعة كل ما يتعلق بمشروعك الإنشائي، بما في ذلك الأبنية، الآبار، الجدران الاستنادية، والأساسات.
          </p>
          <p className="text-lg sm:text-xl text-gray-200 mb-4 leading-relaxed">
            سواء كنت مهندسًا، مقاولًا، أو صاحب عقار، نتيح لك أدوات قوية تُمكِّنك من:
          </p>
          <div className="text-right sm:text-xl text-gray-200 mb-4 leading-relaxed px-4 sm:px-0">
            <p>
              🔹 تقدير الكميات بدقة وفقًا للمخططات والمعايير الفنية<br />
              🔹 احتساب التكاليف والأسعار التقديرية لمواد البناء والعمالة<br />
              🔹 متابعة مراحل البناء خطوة بخطوة: من الحفر وحتى التشطيب<br />
              🔹 إدارة المشاريع والمستندات بسهولة واحترافية
            </p>
          </div>
           <p className="text-lg sm:text-xl text-gray-100 font-semibold mb-4 leading-relaxed">
            ابدأ الآن، وامتلك السيطرة الكاملة على مشروعك بكل ثقة ووضوح.
          </p>
          <p className="text-lg sm:text-xl text-gray-200 mb-6 leading-relaxed">
            وإن واجهتك أي مشكلة، لا تقلق — فريق الدعم مستعد دائمًا لمساعدتك وحلها فورًا.
          </p>
          <Button
            onClick={handleStartClick}
            className="bg-app-gold hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 text-lg rounded-lg shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
          >
            ابدء معنا
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
