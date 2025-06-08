import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FolderArchive } from "lucide-react";

export default function DocumentsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto bg-white/90 shadow-lg">
          <CardHeader className="text-center">
            <FolderArchive className="mx-auto h-16 w-16 text-app-gold mb-4" />
            <CardTitle className="text-3xl font-bold text-app-red">إدارة المستندات</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              مكان مركزي لإدارة جميع مستندات المشروع مثل المخططات، العقود، والفواتير.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-6 text-center min-h-[300px] flex flex-col justify-center items-center">
            <p className="text-2xl text-gray-500">
              ميزة إدارة المستندات قيد التطوير حاليًا.
            </p>
            <p className="text-gray-600">
              سيتم هنا توفير أدوات لرفع، تنظيم، ومشاركة مستندات المشروع.
            </p>
            <div data-ai-hint="document list placeholder" className="w-full max-w-md h-64 bg-gray-200 rounded-lg flex justify-center items-center text-gray-400">
              [مساحة مخصصة لقائمة المستندات]
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
