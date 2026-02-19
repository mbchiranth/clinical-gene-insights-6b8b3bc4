import { useSearchParams, useNavigate } from "react-router-dom";
import { geneDetails, type RiskLevel } from "@/lib/mockData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { Dna, ExternalLink, Activity, Truck, AlertTriangle, ArrowLeft } from "lucide-react";

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

const GeneInsights = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedGene = searchParams.get("gene");

  if (selectedGene) {
    const gene = geneDetails.find((g) => g.gene === selectedGene);
    if (!gene) return <div className="p-8 text-muted-foreground">Gene not found.</div>;

    return (
      <div className="flex flex-col flex-1 min-h-0">
        <BreadcrumbNav
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Gene Insights", href: "/gene-insights" },
            { label: gene.gene },
          ]}
        />
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl">
          <button onClick={() => navigate("/gene-insights")} className="text-xs text-primary flex items-center gap-1 hover:underline mb-2">
            <ArrowLeft className="h-3 w-3" /> All Genes
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
              <Dna className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{gene.gene}</h1>
              <p className="text-xs text-muted-foreground">{gene.fullName} — {gene.chromosome}</p>
              <p className="text-sm text-foreground mt-1">{gene.function}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border bg-card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Genotype → Phenotype
              </p>
              <div className="flex items-center gap-3">
                <span className="genotype-box text-base">{gene.genotype}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-sm font-semibold text-foreground">{gene.phenotype}</span>
              </div>
            </div>

            <div className="rounded-md border bg-card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Clinical Impact
              </p>
              <p className="text-sm text-foreground leading-relaxed">{gene.clinicalImpact}</p>
            </div>
          </div>

          <div className="bg-card rounded-md border overflow-hidden">
            <div className="px-4 py-3 border-b">
              <h3 className="text-sm font-semibold text-foreground">Associated Drugs</h3>
            </div>
            <table className="clinical-table">
              <thead>
                <tr className="bg-muted/50">
                  <th>Drug</th>
                  <th>Class</th>
                  <th>Risk</th>
                  <th>Action</th>
                  <th>Alternative</th>
                </tr>
              </thead>
              <tbody>
                {gene.associatedDrugs.map((d) => (
                  <tr key={d.id}>
                    <td className="font-medium">{d.drug}</td>
                    <td className="text-sm">{d.therapeuticClass}</td>
                    <td><span className={riskBadgeClass[d.riskLevel]}>{riskLabel[d.riskLevel]}</span></td>
                    <td className="text-sm max-w-xs">{d.recommendation}</td>
                    <td>
                      {d.alternativeDrug ? (
                        <span className="text-sm text-primary font-medium">{d.alternativeDrug}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-md border bg-card p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Scientific Evidence
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-primary" />
                <span className="text-foreground font-medium">CPIC Level A</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Drug Transport</span>
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-risk-moderate" />
                <span>Toxicity Risk</span>
              </span>
            </div>
            <div className="mt-3 text-xs">
              <a href="https://cpicpgx.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                CPIC Guidelines <ExternalLink className="h-3 w-3" />
              </a>
              <span className="mx-2 text-border">|</span>
              <a href="https://www.pharmgkb.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                PharmGKB <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <BreadcrumbNav items={[{ label: "Dashboard", href: "/" }, { label: "Gene Insights" }]} />
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl">
        <h1 className="text-lg font-bold text-foreground mb-4">Gene Insights</h1>
        <div className="space-y-2">
          {geneDetails.map((gene) => (
            <button
              key={gene.gene}
              onClick={() => navigate(`/gene-insights?gene=${gene.gene}`)}
              className="w-full text-left rounded-md border bg-card p-4 hover:shadow-sm hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-foreground">{gene.gene}</span>
                  <span className="text-xs text-muted-foreground ml-2">{gene.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="genotype-box text-xs">{gene.genotype}</span>
                  <span className="text-xs text-muted-foreground">→</span>
                  <span className="text-xs font-medium text-foreground">{gene.phenotype}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{gene.function}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneInsights;
