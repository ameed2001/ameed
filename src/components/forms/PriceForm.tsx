"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PriceForm = () => {
  const [concreteQuantity, setConcreteQuantity] = useState('');
  const [concretePrice, setConcretePrice] = useState('350'); // Default from user HTML
  const [steelQuantity, setSteelQuantity] = useState('');
  const [steelPrice, setSteelPrice] = useState('3.5'); // Default from user HTML
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cq = parseFloat(concreteQuantity);
    const cp = parseFloat(concretePrice);
    const sq = parseFloat(steelQuantity);
    const sp = parseFloat(steelPrice);

    if (isNaN(cq) || isNaN(cp) || isNaN(sq) || isNaN(sp) || cq < 0 || cp < 0 || sq < 0 || sp < 0) {
      setResult("الرجاء إدخال قيم صالحة لجميع الحقول.");
      return;
    }
    
    const concreteTotal = (cq * cp).toFixed(2);
    const steelTotal = (sq * sp).toFixed(2);
    const grandTotal = (parseFloat(concreteTotal) + parseFloat(steelTotal)).toFixed(2);

    setResult(`
      <p>تكلفة الباطون: <strong>${concreteTotal} شيكل</strong></p>
      <p>تكلفة الحديد: <strong>${steelTotal} شيكل</strong></p>
      <p>المجموع الكلي: <strong>${grandTotal} شيكل</strong></p>
    `);
    // Placeholder for saving calculation: savePriceCalculationToDB({concreteQuantity: cq, concretePrice: cp, steelQuantity: sq, steelPrice: sp}, grandTotal);
     console.log('حفظ حساب الأسعار:', { type: 'price', inputs: {concreteQuantity: cq, concretePrice: cp, steelQuantity: sq, steelPrice: sp}, result: grandTotal });
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 shadow-form-container border-app-gold">
      <CardHeader>
        <CardTitle className="text-app-red text-xl">حساب أسعار الحديد والباطون</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div>
            <Label htmlFor="concreteQuantity" className="block mb-1 font-bold text-gray-700">كمية الباطون (م³):</Label>
            <Input type="number" id="concreteQuantity" value={concreteQuantity} onChange={(e) => setConcreteQuantity(e.target.value)} step="0.01" required className="text-right" />
          </div>
          <div>
            <Label htmlFor="concretePrice" className="block mb-1 font-bold text-gray-700">سعر المتر المكعب من الباطون (شيكل):</Label>
            <Input type="number" id="concretePrice" value={concretePrice} onChange={(e) => setConcretePrice(e.target.value)} step="0.01" required className="text-right" />
          </div>
          <div>
            <Label htmlFor="steelQuantity" className="block mb-1 font-bold text-gray-700">كمية الحديد (كغم):</Label>
            <Input type="number" id="steelQuantity" value={steelQuantity} onChange={(e) => setSteelQuantity(e.target.value)} step="0.01" required className="text-right" />
          </div>
          <div>
            <Label htmlFor="steelPrice" className="block mb-1 font-bold text-gray-700">سعر الكيلوغرام من الحديد (شيكل):</Label>
            <Input type="number" id="steelPrice" value={steelPrice} onChange={(e) => setSteelPrice(e.target.value)} step="0.01" required className="text-right" />
          </div>
          <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold">حساب</Button>
        </form>
        {result && (
          <div 
            id="priceResult" 
            className="mt-6 p-4 bg-gray-100 rounded-md text-app-red font-bold border-r-4 border-app-red text-right"
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PriceForm;
