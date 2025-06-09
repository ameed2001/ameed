"use client";

import CostEstimatorForm from '@/components/CostEstimatorForm';
import OwnerAppLayout from '@/components/owner/OwnerAppLayout';

export default function CostEstimatorPage() {
  return (
    <OwnerAppLayout>
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <CostEstimatorForm />
      </div>
    </OwnerAppLayout>
  );
}
