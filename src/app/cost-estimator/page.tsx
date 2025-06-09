
import AppLayout from "@/components/AppLayout";
import CostEstimatorForm from "@/components/CostEstimatorForm";

export default function CostEstimatorPage() {
  return (
    <AppLayout>
      {/* The body class from HTML is applied in globals.css or Tailwind config if global */}
      {/* For page-specific background, a wrapper div might be needed if AppLayout doesn't handle it */}
      <div className="cost-estimator-body min-h-screen py-8 px-4">
        <CostEstimatorForm />
      </div>
    </AppLayout>
  );
}
