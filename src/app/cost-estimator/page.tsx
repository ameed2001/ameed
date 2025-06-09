"use client";

import OwnerAppLayout from "@/components/owner/OwnerAppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PriceForm from "@/components/forms/PriceForm";
import { DollarSign } from "lucide-react";

export default function CostEstimatorPage() {
  return (
    <OwnerAppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="bg-white/95 shadow-xl">
          <CardHeader className="text-center">
            <DollarSign className="mx-auto h-12 w-12 text-app-gold mb-3" />
            <CardTitle className="text-3xl font-bold text-app-red">حساب أسعار المواد</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              أدخل كميات المواد وأسعار الوحدات لتقدير التكلفة الإجمالية.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PriceForm />
          </CardContent>
        </Card>
      </div>
    </OwnerAppLayout>
  );
}
