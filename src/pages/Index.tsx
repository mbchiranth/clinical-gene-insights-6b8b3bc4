import { useState } from "react";
import PatientBanner from "@/components/PatientBanner";
import RiskSummaryCards from "@/components/RiskSummaryCards";
import GeneDrugTable from "@/components/GeneDrugTable";
import ClinicalAlerts from "@/components/ClinicalAlerts";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import RiskVisualizationPanel from "@/components/RiskVisualizationPanel";
import BreadcrumbNav from "@/components/BreadcrumbNav";

const Index = () => {
  const [riskFilter, setRiskFilter] = useState<string | null>(null);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <BreadcrumbNav items={[{ label: "Dashboard" }]} />
      <PatientBanner />

      <div className="flex flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Risk Summary</h2>
            <RiskSummaryCards
              onSelectRisk={(risk) => setRiskFilter(riskFilter === risk ? null : risk)}
            />
            {riskFilter && (
              <button
                onClick={() => setRiskFilter(null)}
                className="text-xs text-primary mt-2 hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>

          <GeneDrugTable filterRisk={riskFilter} />

          <RiskVisualizationPanel />

          <AIInsightsPanel />
        </div>

        <ClinicalAlerts />
      </div>
    </div>
  );
};

export default Index;
