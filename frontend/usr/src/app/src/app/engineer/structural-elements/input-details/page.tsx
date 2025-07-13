"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { PenSquare, Calculator, Box, CheckCircle } from 'lucide-react';

interface ElementDetails {
  name: string;
  length: number;
  width: number;
  height: number;
}

export default function InputDetailsPage() {
  const { toast } = useToast();
  const [calculationResult, setCalculationResult] = useState<{volume: number} | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ElementDetails>({
    defaultValues: { name: "", length: 0, width: 0, height: 0 }
  });

  const onSubmit: SubmitHandler<ElementDetails> = (data) => {
    const { length, width, height } = data;
    if (length <= 0 || width <= 0 || height <= 0) {
      toast({ title: "خطأ", description: "يجب أن تكون جميع الأبعاد أكبر من صفر.", variant: "destructive" });
      return;
    }
    const volume = length * width * height;
    setCalculationResult({ volume });
    toast({
      title: "تم الحساب بنجاح",
      description: `حجم العنصر "${data.name || 'غير مسمى'}" هو ${volume.toFixed(2)} متر مكعب.`
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 text-right">
      <Card className="max-w-2xl mx-auto bg-white/95 shadow-xl">
        <CardHeader className="text-center">
          <PenSquare className="mx-auto h-16 w-16 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">إدخال تفاصيل عنصر إنشائي</CardTitle>
          <CardDescription className="text-gray-600 mt-2 text-base">
            أدخل أبعاد عنصر إنشائي (مثل قاعدة، عمود، جسر) لحساب حجمه.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 bg-gray-50 rounded-lg border">
            <div>
              <Label htmlFor="name">اسم العنصر (اختياري)</Label>
              <Input id="name" {...register("name")} placeholder="مثال: قاعدة C1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length">الطول (م)</Label>
                <Input id="length" type="number" step="0.01" {...register("length", { valueAsNumber: true, required: "الحقل مطلوب" })} />
                 {errors.length && <p className="text-red-500 text-xs mt-1">{errors.length.message}</p>}
              </div>
              <div>
                <Label htmlFor="width">العرض (م)</Label>
                <Input id="width" type="number" step="0.01" {...register("width", { valueAsNumber: true, required: "الحقل مطلوب" })} />
                 {errors.width && <p className="text-red-500 text-xs mt-1">{errors.width.message}</p>}
              </div>
              <div>
                <Label htmlFor="height">الارتفاع/السماكة (م)</Label>
                <Input id="height" type="number" step="0.01" {...register("height", { valueAsNumber: true, required: "الحقل مطلوب" })} />
                {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" className="flex-grow bg-blue-600 hover:bg-blue-700">
                <Calculator className="ms-2 h-5 w-5" /> حساب الحجم
              </Button>
              <Button type="button" variant="outline" onClick={() => { reset(); setCalculationResult(null); }}>
                مسح الحقول
              </Button>
            </div>
          </form>

          {calculationResult && (
            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                <CheckCircle size={20} />
                نتائج الحساب
              </h3>
              <div className="mt-4 flex items-center justify-between text-xl">
                <span className="font-medium text-gray-700">حجم الباطون المطلوب:</span>
                <span className="font-bold text-green-700 flex items-center gap-2">
                  <Box size={24} />
                  {calculationResult.volume.toFixed(3)} متر مكعب
                </span>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
