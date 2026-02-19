import { Search, Bell, User, Shield } from "lucide-react";
import { useState } from "react";

const TopNav = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="topbar h-12 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-topbar-foreground opacity-80" />
          <span className="font-semibold text-sm tracking-tight text-topbar-foreground">
            PGx<span className="opacity-60 ml-1 font-normal">Clinical Decision Support</span>
          </span>
        </div>
        <span className="text-topbar-foreground opacity-30">|</span>
        <span className="text-xs text-topbar-foreground opacity-60">Pharmacogenomic Risk Profile</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-topbar-foreground opacity-40" />
          <input
            type="text"
            placeholder="Search patient by MRN or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 w-64 rounded bg-topbar-foreground/10 pl-8 pr-3 text-xs text-topbar-foreground placeholder:text-topbar-foreground/40 border-0 outline-none focus:bg-topbar-foreground/15 transition-colors"
          />
        </div>
        <button className="relative p-1.5 rounded hover:bg-topbar-foreground/10 transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4 text-topbar-foreground opacity-70" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-risk-high" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-topbar-foreground/15">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-xs text-topbar-foreground opacity-80">Dr. S. Chen</span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
