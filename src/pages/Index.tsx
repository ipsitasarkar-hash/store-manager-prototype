// Invoice dashboard page
import { useState, useEffect, useRef, KeyboardEvent, useCallback, ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// IconSidebar now in SidebarLayout
import InvoiceHeader from "@/components/invoicing/InvoiceHeader";
import SummaryCard from "@/components/invoicing/SummaryCard";
import InsightsSection from "@/components/invoicing/InsightsSection";
import DetailedAnalysis from "@/components/invoicing/DetailedAnalysis";
import ChatPanel from "@/components/invoicing/ChatPanel";
import JobDetailPanel from "@/components/invoicing/JobDetailPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Link2, Plus, AtSign, X, Send, Clock, Paperclip, Search, FlaskConical, Code2, Layers, GitFork } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import spaceIcon from "@/assets/space-icon.png";

const AUTOCOMPLETE_SUGGESTION = "Submit the Invoice and overwrite price variance limit for future invoices for this supplier";

const SkeletonContent = () => (
  <div className="flex-1 overflow-y-auto p-6 space-y-6">
    {/* Header skeleton */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>

    {/* Summary card skeleton */}
    <div className="rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-24 rounded-md" />
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
    <div className="rounded-2xl border border-border p-5 space-y-4">
      <Skeleton className="h-5 w-32" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>

    {/* Table skeleton */}
    <div className="rounded-2xl border border-border p-5 space-y-3">
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
);

const BudgetBaselineCard = ({ onClick, jobActivated, jobLoading }: { onClick?: () => void; jobActivated?: boolean; jobLoading?: boolean }) => {
  if (jobActivated) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 animate-[fade-in-up_0.4s_ease-out_both]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[hsl(var(--el-purple-50))] flex items-center justify-center shrink-0 mt-0.5">
            <GitFork size={14} className="text-[hsl(var(--el-purple-600))]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sap-sm font-semibold text-foreground">Monitor and Update Price Tolerance</p>
            <p className="text-sap-xs text-muted-foreground mt-0.5">
              {jobLoading ? "Starting job…" : "Running · Weekly · Mondays 08:00 CET"}
            </p>
            <div className="mt-2">
              {jobLoading ? (
                <div className="w-full bg-[hsl(var(--el-neutral-100))] rounded-full h-1 overflow-hidden">
                  <div
                    className="h-1 rounded-full"
                    style={{ background: 'linear-gradient(90deg, hsl(262,80%,65%) 0%, hsl(216,100%,60%) 100%)', width: '0%', transition: 'width 2.5s ease-in-out' }}
                    ref={(el) => { if (el) requestAnimationFrame(() => { el.style.width = "100%"; }); }}
                  />
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[hsl(var(--el-purple-50))] border border-[hsl(var(--el-purple-200))] text-[hsl(var(--el-purple-600))] text-sap-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--el-purple-600))] animate-pulse" />
                  Running
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="rounded-xl border border-border/50 bg-card p-4 shadow-[0_2px_8px_rgba(29,33,50,0.08)] cursor-pointer hover:shadow-[0_4px_16px_rgba(29,33,50,0.12)] hover:border-primary/30 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sap-sm font-medium text-foreground">Monitor and Update Price Tolerance</p>
          <p className="text-sap-sm text-muted-foreground mt-1.5">
            <span className="text-primary font-medium">Last Update:</span> Draft in progress
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-sap-sm text-muted-foreground whitespace-nowrap shrink-0">
          <Clock size={13} />
          Awaiting Activation
        </div>
      </div>
    </div>
  );
};

const SubmitResponseContent = ({ action, rejectionReason, invoiceNumber }: { action: "approve" | "reject" | null; rejectionReason: string; invoiceNumber: string }) => (
  <div className="mt-6 space-y-3 text-sap-base text-foreground leading-relaxed">
    {action === "reject" ? (
      <>
        <p>I've rejected <span className="font-medium">{invoiceNumber}</span> and sent the following email to Meridian Frost Ltd:</p>
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30 space-y-1">
            <div className="flex gap-2 text-sap-xs">
              <span className="text-muted-foreground w-6 shrink-0">To</span>
              <span className="text-foreground font-medium">procurement@meridianfrost.com</span>
            </div>
            <div className="flex gap-2 text-sap-xs">
              <span className="text-muted-foreground w-6 shrink-0">Re</span>
              <span className="text-foreground">Invoice Rejection — {invoiceNumber}</span>
            </div>
          </div>
          <div className="px-4 py-3 text-sap-xs text-foreground space-y-2 leading-relaxed">
            <p>Dear Meridian Frost Ltd,</p>
            <p>We regret to inform you that invoice <span className="font-medium">{invoiceNumber}</span> (PO-2026-HI-00731) has been rejected for the following reason:</p>
            <p className="px-3 py-2 rounded-md bg-muted/50 border border-border font-medium">{rejectionReason}</p>
            <p>Please resubmit a corrected invoice at your earliest convenience.</p>
          </div>
        </div>
      </>
    ) : (
      <>
        <p><span className="font-medium">{invoiceNumber}</span> has been approved and is now processing for payment.</p>
        <p className="text-muted-foreground">You'll be notified once it clears the approval queue.</p>
      </>
    )}
  </div>
);

const ContinuedChatPanel = ({ fileName, onJobDetailOpen, jobActivated, onSubmitInvoice, onRejectInvoice }: { fileName: string; onJobDetailOpen?: () => void; jobActivated?: boolean; onSubmitInvoice?: () => void; onRejectInvoice?: () => void }) => {
  const invoiceNumber = "INV-2026-03847";
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedAction, setSubmittedAction] = useState<"approve" | "reject" | null>(null);
  const [showRejectionReasons, setShowRejectionReasons] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [followUpQuery, setFollowUpQuery] = useState("");
  const [showDuplicateResponse, setShowDuplicateResponse] = useState(false);
  const [showDuplicateSpace, setShowDuplicateSpace] = useState(false);
  const [showViewSpace, setShowViewSpace] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [jobLoading, setJobLoading] = useState(false);
  const [showJobMessage, setShowJobMessage] = useState(false);
  const [createJobClicked, setCreateJobClicked] = useState(false);
  const [showJobCard, setShowJobCard] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [followUpActionClicked, setFollowUpActionClicked] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const TRIGGER_PREFIX = "submit the";
  const autocompleteSuggestion = AUTOCOMPLETE_SUGGESTION;
  const normalizedInput = inputValue.trimStart().toLowerCase();
  const showGhost = !submitted && normalizedInput.length >= TRIGGER_PREFIX.length && autocompleteSuggestion.toLowerCase().startsWith(normalizedInput) && inputValue.length < autocompleteSuggestion.length;

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (jobActivated) {
      setJobLoading(true);
      const t = setTimeout(() => {
        setJobLoading(false);
        setTimeout(() => setShowJobMessage(true), 300);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [jobActivated]);

  useEffect(() => {
    scrollToBottom();
  }, [submitted, showResponse, jobActivated, jobLoading, showJobMessage, showJobCard, showRejectionReasons, followUpQuery, showDuplicateResponse, showDuplicateSpace, scrollToBottom]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && showGhost) {
      e.preventDefault();
      setInputValue(autocompleteSuggestion);
    }
    if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isSupplierQuery = (text: string) => {
    const lower = text.toLowerCase();
    return lower.includes("supplier") || lower.includes("invoice") || lower.includes("meridian") || lower.includes("other") || lower.includes("duplicate") || lower.includes("more");
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    const query = inputValue.trim();
    setInputValue("");

    // Follow-up after approve or reject
    if (showResponse && (submittedAction === "reject" || submittedAction === "approve") && isSupplierQuery(query)) {
      setFollowUpQuery(query);
      setTimeout(() => {
        setShowDuplicateResponse(true);
        setTimeout(scrollToBottom, 50);
      }, 2000);
      return;
    }

    if (submitted) return;
    setSubmitted(true);
    setTimeout(() => {
      setShowResponse(true);
      setTimeout(scrollToBottom, 50);
    }, 2000);
  };

  return (
    <aside className="w-full md:w-[360px] lg:w-[420px] bg-[#F5F6F7] flex flex-col shrink-0 border-l border-border min-h-0 max-h-[50vh] md:max-h-none shadow-[inset_6px_0_12px_-6px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 md:py-6 shadow-[0_2px_6px_rgba(29,33,50,0.06)] shrink-0 relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={16} className="text-foreground shrink-0" />
          <h2 className="text-sap-sm font-semibold text-foreground truncate">Create Invoice</h2>
        </div>
        <button className="w-7 h-7 rounded-[6px] bg-[hsl(var(--el-purple-100))] flex items-center justify-center text-[hsl(var(--el-purple-600))] hover:bg-[hsl(var(--el-purple-200))] transition-colors shrink-0">
          <Plus size={18} />
        </button>
      </div>

      {/* Chat content */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 pt-4 md:pt-6 pb-6 space-y-8 min-h-0">
        {/* Previous conversation: user request */}
        <div className="flex justify-end">
          <div className="bg-[#E6E7EA] text-foreground px-4 py-2.5 rounded-2xl rounded-br-[2px] text-sap-base max-w-[80%]">
            Create invoice for {fileName}
          </div>
        </div>

        {/* File upload card */}
        <div className="flex justify-end">
          <div className="rounded-xl border border-border bg-card p-3 max-w-[80%] w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[hsl(var(--el-purple-50))] flex items-center justify-center shrink-0">
                <FileText size={14} className="text-[hsl(var(--el-purple-600))]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sap-sm font-semibold text-foreground truncate">{fileName}</p>
                <p className="text-sap-xs text-muted-foreground">File type: pdf • Uploaded</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI: invoice created */}
        <div className="text-sap-base text-foreground leading-relaxed">
          I have created the invoice for you:
        </div>

        {/* Compact invoice summary card */}
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[hsl(var(--el-purple-50))] flex items-center justify-center shrink-0">
              <FileText size={13} className="text-[hsl(var(--el-purple-600))]" />
            </div>
            <span className="text-sap-base font-bold text-foreground truncate">{invoiceNumber}</span>
            <span className="px-2 py-0.5 rounded-md bg-label-accent/15 text-label-accent text-sap-xs font-semibold shrink-0">Price Mismatch</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sap-sm">
            <div><span className="text-muted-foreground">Sold-to:</span> <span className="font-medium text-foreground">Meridian Frost Ltd</span></div>
            <div><span className="text-muted-foreground">Net Value:</span> <span className="font-medium text-foreground">83,240.00 USD</span></div>
            <div><span className="text-muted-foreground">Ship-to:</span> <span className="font-medium text-foreground">Meridian Frost Ltd</span></div>
            <div><span className="text-muted-foreground">Ref:</span> <span className="font-medium text-foreground">PO-2026-HI-00731</span></div>
          </div>
        </div>

        {/* AI: price mismatch analysis */}
        <div className="text-sap-base text-foreground leading-relaxed space-y-2">
          <p>I noticed this invoice has a price mismatch issue:</p>
          <p><span className="font-medium">Line 1:</span> High-Tensile Steel Bolts M12 x 80mm (Box of 500)<br /><span className="font-medium">Line 2:</span> Hydraulic Seal Kit — Type HK-440 Industrial</p>
          <p>Price Discrepancy is <span className="font-medium">2.2%</span> (Line 1) and <span className="font-medium">2.5%</span> (Line 2), both exceeding the allowed <span className="font-medium">2%</span> limit. Released 5 times in last 12 months.</p>
          <p>Do you want me to submit the invoice or create a space to manually resolve this?</p>
        </div>

        {/* User: Create Space */}
        <div className="flex justify-end">
          <div className="bg-[#E6E7EA] text-foreground px-4 py-2.5 rounded-2xl rounded-br-[2px] text-sap-base max-w-[80%]">
            Create Space
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-sap-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          <span className="whitespace-nowrap">Space Mode is active</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Bot response + space card + buttons grouped tightly */}
        <div className="space-y-4">
          <div className="text-sap-base text-foreground leading-relaxed">
            <p>I've opened the Space for you. Here you can review all the invoice details, line items, and resolve the price mismatch.</p>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-md bg-white border border-border">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <img src={spaceIcon} alt="Space" className="w-8 h-8 object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sap-base font-semibold text-foreground">New Space created</p>
              <p className="text-sap-sm text-muted-foreground truncate">A Space was created for {invoiceNumber}</p>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-sap-sm text-muted-foreground">
                <span>Supplier: Meridian Frost Ltd</span>
                <span>Amount: $83,240</span>
              </div>
            </div>
          </div>

          {!submitted && !createJobClicked && !showRejectionReasons && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowRejectionReasons(true);
                  setTimeout(scrollToBottom, 50);
                }}
                className="px-3.5 py-1.5 rounded-[7px] text-[12px] font-medium bg-chat-primary/10 text-chat-primary hover:bg-chat-primary/20 transition-colors"
              >
                Reject Invoice
              </button>
              <button
                onClick={() => {
                  setSubmitted(true);
                  setSubmittedAction("approve");
                  setTimeout(() => {
                    setShowResponse(true);
                    onSubmitInvoice?.();
                    setTimeout(scrollToBottom, 50);
                  }, 2000);
                }}
                className="px-3.5 py-1.5 rounded-[7px] text-[12px] font-medium bg-chat-primary/10 text-chat-primary hover:bg-chat-primary/20 transition-colors"
              >
                Approve Invoice
              </button>
            </div>
          )}

          {showRejectionReasons && !submitted && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <p className="text-sap-sm font-medium text-foreground">Select a rejection reason:</p>
              <div className="space-y-2">
                {[
                  "Price does not match PO terms",
                  "Duplicate invoice submission",
                  "Missing supporting documentation",
                  "Goods not received",
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setRejectionReason(reason)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-sap-xs transition-colors ${rejectionReason === reason ? "border-chat-primary bg-chat-primary/10 text-chat-primary font-medium" : "border-border text-foreground hover:bg-muted/50"}`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setShowRejectionReasons(false); setRejectionReason(""); }}
                  className="px-3.5 py-1.5 rounded-[7px] text-sap-xs font-medium border border-border text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!rejectionReason}
                  onClick={() => {
                    setSubmitted(true);
                    setSubmittedAction("reject");
                    setShowRejectionReasons(false);
                    onRejectInvoice?.();
                    setTimeout(() => {
                      setShowResponse(true);
                      setTimeout(scrollToBottom, 50);
                    }, 2000);
                  }}
                  className={`px-3.5 py-1.5 rounded-[7px] text-[12px] font-medium transition-colors ${rejectionReason ? "bg-chat-primary/10 text-chat-primary hover:bg-chat-primary/20 cursor-pointer" : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"}`}
                >
                  Send Rejection Email
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Job user message */}
        {createJobClicked && (
          <div className="flex justify-end">
            <div className="bg-[#E6E7EA] text-foreground px-4 py-2.5 rounded-2xl rounded-br-[2px] text-sap-base max-w-[80%]">
              Create Job
            </div>
          </div>
        )}

        {/* Create Job loading dots */}
        {createJobClicked && !showJobCard && (
          <div className="flex items-center gap-1.5 py-2">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--el-purple-600))]/40 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--el-purple-600))]/40 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--el-purple-600))]/40 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {/* Job card after Create Job */}
        {showJobCard && (
          <div className="space-y-4">
            <div className="text-sap-base text-foreground leading-relaxed">
              <p>I've set up a job for you. Once activated, it will monitor price tolerances and automatically approve future invoices from this supplier within the configured variance limits.</p>
            </div>
            {jobActivated ? (
              <BudgetBaselineCard jobActivated={jobActivated} jobLoading={jobLoading} />
            ) : (
              <div className="animate-[fade-in-up_0.4s_ease-out_both]">
                <BudgetBaselineCard onClick={() => onJobDetailOpen?.()} />
              </div>
            )}
            {jobActivated && (
              <div className="flex justify-end">
                <div className="bg-[#E6E7EA] text-foreground px-4 py-2.5 rounded-2xl rounded-br-[2px] text-sap-base max-w-[80%]">
                  Activate Job
                </div>
              </div>
            )}
          </div>
        )}

        {/* Post-job message (Create Job flow) */}
        {showJobCard && showJobMessage && (
          <div className="text-sap-base text-foreground leading-relaxed space-y-2 animate-[fade-in-up_0.4s_ease-out_both]">
            <p><span className="font-medium">{invoiceNumber}</span> has been submitted and approved — the price variance has been resolved and the invoice is now processing.</p>
            <p>The <span className="font-medium">Monitor and Update Price Tolerance</span> job is now active and will automatically adjust tolerance limits for future invoices from this supplier, so similar variances won't require manual review going forward.</p>
          </div>
        )}

        {/* Submitted user message */}
        {submitted && (
          <div className="flex justify-end mt-6">
            <div className="bg-[#E6E7EA] text-foreground px-4 py-2.5 rounded-2xl rounded-br-[2px] text-sap-base max-w-[80%]">
              {submittedAction === "reject" ? "Reject Invoice" : "Approve Invoice"}
            </div>
          </div>
        )}

        {/* Loading animation */}
        {submitted && !showResponse && (
          <div className="flex items-center gap-1.5 py-2">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--el-purple-600))]/40 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--el-purple-600))]/40 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--el-purple-600))]/40 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {/* Response card */}
        {showResponse && <SubmitResponseContent action={submittedAction} rejectionReason={rejectionReason} invoiceNumber={invoiceNumber} />}

        {showResponse && (submittedAction === "reject" || submittedAction === "approve") && (
          <div>
            <div className="text-sap-base text-foreground">
              Is there anything else I can help you with?
            </div>
            {!followUpActionClicked && (
              <div className="flex flex-wrap gap-2 mt-[15px]">
                <button
                  className="px-3.5 py-1.5 rounded-[7px] text-[12px] font-medium text-chat-primary bg-chat-primary/10 hover:bg-chat-primary/20 transition-colors"
                >Upload Invoice</button>
                <button
                  onClick={() => {
                    setFollowUpActionClicked("exceptions");
                    setFollowUpQuery("Find more exceptions");
                    setTimeout(() => {
                      setShowDuplicateResponse(true);
                      setTimeout(scrollToBottom, 50);
                    }, 2000);
                  }}
                  className="px-3.5 py-1.5 rounded-[7px] text-[12px] font-medium text-chat-primary bg-chat-primary/10 hover:bg-chat-primary/20 transition-colors"
                >Find More Exceptions</button>
              </div>
            )}
          </div>
        )}

        {/* Follow-up: supplier query */}
        {followUpQuery && (
          <div className="flex justify-end">
            <div className="bg-[#E6E7EA] text-foreground px-4 py-2.5 rounded-2xl rounded-br-[2px] text-sap-base max-w-[80%]">
              {followUpQuery}
            </div>
          </div>
        )}

        {followUpQuery && !showDuplicateResponse && (
          <div className="flex items-center gap-1.5 py-2">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--el-purple-600))]/40 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--el-purple-600))]/40 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--el-purple-600))]/40 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {showDuplicateResponse && (
          <div className="space-y-4 animate-[fade-in-up_0.4s_ease-out_both]">
            <div className="text-sap-base text-foreground leading-relaxed space-y-3">
              <p>Yes, I found <span className="font-medium">2 duplicate invoices</span> from Meridian Frost Ltd in the system:</p>

              {/* Duplicate 1 */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
                  <span className="text-sap-xs font-semibold text-foreground">INV-2026-07814</span>
                  <span className="px-1.5 py-0.5 rounded-[3px] bg-warning/10 text-warning text-[10px] font-medium">Pending</span>
                </div>
                <div className="px-3 py-2.5 space-y-1.5 text-sap-xs">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div><span className="text-muted-foreground">Supplier:</span> <span className="font-medium text-foreground">Meridian Frost Ltd</span></div>
                    <div><span className="text-muted-foreground">Date:</span> <span className="font-medium text-foreground">Aug 3, 2026</span></div>
                    <div><span className="text-muted-foreground">PO Ref:</span> <span className="font-medium text-foreground">PO-2026-HI-00688</span></div>
                    <div><span className="text-muted-foreground">Total:</span> <span className="font-medium text-foreground">$61,520.00</span></div>
                  </div>
                  <div className="border-t border-border pt-1.5 space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Stainless Steel Hex Bolts M10 x 60mm (Box of 1000)</span><span className="font-medium text-foreground shrink-0 ml-2">$38,400.00</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Industrial O-Ring Seal Kit — Type OR-220</span><span className="font-medium text-foreground shrink-0 ml-2">$23,120.00</span></div>
                  </div>
                </div>
              </div>

              {/* Duplicate 2 */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
                  <span className="text-sap-xs font-semibold text-foreground">INV-2026-09102</span>
                  <span className="px-1.5 py-0.5 rounded-[3px] bg-warning/10 text-warning text-[10px] font-medium">Pending</span>
                </div>
                <div className="px-3 py-2.5 space-y-1.5 text-sap-xs">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div><span className="text-muted-foreground">Supplier:</span> <span className="font-medium text-foreground">Meridian Frost Ltd</span></div>
                    <div><span className="text-muted-foreground">Date:</span> <span className="font-medium text-foreground">Nov 21, 2026</span></div>
                    <div><span className="text-muted-foreground">PO Ref:</span> <span className="font-medium text-foreground">PO-2026-HI-00819</span></div>
                    <div><span className="text-muted-foreground">Total:</span> <span className="font-medium text-foreground">$47,890.00</span></div>
                  </div>
                  <div className="border-t border-border pt-1.5 space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Carbon Steel Flange Bolts M16 x 100mm (Box of 200)</span><span className="font-medium text-foreground shrink-0 ml-2">$29,650.00</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Pneumatic Cylinder Seal Kit — Type PC-330</span><span className="font-medium text-foreground shrink-0 ml-2">$18,240.00</span></div>
                  </div>
                </div>
              </div>

              <p>These are separate invoices from Meridian Frost Ltd currently pending review. Would you like me to create a Space to manage them?</p>
            </div>
            {!showDuplicateSpace && (
              <button
                onClick={() => {
                  setShowDuplicateSpace(true);
                  setTimeout(() => {
                    setShowViewSpace(true);
                    setTimeout(scrollToBottom, 50);
                  }, 2500);
                }}
                className="px-3.5 py-1.5 rounded-[7px] text-[12px] font-medium bg-chat-primary/10 text-chat-primary hover:bg-chat-primary/20 transition-colors"
              >
                Create Space for Duplicates
              </button>
            )}
            {showDuplicateSpace && (
              <div className="flex justify-end">
                <div className="bg-[#E6E7EA] text-foreground px-4 py-2.5 rounded-2xl rounded-br-[2px] text-sap-base max-w-[80%]">
                  Create Space for Duplicates
                </div>
              </div>
            )}
            {showDuplicateSpace && (
              <div className="rounded-xl border border-[#E6E7EA] bg-white p-4 animate-[fade-in-up_0.4s_ease-out_both] hover:border-[#B5BCCA] hover:shadow-[0_2px_8px_rgba(34,53,72,0.12)] transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                    <img src={spaceIcon} alt="Space" className="w-9 h-9 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sap-sm font-semibold text-foreground leading-snug">Duplicate Invoices — Meridian Frost Ltd</p>
                    <p className="text-sap-xs text-muted-foreground mt-0.5">2 invoices · Meridian Frost Ltd</p>
                  </div>
                  {!showViewSpace && (
                    <div className="flex items-center gap-1 shrink-0 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}
                </div>
                {showViewSpace && (
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => navigate("/spaces/duplicate-review")}
                      className="px-3 py-1.5 rounded-[6px] text-sap-xs font-medium bg-transparent border border-chat-primary text-chat-primary hover:bg-chat-primary/5 transition-colors animate-[fade-in-up_0.3s_ease-out_both]"
                    >
                      View Space
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Input area */}
      <div className="p-3 md:p-4">
        <div
          className="rounded-md border-2 border-transparent p-4"
          style={{ background: 'linear-gradient(hsl(0 0% 100%), hsl(0 0% 100%)) padding-box, linear-gradient(to right, hsl(252,80%,70%), hsl(216,100%,60%)) border-box' }}
        >
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words text-sap-sm leading-[2rem]">
              <span className="invisible">{inputValue}</span>
              {showGhost && <span className="text-muted-foreground/40">{autocompleteSuggestion.slice(inputValue.length)}</span>}
            </div>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            placeholder="Can I help with anything else?"
            className="relative w-full bg-transparent text-sap-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[2rem] leading-[2rem]"
              style={{ caretColor: "auto" }}
              disabled={submitted && !(showResponse && (submittedAction === "reject" || submittedAction === "approve") && !followUpQuery)}
              rows={1}
            />
          </div>
          {uploadedFile && (
            <div className="flex items-center gap-2 mt-2 px-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/60 border border-border text-sap-xs text-foreground">
                <FileText size={13} className="text-muted-foreground shrink-0" />
                <span className="truncate max-w-[180px]">{uploadedFile.name}</span>
                <button onClick={() => setUploadedFile(null)} className="text-muted-foreground hover:text-foreground ml-0.5">
                  <X size={12} />
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadedFile(file);
                    setPlusOpen(false);
                  }
                }}
              />
              <Popover open={plusOpen} onOpenChange={setPlusOpen}>
                <PopoverTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground"><Plus size={16} /></button>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" sideOffset={12} className="w-56 p-0 rounded-2xl shadow-lg border border-border bg-card">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sap-sm text-foreground hover:bg-muted/50 transition-colors rounded-t-2xl"
                  >
                    <Paperclip size={16} className="text-muted-foreground" />
                    Upload files and images
                  </button>
                  <div className="h-px bg-border mx-3" />
                  <button className="flex items-center gap-3 w-full px-4 py-3 text-sap-sm text-foreground hover:bg-muted/50 transition-colors">
                    <Search size={16} className="text-muted-foreground" />
                    Search
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-3 text-sap-sm text-foreground hover:bg-muted/50 transition-colors">
                    <FlaskConical size={16} className="text-muted-foreground" />
                    Deep Research
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-3 text-sap-sm text-foreground hover:bg-muted/50 transition-colors">
                    <Code2 size={16} className="text-muted-foreground" />
                    Develop
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-3 text-sap-sm text-foreground hover:bg-muted/50 transition-colors">
                    <Layers size={16} className="text-muted-foreground" />
                    Create Space
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-3 text-sap-sm text-foreground hover:bg-muted/50 transition-colors rounded-b-2xl">
                    <GitFork size={16} className="text-muted-foreground" />
                    Create Job
                  </button>
                </PopoverContent>
              </Popover>
              <button className="text-muted-foreground hover:text-foreground"><AtSign size={16} /></button>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[hsl(var(--el-purple-50))] text-[hsl(var(--el-purple-600))] text-sap-xs font-medium border border-[hsl(var(--el-purple-200))]">
                <Link2 size={12} />
                Space
                <X size={12} className="ml-1 cursor-pointer" />
              </div>
            </div>
            <button
              className={`shrink-0 transition-colors ${inputValue.trim() && !(submitted && !(showResponse && (submittedAction === "reject" || submittedAction === "approve") && !followUpQuery)) ? "text-[hsl(var(--el-purple-600))] hover:text-[hsl(var(--el-purple-600))]/80" : "text-muted-foreground opacity-40 cursor-not-allowed"}`}
              onClick={handleSubmit}
              disabled={!inputValue.trim() || (submitted && !(showResponse && (submittedAction === "reject" || submittedAction === "approve") && !followUpQuery))}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">Joule uses AI. Verify results.</p>
      </div>
    </aside>
  );
};

const Index = ({ openJobDetail = false }: { openJobDetail?: boolean }) => {
  const location = useLocation();
  const fromSpace = (location.state as any)?.fromSpace ?? false;
  const fileName = (location.state as any)?.fileName ?? "INV-2026-03847.pdf";
  const [loading, setLoading] = useState(fromSpace);
  const [jobDetailOpen, setJobDetailOpen] = useState(openJobDetail);
  const [jobActivated, setJobActivated] = useState(false);
  const [jobResolved, setJobResolved] = useState(false);
  const [invoiceRejected, setInvoiceRejected] = useState(false);

  useEffect(() => {
    if (fromSpace) {
      const timer = setTimeout(() => setLoading(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [fromSpace]);

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden flex-col md:flex-row relative bg-card">
        {/* Focus Pane */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-card">
          {loading ? (
            <SkeletonContent />
          ) : (
            <div className="flex flex-col flex-1 min-h-0 animate-[fade-in-up_0.5s_ease-out_both]">
              <InvoiceHeader invoiceRejected={invoiceRejected} />
              <div className="flex-1 overflow-y-auto">
                <SummaryCard />
                <InsightsSection jobActivated={jobResolved} />
                <div className="relative h-0">
                  <div className="absolute inset-x-6 top-[21px] h-px bg-border/50" />
                </div>
                <DetailedAnalysis jobActivated={jobResolved} />
              </div>
            </div>
          )}
        </div>

        {/* Right Pane — chat */}
        {fromSpace ? (
          <ContinuedChatPanel fileName={fileName} onJobDetailOpen={() => setJobDetailOpen(true)} jobActivated={jobActivated} onSubmitInvoice={() => setJobResolved(true)} onRejectInvoice={() => setInvoiceRejected(true)} />
        ) : (
          <ChatPanel />
        )}

      {/* Job Detail Panel overlay — fixed so it covers sidebar too */}
      <JobDetailPanel
        open={jobDetailOpen}
        onClose={() => setJobDetailOpen(false)}
        onActivate={() => {
          setJobActivated(true);
          setTimeout(() => setJobResolved(true), 2500);
        }}
      />
    </div>
  );
};

export default Index;
