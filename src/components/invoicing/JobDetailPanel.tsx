import { useState } from "react";
import { X, Clock, FlaskConical, Pencil, Calendar, Crosshair, UserCircle } from "lucide-react";

const metrics = [
  { value: "18%", label: "Downtime Reduction" },
  { value: "12%", label: "Maintenance Cost Efficiency Gain" },
  { value: "92%", label: "SLA Adherence" },
  { value: "< 2h", label: "Optimization Recalculation Cycle Time to Resolution" },
];

const agentActions = [
  "Scans previous invoice data and updates the tolerances",
  "Flags deviations greater than 2.2% vs budget",
  "Analyzes underlying drivers (price, volume, cost)",
  "Escalates necessary exceptions",
  "Generates a structured summary for review",
];

const businessImpact = [
  "Reduced unplanned downtime",
  "Improved maintenance resource utilization",
  "Lower spare parts emergency procurement",
  "More predictable production stability",
];

const governance = [
  "No emergency WO auto-bundling without approval",
  "No capacity overload beyond threshold",
  "No cost impact > €X without escalation",
  "Full traceability of optimization rationale",
];

const clusters = [
  { id: "OPT-300", assets: "P3 + P6", risk: "High", downtime: "4.2h", capacity: "Within limits", status: "Proposed", statusColor: "text-primary" },
  { id: "OPT-301", assets: "Pump P3 + P6", risk: "Medium", downtime: "3.1h", capacity: "Low", status: "Auto-Scheduled", statusColor: "text-primary" },
  { id: "OPT-302", assets: "Compressor C7", risk: "Medium", downtime: "2.5h", capacity: "Requires shift adjustment", status: "Awaiting Approval", statusColor: "text-warning" },
  { id: "OPT-303", assets: "HX4 + Valve V2", risk: "High", downtime: "1.3h", capacity: "None", status: "Auto-Executed", statusColor: "text-primary" },
  { id: "OPT-304", assets: "Conveyor L1", risk: "Low", downtime: "2.8h", capacity: "Exceeds cost threshold", status: "Escalated", statusColor: "text-destructive" },
];

interface JobDetailPanelProps {
  open: boolean;
  onClose: () => void;
  onActivate?: () => void;
}

const BulletList = ({ items, title }: { items: string[]; title: string }) => (
  <div className="rounded-xl border border-border p-4">
    <h4 className="text-sap-sm font-semibold text-foreground mb-3">{title}</h4>
    <ul className="space-y-2 text-sap-sm text-foreground">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-muted-foreground mt-1.5 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ConfigSection = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <div className="py-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon size={16} className="text-primary" />
      </div>
      <h4 className="text-sap-sm font-bold text-foreground">{title}</h4>
      <button className="text-muted-foreground hover:text-foreground">
        <Pencil size={14} />
      </button>
    </div>
    <div className="pl-11 text-sap-sm text-foreground space-y-1.5">
      {children}
    </div>
  </div>
);

const TestView = () => {
  const [activeSubTab, setActiveSubTab] = useState<"live" | "history" | "definition">("definition");
  const subTabs = [
    { key: "live" as const, label: "Live Status" },
    { key: "history" as const, label: "Run History" },
    { key: "definition" as const, label: "Job Definition" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Sub-tabs */}
      <div className="px-7 border-b border-border">
        <div className="flex gap-6">
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key)}
              className={`py-3 text-sap-sm font-medium border-b-2 transition-colors ${
                activeSubTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job Definition content */}
      {activeSubTab === "definition" && (
        <div className="px-7 py-6">
          <h3 className="text-sap-lg font-bold text-foreground mb-2">Job Configuration</h3>

          <ConfigSection icon={Calendar} title="Schedule">
            <p>Frequency: <span className="font-semibold">Weekly</span></p>
            <p>Day: <span className="font-semibold">Monday</span></p>
            <p>Time: <span className="font-semibold">08:00 CET</span></p>
            <p className="text-primary mt-2">Auto-trigger Enabled</p>
          </ConfigSection>

          <div className="h-px bg-border" />

          <ConfigSection icon={Crosshair} title="Scope">
            <p className="mb-2">Organizational Scope:</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex gap-2"><span>•</span><span>Listen to vendor master data change events (bank details only)</span></li>
              <li className="flex gap-2"><span>•</span><span>Company codes: <span className="font-semibold text-foreground">1000, 2000, 3000</span></span></li>
              <li className="flex gap-2"><span>•</span><span>All vendors (excluding internal vendors)</span></li>
            </ul>
          </ConfigSection>

          <div className="h-px bg-border" />

          <ConfigSection icon={UserCircle} title="User Involvement">
            <p className="mb-2">Users will be asked to:</p>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex gap-2"><span>•</span><span>Approve / reject material journal proposals</span></li>
              <li className="flex gap-2"><span>•</span><span>Approve / reject material journal proposals</span></li>
              <li className="flex gap-2"><span>•</span><span>Provide explanation for deviations</span></li>
              <li className="flex gap-2"><span>•</span><span>Delegate review if required</span></li>
            </ul>
          </ConfigSection>

          <div className="h-px bg-border" />
        </div>
      )}

      {activeSubTab === "live" && (
        <div className="px-7 py-6 text-sap-sm text-muted-foreground">
          <p>Live status monitoring will appear here when the job is active.</p>
        </div>
      )}

      {activeSubTab === "history" && (
        <div className="px-7 py-6 text-sap-sm text-muted-foreground">
          <p>Run history will appear here after the job has been executed.</p>
        </div>
      )}

      {/* Live Optimization Clusters - always visible */}
      <div className="px-7 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sap-lg font-semibold text-foreground">Live Optimization Clusters</h3>
          <button className="text-sap-xs text-primary font-medium hover:underline flex items-center gap-1">
            Export Logs
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sap-xs">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Cluster ID</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Assets</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Risk Level</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Downtime Avoided</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Capacity Impact</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {clusters.map((c, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-2.5 text-primary font-medium">{c.id}</td>
                  <td className="px-4 py-2.5 text-foreground">{c.assets}</td>
                  <td className="px-4 py-2.5 text-foreground">{c.risk}</td>
                  <td className="px-4 py-2.5 text-foreground">{c.downtime}</td>
                  <td className="px-4 py-2.5 text-foreground">{c.capacity}</td>
                  <td className={`px-4 py-2.5 font-medium ${c.statusColor}`}>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2.5 border-t border-border">
            <button className="text-primary text-sap-xs font-medium hover:underline">View All</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DefaultView = () => (
  <div className="flex-1 overflow-y-auto p-7 space-y-8">
    {/* Status + Title + Metrics */}
    <div>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-sap-xs text-muted-foreground mb-4">
        <Clock size={12} />
        Awaiting Activation
      </div>
      <h3 className="text-sap-lg font-semibold text-foreground mb-2">Monitor and Update Price Tolerance</h3>
      <p className="text-sap-sm text-muted-foreground leading-relaxed">
        A job that analyses patterns based on the submitted invoices and will accordingly keep on adjusting the tolerance limits.
      </p>

      {/* Goals and Metrics */}
      <div className="rounded-lg border border-border p-3 mt-4">
        <h4 className="text-sap-sm font-semibold text-foreground mb-2">goals and metrics</h4>
        <div className="grid grid-cols-4 gap-2">
          {metrics.map((m, i) => (
            <div key={i}>
              <p className="text-sap-lg font-bold text-primary">{m.value}</p>
              <p className="text-sap-xs text-muted-foreground tracking-wide leading-tight mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Three columns */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BulletList title="What the Agent Does" items={agentActions} />
      <BulletList title="Business Impact" items={businessImpact} />
      <BulletList title="Governance" items={governance} />
    </div>

    {/* Live Optimization Clusters */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sap-lg font-semibold text-foreground">Live Optimization Clusters</h3>
        <button className="text-sap-xs text-primary font-medium hover:underline flex items-center gap-1">
          Export Logs
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sap-xs">
          <thead>
            <tr className="bg-muted/30">
              <th className="text-left px-4 py-3 font-semibold text-foreground">Cluster ID</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Assets</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Risk Level</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Downtime Avoided</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Capacity Impact</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {clusters.map((c, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-2.5 text-primary font-medium">{c.id}</td>
                <td className="px-4 py-2.5 text-foreground">{c.assets}</td>
                <td className="px-4 py-2.5 text-foreground">{c.risk}</td>
                <td className="px-4 py-2.5 text-foreground">{c.downtime}</td>
                <td className="px-4 py-2.5 text-foreground">{c.capacity}</td>
                <td className={`px-4 py-2.5 font-medium ${c.statusColor}`}>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2.5 border-t border-border">
          <button className="text-primary text-sap-xs font-medium hover:underline">View All</button>
        </div>
      </div>
    </div>
  </div>
);

const JobDetailPanel = ({ open, onClose, onActivate }: JobDetailPanelProps) => {
  const [activeView, setActiveView] = useState<"test" | "edit">("test");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch overflow-hidden bg-black/10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[780px] m-5 flex flex-col overflow-hidden animate-slide-in-left rounded-[20px] shadow-[0_8px_60px_rgba(29,33,50,0.15)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-[20px] p-[1.5px] -z-0 overflow-hidden">
          <div className="absolute inset-[-50%] animate-spin-slow bg-[conic-gradient(from_0deg,hsl(var(--primary)),hsl(262,80%,70%),hsl(220,90%,60%),hsl(190,90%,75%),hsl(var(--primary)))]" />
        </div>
        <div className="flex-1 bg-card flex flex-col overflow-hidden rounded-[19px] m-[1.5px] relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-border shrink-0">
            <div>
              <p className="text-sap-xs text-primary font-medium">Job</p>
              <h2 className="text-sap-lg font-semibold text-foreground">Monitor and Update Price Tolerance</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-muted rounded-full p-0.5">
                <button
                  onClick={() => setActiveView("test")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sap-xs font-semibold transition-colors ${
                    activeView === "test"
                      ? "bg-chat-primary text-chat-primary-foreground"
                      : "text-foreground hover:bg-background/60"
                  }`}
                >
                  <FlaskConical size={14} />
                  Test
                </button>
                <button
                  onClick={() => setActiveView("edit")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sap-xs font-medium transition-colors ${
                    activeView === "edit"
                      ? "bg-chat-primary text-chat-primary-foreground"
                      : "text-foreground hover:bg-background/60"
                  }`}
                >
                  <Pencil size={14} />
                  Edit
                </button>
              </div>
              <button
                onClick={() => { onActivate?.(); onClose(); }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-[7px] bg-[#7050FF] text-white text-sap-xs font-semibold hover:bg-[#7050FF]/90 transition-all hover:scale-[1.02]">
                <span>Activate Job</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content based on active view */}
          {activeView === "test" ? <DefaultView /> : <TestView />}
        </div>
      </div>

      {/* Click-away overlay */}
      <div className="flex-1" />
    </div>
  );
};

export default JobDetailPanel;
