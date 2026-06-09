import { useState, useRef, useEffect, useCallback } from "react";
import {
  MoreHorizontal, BookOpen, FileText, ListFilter, ChevronDown,
  CheckCircle2, AlertTriangle, ExternalLink, XCircle,
  Clock, User, ArrowRight, Shield, Eye, Ban,
  AtSign, Mic, SlidersHorizontal, Send, Layers, X,
  Mail, Pencil, Check, Plus, RefreshCw, Inbox, FileCheck,
  List, Play, Pause, Copy, Share2, Paperclip
} from "lucide-react";
import { SpacesIcon } from "@/components/invoicing/IconSidebar";
// IconSidebar now in SidebarLayout
import { Skeleton } from "@/components/ui/skeleton";
import spaceIcon from "@/assets/space-icon.png";
import { toast } from "sonner";

/* ===== Types ===== */
type InvoiceStatus = "Blocked" | "Under Review" | "Resolved" | "Rejected" | "False Positive" | "Escalated" | "Email Sent" | "Response Received";

interface FlaggedInvoice {
  id: string;
  vendor: string;
  amount: string;
  date: string;
  poRef: string;
  matchId: string;
  matchDoc: string;
  confidence: number;
  status: InvoiceStatus;
  fields: string[];
}

/* ===== Initial Data ===== */
const initialInvoices: FlaggedInvoice[] = [
  {
    id: "INV-2026-07814",
    vendor: "Meridian Frost Ltd",
    amount: "$61,520.00",
    date: "2026-08-03",
    poRef: "PO-2026-HI-00688",
    matchId: "INV-2026-07814v",
    matchDoc: "PO-2026-HI-00688",
    confidence: 89,
    status: "Blocked",
    fields: ["Vendor", "PO Reference", "Line Items"],
  },
  {
    id: "INV-2026-09102",
    vendor: "Meridian Frost Ltd",
    amount: "$47,890.00",
    date: "2026-11-21",
    poRef: "PO-2026-HI-00819",
    matchId: "INV-2026-09120",
    matchDoc: "PO-2026-HI-00819",
    confidence: 86,
    status: "Under Review",
    fields: ["Vendor", "Amount", "Line Items"],
  },
];

const initialActivity = [
  { action: "Auto-blocked", invoice: "INV-2026-07814", time: "2 hours ago", icon: Ban, color: "text-destructive" },
  { action: "Flagged for review", invoice: "INV-2026-09102", time: "3 hours ago", icon: AlertTriangle, color: "text-warning" },
  { action: "Scan completed", invoice: "1,247 invoices", time: "4 hours ago", icon: CheckCircle2, color: "text-success" },
  { action: "False positive dismissed", invoice: "INV-2026-07102", time: "Yesterday", icon: XCircle, color: "text-muted-foreground" },
];

const rejectedIcon = "https://www.figma.com/api/mcp/asset/98886062-32c6-489a-ae23-aa53e19bec25";

/* ===== Components ===== */
const StatusPill = ({ status }: { status: InvoiceStatus }) => {
  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-[6px] px-[8px] py-[4px] rounded-[4px]" style={{ backgroundColor: '#f6e6e7' }}>
        <img src={rejectedIcon} alt="" className="size-[12px] shrink-0" />
        <span style={{ fontFamily: '"72", "72full", Arial, Helvetica, sans-serif', fontSize: 13, fontWeight: 400, lineHeight: '16px', color: '#c72f2b', whiteSpace: 'nowrap' }}>Rejected</span>
      </span>
    );
  }
  const styles: Record<InvoiceStatus, string> = {
    "Blocked": "bg-destructive/10 text-destructive border-destructive/20",
    "Under Review": "bg-warning/10 text-warning border-warning/20",
    "Resolved": "bg-success/10 text-success border-success/20",
    "Rejected": "",
    "False Positive": "bg-primary/10 text-primary border-primary/20",
    "Escalated": "bg-warning/10 text-warning border-warning/20",
    "Email Sent": "bg-chat-muted text-chat-primary border-chat-primary/20",
    "Response Received": "bg-success/10 text-success border-success/20",
  };
  const icons: Partial<Record<InvoiceStatus, React.ReactNode>> = {
    "Blocked": <Ban size={11} />,
    "Under Review": <Eye size={11} />,
    "Resolved": <CheckCircle2 size={11} />,
    "False Positive": <CheckCircle2 size={11} />,
    "Escalated": <ArrowRight size={11} />,
    "Email Sent": <Mail size={11} />,
    "Response Received": <Inbox size={11} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-sap-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const ConfidenceBadge = ({ value }: { value: number }) => {
  const color = value >= 95 ? "text-destructive bg-destructive/10" : value >= 80 ? "text-warning bg-warning/10" : "text-muted-foreground bg-muted";
  return (
    <span className={`px-2 py-0.5 rounded-md text-sap-xs font-medium ${color}`}>
      {value}% match
    </span>
  );
};

/* ===== Space Header ===== */
const menuIcon = "https://www.figma.com/api/mcp/asset/bd97da64-fefd-441a-8daf-972aeb6ce2d9";
const overviewIcon = "https://www.figma.com/api/mcp/asset/ed5912b3-934f-407b-94a6-addb42c09200";
const chatIcon = "https://www.figma.com/api/mcp/asset/3a0c711d-e2d9-43f2-bbc6-5f5e2c3ffeb4";

const SpaceHeader = ({ onInsights, showInsights }: { onInsights: () => void; showInsights: boolean }) => (
  <>
    {/* Pane Bar */}
    <div className="flex items-center justify-between px-[20px] py-[12px] shrink-0 relative z-10">
      <div className="flex items-center gap-6">
        <button className="flex items-center justify-center rounded-lg hover:bg-secondary transition-colors p-[7px]">
          <img src={menuIcon} alt="Menu" className="size-[14px] object-contain" />
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <button className="flex items-center gap-1.5 px-[12px] py-[6px] rounded-lg hover:bg-secondary transition-colors">
          <img src={overviewIcon} alt="Overview" className="size-[14px] object-contain" />
          <span style={{ fontFamily: '"72", "72full", Arial, Helvetica, sans-serif', fontSize: 13, fontWeight: 400, lineHeight: '18px', color: '#0b0c0f', whiteSpace: 'nowrap' }}>Overview</span>
        </button>
        <button className="flex items-center justify-center rounded-lg hover:bg-secondary transition-colors p-[7px]">
          <MoreHorizontal size={14} className="text-foreground/70" />
        </button>
        <button className="flex items-center justify-center rounded-lg transition-colors p-[7px]" style={{ backgroundColor: '#e5ecf5' }}>
          <img src={chatIcon} alt="Chat" className="size-[14px] object-contain" />
        </button>
      </div>
    </div>
    {/* Heading */}
    <div className="relative px-6 pt-5 pb-2 shrink-0 z-10">
      <h1 style={{ fontFamily: '"72", "72full", Arial, Helvetica, sans-serif', fontSize: 26, fontWeight: 100, lineHeight: '32px', color: '#0b0c0f', margin: 0, marginTop: 10 }}>
        Duplicate Invoice Review — Meridian Frost Ltd
      </h1>
    </div>
  </>
);

/* ===== Insights Panel ===== */
const InsightsPanel = ({ onClose }: { onClose: () => void }) => (
  <div className="mx-4 md:mx-6 mt-6 rounded-[7px] border border-primary/20 bg-primary/5 p-5 relative">
    <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"><X size={14} /></button>
    <h3 className="text-sap-sm font-medium text-foreground mb-3">AI Insights</h3>
    <ul className="space-y-2 text-sap-sm text-foreground">
      <li className="flex gap-2"><AlertTriangle size={13} className="text-warning shrink-0 mt-0.5" /><span>Meridian Frost Ltd has submitted <span className="font-semibold">2 pending invoices</span> under review — both referencing active POs.</span></li>
      <li className="flex gap-2"><Shield size={13} className="text-primary shrink-0 mt-0.5" /><span>Auto-block has prevented <span className="font-semibold">$109,410.00</span> in potential duplicate payments this quarter.</span></li>
      <li className="flex gap-2"><CheckCircle2 size={13} className="text-success shrink-0 mt-0.5" /><span>Detection accuracy is <span className="font-semibold">98.7%</span> — only 2 false positives in 1,247 scanned invoices.</span></li>
    </ul>
  </div>
);

/* ===== Summary Stats ===== */
const SummaryStats = ({ invoices }: { invoices: FlaggedInvoice[] }) => {
  const blocked = invoices.filter(i => i.status === "Blocked" || i.status === "Rejected").length;
  const pending = invoices.filter(i => i.status === "Under Review").length;
  const resolved = invoices.filter(i => i.status === "Resolved" || i.status === "False Positive").length;

  return (
    <div className="bg-card rounded-[7px] border border-border/55 p-4 md:p-5 mx-4 md:mx-6 mt-6 animate-[fade-in-up_0.4s_ease-out_both]" style={{ animationDelay: '100ms' }}>
      <div className="mb-4">
        <h2 className="text-sap-base font-semibold text-foreground">Summary</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <div>
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Flagged Invoices</p>
          <p className="text-sap-lg font-medium text-destructive">{invoices.length}</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Total at Risk</p>
          <p className="text-sap-lg font-medium text-foreground">$109,410.00</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Blocked / Rejected</p>
          <p className="text-sap-lg font-medium text-foreground">{blocked}</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Pending Review</p>
          <p className="text-sap-lg font-medium text-warning">{pending}</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground font-medium mb-1">Resolved</p>
          <p className="text-sap-lg font-medium text-success">{resolved}</p>
        </div>
      </div>
    </div>
  );
};

/* (confirm logic moved inline into FlaggedInvoiceCard) */

/* ===== Flagged Invoice Cards ===== */
const FlaggedInvoiceCard = ({
  invoice,
  onReject,
  onFalsePositive,
  onEscalate,
  defaultCollapsed = false,
}: {
  invoice: FlaggedInvoice;
  onReject: (id: string) => void;
  onFalsePositive: (id: string) => void;
  onEscalate: (id: string) => void;
  defaultCollapsed?: boolean;
}) => {
  const isActioned = ["Rejected", "False Positive", "Escalated", "Resolved"].includes(invoice.status);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="rounded-[7px] bg-card px-6 py-5 border border-border/55 transition-shadow">
      <div
        className={`flex items-center justify-between gap-3 ${!collapsed || !isActioned ? 'mb-4' : ''}`}
        onClick={isActioned ? () => setCollapsed(!collapsed) : undefined}
        style={isActioned ? { cursor: 'pointer' } : undefined}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sap-base font-medium text-foreground">{invoice.id}</h3>
            <ConfidenceBadge value={invoice.confidence} />
          </div>
          <p className="text-sap-sm text-muted-foreground">{invoice.vendor} · {invoice.date}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusPill status={invoice.status} />
          {isActioned && (
            <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${!collapsed ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>

      {collapsed && isActioned ? null : (
        <>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Uploaded Invoice */}
        <div className="rounded-[7px] border border-primary/20 bg-primary/[0.03] p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <p className="text-sap-sm font-semibold text-primary uppercase tracking-wide">Uploaded</p>
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-sap-sm text-muted-foreground mb-0.5">Invoice #</p>
              <p className="text-sap-base font-medium text-foreground">{invoice.id}</p>
            </div>
            <div>
              <p className="text-sap-sm text-muted-foreground mb-0.5">Vendor</p>
              <p className="text-sap-base font-medium text-foreground">{invoice.vendor}</p>
            </div>
            <div>
              <p className="text-sap-sm text-muted-foreground mb-0.5">Amount</p>
              <p className="text-sap-base font-medium text-foreground">{invoice.amount}</p>
            </div>
            <div>
              <p className="text-sap-sm text-muted-foreground mb-0.5">Document ID</p>
              <button
                onClick={() => toast("Opening document", { description: `Navigating to ${invoice.poRef}` })}
                className="font-medium text-primary text-sap-base cursor-pointer hover:underline flex items-center gap-1"
              >
                {invoice.poRef}
                <ExternalLink size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Existing / Duplicate Invoice */}
        <div className="rounded-[7px] border border-chat-primary/20 bg-chat-primary/[0.03] p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-chat-primary" />
            <p className="text-sap-sm font-semibold text-chat-primary uppercase tracking-wide">Existing Match</p>
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-sap-sm text-muted-foreground mb-0.5">Invoice #</p>
              <div className="flex items-center gap-1.5">
                <p className="text-sap-base font-medium text-foreground">{invoice.matchId}</p>
                {invoice.fields.includes("Invoice Number") && <CheckCircle2 size={13} className="text-chat-primary shrink-0" />}
              </div>
            </div>
            <div>
              <p className="text-sap-sm text-muted-foreground mb-0.5">Vendor</p>
              <div className="flex items-center gap-1.5">
                <p className="text-sap-base font-medium text-foreground">{invoice.vendor}</p>
                <CheckCircle2 size={13} className="text-chat-primary shrink-0" />
              </div>
            </div>
            <div>
              <p className="text-sap-sm text-muted-foreground mb-0.5">Amount</p>
              <div className="flex items-center gap-1.5">
                <p className="text-sap-base font-medium text-foreground">{invoice.amount}</p>
                <CheckCircle2 size={13} className="text-chat-primary shrink-0" />
              </div>
            </div>
            <div>
              <p className="text-sap-sm text-muted-foreground mb-0.5">Document ID</p>
              <button
                onClick={() => toast("Opening document", { description: `Navigating to ${invoice.matchDoc}` })}
                className="font-medium text-primary text-sap-base cursor-pointer hover:underline flex items-center gap-1"
              >
                {invoice.matchDoc}
                <ExternalLink size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

/* ===== Activity Feed ===== */
const ActivityFeed = ({ activities }: { activities: typeof initialActivity }) => (
  <div className="mx-4 md:mx-6 animate-[fade-in-up_0.4s_ease-out_both]" style={{ marginTop: '42px', animationDelay: '200ms' }}>
    <div className="border-t border-border mb-6" />
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-sap-base font-semibold text-foreground">Recent Activity</h2>
      <button className="text-primary hover:text-primary/80"><MoreHorizontal size={16} /></button>
      <button className="text-primary hover:text-primary/80"><ChevronDown size={16} /></button>
    </div>
    <div className="rounded-[7px] bg-card divide-y divide-border border border-border/55">
      {activities.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <div className={`w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center shrink-0 ${item.color}`}>
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sap-sm text-foreground">
                <span className="font-semibold">{item.action}</span> · {item.invoice}
              </p>
            </div>
            <span className="text-sap-sm text-muted-foreground shrink-0">{item.time}</span>
          </div>
        );
      })}
    </div>
  </div>
);

/* ===== Governance Rules ===== */
const GovernanceRules = () => (
  <div className="mx-6 mb-8 animate-[fade-in-up_0.4s_ease-out_both]" style={{ marginTop: '42px', animationDelay: '280ms' }}>
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-sap-base font-semibold text-foreground">Governance Rules</h2>
      <button className="text-primary hover:text-primary/80"><MoreHorizontal size={16} /></button>
      <button className="text-primary hover:text-primary/80"><ChevronDown size={16} /></button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-[7px] bg-card p-4 border border-border/55">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-primary" />
          <h3 className="text-sap-sm font-medium text-foreground">Auto-Block Criteria</h3>
        </div>
        <ul className="space-y-1.5 text-sap-sm text-muted-foreground">
          <li className="flex gap-2"><span>•</span><span>Match confidence ≥ 95%</span></li>
          <li className="flex gap-2"><span>•</span><span>Exact invoice number + vendor match</span></li>
          <li className="flex gap-2"><span>•</span><span>Existing invoice already posted or paid</span></li>
        </ul>
      </div>
      <div className="rounded-[7px] bg-card p-4 border border-border/55">
        <div className="flex items-center gap-2 mb-3">
          <Eye size={16} className="text-primary" />
          <h3 className="text-sap-sm font-medium text-foreground">Escalation Triggers</h3>
        </div>
        <ul className="space-y-1.5 text-sap-sm text-muted-foreground">
          <li className="flex gap-2"><span>•</span><span>3+ duplicates from same vendor in 30 days</span></li>
          <li className="flex gap-2"><span>•</span><span>Disputed invoice amount &gt; $50,000</span></li>
          <li className="flex gap-2"><span>•</span><span>Vendor flagged in compliance watchlist</span></li>
        </ul>
      </div>
    </div>
  </div>
);

const invoiceEmailDetails: Record<string, { po: string; amount: string; description: string }> = {
  "INV-2026-07814": { po: "PO-2026-HI-00688", amount: "$61,520.00", description: "Steel Hex Bolts & O-Ring Seal Kit" },
  "INV-2026-09102": { po: "PO-2026-HI-00819", amount: "$47,890.00", description: "Carbon Steel Flange Bolts & Pneumatic Cylinder Seal Kit" },
};

const buildEmailBody = (ids: string[]) => {
  if (ids.length === 0) return "";
  const lines = ids.map(id => {
    const d = invoiceEmailDetails[id];
    return d ? `${id} (${d.po}, ${d.amount} — ${d.description})` : id;
  });
  const invoiceList = ids.join(" and ");
  const detailList = lines.join(" and ");
  return `Dear Meridian Frost Ltd Accounts Payable,

We've identified ${ids.length === 1 ? "an invoice" : "two invoices"} (${invoiceList}) from your organisation currently pending review in our system.

${detailList} ${ids.length === 1 ? "is" : "are"} flagged for review before payment can be authorised.

Could you please confirm the details and validity of ${ids.length === 1 ? "this submission" : "each submission"}? We've temporarily held processing pending your clarification.

Best regards,
AP Team`;
};

const EmailDraftCard = ({ onSendEmail, pendingIds }: { onSendEmail?: () => void; pendingIds: string[] }) => {
  const [sent, setSent] = useState(false);

  return sent ? (
    <div className="rounded-[7px] border border-success/30 bg-success/5 p-3 flex items-center gap-2">
      <CheckCircle2 size={14} className="text-success" />
      <span className="text-sap-sm font-medium text-foreground">Email sent to procurement@meridianfrost.com</span>
    </div>
  ) : (
  <div className="rounded-[7px] border-2 border-dashed border-chat-primary/30 bg-gradient-to-br from-chat-primary/5 to-transparent p-4 space-y-3">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-[6px] bg-chat-primary/15 flex items-center justify-center">
        <Mail size={14} className="text-chat-primary" />
      </div>
      <span className="text-sap-sm font-medium text-foreground">Email Draft</span>
      <span className="ml-auto text-sap-sm text-muted-foreground flex items-center gap-1">
        <Pencil size={10} />
        Editable
      </span>
    </div>
    <div className="space-y-2 text-sap-sm">
      <div className="flex gap-2">
        <span className="text-muted-foreground font-medium shrink-0">To:</span>
        <span className="text-foreground">procurement@meridianfrost.com</span>
      </div>
      <div className="flex gap-2">
        <span className="text-muted-foreground font-medium shrink-0">Subject:</span>
        <span className="text-foreground font-medium">Clarification Needed: Duplicate Invoice Submission{pendingIds.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="h-px bg-border" />
      <div className="text-foreground leading-relaxed whitespace-pre-line text-sap-sm">
        {buildEmailBody(pendingIds)}
      </div>
    </div>
    <div className="flex items-center gap-2 pt-1">
      <button
        onClick={() => {
          setSent(true);
          toast.success("Email sent", { description: "Clarification request sent to procurement@meridianfrost.com" });
          onSendEmail?.();
        }}
        className="px-3.5 py-1.5 rounded-[7px] text-sap-sm font-medium bg-chat-primary text-chat-primary-foreground hover:bg-chat-primary/90 transition-colors flex items-center gap-1.5"
      >
        <Send size={11} />
        Send Email
      </button>
      <button className="px-3.5 py-1.5 rounded-[7px] text-sap-sm font-medium border border-border text-muted-foreground hover:bg-secondary transition-colors">
        Edit Draft
      </button>
    </div>
  </div>
  );
};

/* ===== Invoice Selection Card ===== */
const InvoiceSelectionCard = ({ onSelect }: { onSelect: (selected: string[]) => void }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (submitted) {
    return (
      <div className="rounded-[7px] border border-chat-primary/20 bg-chat-primary/5 p-3 flex items-center gap-2">
        <CheckCircle2 size={14} className="text-chat-primary" />
        <span className="text-sap-sm font-medium text-foreground">
          Selected: {selected.join(", ")}
        </span>
      </div>
    );
  }

  const invoiceOptions = [
    { id: "INV-2026-07814", amount: "$61,520.00", date: "2026-08-03", confidence: 89 },
    { id: "INV-2026-09102", amount: "$47,890.00", date: "2026-11-21", confidence: 86 },
  ];

  return (
    <div className="rounded-[7px] border border-chat-primary/20 bg-card p-4 space-y-3">
      <p className="text-sap-sm font-medium text-foreground">Which invoice(s) should we contact Meridian Frost Ltd about?</p>
      <div className="space-y-2">
        {invoiceOptions.map(inv => {
          const isSelected = selected.includes(inv.id);
          return (
            <button
              key={inv.id}
              onClick={() => toggle(inv.id)}
              className={`w-full rounded-[7px] border p-3 text-left transition-all ${
                isSelected
                  ? "border-chat-primary bg-chat-primary/8 ring-1 ring-chat-primary/30"
                  : "border-border hover:border-muted-foreground/40 hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? "border-chat-primary bg-chat-primary" : "border-muted-foreground/40"
                }`}>
                  {isSelected && <Check size={12} className="text-chat-primary-foreground" />}
                </div>
                <span className="text-sap-sm font-medium text-foreground">{inv.id}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 ml-8 text-sap-sm text-muted-foreground">
                <span>{inv.amount}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span>{inv.date}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span className={`px-2 py-0.5 rounded-md text-sap-sm font-medium ${inv.confidence >= 95 ? "text-destructive bg-destructive/10" : inv.confidence >= 80 ? "text-warning bg-warning/10" : "text-muted-foreground bg-muted"}`}>{inv.confidence}% match</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => {
            if (selected.length === 0) return;
            setSubmitted(true);
            onSelect(selected);
          }}
          disabled={selected.length === 0}
          className="px-3.5 py-1.5 rounded-[7px] text-sap-sm font-medium bg-chat-primary text-chat-primary-foreground hover:bg-chat-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <Send size={11} />
          Continue with {selected.length > 0 ? selected.length : ""} selected
        </button>
        <button
          onClick={() => { setSelected(invoiceOptions.map(i => i.id)); }}
          className="px-3.5 py-1.5 rounded-[7px] text-sap-sm font-medium border border-border text-muted-foreground hover:bg-secondary transition-colors"
        >
          Select Both
        </button>
      </div>
    </div>
  );
};

/* ===== Check for Response Button ===== */
const CheckResponseButton = ({ onCheck }: { onCheck: () => void }) => {
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);

  const handleCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setDone(true);
      onCheck();
    }, 2200);
  };

  if (done) {
    return (
      <div className="rounded-[7px] border border-success/30 bg-success/5 p-3 flex items-center gap-2">
        <Inbox size={14} className="text-success" />
        <span className="text-sap-sm font-medium text-foreground">Response received from Meridian Frost Ltd</span>
      </div>
    );
  }

  return (
    <div className="rounded-[7px] border border-chat-primary/20 bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-[6px] bg-chat-primary/15 flex items-center justify-center">
          <Inbox size={14} className="text-chat-primary" />
        </div>
        <span className="text-sap-sm font-medium text-foreground">Awaiting supplier response</span>
      </div>
      <p className="text-sap-sm text-muted-foreground">
        Check if Meridian Frost Ltd has responded to the clarification request about the flagged invoices.
      </p>
      <button
        onClick={handleCheck}
        disabled={checking}
        className="px-3.5 py-1.5 rounded-[7px] text-sap-sm font-medium bg-chat-primary text-chat-primary-foreground hover:bg-chat-primary/90 transition-colors flex items-center gap-1.5 disabled:opacity-60"
      >
        {checking ? (
          <>
            <RefreshCw size={12} className="animate-spin" />
            Checking inbox…
          </>
        ) : (
          <>
            <RefreshCw size={12} />
            Check for Response
          </>
        )}
      </button>
    </div>
  );
};

/* ===== Supplier Response Card ===== */
const SupplierResponseCard = ({ selectedIds, onAction, hideActions = false }: { selectedIds: string[]; onAction: (action: string, invoiceId: string) => void; hideActions?: boolean }) => {
  const [actioned, setActioned] = useState<Record<string, string>>({});

  const handleAction = (action: string, invoiceId: string) => {
    setActioned(prev => ({ ...prev, [invoiceId]: action }));
    onAction(action, invoiceId);
  };

  const allActioned = selectedIds.every(id => actioned[id]);

  return (
    <div className="rounded-[7px] border-2 border-success/30 bg-gradient-to-br from-success/5 to-transparent p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-[6px] bg-success/15 flex items-center justify-center">
          <Mail size={14} className="text-success" />
        </div>
        <span className="text-sap-sm font-medium text-foreground">Supplier Response</span>
        <span className="ml-auto text-sap-sm text-muted-foreground flex items-center gap-1">
          <Clock size={10} />
          Just now
        </span>
      </div>

      {/* Email content */}
      <div className="space-y-2 text-sap-sm">
        <div className="flex gap-2">
          <span className="text-muted-foreground font-medium shrink-0">From:</span>
          <span className="text-foreground">procurement@meridianfrost.com</span>
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground font-medium shrink-0">Subject:</span>
          <span className="text-foreground font-medium">RE: Clarification Needed: Duplicate Invoice Submissions</span>
        </div>
        <div className="h-px bg-border" />
        <div className="text-foreground leading-relaxed whitespace-pre-line text-sap-sm">
{`Dear AP Team,

Thank you for flagging this. After reviewing our records:

• INV-2026-07814 is the correct and final invoice for PO-4410.
• INV-2026-09102 was submitted in error due to a system glitch on our end. Please disregard and reject it.

We've corrected the issue on our side to prevent future duplicates. Apologies for the inconvenience.

Best regards,
Maria Santos
Accounts Receivable, Meridian Frost Ltd`}
        </div>
      </div>

      {/* Suggested actions — hidden once all actioned or hideActions is true */}
      {!allActioned && !hideActions && (
        <div className="border-t border-border pt-3 space-y-2">
          <p className="text-sap-sm font-medium text-foreground flex items-center gap-1.5">
            <FileCheck size={12} className="text-chat-primary" />
            Recommended Actions
          </p>
          <div className="space-y-2">
            {selectedIds.includes("INV-2026-07814") && !actioned["INV-2026-07814"] && (
              <div className="rounded-[7px] border border-border bg-muted/30 p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sap-sm font-medium text-foreground">INV-2026-07814</p>
                  <p className="text-sap-sm text-muted-foreground">Confirmed as valid — approve for processing</p>
                </div>
                <button
                  onClick={() => handleAction("approve", "INV-2026-07814")}
                  className="px-3.5 py-1.5 rounded-[7px] text-sap-sm font-medium text-success bg-success/10 hover:bg-success/20 transition-colors flex items-center gap-1 shrink-0"
                >
                  <CheckCircle2 size={11} />
                  Approve
                </button>
              </div>
            )}
            {selectedIds.includes("INV-2026-09102") && !actioned["INV-2026-09102"] && (
              <div className="rounded-[7px] border border-border bg-muted/30 p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sap-sm font-medium text-foreground">INV-2026-09102</p>
                  <p className="text-sap-sm text-muted-foreground">Confirmed as duplicate — reject</p>
                </div>
                <button
                  onClick={() => handleAction("reject", "INV-2026-09102")}
                  className="px-3.5 py-1.5 rounded-[7px] text-sap-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors flex items-center gap-1 shrink-0"
                >
                  <Ban size={11} />
                  Reject
                </button>
              </div>
            )}
            {/* Bulk action — only if both still pending */}
            {selectedIds.length === 2 && !actioned["INV-2026-07814"] && !actioned["INV-2026-09102"] && (
              <button
                onClick={() => {
                  handleAction("approve", "INV-2026-07814");
                  setTimeout(() => handleAction("reject", "INV-2026-09102"), 300);
                }}
                className="w-full px-3.5 py-1.5 rounded-[7px] text-sap-sm font-medium border border-chat-primary text-chat-primary hover:bg-chat-primary/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileCheck size={12} />
                Apply All Recommended Actions
              </button>
            )}
          </div>
        </div>
      )}

      {/* Completed summary */}
      {allActioned && (
        <div className="border-t border-border pt-3 flex items-center gap-2">
          <CheckCircle2 size={13} className="text-success" />
          <span className="text-sap-sm font-medium text-foreground">All actions completed</span>
        </div>
      )}
    </div>
  );
};

/* ===== Escalation Card ===== */
const EscalationCard = ({ invoiceId }: { invoiceId: string }) => (
  <div className="rounded-[7px] border border-warning/30 bg-warning/5 p-4 space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-warning/15 flex items-center justify-center shrink-0">
        <User size={18} className="text-warning" />
      </div>
      <div className="min-w-0">
        <p className="text-sap-sm font-medium text-foreground">Sarah Chen</p>
        <p className="text-sap-xs text-muted-foreground">Finance Manager · AP Operations</p>      </div>
    </div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sap-sm">
      <div>
        <p className="text-muted-foreground">Email</p>
        <p className="text-foreground font-medium">s.chen@company.com</p>
      </div>
      <div>
        <p className="text-muted-foreground">Department</p>
        <p className="text-foreground font-medium">Finance</p>
      </div>
      <div>
        <p className="text-muted-foreground">Invoice</p>
        <p className="text-foreground font-medium">{invoiceId}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Priority</p>
        <p className="text-warning font-medium">High</p>
      </div>
    </div>
    <div className="flex items-center gap-2 pt-1 text-sap-sm">
      <CheckCircle2 size={13} className="text-success" />
      <span className="text-muted-foreground">Escalation email sent with full match details attached</span>
    </div>
  </div>
);


const InvoiceActionButtons = ({ invoices, invoiceActioned, quickActionClicked, setQuickActionClicked, onQuickAction }: {
  invoices: FlaggedInvoice[];
  invoiceActioned: Record<string, string>;
  quickActionClicked: string | null;
  setQuickActionClicked: (v: string) => void;
  onQuickAction: (action: string) => void;
}) => {
  const allDone = invoices.every(inv => invoiceActioned[inv.id] || ["Rejected", "False Positive", "Escalated", "Resolved"].includes(inv.status));
  if (quickActionClicked) return null;
  return (
    <>
      {allDone && (
        <p className="text-sap-sm text-foreground mt-4">All done! Is there anything else you'd like me to help with?</p>
      )}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => { setQuickActionClicked("contact"); onQuickAction("Contact Meridian Frost Ltd"); }}
          className="px-3.5 py-1.5 rounded-[7px] text-[12px] font-medium text-chat-primary bg-chat-primary/10 hover:bg-chat-primary/20 transition-colors"
        >Contact Meridian Frost Ltd</button>
        <button
          onClick={() => { setQuickActionClicked("history"); onQuickAction("Show payment history"); }}
          className="px-3.5 py-1.5 rounded-[7px] text-[12px] font-medium text-chat-primary bg-chat-primary/10 hover:bg-chat-primary/20 transition-colors"
        >Show payment history</button>
      </div>
    </>
  );
};

const SpaceChatPanel = ({ chatMessages, onSend, onQuickAction, onSendEmail, onCheckResponse, onResponseAction, selectedInvoiceIds, invoices, onReject, onFalsePositive, onEscalate }: {
  chatMessages: { role: "user" | "bot"; text: string; emailDraft?: boolean; emailDraftIds?: string[]; invoiceSelect?: boolean; escalationCard?: boolean; escalatedInvoiceId?: string; suggestions?: string[]; checkResponse?: boolean; supplierResponse?: boolean }[];
  onSend: (msg: string) => void;
  onQuickAction: (action: string) => void;
  onSendEmail: () => void;
  onCheckResponse: () => void;
  onResponseAction: (action: string, invoiceId: string) => void;
  selectedInvoiceIds: string[];
  onInvoiceSelected?: (selected: string[]) => void;
  invoices: FlaggedInvoice[];
  onReject: (id: string) => void;
  onFalsePositive: (id: string) => void;
  onEscalate: (id: string) => void;
}) => {
  const [input, setInput] = useState("");
  const [invoiceActioned, setInvoiceActioned] = useState<Record<string, string>>({});
  const [quickActionClicked, setQuickActionClicked] = useState<string | null>(null);
  const [clickedSuggestions, setClickedSuggestions] = useState<Record<number, boolean>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <aside className="w-full md:w-[360px] lg:w-[420px] bg-[#f8f9fa] flex flex-col shrink-0 min-h-0 md:max-h-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 shadow-[0_2px_6px_rgba(29,33,50,0.06)] shrink-0 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <FileText size={18} className="text-foreground/60 shrink-0" />
          <h2 className="text-sap-base font-medium text-foreground truncate">Duplicate Review</h2>
        </div>
        <button className="w-7 h-7 rounded-[6px] bg-[hsl(var(--el-purple-100))] flex items-center justify-center text-[hsl(var(--el-purple-600))] hover:bg-[hsl(var(--el-purple-200))] transition-colors shrink-0">
          <Plus size={16} />
        </button>
      </div>

      {/* Chat content */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 space-y-8 min-h-0">
        {/* Space created notification */}
        <div className="flex items-start gap-3 p-3 rounded-md bg-secondary/50 border border-border">
          <div className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5">
            <img src={spaceIcon} alt="Space" className="w-8 h-8 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sap-sm font-semibold text-foreground">Space opened</p>
            <p className="text-sap-sm text-muted-foreground">Duplicate Invoice Review for Meridian Frost Ltd</p>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-sap-sm text-muted-foreground">
              <span>Vendor: Meridian Frost Ltd</span>
              <span>Invoices: 2 flagged</span>
            </div>
          </div>
        </div>


        {/* Dynamic messages */}
        {chatMessages.map((msg, i) => (
          <div key={i}>
            <div className={msg.role === "user" ? "flex justify-end" : ""}>
              <div className={msg.role === "user"
                ? "text-sap-base text-foreground max-w-[80%] text-right leading-normal bg-[#E6E7EA] px-4 py-2.5 rounded-2xl rounded-br-[2px]"
                : "text-sap-base text-foreground leading-relaxed whitespace-pre-line"
              }>
                {msg.role === "bot"
                  ? msg.text.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                      part.startsWith("**") && part.endsWith("**")
                        ? <strong key={j}>{part.slice(2, -2)}</strong>
                        : part
                    )
                  : msg.text}
              </div>
            </div>
            {msg.invoiceActions && (
              <>
              <div className="mt-3 space-y-2">
                {invoices.map((inv) => {
                  const resolvedStatuses = ["Rejected", "False Positive", "Escalated", "Resolved"];
                  const isDone = resolvedStatuses.includes(inv.status) || invoiceActioned[inv.id];
                  const actionLabel = invoiceActioned[inv.id] === "reject" ? "Rejected" : invoiceActioned[inv.id] === "fp" ? "Marked as valid" : inv.status;
                  return (
                    <div key={inv.id} className="rounded-[10px] border border-border bg-white p-3 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[7px] bg-chat-primary/10 flex items-center justify-center shrink-0">
                          <FileText size={15} className="text-chat-primary" />
                        </div>
                        <div>
                          <p className="text-sap-sm font-semibold text-foreground">{inv.id}</p>
                          <p className="text-sap-sm text-muted-foreground">{inv.amount} · {inv.date}</p>
                        </div>
                      </div>
                      {isDone ? (
                        <div className="flex items-center gap-1.5 text-chat-primary text-sap-sm font-medium">
                          <CheckCircle2 size={12} />
                          {actionLabel}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 justify-end">
                          <button onClick={() => { setInvoiceActioned(p => ({ ...p, [inv.id]: "reject" })); onReject(inv.id); }} className="px-3 py-1 rounded-[6px] text-[12px] font-medium border border-destructive text-destructive bg-white hover:bg-destructive/5 transition-colors">Reject</button>
                          <button onClick={() => { setInvoiceActioned(p => ({ ...p, [inv.id]: "fp" })); onFalsePositive(inv.id); }} className="px-3 py-1 rounded-[6px] text-[12px] font-medium border border-chat-primary text-chat-primary bg-white hover:bg-chat-primary/5 transition-colors">Mark as Valid</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <InvoiceActionButtons
                invoices={invoices}
                invoiceActioned={invoiceActioned}
                quickActionClicked={quickActionClicked}
                setQuickActionClicked={setQuickActionClicked}
                onQuickAction={onQuickAction}
              />
              </>
            )}
            {msg.invoiceSelect && (
              <div className="mt-3">
                <InvoiceSelectionCard onSelect={(selected) => {
                  onSend(`__invoice_selected__${selected.join(",")}`);
                }} />
              </div>
            )}
            {msg.emailDraft && (
              <div className="mt-3">
                <EmailDraftCard onSendEmail={onSendEmail} pendingIds={msg.emailDraftIds ?? []} />
              </div>
            )}
            {msg.escalationCard && msg.escalatedInvoiceId && (
              <div className="mt-3">
                <EscalationCard invoiceId={msg.escalatedInvoiceId} />
              </div>
            )}
            {msg.checkResponse && (
              <div className="mt-3">
                <CheckResponseButton onCheck={onCheckResponse} />
              </div>
            )}
            {msg.supplierResponse && (
              <div className="mt-3">
                <SupplierResponseCard
                  selectedIds={selectedInvoiceIds}
                  onAction={onResponseAction}
                  hideActions={invoices.every(inv => !!invoiceActioned[inv.id] || ["Rejected", "False Positive", "Escalated", "Resolved"].includes(inv.status))}
                />
              </div>
            )}
            {msg.suggestions && msg.suggestions.length > 0 && !clickedSuggestions[i] && (
              <div className="flex flex-wrap gap-2 mt-3">
                {msg.suggestions.map((s, si) => (
                  <button
                    key={si}
                    onClick={() => { setClickedSuggestions(p => ({ ...p, [i]: true })); onQuickAction(s); }}
                    className="px-3.5 py-1.5 rounded-[7px] text-[12px] font-medium text-chat-primary bg-chat-primary/10 hover:bg-chat-primary/20 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4">
        <div
          className="rounded-xl border-2 border-transparent p-4"
          style={{
            background: 'linear-gradient(hsl(0 0% 100%), hsl(0 0% 100%)) padding-box, linear-gradient(to right, hsl(216,100%,65%), hsl(262,80%,65%)) border-box',
            boxShadow: '0 22px 14px rgba(0,0,0,0.06), 0 182px 111px rgba(0,0,0,0.05)',
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Message Joule or use @ to loop in an assistant"
            className="w-full bg-transparent text-sap-sm text-foreground placeholder:text-muted-foreground resize-none outline-none h-7"
            rows={1}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <button
                onClick={() => toast("Attach file", { description: "Attach a file to your message." })}
                className="text-[hsl(var(--el-purple-600))] hover:text-[hsl(var(--el-purple-600))]/80 transition-colors"
              >
                <Paperclip size={18} />
              </button>
              <button
                onClick={() => toast("Mentions", { description: "Type @ followed by a team member or assistant name." })}
                className="text-[hsl(var(--el-purple-600))] hover:text-[hsl(var(--el-purple-600))]/80 transition-colors"
              >
                <AtSign size={18} />
              </button>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[hsl(var(--el-purple-50))] text-[hsl(var(--el-purple-600))] text-sap-xs font-medium border border-[hsl(var(--el-purple-200))]">
                <SpacesIcon size={14} />
                <span>Space</span>
              </div>
            </div>
            <button onClick={handleSend} disabled={!input.trim()} className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${input.trim() ? "text-[hsl(var(--el-purple-600))] hover:bg-[hsl(var(--el-purple-50))]" : "text-muted-foreground opacity-40 cursor-not-allowed"}`}>
              <Send size={16} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">Joule uses AI. Verify results.</p>
      </div>
    </aside>
  );
};

/* ===== Main Page ===== */
const SkeletonLoader = () => (
  <div className="flex flex-1 min-w-0 overflow-hidden bg-[#f8f9fa]">
      {/* Main panel skeleton */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white z-10">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-[6px]" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-[7px]" />
              <Skeleton className="w-8 h-8 rounded-[7px]" />
            </div>
          </div>

          {/* Summary card skeleton */}
          <div className="rounded-[7px] border border-border p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-[6px]" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-24 rounded-[7px]" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>

          {/* Insights skeleton */}
          <div className="rounded-[7px] border border-border p-5 space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="rounded-[7px] border border-border p-5 space-y-3">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Chat panel skeleton */}
      <aside className="w-full md:w-[380px] shrink-0 flex flex-col bg-[#f8f9fa] overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-border">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex-1 p-5 space-y-4">
          <div className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-[6px] shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <Skeleton className="h-16 rounded-[7px]" />
        </div>
      </aside>
    </div>
);

const DuplicateInvoiceSpacePage = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<FlaggedInvoice[]>(initialInvoices);
  const [activities, setActivities] = useState(initialActivity);
  const [showInsights, setShowInsights] = useState(false);
  const [invoiceTab, setInvoiceTab] = useState<"active" | "resolved">("active");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; text: string; emailDraft?: boolean; emailDraftIds?: string[]; invoiceSelect?: boolean; escalationCard?: boolean; escalatedInvoiceId?: string; suggestions?: string[]; checkResponse?: boolean; supplierResponse?: boolean; invoiceActions?: boolean }[]>([
    { role: "bot", text: "I've opened the review space for the flagged duplicate invoices.\n\n**INV-2026-07814** is an 89% match with an existing posted invoice — same invoice number, vendor, and amount. I've auto-blocked it to prevent double payment.\n\n**INV-2026-09102** has an 86% confidence match (vendor + amount match but different invoice number). This needs your review.\n\nWhat would you like to do with each?", invoiceActions: true },
  ]);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);


  const addActivity = (action: string, invoice: string, icon: typeof Ban, color: string) => {
    setActivities(prev => [{ action, invoice, time: "Just now", icon, color }, ...prev]);
  };

  const addBotMessage = (text: string, options?: { emailDraft?: boolean; emailDraftIds?: string[]; invoiceSelect?: boolean; escalationCard?: boolean; escalatedInvoiceId?: string; suggestions?: string[]; checkResponse?: boolean; supplierResponse?: boolean }) => {
    setTimeout(() => setChatMessages(prev => [...prev, { role: "bot", text, ...options }]), 600);
  };

  const getOtherInvoiceId = (id: string) => {
    const other = invoices.find(inv => inv.id !== id);
    return other?.id || "";
  };

  const getSecondInvoiceSuggestions = (otherId: string) => [
    `Reject ${otherId}`,
    `Mark ${otherId} as False Positive`,
    `Escalate ${otherId}`,
    `Contact Meridian Frost Ltd about ${otherId}`,
  ];

  const handleReject = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: "Rejected" as InvoiceStatus } : inv));
    addActivity("Rejected as duplicate", id, XCircle, "text-destructive");
    toast.success("Invoice rejected", { description: `${id} has been rejected. Meridian Frost Ltd will be notified.` });
  };

  const handleFalsePositive = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: "False Positive" as InvoiceStatus } : inv));
    addActivity("Approved for processing", id, CheckCircle2, "text-success");
    toast.success("Invoice approved", { description: `${id} has been approved and queued for payment.` });
  };

  const handleEscalate = (id: string) => {
    const otherId = getOtherInvoiceId(id);
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: "Escalated" as InvoiceStatus } : inv));
    addActivity("Escalated to manager", id, ArrowRight, "text-warning");
    toast("Invoice escalated", { description: `${id} has been sent to the finance manager for review.` });
    addBotMessage(`${id} has been escalated to Sarah Chen (Finance Manager). She'll receive an email with the full comparison and match details.\n\nMeanwhile, **${otherId}** is still awaiting action:`, {
      escalationCard: true,
      escalatedInvoiceId: id,
      suggestions: getSecondInvoiceSuggestions(otherId),
    });
  };

  const handleChatSend = (msg: string) => {
    // Handle internal invoice selection message
    if (msg.startsWith("__invoice_selected__")) {
      const selectedIds = msg.replace("__invoice_selected__", "").split(",");
      setSelectedInvoiceIds(selectedIds);
      setChatMessages(prev => [...prev, { role: "user", text: `Contact Meridian Frost Ltd about ${selectedIds.join(" and ")}` }]);
      addBotMessage(`I've drafted an email to Meridian Frost Ltd's AP contact regarding ${selectedIds.join(" and ")}. Here's the draft:`, { emailDraft: true, emailDraftIds: selectedIds });
      return;
    }
    setChatMessages(prev => [...prev, { role: "user", text: msg }]);
    if (msg.toLowerCase().includes("history") || msg.toLowerCase().includes("payment")) {
      addBotMessage("Meridian Frost Ltd has 134 invoices on record. Last payment was $61,520.00 on Aug 3, 2026. Average monthly spend: $87,400. No previous duplicate invoices were detected before this quarter.", { suggestions: ["Contact Meridian Frost Ltd"] });
    } else if (msg.toLowerCase().includes("contact") || msg.toLowerCase().includes("acme")) {
      const resolvedStatuses = ["Rejected", "False Positive", "Escalated", "Resolved"];
      const unresolvedInvoices = invoices.filter(inv => !["Rejected", "False Positive", "Escalated", "Resolved", "Email Sent"].includes(inv.status));
      const allResolved = invoices.every(inv => resolvedStatuses.includes(inv.status));
      if (allResolved) {
        // Both already actioned — go straight to email, no selection needed
        const allIds = invoices.map(inv => inv.id);
        setSelectedInvoiceIds(allIds);
        addBotMessage("I've drafted an email to Meridian Frost Ltd's AP contact to inform them of the resolution. Here's the draft:", { emailDraft: true, emailDraftIds: allIds });
      } else if (unresolvedInvoices.length <= 1) {
        const targetIds = unresolvedInvoices.length === 1 ? [unresolvedInvoices[0].id] : invoices.map(inv => inv.id);
        setSelectedInvoiceIds(targetIds);
        addBotMessage(`I've drafted an email to Meridian Frost Ltd's AP contact regarding ${targetIds.join(" and ")}. Here's the draft:`, { emailDraft: true, emailDraftIds: targetIds });
      } else {
        addBotMessage("Sure! Which invoice(s) would you like to contact Meridian Frost Ltd about? Please select below:", { invoiceSelect: true });
      }
    } else if (msg.toLowerCase().includes("review") || msg.toLowerCase().includes("519")) {
      addBotMessage("INV-2026-09102 (Nov 21, 2026, PO-2026-HI-00819, $47,890.00) references similar line items to INV-2026-07814 but under a different PO. This could be a legitimate separate order or an inadvertent resubmission. I recommend verifying the PO reference before deciding.");
    } else {
      addBotMessage("I understand. Let me look into that for you. Is there anything specific about the flagged invoices you'd like me to analyze?");
    }
  };

  const handleQuickAction = (action: string) => {
    // Handle suggestion actions that map to card actions
    const rejectMatch = action.match(/^Reject (INV-[\d-]+)$/);
    const fpMatch = action.match(/^Mark (INV-[\d-]+) as False Positive$/);
    const escalateMatch = action.match(/^Escalate (INV-[\d-]+)$/);
    
    if (rejectMatch) {
      setChatMessages(prev => [...prev, { role: "user", text: action }]);
      handleReject(rejectMatch[1]);
      return;
    }
    if (fpMatch) {
      setChatMessages(prev => [...prev, { role: "user", text: action }]);
      handleFalsePositive(fpMatch[1]);
      return;
    }
    if (escalateMatch) {
      setChatMessages(prev => [...prev, { role: "user", text: action }]);
      handleEscalate(escalateMatch[1]);
      return;
    }
    handleChatSend(action);
  };

  if (loading) return <SkeletonLoader />;

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden bg-[#f8f9fa]">
        {/* Focus Pane */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white shadow-[4px_0_12px_rgba(29,33,50,0.08)] z-10 border-r border-border animate-[fade-in-up_0.5s_ease-out_both]" style={{ animationDelay: '0ms' }}>
          <SpaceHeader onInsights={() => setShowInsights(!showInsights)} showInsights={showInsights} />
          <div className="flex-1 overflow-y-auto">
            {showInsights && <InsightsPanel onClose={() => setShowInsights(false)} />}
            <SummaryStats invoices={invoices} />

            {/* Flagged Invoices */}
            <div className="mx-6" style={{ marginTop: '42px' }}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sap-base font-semibold text-foreground">Invoices</h2>
                <button className="text-primary hover:text-primary/80"><MoreHorizontal size={16} /></button>
              </div>
              {/* Tabs */}
              <div className="flex items-center gap-1 mb-4">
                {(() => {
                  const activeInvs = invoices.filter(i => !["Rejected", "False Positive", "Escalated", "Resolved"].includes(i.status));
                  const resolvedInvs = invoices.filter(i => ["Rejected", "False Positive", "Escalated", "Resolved"].includes(i.status));
                  return (
                    <>
                      <button
                        onClick={() => setInvoiceTab("active")}
                        className={`px-3.5 py-1.5 rounded-[7px] text-sap-xs font-medium border transition-colors ${invoiceTab === "active" ? "bg-chat-primary/10 text-chat-primary border-chat-border" : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"}`}
                      >
                        Flagged ({activeInvs.length})
                      </button>
                      <button
                        onClick={() => setInvoiceTab("resolved")}
                        className={`px-3.5 py-1.5 rounded-[7px] text-sap-xs font-medium border transition-colors ${invoiceTab === "resolved" ? "bg-chat-primary/10 text-chat-primary border-chat-border" : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"}`}
                      >
                        Resolved ({resolvedInvs.length})
                      </button>
                    </>
                  );
                })()}
              </div>
              <div className="space-y-6">
                {(() => {
                  const resolvedStatuses = ["Rejected", "False Positive", "Escalated", "Resolved"];
                  const filtered = invoiceTab === "active"
                    ? invoices.filter(i => !resolvedStatuses.includes(i.status))
                    : invoices.filter(i => resolvedStatuses.includes(i.status));
                  if (filtered.length === 0) {
                    return (
                      <div className="rounded-[7px] bg-secondary/30 border border-border/40 px-6 py-8 text-center">
                        <p className="text-sap-sm text-muted-foreground">
                          {invoiceTab === "active" ? "No flagged invoices remaining." : "No resolved invoices yet."}
                        </p>
                      </div>
                    );
                  }
                  return filtered.map((inv, i) => (
                    <div key={inv.id} className="animate-[fade-in-up_0.4s_ease-out_both]" style={{ animationDelay: `${i * 80}ms` }}>
                      <FlaggedInvoiceCard
                        invoice={inv}
                        onReject={handleReject}
                        onFalsePositive={handleFalsePositive}
                        onEscalate={handleEscalate}
                        defaultCollapsed={invoiceTab === "resolved"}
                      />
                    </div>
                  ));
                })()}
              </div>
            </div>

            <ActivityFeed activities={activities} />
            <GovernanceRules />
          </div>
        </div>

        {/* Chat Panel */}
        <SpaceChatPanel
          chatMessages={chatMessages}
          onSend={handleChatSend}
          onQuickAction={handleQuickAction}
          selectedInvoiceIds={selectedInvoiceIds}
          onSendEmail={() => {
            setInvoices(prev => prev.map(inv => selectedInvoiceIds.includes(inv.id) ? { ...inv, status: "Email Sent" as InvoiceStatus } : inv));
            addActivity("Email sent to vendor", selectedInvoiceIds.join(", "), Mail, "text-chat-primary");
            addBotMessage("Email sent successfully! I'll monitor for Meridian Frost Ltd's reply. You can check for a response anytime:", { checkResponse: true });
          }}
          onCheckResponse={() => {
            // Update invoice statuses to "Response Received"
            setInvoices(prev => prev.map(inv =>
              selectedInvoiceIds.includes(inv.id) && inv.status === "Email Sent"
                ? { ...inv, status: "Response Received" as InvoiceStatus }
                : inv
            ));
            addActivity("Response received", "Meridian Frost Ltd", Inbox, "text-success");
            const resolvedStatuses = ["Rejected", "False Positive", "Escalated", "Resolved"];
            const allAlreadyActioned = invoices.every(inv => resolvedStatuses.includes(inv.status));
            if (allAlreadyActioned) {
              addBotMessage("Meridian Frost Ltd has responded! They confirmed that INV-2026-09102 was submitted in error and INV-2026-07814 is the correct invoice. No further action needed as both invoices have already been resolved.");
            } else {
              addBotMessage("Meridian Frost Ltd has responded! They confirmed that **INV-2026-09102** was submitted in error and should be rejected, while **INV-2026-07814** is the correct invoice.\n\nHere's the full response and recommended actions:", { supplierResponse: true });
            }
          }}
          onResponseAction={(action, invoiceId) => {
            if (action === "approve") {
              setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: "Resolved" as InvoiceStatus } : inv));
              addActivity("Approved for processing", invoiceId, CheckCircle2, "text-success");
              toast.success("Invoice approved", { description: `${invoiceId} has been approved and released for processing.` });
              addBotMessage(`✅ **${invoiceId}** has been approved and released for standard processing based on Meridian Frost Ltd's confirmation.`);
            } else if (action === "reject") {
              setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: "Rejected" as InvoiceStatus } : inv));
              addActivity("Rejected per supplier", invoiceId, XCircle, "text-destructive");
              toast.success("Invoice rejected", { description: `${invoiceId} has been rejected per supplier confirmation.` });
              addBotMessage(`❌ **${invoiceId}** has been rejected as confirmed duplicate by Meridian Frost Ltd. The vendor has been notified.`);
            }
          }}
          invoices={invoices}
          onReject={handleReject}
          onFalsePositive={handleFalsePositive}
          onEscalate={handleEscalate}
        />
      </div>
  );
};

export default DuplicateInvoiceSpacePage;
