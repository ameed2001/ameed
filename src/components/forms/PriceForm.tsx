
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PriceForm = () => {
  const [concreteQuantity, setConcreteQuantity] = useState('');
  const [concretePrice, setConcretePrice] = useState('350');
  const [steelQuantity, setSteelQuantity] = useState('');
  const [steelPrice, setSteelPrice] = useState('3.5');

  // New items state
  const [wireQuantity, setWireQuantity] = useState('');
  const [wirePrice, setWirePrice] = useState('100'); // Default price per roll/kg
  const [wireType, setWireType] = useState(''); // e.g., لفة 6مم, كغم
  const [wireUnit, setWireUnit] = useState('لفة'); // Default unit for wire

  const [nailsQuantity, setNailsQuantity] = useState('');
  const [nailsPrice, setNailsPrice] = useState('10'); // Default price per kg/box
  const [nailsType, setNailsType] = useState(''); // e.g., 5سم, 10سم فولاذ
  const [nailsUnit, setNailsUnit] = useState('كغم'); // Default unit for nails

  const [discsQuantity, setDiscsQuantity] = useState('');
  const [discsPrice, setDiscsPrice] = useState('15'); // Default price per disc
  const [discsType, setDiscsType] = useState(''); // e.g., 14 بوصة, نوع ممتاز
  const [discsUnit, setDiscsUnit] = useState('قرص'); // Default unit for discs

  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let resultParts: string[] = [];
    let grandTotal = 0;
    let hasValidInput = false;
    let hasError = false;

    const parseAndValidate = (quantityStr: string, priceStr: string, itemName: string) => {
      const quantity = parseFloat(quantityStr);
      const price = parseFloat(priceStr);
      if (quantityStr === '' && priceStr === '') return { cost: 0, valid: false, error: false };
      if (quantityStr === '') return { cost: 0, valid: false, error: false }; // Allow empty if no quantity

      if (isNaN(quantity) || quantity <= 0 || isNaN(price) || price < 0) {
        resultParts.push(`<p class='text-red-600'>الرجاء إدخال كمية (>0) وسعر (>=0) صالحين لـ ${itemName}.</p>`);
        return { cost: 0, valid: false, error: true };
      }
      return { cost: quantity * price, valid: true, error: false };
    };

    // Concrete
    const concreteData = parseAndValidate(concreteQuantity, concretePrice, "الباطون");
    if (concreteData.error) hasError = true;
    if (concreteData.valid) {
      resultParts.push(`<p>تكلفة الباطون: <strong>${concreteData.cost.toFixed(2)} شيكل</strong></p>`);
      grandTotal += concreteData.cost;
      hasValidInput = true;
    }

    // Steel
    const steelData = parseAndValidate(steelQuantity, steelPrice, "الحديد");
    if (steelData.error) hasError = true;
    if (steelData.valid) {
      resultParts.push(`<p>تكلفة الحديد: <strong>${steelData.cost.toFixed(2)} شيكل</strong></p>`);
      grandTotal += steelData.cost;
      hasValidInput = true;
    }

    // Concrete Wire
    const wireData = parseAndValidate(wireQuantity, wirePrice, `سلك خرسانة (${wireType || wireUnit})`);
    if (wireData.error) hasError = true;
    if (wireData.valid) {
      resultParts.push(`<p>تكلفة سلك الخرسانة (${wireType || wireUnit}): <strong>${wireData.cost.toFixed(2)} شيكل</strong></p>`);
      grandTotal += wireData.cost;
      hasValidInput = true;
    }
    
    // Nails
    const nailsData = parseAndValidate(nailsQuantity, nailsPrice, `مسامير (${nailsType || nailsUnit})`);
    if (nailsData.error) hasError = true;
    if (nailsData.valid) {
      resultParts.push(`<p>تكلفة المسامير (${nailsType || nailsUnit}): <strong>${nailsData.cost.toFixed(2)} شيكل</strong></p>`);
      grandTotal += nailsData.cost;
      hasValidInput = true;
    }

    // Cutting Discs
    const discsData = parseAndValidate(discsQuantity, discsPrice, `صواني قص حديد (${discsType || discsUnit})`);
    if (discsData.error) hasError = true;
    if (discsData.valid) {
      resultParts.push(`<p>تكلفة صواني قص الحديد (${discsType || discsUnit}): <strong>${discsData.cost.toFixed(2)} شيكل</strong></p>`);
      grandTotal += discsData.cost;
      hasValidInput = true;
    }

    if (!hasValidInput && !hasError) {
      setResult("<p class='text-orange-600'>الرجاء إدخال كمية واحدة على الأقل من المواد لحساب التكلفة.</p>");
      return;
    }

    if (grandTotal > 0 && !hasError) {
      resultParts.push(`<hr class='my-2 border-gray-400'/><p>المجموع الكلي: <strong>${grandTotal.toFixed(2)} شيكل</strong></p>`);
    }
    
    setResult(resultParts.join(''));

    if (hasValidInput && !hasError) {
        console.log('حفظ حساب الأسعار:', { 
            type: 'price', 
            inputs: {
                concrete: concreteData.valid ? { quantity: parseFloat(concreteQuantity), price: parseFloat(concretePrice), total: concreteData.cost.toFixed(2) } : undefined,
                steel: steelData.valid ? { quantity: parseFloat(steelQuantity), price: parseFloat(steelPrice), total: steelData.cost.toFixed(2) } : undefined,
                wire: wireData.valid ? { quantity: parseFloat(wireQuantity), price: parseFloat(wirePrice), type: wireType, unit: wireUnit, total: wireData.cost.toFixed(2) } : undefined,
                nails: nailsData.valid ? { quantity: parseFloat(nailsQuantity), price: parseFloat(nailsPrice), type: nailsType, unit: nailsUnit, total: nailsData.cost.toFixed(2) } : undefined,
                discs: discsData.valid ? { quantity: parseFloat(discsQuantity), price: parseFloat(discsPrice), type: discsType, unit: discsUnit, total: discsData.cost.toFixed(2) } : undefined,
            }, 
            grandTotal: grandTotal > 0 ? grandTotal.toFixed(2) : undefined
        });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white/95 shadow-form-container border-app-gold">
      <CardHeader>
        <CardTitle className="text-app-red text-2xl font-bold text-center">حساب أسعار المواد</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          {/* Concrete Section */}
          <fieldset className="border border-gray-300 p-3 rounded-md">
            <legend className="text-lg font-semibold text-app-red px-2">باطون</legend>
            <div className="form-group">
              <Label htmlFor="concreteQuantity" className="block mb-1.5 font-bold text-gray-700">كمية الباطون (م³):</Label>
              <Input type="number" id="concreteQuantity" value={concreteQuantity} onChange={(e) => setConcreteQuantity(e.target.value)} step="0.01" className="text-right text-base" placeholder="مثال: 20"/>
            </div>
            <div className="form-group mt-2">
              <Label htmlFor="concretePrice" className="block mb-1.5 font-bold text-gray-700">سعر المتر المكعب من الباطون (شيكل):</Label>
              <Input type="number" id="concretePrice" value={concretePrice} onChange={(e) => setConcretePrice(e.target.value)} step="0.01" className="text-right text-base" placeholder="مثال: 350"/>
            </div>
          </fieldset>

          {/* Steel Section */}
          <fieldset className="border border-gray-300 p-3 rounded-md">
            <legend className="text-lg font-semibold text-app-red px-2">حديد</legend>
            <div className="form-group">
              <Label htmlFor="steelQuantity" className="block mb-1.5 font-bold text-gray-700">كمية الحديد (كغم):</Label>
              <Input type="number" id="steelQuantity" value={steelQuantity} onChange={(e) => setSteelQuantity(e.target.value)} step="0.01" className="text-right text-base" placeholder="مثال: 1500"/>
            </div>
            <div className="form-group mt-2">
              <Label htmlFor="steelPrice" className="block mb-1.5 font-bold text-gray-700">سعر الكيلوغرام من الحديد (شيكل):</Label>
              <Input type="number" id="steelPrice" value={steelPrice} onChange={(e) => setSteelPrice(e.target.value)} step="0.01" className="text-right text-base" placeholder="مثال: 3.5"/>
            </div>
          </fieldset>

          {/* Concrete Wire Section */}
          <fieldset className="border border-gray-300 p-3 rounded-md">
            <legend className="text-lg font-semibold text-app-red px-2">سلك خرسانة</legend>
            <div className="form-group">
              <Label htmlFor="wireQuantity" className="block mb-1.5 font-bold text-gray-700">الكمية:</Label>
              <Input type="number" id="wireQuantity" value={wireQuantity} onChange={(e) => setWireQuantity(e.target.value)} step="0.01" className="text-right text-base" placeholder="مثال: 10"/>
            </div>
             <div className="form-group mt-2">
              <Label htmlFor="wireUnit" className="block mb-1.5 font-bold text-gray-700">وحدة الكمية:</Label>
              <Input type="text" id="wireUnit" value={wireUnit} onChange={(e) => setWireUnit(e.target.value)} className="text-right text-base" placeholder="مثال: لفة, كغم"/>
            </div>
            <div className="form-group mt-2">
              <Label htmlFor="wireType" className="block mb-1.5 font-bold text-gray-700">النوع/الوصف (اختياري):</Label>
              <Input type="text" id="wireType" value={wireType} onChange={(e) => setWireType(e.target.value)} className="text-right text-base" placeholder="مثال: سلك مجدول 6مم"/>
            </div>
            <div className="form-group mt-2">
              <Label htmlFor="wirePrice" className="block mb-1.5 font-bold text-gray-700">سعر الوحدة (شيكل):</Label>
              <Input type="number" id="wirePrice" value={wirePrice} onChange={(e) => setWirePrice(e.target.value)} step="0.01" className="text-right text-base" placeholder="مثال: 100"/>
            </div>
          </fieldset>

          {/* Nails Section */}
          <fieldset className="border border-gray-300 p-3 rounded-md">
            <legend className="text-lg font-semibold text-app-red px-2">مسامير</legend>
            <div className="form-group">
              <Label htmlFor="nailsQuantity" className="block mb-1.5 font-bold text-gray-700">الكمية:</Label>
              <Input type="number" id="nailsQuantity" value={nailsQuantity} onChange={(e) => setNailsQuantity(e.target.value)} step="0.01" className="text-right text-base" placeholder="مثال: 50"/>
            </div>
            <div className="form-group mt-2">
              <Label htmlFor="nailsUnit" className="block mb-1.5 font-bold text-gray-700">وحدة الكمية:</Label>
              <Input type="text" id="nailsUnit" value={nailsUnit} onChange={(e) => setNailsUnit(e.target.value)} className="text-right text-base" placeholder="مثال: كغم, صندوق"/>
            </div>
            <div className="form-group mt-2">
              <Label htmlFor="nailsType" className="block mb-1.5 font-bold text-gray-700">النوع/الحجم (اختياري):</Label>
              <Input type="text" id="nailsType" value={nailsType} onChange={(e) => setNailsType(e.target.value)} className="text-right text-base" placeholder="مثال: مسامير فولاذ 5 سم"/>
            </div>
            <div className="form-group mt-2">
              <Label htmlFor="nailsPrice" className="block mb-1.5 font-bold text-gray-700">سعر الوحدة (شيكل):</Label>
              <Input type="number" id="nailsPrice" value={nailsPrice} onChange={(e) => setNailsPrice(e.target.value)} step="0.01" className="text-right text-base" placeholder="مثال: 10"/>
            </div>
          </fieldset>

          {/* Cutting Discs Section */}
          <fieldset className="border border-gray-300 p-3 rounded-md">
            <legend className="text-lg font-semibold text-app-red px-2">صواني قص حديد</legend>
            <div className="form-group">
              <Label htmlFor="discsQuantity" className="block mb-1.5 font-bold text-gray-700">العدد:</Label>
              <Input type="number" id="discsQuantity" value={discsQuantity} onChange={(e) => setDiscsQuantity(e.target.value)} step="1" className="text-right text-base" placeholder="مثال: 5"/>
            </div>
             <div className="form-group mt-2">
              <Label htmlFor="discsUnit" className="block mb-1.5 font-bold text-gray-700">وحدة الكمية:</Label>
              <Input type="text" id="discsUnit" value={discsUnit} onChange={(e) => setDiscsUnit(e.target.value)} className="text-right text-base" placeholder="مثال: قرص"/>
            </div>
            <div className="form-group mt-2">
              <Label htmlFor="discsType" className="block mb-1.5 font-bold text-gray-700">النوع/المقاس (اختياري):</Label>
              <Input type="text" id="discsType" value={discsType} onChange={(e) => setDiscsType(e.target.value)} className="text-right text-base" placeholder="مثال: 14 بوصة، عالي الجودة"/>
            </div>
            <div className="form-group mt-2">
              <Label htmlFor="discsPrice" className="block mb-1.5 font-bold text-gray-700">سعر القرص (شيكل):</Label>
              <Input type="number" id="discsPrice" value={discsPrice} onChange={(e) => setDiscsPrice(e.target.value)} step="0.01" className="text-right text-base" placeholder="مثال: 15"/>
            </div>
          </fieldset>
          
          <div className="form-group pt-2">
            <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold py-2.5 text-lg">حساب التكاليف</Button>
          </div>
        </form>
        {result && (
          <div 
            id="priceResult" 
            className="calculation-result-display space-y-1"
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PriceForm;

