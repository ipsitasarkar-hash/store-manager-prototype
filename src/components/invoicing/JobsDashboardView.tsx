import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus, Calendar, Eye, Search as SearchIcon, Globe, Shield, Play } from "lucide-react";
import shareIcon from "@/assets/share-icon.png";

const metrics = [
  {
    label: "SLA\nCompliance\nRate",
    value: "94.2%",
    trend: "+2.3%",
    trendDir: "up" as const,
    note: "Above target (90%)",
  },
  {
    label: "Avg Time-to-\nResolution",
    value: "2.4h",
    trend: "-15m",
    trendDir: "down" as const,
    note: "Faster than last week",
  },
  {
    label: "Autonomy\nRatio",
    value: "73%",
    trend: "+5%",
    trendDir: "up" as const,
    note: "Jobs resolved w/o human input",
  },
  {
    label: "Human\nIntervention Rate",
    value: "27%",
    trend: "-5%",
    trendDir: "down" as const,
    note: "Decreasing trend",
  },
  {
    label: "Active Jobs",
    value: "145",
    trend: "—",
    trendDir: "neutral" as const,
    note: "10 in progress",
  },
];

type JobStatus = "Waiting for Schedule" | "Monitoring" | "Analyzing" | "Verifying Compliance" | "Ready to Run";

interface DashboardJob {
  title: string;
  lastUpdate: string;
  meta: { label: string; value: string }[];
  gauge?: { type: "variance"; value: string; percent: number };
  sparkline?: boolean;
  blockedCount?: number;
  readiness?: number;
  status: JobStatus;
  hasShareIcon?: boolean;
  isNew?: boolean;
}

const dashboardJobs: DashboardJob[] = [
  {
    title: "Validate Duplicate Vendor Invoices",
    lastUpdate: "2 potential duplicates flagged for review",
    meta: [
      { label: "Scope", value: "Accounts Payable" },
      { label: "Success Rate", value: "98.7%" },
    ],
    gauge: { type: "variance", value: "+2.1%", percent: 72 },
    status: "Ready to Run",
    hasShareIcon: true,
    isNew: true,
  },
  {
    title: "Weekly Margin Deviation Review – Europe",
    lastUpdate: "Run Completed – All variances reviewed and explained",
    meta: [
      { label: "Cycle", value: "12 business units analyzed" },
      { label: "Exposure", value: "€33,000 total variance" },
    ],
    gauge: { type: "variance", value: "+1.8%", percent: 68 },
    status: "Waiting for Schedule",
  },
  {
    title: "Monitor Failed or Blocked Payments",
    lastUpdate: "0 new blocked payments detected",
    meta: [
      { label: "Scope", value: "All company codes EU-West" },
      { label: "Risk", value: "Escalate if > 3 blocked within 1h" },
    ],
    gauge: { type: "variance", value: "-0.6%", percent: 44 },
    status: "Monitoring",
    hasShareIcon: true,
  },
  {
    title: "Cash Flow Forecast Drift Monitoring",
    lastUpdate: "Forecast variance stable (±1.8%)",
    meta: [
      { label: "Scope", value: "12-week rolling projection" },
      { label: "Risk", value: "Alert if variance > 5%" },
    ],
    sparkline: true,
    blockedCount: 0,
    status: "Analyzing",
  },
  {
    title: "Month-End Close Readiness Guard",
    lastUpdate: "Accrual completeness check passed",
    meta: [
      { label: "Current Run", value: "Until close finalized" },
      { label: "Risk", value: "Escalate if open items" },
    ],
    readiness: 80,
    status: "Verifying Compliance",
    hasShareIcon: true,
  },
];

const tabs = ["Needs Attention", "Active", "Completed", "Draft"] as const;

const statusConfig: Record<JobStatus, { icon: React.ElementType; color: string }> = {
  "Waiting for Schedule": { icon: Calendar, color: "text-teal bg-teal/10 border-teal/20" },
  "Monitoring": { icon: Eye, color: "text-teal bg-teal/10 border-teal/20" },
  "Analyzing": { icon: SearchIcon, color: "text-teal bg-teal/10 border-teal/20" },
  "Verifying Compliance": { icon: Globe, color: "text-teal bg-teal/10 border-teal/20" },
  "Ready to Run": { icon: Play, color: "text-primary bg-primary/10 border-primary/30" },
};

const VarianceGauge = ({ value, percent }: { value: string; percent: number }) => {
  const isPositive = value.startsWith("+");
  return (
    <div className="flex items-center gap-4">
      <div className="text-sap-xs text-muted-foreground font-medium whitespace-nowrap">Variance Gauge:</div>
      <div className="flex flex-col gap-1.5">
        <div className="relative w-[120px] h-1.5 bg-border rounded-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3 bg-muted-foreground/40" />
          <div className="absolute text-[9px] text-muted-foreground -top-3.5 left-0">-5%</div>
          <div className="absolute text-[9px] text-muted-foreground -top-3.5 right-0">+5%</div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-transparent border-b-teal"
            style={{ left: `${percent}%` }}
          />
        </div>
        <span className={`text-sap-sm font-semibold ${isPositive ? "text-teal" : "text-teal"}`}>{value}</span>
      </div>
    </div>
  );
};

const Sparkline = () => (
  <svg width="80" height="24" viewBox="0 0 80 24" fill="none" className="text-teal">
    <polyline
      points="0,18 8,14 16,16 24,12 32,14 40,10 48,12 56,8 64,10 72,6 80,8"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <circle cx="80" cy="8" r="2" fill="currentColor" />
  </svg>
);

const ReadinessBar = ({ percent }: { percent: number }) => {
  const filled = Math.round((percent / 100) * 10);
  return (
    <div className="flex items-center gap-4">
      <div className="text-sap-xs text-muted-foreground font-medium whitespace-nowrap">Readiness Status:</div>
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-sm ${i < filled ? "bg-teal" : "bg-border"}`}
            />
          ))}
        </div>
        <span className="text-sap-sm font-semibold text-teal">{percent}% <span className="text-muted-foreground font-normal text-sap-xs">ready</span></span>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: JobStatus }) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isReadyToRun = status === "Ready to Run";
  const isMonitoring = status === "Monitoring";
  const showPing = isReadyToRun || isMonitoring;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sap-xs font-medium border ${config.color} ${isReadyToRun ? "shadow-[0_0_10px_hsl(var(--primary)/0.3)]" : ""}`}>
      {showPing ? (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${isReadyToRun ? "bg-primary" : "bg-teal"}`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${isReadyToRun ? "bg-primary" : "bg-teal"}`} />
        </span>
      ) : (
        <Icon size={12} />
      )}
      {status}
    </span>
  );
};

const MetricCard = ({ metric }: { metric: typeof metrics[0] }) => {
  const TrendIcon = metric.trendDir === "up" ? TrendingUp : metric.trendDir === "down" ? TrendingDown : Minus;
  const trendColor = metric.trendDir === "neutral" ? "text-muted-foreground bg-muted" : "text-teal bg-teal/10";

  return (
    <div className="bg-card rounded-2xl border border-border/75 p-4 min-w-[180px] flex-1 flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sap-xs text-muted-foreground font-medium whitespace-pre-line leading-tight">{metric.label}</p>
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${trendColor}`}>
          <TrendIcon size={10} />
          {metric.trend}
        </span>
      </div>
      <p className="text-[1.75rem] font-bold text-foreground leading-none mb-1.5">{metric.value}</p>
      <p className="text-sap-xs text-muted-foreground">{metric.note}</p>
    </div>
  );
};

const JobsDashboardView = () => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Active");
  const navigate = useNavigate();

  return (
    <>
      {/* Metrics */}
      <div className="px-5 pb-6">
        <div className="flex gap-3 overflow-x-auto flex-wrap lg:flex-nowrap items-stretch">
          {metrics.map((m, i) => (
            <div key={i} className="flex-1 min-w-[180px] animate-[fade-in-up_0.4s_ease-out_both] flex" style={{ animationDelay: `${i * 80}ms` }}>
              <MetricCard metric={m} />
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mt-4 mb-2">
        <div className="flex gap-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sap-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Job List */}
      <div className="px-8 pt-6 pb-10">
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_1.2fr_1.6fr_180px] gap-8 px-6 mb-2">
          <span className="text-sap-xs font-semibold text-muted-foreground uppercase tracking-wide">Job</span>
          <span className="text-sap-xs font-semibold text-muted-foreground uppercase tracking-wide">Details</span>
          <span className="text-sap-xs font-semibold text-muted-foreground uppercase tracking-wide">Metrics</span>
          <span className="text-sap-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Status</span>
        </div>

        {dashboardJobs.map((job, i) => (
          <div
            key={i}
            onClick={() => i === 0 ? navigate("/jobs/duplicate-detail") : undefined}
            className={`bg-card rounded-2xl border mb-3 grid grid-cols-[2fr_1.2fr_1.6fr_180px] items-center gap-8 px-6 py-5 shadow-[0_1px_6px_rgba(29,33,50,0.04)] hover:shadow-[0_2px_12px_rgba(29,33,50,0.08)] transition-shadow animate-[fade-in-up_0.4s_ease-out_both] ${i === 0 ? "cursor-pointer" : ""} ${job.isNew ? "border-[hsl(var(--chat-primary)/0.4)] shadow-[0_0_0_1px_hsl(var(--chat-primary)/0.1),0_1px_6px_rgba(29,33,50,0.04)]" : "border-border/75"}`}
            style={{ animationDelay: `${200 + i * 100}ms` }}
          >
            {/* Col 1: Title + Last Update */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sap-sm font-bold text-foreground truncate">{job.title}</h4>
                {job.isNew && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-chat-muted text-chat-primary shrink-0">
                    New
                  </span>
                )}
              </div>
              <p className="text-sap-xs text-muted-foreground">
                <span className="font-medium text-foreground">Last Update</span>: {job.lastUpdate}
              </p>
            </div>

            {/* Col 2: Meta */}
            <div className="flex flex-col gap-0.5 min-w-0">
              {job.meta.map((m, j) => (
                <p key={j} className="text-sap-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{m.label}</span>: {m.value}
                </p>
              ))}
            </div>

            {/* Col 3: Gauge / Sparkline / Readiness */}
            <div className="min-w-0">
              {job.gauge && <VarianceGauge value={job.gauge.value} percent={job.gauge.percent} />}
              {job.sparkline && (
                <div className="flex items-center gap-4">
                  <div className="text-sap-xs text-muted-foreground font-medium whitespace-nowrap">Blocked payments:</div>
                  <div className="flex flex-col gap-1.5">
                    <Sparkline />
                    <span className="text-sap-sm font-semibold text-teal">{job.blockedCount} <span className="text-muted-foreground font-normal text-sap-xs">detected now</span></span>
                  </div>
                </div>
              )}
              {job.readiness !== undefined && <ReadinessBar percent={job.readiness} />}
            </div>

            {/* Col 4: Status */}
            <div className="flex items-center gap-2 shrink-0 justify-end">
              <StatusBadge status={job.status} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default JobsDashboardView;
