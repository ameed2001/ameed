"use client";

import CostEstimatorForm from '@/components/CostEstimatorForm';

// This page is wrapped by the Engineer layout by default, so it has the sidebar.
export default function EngineerCostEstimatorPage() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
      <CostEstimatorForm />
    </div>
  );
}
