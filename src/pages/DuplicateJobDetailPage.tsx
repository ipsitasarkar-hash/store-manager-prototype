import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Crosshair, UserCircle, Pencil, AlertTriangle, Check, Eye, Search as SearchIcon, Globe, Shield, Layers, Search, SlidersHorizontal, Plus, ChevronDown, List, Play, Pause, Ban, Copy, Share2 } from "lucide-react";
// IconSidebar now in SidebarLayout
import hammockIllustration from "@/assets/hammock-illustration.png";

/* ===== Data ===== */
type JobStatus = "Waiting for Schedule" | "Monitoring" | "Analyzing" | "Verifying Compliance" | "Ready to Run" | "Running" | "Completed";
type RunPhase = "idle" | "running" | "completed";

const jobList = [
  { title: "Validate Duplicate Vendor Invoices", status: "Ready to Run" as JobStatus, lastUpdate: "Not yet executed", icons: ["share"] as string[] },
  { title: "Weekly Margin Deviation Review – Europe", status: "Waiting for Schedule" as JobStatus, lastUpdate: "Run Completed", icons: ["layers"] as string[] },
  { title: "Monitor Failed or Blocked Payments", status: "Monitoring" as JobStatus, lastUpdate: "0 new blocked payments detected", icons: ["share", "filecheck"] as string[] },
  { title: "Cash Flow Forecast Drift Monitoring", status: "Analyzing" as JobStatus, lastUpdate: "Forecast variance stable (±1.8%)", icons: [] as string[] },
  { title: "Month-End Close Readiness Guard", status: "Verifying Compliance" as JobStatus, lastUpdate: "Accrual completeness check passed", icons: ["layers", "filecheck"] as string[] },
];

const statusConfig: Record<JobStatus, { icon: React.ElementType; color: string }> = {
  "Waiting for Schedule": { icon: Calendar, color: "text-teal bg-teal/10 border-teal/20" },
  "Monitoring": { icon: Eye, color: "text-teal bg-teal/10 border-teal/20" },
  "Analyzing": { icon: SearchIcon, color: "text-teal bg-teal/10 border-teal/20" },
  "Verifying Compliance": { icon: Globe, color: "text-teal bg-teal/10 border-teal/20" },
  "Ready to Run": { icon: SearchIcon, color: "text-primary bg-primary/10 border-primary/30" },
  "Running": { icon: SearchIcon, color: "text-warning bg-warning/10 border-warning/30" },
  "Completed": { icon: Check, color: "text-success bg-success/10 border-success/30" },
};


/* ===== Shared sub-components ===== */
const StatusBadge = ({ status }: { status: JobStatus }) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isReadyToRun = status === "Ready to Run";
  const isRunning = status === "Running";
  const showPing = isReadyToRun || isRunning || status === "Monitoring";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sap-xs font-medium border ${config.color} ${isReadyToRun ? "shadow-[0_0_10px_hsl(var(--primary)/0.3)]" : ""} ${isRunning ? "shadow-[0_0_10px_hsl(var(--warning)/0.3)]" : ""}`}>
      {showPing ? (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${isRunning ? "bg-warning" : isReadyToRun ? "bg-primary" : "bg-teal"}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${isRunning ? "bg-warning" : isReadyToRun ? "bg-primary" : "bg-teal"}`} />
        </span>
      ) : (
        <Icon size={12} />
      )}
      {status}
    </span>
  );
};

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

const LiveStatusTab = ({ onReviewClick, runPhase, onRunJob }: { onReviewClick: () => void; runPhase: RunPhase; onRunJob: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [scannedCount, setScannedCount] = useState(0);

  const steps = [
    { label: "Initializing scan engine", icon: "⚡" },
    { label: "Connecting to S/4 Accounts Payable", icon: "🔗" },
    { label: "Scanning vendor invoices", icon: "🔍" },
    { label: "Running duplicate detection rules", icon: "🧠" },
    { label: "Generating results", icon: "📊" },
  ];

  useEffect(() => {
    if (runPhase !== "running") { setProgress(0); setCurrentStep(0); setScannedCount(0); return; }
    const start = Date.now();
    const duration = 4000;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration * 100, 100);
      setProgress(pct);
      setCurrentStep(Math.min(Math.floor(pct / 20), 4));
      setScannedCount(Math.round((pct / 100) * 1247));
      if (pct < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [runPhase]);

  /* ---- Idle: prompt to run ---- */
  if (runPhase === "idle") {
    return (
      <div className="px-7 py-6 flex flex-col items-center justify-center text-center" style={{ minHeight: 400 }}>
        <div className="w-full max-w-[224px] mb-6">
          <div className="relative rounded-[18px] overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-[hsl(217,100%,95%)] rounded-[18px]" />
            <img src={hammockIllustration} alt="Waiting illustration" className="relative z-10 w-full h-auto object-contain" />
          </div>
        </div>
        <p className="text-sap-base font-semibold text-foreground mb-1">Job is ready to run</p>
        <p className="text-sap-sm text-muted-foreground mb-6 max-w-sm">
          This job will scan 1,247 invoices for potential duplicates across all active company codes.
        </p>
        <button
          onClick={onRunJob}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[7px] bg-[#7050FF] text-white text-sap-sm font-semibold hover:bg-[#7050FF]/90 transition-colors"
        >
          <SearchIcon size={16} />
          Run Job Now
        </button>
      </div>
    );
  }

  /* ---- Running: animated experience ---- */
  if (runPhase === "running") {
    return (
      <div className="px-7 py-6 flex flex-col items-center justify-center text-center" style={{ minHeight: 400 }}>
        {/* Orb */}
        <div className="relative w-24 h-24 mb-6">
          <div
            className="absolute inset-0 rounded-full border border-[#8A6FFF]/15"
            style={{ animation: "spin 6s linear infinite" }}
          />
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 70%, rgba(138,111,255,0.2) 100%)",
              animation: "spin 2.5s linear infinite",
            }}
          />
          <div className="absolute inset-4 rounded-full flex items-center justify-center">
            <div
              className="w-10 h-10 rounded-full bg-[#8A6FFF] flex items-center justify-center shadow-[0_0_16px_rgba(138,111,255,0.3)]"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            >
              <SearchIcon size={18} className="text-white" />
            </div>
          </div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#8A6FFF]/50"
              style={{
                animation: `spin ${2.5 + i * 0.7}s linear infinite`,
                top: "50%",
                left: "50%",
                transformOrigin: `${-24 - i * 7}px 0px`,
              }}
            />
          ))}
        </div>

        {/* Live counter */}
        <p className="text-[1.75rem] font-bold text-foreground mb-0.5 tabular-nums leading-none">
          {scannedCount.toLocaleString()}
          <span className="text-sap-sm font-normal text-muted-foreground ml-2">/ 1,247</span>
        </p>
        <p className="text-sap-xs text-muted-foreground mb-5">invoices scanned</p>

        {/* Progress bar */}
        <div className="w-full max-w-sm mb-6">
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#8A6FFF] transition-none relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)",
                  backgroundSize: "60% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-1.5 text-sap-xs text-muted-foreground">
            <span>{Math.round(progress)}% complete</span>
            <span>Running in background</span>
          </div>
        </div>

        {/* Step indicators */}
        <div className="w-full max-w-sm space-y-0.5">
          {steps.map((step, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            return (
              <div
                key={i}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded text-sap-xs transition-all duration-300 ${
                  isActive
                    ? "bg-[#8A6FFF]/8 text-[#8A6FFF] font-medium"
                    : isDone
                    ? "text-muted-foreground"
                    : "text-muted-foreground/30"
                }`}
              >
                <span className="w-4 flex items-center justify-center shrink-0">
                  {isDone ? (
                    <Check size={12} className="text-muted-foreground" />
                  ) : isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A6FFF] animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full border border-muted-foreground/20" />
                  )}
                </span>
                <span className="flex-1 text-left">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Status */}
        <div className="mt-5 flex items-center gap-2 px-4 py-2 rounded text-sap-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Job running in background · You can navigate away
        </div>
      </div>
    );
  }

  /* ---- Completed: show results ---- */
  return (
  <div className="px-7 py-6 space-y-6">
    {/* Combined: Illustration + Previous Run + Exceptions */}
    <div className="rounded-[24px] border border-border bg-card p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Illustration + waiting text */}
        <div className="flex flex-col items-center justify-center text-center lg:w-[300px] shrink-0">
          <div className="w-full max-w-[224px] mb-4">
            <div className="relative rounded-[18px] overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-[hsl(217,100%,95%)] rounded-[18px]" />
              <img
                src={hammockIllustration}
                alt="Waiting illustration"
                className="relative z-10 w-full h-auto object-contain"
              />
            </div>
          </div>
          <p className="text-sap-base font-semibold text-foreground leading-snug">
            Monitoring for duplicates
          </p>
          <p className="text-sap-base font-semibold text-foreground leading-snug">
            Next scan: Apr 11 at 6 am
          </p>
        </div>

        {/* Right: Previous Run + Exceptions */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-6">
          {/* Previous Run info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar size={16} className="text-primary" />
              </div>
              <h4 className="text-sap-sm font-bold text-foreground">Previous Run</h4>
            </div>
            <div className="space-y-3 text-sap-sm">
              <div>
                <p className="text-muted-foreground">Previous Run</p>
                <p className="font-semibold text-foreground">Apr 10, 06:00 — Completed</p>
              </div>
              <div>
                <p className="text-muted-foreground">Invoices Scanned</p>
                <p className="font-semibold text-foreground">1,247</p>
              </div>
              <div>
                <p className="text-muted-foreground">Match Accuracy</p>
                <p className="font-semibold text-foreground">98.7%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sources</p>
                <p className="font-semibold text-foreground">S/4 Accounts Payable</p>
              </div>
            </div>
          </div>

          {/* Exceptions card */}
          <div className="flex-1 min-w-0">
            <div className="rounded-[20px] border border-border bg-muted/30 p-5 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-warning" />
                <h4 className="text-sap-sm font-bold text-foreground">Flagged Items</h4>
              </div>
              <div className="space-y-2.5 text-sap-sm text-foreground">
                <p>2 potential duplicate invoices detected</p>
                <p>$24,900 Total payment at risk</p>
                <p>1 auto-blocked pending review</p>
              </div>
              <div className="mt-auto pt-5">
                <button
                  onClick={onReviewClick}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-[7px] bg-[#7050FF] text-white text-sap-xs font-semibold hover:bg-[#7050FF]/90 transition-colors"
                >
                  <Layers size={14} />
                  Review Flagged Invoices
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Monitoring Scope + Automatic Actions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monitoring Scope */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Eye size={16} className="text-primary" />
          </div>
          <h4 className="text-sap-sm font-bold text-foreground">Detection Scope</h4>
        </div>
        <ul className="space-y-2 text-sap-sm text-foreground">
          {[
            "All incoming vendor invoices across company codes",
            "Invoice number, vendor, amount, and date matching",
            "Fuzzy matching for near-duplicate detection (±2% amount tolerance)",
            "Cross-company code duplicate checks",
            "Historical lookback window: 90 days",
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted-foreground mt-1 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Automatic Actions Allowed */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield size={16} className="text-primary" />
          </div>
          <h4 className="text-sap-sm font-bold text-foreground">Automatic Actions Allowed</h4>
        </div>
        <ul className="space-y-2 text-sap-sm text-foreground">
          {[
            "Block payment for invoices with ≥95% match confidence",
            "Flag and route suspected duplicates to AP reviewers",
            "Generate side-by-side comparison summaries",
            "Auto-resolve exact duplicates already posted",
            "Notify vendor managers when repeat duplicates are detected from same supplier",
          ].map((item, i) => (
            <li key={i} className="flex gap-2">
              <Check size={16} className="text-primary shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  );
};

/* ===== Run History Tab (reused from JobDetailPanel) ===== */
const RunHistoryTab = () => (
  <div className="px-7 py-6 text-sap-sm text-muted-foreground">
    <p>Run history will appear here after the job has been executed.</p>
  </div>
);

/* ===== Job Definition Tab (reused from JobDetailPanel) ===== */
const JobDefinitionTab = ({ onRunJob, runPhase }: { onRunJob: () => void; runPhase: RunPhase }) => (
  <div className="px-7 py-6 relative">
    <h3 className="text-sap-lg font-bold text-foreground mb-2">Job Configuration</h3>

    <ConfigSection icon={Calendar} title="Schedule">
      <p>Trigger: <span className="font-semibold">Event-based (on invoice receipt)</span></p>
      <p>Batch scan: <span className="font-semibold">Daily at 06:00 CET</span></p>
      <p>Lookback window: <span className="font-semibold">90 days</span></p>
      <p className="text-primary mt-2">Real-time + Batch Enabled</p>
    </ConfigSection>

    <div className="h-px bg-border" />

    <ConfigSection icon={Crosshair} title="Scope">
      <p className="mb-2">Detection Parameters:</p>
      <ul className="space-y-1.5 text-muted-foreground">
        <li className="flex gap-2"><span>•</span><span>Match fields: <span className="font-semibold text-foreground">Invoice #, Vendor, Amount, Date</span></span></li>
        <li className="flex gap-2"><span>•</span><span>Company codes: <span className="font-semibold text-foreground">All active (1000–5000)</span></span></li>
        <li className="flex gap-2"><span>•</span><span>Amount tolerance: <span className="font-semibold text-foreground">±2%</span> for fuzzy matching</span></li>
        <li className="flex gap-2"><span>•</span><span>Exclude: internal intercompany invoices</span></li>
      </ul>
    </ConfigSection>

    <div className="h-px bg-border" />

    <ConfigSection icon={UserCircle} title="User Involvement">
      <p className="mb-2">Users will be asked to:</p>
      <ul className="space-y-1.5 text-muted-foreground">
        <li className="flex gap-2"><span>•</span><span>Review flagged duplicate pairs and confirm or dismiss</span></li>
        <li className="flex gap-2"><span>•</span><span>Approve payment release for false positives</span></li>
        <li className="flex gap-2"><span>•</span><span>Escalate confirmed duplicates to vendor management</span></li>
        <li className="flex gap-2"><span>•</span><span>Provide resolution notes for audit trail</span></li>
      </ul>
    </ConfigSection>

    <div className="h-px bg-border" />

    <ConfigSection icon={Shield} title="Governance & Thresholds">
      <p className="mb-2">Auto-block rules:</p>
      <ul className="space-y-1.5 text-muted-foreground">
        <li className="flex gap-2"><span>•</span><span>No payment release for invoices with <span className="font-semibold text-foreground">≥95% match confidence</span></span></li>
        <li className="flex gap-2"><span>•</span><span>Escalation required if duplicate amount exceeds <span className="font-semibold text-foreground">$50,000</span></span></li>
        <li className="flex gap-2"><span>•</span><span>Vendor flagged after <span className="font-semibold text-foreground">3+ duplicates in 30 days</span></span></li>
        <li className="flex gap-2"><span>•</span><span>Full audit trail for all decisions (approve, reject, escalate)</span></li>
      </ul>
    </ConfigSection>

    <div className="h-px bg-border" />

    <ConfigSection icon={AlertTriangle} title="Notification Rules">
      <p className="mb-2">Alerts are sent when:</p>
      <ul className="space-y-1.5 text-muted-foreground">
        <li className="flex gap-2"><span>•</span><span>New duplicate detected → AP reviewer inbox + email</span></li>
        <li className="flex gap-2"><span>•</span><span>Auto-block triggered → AP manager notification</span></li>
        <li className="flex gap-2"><span>•</span><span>Review pending &gt; 24h → escalation reminder to team lead</span></li>
        <li className="flex gap-2"><span>•</span><span>Repeat vendor pattern detected → vendor management alert</span></li>
      </ul>
    </ConfigSection>

    <div className="h-px bg-border" />

    {/* Detection Rules Table */}
    <div className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sap-lg font-semibold text-foreground">Detection Rules</h3>
        <button className="text-sap-xs text-primary font-medium hover:underline flex items-center gap-1">
          Export Rules
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
              <th className="text-left px-4 py-3 font-semibold text-foreground">Rule ID</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Match Fields</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Tolerance</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Action</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "DUP-R01", fields: "Invoice # + Vendor + Amount", tolerance: "Exact", action: "Auto-block", status: "Active", statusColor: "text-success" },
              { id: "DUP-R02", fields: "Vendor + Amount (±2%)", tolerance: "±2%", action: "Flag for review", status: "Active", statusColor: "text-success" },
              { id: "DUP-R03", fields: "Vendor + Date + Amount", tolerance: "±1 day", action: "Flag for review", status: "Active", statusColor: "text-success" },
              { id: "DUP-R04", fields: "PO Number + Amount", tolerance: "Exact", action: "Auto-block", status: "Active", statusColor: "text-success" },
              { id: "DUP-R05", fields: "Vendor + Amount (>$50k)", tolerance: "Exact", action: "Escalate", status: "Active", statusColor: "text-success" },
            ].map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-4 py-2.5 text-primary font-medium">{r.id}</td>
                <td className="px-4 py-2.5 text-foreground">{r.fields}</td>
                <td className="px-4 py-2.5 text-foreground">{r.tolerance}</td>
                <td className="px-4 py-2.5 text-foreground">{r.action}</td>
                <td className={`px-4 py-2.5 font-medium ${r.statusColor}`}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2.5 border-t border-border">
          <button className="text-primary text-sap-xs font-medium hover:underline">View All Rules</button>
        </div>
      </div>
    </div>

    {/* Spacer for sticky CTA */}
    {runPhase === "idle" && <div className="h-24" />}
  </div>
);

/* ===== Sticky Run CTA ===== */
const RunJobCTA = ({ onRunJob }: { onRunJob: () => void }) => (
  <div className="px-7 pb-5 pt-2 bg-card">
    <div className="flex items-center justify-between gap-4 border border-border rounded-2xl px-6 py-4 shadow-[0_12px_40px_rgba(29,33,50,0.10)]">
      <div className="min-w-0">
        <p className="text-sap-sm font-semibold text-foreground">Ready to scan 1,247 invoices</p>
        <p className="text-sap-xs text-muted-foreground mt-0.5">This job will run in the background. You can navigate away at any time.</p>
      </div>
      <button
        onClick={onRunJob}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[7px] bg-[#7050FF] text-white text-sap-sm font-semibold hover:bg-[#7050FF]/90 transition-all hover:scale-[1.02] shrink-0"
      >
        <SearchIcon size={15} />
        Run Job
      </button>
    </div>
  </div>
);

/* ===== Main Page ===== */
const DuplicateJobDetailPage = () => {
  const [activeTab, setActiveTab] = useState<"live" | "history" | "definition">("definition");
  const [selectedJob, setSelectedJob] = useState(0);
  const [runPhase, setRunPhase] = useState<RunPhase>("idle");
  const [jobStatus, setJobStatus] = useState<JobStatus>("Ready to Run");
  const navigate = useNavigate();

  const handleRunJob = () => {
    setRunPhase("running");
    setJobStatus("Running");
    setActiveTab("live");
    setTimeout(() => {
      setRunPhase("completed");
      setJobStatus("Monitoring");
    }, 4000);
  };

  const tabs = [
    { key: "live" as const, label: "Live Status" },
    { key: "history" as const, label: "Run History" },
    { key: "definition" as const, label: "Job Definition" },
  ];

  const currentJob = jobList[selectedJob];

  return (
    <div className="flex-1 min-w-0 flex overflow-hidden" style={{ backgroundColor: 'hsl(var(--el-neutral-50-alt))' }}>
        {/* Left: Job List */}
        <div className="w-[380px] shrink-0 flex flex-col min-w-0 z-10 border-r border-border" style={{ backgroundColor: 'hsl(var(--el-neutral-50-alt))' }}>
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-5 shrink-0">
            <div className="flex-1 min-w-0">
              <p className="text-sap-base font-semibold text-foreground leading-[22px]">Jobs</p>
            </div>
            <div className="flex items-center gap-0">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground/60 hover:bg-black/5 transition-colors">
                <Search size={18} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground/60 hover:bg-black/5 transition-colors">
                <SlidersHorizontal size={18} />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-[6px] border border-primary bg-white text-primary text-sap-sm font-semibold hover:bg-primary/5 transition-colors shrink-0">
              <Plus size={16} />
              New
            </button>
          </div>

          {/* Tab bar */}
          <div className="px-4 shrink-0">
            <div className="flex items-center gap-4 border-b border-border w-fit">
              {["Active (5)", "Completed", "More"].map((tab, i) => (
                <button
                  key={tab}
                  className={`relative flex items-center gap-1 px-2 py-3 text-sap-sm transition-colors whitespace-nowrap ${
                    i === 0
                      ? "text-primary font-semibold"
                      : "text-foreground font-normal hover:text-foreground/70"
                  }`}
                >
                  {tab}
                  {tab === "More" && <ChevronDown size={14} />}
                  {i === 0 && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full" style={{ width: 'calc(100% - 8px)' }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Job list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {jobList.map((job, i) => {
              const isSelected = selectedJob === i;
              const status = i === 0 ? jobStatus : job.status;
              const statusStyle = status === "Ready to Run"
                ? { bg: "bg-primary/10", text: "text-primary" }
                : status === "Running"
                ? { bg: "bg-warning/10", text: "text-warning" }
                : status === "Monitoring" || status === "Analyzing" || status === "Verifying Compliance"
                ? { bg: "bg-teal/10", text: "text-teal" }
                : status === "Completed"
                ? { bg: "bg-success/10", text: "text-success" }
                : { bg: "bg-muted", text: "text-muted-foreground" };

              return (
                <button
                  key={i}
                  onClick={() => setSelectedJob(i)}
                  className={`w-full text-left flex flex-col gap-2 p-4 rounded-[7px] border transition-all ${
                    isSelected
                      ? "bg-white border-[#7c879c]"
                      : "bg-transparent border-border hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className={`text-sap-base font-semibold leading-snug ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {job.title}
                    </p>
                    <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-sap-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-sap-sm text-[#353c4a] leading-snug">
                    {i === 0 && runPhase === "completed" ? "2 potential duplicates flagged" : job.lastUpdate}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-card">
          {/* Detail Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border shadow-[0_2px_6px_rgba(29,33,50,0.06)] shrink-0 relative z-10">
            {/* Left: list icon + breadcrumb */}
            <div className="flex items-center gap-6 min-w-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-[6px] bg-[#e5ecf5] border border-[#d6e1f0] shrink-0">
                <List size={18} className="text-primary" />
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-sap-base font-medium text-foreground whitespace-nowrap">Jobs</span>
                <span className="text-sap-base font-medium text-foreground mx-0.5">/</span>
                <span className="text-sap-base font-medium text-foreground truncate">{currentJob.title}</span>
              </div>
            </div>
            {/* Right: action icons */}
            <div className="flex items-center gap-1 shrink-0">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground/60 hover:bg-secondary transition-colors">
                <Play size={16} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground/60 hover:bg-secondary transition-colors">
                <Pause size={16} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground/60 hover:bg-secondary transition-colors">
                <Ban size={16} />
              </button>
              <div className="w-px h-5 bg-border mx-1" />
              <button className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground/60 hover:bg-secondary transition-colors">
                <Copy size={16} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground/60 hover:bg-secondary transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-7 border-b border-border">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 text-sap-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto relative">
            {activeTab === "live" && <LiveStatusTab onReviewClick={() => navigate("/spaces/duplicate-review")} runPhase={runPhase} onRunJob={handleRunJob} />}
            {activeTab === "history" && <RunHistoryTab />}
            {activeTab === "definition" && <JobDefinitionTab onRunJob={handleRunJob} runPhase={runPhase} />}
          </div>
          {activeTab === "definition" && runPhase === "idle" && <RunJobCTA onRunJob={handleRunJob} />}
      </div>
    </div>
  );
};

export default DuplicateJobDetailPage;
