import { riskSummary } from "@/lib/mockData";
import { AlertTriangle, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

interface RiskSummaryCardsProps {
  onSelectRisk?: (risk: string) => void;
}

const cards = [
  {
    key: "high",
    label: "High Risk",
    sublabel: "Contraindicated",
    count: riskSummary.high,
    icon: AlertTriangle,
    cardClass: "risk-card risk-card-high",
    countClass: "text-risk-high",
  },
  {
    key: "moderate",
    label: "Dose Adjustment",
    sublabel: "Required",
    count: riskSummary.moderate,
    icon: AlertCircle,
    cardClass: "risk-card risk-card-moderate",
    countClass: "text-risk-moderate",
  },
  {
    key: "safe",
    label: "Safe to Use",
    sublabel: "Standard Dosing",
    count: riskSummary.safe,
    icon: CheckCircle,
    cardClass: "risk-card risk-card-safe",
    countClass: "text-risk-safe",
  },
  {
    key: "unknown",
    label: "No Genomic Data",
    sublabel: "Unknown",
    count: riskSummary.unknown,
    icon: HelpCircle,
    cardClass: "risk-card risk-card-unknown",
    countClass: "text-risk-unknown",
  },
];

const RiskSummaryCards = ({ onSelectRisk }: RiskSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => (
        <button
          key={card.key}
          className={card.cardClass}
          onClick={() => onSelectRisk?.(card.key)}
          aria-label={`${card.label}: ${card.count} medications`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-2xl font-bold ${card.countClass}`}>{card.count}</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{card.label}</p>
              <p className="text-xs text-muted-foreground">{card.sublabel}</p>
            </div>
            <card.icon className={`h-5 w-5 mt-0.5 ${card.countClass} opacity-60`} />
          </div>
        </button>
      ))}
    </div>
  );
};

export default RiskSummaryCards;
