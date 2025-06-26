
"use client";

import SimpleCostEstimatorForm from '@/components/SimpleCostEstimatorForm';

// This page is wrapped by the Owner layout by default, so it has the sidebar.
export default function OwnerCostEstimatorPage() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
      <SimpleCostEstimatorForm />
    </div>
  );
}
