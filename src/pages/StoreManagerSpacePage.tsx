import { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal, ChevronDown, CheckCircle2, AlertTriangle,
  Ban, Eye, X, Send, XCircle,
  AtSign, TrendingDown,
  Users, Zap, ChevronRight,
  ThumbsUp, ThumbsDown, Copy, RotateCcw,
  Volume2, Share2, Plus, MapPin, Clock, Package, TrendingUp,
  Circle, CheckSquare, AlertCircle, ExternalLink
} from "lucide-react";
import spaceIcon from "@/assets/space-icon.png";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════ */
type AlertSeverity = "Critical" | "Warning" | "Info" | "Resolved";
type TaskStatus    = "Open" | "In Progress" | "Done" | "Escalated";

interface StoreAlert {
  id: string;
  zone: string;
  product: string;
  issue: string;
  severity: AlertSeverity;
  time: string;
  assignee: string | null;
  status: TaskStatus;
  detail: string;
}

interface Associate {
  id: string;
  name: string;
  initials: string;
  zone: string;
  tasksOpen: number;
  tasksDone: number;
  status: "On Floor" | "Break" | "Back Room";
}

/* ══════════════════════════════════════════════════════
   INITIAL DATA
══════════════════════════════════════════════════════ */
const initialAlerts: StoreAlert[] = [
  {
    id: "ALT-001",
    zone: "Zone A",
    product: "Organic Strawberries 1lb",
    issue: "Shelf empty — likely out of stock",
    severity: "Critical",
    time: "8 min ago",
    assignee: "Jordan M.",
    status: "In Progress",
    detail: "Last scanned 3h ago. Back stock: 6 units. Jordan M. assigned to restock.",
  },
  {
    id: "ALT-002",
    zone: "Zone B",
    product: "Hass Avocado (each)",
    issue: "~2 units left, 14 sold in last 2h",
    severity: "Critical",
    time: "12 min ago",
    assignee: "Sam K.",
    status: "Open",
    detail: "Sales velocity high. Back stock: 18 units. Expires in 2 days — margin risk if unsold.",
  },
  {
    id: "ALT-003",
    zone: "Zone C",
    product: "Baby Spinach 5oz",
    issue: "Zero back stock — reorder needed",
    severity: "Critical",
    time: "31 min ago",
    assignee: null,
    status: "Open",
    detail: "6 units on shelf. Back stock depleted. At current velocity, stock-out at 12:15 PM with no recovery.",
  },
  {
    id: "ALT-004",
    zone: "Zone A",
    product: "Organic Bananas (bunch)",
    issue: "~30 min to empty",
    severity: "Warning",
    time: "5 min ago",
    assignee: "Jordan M.",
    status: "In Progress",
    detail: "12 units remaining. Back stock: 24 units. Jordan M. pulling half-case now.",
  },
  {
    id: "ALT-005",
    zone: "Zone B",
    product: "Morning Delivery",
    issue: "3 items unverified — window closes at 11:30 AM",
    severity: "Warning",
    time: "1h ago",
    assignee: "Sam K.",
    status: "Open",
    detail: "14 items received at 9:15 AM. 3 items still unverified. Afternoon delivery arrives 11:30 AM — clear back room.",
  },
  {
    id: "ALT-006",
    zone: "Zone C",
    product: "Heirloom Tomatoes (pint)",
    issue: "Expires in 2 days — markdown needed",
    severity: "Warning",
    time: "2h ago",
    assignee: null,
    status: "Open",
    detail: "4 units on shelf, 6 in back. High margin item ($0.72). Apply 15% markdown to drive velocity.",
  },
];

const initialAssociates: Associate[] = [
  { id: "A1", name: "Jordan M.", initials: "JM", zone: "Zone A", tasksOpen: 3, tasksDone: 4, status: "On Floor" },
  { id: "A2", name: "Sam K.",    initials: "SK", zone: "Zone B", tasksOpen: 3, tasksDone: 1, status: "Back Room" },
  { id: "A3", name: "Alex T.",   initials: "AT", zone: "Zone C", tasksOpen: 2, tasksDone: 0, status: "On Floor" },
];

const activityFeed = [
  { action: "Restocked",       detail: "Organic Bananas — 2 cases on Shelf 1A",   time: "10:35 AM", icon: CheckCircle2, color: "text-success" },
  { action: "Waste Logged",    detail: "Blackberries 6oz — 4 units damaged",        time: "10:03 AM", icon: XCircle,      color: "text-destructive" },
  { action: "Markdown Applied",detail: "Cherry Tomatoes 10oz — marked to $2.99",   time: "9:41 AM",  icon: TrendingDown, color: "text-warning" },
  { action: "Delivery Verified",detail: "Morning shipment — 14 items received",    time: "9:15 AM",  icon: CheckCircle2, color: "text-success" },
  { action: "Restocked",       detail: "Organic Strawberries — 3 cases on 3A",     time: "9:02 AM",  icon: CheckCircle2, color: "text-success" },
];

/* ══════════════════════════════════════════════════════
   STATUS / SEVERITY PILLS  (reuse Space design system)
══════════════════════════════════════════════════════ */
const SeverityPill = ({ severity }: { severity: AlertSeverity }) => {
  const map: Record<AlertSeverity, { cls: string; icon: React.ReactNode }> = {
    Critical: { cls: "bg-destructive/10 text-destructive border-destructive/20", icon: <Ban size={11} /> },
    Warning:  { cls: "bg-warning/10 text-warning border-warning/20",             icon: <AlertTriangle size={11} /> },
    Info:     { cls: "bg-primary/10 text-primary border-primary/20",             icon: <Eye size={11} /> },
    Resolved: { cls: "bg-success/10 text-success border-success/20",             icon: <CheckCircle2 size={11} /> },
  };
  const { cls, icon } = map[severity];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-sap-xs font-medium border ${cls}`}>
      {icon}{severity}
    </span>
  );
};

const TaskStatusPill = ({ status }: { status: TaskStatus }) => {
  const map: Record<TaskStatus, string> = {
    "Open":        "bg-warning/10 text-warning border-warning/20",
    "In Progress": "bg-primary/10 text-primary border-primary/20",
    "Done":        "bg-success/10 text-success border-success/20",
    "Escalated":   "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-sap-xs font-medium border ${map[status]}`}>
      {status}
    </span>
  );
};

/* ══════════════════════════════════════════════════════
   HEADER  (Figma-accurate PaneBar)
══════════════════════════════════════════════════════ */
// Figma asset URLs from design context (node 570:11273)
const menuIcon     = "https://www.figma.com/api/mcp/asset/06453a53-ba16-442e-9a4a-04a20d8588fe"; // toggle/hamburger
const overviewIcon = "https://www.figma.com/api/mcp/asset/2fd7e8a9-7fca-42a3-b057-0cc979141858"; // legend/overview
const dotsIcon     = "https://www.figma.com/api/mcp/asset/34bdf51f-c9a7-42fe-ab18-c59209359770"; // overflow dots
const chatPaneIcon = "https://www.figma.com/api/mcp/asset/512aa8bf-8424-4113-8dac-177c8e75727c"; // chat pane toggle

const SpaceHeader = () => (
  <>
    {/* PaneBar — matches Figma px-[24px] py-[20px] */}
    <div
      className="flex items-center justify-between shrink-0 relative z-10"
      style={{ padding: '20px 24px' }}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center" style={{ gap: 24 }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <button
            className="flex items-center justify-center rounded-lg hover:bg-[#f0f2f4] transition-colors"
            style={{ padding: 10.855, borderRadius: 8 }}
          >
            <img src={menuIcon} alt="Menu" style={{ width: 18, height: 18 }} className="object-contain" />
          </button>
        </div>
        <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 16, fontWeight: 600, lineHeight: '22px', color: '#0b0c0f' }}>
          Store Manager Dashboard
        </span>
      </div>

      {/* Right: Overview btn + dots + chat toggle */}
      <div className="flex items-center" style={{ gap: 8 }}>
        <button
          className="flex items-center gap-2 hover:bg-[#f0f2f4] transition-colors rounded-lg"
          style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 9, paddingBottom: 9, borderRadius: 8 }}
        >
          <img src={overviewIcon} alt="Overview" style={{ width: 18, height: 18 }} className="object-contain" />
          <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 16, fontWeight: 600, lineHeight: '22px', color: '#0b0c0f' }}>
            Overview
          </span>
        </button>
        <button
          className="flex items-center justify-center hover:bg-[#f0f2f4] transition-colors rounded-lg"
          style={{ padding: 10.855, borderRadius: 8 }}
        >
          <img src={dotsIcon} alt="More" style={{ width: 18, height: 18 }} className="object-contain" />
        </button>
        <button
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{ padding: 10.855, borderRadius: 8, backgroundColor: '#e5ecf5' }}
        >
          <img src={chatPaneIcon} alt="Chat" style={{ width: 18, height: 18 }} className="object-contain" />
        </button>
      </div>
    </div>

    {/* Breadcrumb + Title below pane bar */}
    <div className="relative shrink-0 z-10" style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 8 }}>
      <div className="flex items-center gap-2 mb-2">
        <img src={spaceIcon} alt="Space" className="w-4 h-4 object-contain opacity-60" />
        <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 12, fontWeight: 400, color: '#636d83' }}>Spaces</span>
        <ChevronRight size={12} style={{ color: '#636d83' }} />
        <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 12, fontWeight: 400, color: '#636d83' }}>Store Operations</span>
      </div>
      <h1 style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 26, fontWeight: 300, lineHeight: '32px', color: '#0b0c0f', margin: 0, marginTop: 8 }}>
        Store Manager Dashboard — Produce Dept
      </h1>
    </div>
  </>
);

/* ══════════════════════════════════════════════════════
   AI INSIGHTS PANEL  (same pattern as InsightsPanel)
══════════════════════════════════════════════════════ */
const InsightsPanel = ({ onClose }: { onClose: () => void }) => (
  <div className="rounded-[7px] border border-primary/20 bg-primary/5 p-5 relative animate-[fade-in-up_0.35s_ease-out_both]" style={{ margin: '16px 24px 0' }}>
    <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={14} /></button>
    <h3 className="text-sap-sm font-medium text-foreground mb-3">AI Shift Insights</h3>
    <ul className="space-y-2 text-sap-sm text-foreground">
      <li className="flex gap-2"><AlertTriangle size={13} className="text-warning shrink-0 mt-0.5" /><span>Lunch rush in <strong>18 minutes</strong> — Banana, Avocado and Strawberry will likely run out. Zone A needs immediate attention.</span></li>
      <li className="flex gap-2"><Ban size={13} className="text-destructive shrink-0 mt-0.5" /><span>Baby Spinach has <strong>zero back stock</strong>. Stock-out predicted at 12:15 PM — submit reorder now to avoid full loss.</span></li>
      <li className="flex gap-2"><CheckCircle2 size={13} className="text-success shrink-0 mt-0.5" /><span>Shift is <strong>33% complete</strong>. Jordan M. is performing well — 4 tasks done. Alex T. has 0 completions — check in.</span></li>
      <li className="flex gap-2"><TrendingDown size={13} className="text-primary shrink-0 mt-0.5" /><span>Tomatoes and Avocados expire in <strong>2 days</strong>. Applying markdowns now could recover ~$68 before loss.</span></li>
    </ul>
  </div>
);

/* ══════════════════════════════════════════════════════
   KPI SUMMARY  (same pattern as SummaryStats)
══════════════════════════════════════════════════════ */
const SummaryStats = ({ alerts }: { alerts: StoreAlert[] }) => {
  const critical  = alerts.filter(a => a.severity === "Critical").length;
  const warnings  = alerts.filter(a => a.severity === "Warning").length;
  const inProgress = alerts.filter(a => a.status === "In Progress").length;
  const done      = alerts.filter(a => a.status === "Done").length;

  return (
    <div className="bg-card rounded-[7px] border border-border/55 p-4 md:p-5 animate-[fade-in-up_0.4s_ease-out_both]" style={{ margin: '24px 24px 0', animationDelay: '100ms' }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sap-base font-semibold text-foreground">Shift Overview</h2>
        <span className="text-sap-xs text-muted-foreground">Mid Shift · 10:42 AM</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <div>
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Critical Alerts</p>
          <p className="text-sap-lg font-medium text-destructive">{critical}</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Warnings</p>
          <p className="text-sap-lg font-medium text-warning">{warnings}</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">In Progress</p>
          <p className="text-sap-lg font-medium text-primary">{inProgress}</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Completed</p>
          <p className="text-sap-lg font-medium text-success">{done + 4}</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Shrink Today</p>
          <p className="text-sap-lg font-medium text-foreground">$14.80</p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   ALERT CARD  (mirrors FlaggedInvoiceCard)
══════════════════════════════════════════════════════ */
const AlertCard = ({
  alert,
  onAssign,
  onResolve,
  onEscalate,
}: {
  alert: StoreAlert;
  onAssign: (id: string, name: string) => void;
  onResolve: (id: string) => void;
  onEscalate: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-card rounded-[7px] border transition-all duration-200 ${
      alert.severity === "Critical" ? "border-destructive/30" :
      alert.severity === "Warning"  ? "border-warning/30" : "border-border/55"
    } animate-[fade-in-up_0.4s_ease-out_both]`}>
      {/* Card header */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <SeverityPill severity={alert.severity} />
            <span className="text-sap-xs text-muted-foreground">{alert.zone}</span>
            <span className="text-sap-xs text-muted-foreground">·</span>
            <span className="text-sap-xs text-muted-foreground">{alert.time}</span>
          </div>
          <p className="text-sap-sm font-semibold text-foreground truncate">{alert.product}</p>
          <p className="text-sap-xs text-muted-foreground mt-0.5">{alert.issue}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <TaskStatusPill status={alert.status} />
          <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border/40 pt-3 animate-[fade-in-up_0.2s_ease-out_both]">
          <p className="text-sap-sm text-foreground mb-3">{alert.detail}</p>

          <div className="flex items-center gap-2 mb-3 text-sap-xs text-muted-foreground">
            <Users size={12} />
            <span>Assignee: <strong>{alert.assignee ?? "Unassigned"}</strong></span>
          </div>

          {/* Action buttons */}
          {alert.status !== "Done" && (
            <div className="flex flex-wrap gap-2">
              {!alert.assignee && (
                <>
                  <button
                    onClick={() => onAssign(alert.id, "Jordan M.")}
                    className="px-3 py-1.5 rounded-[6px] text-sap-xs font-medium border border-border bg-background hover:bg-secondary transition-colors"
                  >
                    Assign to Jordan
                  </button>
                  <button
                    onClick={() => onAssign(alert.id, "Alex T.")}
                    className="px-3 py-1.5 rounded-[6px] text-sap-xs font-medium border border-border bg-background hover:bg-secondary transition-colors"
                  >
                    Assign to Alex
                  </button>
                </>
              )}
              <button
                onClick={() => onResolve(alert.id)}
                className="px-3 py-1.5 rounded-[6px] text-sap-xs font-medium bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => onEscalate(alert.id)}
                className="px-3 py-1.5 rounded-[6px] text-sap-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
              >
                Escalate
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   ASSOCIATE CARD
══════════════════════════════════════════════════════ */
const AssociateCard = ({ associate }: { associate: Associate }) => {
  const statusColor = associate.status === "On Floor" ? "text-success" : associate.status === "Break" ? "text-warning" : "text-primary";
  const pct = Math.round((associate.tasksDone / Math.max(1, associate.tasksDone + associate.tasksOpen)) * 100);

  return (
    <div className="bg-card rounded-[7px] border border-border/55 p-4 animate-[fade-in-up_0.4s_ease-out_both]">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sap-xs font-semibold text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #8A48E6, #470CED)" }}>
          {associate.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sap-sm font-semibold text-foreground">{associate.name}</p>
          <p className="text-sap-xs text-muted-foreground">{associate.zone}</p>
        </div>
        <span className={`text-sap-xs font-medium ${statusColor}`}>{associate.status}</span>
      </div>
      <div className="flex items-center justify-between text-sap-xs text-muted-foreground mb-1.5">
        <span>{associate.tasksDone} done · {associate.tasksOpen} open</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   ACTIVITY FEED  (identical to Spaces ActivityFeed)
══════════════════════════════════════════════════════ */
const ActivityFeed = () => (
  <div className="bg-card rounded-[7px] border border-border/55 p-4 md:p-5 animate-[fade-in-up_0.4s_ease-out_both]" style={{ margin: '16px 24px 0', animationDelay: '300ms' }}>
    <h2 className="text-sap-sm font-semibold text-foreground mb-3">Activity Feed</h2>
    <div className="space-y-3">
      {activityFeed.map((entry, i) => {
        const Icon = entry.icon;
        return (
          <div key={i} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
              <Icon size={12} className={entry.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sap-xs font-medium text-foreground">{entry.action}</p>
              <p className="text-sap-xs text-muted-foreground">{entry.detail}</p>
            </div>
            <span className="text-sap-xs text-muted-foreground shrink-0">{entry.time}</span>
          </div>
        );
      })}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   SPACE CHAT PANEL  — Figma Right Pane (508px, #f8f9fa)
══════════════════════════════════════════════════════ */
type ChatMessage = {
  role: "user" | "bot";
  text: string;
  time: string;
  widget?: "task-summary" | "assign-confirm" | "reorder-confirm";
  widgetData?: Record<string, string>;
};

const botReplies: Record<string, string> = {
  default: "I'm monitoring the full shift in real time. Ask me to reassign tasks, check any item's stock level, draft a reorder, or summarise the shift for handoff.",
  reorder: "I've drafted a reorder request for Baby Spinach 5oz (SKU-2203). Qty: 3 cases (36 units). Estimated delivery: tomorrow 8 AM. Want me to submit it?",
  assign:  "I can reassign Alex T. from Zone C to help Jordan in Zone A with the Strawberry and Banana pull. Sam K. covers the delivery verification solo. Confirm?",
  handoff: "Here's your shift summary:\n\n• 4 tasks completed, 8 open\n• 3 critical alerts (Strawberry, Avocado, Spinach)\n• $14.80 shrink logged\n• Afternoon delivery at 11:30 AM — 3 items still unverified\n• Cooler in 4B flagged — facilities notified\n\nShall I send this to the afternoon manager?",
  markdown: "I'll apply a 15% markdown to Heirloom Tomatoes (pint) and Hass Avocado to drive velocity before expiry. Estimated revenue recovery: ~$68. Confirm?",
  status:  "Current status:\n• Jordan M. (Zone A): On floor, 3 tasks open\n• Sam K. (Zone B): Back room, 3 tasks open\n• Alex T. (Zone C): On floor, 2 tasks open — 0 completions so far this shift.",
};

function getBotReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("reorder") || t.includes("spinach") || t.includes("order")) return botReplies.reorder;
  if (t.includes("assign") || t.includes("reassign") || t.includes("alex") || t.includes("jordan")) return botReplies.assign;
  if (t.includes("handoff") || t.includes("summary") || t.includes("end of shift")) return botReplies.handoff;
  if (t.includes("markdown") || t.includes("expir") || t.includes("tomato") || t.includes("avocado")) return botReplies.markdown;
  if (t.includes("status") || t.includes("team") || t.includes("associate")) return botReplies.status;
  return botReplies.default;
}

const JouleAvatar = () => (
  <div
    className="shrink-0 flex items-center justify-center overflow-hidden"
    style={{ width: 24, height: 24, borderRadius: '50%', background: "linear-gradient(135deg, #BA79EF, #470CED)" }}
  >
    <Zap size={11} className="text-white" />
  </div>
);

// Figma MessageActions — copy, thumb-up, thumb-down, refresh, folder, lightbulb, Sources badge, dots
const MessageActions = () => (
  <div className="flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
    {[Copy, ThumbsUp, ThumbsDown, RotateCcw, Volume2, Share2].map((Icon, i) => (
      <button
        key={i}
        className="flex items-center justify-center rounded transition-colors hover:bg-[#f0f2f4]"
        style={{ padding: 8, borderRadius: 4 }}
      >
        <Icon size={16} style={{ color: '#636d83' }} />
      </button>
    ))}
    {/* Sources badge */}
    <button
      className="flex items-center gap-1.5 hover:bg-[#f0f2f4] transition-colors"
      style={{ padding: '5px 8px', borderRadius: 8, minHeight: 26 }}
    >
      <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 14, fontWeight: 600, color: '#636d83', whiteSpace: 'nowrap' }}>Sources</span>
      <span
        className="flex items-start px-1.5"
        style={{ borderRadius: 100, backgroundColor: '#ded3ff' }}
      >
        <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 14, fontWeight: 400, lineHeight: '20px', color: '#552cff', letterSpacing: '0.25px' }}>3</span>
      </span>
    </button>
    <button
      className="flex items-center justify-center rounded transition-colors hover:bg-[#f0f2f4]"
      style={{ padding: 8, borderRadius: 4 }}
    >
      <MoreHorizontal size={16} style={{ color: '#636d83' }} />
    </button>
  </div>
);

const SpaceChatPanel = ({
  alerts,
  onAssign,
}: {
  alerts: StoreAlert[];
  onAssign: (id: string, name: string) => void;
}) => {
  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: `Space created for **Store Manager Dashboard — Produce Dept**.\n\nI'm monitoring ${alerts.length} active alerts across 3 zones. There are 3 critical items that need attention before the lunch rush in ~18 minutes. How would you like to proceed?`,
      time: "10:42 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = { role: "user", text, time: now() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages(m => [...m, { role: "bot", text: getBotReply(text), time: now() }]);
    }, 1200);
  };

  const quickActions = ["Reorder Baby Spinach", "Reassign Alex to Zone A", "Apply markdowns", "Team status", "Prepare handoff"];

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: '#f8f9fa', borderLeft: '1px solid #e6e7ea' }}
    >
      {/* Right Pane Header — Figma PaneBar section="Right Pane" */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{ padding: '20px 24px', gap: 16 }}
      >
        <div className="flex items-center min-w-0 flex-1" style={{ gap: 16 }}>
          <div className="flex items-center gap-2 min-w-0">
            <img src={spaceIcon} alt="" className="w-4 h-4 object-contain opacity-60 shrink-0" />
            <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 16, fontWeight: 600, lineHeight: '22px', color: '#0b0c0f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Store Manager Chat
            </span>
          </div>
        </div>
        <button
          className="flex items-center justify-center rounded-lg hover:bg-[#f0f2f4] transition-colors shrink-0"
          style={{ padding: 10.855, borderRadius: 8 }}
        >
          <Plus size={18} style={{ color: '#0b0c0f' }} />
        </button>
      </div>

      {/* Space created notification */}
      <div className="shrink-0" style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 8 }}>
        <div
          className="flex items-center gap-2 py-2 px-3"
          style={{ borderRadius: 6, backgroundColor: 'rgba(93,54,255,0.05)', border: '1px solid rgba(93,54,255,0.15)' }}
        >
          <img src={spaceIcon} alt="" className="w-3.5 h-3.5 object-contain opacity-70" />
          <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 12, fontWeight: 600, color: '#552cff' }}>Space created · Today 10:42 AM</span>
        </div>
      </div>

      {/* Messages — Figma font: 72 Regular 14px/20px */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ padding: '0 16px 16px' }}>
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "bot" && <JouleAvatar />}
              <div className="max-w-[85%] group">
                {msg.role === "user" ? (
                  <div
                    className="px-3 py-2"
                    style={{ backgroundColor: '#f0f2f4', borderRadius: 10, borderTopRightRadius: 3, color: '#0b0c0f', fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 14, fontWeight: 400, lineHeight: '20px' }}
                  >
                    {msg.text}
                  </div>
                ) : (
                  <div>
                    <div style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 14, fontWeight: 400, lineHeight: '20px', color: '#0b0c0f', whiteSpace: 'pre-line' }}>
                      {msg.text.split("**").map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                      )}
                    </div>
                    <MessageActions />
                  </div>
                )}
                <p style={{ fontSize: 12, color: '#636d83', marginTop: 4, textAlign: msg.role === "user" ? 'right' : 'left', fontFamily: '"72","72full",Arial,Helvetica,sans-serif' }}>{msg.time}</p>
              </div>
            </div>
          ))}

          {thinking && (
            <div className="flex gap-2 justify-start">
              <JouleAvatar />
              <div className="flex gap-1 items-center py-2 px-3">
                {[0, 1, 2].map(i => (
                  <span key={i} className="rounded-full animate-bounce"
                    style={{ width: 6, height: 6, backgroundColor: 'rgba(93,54,255,0.4)', animationDelay: `${i * 0.15}s`, display: 'block' }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Gradient backdrop + Joule Input — matches Figma exactly */}
      <div className="shrink-0 relative">
        {/* Gradient fade */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            bottom: '100%',
            height: 80,
            background: 'linear-gradient(to bottom, rgba(248,249,250,0) 0%, rgba(248,249,250,0.8) 50%, #f8f9fa 100%)',
          }}
        />

        {/* Quick action pills */}
        <div className="flex flex-wrap gap-1.5" style={{ padding: '0 24px 12px' }}>
          {quickActions.map(action => (
            <button
              key={action}
              onClick={() => setInput(action)}
              className="transition-colors hover:bg-[#f0f2f4]"
              style={{ padding: '4px 10px', borderRadius: 100, border: '1px solid #e6e7ea', backgroundColor: '#fdfeff', fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 12, fontWeight: 400, color: '#0b0c0f' }}
            >
              {action}
            </button>
          ))}
        </div>

        {/* Joule Input — Figma: purple gradient border, card bg #fdfeff, shadow spec */}
        <div style={{ padding: '0 24px 16px' }}>
          <div
            style={{
              backgroundColor: '#fdfeff',
              borderRadius: 8,
              border: `2px solid ${input.trim() ? '#4295ff' : '#b894ff'}`,
              boxShadow: input.trim()
                ? '0px 0px 4px 0px rgba(120,88,255,0.2), 0px 8px 24px 0px rgba(120,88,255,0.16), 0px 24px 16px 0px rgba(0,0,0,0.05), 0px 8px 8px 0px rgba(0,0,0,0.05)'
                : '0px 0px 4px 0px rgba(120,88,255,0.15), 0px 4px 12px 0px rgba(120,88,255,0.10)',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          >
            {/* Text input area */}
            <div style={{ padding: '12px 16px 0 16px' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Message Joule..."
                rows={2}
                className="w-full outline-none resize-none bg-transparent"
                style={{
                  fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
                  fontSize: 16,
                  fontStyle: input ? 'normal' : 'italic',
                  fontWeight: 400,
                  lineHeight: '22px',
                  color: input ? '#0b0c0f' : '#636d83',
                }}
              />
            </div>

            {/* Actions row */}
            <div className="flex items-center justify-between" style={{ padding: '8px 16px 12px' }}>
              <div className="flex items-center" style={{ gap: 8 }}>
                {/* + button */}
                <button
                  className="flex items-center justify-center rounded hover:bg-[#f0f2f4] transition-colors"
                  style={{ padding: 6, borderRadius: 4, backgroundColor: '#f0f2f4' }}
                >
                  <Plus size={12} style={{ color: '#0b0c0f' }} />
                </button>
                {/* @ button */}
                <button
                  className="flex items-center justify-center rounded hover:bg-[#f0f2f4] transition-colors"
                  style={{ padding: 6, borderRadius: 4, backgroundColor: '#f0f2f4' }}
                >
                  <AtSign size={12} style={{ color: '#0b0c0f' }} />
                </button>
                {/* Space pill — Figma: #ded3ff bg, #552cff text */}
                <div
                  className="flex items-center"
                  style={{ gap: 4, padding: '4px 6px', borderRadius: 4, backgroundColor: '#ded3ff' }}
                >
                  <img src={spaceIcon} alt="" style={{ width: 12, height: 12 }} className="object-contain opacity-80" />
                  <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 12, fontWeight: 600, lineHeight: '16px', color: '#552cff', whiteSpace: 'nowrap' }}>
                    Space
                  </span>
                </div>
              </div>

              {/* Send button — Figma: #5d36ff bg, disabled 40% opacity */}
              <button
                onClick={send}
                disabled={!input.trim()}
                className="flex items-center justify-center transition-all"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  backgroundColor: '#5d36ff',
                  opacity: input.trim() ? 1 : 0.4,
                  padding: 6,
                }}
              >
                <Send size={12} className="text-white" />
              </button>
            </div>
          </div>

          {/* AI Notice */}
          <p
            className="text-center"
            style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 12, fontWeight: 400, lineHeight: '16px', color: '#353c4a', marginTop: 12, paddingBottom: 4 }}
          >
            Joule uses AI, verify results.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   TASK DATA
══════════════════════════════════════════════════════ */
type TaskPriority = "High" | "Medium" | "Low";
type EmployeeTaskStatus = "To Do" | "In Progress" | "Done";

interface EmployeeTask {
  id: string;
  title: string;
  zone: string;
  priority: TaskPriority;
  status: EmployeeTaskStatus;
  time?: string;
}

interface EmployeeColumn {
  id: string;
  name: string;
  initials: string;
  role: string;
  floorStatus: "On Floor" | "Break" | "Back Room";
  tasks: EmployeeTask[];
}

const initialTaskBoard: EmployeeColumn[] = [
  {
    id: "jordan",
    name: "Jordan M.",
    initials: "JM",
    role: "Zone A Lead",
    floorStatus: "On Floor",
    tasks: [
      { id: "t1", title: "Restock Organic Strawberries", zone: "Zone A · Shelf 3A", priority: "High", status: "In Progress", time: "Due 11:00 AM" },
      { id: "t2", title: "Pull Banana back stock", zone: "Zone A · Shelf 1A", priority: "High", status: "In Progress", time: "Due 11:15 AM" },
      { id: "t3", title: "Check avocado facing", zone: "Zone A · Shelf 2B", priority: "Medium", status: "To Do" },
      { id: "t4", title: "Restock Organic Bananas", zone: "Zone A", priority: "Medium", status: "Done", time: "10:35 AM" },
      { id: "t5", title: "Morning produce rotation", zone: "Zone A", priority: "Low", status: "Done", time: "9:02 AM" },
    ],
  },
  {
    id: "sam",
    name: "Sam K.",
    initials: "SK",
    role: "Zone B Lead",
    floorStatus: "Back Room",
    tasks: [
      { id: "t6", title: "Verify 3 unscanned delivery items", zone: "Back Room", priority: "High", status: "In Progress", time: "Due 11:30 AM" },
      { id: "t7", title: "Restock Hass Avocados", zone: "Zone B · Shelf 2A", priority: "High", status: "To Do", time: "Due 11:00 AM" },
      { id: "t8", title: "Date-check dairy items", zone: "Zone B", priority: "Medium", status: "To Do" },
      { id: "t9", title: "Morning delivery receipt", zone: "Back Room", priority: "Medium", status: "Done", time: "9:15 AM" },
    ],
  },
  {
    id: "alex",
    name: "Alex T.",
    initials: "AT",
    role: "Zone C",
    floorStatus: "On Floor",
    tasks: [
      { id: "t10", title: "Submit reorder for Baby Spinach", zone: "Zone C", priority: "High", status: "To Do", time: "Urgent" },
      { id: "t11", title: "Apply markdown — Heirloom Tomatoes", zone: "Zone C · Shelf 4A", priority: "Medium", status: "To Do" },
      { id: "t12", title: "Cull damaged blackberries", zone: "Zone C", priority: "Medium", status: "To Do" },
    ],
  },
];

/* ══════════════════════════════════════════════════════
   PERSONALIZATION / MY DAY SECTION
══════════════════════════════════════════════════════ */
const dayMetrics = [
  { label: "Shift Start", value: "8:00 AM" },
  { label: "Dept", value: "Produce" },
  { label: "Team on Floor", value: "3 Associates" },
  { label: "Shrink Today", value: "$14.80" },
  { label: "Shift Progress", value: "33%" },
];

const MyDaySection = () => (
  <div style={{ padding: '40px 80px 0' }}>
    {/* Greeting */}
    <h1 style={{
      fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
      fontSize: 40,
      fontWeight: 400,
      lineHeight: '48px',
      color: '#0b0c0f',
      margin: 0,
      marginBottom: 32,
    }}>
      Good morning, Sarah.
    </h1>

    {/* KV metrics row — Figma: label 14px tertiary, value 20px primary */}
    <div className="flex items-start flex-wrap" style={{ gap: '0 40px', marginBottom: 28 }}>
      {dayMetrics.map((m, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{
            fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '20px',
            color: '#636d83',
          }}>{m.label}</span>
          <span style={{
            fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
            fontSize: 20,
            fontWeight: 600,
            lineHeight: '28px',
            color: '#0b0c0f',
          }}>{m.value}</span>
        </div>
      ))}
    </div>

    {/* AI narrative insight */}
    <div
      style={{
        borderRadius: 8,
        border: '1px solid rgba(93,54,255,0.18)',
        backgroundColor: '#f6f3ff',
        padding: '16px 20px',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 flex items-center justify-center"
          style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #BA79EF, #470CED)', marginTop: 1 }}
        >
          <Zap size={13} className="text-white" />
        </div>
        <p style={{
          fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
          fontSize: 14,
          fontWeight: 400,
          lineHeight: '22px',
          color: '#353c4a',
          margin: 0,
        }}>
          <strong style={{ color: '#0b0c0f', fontWeight: 600 }}>3 critical stock issues</strong> need action before the lunch rush in ~18 minutes — Strawberry, Avocado, and Baby Spinach. Jordan and Sam are already working two of them. Alex T. has 0 completions this shift; consider redirecting to Baby Spinach reorder.
        </p>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   TASK BOARD
══════════════════════════════════════════════════════ */
const taskPriorityStyle: Record<TaskPriority, { dot: string; label: string }> = {
  High:   { dot: '#d9291c', label: '#d9291c' },
  Medium: { dot: '#e76500', label: '#e76500' },
  Low:    { dot: '#636d83', label: '#636d83' },
};

const taskStatusIcon = (status: EmployeeTaskStatus) => {
  if (status === "Done")        return <CheckCircle2 size={13} style={{ color: '#198450' }} />;
  if (status === "In Progress") return <Circle size={13} style={{ color: '#0070f2', fill: 'rgba(0,112,242,0.15)' }} />;
  return <Circle size={13} style={{ color: '#636d83' }} />;
};

const TaskCard = ({ task }: { task: EmployeeTask }) => {
  const pri = taskPriorityStyle[task.priority];
  return (
    <div
      style={{
        borderRadius: 6,
        border: '1px solid #e6e7ea',
        backgroundColor: task.status === "Done" ? '#fafafa' : '#ffffff',
        padding: '10px 12px',
        opacity: task.status === "Done" ? 0.7 : 1,
      }}
    >
      <div className="flex items-start gap-2">
        <div className="shrink-0 mt-0.5">{taskStatusIcon(task.status)}</div>
        <div className="flex-1 min-w-0">
          <p style={{
            fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
            fontSize: 13,
            fontWeight: task.status === "Done" ? 400 : 600,
            lineHeight: '18px',
            color: task.status === "Done" ? '#636d83' : '#0b0c0f',
            textDecoration: task.status === "Done" ? 'line-through' : 'none',
            margin: 0,
          }}>{task.title}</p>
          <p style={{
            fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
            fontSize: 11,
            fontWeight: 400,
            lineHeight: '16px',
            color: '#636d83',
            margin: '2px 0 0',
          }}>{task.zone}</p>
        </div>
      </div>
      {(task.priority !== "Low" || task.time) && (
        <div className="flex items-center gap-2 mt-2 ml-5">
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '1px 6px', borderRadius: 100,
            backgroundColor: task.priority === "High" ? 'rgba(217,41,28,0.08)' : task.priority === "Medium" ? 'rgba(231,101,0,0.08)' : 'rgba(99,109,131,0.08)',
            fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
            fontSize: 11, fontWeight: 600, color: pri.label,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: pri.dot, display: 'inline-block' }} />
            {task.priority}
          </span>
          {task.time && (
            <span style={{
              fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
              fontSize: 11, fontWeight: 400, color: task.priority === "High" && task.time?.startsWith("Due") ? '#d9291c' : '#636d83',
            }}>
              {task.time}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const EmployeeTaskColumn = ({ employee }: { employee: EmployeeColumn }) => {
  const done = employee.tasks.filter(t => t.status === "Done").length;
  const total = employee.tasks.length;
  const pct = Math.round((done / Math.max(1, total)) * 100);
  const statusColor = employee.floorStatus === "On Floor" ? '#198450' : employee.floorStatus === "Break" ? '#e76500' : '#0070f2';

  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 0,
        borderRadius: 8,
        border: '1px solid #e6e7ea',
        backgroundColor: '#ffffff',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Column header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="flex items-center justify-center text-white shrink-0"
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #8A48E6, #470CED)', fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 12, fontWeight: 600 }}
          >
            {employee.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 14, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>{employee.name}</p>
            <p style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 11, fontWeight: 400, color: '#636d83', margin: 0 }}>{employee.role}</p>
          </div>
          <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 11, fontWeight: 600, color: statusColor }}>{employee.floorStatus}</span>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: '#e6e7ea' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#198450' : '#0070f2', transition: 'width 0.5s' }} />
          </div>
          <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 11, color: '#636d83', whiteSpace: 'nowrap' }}>{done}/{total}</span>
        </div>
      </div>

      {/* Task cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {employee.tasks.map(task => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  );
};

const TaskBoardSection = ({ taskBoard }: { taskBoard: EmployeeColumn[] }) => {
  const totalOpen = taskBoard.flatMap(e => e.tasks).filter(t => t.status !== "Done").length;
  const totalDone = taskBoard.flatMap(e => e.tasks).filter(t => t.status === "Done").length;

  return (
    <div style={{ padding: '40px 80px 0' }}>
      {/* Section header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 20, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>Task Board</h2>
          <p style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 13, fontWeight: 400, color: '#636d83', margin: '4px 0 0' }}>
            {totalOpen} open · {totalDone} completed · 3 associates
          </p>
        </div>
        <button
          style={{
            padding: '7px 14px', borderRadius: 6,
            border: '1px solid #e6e7ea', backgroundColor: '#ffffff',
            fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
            fontSize: 13, fontWeight: 600, color: '#0b0c0f',
            cursor: 'pointer',
          }}
        >
          + Add Task
        </button>
      </div>

      {/* Employee columns */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {taskBoard.map(emp => <EmployeeTaskColumn key={emp.id} employee={emp} />)}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   STORE FLOORPLAN MODAL
══════════════════════════════════════════════════════ */
type AisleStatus = 'critical' | 'warning' | 'ok';
interface AisleCell { id: string; label: string; status: AisleStatus; issue?: string; }

const AISLES: AisleCell[][] = [
  [
    { id: '1A', label: 'Bananas & Citrus',      status: 'ok'       },
    { id: '1B', label: 'Apples & Pears',         status: 'ok'       },
    { id: '1C', label: 'Stone Fruit',            status: 'ok'       },
    { id: '1D', label: 'Fresh Herbs',            status: 'critical', issue: 'Delivery not stocked' },
  ],
  [
    { id: '2A', label: 'Tropical Fruit',         status: 'ok'       },
    { id: '2B', label: 'Avocados & Limes',       status: 'critical', issue: '~2 units left' },
    { id: '2C', label: 'Berries (shelf)',         status: 'ok'       },
    { id: '2D', label: 'Lemons & Oranges',       status: 'warning'  },
  ],
  [
    { id: '3A', label: 'Strawberries',           status: 'critical', issue: 'Likely empty' },
    { id: '3B', label: 'Blueberries',            status: 'warning'  },
    { id: '3C', label: 'Tomatoes & Peppers',     status: 'warning'  },
    { id: '3D', label: 'Mushrooms',              status: 'ok'       },
  ],
  [
    { id: '4A', label: 'Refrig: Salads',         status: 'ok'       },
    { id: '4B', label: 'Refrig: Cut Fruit',      status: 'ok'       },
    { id: '4C', label: 'Refrig: Spinach',        status: 'warning'  },
    { id: '4D', label: 'Refrig: Juices',         status: 'ok'       },
  ],
];

const STATUS_STYLE: Record<AisleStatus, { bg: string; border: string; badge: string; badgeText: string }> = {
  critical: { bg: '#fff0f0', border: '#d9291c', badge: '#d9291c', badgeText: 'Empty / Out' },
  warning:  { bg: '#fff8f0', border: '#e76500', badge: '#e76500', badgeText: 'Running Low' },
  ok:       { bg: '#f6fff8', border: '#c8e6c9', badge: '#198450', badgeText: 'OK'          },
};

const FloorplanModal = ({ onClose }: { onClose: () => void }) => {
  const criticalAisles = AISLES.flat().filter(a => a.status === 'critical');
  return (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
    onClick={onClose}
  >
    <div
      style={{
        backgroundColor: '#fff', borderRadius: 12, width: '100%', maxWidth: 680,
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #e6e7ea', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#f1ecff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={18} style={{ color: '#552cff' }} />
          </div>
          <div>
            <p style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 16, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>
              Store Floorplan — Produce Dept
            </p>
            <p style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 12, color: '#636d83', margin: '2px 0 0' }}>
              Shelf positions · Live stock status
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#636d83', display: 'flex' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div style={{ overflowY: 'auto', padding: '20px 24px 24px' }}>

        {/* ── Critical issues alert banner ── */}
        <div style={{ backgroundColor: '#fff0f0', border: '1.5px solid #d9291c', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <AlertCircle size={16} style={{ color: '#d9291c', flexShrink: 0 }} />
            <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 13, fontWeight: 700, color: '#d9291c' }}>
              {criticalAisles.length} Critical Issue{criticalAisles.length !== 1 ? 's' : ''} — Immediate Action Required
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {criticalAisles.map(aisle => (
              <div key={aisle.id} style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#fff', border: '1px solid #f5c2c2', borderRadius: 7, padding: '9px 12px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#d9291c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 13, fontWeight: 700, color: '#fff' }}>{aisle.id}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 13, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>{aisle.label}</p>
                  {aisle.issue && <p style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 11, color: '#d9291c', margin: '2px 0 0' }}>{aisle.issue}</p>}
                </div>
                <div style={{ backgroundColor: '#d9291c', borderRadius: 10, padding: '2px 8px', fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: '"72","72full",Arial,Helvetica,sans-serif', flexShrink: 0 }}>
                  EMPTY / OUT
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
          {(['critical', 'warning', 'ok'] as AisleStatus[]).map(s => (
            <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 12, color: '#636d83' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: STATUS_STYLE[s].badge, display: 'inline-block' }} />
              {STATUS_STYLE[s].badgeText}
            </span>
          ))}
        </div>

        {/* Entrance strip */}
        <div style={{ backgroundColor: '#fffde7', border: '1.5px solid #f9a825', borderRadius: 8, padding: '8px 16px', textAlign: 'center', marginBottom: 12, fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 13, fontWeight: 600, color: '#5d4037' }}>
          🛒 Entrance / Checkout
        </div>

        {/* Aisle grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {AISLES.map((row, ri) => (
            <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {row.map(aisle => {
                const s = STATUS_STYLE[aisle.status];
                const isCritical = aisle.status === 'critical';
                return (
                  <div key={aisle.id} style={{ backgroundColor: s.bg, border: `2px solid ${s.border}`, borderRadius: 8, padding: '12px 8px', textAlign: 'center', position: 'relative' }}>
                    {isCritical && (
                      <div style={{ position: 'absolute', top: 6, right: 6 }}>
                        <AlertCircle size={12} style={{ color: '#d9291c' }} />
                      </div>
                    )}
                    <div style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 20, fontWeight: 700, color: isCritical ? '#d9291c' : '#0b0c0f', lineHeight: 1 }}>
                      {aisle.id}
                    </div>
                    <div style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 11, color: '#444', marginTop: 5, lineHeight: 1.3 }}>
                      {aisle.label}
                    </div>
                    <div style={{ marginTop: 6, display: 'inline-block', backgroundColor: s.badge, borderRadius: 10, padding: '2px 7px', fontSize: 10, fontWeight: 600, color: '#fff', fontFamily: '"72","72full",Arial,Helvetica,sans-serif' }}>
                      {s.badgeText}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Back room */}
        <div style={{ marginTop: 8, backgroundColor: '#f5f5f5', border: '1.5px solid #bdbdbd', borderRadius: 8, padding: '8px 16px', textAlign: 'center', fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 13, fontWeight: 500, color: '#616161' }}>
          📦 Back Room / Receiving
        </div>
      </div>
    </div>
  </div>
  );
};

const FloorplanSection = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div style={{ padding: '40px 80px 48px' }}>
        <h2 style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 20, fontWeight: 600, color: '#0b0c0f', margin: '0 0 16px' }}>
          Store Layout
        </h2>
        <div
          style={{
            borderRadius: 8,
            border: '1px solid #e6e7ea',
            backgroundColor: '#ffffff',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            cursor: 'pointer',
          }}
          onClick={() => setOpen(true)}
          className="hover:border-[#0070f2] transition-colors group"
        >
          <div
            style={{
              width: 80, height: 64, borderRadius: 6,
              backgroundColor: '#f1ecff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MapPin size={28} style={{ color: '#552cff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 15, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>
              Store Floorplan — Produce Dept
            </p>
            <p style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 13, fontWeight: 400, color: '#636d83', margin: '4px 0 0' }}>
              View zone layout, shelf positions, and associate assignments in real time.
            </p>
            <div className="flex items-center gap-3 mt-3">
              {[
                { color: '#d9291c', label: 'Zone A — Critical' },
                { color: '#e76500', label: 'Zone B — Warning' },
                { color: '#198450', label: 'Zone C — OK' },
              ].map((z, i) => (
                <span key={i} className="flex items-center gap-1.5" style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 11, color: '#636d83' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: z.color, display: 'inline-block' }} />
                  {z.label}
                </span>
              ))}
            </div>
          </div>
          <ExternalLink size={18} style={{ color: '#636d83', flexShrink: 0 }} className="group-hover:text-[#0070f2] transition-colors" />
        </div>
      </div>
      {open && <FloorplanModal onClose={() => setOpen(false)} />}
    </>
  );
};
/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
const StoreManagerSpacePage = () => {
  const [alerts, setAlerts] = useState<StoreAlert[]>(initialAlerts);
  const [taskBoard]         = useState<EmployeeColumn[]>(initialTaskBoard);

  const handleAssign = (id: string, name: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, assignee: name, status: "In Progress" } : a));
    toast.success(`Assigned to ${name}`);
  };

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
      {/* ── Left Focus Pane — scrollable dashboard ── */}
      <div
        className="flex flex-col flex-1 min-w-0 overflow-hidden"
        style={{
          backgroundColor: '#fdfeff',
          borderLeft: '1px solid #e6e7ea',
          boxShadow: '0px 22px 14px 0px rgba(0,0,0,0.06), 0px 182px 111px 0px rgba(0,0,0,0.05)',
        }}
      >
        <SpaceHeader />

        <div className="flex-1 overflow-y-auto">
          {/* 1. Personalized My Day */}
          <MyDaySection />

          {/* Divider */}
          <div style={{ margin: '40px 80px 0', height: 1, backgroundColor: '#e6e7ea' }} />

          {/* 2. Task Board */}
          <TaskBoardSection taskBoard={taskBoard} />

          {/* Divider */}
          <div style={{ margin: '0 80px', height: 1, backgroundColor: '#e6e7ea' }} />

          {/* 3. Store Floorplan */}
          <FloorplanSection />
        </div>
      </div>

      {/* ── Right Chat Pane — Figma: 508px, #f8f9fa ── */}
      <div style={{ width: 508, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <SpaceChatPanel alerts={alerts} onAssign={handleAssign} />
      </div>
    </div>
  );
};

export default StoreManagerSpacePage;
