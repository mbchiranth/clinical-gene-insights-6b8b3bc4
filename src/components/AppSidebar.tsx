import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Users,
  Pill,
  Dna,
  FileText,
  Settings,
  ShieldCheck,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Patient List", url: "/patients", icon: Users },
  { title: "Drug Search", url: "/drug-search", icon: Pill },
  { title: "Gene Insights", url: "/gene-insights", icon: Dna },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Admin / Guidelines", url: "/admin", icon: Settings },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col border-r bg-sidebar shrink-0 transition-all duration-200 ${
        collapsed ? "w-14" : "w-52"
      }`}
    >
      <div className="flex items-center justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-sidebar-accent transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`border-t p-3 space-y-1.5 ${collapsed ? "px-1.5" : ""}`}>
        {!collapsed && (
          <>
            <div className="compliance-badge">
              <ShieldCheck className="h-3 w-3" />
              <span>HIPAA Secure</span>
            </div>
            <div className="compliance-badge">
              <Activity className="h-3 w-3" />
              <span>Audit Logging On</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              CPIC Guidelines v4.2
            </p>
          </>
        )}
        {collapsed && (
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-risk-safe" />
            <Activity className="h-3.5 w-3.5 text-risk-safe" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default AppSidebar;
