
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
    const cq = parseFloat(concreteQuantity);
    const cp = parseFloat(concretePrice);
    const sq = parseFloat(steelQuantity);
    const sp = parseFloat(steelPrice);

    if (isNaN(cq) || isNaN(cp) || isNaN(sq) || isNaN(sp) || cq < 0 || cp < 0 || sq < 0 || sp < 0) {
      setResult("<p class='text-red-600'>الرجاء إدخال قيم صالحة لجميع الحقول.</p>");
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
     console.log('حفظ حساب الأسعار:', { type: 'price', inputs: {concreteQuantity: cq, concretePrice: cp, steelQuantity: sq, steelPrice: sp}, result: grandTotal });
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
            <Input type="number" id="concreteQuantity" value={concreteQuantity} onChange={(e) => setConcreteQuantity(e.target.value)} step="0.01" required className="text-right text-base" placeholder="مثال: 20"/>
          </div>
          <div className="form-group">
            <Label htmlFor="concretePrice" className="block mb-1.5 font-bold text-gray-700">سعر المتر المكعب من الباطون (شيكل):</Label>
            <Input type="number" id="concretePrice" value={concretePrice} onChange={(e) => setConcretePrice(e.target.value)} step="0.01" required className="text-right text-base" placeholder="مثال: 350"/>
          </div>
          <div className="form-group">
            <Label htmlFor="steelQuantity" className="block mb-1.5 font-bold text-gray-700">كمية الحديد (كغم):</Label>
            <Input type="number" id="steelQuantity" value={steelQuantity} onChange={(e) => setSteelQuantity(e.target.value)} step="0.01" required className="text-right text-base" placeholder="مثال: 1500"/>
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
            className="calculation-result-display" // Applied class from globals.css
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PriceForm;

    