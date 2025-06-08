
"use client";

import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Eye, PlusSquare, Archive } from "lucide-react";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { dbProjects, type Project, updateProject as dbUpdateProject } from '@/lib/mock-db';


// Simulate logged-in user - replace with actual auth context in a real app
const MOCK_CURRENT_USER_ROLE: "Owner" | "Engineer" | "Admin" = "Owner"; 
const MOCK_CURRENT_USER_EMAIL: string = "owner@example.com"; 

export default function MyProjectsPage() {
  const { toast } = useToast();
  // Initialize component state with data from mock DB
  const [projects, setProjectsState] = useState<Project[]>(dbProjects);

  const refreshProjectsFromDb = () => setProjectsState([...dbProjects]);

  const handleArchiveProject = (projectId: string, projectName: string) => {
    if (dbUpdateProject(projectId, { status: 'مؤرشف' })) {
        refreshProjectsFromDb();
        toast({
          title: "أرشفة المشروع",
          description: `تم نقل المشروع "${projectName}" إلى الأرشيف بنجاح.`,
          variant: "default",
        });
    } else {
        toast({
          title: "خطأ",
          description: `فشل أرشفة المشروع "${projectName}".`,
          variant: "destructive",
        });
    }
  };
  
  let displayedActiveProjects: Project[];
  let displayedArchivedProjects: Project[];

  if (MOCK_CURRENT_USER_ROLE === "Owner") {
    displayedActiveProjects = projects.filter(p => p.linkedOwnerEmail === MOCK_CURRENT_USER_EMAIL && p.status !== 'مؤرشف');
    displayedArchivedProjects = projects.filter(p => p.linkedOwnerEmail === MOCK_CURRENT_USER_EMAIL && p.status === 'مؤرشف');
  } else { 
    displayedActiveProjects = projects.filter(p => p.status !== 'مؤرشف');
    displayedArchivedProjects = projects.filter(p => p.status === 'مؤرشف');
  }


  return (
    <AppLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <div className="text-center sm:text-right mb-6 sm:mb-0">
            <Briefcase className="mx-auto sm:mx-0 h-16 w-16 text-app-gold mb-4" />
            <h1 className="text-4xl font-bold text-app-red">مشاريعي</h1>
            <p className="text-lg text-gray-600 mt-2">
              {MOCK_CURRENT_USER_ROLE === "Owner" 
                ? "نظرة عامة على مشاريعك الإنشائية المرتبطة بحسابك."
                : "نظرة عامة على جميع مشاريعك الإنشائية."
              }
            </p>
          </div>
          {MOCK_CURRENT_USER_ROLE === "Engineer" && (
            <Button asChild className="bg-app-gold hover:bg-yellow-600 text-primary-foreground font-semibold py-3 px-6 text-lg">
              <Link href="/engineer/create-project">
                <PlusSquare className="ms-2 h-5 w-5" />
                إنشاء مشروع جديد
              </Link>
            </Button>
          )}
        </div>

        {(displayedActiveProjects.length === 0 && displayedArchivedProjects.length === 0) ? (
          <Card className="max-w-2xl mx-auto bg-white/90 shadow-lg">
            <CardContent className="text-center py-10">
              <p className="text-xl text-gray-700">
                {MOCK_CURRENT_USER_ROLE === "Owner" 
                  ? "لا توجد مشاريع مرتبطة بحسابك حالياً."
                  : "لا توجد لديك مشاريع حالياً."
                }
              </p>
              {MOCK_CURRENT_USER_ROLE === "Engineer" && (
                <p className="text-sm text-gray-500 mt-2">قم بإنشاء مشروع جديد للبدء.</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-app-red mb-6 text-right">المشاريع النشطة والحالية</h2>
            {displayedActiveProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {displayedActiveProjects.map((project) => (
                  <Card key={project.id} className="bg-white/95 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col text-right">
                    {project.photos && project.photos.length > 0 && project.photos[0].src && (
                      <div className="relative h-48 w-full">
                        <Image 
                            src={project.photos[0].src} 
                            alt={project.photos[0].alt || project.name} 
                            width={600}
                            height={400}
                            className="object-cover w-full h-full rounded-t-lg"
                            data-ai-hint={project.photos[0].dataAiHint || "building construction"}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-app-red">{project.name}</CardTitle>
                      <CardDescription className={`text-sm font-semibold mt-1 ${
                        project.status === 'مكتمل' ? 'text-green-600' :
                        project.status === 'قيد التنفيذ' ? 'text-yellow-600' :
                        project.status === 'مخطط له' ? 'text-blue-600' :
                        'text-gray-500' // for 'مؤرشف'
                      }`}>
                        الحالة: {project.status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-700 leading-relaxed">{project.description}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                      <Button asChild className="w-full bg-app-gold hover:bg-yellow-600 text-primary-foreground font-semibold">
                        <Link href={`/my-projects/${project.id}`}>
                          <Eye className="ms-2 h-5 w-5" />
                          عرض التفاصيل
                        </Link>
                      </Button>
                      {MOCK_CURRENT_USER_ROLE === "Engineer" && project.status !== 'مؤرشف' && (
                        <Button 
                          variant="outline" 
                          className="w-full border-app-red text-app-red hover:bg-app-red/10"
                          onClick={() => handleArchiveProject(project.id, project.name)}
                        >
                          <Archive className="ms-2 h-5 w-5" />
                          أرشفة المشروع
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-right mb-12">لا توجد مشاريع نشطة حالياً.</p>
            )}

            {displayedArchivedProjects.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-gray-700 mb-6 text-right">المشاريع المؤرشفة</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedArchivedProjects.map((project) => (
                    <Card key={project.id} className="bg-gray-100/80 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col text-right opacity-75">
                      {project.photos && project.photos.length > 0 && project.photos[0].src && (
                        <div className="relative h-48 w-full">
                          <Image 
                              src={project.photos[0].src} 
                              alt={project.photos[0].alt || project.name} 
                              width={600}
                              height={400}
                              className="object-cover w-full h-full rounded-t-lg filter grayscale"
                              data-ai-hint={project.photos[0].dataAiHint || "building construction"}
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-600">{project.name}</CardTitle>
                        <CardDescription className="text-sm font-semibold mt-1 text-gray-500">
                          الحالة: {project.status}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-gray-500 leading-relaxed">{project.description}</p>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button asChild variant="outline" className="w-full border-gray-400 text-gray-600 hover:bg-gray-200">
                          <Link href={`/my-projects/${project.id}`}>
                            <Eye className="ms-2 h-5 w-5" />
                            عرض التفاصيل
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
