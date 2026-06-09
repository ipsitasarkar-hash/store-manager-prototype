import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AtSign, X, Mic, SlidersHorizontal, FileText, ChevronDown,
  CheckCircle2, AlertTriangle, ExternalLink, Copy, ThumbsUp,
  ThumbsDown, Info, GitFork, Eye, PenLine, XCircle, Clock,
  User, MessageSquareText
} from "lucide-react";
// IconSidebar now in SidebarLayout
import JouleAttachmentPopover from "@/components/invoicing/JouleAttachmentPopover";
import jouleIcon from "@/assets/joule-icon.png";

type FlowStep = "input" | "processing" | "detected" | "job-creating" | "job-created";

const DuplicateInvoicePage = () => {
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [flowStep, setFlowStep] = useState<FlowStep>("input");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileAttach = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file);
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (attachedFile) setFlowStep("processing");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (flowStep !== "processing") return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setFlowStep("detected"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [flowStep]);

  const fileName = attachedFile?.name || "INV-2026-03847.pdf";
  const fileSize = attachedFile ? `${(attachedFile.size / (1024 * 1024)).toFixed(0)} MB` : "4 MB";

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden pt-3 pr-3 md:pt-5 md:pr-5 bg-gradient-to-br from-[hsl(207,100%,96%)] to-[hsl(240,100%,96%)]">
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-card rounded-t-[24px] md:rounded-t-[32px] shadow-[0_4px_46px_rgba(29,33,50,0.04)]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-5 md:px-6 md:py-6">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-md bg-sidebar-accent flex items-center justify-center shrink-0">
                <FileText size={16} className="text-sidebar-accent-foreground" />
              </div>
              <h1 className="text-sap-sm font-semibold text-foreground">
                {flowStep !== "input" ? "Process Invoice" : "Title"}
              </h1>
            </div>
            {flowStep !== "input" && (
              <button className="w-9 h-9 flex items-center justify-center rounded-full text-chat-primary hover:opacity-80 transition-colors bg-chat-primary/10">
                <MessageSquareText size={16} />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {flowStep === "input" ? (
              <InputView
                message={message}
                setMessage={setMessage}
                attachedFile={attachedFile}
                setAttachedFile={setAttachedFile}
                handleFileAttach={handleFileAttach}
                handleRemoveFile={handleRemoveFile}
                handleSubmit={handleSubmit}
                handleKeyDown={handleKeyDown}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
              />
            ) : (
              <div className="relative flex-1 min-h-0">
                <div className="absolute inset-0 overflow-y-auto pb-44">
                  {flowStep === "processing" ? (
                    <ProcessingView fileName={fileName} fileSize={fileSize} progress={progress} />
                  ) : (
                    <DuplicateDetectedView
                      fileName={fileName}
                      fileSize={fileSize}
                      flowStep={flowStep}
                      setFlowStep={setFlowStep}
                    />
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 z-10">
                  <div className="absolute bottom-full left-[60px] right-[60px]">
                    <div className="max-w-[640px] mx-auto">
                      <BottomInput />
                    </div>
                  </div>
                  <div className="bg-card px-[60px] py-2">
                    <p className="text-[10px] text-muted-foreground text-center">Joule uses AI. Verify results.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

/* ===== Input View ===== */
const InputView = ({
  message, setMessage, attachedFile, setAttachedFile, handleFileAttach,
  handleRemoveFile, handleSubmit, handleKeyDown, fileInputRef, handleFileChange,
}: any) => (
  <div className="flex-1 flex flex-col items-center justify-center px-[60px] pb-12">
    <div className="mb-10">
      <img src={jouleIcon} alt="Joule" className="w-12 h-12 object-contain" />
    </div>
    <div className="w-full max-w-[640px]">
      <div className="rounded-3xl border border-chat-border bg-card p-4 shadow-sm focus-within:border-chat-primary/40 transition-colors">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Joule or create anything"
          className="w-full bg-transparent text-sap-sm text-foreground placeholder:text-muted-foreground resize-none outline-none h-7"
          rows={1}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <JouleAttachmentPopover onFileSelect={(file: File) => setAttachedFile(file)} />
            <button className="text-muted-foreground hover:text-foreground transition-colors"><AtSign size={18} /></button>
            {attachedFile && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-chat-primary/10 text-chat-primary text-sap-xs font-medium border border-chat-border">
                <FileText size={12} />
                <span className="truncate max-w-[180px]">{attachedFile.name}</span>
                <button onClick={handleRemoveFile} className="hover:text-chat-primary/70"><X size={12} /></button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="text-muted-foreground hover:text-foreground transition-colors"><Mic size={18} /></button>
            <button className="text-muted-foreground hover:text-foreground transition-colors"><SlidersHorizontal size={18} /></button>
          </div>
        </div>
      </div>
      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.xlsx,.csv,.txt" onChange={handleFileChange} />
      <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
        {["Process Invoice", "Check Duplicates", "Compliance & Controls"].map((pill) => (
          <button
            key={pill}
            onClick={() => {
              if (pill === "Check Duplicates" && attachedFile) handleSubmit();
              else if (pill === "Check Duplicates") handleFileAttach();
            }}
            className="px-4 py-2 rounded-full text-sap-xs font-medium text-chat-primary hover:opacity-80 transition-colors bg-chat-primary/10"
          >
            {pill}
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ===== Processing View ===== */
const ProcessingView = ({ fileName, fileSize, progress }: { fileName: string; fileSize: string; progress: number }) => (
  <div className="flex-1 flex flex-col px-[60px] pt-8">
    <div className="flex justify-end mb-6">
      <div className="bg-chat-primary text-chat-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm text-sap-sm max-w-[400px]">
        Process invoice {fileName}
      </div>
    </div>
    <div className="flex justify-end mb-6">
      <div className="rounded-2xl border border-border bg-card p-4 max-w-[400px] w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-chat-primary/10 flex items-center justify-center shrink-0">
            <FileText size={20} className="text-chat-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sap-sm font-semibold text-foreground truncate">{fileName}</p>
            <p className="text-sap-xs text-muted-foreground">File type: pdf • Size: {fileSize}</p>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle2 size={12} className="text-success" />
              <span className="text-sap-xs font-medium text-success">Uploaded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="mb-4">
      <p className="text-sap-sm text-foreground">Analyzing your invoice…</p>
    </div>
    <div className="rounded-2xl border border-chat-border bg-card p-4 max-w-[500px] mb-4">
      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mb-3">
        <div
          className="h-1.5 rounded-full transition-all duration-200 ease-linear"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, hsl(262, 80%, 72%) 0%, hsl(262, 80%, 72%) ${Math.min(progress, 60)}%, hsl(262, 60%, 82%) ${Math.min(progress, 80)}%, hsl(210, 7%, 94%) 100%)`,
          }}
        />
      </div>
      <div className="flex items-center gap-2 text-sap-sm text-muted-foreground">
        <span className="inline-flex gap-0.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-chat-primary animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-chat-primary animate-pulse [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-chat-primary animate-pulse [animation-delay:300ms]" />
        </span>
        <span>Scanning for duplicates and validating…</span>
      </div>
    </div>
  </div>
);

/* ===== Duplicate Detected View ===== */
const DuplicateDetectedView = ({
  fileName, fileSize, flowStep, setFlowStep,
}: {
  fileName: string; fileSize: string;
  flowStep: FlowStep; setFlowStep: (s: FlowStep) => void;
}) => {
  const [jobProgress, setJobProgress] = useState(0);
  const [showJobConfig, setShowJobConfig] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [assignee, setAssignee] = useState("");
  const [notes, setNotes] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  // Job creation progress
  useEffect(() => {
    if (flowStep !== "job-creating") return;
    setJobProgress(0);
    const interval = setInterval(() => {
      setJobProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setFlowStep("job-created"), 400);
          return 100;
        }
        return prev + 3;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [flowStep, setFlowStep]);

  useEffect(() => {
    if (flowStep === "job-creating" || flowStep === "job-created") scrollToBottom();
  }, [flowStep, jobProgress]);

  const handleCreateJob = () => {
    setFlowStep("job-creating");
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="flex-1 flex flex-col px-[60px] pt-8">
      {/* User message */}
      <div className="flex justify-end mb-6">
        <div className="bg-chat-primary text-chat-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm text-sap-sm max-w-[400px]">
          Process invoice {fileName}
        </div>
      </div>

      {/* File card */}
      <div className="flex justify-end mb-6">
        <div className="rounded-2xl border border-border bg-card p-4 max-w-[400px] w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-chat-primary/10 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-chat-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sap-sm font-semibold text-foreground truncate">{fileName}</p>
              <p className="text-sap-xs text-muted-foreground">File type: pdf • Size: {fileSize}</p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle2 size={12} className="text-success" />
                <span className="text-sap-xs font-medium text-success">Uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Duplicate Detection Alert ===== */}
      <div className="mb-5">
        <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-4 max-w-[700px]">
          <div className="w-8 h-8 rounded-full bg-warning/15 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle size={16} className="text-warning" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sap-sm font-semibold text-foreground mb-1">⚠️ Potential Duplicate Detected</p>
            <p className="text-sap-sm text-foreground leading-relaxed">
              This invoice may be a duplicate. I found a match with an existing invoice based on <span className="font-medium">invoice number</span>, <span className="font-medium">vendor name</span>, and <span className="font-medium">amount</span>.
            </p>
          </div>
        </div>
      </div>

      {/* ===== Comparison Card ===== */}
      <div className="rounded-2xl border border-border bg-card p-5 max-w-[700px] mb-5 shadow-[0_4px_24px_rgba(29,33,50,0.08)]">
        <p className="text-sap-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Comparison Summary</p>
        <div className="grid grid-cols-3 gap-4 text-sap-sm">
          {/* Header row */}
          <div className="text-muted-foreground font-medium">Field</div>
          <div className="text-muted-foreground font-medium">Uploaded Invoice</div>
          <div className="text-muted-foreground font-medium">Existing Invoice</div>

          {/* Invoice Number */}
          <div className="text-foreground">Invoice Number</div>
          <div className="font-medium text-foreground">INV-2026-03847</div>
          <div className="font-medium text-foreground flex items-center gap-1">
            INV-2026-03847
            <CheckCircle2 size={12} className="text-destructive" />
          </div>

          {/* Vendor */}
          <div className="text-foreground">Vendor</div>
          <div className="font-medium text-foreground">Meridian Frost Ltd</div>
          <div className="font-medium text-foreground flex items-center gap-1">
            Meridian Frost Ltd
            <CheckCircle2 size={12} className="text-destructive" />
          </div>

          {/* Amount */}
          <div className="text-foreground">Amount</div>
          <div className="font-medium text-foreground">$83,240.00</div>
          <div className="font-medium text-foreground flex items-center gap-1">
            $83,240.00
            <CheckCircle2 size={12} className="text-destructive" />
          </div>

          {/* Date */}
          <div className="text-foreground">Invoice Date</div>
          <div className="font-medium text-foreground">2026-05-05</div>
          <div className="font-medium text-foreground">2026-05-05</div>

          {/* Status */}
          <div className="text-foreground">Status</div>
          <div className="font-medium text-foreground">New</div>
          <div>
            <span className="px-2 py-0.5 rounded-md bg-success/15 text-success text-sap-xs font-medium">Posted</span>
          </div>

          {/* Reference */}
          <div className="text-foreground">Document ID</div>
          <div className="text-muted-foreground">—</div>
          <div className="font-medium text-primary cursor-pointer hover:underline flex items-center gap-1">
            DOC-4471829
            <ExternalLink size={11} />
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-destructive/5 border border-destructive/15">
          <p className="text-sap-xs text-foreground">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sap-xs font-medium text-destructive bg-destructive/10 mr-1.5">97% match</span>Invoice number, vendor, and amount are identical. The existing invoice was posted on 2026-05-05.
          </p>
        </div>
      </div>

      {/* ===== Recommendation ===== */}
      <div className="mb-5 max-w-[700px]">
        <p className="text-sap-sm text-foreground leading-relaxed">
          I recommend creating a <span className="font-semibold">Duplicate Invoice Job</span> to track and resolve this. The job will flag both invoices for review and prevent double payment.
        </p>
      </div>

      {/* ===== Action Icons ===== */}
      <div className="flex items-center gap-2 mb-4">
        <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Copy size={14} />
        </button>
        <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <ThumbsUp size={14} />
        </button>
        <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <ThumbsDown size={14} />
        </button>
        <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <Info size={14} />
        </button>
      </div>

      {/* ===== Action Buttons ===== */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button
          onClick={handleCreateJob}
          disabled={flowStep !== "detected"}
          className="px-5 py-2.5 rounded-full bg-chat-primary text-chat-primary-foreground text-sap-xs font-semibold hover:bg-chat-primary/90 transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
        >
          <GitFork size={14} />
          Create Duplicate Invoice Job
        </button>
        <button className="px-5 py-2 rounded-full border border-chat-primary text-chat-primary text-sap-xs font-semibold hover:bg-chat-muted transition-colors flex items-center gap-2">
          <Eye size={14} />
          View Existing Invoice
        </button>
        <button className="px-5 py-2 rounded-full border border-border text-foreground text-sap-xs font-medium hover:bg-secondary transition-colors flex items-center gap-2">
          <PenLine size={14} />
          Continue Anyway
        </button>
        <button className="px-5 py-2 rounded-full border border-border text-muted-foreground text-sap-xs font-medium hover:bg-secondary transition-colors flex items-center gap-2">
          <XCircle size={14} />
          Dismiss
        </button>
      </div>

      {/* ===== Job Creation Flow ===== */}
      {(flowStep === "job-creating" || flowStep === "job-created") && (
        <>
          {/* User message */}
          <div className="flex justify-end mb-6 animate-fade-in">
            <div className="bg-chat-primary text-chat-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm text-sap-sm max-w-[400px]">
              Create Duplicate Invoice Job
            </div>
          </div>

          {flowStep === "job-creating" && (
            <div className="rounded-2xl border border-chat-border bg-card p-4 max-w-[500px] mb-4 animate-fade-in">
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mb-3">
                <div
                  className="h-1.5 rounded-full transition-all duration-200 ease-linear"
                  style={{
                    width: `${jobProgress}%`,
                    background: `linear-gradient(90deg, hsl(262, 80%, 72%) 0%, hsl(262, 80%, 72%) ${Math.min(jobProgress, 60)}%, hsl(262, 60%, 82%) ${Math.min(jobProgress, 80)}%, hsl(210, 7%, 94%) 100%)`,
                  }}
                />
              </div>
              <div className="flex items-center gap-2 text-sap-sm text-muted-foreground">
                <span className="inline-flex gap-0.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-chat-primary animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-chat-primary animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-chat-primary animate-pulse [animation-delay:300ms]" />
                </span>
                <span>Creating job…</span>
              </div>
            </div>
          )}

          {flowStep === "job-created" && (
            <>
              {/* Job Created Card */}
              <div className="rounded-2xl border border-border bg-card p-5 max-w-[541px] mb-5 animate-fade-in shadow-[0_4px_24px_rgba(29,33,50,0.08)]">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} className="text-success" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sap-sm font-semibold text-foreground">Duplicate Invoice Job Created</p>
                    <p className="text-sap-xs text-muted-foreground mt-0.5">JOB-DUP-2026-1047 • INV-2026-03847</p>
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-sap-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock size={11} /> Just now</span>
                      <span>Vendor: Meridian Frost Ltd</span>
                      <span>$83,240.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow-up */}
              <div className="text-sap-sm text-foreground leading-relaxed mb-5 max-w-[700px] animate-fade-in">
                <p>I've created the job. Both invoices are now flagged for review. Would you like to assign it or add notes?</p>
              </div>

              {/* Optional config */}
              {!showJobConfig ? (
                <div className="flex items-center gap-3 mb-6 animate-fade-in">
                  <button
                    onClick={() => setShowJobConfig(true)}
                    className="px-5 py-2 rounded-full border border-chat-primary text-chat-primary text-sap-xs font-semibold hover:bg-chat-muted transition-colors"
                  >
                    Assign & Add Notes
                  </button>
                  <button className="px-5 py-2 rounded-full border border-border text-foreground text-sap-xs font-medium hover:bg-secondary transition-colors">
                    Done for now
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-5 max-w-[420px] mb-6 animate-fade-in space-y-4">
                  <div>
                    <label className="text-sap-xs font-medium text-muted-foreground block mb-1.5">Priority</label>
                    <div className="flex gap-2">
                      {["Low", "Medium", "High", "Critical"].map((p) => (
                        <button
                          key={p}
                          onClick={() => setPriority(p)}
                          className={`px-3 py-1.5 rounded-full text-sap-xs font-medium border transition-colors ${
                            priority === p
                              ? "bg-chat-primary text-chat-primary-foreground border-chat-primary"
                              : "border-border text-foreground hover:bg-secondary"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sap-xs font-medium text-muted-foreground block mb-1.5">Assignee</label>
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                      <User size={14} className="text-muted-foreground shrink-0" />
                      <input
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        placeholder="Search team member…"
                        className="bg-transparent text-sap-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sap-xs font-medium text-muted-foreground block mb-1.5">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add context for the reviewer…"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sap-sm text-foreground placeholder:text-muted-foreground outline-none resize-none h-16"
                    />
                  </div>
                  <button className="w-full px-4 py-2.5 rounded-full bg-chat-primary text-chat-primary-foreground text-sap-xs font-semibold hover:bg-chat-primary/90 transition-colors">
                    Save & Continue
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

/* ===== Bottom Input ===== */
const BottomInput = () => (
  <div className="w-full">
    <div className="rounded-[20px] border border-[hsl(252,80%,85%)] bg-card p-4 shadow-[0_-4px_24px_rgba(29,33,50,0.06)]">
      <textarea
        placeholder="Message Joule or use @ to loop in an assistant"
        className="w-full bg-transparent text-sap-sm text-foreground placeholder:text-muted-foreground resize-none outline-none h-7"
        rows={1}
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:text-foreground transition-colors"><AtSign size={18} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-muted-foreground hover:text-foreground transition-colors"><Mic size={18} /></button>
          <button className="text-muted-foreground hover:text-foreground transition-colors"><SlidersHorizontal size={18} /></button>
        </div>
      </div>
    </div>
  </div>
);

export default DuplicateInvoicePage;
