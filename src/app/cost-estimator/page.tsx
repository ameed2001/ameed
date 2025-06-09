
"use client"; // Ensure this page is a client component

import CostEstimatorForm from '@/components/CostEstimatorForm';
import AppLayout from '@/components/AppLayout'; // Using AppLayout

export default function CostEstimatorPage() {
  return (
    <AppLayout>
      <div className="min-h-screen py-8 px-4 cost-estimator-body"> {/* Applied class from globals.css */}
        <CostEstimatorForm />
      </div>
    </AppLayout>
  );
}
