import BreadcrumbNav from "@/components/BreadcrumbNav";
import { currentPatient, geneDrugInteractions, riskSummary } from "@/lib/mockData";
import { FileText, Download, ToggleLeft, ToggleRight, Printer, User } from "lucide-react";
import { useState } from "react";

const Reports = () => {
  const [patientFriendly, setPatientFriendly] = useState(false);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <BreadcrumbNav items={[{ label: "Dashboard", href: "/" }, { label: "Reports" }]} />
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Pharmacogenomic Report</h1>
              <p className="text-xs text-muted-foreground">Generated for {currentPatient.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPatientFriendly(!patientFriendly)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border bg-card hover:bg-muted transition-colors"
            >
              {patientFriendly ? <ToggleRight className="h-4 w-4 text-primary" /> : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
              Patient-Friendly Version
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded border bg-card hover:bg-muted transition-colors">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
          </div>
        </div>

        {/* Report Preview */}
        <div className="rounded-md border bg-card p-6 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-base font-bold text-foreground">
              {patientFriendly ? "Your Medication & Genetics Report" : "Pharmacogenomic Clinical Summary"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Report Date: {new Date().toLocaleDateString()} | Confidential Medical Record
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Patient</p>
              <p className="font-medium">{currentPatient.name}</p>
              <p className="text-muted-foreground text-xs">{currentPatient.age}y, {currentPatient.sex} | MRN: {currentPatient.mrn}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1">Diagnosis</p>
              <p className="text-xs">{currentPatient.diagnosis}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">
              {patientFriendly ? "How Your Genes Affect Your Medications" : "Genotype Summary"}
            </p>
            <table className="clinical-table">
              <thead>
                <tr className="bg-muted/50">
                  <th>Gene</th>
                  <th>Result</th>
                  <th>{patientFriendly ? "What This Means" : "Phenotype"}</th>
                </tr>
              </thead>
              <tbody>
                {[...new Map(geneDrugInteractions.map(g => [g.gene, g])).values()].map((g) => (
                  <tr key={g.gene}>
                    <td className="font-medium">{g.gene}</td>
                    <td><span className="genotype-box">{g.genotype}</span></td>
                    <td className="text-sm">
                      {patientFriendly
                        ? g.phenotype === "Normal Metabolizer"
                          ? "Your body processes this type of medication normally."
                          : "Your body may process some medications differently than most people."
                        : g.phenotype}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">
              {patientFriendly ? "Medication Recommendations" : "Risk Categorization & Recommendations"}
            </p>
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 rounded border">
                <p className="text-xl font-bold text-risk-high">{riskSummary.high}</p>
                <p className="text-[10px] text-muted-foreground">{patientFriendly ? "Needs Change" : "High Risk"}</p>
              </div>
              <div className="text-center p-3 rounded border">
                <p className="text-xl font-bold text-risk-moderate">{riskSummary.moderate}</p>
                <p className="text-[10px] text-muted-foreground">{patientFriendly ? "Adjust Dose" : "Dose Adj."}</p>
              </div>
              <div className="text-center p-3 rounded border">
                <p className="text-xl font-bold text-risk-safe">{riskSummary.safe}</p>
                <p className="text-[10px] text-muted-foreground">{patientFriendly ? "OK to Use" : "Safe"}</p>
              </div>
              <div className="text-center p-3 rounded border">
                <p className="text-xl font-bold text-risk-unknown">{riskSummary.unknown}</p>
                <p className="text-[10px] text-muted-foreground">{patientFriendly ? "Unknown" : "No Data"}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              <p>Physician Signature: ____________________________</p>
              <p className="mt-1 flex items-center gap-1"><User className="h-3 w-3" /> Dr. Sarah Chen, MD | Pharmacogenomics</p>
            </div>
            <div className="text-[10px] text-muted-foreground text-right">
              <p>CPIC Guidelines v4.2</p>
              <p>HIPAA Compliant Document</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
