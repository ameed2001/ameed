"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SteelFormProps {
  category: string;
}

const SteelForm = ({ category }: SteelFormProps) => {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [steelDensity, setSteelDensity] = useState('7850'); // Default from user HTML
  const [steelPercentage, setSteelPercentage] = useState('2'); // Default from user HTML
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const L = parseFloat(length);
    const W = parseFloat(width);
    const H = parseFloat(height);
    const density = parseFloat(steelDensity);
    const percentage = parseFloat(steelPercentage) / 100;

    if (isNaN(L) || isNaN(W) || isNaN(H) || isNaN(density) || isNaN(percentage) || L <= 0 || W <= 0 || H <= 0 || density <= 0 || percentage <= 0) {
      setResult("الرجاء إدخال قيم صالحة لجميع الحقول.");
      return;
    }
    
    const volume = L * W * H;
    const steelQuantity = (volume * density * percentage).toFixed(2);
    const steelInTons = (parseFloat(steelQuantity) / 1000).toFixed(2);

    setResult(`
      <p>الكمية المطلوبة من الحديد لـ "${category}":</p>
      <p><strong>${steelQuantity} كيلوغرام</strong></p>
      <p>وهذا يعادل حوالي <strong>${steelInTons}</strong> طن</p>
    `);
    // Placeholder for saving calculation: saveCalculationToDB('steel', category, {length: L, width: W, height: H, steelDensity: density, steelPercentage: parseFloat(steelPercentage)}, steelQuantity);
    console.log('حفظ حساب الحديد:', { type: 'steel', category, inputs: { length: L, width: W, height: H, steelDensity: density, steelPercentage: parseFloat(steelPercentage) }, result: steelQuantity });
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 shadow-form-container border-app-gold">
      <CardHeader>
        <CardTitle className="text-app-red text-xl">حساب كميات الحديد - {category}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div>
            <Label htmlFor="length" className="block mb-1 font-bold text-gray-700">الطول (متر):</Label>
            <Input type="number" id="length" value={length} onChange={(e) => setLength(e.target.value)} step="0.01" required className="text-right" />
          </div>
          <div>
            <Label htmlFor="width" className="block mb-1 font-bold text-gray-700">العرض (متر):</Label>
            <Input type="number" id="width" value={width} onChange={(e) => setWidth(e.target.value)} step="0.01" required className="text-right" />
          </div>
          <div>
            <Label htmlFor="height" className="block mb-1 font-bold text-gray-700">الارتفاع/السماكة (متر):</Label>
            <Input type="number" id="height" value={height} onChange={(e) => setHeight(e.target.value)} step="0.01" required className="text-right" />
          </div>
          <div>
            <Label htmlFor="steelDensity" className="block mb-1 font-bold text-gray-700">كثافة الحديد (كغم/م³):</Label>
            <Input type="number" id="steelDensity" value={steelDensity} onChange={(e) => setSteelDensity(e.target.value)} required className="text-right" />
          </div>
          <div>
            <Label htmlFor="steelPercentage" className="block mb-1 font-bold text-gray-700">نسبة الحديد (%):</Label>
            <Input type="number" id="steelPercentage" value={steelPercentage} onChange={(e) => setSteelPercentage(e.target.value)} step="0.1" required className="text-right" />
          </div>
          <Button type="submit" className="w-full bg-app-red hover:bg-red-700 text-white font-bold">حساب</Button>
        </form>
        {result && (
          <div 
            className="mt-6 p-4 bg-gray-100 rounded-md text-app-red font-bold border-r-4 border-app-red text-right"
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SteelForm;
