import { geneDrugInteractions, type GeneDrugInteraction, type RiskLevel } from "@/lib/mockData";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

const evidenceBadgeClass: Record<string, string> = {
  A: "evidence-badge evidence-a",
  B: "evidence-badge evidence-b",
  C: "evidence-badge evidence-c",
};

interface GeneDrugTableProps {
  filterRisk?: string | null;
}

const GeneDrugTable = ({ filterRisk }: GeneDrugTableProps) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = filterRisk
    ? geneDrugInteractions.filter((g) => g.riskLevel === filterRisk)
    : geneDrugInteractions;

  return (
    <div className="bg-card rounded-md border overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Gene–Drug Interaction Summary</h3>
        <span className="text-xs text-muted-foreground">{filtered.length} interactions</span>
      </div>
      <div className="overflow-x-auto">
        <table className="clinical-table">
          <thead>
            <tr className="bg-muted/50">
              <th className="w-8"></th>
              <th>Gene</th>
              <th>Genotype</th>
              <th>Phenotype</th>
              <th>Drug</th>
              <th>Risk Level</th>
              <th>Recommendation</th>
              <th className="w-12">Ev.</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <GeneDrugRow
                key={row.id}
                row={row}
                expanded={expandedRow === row.id}
                onToggle={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                onGeneClick={() => navigate(`/gene-insights?gene=${row.gene}`)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GeneDrugRow = ({
  row,
  expanded,
  onToggle,
  onGeneClick,
}: {
  row: GeneDrugInteraction;
  expanded: boolean;
  onToggle: () => void;
  onGeneClick: () => void;
}) => (
  <>
    <tr className="cursor-pointer" onClick={onToggle}>
      <td>
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </td>
      <td>
        <button
          onClick={(e) => { e.stopPropagation(); onGeneClick(); }}
          className="text-primary font-medium hover:underline"
        >
          {row.gene}
        </button>
      </td>
      <td><span className="genotype-box">{row.genotype}</span></td>
      <td className="text-sm">{row.phenotype}</td>
      <td className="font-medium">{row.drug}</td>
      <td><span className={riskBadgeClass[row.riskLevel]}>{riskLabel[row.riskLevel]}</span></td>
      <td className="text-sm max-w-xs">{row.recommendation}</td>
      <td><span className={evidenceBadgeClass[row.evidenceLevel]}>{row.evidenceLevel}</span></td>
    </tr>
    {expanded && (
      <tr>
        <td colSpan={8} className="bg-muted/30 px-8 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Mechanism</p>
              <p className="text-foreground">{row.mechanism}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Guideline Source</p>
              <p className="text-foreground">{row.guidelineSource}</p>
              <a
                href={row.referenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary text-xs mt-1 hover:underline"
              >
                View Reference <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Therapeutic Class</p>
              <p className="text-foreground">{row.therapeuticClass}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Last Updated</p>
              <p className="text-foreground">{row.lastUpdated}</p>
            </div>
          </div>
        </td>
      </tr>
    )}
  </>
);

export default GeneDrugTable;
