
"use client";

import InfoCard from '@/components/ui/InfoCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wrench, PlusCircle, Calculator } from 'lucide-react'; 

export default function OtherToolsPage() {
  return (
    <div className="space-y-8 text-right p-4 md:p-8">
      <Card className="bg-white/95 shadow-xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center items-center mb-4">
            <Wrench className="h-12 w-12 text-app-gold mr-3" />
            <CardTitle className="text-3xl font-bold text-app-red">أدوات أخرى</CardTitle>
          </div>
          <CardDescription className="text-gray-600 text-lg">
            مجموعة من الأدوات الذكية لمساعدتك في إدارة مشروعك بكفاءة
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <InfoCard
              title="حاسبة أسعار المواد (جديدة)"
              description="أداة جديدة لحساب تكاليف مواد البناء المختلفة. تعمل كصفحة تفاعلية داخل التطبيق."
              icon={<Calculator className="w-8 h-8" />}
              iconWrapperClass="bg-blue-100 dark:bg-blue-700"
              iconColorClass="text-blue-500 dark:text-blue-400"
              href="/cost-estimator" // Link to the new Next.js page
              applyFlipEffect={false}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200/80 dark:border-gray-700/60"
              cardHeightClass="h-full min-h-[280px]"
              dataAiHint="price calculator react"
            />
            <InfoCard
              title="المزيد قريباً"
              description="نعمل باستمرار على تطوير وإضافة أدوات جديدة ومفيدة لمساعدتك في إدارة مشاريعك بكفاءة أكبر. ترقب التحديثات القادمة!"
              icon={<PlusCircle className="w-8 h-8" />}
              iconWrapperClass="bg-gray-100 dark:bg-gray-700"
              iconColorClass="text-gray-500 dark:text-gray-400"
              cardHeightClass="h-full min-h-[280px]"
              applyFlipEffect={false}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200/80 dark:border-gray-700/60"
              dataAiHint="coming soon tools"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
