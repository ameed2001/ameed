
"use client";

import { useState, useEffect, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Banknote, Coins, DollarSign, Briefcase, // Using Briefcase as a placeholder for Shekel
  Calculator, BrickWall, List, Tag, Package, ArrowLeft, Info, Clock, Trash2, PlusCircle, Printer, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaterialSubtype {
  name: string;
}

interface MaterialDefinition {
  id: string;
  name: string;
  unit: string;
  subtypes: MaterialSubtype[];
}

const materialDefinitions: MaterialDefinition[] = [
  { id: "brick", name: "الطوب", unit: "قطعة", subtypes: [{ name: "طوب أسمنتي" }, { name: "طوب أحمر" }, { name: "طوب زجاجي" }, { name: "طوب بخاري" }] },
  { id: "iron", name: "الحديد", unit: "كغم", subtypes: [{ name: "حديد 8 ملم" }, { name: "حديد 10 ملم" }, { name: "حديد 12 ملم" }, { name: "حديد 14 ملم" }, { name: "حديد 16 ملم" }, { name: "حديد 18 ملم" }, { name: "حديد 20 ملم" }] },
  { id: "concrete", name: "الخرسانة", unit: "متر مكعب", subtypes: [{ name: "خرسانة جاهزة B250" }, { name: "خرسانة جاهزة B300" }, { name: "خلطة موقع" }] },
  { id: "mesh", name: "سلك خرساني", unit: "لفة", subtypes: [{ name: "سلك مجدول 6 ملم" }, { name: "شبك حديد 8 ملم" }] },
  { id: "nails", name: "مسامير", unit: "كغم", subtypes: [{ name: "مسامير خشب متنوعة" }, { name: "مسامير صلب" }] },
  { id: "cuttingDiscs", name: "أقراص قطع", unit: "قطعة", subtypes: [{ name: "قرص قطع حديد 4 بوصة" }, { name: "قرص قطع حجر 7 بوصة" }] },
  { id: "cement", name: "إسمنت", unit: "كيس (50 كغم)", subtypes: [{ name: "إسمنت بورتلاندي عادي" }, { name: "إسمنت مقاوم للكبريتات" }] },
  { id: "sand", name: "رمل", unit: "متر مكعب", subtypes: [{ name: "رمل بناء ناعم" }, { name: "رمل بناء خشن (زيرو)" }] },
];

interface CalculationResult {
  materialName: string;
  subtypeName: string;
  quantity: string;
  unit: string;
  pricePerUnit: string;
  totalCost: string;
  currencySymbol: string;
  calculationTime: string;
}

const CostEstimatorForm = () => {
  const [currentCurrency, setCurrentCurrency] = useState<'dinar' | 'dollar' | 'shekel'>('dinar');
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [selectedSubtype, setSelectedSubtype] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState('');

  const currencySymbols = {
    dinar: 'دينار',
    dollar: 'دولار',
    shekel: 'شيكل'
  };
  const exchangeRates = { // Relative to Dinar
    dinar: 1,
    dollar: 0.71, // 1 Dinar = 0.71 USD (example) -> 1 USD = 1/0.71 Dinar
    shekel: 3.5 // 1 Dinar = 3.5 Shekel (example) -> 1 Shekel = 1/3.5 Dinar
  };

  const currentMaterial = materialDefinitions.find(m => m.id === selectedMaterialId);
  const currentSubtypes = currentMaterial?.subtypes || [];

  useEffect(() => {
    const now = new Date();
    setLastUpdateTime(now.toLocaleString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'long'
    }));
  }, []);

  const handleCurrencyChange = (currency: 'dinar' | 'dollar' | 'shekel') => {
    setCurrentCurrency(currency);
    if (calculationResult) {
      // Recalculate displayed total if result exists
      const basePrice = parseFloat(calculationResult.pricePerUnit) * exchangeRates[calculationResult.currencySymbol === 'دينار' ? 'dinar' : calculationResult.currencySymbol === 'دولار' ? 'dollar' : 'shekel']; // Convert to dinar
      const q = parseFloat(calculationResult.quantity);
      const newTotal = (basePrice * q) / exchangeRates[currency];
      setCalculationResult(prev => prev ? { ...prev, totalCost: newTotal.toFixed(2), currencySymbol: currencySymbols[currency] } : null);
    }
  };

  const handleMaterialChange = (value: string) => {
    setSelectedMaterialId(value);
    setSelectedSubtype(''); // Reset subtype
    setPrice('');
    setQuantity('');
    setCalculationResult(null);
  };
  
  const handleSubtypeChange = (value: string) => {
    setSelectedSubtype(value);
    // Potentially auto-fill price if we had default prices for subtypes
  };

  const calculateCost = () => {
    if (!selectedMaterialId || !selectedSubtype || !price || !quantity) {
      alert("يرجى اختيار المادة والنوع وإدخال السعر والكمية.");
      return;
    }

    const p = parseFloat(price);
    const q = parseFloat(quantity);

    if (isNaN(p) || p < 0 || isNaN(q) || q <= 0) {
      alert("الرجاء إدخال قيم صالحة للسعر والكمية.");
      return;
    }

    const total = p * q; // This is in the currency the user entered the price in
    const now = new Date();

    setCalculationResult({
      materialName: currentMaterial?.name || '',
      subtypeName: selectedSubtype,
      quantity: q.toString(),
      unit: currentMaterial?.unit || '--',
      pricePerUnit: p.toFixed(2),
      totalCost: total.toFixed(2), // This will be displayed and interpreted in the 'currentCurrency' context
      currencySymbol: currencySymbols[currentCurrency],
      calculationTime: now.toLocaleString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'long'
      })
    });
  };

  const clearCalculation = () => {
    setSelectedMaterialId('');
    setSelectedSubtype('');
    setPrice('');
    setQuantity('');
    setCalculationResult(null);
  };

  const addAnotherMaterial = () => {
    // For this single-item calculator, it's the same as clear
    clearCalculation(); 
    // Focus material select
    document.getElementById('material-select-trigger')?.focus();
  };

  const printReport = () => {
    if (!calculationResult) {
      alert("لا توجد نتيجة لطباعتها.");
      return;
    }

    const { materialName, subtypeName, quantity: qty, unit, pricePerUnit, totalCost, currencySymbol, calculationTime } = calculationResult;
    
    const reportContent = `
      <div style="font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; text-align: right;">
        <h2 style="text-align: center; color: #2563eb; margin-bottom: 20px;">تقرير تكلفة مواد البناء</h2>
        <p><strong>المادة:</strong> ${materialName} - ${subtypeName}</p>
        <p><strong>الكمية:</strong> ${qty} ${unit}</p>
        <p><strong>سعر الوحدة:</strong> ${pricePerUnit} ${currencySymbol}</p>
        <hr style="margin: 15px 0; border-top: 1px solid #eee;" />
        <p style="font-size: 1.2em;"><strong>التكلفة الإجمالية:</strong> ${totalCost} ${currencySymbol}</p>
        <div style="margin-top: 30px; font-size: 0.9em; color: #555;">
          تم إنشاء التقرير في: ${calculationTime}
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>تقرير التكلفة</title>');
      printWindow.document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap">');
      printWindow.document.write('</head><body>');
      printWindow.document.write(reportContent);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    } else {
      alert("متصفحك قام بحظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.");
    }
  };


  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          <span className="text-blue-600">حاسبة</span> أسعار مواد البناء
        </h1>
        <p className="text-gray-600">أداة لحساب تكاليف مواد البناء بطريقة سهلة وسريعة</p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-gray-700 text-sm font-medium mb-2 flex items-center">
          <Banknote className="ml-2 text-green-500 w-5 h-5" />
          اختر العملة:
        </h3>
        <div className="flex space-x-3 space-x-reverse">
          {(['dinar', 'dollar', 'shekel'] as const).map(currency => (
            <Button
              key={currency}
              onClick={() => handleCurrencyChange(currency)}
              className={cn(
                "flex-1 px-4 py-2 rounded-lg flex items-center justify-center",
                currentCurrency === currency ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
            >
              {currency === 'dinar' && <Coins className="ml-1 w-4 h-4" />}
              {currency === 'dollar' && <DollarSign className="ml-1 w-4 h-4" />}
              {currency === 'shekel' && <Briefcase className="ml-1 w-4 h-4" />} {/* Placeholder icon */}
              {currencySymbols[currency]}
            </Button>
          ))}
        </div>
      </div>

      <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <div className="flex items-center">
            <Calculator className="text-2xl ml-2 w-7 h-7" />
            <h2 className="text-xl font-bold">برنامج حساب تكلفة المشروع</h2>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8">
          <div className="mb-6">
            <Label htmlFor="material-select" className="block text-gray-700 text-sm font-medium mb-2">
              <BrickWall className="ml-2 text-blue-500 inline-block w-5 h-5" />
              اختر مادة البناء:
            </Label>
            <Select value={selectedMaterialId} onValueChange={handleMaterialChange} dir="rtl">
              <SelectTrigger id="material-select-trigger" className="w-full bg-gray-100 border-gray-200 text-gray-700">
                <SelectValue placeholder="-- حدد المادة من القائمة --" />
              </SelectTrigger>
              <SelectContent>
                {materialDefinitions.map(material => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="subtype-select" className="block text-gray-700 text-sm font-medium mb-2">
              <List className="ml-2 text-blue-500 inline-block w-5 h-5" />
              اختر النوع:
            </Label>
            <Select value={selectedSubtype} onValueChange={handleSubtypeChange} dir="rtl" disabled={!currentMaterial}>
              <SelectTrigger className="w-full bg-gray-100 border-gray-200 text-gray-700">
                <SelectValue placeholder="-- اختر النوع أولاً --" />
              </SelectTrigger>
              <SelectContent>
                {currentSubtypes.map(subtype => (
                  <SelectItem key={subtype.name} value={subtype.name}>
                    {subtype.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="price" className="block text-gray-700 text-sm font-medium mb-2">
              <Tag className="ml-2 text-blue-500 inline-block w-5 h-5" />
              السعر (بال{currencySymbols[currentCurrency]}):
            </Label>
            <Input
              type="number"
              id="price"
              value={price}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              placeholder="أدخل سعر المادة"
              className="w-full bg-gray-100 border-gray-200 text-gray-700"
              disabled={!selectedSubtype}
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="quantity" className="block text-gray-700 text-sm font-medium mb-2">
              <Package className="ml-2 text-blue-500 inline-block w-5 h-5" />
              الكمية:
            </Label>
            <div className="relative">
              <Input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
                min="1"
                placeholder="أدخل الكمية المطلوبة"
                className="w-full bg-gray-100 border-gray-200 text-gray-700 pr-16" // Added pr-16 for unit
                disabled={!selectedSubtype}
              />
              <div className="absolute inset-y-0 left-0 flex items-center px-3 bg-blue-100 rounded-l-lg pointer-events-none">
                <span className="text-gray-700 text-sm">{currentMaterial?.unit || '--'}</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={calculateCost}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center transform hover:scale-[1.01] active:scale-[0.98]"
            disabled={!selectedSubtype || !price || !quantity}
          >
            <Calculator className="ml-2 w-5 h-5" />
            احسب التكلفة النهائية
            <ArrowLeft className="mr-2 w-5 h-5 cost-estimator-animate-bounce" />
          </Button>
        </CardContent>
        
        {calculationResult && (
          <div id="resultContainer">
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6">
              <Card className="bg-white rounded-lg p-6 border border-emerald-200 relative overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-px transition-all duration-300">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs px-2 py-1 rounded-bl-lg">
                  <Info className="ml-1 inline-block w-4 h-4" /> نتيجة الحساب
                </div>
                
                <div className="text-center">
                  <div className="flex justify-center items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Coins className="text-blue-600 text-2xl w-8 h-8" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-1">التكلفة الإجمالية</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {calculationResult.totalCost} {calculationResult.currencySymbol}
                  </div>
                  
                  <div className="text-gray-600 text-sm mb-3">
                    <span>{calculationResult.materialName} - {calculationResult.subtypeName}</span> - 
                    <span> {calculationResult.quantity}</span> 
                    <span> {calculationResult.unit}</span> بسعر 
                    <span> {calculationResult.pricePerUnit} {calculationResult.currencySymbol} </span> للوحدة
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="text-xs text-gray-500 flex justify-center items-center">
                      <Clock className="ml-1 w-4 h-4" />
                      آخر تحديث: <span>{calculationResult.calculationTime}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="flex space-x-3 space-x-reverse px-6 pb-6 -mt-4">
              <Button onClick={clearCalculation} variant="destructive" className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600">
                <Trash2 className="ml-2 w-4 h-4" />
                حذف الحساب
              </Button>
              <Button onClick={addAnotherMaterial} className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                <PlusCircle className="ml-2 w-4 h-4" />
                إضافة مادة
              </Button>
              <Button onClick={printReport} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Printer className="ml-2 w-4 h-4" />
                طباعة التقرير
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      <Card className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <CardHeader className="bg-gray-100 p-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-700 flex items-center">
            <HelpCircle className="ml-2 text-blue-500 w-5 h-5" />
            كيفية استخدام الحاسبة؟
          </h3>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="list-disc mr-4 text-gray-600 space-y-2">
            <li>اختر العملة المطلوبة من الأعلى.</li>
            <li>اختر نوع المادة المراد حساب تكلفتها من القائمة المنسدلة.</li>
            <li>حدد النوع الفرعي للمادة (إذا توفر).</li>
            <li>أدخل سعر الوحدة للمادة المحددة بالعملة المختارة.</li>
            <li>أدخل الكمية المطلوبة.</li>
            <li>اضغط على زر "احسب التكلفة النهائية".</li>
            <li>ستظهر التكلفة الإجمالية مع تفاصيل الحساب.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostEstimatorForm;
