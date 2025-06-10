import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Percent } from 'lucide-react'; // Example icons
import { useEffect, useState } from 'react';

// Define a type for the project data (placeholder)
interface ProjectDetails {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'Archived';
  location: string;
  completionPercentage: number;
  // Add other project details here
}

// Placeholder components for tabs
const QuantitiesTabContent = () => {
  // Fetch and display quantities data here
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">تقارير الكميات</h3>
      <p className="text-gray-600">عرض تقارير الكميات الموجزة للمشروع هنا.</p>
      {/* Table or list for quantities */}
    </div>
  );
};

const MediaTabContent = () => {
  // Fetch and display media (images/videos) here
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">صور وفيديوهات التقدم</h3>
      <p className="text-gray-600">معاينة الصور ومقاطع الفيديو المتعلقة بتقدم المشروع هنا.</p>
      {/* Gallery or list of media */}
    </div>
  );
};

const CommentsTabContent = () => {
  // Fetch and display comments/inquiries here
  // Include a form to add new comments
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">التعليقات والاستفسارات</h3>
      <p className="text-gray-600">عرض التعليقات وإرسال استفسارات جديدة هنا.</p>
      {/* List of comments and a comment form */}
    </div>
  );
};


export default function OwnerProjectDetailsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project data based on projectId
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      // In a real application, you would fetch data from your API
      // Example placeholder data
      const fetchedProject: ProjectDetails = {
        id: projectId,
        name: `مشروع رقم ${projectId}`,
        status: 'Active', // or 'Completed', 'Archived'
        location: 'الرياض، حي النرجس',
        completionPercentage: Math.floor(Math.random() * 100), // Random for demo
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (fetchedProject) {
        setProject(fetchedProject);
      } else {
        setError("تعذر تحميل تفاصيل المشروع.");
      }
      setLoading(false);
    };

    if (projectId) {
      fetchProject();
    }

  }, [projectId]); // Re-run effect if projectId changes

  if (loading) {
    return <div className="text-center py-8">جاري تحميل تفاصيل المشروع...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">خطأ: {error}</div>;
  }

  if (!project) {
      return <div className="text-center py-8 text-gray-500">لم يتم العثور على المشروع.</div>;
  }


  return (
    <div className="container mx-auto py-8 px-4 text-right">
      <Card className="bg-white/95 shadow-xl w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-app-red flex items-center justify-between">
             <span>{project.name}</span>
             {/* Add Back button or link here if needed */}
          </CardTitle>
          <CardDescription className="text-gray-600 flex items-center gap-4 mt-2">
             <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-gray-500" /> {project.location}</span>
             <span className="flex items-center gap-1">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    project.status === 'Active' ? 'bg-green-100 text-green-700' :
                    project.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                    project.status === 'Archived' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                }`}>
                  {project.status === 'Active' ? 'نشط' : project.status === 'Completed' ? 'مكتمل' : project.status === 'Archived' ? 'مؤرشف' : 'حالة غير معروفة'}
                </span>
             </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

           {/* Overall Completion Percentage */}
           <div className="flex items-center gap-4">
                <Percent className="h-6 w-6 text-app-gold" />
                <div className="flex-grow">
                    <Label className="block mb-2 text-lg font-semibold">نسبة الإنجاز الإجمالية:</Label>
                    <Progress value={project.completionPercentage} className="w-full h-3" />
                    <div className="text-center mt-1 text-sm font-medium">{project.completionPercentage}%</div>
                </div>
           </div>
           <Separator />

           {/* Timeline Section */}
           <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><CalendarDays className="h-6 w-6 text-app-gold" /> الجدول الزمني</h3>
              {/* Placeholder for Timeline/Gantt Chart component */}
              <div className="bg-gray-100 p-6 rounded-lg text-gray-600 italic text-center">
                 عرض مخطط الجدول الزمني (Timeline/Gantt Chart) هنا.
              </div>
           </div>
           <Separator />

           {/* Tabs for Quantities, Media, Comments */}
           <Tabs defaultValue="quantities" className="w-full">
             <TabsList className="grid w-full grid-cols-3">
               <TabsTrigger value="quantities" className="data-[state=active]:bg-app-red data-[state=active]:text-white">الكميات</TabsTrigger>
               <TabsTrigger value="media" className="data-[state=active]:bg-app-red data-[state=active]:text-white">الوسائط</TabsTrigger>
               <TabsTrigger value="comments" className="data-[state=active]:bg-app-red data-[state=active]:text-white">التعليقات</TabsTrigger>
             </TabsList>
             <TabsContent value="quantities">
               <Card className="mt-4">
                 <CardContent>
                   <QuantitiesTabContent />
                 </CardContent>
               </Card>
             </TabsContent>
             <TabsContent value="media">
                <Card className="mt-4">
                 <CardContent>
                    <MediaTabContent />
                 </CardContent>
               </Card>
             </TabsContent>
             <TabsContent value="comments">
                <Card className="mt-4">
                 <CardContent>
                    <CommentsTabContent />
                 </CardContent>
               </Card>
             </TabsContent>
           </Tabs>

        </CardContent>
      </Card>
    </div>
  );
}

// Add a Label component (assuming you have one or need to define it)
const Label = ({ children, htmlFor, className = '' }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
    <label htmlFor={htmlFor} className={`block font-semibold text-gray-700 ${className}`}>
        {children}
    </label>
);