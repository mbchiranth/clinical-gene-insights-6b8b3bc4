import { geneDrugInteractions, type RiskLevel } from "@/lib/mockData";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const riskColorMap: Record<RiskLevel, string> = {
  high: "hsl(0, 72%, 51%)",
  moderate: "hsl(38, 92%, 50%)",
  safe: "hsl(142, 60%, 40%)",
  unknown: "hsl(210, 10%, 58%)",
};

const RiskVisualizationPanel = () => {
  // Gene risk heatmap data
  const geneRiskData = Object.values(
    geneDrugInteractions.reduce((acc, item) => {
      if (!acc[item.gene]) {
        acc[item.gene] = { gene: item.gene, high: 0, moderate: 0, safe: 0, unknown: 0, total: 0 };
      }
      acc[item.gene][item.riskLevel]++;
      acc[item.gene].total++;
      return acc;
    }, {} as Record<string, any>)
  );

  // Risk distribution bar chart data
  const riskDistribution = [
    { name: "High", count: geneDrugInteractions.filter(g => g.riskLevel === "high").length, color: riskColorMap.high },
    { name: "Moderate", count: geneDrugInteractions.filter(g => g.riskLevel === "moderate").length, color: riskColorMap.moderate },
    { name: "Safe", count: geneDrugInteractions.filter(g => g.riskLevel === "safe").length, color: riskColorMap.safe },
    { name: "Unknown", count: geneDrugInteractions.filter(g => g.riskLevel === "unknown").length, color: riskColorMap.unknown },
  ];

  // Radar data for gene complexity
  const radarData = geneRiskData.map(g => ({
    gene: g.gene,
    riskScore: g.high * 3 + g.moderate * 2 + g.unknown * 1,
    interactions: g.total,
  }));

  const getRiskCellColor = (risk: RiskLevel) => {
    const opacity: Record<RiskLevel, string> = {
      high: "bg-[hsl(0,72%,51%)]",
      moderate: "bg-[hsl(38,92%,50%)]",
      safe: "bg-[hsl(142,60%,40%)]",
      unknown: "bg-[hsl(210,10%,58%)]",
    };
    return opacity[risk];
  };

  return (
    <div className="bg-card rounded-md border p-4 space-y-5">
      <h2 className="text-sm font-semibold text-foreground">Risk Factor Visualization</h2>

      {/* Heat Map Grid */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Gene–Drug Risk Heat Map
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">Gene</th>
                {geneDrugInteractions.map(i => (
                  <th key={i.id} className="py-1.5 px-1 text-center text-muted-foreground font-medium truncate max-w-[60px]" title={i.drug}>
                    {i.drug.slice(0, 6)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...new Set(geneDrugInteractions.map(i => i.gene))].map(gene => (
                <tr key={gene}>
                  <td className="py-1 px-2 font-mono font-medium text-foreground">{gene}</td>
                  {geneDrugInteractions.map(i => {
                    const match = i.gene === gene;
                    return (
                      <td key={i.id} className="py-1 px-1 text-center">
                        {match ? (
                          <div
                            className={`w-5 h-5 mx-auto rounded-sm ${getRiskCellColor(i.riskLevel)}`}
                            title={`${i.gene} + ${i.drug}: ${i.riskLevel}`}
                          />
                        ) : (
                          <div className="w-5 h-5 mx-auto rounded-sm bg-muted" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[hsl(0,72%,51%)]" /> High</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[hsl(38,92%,50%)]" /> Moderate</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[hsl(142,60%,40%)]" /> Safe</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[hsl(210,10%,58%)]" /> Unknown</span>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Risk Distribution Bar */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Risk Distribution
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution} barSize={28}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215,12%,50%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215,12%,50%)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid hsl(210,18%,87%)" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {riskDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gene Risk Radar */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Gene Risk Profile
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="hsl(210,18%,87%)" />
                <PolarAngleAxis dataKey="gene" tick={{ fontSize: 9, fill: "hsl(215,12%,50%)" }} />
                <PolarRadiusAxis tick={{ fontSize: 8 }} axisLine={false} />
                <Radar
                  name="Risk Score"
                  dataKey="riskScore"
                  stroke="hsl(0,72%,51%)"
                  fill="hsl(0,72%,51%)"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskVisualizationPanel;
