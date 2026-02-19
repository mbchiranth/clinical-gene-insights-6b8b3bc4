import { Sparkles, TrendingDown, ArrowRight } from "lucide-react";

const AIInsightsPanel = () => {
  return (
    <div className="bg-card rounded-md border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">AI Clinical Insights</h3>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">Beta</span>
      </div>

      <div className="space-y-3">
        <div className="rounded border bg-clinical-blue-light p-3">
          <p className="text-xs text-foreground leading-relaxed">
            <span className="font-semibold">Recommendation:</span> Based on this patient's CYP2C9 (*1/*3) and
            VKORC1 (-1639 A/G) profile, <span className="font-semibold text-primary">apixaban</span> is
            recommended as a safer alternative to warfarin. Apixaban does not require CYP2C9-mediated metabolism
            and offers predictable pharmacokinetics without INR monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-risk-safe-foreground">
            <TrendingDown className="h-3.5 w-3.5" />
            <span className="font-medium">72% reduction in predicted bleeding risk</span>
          </div>
        </div>

        <div className="rounded border p-3">
          <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1.5">Risk Distribution</p>
          <div className="flex items-end gap-1 h-12">
            <div className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full bg-risk-high rounded-t" style={{ height: "75%" }} />
              <span className="text-[9px] text-muted-foreground">High</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full bg-risk-moderate rounded-t" style={{ height: "50%" }} />
              <span className="text-[9px] text-muted-foreground">Mod</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full bg-risk-safe rounded-t" style={{ height: "90%" }} />
              <span className="text-[9px] text-muted-foreground">Safe</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full bg-risk-unknown rounded-t" style={{ height: "25%" }} />
              <span className="text-[9px] text-muted-foreground">N/A</span>
            </div>
          </div>
        </div>

        <button className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
          View Full Analysis <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
