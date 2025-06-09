
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle, ShoppingCart, Loader2, Save, Download, AlertCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  saveEstimation, 
  getMaterials, 
  getSavedEstimations, 
  type MaterialConfig, 
  type CalculatedItem, 
  type SavedEstimation,
  type EstimationToSave
} from '@/lib/api/material-api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertTitle, AlertDescription as UiAlertDescription } from '@/components/ui/alert'; // Renamed to avoid conflict

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

  const fetchMaterialsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMaterials();
      setMaterials(data);
    } catch (error) {
      toast({
        title: "خطأ في تحميل البيانات",
        description: "تعذر تحميل قائمة المواد. يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
      console.error("Error fetching materials:", error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMaterialsData();
  }, [fetchMaterialsData]);

  const handleMaterialChange = (value: string) => {
    setSelectedMaterialId(value);
    const material = materials.find(m => m.id === value);
    if (material) {
      setPrice(material.averagePrice.toString());
      setQuantity(''); // Reset quantity as well
      setDescription('');
    }
    setErrorMessages([]);
  };

  const handleAddItemToList = () => {
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
      description: currentMaterial.requiresDescription && description.trim() ? description.trim() : undefined,
      totalCost: parseFloat((q * p).toFixed(2)),
    };

    setCalculatedItems(prev => [newItem, ...prev]); // Add to beginning for visibility
    
    setQuantity('');
    setDescription('');
    if (currentMaterial) {
      setPrice(currentMaterial.averagePrice.toString()); 
    }
    setSelectedMaterialId(''); // Reset select after adding
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
        description: "القائمة فارغة، يرجى إضافة مواد أولاً.",
        variant: "destructive",
      });
      return;
    }

    if (!estimationName.trim()) {
      toast({
        title: "اسم التقدير مطلوب",
        description: "يرجى إدخال اسم للتقدير قبل الحفظ.",
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
        description: `تم حفظ التقدير "${estimationName}".`,
      });

      setEstimationName('');
      setSavedEstimations(prev => [savedEstimationData, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "تعذر حفظ التقدير. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      console.error("Error saving estimation:", error);
    } finally {
        setIsSaving(false);
    }
  };

  const handleToggleSavedEstimations = async () => {
    if (showSavedEstimations) {
      setShowSavedEstimations(false);
      return;
    }
    setIsLoadingSaved(true);
    setShowSavedEstimations(true);
    try {
      const estimations = await getSavedEstimations();
      setSavedEstimations(estimations); // They are already sorted by API mock
    } catch (error) {
      toast({
        title: "خطأ في التحميل",
        description: "تعذر تحميل التقديرات المحفوظة.",
        variant: "destructive",
      });
      console.error("Error loading saved estimations:", error);
      setShowSavedEstimations(false); 
    } finally {
        setIsLoadingSaved(false);
    }
  };

  const handleApplySavedEstimation = (estimation: SavedEstimation) => {
    setCalculatedItems([...estimation.items]); // Create a new array copy
    setEstimationName(estimation.name); 
    setShowSavedEstimations(false);
    toast({
      title: "تم التحميل",
      description: `تم تحميل التقدير "${estimation.name}".`,
    });
  };

  const grandTotal = calculatedItems.reduce((sum, item) => sum + item.totalCost, 0);

  if (isLoading && materials.length === 0) { // Show loader only on initial load
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <Loader2 className="animate-spin h-12 w-12 text-app-red" />
        <p className="mt-3 text-lg text-gray-600">جاري تحميل بيانات المواد...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Calculation Form Section */}
      <div className="lg:col-span-2">
        <Card className="bg-white shadow-xl border-0 rounded-lg">
          <CardHeader className="text-right">
            <CardTitle className="text-app-red text-xl sm:text-2xl font-bold">إضافة مادة جديدة للتقدير</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-4 md:px-6 pb-6 text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="materialSelect" className="block mb-1.5 font-semibold text-gray-700">اختر المادة:</Label>
                <Select value={selectedMaterialId} onValueChange={handleMaterialChange} dir="rtl">
                  <SelectTrigger id="materialSelect" className="w-full bg-gray-50 border-gray-300 focus:border-app-gold text-right text-base">
                    <SelectValue placeholder={materials.length > 0 ? "اختر المادة..." : "جاري تحميل المواد..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.length === 0 && !isLoading && <SelectItem value="no-materials" disabled>لا توجد مواد متاحة</SelectItem>}
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
                      <Label htmlFor="description" className="block mb-1.5 font-semibold text-gray-700">وصف إضافي للمادة (اختياري):</Label>
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
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>خطأ في الإدخال</AlertTitle>
                <UiAlertDescription>
                  <ul className="list-disc pr-5 space-y-1">
                    {errorMessages.map((msg, i) => ( <li key={i}>{msg}</li> ))}
                  </ul>
                </UiAlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap gap-3 pt-3">
              <Button
                onClick={handleAddItemToList}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 px-5 text-base"
                disabled={!selectedMaterialId || isLoading}
              >
                <PlusCircle className="ms-2 h-5 w-5" /> إضافة للقائمة
              </Button>
              
              <Button
                onClick={handleClearAll} variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold py-2.5 px-5 text-base"
                disabled={isLoading}
              >
                <Trash2 className="ms-2 h-5 w-5" /> مسح الكل
              </Button>
              
              <Button
                onClick={handleToggleSavedEstimations} variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 font-semibold py-2.5 px-5 text-base"
                disabled={isLoadingSaved || isLoading}
              >
                {isLoadingSaved ? <Loader2 className="ms-2 h-5 w-5 animate-spin"/> : <Download className="ms-2 h-5 w-5" />}
                {showSavedEstimations ? "إخفاء المحفوظات" : "عرض المحفوظات"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results and Saved Estimations Panel */}
      <div className="lg:col-span-1 space-y-6">
        {showSavedEstimations && (
          <Card className="border-blue-300 shadow-md rounded-lg">
            <CardHeader className="bg-blue-50 rounded-t-lg py-3 px-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-blue-700 text-lg font-semibold">التقديرات المحفوظة</CardTitle>
                <Button size="icon" variant="ghost" onClick={() => setShowSavedEstimations(false)} className="text-blue-600 hover:bg-blue-100 h-8 w-8">
                  <XCircle size={20} /> <span className="sr-only">إغلاق</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              {isLoadingSaved ? (
                <div className="flex justify-center items-center py-6">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                    <p className="mr-2 text-blue-600">جاري تحميل التقديرات...</p>
                </div>
              ) : savedEstimations.length === 0 ? (
                <p className="text-gray-500 text-center py-6">لا توجد تقديرات محفوظة بعد.</p>
              ) : (
                <ScrollArea className="h-80">
                  <div className="space-y-2 pr-1">
                    {savedEstimations.map(estimation => (
                      <div
                        key={estimation.id}
                        className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-colors text-right"
                        onClick={() => handleApplySavedEstimation(estimation)}
                        title="اضغط لتحميل هذا التقدير"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplySavedEstimation(estimation)}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-blue-800 text-sm">{estimation.name}</h4>
                          <span className="text-xs text-blue-600">
                            {new Date(estimation.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 mt-1">
                          {estimation.items.length} مادة  •  إجمالي: {estimation.total.toFixed(2)} شيكل
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-green-300 shadow-md rounded-lg">
          <CardHeader className="bg-green-50 rounded-t-lg py-3 px-4">
            <CardTitle className="text-green-700 text-lg font-semibold text-right">التقدير الحالي للمواد</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-right">
            <div>
              <Label htmlFor="estimationName" className="block mb-1.5 font-semibold text-gray-700">اسم هذا التقدير ( للحفظ ):</Label>
              <Input
                id="estimationName" type="text" value={estimationName} onChange={(e) => setEstimationName(e.target.value)}
                placeholder="مثال: تقدير فيلا الطابق الأول" className="bg-gray-50 focus:border-app-gold text-base"
              />
            </div>

            {calculatedItems.length > 0 ? (
              <>
                <ScrollArea className="h-72">
                  <div className="space-y-3 pr-1">
                    {calculatedItems.map(item => (
                      <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex-grow">
                          <p className="font-semibold text-gray-800 text-sm">{item.materialName}</p>
                          {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                          <p className="text-xs text-gray-600 mt-0.5">
                            {item.quantity} {item.unit} × {item.pricePerUnit.toFixed(2)} شيكل/وحدة
                          </p>
                        </div>
                        <div className="text-left flex flex-col items-end ms-2 flex-shrink-0">
                          <span className="font-bold text-green-600 whitespace-nowrap text-sm">
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
                </ScrollArea>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base sm:text-lg font-semibold text-gray-700">المجموع الكلي:</span>
                    <span className="text-xl sm:text-2xl font-bold text-green-700">
                      {grandTotal.toFixed(2)} شيكل
                    </span>
                  </div>

                  <Button
                    onClick={handleSaveEstimation}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 text-base"
                    disabled={isSaving || calculatedItems.length === 0 || !estimationName.trim()}
                  >
                    {isSaving ? <Loader2 className="ms-2 h-5 w-5 animate-spin"/> : <Save className="ms-2 h-5 w-5" />}
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
