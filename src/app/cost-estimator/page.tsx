
"use client";

import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import PriceForm with SSR turned off
const PriceFormWithNoSSR = dynamic(() => import('@/components/forms/PriceForm'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col justify-center items-center h-64 text-center">
      <Loader2 className="animate-spin h-12 w-12 text-app-gold" />
      <p className="mt-3 text-lg text-gray-600">جاري تحميل نموذج حساب الأسعار...</p>
    </div>
  ),
});

export default function CostEstimatorPage() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6">
        <Card className="bg-white/95 shadow-xl border-0 rounded-lg">
          <CardHeader className="text-center">
            <DollarSign className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl font-bold text-app-red">حساب أسعار المواد</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              أدخل كميات المواد وأسعار الوحدات لتقدير التكلفة الإجمالية، واحفظ تقديراتك.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 md:px-6">
            <PriceFormWithNoSSR /> {/* Use the dynamically imported component */}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
