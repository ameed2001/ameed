
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Eye } from "lucide-react";

interface Project {
  id: string;
  name: string;
  status: 'مكتمل' | 'قيد التنفيذ' | 'مخطط له';
  description: string;
  imageUrl?: string;
}

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'مشروع بناء فيلا النرجس',
    status: 'قيد التنفيذ',
    description: 'فيلا سكنية فاخرة مكونة من طابقين وحديقة واسعة في حي النرجس.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '2',
    name: 'تطوير مجمع الياسمين السكني',
    status: 'مكتمل',
    description: 'تطوير شامل لمجمع سكني يضم 5 مباني و مرافق ترفيهية.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '3',
    name: 'إنشاء برج الأندلس التجاري',
    status: 'مخطط له',
    description: 'برج تجاري متعدد الاستخدامات بارتفاع 20 طابقًا في قلب المدينة.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

export default function MyProjectsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="text-center mb-10">
          <Briefcase className="mx-auto h-16 w-16 text-app-gold mb-4" />
          <h1 className="text-4xl font-bold text-app-red">مشاريعي</h1>
          <p className="text-lg text-gray-600 mt-2">نظرة عامة على جميع مشاريعك الإنشائية.</p>
        </div>

        {mockProjects.length === 0 ? (
          <Card className="max-w-2xl mx-auto bg-white/90 shadow-lg">
            <CardContent className="text-center py-10">
              <p className="text-xl text-gray-700">لا توجد لديك مشاريع حالياً.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProjects.map((project) => (
              <Card key={project.id} className="bg-white/95 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col text-right">
                {project.imageUrl && (
                  <div className="relative h-48 w-full">
                    <img 
                        src={project.imageUrl} 
                        alt={project.name} 
                        className="object-cover w-full h-full rounded-t-lg"
                        data-ai-hint="building construction"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-app-red">{project.name}</CardTitle>
                  <CardDescription className={`text-sm font-semibold mt-1 ${
                    project.status === 'مكتمل' ? 'text-green-600' :
                    project.status === 'قيد التنفيذ' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    الحالة: {project.status}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-app-gold hover:bg-yellow-600 text-primary-foreground font-semibold">
                    <Link href={`/my-projects/${project.id}`}>
                      <Eye className="ms-2 h-5 w-5" />
                      عرض التفاصيل
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
