
import InfoCard from '@/components/ui/InfoCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Wrench, Calculator, ClipboardList, BarChart2, CalendarCheck, FileText } from 'lucide-react';

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
            مجموعة متكاملة من الأدوات الذكية لمساعدتك في إدارة مشروعك بكفاءة
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* بطاقة حساب أسعار المواد */}
            <InfoCard
              title="حساب أسعار المواد"
              description="تقدير التكاليف الإجمالية لمواد البناء الأساسية مثل الحديد، الخرسانة، والطوب مع تحديثات الأسعار اليومية."
              icon={<DollarSign className="w-8 h-8" />}
              iconWrapperClass="bg-yellow-100 dark:bg-yellow-800"
              iconColorClass="text-yellow-500 dark:text-yellow-400"
              href="/cost-estimator" // Corrected href to existing page
              dataAiHint="cost estimation tool"
              cardHeightClass="h-full min-h-[280px]"
              applyFlipEffect={false}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200/80 dark:border-gray-700/60"
            />

            {/* بطاقة حاسبة الكميات */}
            <InfoCard
              title="حاسبة الكميات"
              description="حساب الكميات المطلوبة من المواد بناءً على مساحة المشروع ونوع الإنشاء."
              icon={<Calculator className="w-8 h-8" />}
              iconWrapperClass="bg-blue-100 dark:bg-blue-800"
              iconColorClass="text-blue-500 dark:text-blue-400"
              href="/tools/quantity-calculator" // Placeholder href
              dataAiHint="quantity calculation"
              cardHeightClass="h-full min-h-[280px]"
              applyFlipEffect={false}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200/80 dark:border-gray-700/60"
            />

            {/* بطاقة متابعة المهام */}
            <InfoCard
              title="متابعة المهام"
              description="تنظيم ومتابعة سير العمل في المشروع مع تحديد الأولويات والمواعيد النهائية."
              icon={<ClipboardList className="w-8 h-8" />}
              iconWrapperClass="bg-green-100 dark:bg-green-800"
              iconColorClass="text-green-500 dark:text-green-400"
              href="/tools/task-tracker" // Placeholder href
              dataAiHint="task tracking"
              cardHeightClass="h-full min-h-[280px]"
              applyFlipEffect={false}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200/80 dark:border-gray-700/60"
            />

            {/* بطاقة تحليل التكاليف */}
            <InfoCard
              title="تحليل التكاليف"
              description="مقارنة التكاليف الفعلية مع المخطط لها وتحديد الانحرافات المالية."
              icon={<BarChart2 className="w-8 h-8" />}
              iconWrapperClass="bg-purple-100 dark:bg-purple-800"
              iconColorClass="text-purple-500 dark:text-purple-400"
              href="/tools/cost-analysis" // Placeholder href
              dataAiHint="cost analysis"
              cardHeightClass="h-full min-h-[280px]"
              applyFlipEffect={false}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200/80 dark:border-gray-700/60"
            />

            {/* بطاقة جدولة المشروع */}
            <InfoCard
              title="جدولة المشروع"
              description="إنشاء خطط زمنية مفصلة للمشروع مع تحديد المراحل الرئيسية."
              icon={<CalendarCheck className="w-8 h-8" />}
              iconWrapperClass="bg-red-100 dark:bg-red-800"
              iconColorClass="text-red-500 dark:text-red-400"
              href="/tools/project-scheduler" // Placeholder href
              dataAiHint="project scheduling"
              cardHeightClass="h-full min-h-[280px]"
              applyFlipEffect={false}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200/80 dark:border-gray-700/60"
            />

            {/* بطاقة إنشاء التقارير */}
            <InfoCard
              title="إنشاء التقارير"
              description="تصدير تقارير احترافية عن سير العمل والتكاليف والجداول الزمنية."
              icon={<FileText className="w-8 h-8" />}
              iconWrapperClass="bg-cyan-100 dark:bg-cyan-800"
              iconColorClass="text-cyan-500 dark:text-cyan-400"
              href="/tools/report-generator" // Placeholder href
              dataAiHint="report generation"
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
