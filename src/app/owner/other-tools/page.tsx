
import InfoCard from '@/components/ui/InfoCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Wrench } from 'lucide-react';

export default function OtherToolsPage() {
  return (
    <div className="space-y-8 text-right">
      <Card className="bg-white/95 shadow-xl">
        <CardHeader className="text-center pb-4">
            <Wrench className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl font-bold text-app-red">أدوات أخرى</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
                مجموعة من الأدوات الإضافية لمساعدتك في إدارة مشروعك.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-xl mx-auto">
            <InfoCard
              title="حساب أسعار المواد"
              description="تقدير التكاليف الإجمالية لمواد البناء الأساسية مثل الحديد والباطون."
              icon={<DollarSign />}
              iconWrapperClass="bg-yellow-100 dark:bg-yellow-700"
              iconColorClass="text-yellow-500 dark:text-yellow-400"
              href="/cost-estimator"
              dataAiHint="cost estimation tool"
              cardHeightClass="h-72" 
              applyFlipEffect={false} 
              className="hover:shadow-lg hover:-translate-y-1"
            />
            {/* يمكن إضافة بطاقات أدوات أخرى هنا في المستقبل */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

