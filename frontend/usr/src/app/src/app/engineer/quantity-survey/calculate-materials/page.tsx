"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Calculator, PlusCircle, Trash2, Box, Info } from 'lucide-react';

interface Element {
  id: string;
  type: string;
  name: string;
  length: number;
  width: number;
  height: number;
  volume: number;
}

const elementTypes = ["قاعدة", "عمود", "جسر", "بلاطة", "جدار استنادي"];

export default function CalculateMaterialsPage() {
  const { toast } = useToast();
  const [elements, setElements] = useState<Element[]>([]);
  
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<Omit<Element, 'id' | 'volume'>>({
    defaultValues: { type: "قاعدة", name: "", length: 0, width: 0, height: 0 }
  });

  const onSubmit: SubmitHandler<Omit<Element, 'id' | 'volume'>> = (data) => {
    const { type, name, length, width, height } = data;
    if (length <= 0 || width <= 0 || height <= 0) {
      toast({ title: "خطأ", description: "يجب أن تكون جميع الأبعاد أكبر من صفر.", variant: "destructive" });
      return;
    }
    const volume = length * width * height;
    const newElement: Element = {
      id: crypto.randomUUID(),
      type,
      name: name || `${type} ${elements.length + 1}`,
      length,
      width,
      height,
      volume
    };
    setElements(prev => [...prev, newElement]);
    reset();
  };

  const removeElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
  };

  const totalVolume = elements.reduce((acc, el) => acc + el.volume, 0);
  // Assuming standard ratios for materials in 1 cubic meter of concrete
  const totalCement = totalVolume * 7; // bags
  const totalSand = totalVolume * 0.5; // m³
  const totalGravel = totalVolume * 1; // m³

  return (
    <div className="container mx-auto py-10 px-4 text-right">
      <Card className="max-w-4xl mx-auto bg-white/95 shadow-xl">
        <CardHeader className="text-center">
          <Calculator className="mx-auto h-16 w-16 text-app-gold mb-3" />
          <CardTitle className="text-3xl font-bold text-app-red">حساب كميات المواد</CardTitle>
          <CardDescription className="text-gray-600 mt-2 text-base">
            أضف العناصر الإنشائية لمشروعك لحساب الكميات الإجمالية للمواد الأساسية.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <Card className="bg-gray-50 border-gray-200 shadow-inner">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">إضافة عنصر إنشائي جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="type">نوع العنصر</Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value} dir="rtl">
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {elementTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="name">اسم/وصف العنصر (اختياري)</Label>
                    <Input id="name" {...register("name")} placeholder="مثال: عمود الزاوية الشمالية" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="length">الطول (م)</Label>
                    <Input id="length" type="number" step="0.01" {...register("length", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="width">العرض (م)</Label>
                    <Input id="width" type="number" step="0.01" {...register("width", { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label htmlFor="height">الارتفاع/السماكة (م)</Label>
                    <Input id="height" type="number" step="0.01" {...register("height", { valueAsNumber: true })} />
                  </div>
                </div>
                <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <PlusCircle className="ms-2 h-5 w-5" /> إضافة إلى القائمة
                </Button>
              </form>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">قائمة العناصر المضافة</h3>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-right">نوع العنصر</TableHead>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">الحجم (م³)</TableHead>
                    <TableHead className="text-center">إجراء</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elements.length > 0 ? elements.map(el => (
                    <TableRow key={el.id}>
                      <TableCell className="font-medium">{el.type}</TableCell>
                      <TableCell>{el.name}</TableCell>
                      <TableCell>{el.volume.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" onClick={() => removeElement(el.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                        لم تتم إضافة أي عناصر بعد.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {elements.length > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">ملخص الكميات الإجمالية</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="text-sm font-medium text-gray-500">إجمالي حجم الباطون</p>
                  <p className="text-2xl font-bold text-green-700">{totalVolume.toFixed(2)} <span className="text-base">م³</span></p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="text-sm font-medium text-gray-500">إسمنت (تقريبي)</p>
                  <p className="text-2xl font-bold text-green-700">{totalCement.toFixed(1)} <span className="text-base">كيس</span></p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <p className="text-sm font-medium text-gray-500">رمل (تقريبي)</p>
                  <p className="text-2xl font-bold text-green-700">{totalSand.toFixed(2)} <span className="text-base">م³</span></p>
                </div>
                 <div className="p-4 bg-white rounded-lg shadow">
                  <p className="text-sm font-medium text-gray-500">حصمة (تقريبي)</p>
                  <p className="text-2xl font-bold text-green-700">{totalGravel.toFixed(2)} <span className="text-base">م³</span></p>
                </div>
              </CardContent>
              <CardContent>
                 <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 p-3 rounded-md">
                    <Info size={16}/>
                    <span>هذه الأرقام تقريبية وتعتمد على نسب خلط قياسية. حساب كميات الحديد يتطلب تفاصيل تسليح إضافية.</span>
                </div>
              </CardContent>
            </Card>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
