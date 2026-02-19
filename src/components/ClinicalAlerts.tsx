import { clinicalAlerts, type ClinicalAlert } from "@/lib/mockData";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

const ClinicalAlerts = () => {
  const [alerts, setAlerts] = useState(clinicalAlerts);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, acknowledged: true, acknowledgedBy: "Dr. S. Chen", acknowledgedAt: new Date().toISOString() }
          : a
      )
    );
  };

  const hardAlerts = alerts.filter((a) => a.type === "hard" && !a.acknowledged);
  const softAlerts = alerts.filter((a) => a.type === "soft" && !a.acknowledged);
  const reviewed = alerts.filter((a) => a.acknowledged);

  return (
    <aside className="w-72 border-l bg-card shrink-0 flex flex-col overflow-y-auto">
      <div className="px-3 py-3 border-b">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 text-risk-high" />
          Clinical Alerts
          {hardAlerts.length > 0 && (
            <span className="ml-auto risk-badge risk-badge-high text-[10px]">{hardAlerts.length}</span>
          )}
        </h3>
      </div>

      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {hardAlerts.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-risk-high-foreground mb-1.5">
              Hard Stop Alerts
            </p>
            {hardAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
            ))}
          </div>
        )}

        {softAlerts.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-risk-moderate-foreground mb-1.5">
              Soft Alerts
            </p>
            {softAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
            ))}
          </div>
        )}

        {reviewed.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Recently Reviewed
            </p>
            {reviewed.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

const AlertCard = ({
  alert,
  onAcknowledge,
}: {
  alert: ClinicalAlert;
  onAcknowledge: (id: string) => void;
}) => (
  <div className={`clinical-alert ${alert.type === "hard" ? "clinical-alert-hard" : "clinical-alert-soft"} ${alert.acknowledged ? "opacity-60" : ""}`}>
    <p className="font-semibold text-xs leading-tight">{alert.title}</p>
    <p className="text-xs mt-1 leading-relaxed opacity-90">{alert.description}</p>
    <div className="flex items-center justify-between mt-2">
      <span className="text-[10px] opacity-60 flex items-center gap-1">
        <Clock className="h-2.5 w-2.5" />
        {new Date(alert.timestamp).toLocaleDateString()}
      </span>
      {alert.acknowledged ? (
        <span className="text-[10px] flex items-center gap-1 text-risk-safe-foreground">
          <CheckCircle2 className="h-3 w-3" />
          {alert.acknowledgedBy}
        </span>
      ) : (
        <button
          onClick={() => onAcknowledge(alert.id)}
          className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-card text-foreground hover:bg-muted transition-colors"
        >
          Acknowledge
        </button>
      )}
    </div>
  </div>
);

export default ClinicalAlerts;
