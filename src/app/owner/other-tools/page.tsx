
import InfoCard from '@/components/ui/InfoCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Wrench } from 'lucide-react';

export default function OtherToolsPage() {
  return (
    <div className="space-y-8 text-right p-4 md:p-8">
      <Card className="bg-white/95 shadow-xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center items-center mb-4">
            <Wrench className="h-12 w-12 text-app-gold ml-3" /> {/* Adjusted margin for RTL */}
            <CardTitle className="text-3xl font-bold text-app-red">أدوات أخرى</CardTitle>
          </div>
          <CardDescription className="text-gray-600 text-lg">
            مجموعة من الأدوات الذكية لمساعدتك في إدارة مشروعك بكفاءة
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* بطاقة حساب أسعار المواد */}
            <InfoCard
              title="حساب أسعار المواد"
              description="تقدير التكاليف الإجمالية لمواد البناء الأساسية مثل الحديد، الخرسانة، والطوب."
              icon={<DollarSign className="w-8 h-8" />}
              iconWrapperClass="bg-yellow-100 dark:bg-yellow-800"
              iconColorClass="text-yellow-500 dark:text-yellow-400"
              href="/cost-estimator"
              dataAiHint="cost estimation tool"
              cardHeightClass="h-full min-h-[280px]"
              applyFlipEffect={false}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200/80 dark:border-gray-700/60"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
