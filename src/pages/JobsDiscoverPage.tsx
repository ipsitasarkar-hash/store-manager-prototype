import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Search, SlidersHorizontal, Plus, List, ChevronDown } from "lucide-react";
// IconSidebar now in SidebarLayout
import JobsDashboardView from "@/components/invoicing/JobsDashboardView";
import aiIcon from "@/assets/ai-icon.png";
import shareIcon from "@/assets/share-icon.png";

type JobTag = { label: string; variant: "primary" | "default" };
type JobCard = {
  id?: string;
  tags: JobTag[];
  title: string;
  description: string;
  metrics: { label: string; value: string }[];
};

const recommendedJobs: JobCard[] = [
  {
    tags: [{ label: "Finance", variant: "primary" }, { label: "Event Triggered", variant: "default" }],
    title: "Control Vendor Bank Detail Changes",
    description: "Detect changes to vendor bank details and enforce approval before payments are executed.",
    metrics: [{ label: "Scope", value: "EU vendors" }, { label: "Adoption", value: "Active for 12 teams" }],
  },
  {
    tags: [{ label: "Finance", variant: "primary" }, { label: "Scheduled", variant: "default" }],
    title: "Weekly Gross Margin Deviation Review",
    description: "Review gross margin deviations above 5% across business units and suggest corrective actions.",
    metrics: [{ label: "Scope", value: "EU sales entities" }, { label: "Adoption", value: "Active for 34 teams" }],
  },
  {
    tags: [{ label: "Finance", variant: "primary" }, { label: "Standing Monitoring", variant: "default" }],
    title: "Failed Payment Monitoring",
    description: "Continuously monitor failed or blocked payments and propose resolution steps.",
    metrics: [{ label: "Scope", value: "Accounts Payable" }, { label: "Adoption", value: "Active for 34 teams" }],
  },
];

const popularJobs: JobCard[] = [
  {
    id: "validate-duplicate",
    tags: [{ label: "Finance", variant: "primary" }, { label: "Event Triggered", variant: "default" }],
    title: "Validate Duplicate Vendor Invoices",
    description: "Detect potential duplicate invoices before payment and route suspicious cases for review.",
    metrics: [{ label: "Scope", value: "Accounts Payable" }, { label: "Success Rate", value: "98.7%" }],
  },
  {
    tags: [{ label: "Finance", variant: "primary" }, { label: "Standing Monitoring", variant: "default" }],
    title: "Monitor Payment Run Readiness",
    description: "Continuously check upcoming payment runs for blocking issues and alert when intervention is required.",
    metrics: [{ label: "Scope", value: "Company codes in EU" }, { label: "Success Rate", value: "98.2%" }],
  },
  {
    tags: [{ label: "Finance", variant: "primary" }, { label: "Scheduled", variant: "default" }],
    title: "Reconcile Bank Statement Variances",
    description: "Analyze mismatches between bank statements and ledger entries and prepare reconciliation suggestions.",
    metrics: [{ label: "Scope", value: "Corporate bank accounts" }, { label: "Success Rate", value: "97.4%" }],
  },
  {
    tags: [{ label: "Finance", variant: "primary" }, { label: "Event Triggered", variant: "default" }],
    title: "Investigate Invoice Approval Delays",
    description: "Detect changes to vendor bank details and enforce approval before payments are executed.",
    metrics: [{ label: "Scope", value: "EU vendors" }, { label: "Adoption", value: "Active for 12 teams" }],
  },
  {
    tags: [{ label: "Finance", variant: "primary" }, { label: "Standing Monitoring", variant: "default" }],
    title: "Monitor Vendor Payment Failures",
    description: "Review gross margin deviations above 5% across business units and suggest corrective actions.",
    metrics: [{ label: "Scope", value: "EU sales entities" }, { label: "Adoption", value: "Active for 34 teams" }],
  },
  {
    tags: [{ label: "Finance", variant: "primary" }, { label: "Event Triggered", variant: "default" }],
    title: "Review Unusual Payment Amounts",
    description: "Continuously monitor failed or blocked payments and propose resolution steps.",
    metrics: [{ label: "Scope", value: "Accounts Payable" }, { label: "Adoption", value: "Active for 34 teams" }],
  },
];

const filterChips = ["Most Used", "Fastest Growing", "Highest Success Rate"];

const TagBadge = ({ tag }: { tag: JobTag }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-sap-xs font-medium ${
      tag.variant === "primary"
        ? "bg-primary/10 text-primary"
        : "bg-secondary text-foreground border border-border"
    }`}
  >
    {tag.label}
  </span>
);

const JobCardComponent = ({ job, onCreateJob }: { job: JobCard; onCreateJob?: () => void }) => {
  const [creating, setCreating] = useState(false);

  const handleCreate = useCallback(() => {
    if (!onCreateJob || creating) return;
    setCreating(true);
    setTimeout(() => {
      toast.success("Job created successfully", {
        description: `"${job.title}" is now ready to run.`,
      });
      onCreateJob();
    }, 2000);
  }, [onCreateJob, creating, job.title]);

  return (
    <div className="bg-card rounded-[24px] border border-border/60 p-5 flex flex-col justify-between shadow-[0_2px_12px_rgba(29,33,50,0.06)] hover:shadow-[0_4px_20px_rgba(29,33,50,0.10)] transition-shadow min-h-[250px]">
      <div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {job.tags.map((tag, i) => (
            <TagBadge key={i} tag={tag} />
          ))}
        </div>
        <h3 className="text-sap-base font-bold text-foreground mb-1.5">{job.title}</h3>
        <p className="text-sap-xs text-muted-foreground leading-relaxed">{job.description}</p>
        <div className="flex gap-10 mt-4">
          {job.metrics.map((m, i) => (
            <div key={i}>
              <p className="text-sap-xs font-semibold text-foreground">{m.label}</p>
              <p className="text-sap-xs text-muted-foreground mt-0.5">{m.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 mt-4 pt-3 pb-1 -mx-5 -mb-5 px-5 rounded-b-[24px] bg-[hsl(240,60%,97%)]">
        <button className="text-sap-xs font-semibold text-chat-primary hover:underline">View Details</button>
        <button
          onClick={handleCreate}
          disabled={creating}
          className={`inline-flex items-center gap-1.5 px-4 py-2 my-3 rounded-sm text-chat-primary-foreground text-sap-xs font-semibold transition-colors ${creating ? "bg-chat-primary/70 cursor-wait" : "bg-chat-primary hover:bg-chat-primary/90"}`}
        >
          {creating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Creating…
            </>
          ) : (
            <>
              <img src={aiIcon} alt="" className="w-4 h-4" />
              Create Job
            </>
          )}
        </button>
        <button className="hover:opacity-70 transition-opacity">
          <img src={shareIcon} alt="Share" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const JobsDiscoverPage = () => {
  const [activeFilter, setActiveFilter] = useState("Most Used");
  const [view, setView] = useState<"discover" | "dashboard">("discover");

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden bg-[hsl(var(--el-neutral-50-alt))]">
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden relative border border-[hsl(var(--el-neutral-200))] bg-white overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <button className="w-8 h-8 flex items-center justify-center rounded text-foreground/70 hover:bg-secondary transition-colors">
                <List size={18} />
              </button>
              <div className="flex items-center gap-1">
                <h1 className="text-sap-sm font-semibold text-foreground">
                  {view === "discover" ? "Discover Jobs" : "Jobs Dashboard"}
                </h1>
                <ChevronDown size={14} className="text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button className="w-8 h-8 flex items-center justify-center rounded text-foreground/70 hover:bg-secondary transition-colors">
                <Search size={18} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded text-foreground/70 hover:bg-secondary transition-colors">
                <SlidersHorizontal size={18} />
              </button>
              {view === "dashboard" && (
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-chat-primary text-chat-primary-foreground text-sap-xs font-semibold hover:bg-chat-primary/90 transition-colors">
                  <Plus size={14} />
                  New
                </button>
              )}
            </div>
          </div>

          {view === "discover" ? (
            <>
              {/* Recommended for You */}
              <div className="px-5 pt-4 pb-[50px]">
                <h2 className="text-sap-base font-medium text-foreground mb-5">Recommended for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedJobs.map((job, i) => (
                    <JobCardComponent key={i} job={job} />
                  ))}
                </div>
              </div>

              {/* Popular Jobs */}
              <div className="px-5 pb-10">
                <div className="flex items-center gap-4 mb-5 flex-wrap">
                  <h2 className="text-sap-base font-medium text-foreground">Popular Jobs</h2>
                  <div className="flex gap-2">
                    {filterChips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => setActiveFilter(chip)}
                        className={`px-3.5 py-1.5 rounded-full text-sap-xs font-medium border transition-colors ${
                          activeFilter === chip
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-card text-muted-foreground border-border hover:border-primary/20 hover:text-foreground"
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularJobs.map((job, i) => (
                    <JobCardComponent
                      key={i}
                      job={job}
                      onCreateJob={job.id === "validate-duplicate" ? () => setView("dashboard") : undefined}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <JobsDashboardView />
          )}
      </div>
    </div>
  );
};

export default JobsDiscoverPage;
