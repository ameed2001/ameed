
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Settings as SettingsIcon } from 'lucide-react';

// Mock settings - in a real app, these would be fetched and updated
interface SystemSettings {
  siteName: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maxUploadSizeMB: number;
  emailNotificationsEnabled: boolean;
}

const initialSettings: SystemSettings = {
  siteName: "المحترف لحساب الكميات",
  defaultLanguage: "ar",
  maintenanceMode: false,
  maxUploadSizeMB: 50,
  emailNotificationsEnabled: true,
};

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof SystemSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    console.log("Saving settings (simulation):", settings);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث إعدادات النظام بنجاح (محاكاة).",
    });
    setIsLoading(false);
  };

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

          <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold py-3 text-lg" disabled={isLoading}>
            {isLoading ? (
                <>
                 <Save className="ms-2 h-5 w-5 animate-spin" />
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
