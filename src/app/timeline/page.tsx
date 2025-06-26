
"use client";

import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GanttChartSquare, CalendarDays, Palette, CheckCircle2 } from "lucide-react"; // Added more icons
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TimelineTask {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  color: string; // Tailwind bg color class e.g., 'bg-blue-500'
  status: 'completed' | 'in-progress' | 'planned';
}

// Sample data for the timeline
const sampleTasks: TimelineTask[] = [
  { id: '1', name: "مرحلة التخطيط والتصميم", startDate: "2024-01-01", endDate: "2024-01-31", color: "bg-sky-500", status: 'completed' },
  { id: '2', name: "أعمال الحفر والأساسات", startDate: "2024-02-01", endDate: "2024-03-15", color: "bg-amber-500", status: 'completed' },
  { id: '3', name: "إنشاء الهيكل الخرساني", startDate: "2024-03-16", endDate: "2024-05-30", color: "bg-red-500", status: 'in-progress' },
  { id: '4', name: "أعمال التشطيبات الأولية", startDate: "2024-06-01", endDate: "2024-07-31", color: "bg-green-500", status: 'planned' },
  { id: '5', name: "التشطيبات النهائية والتسليم", startDate: "2024-08-01", endDate: "2024-08-31", color: "bg-purple-500", status: 'planned' },
];

// Calculate the total duration of the project in days for scaling
const projectStartDate = new Date(Math.min(...sampleTasks.map(task => new Date(task.startDate).getTime())));
const projectEndDate = new Date(Math.max(...sampleTasks.map(task => new Date(task.endDate).getTime())));
const totalProjectDurationDays = Math.ceil((projectEndDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 30; // Add some padding

const getTaskPositionAndWidth = (task: TimelineTask) => {
  const taskStart = new Date(task.startDate);
  const taskEnd = new Date(task.endDate);
  
  const offsetDays = Math.ceil((taskStart.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const durationDays = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const leftPercentage = (offsetDays / totalProjectDurationDays) * 100;
  const widthPercentage = (durationDays / totalProjectDurationDays) * 100;

  return {
    left: `${Math.max(0, leftPercentage)}%`,
    width: `${Math.max(2, widthPercentage)}%`, // Ensure minimum width for visibility
  };
};


export default function TimelinePage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-6xl mx-auto bg-white/95 shadow-xl">
          <CardHeader className="text-center">
            <GanttChartSquare className="mx-auto h-16 w-16 text-app-gold mb-4" />
            <CardTitle className="text-3xl font-bold text-app-red">الجدول الزمني التفاعلي للمشروع</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              عرض مرئي لتقدم المشروع ومراحله المخطط لها والفعلية.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-700 space-y-8 px-2 md:px-6 py-6">
            
            <div className="mb-8 p-4 border border-dashed border-app-gold/50 rounded-lg bg-app-gold/5 text-right">
                <h4 className="text-lg font-semibold text-app-red mb-2">ملاحظة:</h4>
                <p className="text-sm">هذا عرض توضيحي للجدول الزمني. لعرض الجدول الزمني الخاص بمشاريعك، يرجى <Link href="/login" className="font-bold text-blue-600 hover:underline">تسجيل الدخول</Link> والانتقال إلى صفحة تفاصيل المشروع.</p>
            </div>

            {/* Timeline Legend */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-6 pb-4 border-b border-gray-300 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-gray-500"/>
                    <span>لون المهمة</span>
                </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600"/>
                    <span>مكتمل</span>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse"></div>
                    <span>قيد التنفيذ</span>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-blue-600"/>
                    <span>مخطط له</span>
                </div>
            </div>

            {/* Basic Timeline Visualization */}
            <div className="space-y-5 relative overflow-x-auto p-1 pb-4 min-h-[300px] bg-gray-50 rounded-lg shadow-inner">
              {/* Timeline Background Grid (Optional) - Months */}
              <div className="absolute inset-0 grid grid-cols-12 gap-0 pointer-events-none opacity-30">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={`month-grid-${i}`} className={cn("border-r border-gray-300", i === 11 && "border-r-0")}>
                    <span className="block p-1 text-xs text-gray-400 text-center">{new Date(projectStartDate.getFullYear(), projectStartDate.getMonth() + i).toLocaleString('ar', { month: 'short' })}</span>
                  </div>
                ))}
              </div>

              {sampleTasks.map((task, index) => {
                const { left, width } = getTaskPositionAndWidth(task);
                return (
                  <div key={task.id} className="relative h-16 flex items-center text-right pr-4" style={{ zIndex: index + 1 }}>
                    <div 
                      className={cn(
                        "absolute h-10 rounded-md shadow-md flex items-center justify-between px-3 text-white transition-all duration-300 ease-in-out hover:opacity-90",
                        task.color
                      )}
                      style={{ left, width, right: 'auto' }} // Ensure RTL works by setting left explicitly
                      title={`${task.name} (من ${task.startDate} إلى ${task.endDate})`}
                    >
                      <span className="text-xs sm:text-sm font-medium truncate">{task.name}</span>
                       {task.status === 'completed' && <CheckCircle2 size={18} className="text-white/80 shrink-0 ml-2"/>}
                       {task.status === 'in-progress' && <div className="h-3 w-3 rounded-full bg-white/70 animate-pulse shrink-0 ml-2"></div>}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {totalProjectDurationDays <= 30 && (
                 <p className="text-xs text-center text-gray-500 mt-4">
                    يتم عرض الجدول الزمني. قد تحتاج إلى التمرير أفقيًا لرؤية جميع المهام إذا كان نطاق المشروع واسعًا.
                 </p>
            )}

          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
