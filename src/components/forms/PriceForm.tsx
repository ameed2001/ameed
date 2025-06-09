
"use client";

import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle, ShoppingCart } from 'lucide-react'; // Added icons

interface MaterialConfig {
  value: string;
  label: string;
  defaultUnit: string;
  defaultPrice: string;
  needsTypeInput: boolean; // For description/type
  needsUnitInput: boolean; // If unit is user-configurable
  quantityLabel: string;
  priceLabel: string;
  unitLabel?: string;
  typeLabel?: string;
}

const materialOptions: MaterialConfig[] = [
  { value: 'concrete', label: 'باطون', defaultUnit: 'م³', defaultPrice: '350', needsTypeInput: false, needsUnitInput: false, quantityLabel: 'كمية الباطون (م³):', priceLabel: 'سعر المتر المكعب (شيكل):' },
  { value: 'steel', label: 'حديد', defaultUnit: 'كغم', defaultPrice: '3.5', needsTypeInput: false, needsUnitInput: false, quantityLabel: 'كمية الحديد (كغم):', priceLabel: 'سعر الكيلوغرام (شيكل):' },
  { value: 'wire', label: 'سلك خرسانة', defaultUnit: 'لفة', defaultPrice: '100', needsTypeInput: true, needsUnitInput: true, quantityLabel: 'الكمية:', priceLabel: 'سعر الوحدة (شيكل):', unitLabel: 'وحدة الكمية:', typeLabel: 'النوع/الوصف (اختياري):' },
  { value: 'nails', label: 'مسامير', defaultUnit: 'كغم', defaultPrice: '10', needsTypeInput: true, needsUnitInput: true, quantityLabel: 'الكمية:', priceLabel: 'سعر الوحدة (شيكل):', unitLabel: 'وحدة الكمية:', typeLabel: 'النوع/الحجم (اختياري):' },
  { value: 'discs', label: 'صواني قص حديد', defaultUnit: 'قرص', defaultPrice: '15', needsTypeInput: true, needsUnitInput: true, quantityLabel: 'العدد:', priceLabel: 'سعر القرص (شيكل):', unitLabel: 'وحدة الكمية:', typeLabel: 'النوع/المقاس (اختياري):' },
];

interface CalculatedItem {
  id: string;
  materialLabel: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  typeDescription?: string;
  totalCost: number;
}

const PriceForm = () => {
  const [selectedMaterialValue, setSelectedMaterialValue] = useState<string>('');
  
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [itemUnit, setItemUnit] = useState('');
  const [itemType, setItemType] = useState(''); // For description/type

  const [calculatedItems, setCalculatedItems] = useState<CalculatedItem[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const currentMaterialConfig = materialOptions.find(m => m.value === selectedMaterialValue);

  const handleMaterialChange = (value: string) => {
    setSelectedMaterialValue(value);
    const config = materialOptions.find(m => m.value === value);
    if (config) {
      setQuantity('');
      setPrice(config.defaultPrice);
      setItemUnit(config.defaultUnit);
      setItemType('');
    } else {
      // Reset fields if material is deselected or not found
      setQuantity('');
      setPrice('');
      setItemUnit('');
      setItemType('');
    }
    setErrorMessages([]); // Clear errors on material change
  };

  const handleAddItemToList = () => {
    setErrorMessages([]);
    if (!currentMaterialConfig) {
      setErrorMessages(["يرجى اختيار نوع المادة أولاً."]);
      return;
    }

    const q = parseFloat(quantity);
    const p = parseFloat(price);

    let currentErrors: string[] = [];

    if (isNaN(q) || q <= 0) {
      currentErrors.push(`كمية "${currentMaterialConfig.label}" يجب أن تكون رقمًا أكبر من صفر.`);
    }
    if (isNaN(p) || p < 0) {
      currentErrors.push(`سعر "${currentMaterialConfig.label}" يجب أن يكون رقمًا صالحًا (0 أو أكثر).`);
    }
    if (currentMaterialConfig.needsUnitInput && !itemUnit.trim()) {
        currentErrors.push(`وحدة الكمية لـ "${currentMaterialConfig.label}" مطلوبة.`);
    }
    
    if (currentErrors.length > 0) {
      setErrorMessages(currentErrors);
      return;
    }

    const totalCost = q * p;
    const newItem: CalculatedItem = {
      id: crypto.randomUUID(),
      materialLabel: currentMaterialConfig.label,
      quantity: q,
      unit: currentMaterialConfig.needsUnitInput ? itemUnit : currentMaterialConfig.defaultUnit,
      pricePerUnit: p,
      typeDescription: currentMaterialConfig.needsTypeInput ? itemType : undefined,
      totalCost: parseFloat(totalCost.toFixed(2)),
    };

    setCalculatedItems(prevItems => [...prevItems, newItem]);
    console.log('تمت إضافة مادة للقائمة:', newItem);
    // Reset fields for next entry based on current material (or clear if needed)
    handleMaterialChange(selectedMaterialValue); // Resets to defaults for the current material
    setQuantity(''); // Specifically clear quantity
  };

  const handleClearAll = () => {
    setSelectedMaterialValue('');
    setQuantity('');
    setPrice('');
    setItemUnit('');
    setItemType('');
    setCalculatedItems([]);
    setErrorMessages([]);
  };
  
  const handleRemoveItem = (itemId: string) => {
    setCalculatedItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const grandTotal = calculatedItems.reduce((sum, item) => sum + item.totalCost, 0);

  return (
    <Card className="w-full max-w-lg mx-auto bg-white/95 shadow-form-container border-app-gold">
      <CardHeader className="text-center">
        <ShoppingCart className="mx-auto h-10 w-10 text-app-red mb-2" />
        <CardTitle className="text-app-red text-2xl font-bold">حساب أسعار المواد المتعددة</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 text-right">
        <div className="space-y-5">
          <div>
            <Label htmlFor="materialSelect" className="block mb-1.5 font-bold text-gray-700">اختر المادة:</Label>
            <Select value={selectedMaterialValue} onValueChange={handleMaterialChange} dir="rtl">
              <SelectTrigger id="materialSelect" className="w-full bg-white focus:border-app-gold text-right">
                <SelectValue placeholder="اختر نوع المادة..." />
              </SelectTrigger>
              <SelectContent>
                {materialOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentMaterialConfig && (
            <fieldset className="border border-gray-300 p-3 rounded-md space-y-3 bg-gray-50/50">
              <legend className="text-lg font-semibold text-app-gold px-2">تفاصيل مادة: {currentMaterialConfig.label}</legend>
              
              <div>
                <Label htmlFor="quantity" className="block mb-1 font-medium text-gray-600">{currentMaterialConfig.quantityLabel}</Label>
                <Input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} step="any" className="text-right text-base bg-white" placeholder="مثال: 10"/>
              </div>

              {currentMaterialConfig.needsUnitInput && (
                <div>
                  <Label htmlFor="itemUnit" className="block mb-1 font-medium text-gray-600">{currentMaterialConfig.unitLabel}</Label>
                  <Input type="text" id="itemUnit" value={itemUnit} onChange={(e) => setItemUnit(e.target.value)} className="text-right text-base bg-white" placeholder={`مثال: ${currentMaterialConfig.defaultUnit}`}/>
                </div>
              )}

              {currentMaterialConfig.needsTypeInput && (
                <div>
                  <Label htmlFor="itemType" className="block mb-1 font-medium text-gray-600">{currentMaterialConfig.typeLabel}</Label>
                  <Input type="text" id="itemType" value={itemType} onChange={(e) => setItemType(e.target.value)} className="text-right text-base bg-white" placeholder="وصف إضافي للمادة"/>
                </div>
              )}
              
              <div>
                <Label htmlFor="price" className="block mb-1 font-medium text-gray-600">{currentMaterialConfig.priceLabel}</Label>
                <Input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} step="any" className="text-right text-base bg-white" placeholder={`مثال: ${currentMaterialConfig.defaultPrice}`}/>
              </div>
            </fieldset>
          )}

          {errorMessages.length > 0 && (
            <div className="mt-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md space-y-1 text-sm">
              {errorMessages.map((msg, index) => <p key={index}>- {msg}</p>)}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
                onClick={handleAddItemToList} 
                className="w-full sm:flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 text-lg" 
                disabled={!selectedMaterialValue}
            >
              <PlusCircle className="ms-2 h-5 w-5" />
              إضافة للقائمة
            </Button>
            <Button 
                onClick={handleClearAll} 
                variant="destructive" 
                className="w-full sm:flex-1 font-bold py-2.5 text-lg"
            >
               <Trash2 className="ms-2 h-5 w-5" />
               مسح الكل
            </Button>
          </div>
        </div>

        {calculatedItems.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-app-red mb-3 border-b-2 border-app-gold pb-1">قائمة المواد المحسوبة:</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {calculatedItems.map((item) => (
                <div key={item.id} className="p-3 bg-gray-100 rounded-md shadow-sm flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold">{item.materialLabel} {item.typeDescription && `(${item.typeDescription})`}</p>
                    <p className="text-xs text-gray-600">
                      {item.quantity} {item.unit} × {item.pricePerUnit.toFixed(2)} شيكل/وحدة
                    </p>
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-app-red">{item.totalCost.toFixed(2)} شيكل</p>
                     <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 h-auto p-1 -mr-1">
                        <Trash2 size={14}/>
                     </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-300 calculation-result-display text-lg">
              المجموع الكلي: <strong>{grandTotal.toFixed(2)} شيكل</strong>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceForm;
