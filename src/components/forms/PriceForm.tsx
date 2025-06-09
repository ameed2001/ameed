
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle, ShoppingCart, Loader2, Save, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveEstimation, getMaterials, getSavedEstimations, type MaterialConfig, type CalculatedItem, type SavedEstimation, type EstimationToSave } from '@/lib/api/material-api';

const PriceForm = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<MaterialConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [calculatedItems, setCalculatedItems] = useState<CalculatedItem[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [estimationName, setEstimationName] = useState('');
  const [savedEstimations, setSavedEstimations] = useState<SavedEstimation[]>([]);
  const [showSavedEstimations, setShowSavedEstimations] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  const currentMaterial = materials.find(m => m.id === selectedMaterialId);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getMaterials();
        setMaterials(data);
      } catch (error) {
        toast({
          title: "خطأ في تحميل البيانات",
          description: "تعذر تحميل قائمة المواد من السيرفر",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleMaterialChange = (value: string) => {
    setSelectedMaterialId(value);
    const material = materials.find(m => m.id === value);
    if (material) {
      setPrice(material.averagePrice.toString());
      setQuantity('');
      setDescription('');
    }
    setErrorMessages([]);
  };

  const handleAddItemToList = async () => {
    setErrorMessages([]);
    if (!currentMaterial) {
      setErrorMessages(["يرجى اختيار نوع المادة أولاً."]);
      return;
    }

    const q = parseFloat(quantity);
    const p = parseFloat(price);

    let currentErrors: string[] = [];

    if (isNaN(q) || q <= 0) {
      currentErrors.push(`الكمية يجب أن تكون رقمًا أكبر من صفر.`);
    }
    if (isNaN(p) || p < 0) {
      currentErrors.push(`السعر يجب أن يكون رقمًا صالحًا (0 أو أكثر).`);
    }
    
    if (currentErrors.length > 0) {
      setErrorMessages(currentErrors);
      return;
    }

    const newItem: CalculatedItem = {
      id: crypto.randomUUID(),
      materialId: currentMaterial.id,
      materialName: currentMaterial.name,
      quantity: q,
      unit: currentMaterial.unit,
      pricePerUnit: p,
      description: currentMaterial.requiresDescription ? description : undefined,
      totalCost: parseFloat((q * p).toFixed(2)),
    };

    setCalculatedItems(prev => [...prev, newItem]);
    
    setQuantity('');
    setDescription('');
    if (currentMaterial) {
      setPrice(currentMaterial.averagePrice.toString()); // Reset price to default for selected material
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCalculatedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClearAll = () => {
    setSelectedMaterialId('');
    setQuantity('');
    setPrice('');
    setDescription('');
    setCalculatedItems([]);
    setErrorMessages([]);
    setEstimationName('');
  };

  const handleSaveEstimation = async () => {
    if (calculatedItems.length === 0) {
      toast({
        title: "لا يمكن حفظ التقدير",
        description: "القائمة فارغة، يرجى إضافة مواد أولاً",
        variant: "destructive",
      });
      return;
    }

    if (!estimationName.trim()) {
      toast({
        title: "اسم التقدير مطلوب",
        description: "يرجى إدخال اسم للتقدير قبل الحفظ",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      const estimationToSave: EstimationToSave = {
        name: estimationName,
        items: calculatedItems,
        total: grandTotal
      };
      const savedEstimationData = await saveEstimation(estimationToSave);

      toast({
        title: "تم الحفظ بنجاح",
        description: `تم حفظ التقدير "${estimationName}"`,
      });

      setEstimationName('');
      setSavedEstimations(prev => [savedEstimationData, ...prev]);
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "تعذر حفظ التقدير على السيرفر",
        variant: "destructive",
      });
    } finally {
        setIsSaving(false);
    }
  };

  const handleLoadSavedEstimations = async () => {
    setIsLoadingSaved(true);
    setShowSavedEstimations(true); // Show panel immediately with loader
    try {
      const estimations = await getSavedEstimations();
      setSavedEstimations(estimations);
    } catch (error) {
      toast({
        title: "خطأ في التحميل",
        description: "تعذر تحميل التقديرات المحفوظة",
        variant: "destructive",
      });
      setShowSavedEstimations(false); // Hide panel on error
    } finally {
        setIsLoadingSaved(false);
    }
  };

  const handleApplySavedEstimation = (estimation: SavedEstimation) => {
    setCalculatedItems(estimation.items);
    setEstimationName(estimation.name); // Also load the name
    setShowSavedEstimations(false);
    toast({
      title: "تم التحميل",
      description: `تم تحميل التقدير "${estimation.name}"`,
    });
  };

  const grandTotal = calculatedItems.reduce((sum, item) => sum + item.totalCost, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-app-red" />
        <p className="mr-3 text-lg">جاري تحميل بيانات المواد...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-0">
      <div className="lg:col-span-2">
        <Card className="bg-white shadow-xl border-0 rounded-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <ShoppingCart className="h-10 w-10 text-app-red" />
              <div>
                <CardTitle className="text-app-red text-3xl font-bold">حاسبة أسعار مواد البناء</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  احسب تكاليف مواد مشروعك بدقة وسهولة، واحفظ تقديراتك.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-4 md:px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="materialSelect" className="block mb-1.5 font-semibold text-gray-700">اختر المادة:</Label>
                <Select value={selectedMaterialId} onValueChange={handleMaterialChange} dir="rtl">
                  <SelectTrigger id="materialSelect" className="w-full bg-gray-50 border-gray-300 focus:border-app-gold text-right text-base">
                    <SelectValue placeholder="اختر المادة..." />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.length === 0 && <SelectItem value="loading" disabled>جاري تحميل المواد...</SelectItem>}
                    {materials.map(material => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} (وحدة: {material.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentMaterial && (
                <>
                  <div>
                    <Label htmlFor="quantity" className="block mb-1.5 font-semibold text-gray-700">الكمية ({currentMaterial.unit}):</Label>
                    <Input
                      id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                      step="any" placeholder={`أدخل الكمية`} className="bg-gray-50 focus:border-app-gold text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price" className="block mb-1.5 font-semibold text-gray-700">السعر للوحدة (شيكل):</Label>
                    <Input
                      id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                      step="any" placeholder="أدخل السعر" className="bg-gray-50 focus:border-app-gold text-base"
                    />
                  </div>

                  {currentMaterial.requiresDescription && (
                    <div className="md:col-span-2">
                      <Label htmlFor="description" className="block mb-1.5 font-semibold text-gray-700">وصف إضافي للمادة:</Label>
                      <Input
                        id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                        placeholder="مثال: سلك ربط 2 مم، مسمار خشب 5 سم" className="bg-gray-50 focus:border-app-gold text-base"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {errorMessages.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm space-y-1">
                {errorMessages.map((msg, i) => ( <p key={i}>• {msg}</p> ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                onClick={handleAddItemToList}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 text-base"
                disabled={!selectedMaterialId || isLoading}
              >
                <PlusCircle className="ml-2 h-5 w-5" /> إضافة للقائمة
              </Button>
              
              <Button
                onClick={handleClearAll} variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 font-semibold py-2.5 px-5 text-base"
                disabled={isLoading}
              >
                <Trash2 className="ml-2 h-5 w-5" /> مسح الكل
              </Button>
              
              <Button
                onClick={handleLoadSavedEstimations} variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 font-semibold py-2.5 px-5 text-base"
                disabled={isLoadingSaved || isLoading}
              >
                {isLoadingSaved ? <Loader2 className="ml-2 h-5 w-5 animate-spin"/> : <Download className="ml-2 h-5 w-5" />}
                {showSavedEstimations ? "إخفاء المحفوظات" : "عرض المحفوظات"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        {showSavedEstimations && (
          <Card className="border-blue-300 shadow-md rounded-lg">
            <CardHeader className="bg-blue-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle className="text-blue-700 text-xl">التقديرات المحفوظة</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => setShowSavedEstimations(false)} className="text-blue-600 hover:bg-blue-100">
                  إغلاق
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {isLoadingSaved ? (
                <div className="flex justify-center items-center py-6">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                    <p className="mr-2 text-blue-600">جاري تحميل التقديرات...</p>
                </div>
              ) : savedEstimations.length === 0 ? (
                <p className="text-gray-500 text-center py-6">لا توجد تقديرات محفوظة بعد.</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {savedEstimations.map(estimation => (
                    <div
                      key={estimation.id}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-colors"
                      onClick={() => handleApplySavedEstimation(estimation)}
                      title="اضغط لتحميل هذا التقدير"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-blue-800">{estimation.name}</h4>
                        <span className="text-xs text-blue-600">
                          {new Date(estimation.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {estimation.items.length} مادة  •  إجمالي: {estimation.total.toFixed(2)} شيكل
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-green-300 shadow-md rounded-lg">
          <CardHeader className="bg-green-50 rounded-t-lg">
            <CardTitle className="text-green-700 text-xl">التقدير الحالي للمواد</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="estimationName" className="block mb-1.5 font-semibold text-gray-700">اسم هذا التقدير ( للحفظ ):</Label>
              <Input
                id="estimationName" type="text" value={estimationName} onChange={(e) => setEstimationName(e.target.value)}
                placeholder="مثال: تقدير فيلا الطابق الأول" className="bg-gray-50 focus:border-app-gold text-base"
              />
            </div>

            {calculatedItems.length > 0 ? (
              <>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {calculatedItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{item.materialName}</p>
                        {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                        <p className="text-sm text-gray-600 mt-0.5">
                          {item.quantity} {item.unit} × {item.pricePerUnit.toFixed(2)} شيكل/وحدة
                        </p>
                      </div>
                      <div className="text-left flex flex-col items-end ml-2 flex-shrink-0">
                        <span className="font-bold text-green-600 whitespace-nowrap">
                          {item.totalCost.toFixed(2)} شيكل
                        </span>
                        <Button
                          variant="ghost" size="sm" className="text-red-500 hover:text-red-700 h-7 w-7 p-0 mt-1"
                          onClick={() => handleRemoveItem(item.id)} title="حذف المادة"
                        > <Trash2 size={15} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold text-gray-700">المجموع الكلي:</span>
                    <span className="text-2xl font-bold text-green-700">
                      {grandTotal.toFixed(2)} شيكل
                    </span>
                  </div>

                  <Button
                    onClick={handleSaveEstimation}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 text-base"
                    disabled={isSaving || calculatedItems.length === 0 || !estimationName.trim()}
                  >
                    {isSaving ? <Loader2 className="ml-2 h-5 w-5 animate-spin"/> : <Save className="ml-2 h-5 w-5" />}
                    {isSaving ? 'جاري الحفظ...' : 'حفظ هذا التقدير'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <ShoppingCart className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                <p className="font-medium">قائمة المواد فارغة حالياً</p>
                <p className="text-sm mt-1">قم بإضافة مواد من النموذج أعلاه لبدء التقدير.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PriceForm;

    