
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Printer, PlusCircle, Trash2, Calculator, Coins, DollarSign } from 'lucide-react'; // Removed Shekel
import { useToast } from '@/hooks/use-toast'; // Corrected path

// Inline SVG for Shekel symbol
const ShekelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 18V6"/>
    <path d="M18 6v12"/>
    <path d="M14 6h-4a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h4"/>
    <path d="M10 18h4a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4h-4"/>
  </svg>
);

interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number; // Stored in Dinar (base currency)
  total: number;        // Stored in Dinar (base currency)
}

const units: Record<string, string> = {
  brick: "قطعة",
  iron: "كغم",
  concrete: "م³",
  mesh: "لفة",
  nails: "كغم",
  cuttingDiscs: "قرص",
  cement: "كيس",
  sand: "م³"
};

// Helper function to get material display name (Arabic)
const getMaterialDisplayName = (key: string): string => {
  const names: Record<string, string> = {
    brick: "الطوب",
    iron: "الحديد",
    concrete: "الخرسانة",
    mesh: "سلك خرساني",
    nails: "مسامير",
    cuttingDiscs: "أقراص قطع",
    cement: "إسمنت",
    sand: "رمل"
  };
  return names[key] || key;
};


const materialTypes: Record<string, string[]> = {
  brick: ["طوب أسمنتي", "طوب أحمر", "طوب زجاجي", "طوب بخاري"],
  iron: ["8 ملم", "10 ملم", "12 ملم", "14 ملم", "16 ملم", "18 ملم", "20 ملم"],
  concrete: ["خرسانة عادية", "خرسانة مسلحة"],
  mesh: ["سلك خرسانة"],
  nails: ["مسامير خشب", "مسامير حديد"],
  cuttingDiscs: ["أقراص قطع حديد", "أقراص قطع خرسانة"],
  cement: ["إسمنت بورتلاندي"],
  sand: ["رمل ناعم", "رمل خشن"]
};


export default function CostEstimatorForm() {
  const { toast } = useToast();
  const [currency, setCurrency] = useState<'dinar' | 'dollar' | 'shekel'>('dinar');
  const [selectedMaterialKey, setSelectedMaterialKey] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [price, setPrice] = useState<string>(''); // Price input by user in selected currency
  const [quantity, setQuantity] = useState<string>('');
  const [items, setItems] = useState<MaterialItem[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [currentUnit, setCurrentUnit] = useState<string>('--');


  const currencySymbols = {
    dinar: 'دينار',
    dollar: '$',
    shekel: 'شيكل'
  };

  const exchangeRates = { // Rates relative to Dinar (1 Dinar = X other_currency)
    dinar: 1,
    dollar: 0.71, // 1 Dinar = 0.71 USD
    shekel: 2.5   // 1 Dinar = 2.5 ILS
  };

  // Converts an amount from a given currency TO Dinar (base)
  const convertToDinar = (amount: number, fromCurrency: keyof typeof exchangeRates): number => {
    if (fromCurrency === 'dinar') return amount;
    if (fromCurrency === 'dollar') return amount / exchangeRates.dollar;
    if (fromCurrency === 'shekel') return amount / exchangeRates.shekel;
    return amount;
  };

  // Converts an amount FROM Dinar (base) to the target currency
  const convertFromDinar = (amountInDinar: number, toCurrency: keyof typeof exchangeRates): number => {
    if (toCurrency === 'dinar') return amountInDinar;
    if (toCurrency === 'dollar') return amountInDinar * exchangeRates.dollar;
    if (toCurrency === 'shekel') return amountInDinar * exchangeRates.shekel;
    return amountInDinar;
  };
  
  const calculateTotalInDinar = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  useEffect(() => {
    if (selectedMaterialKey) {
        setSelectedType(''); 
        setPrice(''); 
        setCurrentUnit(units[selectedMaterialKey as keyof typeof units] || '--');
    } else {
        setCurrentUnit('--');
    }
  }, [selectedMaterialKey]);


  const handleCalculate = () => {
    if (!selectedMaterialKey || !selectedType || !price || !quantity) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال جميع البيانات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const priceInputAsNumber = parseFloat(price);
    const quantityValue = parseFloat(quantity);
    
    if (isNaN(priceInputAsNumber) || priceInputAsNumber < 0) {
      toast({
        title: "سعر غير صالح",
        description: "يرجى إدخال سعر صحيح (0 أو أكبر)",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(quantityValue) || quantityValue <= 0) {
      toast({
        title: "كمية غير صالحة",
        description: "يرجى إدخال كمية صحيحة (أكبر من صفر)",
        variant: "destructive",
      });
      return;
    }

    const pricePerUnitInDinar = convertToDinar(priceInputAsNumber, currency);
    const totalCostInDinar = pricePerUnitInDinar * quantityValue;

    const newItem: MaterialItem = {
      id: Date.now().toString(),
      name: `${getMaterialDisplayName(selectedMaterialKey)} (${selectedType})`,
      quantity: quantityValue,
      unit: units[selectedMaterialKey as keyof typeof units],
      pricePerUnit: pricePerUnitInDinar,
      total: totalCostInDinar
    };

    setItems(prevItems => [...prevItems, newItem]);
    setShowReport(true);
    
    // Reset form for next entry
    setPrice('');
    setQuantity('');
    // Optionally keep selectedMaterialKey and selectedType or reset them:
    // setSelectedMaterialKey(''); 
    // setSelectedType('');
    // setCurrentUnit('--');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const tableRows = items.map(item => {
        const displayPricePerUnit = convertFromDinar(item.pricePerUnit, currency);
        const displayTotal = convertFromDinar(item.total, currency);
        return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity} ${item.unit}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${displayPricePerUnit.toFixed(2)} ${currencySymbols[currency]}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: left;">${displayTotal.toFixed(2)} ${currencySymbols[currency]}</td>
        </tr>
      `;
      }).join('');

      const totalCostInDinar = calculateTotalInDinar();
      const totalCostDisplay = convertFromDinar(totalCostInDinar, currency).toFixed(2);

      printWindow.document.write(`
        <html>
          <head>
            <title>تقرير تكلفة المواد</title>
            <style>
              body { font-family: 'Tajawal', sans-serif; direction: rtl; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 30px; }
              .total-row td { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>تقرير تكلفة مواد البناء</h1>
              <p>تاريخ الطباعة: ${new Date().toLocaleString('ar-EG')}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>المادة</th>
                  <th>الكمية</th>
                  <th>سعر الوحدة (${currencySymbols[currency]})</th>
                  <th>المجموع (${currencySymbols[currency]})</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="3" style="text-align:right; font-weight:bold;">المجموع الكلي:</td>
                  <td style="text-align: left; font-weight:bold;">${totalCostDisplay} ${currencySymbols[currency]}</td>
                </tr>
              </tfoot>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      toast({
        title: "خطأ في الطباعة",
        description: "لم يتمكن المتصفح من فتح نافذة الطباعة.",
        variant: "destructive",
      });
    }
  };


  const handleClear = () => {
    setItems([]);
    setShowReport(false);
    setSelectedMaterialKey('');
    setSelectedType('');
    setPrice('');
    setQuantity('');
    setCurrentUnit('--');
  };

  const handleAddAnother = () => {
    // Reset only type, price, quantity. Keep material selected if user wants.
    setSelectedType('');
    setPrice('');
    setQuantity('');
    // currentUnit will update via useEffect when selectedMaterialKey is potentially changed by user
  };
  
  const handleRemoveItem = (itemId: string) => {
    setItems(prevItems => {
        const newItems = prevItems.filter(item => item.id !== itemId);
        if (newItems.length === 0) {
            setShowReport(false);
        }
        return newItems;
    });
  };


  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 cost-estimator-body">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          <span className="text-blue-600">حاسبة</span> أسعار مواد البناء
        </h1>
        <p className="text-gray-600">أدق الأداة لحساب تكاليف مواد البناء بطريقة سهلة وسريعة</p>
      </div>

      {/* Currency Selector */}
      <Card className="mb-6 bg-white shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Coins className="text-green-500" />
            <Label className="text-gray-700 font-medium">اختر العملة:</Label>
          </div>
          <div className="flex gap-3">
            <Button
              variant={currency === 'dinar' ? 'default' : 'outline'}
              onClick={() => setCurrency('dinar')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-300"
            >
              دينار
            </Button>
            <Button
              variant={currency === 'dollar' ? 'default' : 'outline'}
              onClick={() => setCurrency('dollar')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-300"
            >
              <DollarSign className="ml-1 h-4 w-4" />
              دولار
            </Button>
            <Button
              variant={currency === 'shekel' ? 'default' : 'outline'}
              onClick={() => setCurrency('shekel')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-300"
            >
              <ShekelIcon className="ml-1 h-4 w-4" />
              شيكل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calculator Form */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            <CardTitle>برنامج حساب تكلفة المشروع</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label htmlFor="material" className="flex items-center gap-2 mb-2 font-medium text-gray-700">
              اختر مادة البناء:
            </Label>
            <Select value={selectedMaterialKey} onValueChange={setSelectedMaterialKey} dir="rtl">
              <SelectTrigger id="material" className="w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right">
                <SelectValue placeholder="حدد المادة من القائمة" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(units).map((matKey) => (
                  <SelectItem key={matKey} value={matKey}>
                    {getMaterialDisplayName(matKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMaterialKey && materialTypes[selectedMaterialKey as keyof typeof materialTypes] && (
            <div>
              <Label htmlFor="type" className="flex items-center gap-2 mb-2 font-medium text-gray-700">
                اختر النوع:
              </Label>
              <Select value={selectedType} onValueChange={setSelectedType} dir="rtl">
                <SelectTrigger id="type" className="w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-right">
                  <SelectValue placeholder="اختر النوع من القائمة" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes[selectedMaterialKey as keyof typeof materialTypes]?.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="price" className="flex items-center gap-2 mb-2 font-medium text-gray-700">
              السعر ({currencySymbols[currency]}):
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="أدخل سعر المادة"
              className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="any"
            />
          </div>

          <div>
            <Label htmlFor="quantity" className="flex items-center gap-2 mb-2 font-medium text-gray-700">
              الكمية:
            </Label>
            <div className="relative">
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="أدخل الكمية المطلوبة"
                className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-16" 
                 min="0"
                 step="any"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-gray-200 px-3 py-1 rounded text-sm text-gray-700 pointer-events-none">
                {currentUnit}
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold py-3 text-lg transform hover:scale-105 transition-transform"
            disabled={!selectedMaterialKey || !selectedType || !price || !quantity}
          >
            <PlusCircle className="ml-2 h-5 w-5" />
            إضافة للقائمة
          </Button>
        </CardContent>
      </Card>

      {showReport && items.length > 0 && (
        <div className="mt-8 space-y-6 print:block print:mt-0">
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 print:bg-white">
              <CardTitle className="text-blue-700 text-xl">تقرير التكاليف</CardTitle>
              <CardDescription className="text-gray-600">تفاصيل المواد والتكاليف المحسوبة</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 print:bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">المادة</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">الكمية</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">سعر الوحدة</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">المجموع</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600 print:hidden">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-right text-gray-700">{item.name}</td>
                        <td className="px-4 py-3 text-center text-gray-700">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-700">
                          {convertFromDinar(item.pricePerUnit, currency).toFixed(2)} {currencySymbols[currency]}
                        </td>
                        <td className="px-4 py-3 text-left text-gray-700">
                          {convertFromDinar(item.total, currency).toFixed(2)} {currencySymbols[currency]}
                        </td>
                        <td className="px-4 py-3 text-center print:hidden">
                           <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                               <Trash2 size={16} />
                           </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100 print:bg-gray-200 font-bold">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right text-gray-800">المجموع الكلي:</td>
                      <td className="px-4 py-3 text-left text-gray-800">
                        {convertFromDinar(calculateTotalInDinar(), currency).toFixed(2)} {currencySymbols[currency]}
                      </td>
                       <td className="print:hidden"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 print:hidden">
            <Button
              onClick={handleClear}
              variant="destructive"
              className="flex-1"
            >
              <Trash2 className="ml-2 h-5 w-5" />
              مسح كل المواد
            </Button>
            <Button
              onClick={handleAddAnother}
              variant="outline"
              className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <PlusCircle className="ml-2 h-5 w-5" />
              إضافة مادة أخرى
            </Button>
            <Button
              onClick={handlePrint}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
            >
              <Printer className="ml-2 h-5 w-5" />
              طباعة التقرير
            </Button>
          </div>
        </div>
      )}

      <Card className="mt-8 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            كيفية استخدام الحاسبة؟
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc mr-4 space-y-2 text-gray-600 text-sm">
            <li>اختر العملة المطلوبة أولاً.</li>
            <li>اختر نوع المادة المراد حساب تكلفتها من القائمة المنسدلة.</li>
            <li>حدد النوع الفرعي للمادة (إذا توفر).</li>
            <li>أدخل سعر الوحدة للمادة بالعملة المختارة.</li>
            <li>أدخل الكمية المطلوبة من المادة.</li>
            <li>اضغط على زر "إضافة للقائمة".</li>
            <li>ستظهر المادة وتكلفتها في جدول التقرير.</li>
            <li>كرر الخطوات لإضافة المزيد من المواد.</li>
            <li>استخدم زر "مسح كل المواد" للبدء من جديد أو "طباعة التقرير" للحصول على نسخة ورقية.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

