import BreadcrumbNav from "@/components/BreadcrumbNav";
import { Search, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const patients = [
  { id: "PT-2024-00847", name: "Margaret A. Thompson", age: 67, sex: "F", mrn: "MRN-4821903", alerts: 2, riskHigh: 2 },
  { id: "PT-2024-00632", name: "James R. Mitchell", age: 54, sex: "M", mrn: "MRN-3892045", alerts: 1, riskHigh: 1 },
  { id: "PT-2024-01203", name: "Linda M. Garcia", age: 73, sex: "F", mrn: "MRN-5019283", alerts: 0, riskHigh: 0 },
  { id: "PT-2024-00991", name: "Robert K. Williams", age: 45, sex: "M", mrn: "MRN-4103829", alerts: 3, riskHigh: 3 },
  { id: "PT-2024-01456", name: "Susan P. Anderson", age: 62, sex: "F", mrn: "MRN-5238401", alerts: 1, riskHigh: 0 },
];

const PatientList = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.mrn.includes(query) ||
      p.id.includes(query)
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <BreadcrumbNav items={[{ label: "Dashboard", href: "/" }, { label: "Patient List" }]} />
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl space-y-4">
        <h1 className="text-lg font-bold text-foreground">Patient List</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, MRN, or patient ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 rounded-md border bg-card pl-9 pr-4 text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="bg-card rounded-md border overflow-hidden">
          <table className="clinical-table">
            <thead>
              <tr className="bg-muted/50">
                <th>Patient Name</th>
                <th>Age/Sex</th>
                <th>MRN</th>
                <th>ID</th>
                <th>Alerts</th>
                <th>High Risk</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="cursor-pointer" onClick={() => navigate("/")}>
                  <td className="font-medium">{p.name}</td>
                  <td className="text-sm">{p.age}{p.sex}</td>
                  <td className="text-sm font-mono">{p.mrn}</td>
                  <td className="text-sm font-mono">{p.id}</td>
                  <td>
                    {p.alerts > 0 ? (
                      <span className="risk-badge risk-badge-moderate">{p.alerts}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">0</span>
                    )}
                  </td>
                  <td>
                    {p.riskHigh > 0 ? (
                      <span className="risk-badge risk-badge-high">{p.riskHigh}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">0</span>
                    )}
                  </td>
                  <td><ChevronRight className="h-4 w-4 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
