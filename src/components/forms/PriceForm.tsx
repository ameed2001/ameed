
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
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let resultParts: string[] = [];
    let totalConcreteCost = 0;
    let totalSteelCost = 0;
    let hasValidInput = false;
    let hasError = false;

    const cqVal = parseFloat(concreteQuantity);
    const cpVal = parseFloat(concretePrice);
    const sqVal = parseFloat(steelQuantity);
    const spVal = parseFloat(steelPrice);

    if (concreteQuantity !== '') {
      if (!isNaN(cqVal) && cqVal > 0 && !isNaN(cpVal) && cpVal >= 0) {
        totalConcreteCost = cqVal * cpVal;
        resultParts.push(`<p>تكلفة الباطون: <strong>${totalConcreteCost.toFixed(2)} شيكل</strong></p>`);
        hasValidInput = true;
      } else {
        resultParts.push("<p class='text-red-600'>الرجاء إدخال كمية وسعر صالحين للباطون (الكمية أكبر من صفر).</p>");
        hasError = true;
      }
    }

    if (steelQuantity !== '') {
      if (!isNaN(sqVal) && sqVal > 0 && !isNaN(spVal) && spVal >= 0) {
        totalSteelCost = sqVal * spVal;
        resultParts.push(`<p>تكلفة الحديد: <strong>${totalSteelCost.toFixed(2)} شيكل</strong></p>`);
        hasValidInput = true;
      } else {
        resultParts.push("<p class='text-red-600'>الرجاء إدخال كمية وسعر صالحين للحديد (الكمية أكبر من صفر).</p>");
        hasError = true;
      }
    }

    if (!hasValidInput && !hasError) {
      setResult("<p class='text-orange-600'>الرجاء إدخال كمية الباطون أو الحديد أو كليهما لحساب التكلفة.</p>");
      return;
    }

    if (totalConcreteCost > 0 && totalSteelCost > 0 && !hasError) {
      const grandTotal = totalConcreteCost + totalSteelCost;
      resultParts.push(`<p>المجموع الكلي: <strong>${grandTotal.toFixed(2)} شيكل</strong></p>`);
    }
    
    setResult(resultParts.join(''));

    // Log calculation attempt
    if (hasValidInput) {
        console.log('حفظ حساب الأسعار:', { 
            type: 'price', 
            inputs: {
                concreteQuantity: concreteQuantity !== '' ? cqVal : undefined, 
                concretePrice: concreteQuantity !== '' ? cpVal : undefined, 
                steelQuantity: steelQuantity !== '' ? sqVal : undefined, 
                steelPrice: steelQuantity !== '' ? spVal : undefined
            }, 
            results: {
                concreteTotal: totalConcreteCost > 0 ? totalConcreteCost.toFixed(2) : undefined,
                steelTotal: totalSteelCost > 0 ? totalSteelCost.toFixed(2) : undefined,
                grandTotal: (totalConcreteCost > 0 && totalSteelCost > 0 && !hasError) ? (totalConcreteCost + totalSteelCost).toFixed(2) : undefined
            }
        });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white/95 shadow-form-container border-app-gold">
      <CardHeader>
        <CardTitle className="text-app-red text-2xl font-bold text-center">حساب أسعار الحديد والباطون</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div className="form-group">
            <Label htmlFor="concreteQuantity" className="block mb-1.5 font-bold text-gray-700">كمية الباطون (م³):</Label>
            <Input type="number" id="concreteQuantity" value={concreteQuantity} onChange={(e) => setConcreteQuantity(e.target.value)} step="0.01" className="text-right text-base" placeholder="مثال: 20"/>
          </div>
          <div className="form-group">
            <Label htmlFor="concretePrice" className="block mb-1.5 font-bold text-gray-700">سعر المتر المكعب من الباطون (شيكل):</Label>
            <Input type="number" id="concretePrice" value={concretePrice} onChange={(e) => setConcretePrice(e.target.value)} step="0.01" required className="text-right text-base" placeholder="مثال: 350"/>
          </div>
          <hr className="my-3 border-gray-300"/>
          <div className="form-group">
            <Label htmlFor="steelQuantity" className="block mb-1.5 font-bold text-gray-700">كمية الحديد (كغم):</Label>
            <Input type="number" id="steelQuantity" value={steelQuantity} onChange={(e) => setSteelQuantity(e.target.value)} step="0.01" className="text-right text-base" placeholder="مثال: 1500"/>
          </div>
          <div className="form-group">
            <Label htmlFor="steelPrice" className="block mb-1.5 font-bold text-gray-700">سعر الكيلوغرام من الحديد (شيكل):</Label>
            <Input type="number" id="steelPrice" value={steelPrice} onChange={(e) => setSteelPrice(e.target.value)} step="0.01" required className="text-right text-base" placeholder="مثال: 3.5"/>
          </div>
          <div className="form-group pt-2">
            <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold py-2.5 text-lg">حساب</Button>
          </div>
        </form>
        {result && (
          <div 
            id="priceResult" 
            className="calculation-result-display"
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PriceForm;
