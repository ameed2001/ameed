import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-2xl mx-auto bg-white/90 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-app-red text-center">اتصل بنا</CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-700 space-y-8 text-right">
            <p className="text-center">
              نحن هنا لمساعدتك والإجابة على استفساراتك. يمكنك التواصل معنا عبر الوسائل التالية:
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-end gap-4">
                <a href="mailto:info@proqscpm.com" className="hover:text-app-gold transition-colors">info@proqscpm.com</a>
                <Mail className="text-app-red" size={28} />
              </div>
              <div className="flex items-center justify-end gap-4">
                <span>+970 123 456789</span>
                <Phone className="text-app-red" size={28} />
              </div>
              <div className="flex items-center justify-end gap-4">
                <span>جامعة فلسطين التقنية - خضوري، طولكرم، فلسطين</span>
                <MapPin className="text-app-red" size={28} />
              </div>
            </div>

            <p className="text-center mt-8 pt-6 border-t border-gray-300">
              يمكنك أيضًا متابعتنا على وسائل التواصل الاجتماعي الموجودة في رأس الصفحة.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
