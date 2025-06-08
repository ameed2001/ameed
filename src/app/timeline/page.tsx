import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GanttChartSquare } from "lucide-react";

export default function TimelinePage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto bg-white/90 shadow-lg">
          <CardHeader className="text-center">
            <GanttChartSquare className="mx-auto h-16 w-16 text-app-gold mb-4" />
            <CardTitle className="text-3xl font-bold text-app-red">الجدول الزمني التفاعلي للمشروع</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              عرض مرئي لتقدم المشروع ومراحله المخطط لها والفعلية.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-6 text-center min-h-[300px] flex flex-col justify-center items-center">
            <p className="text-2xl text-gray-500">
              ميزة الجدول الزمني التفاعلي قيد التطوير حاليًا.
            </p>
            <p className="text-gray-600">
              سيتم هنا عرض مخطط جانت أو ما شابه لتتبع مراحل المشروع.
            </p>
            <div data-ai-hint="gantt chart placeholder" className="w-full max-w-md h-64 bg-gray-200 rounded-lg flex justify-center items-center text-gray-400">
              [مساحة مخصصة للجدول الزمني]
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
