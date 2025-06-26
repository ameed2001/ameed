
// src/app/owner/dashboard/page.tsx
"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Gauge, Briefcase, FileText, Camera, Clock, MessageSquare, DollarSign, ExternalLink, 
    Loader2, Hourglass, CheckCircle, FolderKanban, Wrench, Calculator, GanttChartSquare, ArrowLeft, UserCircle 
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { getProjects as dbGetProjects, type Project } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import InfoCard from '@/components/ui/InfoCard';

// StatCard component definition
interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  colorClass: string;
}

function StatCard({ title, value, icon, colorClass }: StatCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-right">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", colorClass.replace('text-', 'bg-') + '/10')}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="text-right">
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

const dashboardCards = [
    {
        title: "مشاريعي",
        description: "عرض كافة مشاريعك، متابعة التقدم، الصور، والتقارير.",
        icon: <Briefcase className="h-10 w-10 text-blue-600" />,
        href: "/owner/projects",
        dataAiHint: "owner projects list",
        iconWrapperClass: "bg-blue-100 dark:bg-blue-900/50",
    },
    {
        title: "الجداول الزمنية",
        description: "عرض الجداول الزمنية والمراحل المخطط لها لكل مشروع.",
        icon: <GanttChartSquare className="h-10 w-10 text-purple-600" />,
        href: "/owner/project-timeline",
        dataAiHint: "project timelines",
        iconWrapperClass: "bg-purple-100 dark:bg-purple-900/50",
    },
    {
        title: "حاسبة التكلفة التقديرية",
        description: "أداة بسيطة لتقدير تكاليف المواد لمساعدتك في التخطيط.",
        icon: <Calculator className="h-10 w-10 text-green-600" />,
        href: "/owner/cost-estimator",
        dataAiHint: "cost estimator tool",
        iconWrapperClass: "bg-green-100 dark:bg-green-900/50",
    },
    {
        title: "الملف الشخصي",
        description: "إدارة معلومات حسابك الشخصي وتغيير كلمة المرور.",
        icon: <UserCircle className="h-10 w-10 text-orange-600" />,
        href: "/profile",
        dataAiHint: "user profile management",
        iconWrapperClass: "bg-orange-100 dark:bg-orange-900/50",
    },
     {
        title: "تقارير الكميات",
        description: "عرض ملخصات وتقارير الكميات التي يعدها المهندس.",
        icon: <FileText className="h-10 w-10 text-cyan-600" />,
        href: "/owner/projects",
        dataAiHint: "quantity reports",
        iconWrapperClass: "bg-cyan-100 dark:bg-cyan-900/50",
    },
    {
        title: "أدوات أخرى",
        description: "اكتشف المزيد من الأدوات التي سيتم إضافتها مستقبلاً.",
        icon: <Wrench className="h-10 w-10 text-gray-600" />,
        href: "/owner/other-tools",
        dataAiHint: "more tools",
        iconWrapperClass: "bg-gray-100 dark:bg-gray-700",
    },
];

export default function OwnerDashboardPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail');
      setUserEmail(email);
    }
  }, []);
  
  useEffect(() => {
    async function fetchProjects() {
      if (!userEmail) {
           setIsLoading(false);
           return;
      }
      setIsLoading(true);
      try {
        const result = await dbGetProjects(userEmail);
        if (result.success && result.projects) {
          setProjects(result.projects);
        } else {
          toast({ title: "خطأ", description: result.message || "فشل تحميل المشاريع.", variant: "destructive" });
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects for owner dashboard:", error);
        toast({ title: "خطأ فادح", description: "حدث خطأ أثناء تحميل بيانات المشاريع.", variant: "destructive" });
        setProjects([]);
      }
      setIsLoading(false);
    }

    fetchProjects();
  }, [userEmail, toast]);

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === "قيد التنفيذ").length,
    completed: projects.filter(p => p.status === "مكتمل").length,
  };

  return (
    <div className="space-y-8 text-right">
      <Card className="bg-white/95 shadow-xl border-gray-200/80 mb-10 text-center">
        <CardHeader>
          <div className="flex justify-center items-center mb-3 gap-3">
             <Gauge className="h-12 w-12 text-app-gold" />
             <CardTitle className="text-3xl md:text-4xl font-bold text-app-red">
                لوحة تحكم المالك
             </CardTitle>
          </div>
          <CardDescription className="text-lg text-gray-700 mt-2">
            هذه هي لوحة التحكم المركزية الخاصة بك. راقب، أدر، وتابع جميع مشاريعك من هنا.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin text-app-gold" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="إجمالي المشاريع" value={stats.total} icon={<Briefcase className="h-5 w-5 text-blue-500" />} colorClass="text-blue-500" />
          <StatCard title="قيد التنفيذ" value={stats.inProgress} icon={<Hourglass className="h-5 w-5 text-amber-500" />} colorClass="text-amber-500" />
          <StatCard title="المشاريع المكتملة" value={stats.completed} icon={<CheckCircle className="h-5 w-5 text-green-500" />} colorClass="text-green-500" />
        </div>
      )}
      
      {/* Main dashboard cards restored */}
       <Card className="bg-white/95 shadow-lg">
        <CardHeader>
            <div className="text-right">
                <CardTitle className="text-2xl font-semibold text-gray-800">
                    أدوات ومهام رئيسية
                </CardTitle>
                <CardDescription className="text-gray-600">
                    وصول سريع إلى الأقسام والوظائف الأساسية.
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardCards.map((card) => (
                    <InfoCard 
                        key={card.title}
                        {...card}
                        cardHeightClass="h-auto min-h-[220px]"
                        applyFlipEffect={false}
                        className="text-right"
                    >
                         <Link href={card.href} className="block w-full h-full">
                           <div className="flex flex-col items-end h-full">
                             <div className={cn("p-4 rounded-full inline-flex items-center justify-center mb-4", card.iconWrapperClass)}>
                               {card.icon}
                             </div>
                             <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
                             <p className="text-sm text-muted-foreground flex-grow">{card.description}</p>
                             <Button variant="link" className="text-app-red mt-4 p-0">
                                الذهاب إلى القسم <ArrowLeft className="mr-2 h-4 w-4" />
                            </Button>
                           </div>
                         </Link>
                    </InfoCard>
                ))}
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
