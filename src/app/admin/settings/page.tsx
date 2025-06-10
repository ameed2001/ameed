
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { getSystemSettings, updateSystemSettings, type SystemSettingsDocument } from '@/lib/db'; 


export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettingsDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      setIsFetching(true);
      try {
        const fetchedSettings = await getSystemSettings();
        if (fetchedSettings) {
          setSettings(fetchedSettings);
        } else {
           toast({ title: "خطأ", description: "فشل تحميل إعدادات النظام.", variant: "destructive" });
        }
      } catch (error) {
         toast({ title: "خطأ فادح", description: "حدث خطأ أثناء تحميل الإعدادات.", variant: "destructive" });
         console.error("Error fetching settings:", error);
      }
      setIsFetching(false);
    }
    fetchSettings();
  }, [toast]);


  const handleChange = (field: keyof SystemSettingsDocument, value: string | number | boolean) => {
    setSettings(prev => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSaveSettings = async (event: FormEvent) => {
    event.preventDefault();
    if (!settings) {
      toast({ title: "خطأ", description: "لا توجد إعدادات لحفظها.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    
    const result = await updateSystemSettings(settings);
    
    if (result.success) {
        toast({
            title: "تم حفظ الإعدادات",
            description: result.message || "تم تحديث إعدادات النظام بنجاح.",
            variant: "default",
        });
        // Optionally re-fetch settings if there's a chance they were modified server-side
        // For now, we assume the local state is the source of truth until next fetch.
    } else {
        toast({
            title: "خطأ في الحفظ",
            description: result.message || "فشل تحديث إعدادات النظام.",
            variant: "destructive",
        });
    }
    setIsLoading(false);
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-app-gold" />
        <p className="ms-3 text-lg">جاري تحميل الإعدادات...</p>
      </div>
    );
  }

  if (!settings) {
     return <div className="text-center text-red-500">فشل تحميل الإعدادات. يرجى المحاولة مرة أخرى.</div>;
  }


  return (
    <Card className="bg-white/95 shadow-xl w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <SettingsIcon className="mx-auto h-12 w-12 text-app-gold mb-3" />
        <CardTitle className="text-3xl font-bold text-app-red">إعدادات النظام</CardTitle>
        <CardDescription className="text-gray-600">تكوين الإعدادات العامة والمعلمات الخاصة بالنظام.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveSettings} className="space-y-6 text-right">
          <div>
            <Label htmlFor="siteName" className="block mb-1.5 font-semibold text-gray-700">اسم الموقع</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => handleChange('siteName', e.target.value)}
              className="bg-white focus:border-app-gold"
            />
          </div>

          <div>
            <Label htmlFor="defaultLanguage" className="block mb-1.5 font-semibold text-gray-700">اللغة الافتراضية</Label>
            <Select
              value={settings.defaultLanguage}
              onValueChange={(value) => handleChange('defaultLanguage', value)}
              dir="rtl"
            >
              <SelectTrigger className="w-full bg-white focus:border-app-gold text-right">
                <SelectValue placeholder="اختر لغة..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
            <Label htmlFor="maintenanceMode" className="font-semibold text-gray-700">وضع الصيانة</Label>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
              dir="rtl"
            />
          </div>
          
          <div>
            <Label htmlFor="maxUploadSizeMB" className="block mb-1.5 font-semibold text-gray-700">الحد الأقصى لحجم رفع الملفات (MB)</Label>
            <Input
              id="maxUploadSizeMB"
              type="number"
              value={settings.maxUploadSizeMB}
              onChange={(e) => handleChange('maxUploadSizeMB', parseInt(e.target.value, 10))}
              className="bg-white focus:border-app-gold"
            />
          </div>

           <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
            <Label htmlFor="emailNotificationsEnabled" className="font-semibold text-gray-700">تفعيل إشعارات البريد الإلكتروني</Label>
            <Switch
              id="emailNotificationsEnabled"
              checked={settings.emailNotificationsEnabled}
              onCheckedChange={(checked) => handleChange('emailNotificationsEnabled', checked)}
              dir="rtl"
            />
          </div>
          
           <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
            <Label htmlFor="engineerApprovalRequired" className="font-semibold text-gray-700">تفعيل موافقة المهندس</Label>
            <Switch
              id="engineerApprovalRequired"
              checked={settings.engineerApprovalRequired}
              onCheckedChange={(checked) => handleChange('engineerApprovalRequired', checked)}
              dir="rtl"
            />
          </div>


          <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold py-3 text-lg" disabled={isLoading}>
            {isLoading ? (
                <>
                 <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                 جاري الحفظ...
                </>
            ) : (
                <>
                 <Save className="ms-2 h-5 w-5" />
                 حفظ الإعدادات
                </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
    
