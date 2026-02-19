import { useState } from "react";
import { geneDrugInteractions, type RiskLevel } from "@/lib/mockData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { Search, Shield, ArrowRight } from "lucide-react";

const riskBadgeClass: Record<RiskLevel, string> = {
  high: "risk-badge risk-badge-high",
  moderate: "risk-badge risk-badge-moderate",
  safe: "risk-badge risk-badge-safe",
  unknown: "risk-badge risk-badge-unknown",
};

const riskLabel: Record<RiskLevel, string> = {
  high: "High Risk",
  moderate: "Dose Adj.",
  safe: "Standard",
  unknown: "No Data",
};

const actionLabel: Record<RiskLevel, string> = {
  high: "Avoid — Use Alternative",
  moderate: "Reduce Dose by 50%",
  safe: "Use Standard Dose",
  unknown: "Insufficient Data — Monitor",
};

const confidenceLabel: Record<string, { label: string; width: string }> = {
  A: { label: "High Evidence", width: "90%" },
  B: { label: "Moderate Evidence", width: "60%" },
  C: { label: "Limited Evidence", width: "30%" },
};

const DrugSearch = () => {
  const [query, setQuery] = useState("");
  const uniqueDrugs = [...new Set(geneDrugInteractions.map((g) => g.drug))];
  const filtered = query
    ? uniqueDrugs.filter((d) => d.toLowerCase().includes(query.toLowerCase()))
    : uniqueDrugs;

  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);
  const drugInteractions = selectedDrug
    ? geneDrugInteractions.filter((g) => g.drug === selectedDrug)
    : [];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <BreadcrumbNav
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Drug Search" },
          ...(selectedDrug ? [{ label: selectedDrug }] : []),
        ]}
      />
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search drug by name..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedDrug(null); }}
            className="w-full h-10 rounded-md border bg-card pl-9 pr-4 text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {!selectedDrug && (
          <div className="space-y-1">
            {filtered.map((drug) => (
              <button
                key={drug}
                onClick={() => { setSelectedDrug(drug); setQuery(drug); }}
                className="w-full text-left rounded-md border bg-card px-4 py-3 hover:shadow-sm hover:border-primary/30 transition-all flex items-center justify-between"
              >
                <span className="font-medium text-sm text-foreground">{drug}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

        {selectedDrug && drugInteractions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedDrug}</h2>
                <p className="text-xs text-muted-foreground">
                  {drugInteractions[0].therapeuticClass} — Patient-specific genomic risk assessment
                </p>
              </div>
            </div>

            {drugInteractions.map((interaction) => (
              <div key={interaction.id} className="rounded-md border bg-card overflow-hidden">
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-muted-foreground">Related Gene</p>
                      <p className="text-sm font-semibold text-foreground">{interaction.gene}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-muted-foreground">Patient Phenotype</p>
                      <p className="text-sm font-medium text-foreground">{interaction.phenotype}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-muted-foreground">Risk</p>
                      <span className={riskBadgeClass[interaction.riskLevel]}>{riskLabel[interaction.riskLevel]}</span>
                    </div>
                  </div>

                  <div className="rounded border bg-muted/50 p-3">
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Clinical Action</p>
                    <p className="text-sm font-semibold text-foreground">{actionLabel[interaction.riskLevel]}</p>
                    <p className="text-xs text-muted-foreground mt-1">{interaction.recommendation}</p>
                  </div>

                  {interaction.alternativeDrug && (
                    <div className="rounded border p-3 border-primary/20 bg-clinical-blue-light">
                      <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">
                        Alternative Medication
                      </p>
                      <p className="text-sm font-semibold text-primary">{interaction.alternativeDrug}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1.5">
                      Confidence Level
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: confidenceLabel[interaction.evidenceLevel].width }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        {confidenceLabel[interaction.evidenceLevel].label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugSearch;
