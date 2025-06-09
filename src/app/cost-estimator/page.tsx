
"use client";

import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PriceForm from "@/components/forms/PriceForm";
import { DollarSign } from "lucide-react";

export default function CostEstimatorPage() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6"> {/* Increased max-width for better layout */}
        <Card className="bg-white/95 shadow-xl border-0 rounded-lg">
          <CardHeader className="text-center">
            <DollarSign className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl font-bold text-app-red">حساب أسعار المواد</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              أدخل كميات المواد وأسعار الوحدات لتقدير التكلفة الإجمالية، واحفظ تقديراتك.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 md:px-6">
            <PriceForm />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
