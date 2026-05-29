import BreadcrumbNav from "@/components/BreadcrumbNav";
import { Settings, BookOpen, ShieldCheck, Activity, Database } from "lucide-react";

const Admin = () => {
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-risk-high-bg">
      <BreadcrumbNav items={[{ label: "Dashboard", href: "/" }, { label: "Admin / Guidelines" }]} />
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl space-y-4">
        <h1 className="text-lg font-bold text-clinical-blue">Administration & Guidelines</h1>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: BookOpen,
              title: "Clinical Guidelines",
              desc: "CPIC v4.2 • DPWG v3.1 • FDA Table Updated Dec 2024",
              action: "View Guidelines",
            },
            {
              icon: Database,
              title: "Genomic Database",
              desc: "PharmGKB Integration • Last sync: Dec 15, 2024 14:30",
              action: "Manage Sources",
            },
            {
              icon: Activity,
              title: "Audit Log",
              desc: "2,847 events this month • All alerts tracked",
              action: "View Log",
            },
            {
              icon: ShieldCheck,
              title: "Compliance",
              desc: "HIPAA compliant • SOC 2 Type II • GDPR ready",
              action: "View Report",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-md border border-clinical-blue/20 bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-clinical-blue/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-4.5 w-4.5 text-clinical-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-clinical-blue">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  <button className="text-xs text-clinical-blue font-medium mt-2 hover:underline">
                    {item.action} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-clinical-blue/20 bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="h-4 w-4 text-clinical-blue" />
            <h3 className="text-sm font-semibold text-clinical-blue">System Configuration</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-clinical-blue/70 mb-0.5">Alert Threshold</p>
              <p className="font-medium text-foreground">CPIC Level A & B only</p>
            </div>
            <div>
              <p className="text-clinical-blue/70 mb-0.5">Hard Stop Trigger</p>
              <p className="font-medium text-foreground">High Risk + Evidence A</p>
            </div>
            <div>
              <p className="text-clinical-blue/70 mb-0.5">Auto-Report</p>
              <p className="font-medium text-foreground">Enabled for all new patients</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
