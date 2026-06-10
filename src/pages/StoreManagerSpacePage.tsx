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
  recommendation: string;
  suggestedTask: string;
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
    recommendation: "Pull 6 units from back stock immediately. Place full case on Shelf 3A. Check scan-in status after restocking.",
    suggestedTask: "Restock Organic Strawberries — pull 6 units to Shelf 3A",
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
    recommendation: "Restock full case (18 units) to shelf now. Apply 'Buy 2 Get 1' promo tag to clear expiring stock before loss.",
    suggestedTask: "Restock Avocados + apply promo tag — Shelf 2B (18 units, exp. 2 days)",
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
    recommendation: "Submit emergency reorder via supplier portal now. Estimated earliest delivery: tomorrow AM. Place 'Limited Stock' sign on shelf.",
    suggestedTask: "Submit emergency reorder for Baby Spinach 5oz — stock-out predicted 12:15 PM",
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
    recommendation: "Pull full case (24 units) — half-case won't last past lunch rush. Stage second case in back room for rapid replenishment.",
    suggestedTask: "Pull full case of Organic Bananas to Shelf 1A — stage backup in back room",
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
    recommendation: "Complete scan-in for remaining 3 items before 11:30 AM. Move verified stock to floor or cold storage to clear receiving area.",
    suggestedTask: "Complete delivery verification — 3 unverified items before 11:30 AM",
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
    recommendation: "Apply 15% markdown sticker to all 10 units (shelf + back). Move back stock to front shelf for visibility. Log markdown in system.",
    suggestedTask: "Apply 15% markdown to Heirloom Tomatoes — 10 units (shelf + back stock)",
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
   HEADER ICONS (inline SVGs matching screenshot exactly)
══════════════════════════════════════════════════════ */
const TaskListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3" cy="4" r="1.5" fill="#0b0c0f" />
    <circle cx="3" cy="9" r="1.5" fill="#0b0c0f" />
    <circle cx="3" cy="14" r="1.5" fill="#0b0c0f" />
    <rect x="7" y="3" width="9" height="2" rx="1" fill="#0b0c0f" />
    <rect x="7" y="8" width="9" height="2" rx="1" fill="#0b0c0f" />
    <rect x="7" y="13" width="9" height="2" rx="1" fill="#0b0c0f" />
  </svg>
);

const OverviewIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="2" width="3" height="3" rx="0.5" fill="#0b0c0f" />
    <rect x="6" y="3" width="11" height="1.5" rx="0.75" fill="#0b0c0f" />
    <rect x="1" y="7.5" width="3" height="3" rx="0.5" fill="#0b0c0f" />
    <rect x="6" y="8.5" width="11" height="1.5" rx="0.75" fill="#0b0c0f" />
    <rect x="1" y="13" width="3" height="3" rx="0.5" fill="#0b0c0f" />
    <rect x="6" y="14" width="11" height="1.5" rx="0.75" fill="#0b0c0f" />
  </svg>
);

const DotsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3.5" cy="9" r="1.5" fill="#0b0c0f" />
    <circle cx="9" cy="9" r="1.5" fill="#0b0c0f" />
    <circle cx="14.5" cy="9" r="1.5" fill="#0b0c0f" />
  </svg>
);

const ChatPaneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 2H3C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H6L9 16L12 13H15C15.5523 13 16 12.5523 16 12V3C16 2.44772 15.5523 2 15 2Z" stroke="#0057d2" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="5" y1="6.5" x2="13" y2="6.5" stroke="#0057d2" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="5" y1="9.5" x2="10" y2="9.5" stroke="#0057d2" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SpaceHeader = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (t: string) => void }) => {
  const ff = '"72","72full",Arial,Helvetica,sans-serif';
  const tabs = ['Overview', 'Floor Plan', 'Alerts & Notifications', 'Team'];
  return (
    <div className="shrink-0 relative z-10" style={{ borderBottom: '1px solid #e6e7ea' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between" style={{ padding: '20px 24px 0' }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <button
            className="flex items-center justify-center rounded-lg hover:bg-[#f0f2f4] transition-colors"
            style={{ padding: 10.855, borderRadius: 8 }}
          >
            <TaskListIcon />
          </button>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <button
            className="flex items-center gap-2 hover:bg-[#f0f2f4] transition-colors rounded-lg"
            style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 9, paddingBottom: 9, borderRadius: 8 }}
          >
            <OverviewIcon />
            <span style={{ fontFamily: ff, fontSize: 16, fontWeight: 600, lineHeight: '22px', color: '#0b0c0f' }}>
              Overview
            </span>
          </button>
          <button
            className="flex items-center justify-center hover:bg-[#f0f2f4] transition-colors rounded-lg"
            style={{ padding: 10.855, borderRadius: 8 }}
          >
            <DotsIcon />
          </button>
        </div>
      </div>
      {/* Tab bar */}
      <div style={{ display: 'flex', padding: '0 24px', gap: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              fontFamily: ff,
              fontSize: 14,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#0057d2' : '#556170',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #0057d2' : '2px solid transparent',
              padding: '10px 16px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

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
   COMMAND CENTER — top 35% of dashboard
   1. Store Health KPIs
   2. Forecast + Operational Risks
   3. AI Priorities (Critical / Important / Opportunity)
   4. Employee Snapshot
══════════════════════════════════════════════════════ */

interface AIPriority {
  level: 'critical' | 'important' | 'opportunity';
  what: string;
  why: string;
  action: string;
}

const AI_PRIORITIES: AIPriority[] = [
  {
    level: 'critical',
    what: 'Bottled Water will stock out by 3 PM',
    why: 'Velocity up 40% — heat forecast driving demand. Back stock cleared this morning.',
    action: 'Submit emergency reorder now and pull remaining units to floor.',
  },
  {
    level: 'critical',
    what: 'Cashier shortage expected 5–7 PM',
    why: 'Two call-outs confirmed. Fri evening peak historically +60% vs mid-day.',
    action: 'Reassign Alex T. from Zone C or approve overtime for Sam K.',
  },
  {
    level: 'important',
    what: 'Electronics conversion rate down 12%',
    why: 'Competitor ran a flash sale this morning — foot traffic up but basket size down.',
    action: 'Enable in-store price-match offer and flag for category manager.',
  },
  {
    level: 'important',
    what: 'Refunds unusually high in Aisle 8',
    why: '7 refunds in 90 min — all same batch of Greek Yogurt (best-before today).',
    action: 'Pull full batch, log shrink, and swap signage to alternative SKU.',
  },
  {
    level: 'opportunity',
    what: 'Add impulse display near checkout',
    why: 'Checkout dwell time up 3 min due to longer queues — high capture potential.',
    action: 'Move chilled drink cooler from Aisle 2 end-cap to checkout lane 4.',
  },
  {
    level: 'opportunity',
    what: 'Promote sunscreen — high demand forecast',
    why: 'UV index hitting 9 this weekend. Last year same conditions → +$800 sunscreen sales.',
    action: 'Build featured display at store entrance; push offer to loyalty app.',
  },
];

const PRIORITY_CONFIG = {
  critical:    { bg: '#fff0f0', border: '#d9291c', dot: '#d9291c', label: 'Critical',    labelBg: 'rgba(217,41,28,0.1)',  labelColor: '#d9291c',  emoji: '🔴' },
  important:   { bg: '#fff8f0', border: '#e76500', dot: '#e76500', label: 'Important',   labelBg: 'rgba(231,101,0,0.1)',  labelColor: '#e76500',  emoji: '🟠' },
  opportunity: { bg: '#f0fff5', border: '#198450', dot: '#198450', label: 'Opportunity', labelBg: 'rgba(25,132,80,0.1)', labelColor: '#198450',  emoji: '🟢' },
};

const PriorityItem = ({ item, onAddTask }: { item: AIPriority; onAddTask: (task: EmployeeTask, employeeId: string) => void }) => {
  const [open, setOpen]           = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [added, setAdded]         = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const cfg = PRIORITY_CONFIG[item.level];
  const ff  = '"72","72full",Arial,Helvetica,sans-serif';

  if (dismissed) return null;

  const handleAddedFromModal = (task: EmployeeTask, employeeId: string) => {
    onAddTask(task, employeeId);
    setAdded(true);
    setShowModal(false);
    setOpen(false);
  };

  return (
    <>
      <div
        style={{
          borderRadius: 8,
          border: `1.5px solid ${added ? cfg.border : open ? cfg.border : '#e6e7ea'}`,
          backgroundColor: added ? cfg.bg : open ? cfg.bg : '#fff',
          transition: 'all 0.15s',
          opacity: added ? 0.75 : 1,
        }}
      >
        {/* ── Header row — always visible ── */}
        <div
          style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 14px', cursor: 'pointer' }}
          onClick={() => !added && setOpen(o => !o)}
        >
          <span style={{ fontSize: 14, lineHeight: '20px', flexShrink: 0, marginTop: 1 }}>{cfg.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: '#0b0c0f', margin: 0, lineHeight: '18px' }}>{item.what}</p>
          </div>

          {/* Right-side: chevron */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, marginTop: 1 }}>
            {!added && (
              <ChevronDown
                size={14}
                style={{ color: '#636d83', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
              />
            )}
          </div>
        </div>

        {/* ── Expanded detail ── */}
        {open && !added && (
          <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: `1px solid ${cfg.border}22` }}>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              <span style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, color: '#636d83', flexShrink: 0, marginTop: 1 }}>WHY</span>
              <p style={{ fontFamily: ff, fontSize: 12, fontWeight: 400, color: '#353c4a', margin: 0, lineHeight: '18px' }}>{item.why}</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, color: cfg.labelColor, flexShrink: 0, marginTop: 1 }}>DO</span>
              <p style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#0b0c0f', margin: 0, lineHeight: '18px' }}>{item.action}</p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                onClick={e => { e.stopPropagation(); setShowModal(true); }}
                style={{
                  flex: 1, padding: '7px 0', borderRadius: 7,
                  border: '1px solid #c8cdd4', backgroundColor: '#fff',
                  fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#0b0c0f',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}
              >
                <CheckSquare size={12} style={{ color: '#636d83' }} /> Accept suggestion
              </button>
              <button
                onClick={e => { e.stopPropagation(); setDismissed(true); }}
                style={{
                  padding: '7px 14px', borderRadius: 7,
                  border: '1px solid #e6e7ea', backgroundColor: '#fff',
                  fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#636d83',
                  cursor: 'pointer',
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pre-filled confirmation modal */}
      {showModal && (
        <AddTaskModal
          employees={initialTaskBoard}
          prefillTitle={item.what}
          prefillNote={item.action}
          onClose={() => setShowModal(false)}
          onAdd={handleAddedFromModal}
        />
      )}
    </>
  );
};

const CommandCenter = ({ associates, onAddTask }: { associates: Associate[]; onAddTask: (task: EmployeeTask, employeeId: string) => void }) => {
  const ff = '"72","72full",Arial,Helvetica,sans-serif';
  const actionableAlerts = initialAlerts.filter(a => a.status !== 'Done' && (a.severity === 'Critical' || a.severity === 'Warning'));

  return (
    <div style={{ padding: '32px 80px 0' }}>

      {/* ── Row 1: KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 20 }}>
        {/* Tasks Complete */}
        <div style={{ borderRadius: 8, border: '1px solid #e6e7ea', backgroundColor: '#fff', padding: '14px 16px' }}>
          <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 400, color: '#636d83', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tasks Complete</p>
          <p style={{ fontFamily: ff, fontSize: 22, fontWeight: 700, color: '#0b0c0f', margin: '0 0 3px', lineHeight: 1 }}>4 / 12</p>
          <p style={{ fontFamily: ff, fontSize: 11, color: '#636d83', margin: 0 }}>33% shift done</p>
        </div>
        {/* Foot Traffic */}
        <div style={{ borderRadius: 8, border: '1px solid #e6e7ea', backgroundColor: '#fff', padding: '14px 16px' }}>
          <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 400, color: '#636d83', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Foot Traffic</p>
          <p style={{ fontFamily: ff, fontSize: 22, fontWeight: 700, color: '#0070f2', margin: '0 0 3px', lineHeight: 1 }}>+18%</p>
          <p style={{ fontFamily: ff, fontSize: 11, color: '#636d83', margin: 0 }}>by noon</p>
        </div>
        {/* Stock Risk */}
        <div style={{ borderRadius: 8, border: '1px solid #e6e7ea', backgroundColor: '#fff', padding: '14px 16px' }}>
          <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 400, color: '#636d83', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock Risk</p>
          <p style={{ fontFamily: ff, fontSize: 22, fontWeight: 700, color: '#d9291c', margin: '0 0 3px', lineHeight: 1 }}>4</p>
          <p style={{ fontFamily: ff, fontSize: 11, color: '#d9291c', margin: 0 }}>items &lt; 2 hrs</p>
        </div>
        {/* Staffing */}
        <div style={{ borderRadius: 8, border: '1px solid #e6e7ea', backgroundColor: '#fff', padding: '14px 16px' }}>
          <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 400, color: '#636d83', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Staffing</p>
          <p style={{ fontFamily: ff, fontSize: 22, fontWeight: 700, color: '#e76500', margin: '0 0 3px', lineHeight: 1 }}>−2</p>
          <p style={{ fontFamily: ff, fontSize: 11, color: '#e76500', margin: 0 }}>call-outs 5–7 PM</p>
        </div>
        {/* Next Delivery */}
        <div style={{ borderRadius: 8, border: '1px solid #e6e7ea', backgroundColor: '#fff', padding: '14px 16px' }}>
          <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 400, color: '#636d83', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Next Delivery</p>
          <p style={{ fontFamily: ff, fontSize: 22, fontWeight: 700, color: '#0b0c0f', margin: '0 0 3px', lineHeight: 1 }}>11:30</p>
          <p style={{ fontFamily: ff, fontSize: 11, color: '#636d83', margin: 0 }}>3 unverified items</p>
        </div>
      </div>

      {/* ── Actionable Alerts ── */}
      <div style={{ borderRadius: 10, border: '1px solid #f5c2c2', backgroundColor: '#fff', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f2f4', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#d9291c', display: 'inline-block', flexShrink: 0 }} />
          <p style={{ fontFamily: ff, fontSize: 13, fontWeight: 700, color: '#d9291c', margin: 0, flex: 1 }}>Actionable Alerts</p>
          <span style={{ fontFamily: ff, fontSize: 11, color: '#636d83' }}>{actionableAlerts.length} require action</span>
        </div>
        {actionableAlerts.map((a, i, arr) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < arr.length - 1 ? '1px solid #f0f2f4' : 'none' }}>
            <span style={{
              padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: ff, flexShrink: 0,
              backgroundColor: a.severity === 'Critical' ? 'rgba(217,41,28,0.08)' : 'rgba(231,101,0,0.08)',
              color: a.severity === 'Critical' ? '#d9291c' : '#e76500',
            }}>{a.severity}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#0b0c0f', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.product}</p>
              <p style={{ fontFamily: ff, fontSize: 11, color: '#636d83', margin: '1px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.issue}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {a.assignee && <span style={{ fontFamily: ff, fontSize: 11, color: '#9fa8b4' }}>{a.assignee}</span>}
              <span style={{
                padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: ff,
                backgroundColor: a.status === 'In Progress' ? 'rgba(0,112,242,0.08)' : 'rgba(231,101,0,0.08)',
                color: a.status === 'In Progress' ? '#0070f2' : '#e76500',
              }}>{a.status}</span>
              <span style={{ fontFamily: ff, fontSize: 11, color: '#9fa8b4' }}>{a.time}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

/* ══════════════════════════════════════════════════════
   KPI SUMMARY  (kept for chat panel reference, no longer rendered in main scroll)
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
  widget?: "reassign-plan" | "reassign-confirm" | "reassign-done" | "reorder-confirm";
};

/* ── Reassignment plan widget ── */
interface ReassignRow { task: string; from: string; to: string; zone: string; priority: "High" | "Medium"; }

const REASSIGN_PLAN: ReassignRow[] = [
  { task: "Submit reorder for Baby Spinach",       from: "Alex T.", to: "Jordan M.", zone: "Zone C → Action remote", priority: "High"   },
  { task: "Apply markdown — Heirloom Tomatoes",    from: "Alex T.", to: "Sam K.",    zone: "Zone C · Shelf 4A",      priority: "Medium" },
  { task: "Cull damaged blackberries",             from: "Alex T.", to: "Sam K.",    zone: "Zone C",                  priority: "Medium" },
];

const ff = '"72","72full",Arial,Helvetica,sans-serif';

const ReassignPlanWidget = ({ onConfirm, onEdit }: { onConfirm: () => void; onEdit: () => void }) => (
  <div style={{ marginTop: 10, borderRadius: 10, border: '1.5px solid #e6e7ea', backgroundColor: '#fff', overflow: 'hidden' }}>
    {/* Header */}
    <div style={{ backgroundColor: '#fff8f0', borderBottom: '1px solid #f5e0cc', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <AlertTriangle size={14} style={{ color: '#e76500', flexShrink: 0 }} />
      <span style={{ fontFamily: ff, fontSize: 13, fontWeight: 700, color: '#e76500' }}>Alex T. — Unplanned Absence</span>
      <span style={{ marginLeft: 'auto', fontFamily: ff, fontSize: 11, color: '#636d83' }}>3 tasks to reassign</span>
    </div>

    {/* Task rows */}
    <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {REASSIGN_PLAN.map((row, i) => (
        <div key={i} style={{ borderRadius: 7, border: '1px solid #e6e7ea', padding: '9px 12px', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>{row.task}</p>
              <p style={{ fontFamily: ff, fontSize: 11, color: '#636d83', margin: '2px 0 0' }}>{row.zone}</p>
            </div>
            <span style={{
              flexShrink: 0, padding: '2px 7px', borderRadius: 99,
              backgroundColor: row.priority === 'High' ? 'rgba(217,41,28,0.08)' : 'rgba(231,101,0,0.08)',
              fontFamily: ff, fontSize: 10, fontWeight: 700,
              color: row.priority === 'High' ? '#d9291c' : '#e76500',
            }}>{row.priority}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span style={{ fontFamily: ff, fontSize: 11, color: '#636d83', textDecoration: 'line-through' }}>{row.from}</span>
            <ChevronRight size={11} style={{ color: '#636d83', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#8A48E6,#470CED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: ff, fontSize: 9, fontWeight: 700, color: '#fff' }}>{row.to.split(' ').map(w => w[0]).join('')}</span>
              </div>
              <span style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#0b0c0f' }}>{row.to}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Joule rationale */}
    <div style={{ margin: '0 14px 12px', borderRadius: 7, backgroundColor: '#f6f3ff', border: '1px solid rgba(93,54,255,0.15)', padding: '9px 12px' }}>
      <p style={{ fontFamily: ff, fontSize: 12, color: '#353c4a', margin: 0, lineHeight: '18px' }}>
        <strong style={{ color: '#552cff' }}>Why this plan:</strong> Spinach reorder is time-sensitive — Jordan is closest and has capacity. Tomato markdown + blackberry cull are batched to Sam since he's finishing delivery verification nearby.
      </p>
    </div>

    {/* Actions */}
    <div style={{ padding: '0 14px 14px', display: 'flex', gap: 8 }}>
      <button
        onClick={onConfirm}
        style={{ flex: 1, padding: '9px 0', borderRadius: 7, border: 'none', backgroundColor: '#5d36ff', color: '#fff', fontFamily: ff, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
      >
        Confirm Reassignment
      </button>
      <button
        onClick={onEdit}
        style={{ padding: '9px 16px', borderRadius: 7, border: '1px solid #e6e7ea', backgroundColor: '#fff', color: '#0b0c0f', fontFamily: ff, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
      >
        Edit Plan
      </button>
    </div>
  </div>
);

const ReassignDoneWidget = () => (
  <div style={{ marginTop: 10, borderRadius: 10, border: '1.5px solid #c8e6c9', backgroundColor: '#f6fff8', padding: '12px 14px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <CheckCircle2 size={15} style={{ color: '#198450', flexShrink: 0 }} />
      <span style={{ fontFamily: ff, fontSize: 13, fontWeight: 700, color: '#198450' }}>All 3 tasks reassigned</span>
    </div>
    {REASSIGN_PLAN.map((row, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <CheckCircle2 size={11} style={{ color: '#198450', flexShrink: 0 }} />
        <span style={{ fontFamily: ff, fontSize: 12, color: '#0b0c0f' }}><strong>{row.to}</strong> — {row.task}</span>
      </div>
    ))}
    <div style={{ marginTop: 10, padding: '8px 10px', borderRadius: 6, backgroundColor: '#fff', border: '1px solid #e6e7ea' }}>
      <p style={{ fontFamily: ff, fontSize: 12, color: '#636d83', margin: 0 }}>
        📲 Jordan M. and Sam K. have been notified via the associate app. Zone C coverage updated.
      </p>
    </div>
  </div>
);

type ConvState = "idle" | "awaiting-confirm" | "done";

const botReplies: Record<string, string> = {
  default: "I'm monitoring the full shift in real time. Ask me to reassign tasks, check any item's stock level, draft a reorder, or summarise the shift for handoff.",
  reorder: "I've drafted a reorder request for Baby Spinach 5oz (SKU-2203). Qty: 3 cases (36 units). Estimated delivery: tomorrow 8 AM. Want me to submit it?",
  handoff: "Here's your shift summary:\n\n• 4 tasks completed, 8 open\n• 3 critical alerts (Strawberry, Avocado, Spinach)\n• $14.80 shrink logged\n• Afternoon delivery at 11:30 AM — 3 items still unverified\n• Cooler in 4B flagged — facilities notified\n\nShall I send this to the afternoon manager?",
  markdown: "I'll apply a 15% markdown to Heirloom Tomatoes (pint) and Hass Avocado to drive velocity before expiry. Estimated revenue recovery: ~$68. Confirm?",
  status:  "Current status:\n• Jordan M. (Zone A): On floor, 3 tasks open\n• Sam K. (Zone B): Back room, 3 tasks open\n• Alex T. (Zone C): On floor, 2 tasks open — 0 completions so far this shift.",
};

function getBotReply(text: string): { text: string; widget?: ChatMessage["widget"] } {
  const t = text.toLowerCase();
  if (t.includes("reorder") || t.includes("spinach") || t.includes("order")) return { text: botReplies.reorder };
  if (t.includes("handoff") || t.includes("summary") || t.includes("end of shift")) return { text: botReplies.handoff };
  if (t.includes("markdown") || t.includes("expir") || t.includes("tomato")) return { text: botReplies.markdown };
  if (t.includes("status") || t.includes("team")) return { text: botReplies.status };
  // Alex callout flow
  if (t.includes("alex") && (t.includes("off") || t.includes("left") || t.includes("sick") || t.includes("absent") || t.includes("called") || t.includes("take off") || t.includes("took off") || t.includes("reassign"))) {
    return {
      text: "Got it — Alex T. has left the shift unexpectedly. He had **3 open tasks** in Zone C. I've analysed current workloads for Jordan and Sam and put together a reassignment plan.",
      widget: "reassign-plan",
    };
  }
  return { text: botReplies.default };
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
  onReassignConfirmed,
  triggerAlexSignoff,
}: {
  alerts: StoreAlert[];
  onAssign: (id: string, name: string) => void;
  onReassignConfirmed: () => void;
  triggerAlexSignoff: boolean;
}) => {
  const nowStr = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: `Space created for **Store Manager Dashboard — Produce Dept**.\n\nI'm monitoring ${alerts.length} active alerts across 3 zones. There are 3 critical items that need attention before the lunch rush in ~18 minutes. How would you like to proceed?`,
      time: "10:42 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [convState, setConvState] = useState<ConvState>("idle");
  const bottomRef = useRef<HTMLDivElement>(null);
  const alexTriggered = useRef(false);

  // Auto-trigger Joule message when Alex signs off
  useEffect(() => {
    if (!triggerAlexSignoff || alexTriggered.current) return;
    alexTriggered.current = true;
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setConvState("awaiting-confirm");
      addBotMessage(
        "🚨 **Alert:** Alex T. has just signed off — he had **3 open tasks** in Zone C.\n\nI've analysed current workloads for Jordan and Sam and put together a reassignment plan.",
        "reassign-plan"
      );
    }, 1800);
  }, [triggerAlexSignoff]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const addBotMessage = (text: string, widget?: ChatMessage["widget"]) => {
    setMessages(m => [...m, { role: "bot", text, time: nowStr(), widget }]);
  };

  const send = (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;
    const userMsg: ChatMessage = { role: "user", text, time: nowStr() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      const reply = getBotReply(text);
      if (reply.widget === "reassign-plan") setConvState("awaiting-confirm");
      addBotMessage(reply.text, reply.widget);
    }, 1200);
  };

  const handleConfirmReassign = () => {
    setConvState("done");
    setMessages(m => m.map(msg =>
      msg.widget === "reassign-plan" ? { ...msg, widget: "reassign-done" as const } : msg
    ));
    onReassignConfirmed();
    setTimeout(() => {
      addBotMessage("Done. Jordan and Sam have been notified. I've also flagged Zone C as understaffed for the rest of the shift — want me to check if any part-timers are available to cover?");
    }, 600);
  };

  const handleEditPlan = () => {
    addBotMessage("Sure — which task would you like to reassign differently? You can tell me e.g. \"Give the spinach reorder to Sam instead\".");
  };

  const quickActions = convState === "idle"
    ? ["Alex had to take off — reassign tasks", "Reorder Baby Spinach", "Apply markdowns", "Team status", "Prepare handoff"]
    : convState === "awaiting-confirm"
    ? ["Confirm the plan", "Give spinach reorder to Sam", "What's Jordan's current load?"]
    : ["Check part-timer availability", "Prepare handoff", "Team status"];

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: '#f8f9fa', borderLeft: '1px solid #e6e7ea' }}
    >
      {/* Right Pane Header */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{ padding: '20px 24px', gap: 16 }}
      >
        <div className="flex items-center min-w-0 flex-1" style={{ gap: 16 }}>
          <div className="flex items-center gap-2 min-w-0">
            <img src={spaceIcon} alt="" className="w-4 h-4 object-contain opacity-60 shrink-0" />
            <span style={{ fontFamily: ff, fontSize: 16, fontWeight: 600, lineHeight: '22px', color: '#0b0c0f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Store Manager Chat
            </span>
          </div>
        </div>
      </div>

      {/* Space created notification */}
      <div className="shrink-0" style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 8 }}>
        <div
          className="flex items-center gap-2 py-2 px-3"
          style={{ borderRadius: 6, backgroundColor: 'rgba(93,54,255,0.05)', border: '1px solid rgba(93,54,255,0.15)' }}
        >
          <img src={spaceIcon} alt="" className="w-3.5 h-3.5 object-contain opacity-70" />
          <span style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#552cff' }}>Space created · Today 10:42 AM</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0" style={{ padding: '0 16px 16px' }}>
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "bot" && <JouleAvatar />}
              <div className={`group ${msg.role === "user" ? "max-w-[85%]" : "w-full"}`}>
                {msg.role === "user" ? (
                  <div
                    className="px-3 py-2"
                    style={{ backgroundColor: '#f0f2f4', borderRadius: 10, borderTopRightRadius: 3, color: '#0b0c0f', fontFamily: ff, fontSize: 14, fontWeight: 400, lineHeight: '20px' }}
                  >
                    {msg.text}
                  </div>
                ) : (
                  <div>
                    <div style={{ fontFamily: ff, fontSize: 14, fontWeight: 400, lineHeight: '20px', color: '#0b0c0f', whiteSpace: 'pre-line' }}>
                      {msg.text.split("**").map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                      )}
                    </div>
                    {/* Widgets */}
                    {msg.widget === "reassign-plan" && (
                      <ReassignPlanWidget onConfirm={handleConfirmReassign} onEdit={handleEditPlan} />
                    )}
                    {msg.widget === "reassign-done" && (
                      <ReassignDoneWidget />
                    )}
                    <MessageActions />
                  </div>
                )}
                <p style={{ fontSize: 12, color: '#636d83', marginTop: 4, textAlign: msg.role === "user" ? 'right' : 'left', fontFamily: ff }}>{msg.time}</p>
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

      {/* Gradient backdrop + Joule Input */}
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
  floorStatus: "On Floor" | "Break" | "Back Room" | "Signed Off";
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
const MyDaySection = ({ associates, onAddTask }: { associates: Associate[]; onAddTask: (task: EmployeeTask, employeeId: string) => void }) => (
  <div>
    {/* Greeting */}
    <div style={{ padding: '32px 80px 0' }}>
      <h1 style={{
        fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
        fontSize: 32,
        fontWeight: 400,
        lineHeight: '40px',
        color: '#0b0c0f',
        margin: 0,
        marginBottom: 20,
      }}>
        Store Manager Dashboard — FreshMart Midtown
      </h1>
    </div>
    <CommandCenter associates={associates} onAddTask={onAddTask} />
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

const PRESENCE_CONFIG: Record<EmployeeColumn["floorStatus"], { dot: string; label: string; labelColor: string; labelBg: string }> = {
  "On Floor":   { dot: '#198450', label: 'On Floor',   labelColor: '#198450', labelBg: 'rgba(25,132,80,0.08)'   },
  "Break":      { dot: '#e76500', label: 'On Break',   labelColor: '#e76500', labelBg: 'rgba(231,101,0,0.08)'   },
  "Back Room":  { dot: '#0070f2', label: 'Back Room',  labelColor: '#0070f2', labelBg: 'rgba(0,112,242,0.08)'   },
  "Signed Off": { dot: '#636d83', label: 'Signed Off', labelColor: '#636d83', labelBg: 'rgba(99,109,131,0.08)'  },
};

const EmployeeTaskColumn = ({ employee }: { employee: EmployeeColumn }) => {
  const done = employee.tasks.filter(t => t.status === "Done").length;
  const total = employee.tasks.length;
  const pct = Math.round((done / Math.max(1, total)) * 100);
  const presence = PRESENCE_CONFIG[employee.floorStatus];
  const isSignedOff = employee.floorStatus === "Signed Off";

  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 0,
        borderRadius: 8,
        border: `1px solid ${isSignedOff ? '#e6e7ea' : '#e6e7ea'}`,
        backgroundColor: isSignedOff ? '#fafafa' : '#ffffff',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Column header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {/* Avatar with presence dot */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              className="flex items-center justify-center text-white"
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: isSignedOff
                  ? '#c8cdd4'
                  : 'linear-gradient(135deg, #8A48E6, #470CED)',
                fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
                fontSize: 12, fontWeight: 600,
                opacity: isSignedOff ? 0.6 : 1,
              }}
            >
              {employee.initials}
            </div>
            {/* Presence dot */}
            <span style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 10, height: 10, borderRadius: '50%',
              backgroundColor: presence.dot,
              border: '2px solid #fff',
              display: 'block',
            }} />
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 14, fontWeight: 600, color: isSignedOff ? '#636d83' : '#0b0c0f', margin: 0 }}>{employee.name}</p>
            <p style={{ fontFamily: '"72","72full",Arial,Helvetica,sans-serif', fontSize: 11, fontWeight: 400, color: '#636d83', margin: 0 }}>{employee.role}</p>
          </div>
          {/* Status pill */}
          <span style={{
            fontFamily: '"72","72full",Arial,Helvetica,sans-serif',
            fontSize: 11, fontWeight: 600,
            color: presence.labelColor,
            backgroundColor: presence.labelBg,
            padding: '2px 8px', borderRadius: 10,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {presence.label}
          </span>
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

/* ══════════════════════════════════════════════════════
   PRODUCT → SHELF LOOKUP  (autocomplete data)
══════════════════════════════════════════════════════ */
const PRODUCT_SHELF_MAP: { product: string; shelf: string; zone: string }[] = [
  { product: "Organic Strawberries",   shelf: "Shelf 3A", zone: "Zone A" },
  { product: "Hass Avocado",           shelf: "Shelf 2A", zone: "Zone B" },
  { product: "Baby Spinach",           shelf: "Shelf 4C", zone: "Zone C" },
  { product: "Organic Bananas",        shelf: "Shelf 1A", zone: "Zone A" },
  { product: "Cherry Tomatoes",        shelf: "Shelf 2C", zone: "Zone C" },
  { product: "Heirloom Tomatoes",      shelf: "Shelf 4A", zone: "Zone C" },
  { product: "Greek Yogurt",           shelf: "Shelf 2B", zone: "Zone B" },
  { product: "Blackberries",           shelf: "Shelf 3C", zone: "Zone C" },
  { product: "Blueberries",            shelf: "Shelf 3B", zone: "Zone B" },
  { product: "Romaine Lettuce",        shelf: "Shelf 1C", zone: "Zone C" },
  { product: "Whole Milk",             shelf: "Shelf 1B", zone: "Zone B" },
  { product: "Orange Juice",           shelf: "Shelf 2A", zone: "Zone A" },
  { product: "Bottled Water",          shelf: "Shelf 5A", zone: "Zone A" },
  { product: "Sparkling Water",        shelf: "Shelf 5B", zone: "Zone A" },
  { product: "Cheddar Cheese",         shelf: "Shelf 3B", zone: "Zone B" },
  { product: "Sourdough Bread",        shelf: "Shelf 1D", zone: "Zone D" },
  { product: "Eggs (dozen)",           shelf: "Shelf 4B", zone: "Zone B" },
  { product: "Butter",                 shelf: "Shelf 4B", zone: "Zone B" },
  { product: "Sunscreen SPF 50",       shelf: "Shelf 2D", zone: "Zone D" },
  { product: "Sparkling Lemonade",     shelf: "Shelf 5C", zone: "Zone C" },
];

/* ══════════════════════════════════════════════════════
   ADD TASK MODAL
══════════════════════════════════════════════════════ */
const AddTaskModal = ({
  employees,
  onClose,
  onAdd,
  prefillTitle = "",
  prefillNote = "",
}: {
  employees: EmployeeColumn[];
  onClose: () => void;
  onAdd: (task: EmployeeTask, employeeId: string) => void;
  prefillTitle?: string;
  prefillNote?: string;
}) => {
  const ff = '"72","72full",Arial,Helvetica,sans-serif';
  const [title, setTitle]           = useState(prefillTitle);
  const [product, setProduct]       = useState("");
  const [location, setLocation]     = useState("");
  const [locationAutoFilled, setLocationAutoFilled] = useState(false);
  const [shelfSuggestion, setShelfSuggestion] = useState<{ product: string; shelf: string; zone: string } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [priority, setPriority]     = useState<TaskPriority>("Medium");
  const [assigneeId, setAssigneeId] = useState(employees[0]?.id ?? "");
  const [submitted, setSubmitted]   = useState(false);

  const filteredSuggestions = product.length >= 2
    ? PRODUCT_SHELF_MAP.filter(p => p.product.toLowerCase().includes(product.toLowerCase()))
    : [];

  const handleProductChange = (val: string) => {
    setProduct(val);
    setShelfSuggestion(null);
    setShowSuggestions(true);
    // Clear auto-filled location if user edits the product
    if (locationAutoFilled) {
      setLocation("");
      setLocationAutoFilled(false);
    }
  };

  const selectSuggestion = (entry: typeof PRODUCT_SHELF_MAP[0]) => {
    setProduct(entry.product);
    setShelfSuggestion(entry);
    setShowSuggestions(false);
    // Pre-fill location
    setLocation(`${entry.zone} · ${entry.shelf}`);
    setLocationAutoFilled(true);
    // auto-fill title if empty
    if (!title) setTitle(`Restock ${entry.product}`);
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    const zone = location.trim() || (shelfSuggestion
      ? `${shelfSuggestion.zone} · ${shelfSuggestion.shelf}`
      : product.trim() || "General");
    const newTask: EmployeeTask = {
      id: `t-${Date.now()}`,
      title: title.trim(),
      zone,
      priority,
      status: "To Do",
      time: priority === "High" ? "Urgent" : undefined,
    };
    onAdd(newTask, assigneeId);
    setSubmitted(true);
    setTimeout(onClose, 900);
  };

  const urgencyOptions: { value: TaskPriority; label: string; color: string; bg: string }[] = [
    { value: "High",   label: "High",   color: "#d9291c", bg: "#fff0f0" },
    { value: "Medium", label: "Medium", color: "#e76500", bg: "#fff8f0" },
    { value: "Low",    label: "Low",    color: "#198450", bg: "#f0fff5" },
  ];

  return (
    /* Backdrop */
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11,12,15,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div style={{ width: 480, backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 24px 48px rgba(0,0,0,0.18)', overflow: 'visible', position: 'relative' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #e6e7ea' }}>
          <p style={{ fontFamily: ff, fontSize: 16, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>Add Task</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#636d83', display: 'flex', alignItems: 'center' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Task title */}
          <div>
            <label style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#636d83', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Task</label>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Restock Organic Strawberries"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '9px 12px', borderRadius: 8, border: '1.5px solid #b0b8c8',
                fontFamily: ff, fontSize: 14, color: '#0b0c0f',
                outline: 'none', backgroundColor: '#fdfeff',
              }}
              onFocus={e => { e.target.style.borderColor = '#0070f2'; }}
              onBlur={e => { e.target.style.borderColor = '#b0b8c8'; }}
            />
          </div>

          {/* Product + shelf suggestion */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#636d83', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Product <span style={{ fontWeight: 400, color: '#9fa8b4' }}>(optional)</span></label>
            <input
              value={product}
              onChange={e => handleProductChange(e.target.value)}
              onFocus={e => { setShowSuggestions(true); e.currentTarget.style.borderColor = '#0070f2'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#b0b8c8'; setTimeout(() => setShowSuggestions(false), 150); }}
              placeholder="Start typing a product name…"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '9px 12px', borderRadius: 8, border: '1.5px solid #b0b8c8',
                fontFamily: ff, fontSize: 14, color: '#0b0c0f',
                outline: 'none', backgroundColor: '#fdfeff',
              }}
            />

            {/* Autocomplete dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, backgroundColor: '#fff', border: '1px solid #e6e7ea', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: 4, overflow: 'hidden' }}>
                {filteredSuggestions.slice(0, 6).map((entry, i) => (
                  <button
                    key={i}
                    onMouseDown={() => selectSuggestion(entry)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: i < Math.min(filteredSuggestions.length, 6) - 1 ? '1px solid #f0f2f4' : 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f5f7ff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
                  >
                    <span style={{ fontFamily: ff, fontSize: 14, color: '#0b0c0f' }}>{entry.product}</span>
                    <span style={{ fontFamily: ff, fontSize: 12, color: '#0070f2', fontWeight: 600, backgroundColor: '#e8f0fd', padding: '2px 8px', borderRadius: 4 }}>
                      {entry.zone} · {entry.shelf}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Location — empty by default, pre-filled when product is selected */}
          <div>
            <label style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#636d83', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Location
              {locationAutoFilled && (
                <span style={{ fontWeight: 400, color: '#0070f2', marginLeft: 8, textTransform: 'none', letterSpacing: 0 }}>
                  <MapPin size={10} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                  auto-filled
                </span>
              )}
            </label>
            <input
              value={location}
              onChange={e => { setLocation(e.target.value); setLocationAutoFilled(false); }}
              onFocus={e => e.currentTarget.style.borderColor = '#0070f2'}
              onBlur={e => e.currentTarget.style.borderColor = locationAutoFilled ? '#0070f2' : '#b0b8c8'}
              placeholder="e.g. Zone A · Shelf 3A"
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '9px 12px', borderRadius: 8,
                border: `1.5px solid ${locationAutoFilled ? '#0070f2' : '#b0b8c8'}`,
                fontFamily: ff, fontSize: 14, color: '#0b0c0f',
                outline: 'none',
                backgroundColor: locationAutoFilled ? '#f0f6ff' : '#fdfeff',
                transition: 'border-color 0.15s, background-color 0.15s',
              }}
            />
          </div>

          {/* AI suggested action note — shown when pre-filled from AI Priorities */}
          {prefillNote && (
            <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 8, backgroundColor: '#f6f3ff', border: '1px solid rgba(93,54,255,0.15)' }}>
              <Zap size={13} style={{ color: '#552cff', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontFamily: ff, fontSize: 12, color: '#353c4a', margin: 0, lineHeight: '18px' }}>
                <strong style={{ color: '#552cff' }}>AI suggests: </strong>{prefillNote}
              </p>
            </div>
          )}

          {/* Urgency */}
          <div>
            <label style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#636d83', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Urgency</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {urgencyOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setPriority(opt.value)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
                    border: priority === opt.value ? `2px solid ${opt.color}` : '1.5px solid #e6e7ea',
                    backgroundColor: priority === opt.value ? opt.bg : '#fff',
                    fontFamily: ff, fontSize: 13, fontWeight: 600,
                    color: priority === opt.value ? opt.color : '#636d83',
                    transition: 'all 0.12s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assign to */}
          <div>
            <label style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#636d83', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Assign to</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {employees.map(emp => {
                const isSelected = assigneeId === emp.id;
                return (
                  <button
                    key={emp.id}
                    onClick={() => setAssigneeId(emp.id)}
                    style={{
                      flex: 1, padding: '8px 6px', borderRadius: 8, cursor: 'pointer',
                      border: isSelected ? '2px solid #0070f2' : '1.5px solid #e6e7ea',
                      backgroundColor: isSelected ? '#e8f0fd' : '#fff',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      transition: 'all 0.12s',
                    }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#8A48E6,#470CED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: ff, fontSize: 11, fontWeight: 600, color: '#fff' }}>{emp.initials}</span>
                    </div>
                    <span style={{ fontFamily: ff, fontSize: 11, fontWeight: isSelected ? 600 : 400, color: isSelected ? '#0057d2' : '#0b0c0f' }}>{emp.name.split(' ')[0]}</span>
                    <span style={{ fontFamily: ff, fontSize: 10, color: '#636d83' }}>{emp.role}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '14px 24px 20px', borderTop: '1px solid #e6e7ea' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e6e7ea', backgroundColor: '#fff', fontFamily: ff, fontSize: 14, fontWeight: 600, color: '#636d83', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!title.trim() || submitted}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none',
              backgroundColor: submitted ? '#198450' : (!title.trim() ? '#b0b8c8' : '#0070f2'),
              fontFamily: ff, fontSize: 14, fontWeight: 600, color: '#fff',
              cursor: title.trim() && !submitted ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s',
            }}
          >
            {submitted ? <><CheckCircle2 size={14} /> Added!</> : '+ Add Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   TASK BOARD SECTION
══════════════════════════════════════════════════════ */
const TaskBoardSection = ({ taskBoard, onAddTask }: { taskBoard: EmployeeColumn[]; onAddTask: (task: EmployeeTask, employeeId: string) => void }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [groupBy, setGroupBy] = useState<'employee' | 'status'>('employee');
  const ff = '"72","72full",Arial,Helvetica,sans-serif';

  const totalOpen = taskBoard.flatMap(e => e.tasks).filter(t => t.status !== "Done").length;
  const totalDone = taskBoard.flatMap(e => e.tasks).filter(t => t.status === "Done").length;

  const PRIORITY_COLORS: Record<TaskPriority, { color: string; bg: string }> = {
    High:   { color: '#d9291c', bg: 'rgba(217,41,28,0.08)' },
    Medium: { color: '#e76500', bg: 'rgba(231,101,0,0.08)' },
    Low:    { color: '#198450', bg: 'rgba(25,132,80,0.08)' },
  };

  const STATUS_COLS: { status: EmployeeTaskStatus; label: string; color: string; border: string }[] = [
    { status: 'To Do',       label: 'To Do',       color: '#636d83', border: '#e6e7ea' },
    { status: 'In Progress', label: 'In Progress',  color: '#0070f2', border: '#b3d4ff' },
    { status: 'Done',        label: 'Done',         color: '#198450', border: '#b7e4c7' },
  ];

  const TaskCard = ({ task, ownerName }: { task: EmployeeTask; ownerName?: string }) => {
    const pc = PRIORITY_COLORS[task.priority];
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #e6e7ea', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
        <p style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: '#0b0c0f', margin: '0 0 5px', lineHeight: '16px' }}>{task.title}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: ff, fontSize: 10, color: '#9fa8b4' }}>{task.zone}</span>
          {task.time && <span style={{ fontFamily: ff, fontSize: 10, color: '#9fa8b4' }}>· {task.time}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 }}>
          <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: ff, backgroundColor: pc.bg, color: pc.color }}>{task.priority}</span>
          {ownerName && (
            <span style={{ fontFamily: ff, fontSize: 10, color: '#636d83', backgroundColor: '#f0f2f4', borderRadius: 4, padding: '2px 6px' }}>{ownerName}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '40px 80px 0' }}>
      {/* Section header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontFamily: ff, fontSize: 20, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>Task Board</h2>
          <p style={{ fontFamily: ff, fontSize: 13, fontWeight: 400, color: '#636d83', margin: '4px 0 0' }}>
            {totalOpen} open · {totalDone} completed · {taskBoard.length} associates
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Toggle */}
          <div style={{ display: 'flex', border: '1px solid #e6e7ea', borderRadius: 8, overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
            {(['employee', 'status'] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setGroupBy(opt)}
                style={{
                  fontFamily: ff, fontSize: 12, fontWeight: 600,
                  padding: '6px 14px', border: 'none', cursor: 'pointer',
                  backgroundColor: groupBy === opt ? '#0070f2' : 'transparent',
                  color: groupBy === opt ? '#fff' : '#636d83',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {opt === 'employee' ? 'By Employee' : 'By Status'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            style={{
              padding: '8px 16px', borderRadius: 8,
              border: 'none', backgroundColor: '#0070f2',
              fontFamily: ff, fontSize: 13, fontWeight: 600, color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Plus size={14} /> Add Task
          </button>
        </div>
      </div>

      {/* Board */}
      {groupBy === 'employee' ? (
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {taskBoard.map(emp => <EmployeeTaskColumn key={emp.id} employee={emp} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {STATUS_COLS.map(col => {
            const allTasks = taskBoard.flatMap(emp => emp.tasks.filter(t => t.status === col.status).map(t => ({ task: t, ownerName: emp.name })));
            return (
              <div key={col.status} style={{ flex: '1 1 0', minWidth: 0, borderRadius: 10, border: `1.5px solid ${col.border}`, backgroundColor: '#fff', overflow: 'hidden' }}>
                {/* Column header */}
                <div style={{ padding: '10px 14px', borderBottom: `1px solid ${col.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: col.status === 'In Progress' ? 'rgba(0,112,242,0.04)' : col.status === 'Done' ? 'rgba(25,132,80,0.04)' : '#f8f9fa' }}>
                  <span style={{ fontFamily: ff, fontSize: 12, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col.label}</span>
                  <span style={{ fontFamily: ff, fontSize: 11, fontWeight: 600, color: col.color, backgroundColor: col.status === 'In Progress' ? 'rgba(0,112,242,0.1)' : col.status === 'Done' ? 'rgba(25,132,80,0.1)' : '#e6e7ea', borderRadius: 10, padding: '1px 7px' }}>{allTasks.length}</span>
                </div>
                {/* Cards */}
                <div style={{ padding: '10px 10px 4px' }}>
                  {allTasks.length === 0 ? (
                    <p style={{ fontFamily: ff, fontSize: 12, color: '#c4c9d4', textAlign: 'center', padding: '16px 0', margin: 0 }}>No tasks</p>
                  ) : (
                    allTasks.map(({ task, ownerName }) => <TaskCard key={task.id} task={task} ownerName={ownerName} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTaskModal
          employees={taskBoard}
          onClose={() => setShowAddTask(false)}
          onAdd={onAddTask}
        />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   STORE FLOORPLAN — inline, no modal
══════════════════════════════════════════════════════ */
type AisleStatus = 'critical' | 'warning' | 'ok';
interface ShelfCell { id: string; label: string; category: string; status: AisleStatus; issue?: string; detail?: string; }

const FP_STATUS: Record<AisleStatus, { bg: string; border: string; dot: string; label: string }> = {
  critical: { bg: '#fce8e8', border: '#d9291c', dot: '#d9291c', label: 'Critical — Empty / Out of Stock' },
  warning:  { bg: '#fff3e0', border: '#e76500', dot: '#e76500', label: 'Warning — Running Low' },
  ok:       { bg: '#dde8f5', border: '#5b8db8', dot: '#198450', label: 'OK — Fully Stocked' },
};

/* Category colour bands for legend */
const CATEGORY_COLORS: Record<string, string> = {
  'Wall Shelves':    '#7aafd4',
  'Zone A':         '#4a90d9',
  'Zone B':         '#357abd',
  'Zone C':         '#2a6099',
  'Zone D':         '#1a4f80',
  'Power Wall':     '#5b5ea6',
  'End Caps':       '#7c6dbf',
  'Checkout':       '#2a6099',
};

const WALL_SHELVES: ShelfCell[] = [
  { id: 'W1', label: 'Citrus / Bananas',  category: 'Wall Shelves', status: 'ok'                                                         },
  { id: 'W2', label: 'Apples & Pears',    category: 'Wall Shelves', status: 'ok'                                                         },
  { id: 'W3', label: 'Stone Fruit',       category: 'Wall Shelves', status: 'warning',  issue: 'Running low', detail: 'Peaches & plums ~4 units left. Restock from back room.'  },
  { id: 'W4', label: 'Fresh Herbs',       category: 'Wall Shelves', status: 'critical', issue: 'Delivery not stocked', detail: 'Morning delivery included 3 herb SKUs not yet placed on shelf.' },
];

const GONDOLA_COLS: { zone: string; top: ShelfCell; bottom: ShelfCell }[] = [
  {
    zone: 'Zone A',
    top:    { id: 'A1', label: 'Tropical Fruit',     category: 'Zone A', status: 'ok'                                                                 },
    bottom: { id: 'A2', label: 'Strawberries',        category: 'Zone A', status: 'critical', issue: 'Shelf likely empty', detail: 'Last scan 3h ago. Back stock: 6 units. Needs immediate restock to Shelf 3A.' },
  },
  {
    zone: 'Zone B',
    top:    { id: 'B1', label: 'Avocados & Limes',   category: 'Zone B', status: 'critical', issue: '~2 units left',       detail: 'Sales velocity +40% today. Back stock 18 units. Expires in 2 days — restock now.' },
    bottom: { id: 'B2', label: 'Blueberries',         category: 'Zone B', status: 'warning',  issue: 'Running low',         detail: '~8 units left. Back stock: 12 units. Restock before lunch rush.' },
  },
  {
    zone: 'Zone C',
    top:    { id: 'C1', label: 'Tomatoes / Peppers', category: 'Zone C', status: 'warning',  issue: 'Expiry risk',         detail: 'Heirloom Tomatoes: 4 units expire in 2 days. Apply 15% markdown.' },
    bottom: { id: 'C2', label: 'Baby Spinach',        category: 'Zone C', status: 'critical', issue: 'Zero back stock',     detail: 'Stock-out predicted 12:15 PM. Emergency reorder needed — no recovery possible today.' },
  },
];

const ZONE_D: ShelfCell[] = [
  { id: 'D1', label: 'Seasonal / Promo', category: 'Zone D', status: 'ok' },
  { id: 'D2', label: 'Cut Fruit / Salads', category: 'Zone D', status: 'warning', issue: 'Near expiry', detail: 'Pre-cut fruit packs expire tomorrow. Move to front and apply markdown.' },
];

const POWER_WALL: ShelfCell[] = [
  { id: 'P1', label: 'Bottled Water',  category: 'Power Wall', status: 'critical', issue: 'Stock-out by 3 PM', detail: 'Velocity up 40% — heat forecast. Back stock cleared. Emergency reorder required now.' },
  { id: 'P2', label: 'Energy Drinks', category: 'Power Wall', status: 'ok'       },
  { id: 'P3', label: 'Juices',        category: 'Power Wall', status: 'ok'       },
  { id: 'P4', label: 'Kombucha',      category: 'Power Wall', status: 'warning',  issue: 'Low stock', detail: '~6 units remaining. Popular SKU — restock from back room before afternoon rush.' },
];

const END_CAPS: ShelfCell[] = [
  { id: 'E1', label: 'Seasonal Promo',     category: 'End Caps', status: 'ok'       },
  { id: 'E2', label: 'Cut Fruit / Salads', category: 'End Caps', status: 'warning', issue: 'Near expiry', detail: 'Same batch as D2. Apply markdown stickers and face forward.' },
];

const AISuggestionsSection = ({ onAddTask }: { onAddTask: (task: EmployeeTask, employeeId: string) => void }) => {
  const ff = '"72","72full",Arial,Helvetica,sans-serif';
  return (
    <div style={{ padding: '40px 80px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>✦</span>
        <h2 style={{ fontFamily: ff, fontSize: 20, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>AI Suggestions</h2>
      </div>
      <div style={{ borderRadius: 12, border: '1.5px solid #c5a9f5', backgroundColor: '#faf8ff', overflow: 'hidden' }}>
        {AI_PRIORITIES.map((item, idx) => (
          <div key={idx} style={{ borderTop: idx === 0 ? 'none' : '1px solid #ede8fc' }}>
            <PriorityItem item={item} onAddTask={onAddTask} />
          </div>
        ))}
      </div>
    </div>
  );
};

const FloorplanSection = () => {
  const ff = '"72","72full",Arial,Helvetica,sans-serif';
  const [activeCell, setActiveCell] = useState<ShelfCell | null>(null);

  const allCells: ShelfCell[] = [...WALL_SHELVES, ...GONDOLA_COLS.flatMap(c => [c.top, c.bottom]), ...ZONE_D, ...POWER_WALL, ...END_CAPS];
  const criticalCount = allCells.filter(c => c.status === 'critical').length;
  const warningCount  = allCells.filter(c => c.status === 'warning').length;

  /* Single shelf block — shows ID + status indicator dot only */
  const Cell = ({ cell, style }: { cell: ShelfCell; style?: React.CSSProperties }) => {
    const s = FP_STATUS[cell.status];
    const isActive = activeCell?.id === cell.id;
    return (
      <div
        onClick={() => setActiveCell(isActive ? null : cell)}
        title={cell.label}
        style={{
          backgroundColor: s.bg,
          border: `2px solid ${isActive ? '#552cff' : s.border}`,
          borderRadius: 6,
          padding: '7px 6px 6px',
          cursor: cell.status !== 'ok' || cell.issue ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          position: 'relative',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          boxShadow: isActive ? '0 0 0 2px rgba(85,44,255,0.2)' : undefined,
          ...style,
        }}
      >
        {/* Status dot indicator — top right */}
        {cell.status !== 'ok' && (
          <span style={{
            position: 'absolute', top: 3, right: 3,
            width: 7, height: 7, borderRadius: '50%',
            backgroundColor: s.dot,
            boxShadow: `0 0 0 2px ${s.bg}`,
          }} />
        )}
        {/* Aisle ID only */}
        <span style={{ fontFamily: ff, fontSize: 11, fontWeight: 800, color: s.dot === '#198450' ? '#1a5276' : s.dot, lineHeight: 1 }}>{cell.id}</span>
      </div>
    );
  };

  return (
    <div style={{ padding: '40px 80px 48px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: ff, fontSize: 20, fontWeight: 600, color: '#0b0c0f', margin: '0 0 4px' }}>Store Floorplan</h2>
          <p style={{ fontFamily: ff, fontSize: 13, color: '#636d83', margin: 0 }}>Produce Department · Live stock status</p>
        </div>
        {/* Alert summary chips */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {criticalCount > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, backgroundColor: 'rgba(217,41,28,0.08)', border: '1px solid rgba(217,41,28,0.2)', fontFamily: ff, fontSize: 12, fontWeight: 700, color: '#d9291c' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#d9291c', display: 'inline-block' }} />
              {criticalCount} Critical
            </span>
          )}
          {warningCount > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, backgroundColor: 'rgba(231,101,0,0.08)', border: '1px solid rgba(231,101,0,0.2)', fontFamily: ff, fontSize: 12, fontWeight: 700, color: '#e76500' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#e76500', display: 'inline-block' }} />
              {warningCount} Warning
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* ── LEFT: Map + Legend ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── FLOOR MAP ── */}
          <div style={{ border: '2px solid #4a7fa5', borderRadius: 12, backgroundColor: '#f4f8fb', padding: '14px 14px 0', position: 'relative' }}>

            {/* Wall Shelves — top */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 10 }}>
              {WALL_SHELVES.map(c => <Cell key={c.id} cell={c} style={{ minHeight: 48 }} />)}
            </div>
            {/* Wall Shelves label */}
            <div style={{ fontFamily: ff, fontSize: 9, fontWeight: 600, color: '#4a7fa5', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', marginBottom: 8, opacity: 0.7 }}>Wall Shelves</div>

            {/* Main floor area */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>

              {/* Impulse Purchase strip */}
              <div style={{ width: 32, flexShrink: 0, backgroundColor: '#c5d8ec', border: '1.5px solid #4a7fa5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: ff, fontSize: 8, fontWeight: 700, color: '#1a5276', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Impulse</span>
              </div>

              {/* Zone gondola columns */}
              <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                {GONDOLA_COLS.map(col => (
                  <div key={col.zone} style={{ flex: 1, border: '1.5px dashed #7aafd4', borderRadius: 8, padding: '6px 6px 4px', display: 'flex', flexDirection: 'column', gap: 6, backgroundColor: 'rgba(255,255,255,0.6)' }}>
                    <div style={{ fontFamily: ff, fontSize: 8, fontWeight: 700, color: '#4a7fa5', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'center' }}>{col.zone}</div>
                    <Cell cell={col.top} style={{ flex: 1, minHeight: 52 }} />
                    <Cell cell={col.bottom} style={{ flex: 1, minHeight: 52 }} />
                  </div>
                ))}

                {/* Zone D */}
                <div style={{ flex: 1, border: '1.5px dashed #7aafd4', borderRadius: 8, padding: '6px 6px 4px', display: 'flex', flexDirection: 'column', gap: 6, backgroundColor: 'rgba(255,255,255,0.6)' }}>
                  <div style={{ fontFamily: ff, fontSize: 8, fontWeight: 700, color: '#4a7fa5', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'center' }}>Zone D</div>
                  {ZONE_D.map(c => <Cell key={c.id} cell={c} style={{ flex: 1, minHeight: 52 }} />)}
                </div>
              </div>

              {/* Power Wall */}
              <div style={{ width: 52, flexShrink: 0, border: '1.5px dashed #9b8dc8', borderRadius: 8, padding: '6px 4px 4px', display: 'flex', flexDirection: 'column', gap: 6, backgroundColor: 'rgba(245,242,255,0.7)' }}>
                <div style={{ fontFamily: ff, fontSize: 7, fontWeight: 700, color: '#5b5ea6', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.3px' }}>Power Wall</div>
                {POWER_WALL.map(c => <Cell key={c.id} cell={c} style={{ minHeight: 38 }} />)}
              </div>
            </div>

            {/* Bottom row: Checkout + flow + end caps + entrance */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0 0' }}>
              <div style={{ width: 32, flexShrink: 0 }}>
                <div style={{ backgroundColor: '#2a6099', borderRadius: 6, padding: '8px 2px', textAlign: 'center' }}>
                  <span style={{ fontFamily: ff, fontSize: 7, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.3px', writingMode: 'horizontal-tb' }}>Checkout</span>
                </div>
              </div>
              <div style={{ flex: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                <div style={{ flex: 1, height: 2, backgroundColor: '#4a7fa5' }} />
                <div style={{ width: 0, height: 0, borderLeft: '7px solid #4a7fa5', borderTop: '4px solid transparent', borderBottom: '4px solid transparent' }} />
                <span style={{ fontFamily: ff, fontSize: 7, color: '#4a7fa5', fontWeight: 600, whiteSpace: 'nowrap' }}>Customer Flow</span>
              </div>
              <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                {END_CAPS.map(c => <Cell key={c.id} cell={c} style={{ flex: 1, minHeight: 36 }} />)}
              </div>
              <div style={{ width: 52, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ borderTop: '2px dashed #4a7fa5', width: '100%' }} />
                <span style={{ fontFamily: ff, fontSize: 7, color: '#4a7fa5', fontWeight: 600 }}>Entrance & Exit</span>
              </div>
            </div>

            {/* Window Display strip */}
            <div style={{ margin: '10px -14px 0', borderTop: '2px solid #4a7fa5', padding: '6px 14px', backgroundColor: '#d6eaf8', borderRadius: '0 0 10px 10px', textAlign: 'center' }}>
              <span style={{ fontFamily: ff, fontSize: 9, fontWeight: 600, color: '#1a5276', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Window Display</span>
            </div>
          </div>

          {/* ── LEGEND ── */}
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {/* Status legend */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, color: '#636d83', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Stock Status</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {(['critical', 'warning', 'ok'] as AisleStatus[]).map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 18, borderRadius: 4, backgroundColor: FP_STATUS[s].bg, border: `1.5px solid ${FP_STATUS[s].border}`, flexShrink: 0 }} />
                    <span style={{ fontFamily: ff, fontSize: 11, color: '#556170' }}>{FP_STATUS[s].label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Category legend */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, color: '#636d83', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Categories</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  { label: 'Wall Shelves — permanent back wall display' },
                  { label: 'Zone A–D — gondola aisle shelves (double-sided)' },
                  { label: 'Power Wall — high-velocity beverage section' },
                  { label: 'End Caps — promotional / seasonal displays' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: ['#7aafd4','#4a90d9','#5b5ea6','#7c6dbf'][i], marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontFamily: ff, fontSize: 11, color: '#556170', lineHeight: '1.4' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Alert detail panel (shown on click) ── */}
        {activeCell && (
          <div style={{ width: 260, flexShrink: 0, borderRadius: 10, border: `2px solid ${FP_STATUS[activeCell.status].border}`, backgroundColor: '#fff', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
            {/* Panel header */}
            <div style={{ padding: '12px 14px', backgroundColor: FP_STATUS[activeCell.status].bg, borderBottom: `1px solid ${FP_STATUS[activeCell.status].border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontFamily: ff, fontSize: 16, fontWeight: 800, color: FP_STATUS[activeCell.status].dot }}>{activeCell.id}</span>
                  <span style={{ fontFamily: ff, fontSize: 11, fontWeight: 600, color: FP_STATUS[activeCell.status].dot, backgroundColor: `${FP_STATUS[activeCell.status].dot}18`, padding: '1px 7px', borderRadius: 10 }}>
                    {activeCell.status === 'critical' ? 'Critical' : activeCell.status === 'warning' ? 'Warning' : 'OK'}
                  </span>
                </div>
                <p style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>{activeCell.label}</p>
                <p style={{ fontFamily: ff, fontSize: 11, color: '#636d83', margin: '2px 0 0' }}>{activeCell.category}</p>
              </div>
              <button onClick={() => setActiveCell(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9fa8b4', padding: 2, flexShrink: 0, display: 'flex' }}>
                <X size={16} />
              </button>
            </div>
            {/* Panel body */}
            <div style={{ padding: '12px 14px' }}>
              {activeCell.issue && (
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontFamily: ff, fontSize: 10, fontWeight: 700, color: '#9fa8b4', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 3px' }}>Issue</p>
                  <p style={{ fontFamily: ff, fontSize: 12, fontWeight: 600, color: FP_STATUS[activeCell.status].dot, margin: 0 }}>{activeCell.issue}</p>
                </div>
              )}
              {activeCell.detail && (
                <div>
                  <p style={{ fontFamily: ff, fontSize: 10, fontWeight: 700, color: '#9fa8b4', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 3px' }}>Details</p>
                  <p style={{ fontFamily: ff, fontSize: 12, color: '#0b0c0f', margin: 0, lineHeight: '1.5' }}>{activeCell.detail}</p>
                </div>
              )}
              {activeCell.status === 'ok' && !activeCell.issue && (
                <p style={{ fontFamily: ff, fontSize: 12, color: '#198450', margin: 0 }}>✓ Fully stocked — no action needed</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
/* ══════════════════════════════════════════════════════
   ALERTS TAB
══════════════════════════════════════════════════════ */
const SEVERITY_CFG: Record<AlertSeverity, { color: string; bg: string }> = {
  Critical: { color: '#d9291c', bg: 'rgba(217,41,28,0.08)' },
  Warning:  { color: '#e76500', bg: 'rgba(231,101,0,0.08)' },
  Info:     { color: '#0070f2', bg: 'rgba(0,112,242,0.08)' },
  Resolved: { color: '#198450', bg: 'rgba(25,132,80,0.08)' },
};

const AlertsTab = ({ alerts, onAddTask, taskBoard }: { alerts: StoreAlert[]; onAddTask: (task: EmployeeTask, employeeId: string) => void; taskBoard: EmployeeColumn[] }) => {
  const ff = '"72","72full",Arial,Helvetica,sans-serif';
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalAlert, setModalAlert] = useState<StoreAlert | null>(null);
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());

  const open     = alerts.filter(a => a.status !== 'Done');
  const resolved = alerts.filter(a => a.status === 'Done');

  const AlertRow = ({ a }: { a: StoreAlert }) => {
    const cfg = SEVERITY_CFG[a.severity];
    const isExpanded = expandedId === a.id;
    const isAccepted = acceptedIds.has(a.id);

    return (
      <div style={{ borderBottom: '1px solid #f0f2f4' }}>
        {/* Row header — clickable */}
        <div
          onClick={() => setExpandedId(isExpanded ? null : a.id)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', cursor: 'pointer', backgroundColor: isExpanded ? '#fafbfc' : '#fff', transition: 'background 0.1s' }}
        >
          <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: ff, flexShrink: 0, backgroundColor: cfg.bg, color: cfg.color }}>{a.severity}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <p style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>{a.product}</p>
              <span style={{ fontFamily: ff, fontSize: 11, color: '#9fa8b4' }}>{a.zone} · {a.time}</span>
            </div>
            <p style={{ fontFamily: ff, fontSize: 12, color: '#556170', margin: '2px 0 0' }}>{a.issue}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {isAccepted && (
              <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: ff, backgroundColor: 'rgba(25,132,80,0.08)', color: '#198450' }}>Task Added</span>
            )}
            {a.assignee && <span style={{ fontFamily: ff, fontSize: 11, color: '#9fa8b4' }}>{a.assignee}</span>}
            <span style={{
              padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: ff,
              backgroundColor: a.status === 'In Progress' ? 'rgba(0,112,242,0.08)' : 'rgba(231,101,0,0.08)',
              color: a.status === 'In Progress' ? '#0070f2' : '#e76500',
            }}>{a.status}</span>
            <ChevronRight size={14} style={{ color: '#9fa8b4', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
          </div>
        </div>

        {/* Expanded detail + recommendation */}
        {isExpanded && (
          <div style={{ padding: '0 20px 16px 20px', backgroundColor: '#fafbfc', borderTop: '1px solid #f0f2f4' }}>
            {/* Detail */}
            <div style={{ marginBottom: 12, paddingTop: 12 }}>
              <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, color: '#636d83', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>What's happening</p>
              <p style={{ fontFamily: ff, fontSize: 13, color: '#0b0c0f', margin: 0, lineHeight: '1.5' }}>{a.detail}</p>
            </div>
            {/* Joule recommendation */}
            <div style={{ backgroundColor: '#f3efff', border: '1px solid #c5a9f5', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>✦</span>
                <span style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, color: '#552cff', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Joule's Recommendation</span>
              </div>
              <p style={{ fontFamily: ff, fontSize: 13, color: '#2d1f5e', margin: 0, lineHeight: '1.5' }}>{a.recommendation}</p>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              {!isAccepted ? (
                <button
                  onClick={() => setModalAlert(a)}
                  style={{
                    padding: '8px 18px', borderRadius: 8, border: 'none',
                    backgroundColor: '#0070f2', color: '#fff',
                    fontFamily: ff, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <CheckSquare size={14} /> Accept Suggestion
                </button>
              ) : (
                <span style={{ fontFamily: ff, fontSize: 12, color: '#198450', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <CheckCircle2 size={14} /> Task added to board
                </span>
              )}
              <button
                onClick={() => setExpandedId(null)}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e6e7ea', background: '#fff', fontFamily: ff, fontSize: 13, color: '#556170', cursor: 'pointer' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '32px 80px' }}>
      <h2 style={{ fontFamily: ff, fontSize: 20, fontWeight: 600, color: '#0b0c0f', margin: '0 0 20px' }}>Alerts & Notifications</h2>

      {/* Open alerts */}
      <div style={{ borderRadius: 10, border: '1px solid #e6e7ea', backgroundColor: '#fff', marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0f2f4', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#d9291c', display: 'inline-block' }} />
          <p style={{ fontFamily: ff, fontSize: 13, fontWeight: 700, color: '#0b0c0f', margin: 0, flex: 1 }}>Open Alerts</p>
          <span style={{ fontFamily: ff, fontSize: 11, color: '#636d83' }}>{open.length} items — click to expand</span>
        </div>
        {open.map(a => <AlertRow key={a.id} a={a} />)}
        {open.length === 0 && (
          <p style={{ fontFamily: ff, fontSize: 13, color: '#9fa8b4', padding: '20px', margin: 0, textAlign: 'center' }}>No open alerts</p>
        )}
      </div>

      {/* Resolved */}
      {resolved.length > 0 && (
        <div style={{ borderRadius: 10, border: '1px solid #e6e7ea', backgroundColor: '#fff', overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0f2f4', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#198450', display: 'inline-block' }} />
            <p style={{ fontFamily: ff, fontSize: 13, fontWeight: 700, color: '#0b0c0f', margin: 0 }}>Resolved</p>
          </div>
          {resolved.map(a => <AlertRow key={a.id} a={a} />)}
        </div>
      )}

      {/* Prefilled task modal */}
      {modalAlert && (
        <AddTaskModal
          employees={taskBoard}
          prefillTitle={modalAlert.suggestedTask}
          prefillNote={modalAlert.recommendation}
          onClose={() => setModalAlert(null)}
          onAdd={(task, empId) => {
            onAddTask(task, empId);
            setAcceptedIds(prev => new Set(prev).add(modalAlert.id));
            setModalAlert(null);
            toast.success('Task added to board');
          }}
        />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   TEAM TAB
══════════════════════════════════════════════════════ */
const TeamTab = ({ taskBoard }: { taskBoard: EmployeeColumn[] }) => {
  const ff = '"72","72full",Arial,Helvetica,sans-serif';
  return (
    <div style={{ padding: '32px 80px' }}>
      <h2 style={{ fontFamily: ff, fontSize: 20, fontWeight: 600, color: '#0b0c0f', margin: '0 0 20px' }}>Team</h2>
      <div style={{ borderRadius: 10, border: '1px solid #e6e7ea', backgroundColor: '#fff', overflow: 'hidden' }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '10px 20px', borderBottom: '1px solid #f0f2f4', backgroundColor: '#f8f9fa' }}>
          {['Associate', 'Zone', 'Status', 'Tasks Open', 'Tasks Done'].map(h => (
            <span key={h} style={{ fontFamily: ff, fontSize: 11, fontWeight: 600, color: '#636d83', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
          ))}
        </div>
        {taskBoard.map((emp, i) => {
          const presence = PRESENCE_CONFIG[emp.floorStatus];
          const open = emp.tasks.filter(t => t.status !== 'Done').length;
          const done = emp.tasks.filter(t => t.status === 'Done').length;
          return (
            <div key={emp.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: i < taskBoard.length - 1 ? '1px solid #f0f2f4' : 'none', alignItems: 'center' }}>
              {/* Name + avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#8A48E6,#470CED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, color: '#fff' }}>{emp.initials}</span>
                  </div>
                  <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', backgroundColor: presence.dot, border: '1.5px solid #fff' }} />
                </div>
                <div>
                  <p style={{ fontFamily: ff, fontSize: 13, fontWeight: 600, color: '#0b0c0f', margin: 0 }}>{emp.name}</p>
                  <p style={{ fontFamily: ff, fontSize: 11, color: '#9fa8b4', margin: 0 }}>{emp.role}</p>
                </div>
              </div>
              {/* Zone */}
              <span style={{ fontFamily: ff, fontSize: 13, color: '#556170' }}>{emp.tasks[0]?.zone ?? '—'}</span>
              {/* Status pill */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20, backgroundColor: presence.labelBg, color: presence.labelColor, fontFamily: ff, fontSize: 11, fontWeight: 600, width: 'fit-content' }}>
                {presence.label}
              </span>
              {/* Tasks open */}
              <span style={{ fontFamily: ff, fontSize: 14, fontWeight: 600, color: open > 0 ? '#e76500' : '#636d83' }}>{open}</span>
              {/* Tasks done */}
              <span style={{ fontFamily: ff, fontSize: 14, fontWeight: 600, color: done > 0 ? '#198450' : '#636d83' }}>{done}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
const StoreManagerSpacePage = () => {
  const [alerts, setAlerts] = useState<StoreAlert[]>(initialAlerts);
  const [taskBoard, setTaskBoard] = useState<EmployeeColumn[]>(initialTaskBoard);

  // Chat pane open/closed
  const [chatOpen, setChatOpen] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState('Overview');

  // Alex sign-off flow
  const [showNotification, setShowNotification] = useState(false);
  const [triggerChat, setTriggerChat]           = useState(false);
  const [reassigned, setReassigned]             = useState(false);

  // Notification appears after 15s
  useEffect(() => {
    const t = setTimeout(() => setShowNotification(true), 15000);
    return () => clearTimeout(t);
  }, []);

  // "View suggestions" CTA in notification → open chat + trigger Joule
  const handleViewSuggestions = () => {
    setShowNotification(false);
    setChatOpen(true);
    setTriggerChat(true);
  };

  const handleReassignConfirmed = () => {
    if (reassigned) return;
    setReassigned(true);

    // Move Alex's tasks to Jordan and Sam per REASSIGN_PLAN
    setTaskBoard(prev => prev.map(emp => {
      if (emp.id === "alex") {
        // Mark Alex's tasks as reassigned (strike through / done-ish)
        return {
          ...emp,
          floorStatus: "Signed Off" as const,
          tasks: emp.tasks.map(t => ({ ...t, status: "Done" as const, time: "Reassigned" })),
        };
      }
      if (emp.id === "jordan") {
        return {
          ...emp,
          tasks: [
            { id: `t-alex-1`, title: "Submit reorder for Baby Spinach", zone: "Zone C", priority: "High" as const, status: "To Do" as const, time: "Urgent" },
            ...emp.tasks,
          ],
        };
      }
      if (emp.id === "sam") {
        return {
          ...emp,
          tasks: [
            { id: `t-alex-2`, title: "Apply markdown — Heirloom Tomatoes", zone: "Zone C · Shelf 4A", priority: "Medium" as const, status: "To Do" as const },
            { id: `t-alex-3`, title: "Cull damaged blackberries", zone: "Zone C", priority: "Medium" as const, status: "To Do" as const },
            ...emp.tasks,
          ],
        };
      }
      return emp;
    }));

    // Toasts
    setTimeout(() => toast.success("Task assigned to Jordan M. — Submit reorder for Baby Spinach"), 200);
    setTimeout(() => toast.success("Task assigned to Sam K. — Apply markdown — Heirloom Tomatoes"), 600);
    setTimeout(() => toast.success("Task assigned to Sam K. — Cull damaged blackberries"), 1000);
  };

  const handleAssign = (id: string, name: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, assignee: name, status: "In Progress" } : a));
    toast.success(`Assigned to ${name}`);
  };

  const handleAddTask = (task: EmployeeTask, employeeId: string) => {
    setTaskBoard(prev => prev.map(emp =>
      emp.id === employeeId ? { ...emp, tasks: [task, ...emp.tasks] } : emp
    ));
    toast.success("Task added to board");
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
        <SpaceHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ── Alex sign-off notification banner ── */}
        {showNotification && !reassigned && (
          <div
            style={{
              margin: '0 24px 0',
              padding: '12px 16px',
              borderRadius: 10,
              backgroundColor: '#fff8e1',
              border: '1.5px solid #f9a825',
              display: 'flex', alignItems: 'center', gap: 12,
              animation: 'fade-in-up 0.35s ease-out both',
              position: 'relative', zIndex: 20,
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#8A48E6,#470CED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: ff, fontSize: 13, fontWeight: 700, color: '#fff' }}>AT</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: ff, fontSize: 13, fontWeight: 700, color: '#5d4037', margin: 0 }}>
                Alex T. has signed off
              </p>
              <p style={{ fontFamily: ff, fontSize: 12, color: '#795548', margin: '2px 0 0' }}>
                3 open tasks in Zone C need reassignment
              </p>
            </div>
            <button
              onClick={handleViewSuggestions}
              style={{
                padding: '7px 14px', borderRadius: 7, border: 'none',
                backgroundColor: '#5d36ff', color: '#fff',
                fontFamily: ff, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <Zap size={12} /> View Joule's suggestions
            </button>
            <button
              onClick={() => setShowNotification(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#795548', padding: 4, flexShrink: 0, display: 'flex' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'Overview' && (
            <>
              {/* 1. Personalized My Day */}
              <MyDaySection associates={initialAssociates} onAddTask={handleAddTask} />

              {/* Divider */}
              <div style={{ margin: '40px 80px 0', height: 1, backgroundColor: '#e6e7ea' }} />

              {/* 2. Task Board */}
              <TaskBoardSection taskBoard={taskBoard} onAddTask={handleAddTask} />
            </>
          )}

          {activeTab === 'Floor Plan' && (
            <FloorplanSection />
          )}

          {activeTab === 'Alerts & Notifications' && (
            <AlertsTab alerts={alerts} onAddTask={handleAddTask} taskBoard={taskBoard} />
          )}

          {activeTab === 'Team' && (
            <TeamTab taskBoard={taskBoard} />
          )}
        </div>
      </div>

      {/* ── Right Chat Pane + toggle button ── */}
      <div style={{ position: 'relative', flexShrink: 0, display: 'flex' }}>
        {/* Toggle button — always visible at top, sits on the left edge of the pane */}
        <button
          onClick={() => setChatOpen(o => !o)}
          style={{
            position: 'absolute',
            top: 16,
            left: -20,
            zIndex: 30,
            width: 40,
            height: 40,
            borderRadius: 10,
            border: '1px solid #e6e7ea',
            backgroundColor: chatOpen ? '#e5ecf5' : '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
          }}
        >
          <ChatPaneIcon />
        </button>

        {/* Chat panel — slides in/out */}
        <div style={{
          width: chatOpen ? 508 : 0,
          flexShrink: 0,
          height: '100%',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
          borderLeft: chatOpen ? '1px solid #e6e7ea' : 'none',
          backgroundColor: '#f8f9fa',
        }}>
          <div style={{ width: 508, height: '100%' }}>
            <SpaceChatPanel
              alerts={alerts}
              onAssign={handleAssign}
              onReassignConfirmed={handleReassignConfirmed}
              triggerAlexSignoff={triggerChat}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreManagerSpacePage;
