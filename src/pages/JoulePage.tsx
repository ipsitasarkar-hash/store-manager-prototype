import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { AtSign, X, Mic, SlidersHorizontal, FileText, ChevronDown, CheckCircle2, MessageSquareText, TrendingUp, Link2, List, MoreHorizontal, Send } from "lucide-react";
import { SpacesIcon } from "@/components/invoicing/IconSidebar";
import JouleAttachmentPopover from "@/components/invoicing/JouleAttachmentPopover";
import { TimestampDivider, UserMessage, AssistantMessage, JouleReplyContent } from "@/components/invoicing/ConversationMessage";
import MessageActions from "@/components/invoicing/MessageActions";
import jouleIcon from "@/assets/joule-icon.png?inline";
import spaceIcon from "@/assets/space-icon.png";

const suggestionPills = [
  "Create an Invoice",
  "Process Automation",
  "Compliance & Controls",
  "Strategic Planning",
];

const HERO_PHRASES = [
  "One more thing\nbefore the day wraps up?",
  "Good morning,\nlet's get to work.",
  "Ready to build\nsomething great today?",
  "What's on your\nplate today?",
  "Let's make\nthings happen.",
  "Where do you\nwant to start?",
];



const JoulePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initialStep = (searchParams.get("step") as FlowStep) || "input";
  const [message, setMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [flowStep, setFlowStepRaw] = useState<FlowStep>(initialStep);
  const [progress, setProgress] = useState(initialStep === "result" ? 100 : 0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const [heroPhrase, setHeroPhrase] = useState(HERO_PHRASES[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Reset to home when Joule logo is clicked (passes reset state)
  useEffect(() => {
    if ((location.state as any)?.reset) {
      setFlowStepRaw("input");
      setMessage("");
      setAttachedFile(null);
      setProgress(0);
      setSearchParams({}, { replace: true });
    }
  }, [(location.state as any)?.reset]);

  const setFlowStep = (step: FlowStep) => {
    setFlowStepRaw(step);
    setSearchParams({ step }, { replace: true });
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreateInvoice = () => {
    setFlowStep("processing");
  };

  const handleSubmit = () => {
    if (flowStep === "input" && attachedFile) {
      handleCreateInvoice();
    } else if (flowStep === "input" && message.trim().length > 0) {
      // Text-only prompt: treat as invoice creation trigger
      handleCreateInvoice();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Simulate processing progress
  useEffect(() => {
    if (flowStep !== "processing") return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setFlowStep("result"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [flowStep]);

  useEffect(() => {
    if (flowStep !== "input") return;
    const interval = setInterval(() => {
      // 1. fade out
      setHeroVisible(false);
      setTimeout(() => {
        // 2. swap text while invisible
        setHeroIndex(i => (i + 1) % HERO_PHRASES.length);
      }, 600);
      setTimeout(() => {
        // 3. fade in after swap
        setHeroVisible(true);
      }, 700);
    }, 5000);
    return () => clearInterval(interval);
  }, [flowStep]);

  useEffect(() => {
    setHeroPhrase(HERO_PHRASES[heroIndex]);
  }, [heroIndex]);

  const fileName = "MeridianFrost_INV-2026-03847.pdf";
  const invoiceNumber = "INV-2026-03847";
  const fileSize = "0.8 MB";

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden bg-[hsl(var(--el-neutral-50-alt))]">
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden relative border border-[hsl(var(--el-neutral-200))]"
          style={{
            background: flowStep === 'input'
              ? 'linear-gradient(180deg, hsl(235, 100%, 99%) 0%, hsl(0, 0%, 100%) 100%)'
              : '#FFFFFF',
            boxShadow: '0 22px 14px rgba(0,0,0,0.06), 0 182px 111px rgba(0,0,0,0.05)',
          }}
        >
          {/* Joule gradient — only on input screen */}
          {flowStep === 'input' && <div className="absolute bottom-[-80px] right-0 w-[600px] h-[400px] pointer-events-none overflow-hidden"
            style={{ mask: 'radial-gradient(ellipse at bottom right, black 20%, transparent 70%)', WebkitMask: 'radial-gradient(ellipse at bottom right, black 20%, transparent 70%)' }}
          >
            {/* Top-right violet */}
            <div className="absolute bottom-[-40px] right-[-40px] w-[420px] h-[320px] rounded-full animate-blob-1"
              style={{ background: 'rgba(99, 179, 255, 0.55)', filter: 'blur(70px)' }}
            />
            <div className="absolute bottom-[-20px] right-[-60px] w-[280px] h-[240px] rounded-full animate-blob-2"
              style={{ background: 'rgba(177, 109, 234, 0.55)', filter: 'blur(60px)' }}
            />
            <div className="absolute bottom-[60px] right-[40px] w-[220px] h-[180px] rounded-full animate-[blob-1_14s_ease-in-out_infinite_reverse]"
              style={{ background: 'rgba(139, 92, 246, 0.45)', filter: 'blur(55px)' }}
            />
            <div className="absolute bottom-[80px] right-[-20px] w-[180px] h-[160px] rounded-full animate-blob-3"
              style={{ background: 'rgba(236, 72, 153, 0.40)', filter: 'blur(50px)' }}
            />
            <div className="absolute bottom-[20px] right-[120px] w-[140px] h-[130px] rounded-full animate-blob-4"
              style={{ background: 'rgba(45, 212, 191, 0.35)', filter: 'blur(45px)' }}
            />
          </div>}

          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-4 relative z-10">
            <div className="flex items-center gap-3 min-w-0">
              <button className="w-8 h-8 flex items-center justify-center rounded text-foreground/70 hover:bg-secondary transition-colors">
                <List size={18} />
              </button>
              <h1 className="text-sap-sm font-semibold text-foreground">
                {flowStep !== "input" ? "Create Invoice" : "Conversations"}
              </h1>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {flowStep !== "input" ? (
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full text-[#7458FF] hover:opacity-80 transition-colors"
                  style={{ backgroundColor: "rgba(116, 88, 255, 0.07)" }}
                >
                  <MessageSquareText size={16} />
                </button>
              ) : (
                <>
                  <button className="w-8 h-8 flex items-center justify-center rounded text-foreground/70 hover:bg-secondary transition-colors">
                    <SpacesIcon size={18} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded text-foreground/70 hover:bg-secondary transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 flex flex-col min-h-0 relative z-10">
            {flowStep === "input" ? (
              /* ===== STEP 1: Input screen ===== */
              <div className="flex-1 flex flex-col min-h-0">
                {/* Hero content + input - centered together */}
                <div className="flex-1 flex flex-col items-center justify-center px-[60px] pb-8 pt-[15px]">
                  <div className="w-full max-w-[640px] flex flex-col items-center">
                    <div className="mb-5 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                      <img src={jouleIcon} alt="Joule" className="w-8 h-8 object-contain" width={32} height={32} loading="eager" decoding="async" fetchPriority="high" />
                    </div>
                    <h2 className="text-foreground text-center mb-5" style={{ fontWeight: 300, lineHeight: 1.26, fontSize: '35.5px', letterSpacing: '-0.025em' }}>
                      {(() => {
                        const words = heroPhrase.replace('\n', ' \n ').split(' ');
                        let wordIndex = 0;
                        return words.map((word, i) => {
                          if (word === '\n') return <br key={i} />;
                          const totalWords = words.filter(w => w !== '\n').length;
                          const delay = heroVisible
                            ? wordIndex * 60
                            : (totalWords - 1 - wordIndex) * 40;
                          wordIndex++;
                          return (
                            <span
                              key={`${heroPhrase}-${i}`}
                              style={{
                                display: 'inline-block',
                                opacity: heroVisible ? 1 : 0,
                                transform: heroVisible ? 'translateY(0px)' : 'translateY(6px)',
                                transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
                              }}
                            >
                              {word}&nbsp;
                            </span>
                          );
                        });
                      })()}
                    </h2>
                    <p className="text-muted-foreground/70 text-center mb-20 animate-fade-in-up" style={{ fontWeight: 100, animationDelay: '160ms', fontSize: '16.2px' }}>
                      Helping you compile resources and edit along the way.
                    </p>

                  {/* Input box inline with hero */}
                  <div className="w-full animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <div className="relative">
                      {/* Floating suggestions */}
                      {(message.trim().length > 0 || attachedFile) && (() => {
                        const q = message.toLowerCase().trim();
                        const hasInvoiceFile = attachedFile && /\.(pdf|xlsx|csv|doc|docx)$/i.test(attachedFile.name);
                        const suggestions: { label: string; full: string; action?: string }[] = [];

                        if (q.startsWith('cre')) {
                          suggestions.push({ label: 'Create Invoice', full: 'Create Invoice' });
                          if (hasInvoiceFile) suggestions.push({ label: 'Create Invoice from ' + attachedFile!.name, full: 'Create Invoice from ' + attachedFile!.name });
                          suggestions.push({ label: 'Create Space', full: 'Create Space' });
                          suggestions.push({ label: 'Create Job', full: 'Create Job' });
                        } else if (q.startsWith('inv') || q.startsWith('invo')) {
                          suggestions.push({ label: 'Invoice Processing', full: 'Invoice Processing' });
                          suggestions.push({ label: 'Invoice Compliance Check', full: 'Invoice Compliance Check' });
                          if (hasInvoiceFile) suggestions.push({ label: 'Analyze uploaded invoice', full: 'Analyze uploaded invoice' });
                        } else if (q.startsWith('sub')) {
                          suggestions.push({ label: 'Submit Invoice', full: 'Submit Invoice' });
                          suggestions.push({ label: 'Submit for Approval', full: 'Submit for Approval' });
                        } else if (q.startsWith('pro')) {
                          suggestions.push({ label: 'Process Invoice', full: 'Process Invoice' });
                          suggestions.push({ label: 'Process Return Order', full: 'Process Return Order' });
                        } else if (q.startsWith('ana') || q.startsWith('rev')) {
                          suggestions.push({ label: 'Analyze Document', full: 'Analyze Document' });
                          suggestions.push({ label: 'Review Compliance', full: 'Review Compliance' });
                        } else if (hasInvoiceFile && !q) {
                          suggestions.push({ label: 'Create Invoice', full: 'Create Invoice' });
                          suggestions.push({ label: 'When is payment due?', full: 'When is payment due for this invoice?', action: 'noop' });
                          suggestions.push({ label: 'Check for duplicates', full: 'Check this invoice for duplicates', action: 'noop' });
                          suggestions.push({ label: 'Verify compliance', full: 'Verify compliance for this invoice', action: 'noop' });
                        } else {
                          suggestions.push({ label: 'Create Invoice', full: 'Create Invoice' });
                          suggestions.push({ label: 'Process Invoice', full: 'Process Invoice' });
                        }

                        if (suggestions.length === 0) return null;

                        return (
                          <div className="absolute bottom-full left-0 right-0 mb-3 z-10">
                            <div className="flex flex-wrap gap-2 justify-start">
                              {suggestions.slice(0, 4).map((s, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    if (s.action === 'noop') {
                                      return;
                                    } else if (s.action === 'duplicate') {
                                      navigate('/duplicate');
                                    } else {
                                      setMessage(s.full);
                                      handleCreateInvoice();
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-sap-xs font-medium bg-card border border-border shadow-sm text-foreground hover:bg-[hsl(var(--el-purple-50))] hover:border-[hsl(var(--el-purple-300))] hover:text-[hsl(var(--el-purple-600))] transition-all animate-[fade-in-up_0.25s_ease-out_both]"
                                  style={{ animationDelay: `${i * 60}ms` }}
                                >
                                  {s.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      <div
                        className="rounded-xl border-2 border-transparent p-4"
                        style={{
                          background: 'linear-gradient(hsl(0 0% 100%), hsl(0 0% 100%)) padding-box, linear-gradient(to right, hsl(216,100%,65%), hsl(262,80%,65%)) border-box',
                          boxShadow: '0 22px 14px rgba(0,0,0,0.06), 0 182px 111px rgba(0,0,0,0.05)',
                        }}
                      >
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="What can I help you with today?"
                          className="w-full bg-transparent text-sap-sm text-foreground placeholder:text-muted-foreground resize-none outline-none h-7"
                          rows={1}
                        />
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 min-w-0 flex-wrap">
                            <JouleAttachmentPopover onFileSelect={(file) => setAttachedFile(file)} buttonClassName="text-[hsl(var(--el-purple-600))] hover:text-[hsl(var(--el-purple-600))]/80 transition-colors" />
                            <button className="text-[hsl(var(--el-purple-600))] hover:text-[hsl(var(--el-purple-600))]/80 transition-colors"><AtSign size={18} /></button>
                            {/* Attached file chip — inline beside Space pill */}
                            {attachedFile && (
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-muted/60 text-sap-xs text-foreground">
                                <FileText size={13} className="shrink-0 text-muted-foreground" />
                                <span className="truncate max-w-[140px]">{fileName}</span>
                                <button onClick={handleRemoveFile} className="ml-0.5 text-muted-foreground hover:text-foreground">
                                  <X size={11} />
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={handleSubmit}
                            disabled={!message.trim()}
                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[hsl(var(--el-purple-600))] hover:bg-[hsl(var(--el-purple-50))]"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.xlsx,.csv,.txt" onChange={handleFileChange} />
                    <div className="flex justify-center mt-6">
                      <a href="#" className="text-sap-sm font-light text-[hsl(var(--el-purple-600))] hover:underline" style={{ fontSize: '12.9px' }}>
                        View full prompt library
                      </a>
                    </div>
                  </div>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground text-center pb-5">Joule uses AI. Verify results.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto">
                  {flowStep === "processing" ? (
                    <ProcessingView fileName={fileName} fileSize={fileSize} progress={progress} />
                  ) : (
                    <ResultView fileName={fileName} fileSize={fileSize} invoiceNumber={invoiceNumber} />
                  )}
                </div>
                <div className="shrink-0 px-[60px] pb-5 pt-4">
                  <div className="max-w-[640px] mx-auto">
                    <BottomInput
                      attachedFile={null}
                      onFileSelect={(file) => setAttachedFile(file)}
                      onRemoveFile={handleRemoveFile}
                    />
                    <p className="text-[10px] text-muted-foreground text-center mt-3 mb-1">Joule uses AI. Verify results.</p>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

/* ===== Processing View ===== */
const ProcessingView = ({ fileName, fileSize, progress }: { fileName: string; fileSize: string; progress: number }) => (
  <div className="flex-1 flex flex-col px-[60px] pt-8 max-w-[1100px] mx-auto w-full">
    <TimestampDivider label="Today 2:30 PM" />

    {/* User message */}
    <UserMessage>Create invoice for {fileName}</UserMessage>

    {/* File card */}
    <div className="flex justify-end mb-6">
      <div className="rounded-xl border border-[#E6E7EA] bg-white p-4 max-w-[400px] w-full hover:border-[#B5BCCA] hover:shadow-[0_2px_8px_rgba(34,53,72,0.12)] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-chat-primary/10 flex items-center justify-center shrink-0">
            <FileText size={20} className="text-chat-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sap-sm font-semibold text-foreground truncate">{fileName}</p>
            <p className="text-sap-xs text-muted-foreground">File type: pdf • Size: {fileSize}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Assistant processing message */}
    <AssistantMessage showActions={false}>
      Perfect! I'll take care of it
    </AssistantMessage>

    <div className="rounded-xl border border-[#E6E7EA] bg-white p-4 max-w-[500px] mb-4">
      <div className="w-full bg-[hsl(var(--el-neutral-100))] rounded-full h-1.5 overflow-hidden mb-3">
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
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--el-purple-600))] animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--el-purple-600))] animate-pulse [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--el-purple-600))] animate-pulse [animation-delay:300ms]" />
        </span>
        <span>Creating invoice...</span>
      </div>
    </div>
    <div className="flex justify-center mt-1">
      <button className="w-7 h-7 rounded-full border border-[hsl(var(--el-neutral-200))] flex items-center justify-center text-[hsl(var(--el-purple-600))] hover:bg-[hsl(var(--el-neutral-100))]">
        <ChevronDown size={16} />
      </button>
    </div>
  </div>
);

/* ===== Result View ===== */
const ResultView = ({ fileName, fileSize, invoiceNumber }: { fileName: string; fileSize: string; invoiceNumber: string }) => {
  const [spaceCreated, setSpaceCreated] = useState(false);
  const [spaceCardVisible, setSpaceCardVisible] = useState(false);
  const [spaceProgress, setSpaceProgress] = useState(0);
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  };

  const handleCreateSpace = () => {
    if (spaceCreated) return;
    setSpaceCreated(true);
    setSpaceProgress(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToBottom);
    });
  };

  // Space creation progress animation
  useEffect(() => {
    if (!spaceCreated || spaceCardVisible) return;
    const interval = setInterval(() => {
      setSpaceProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setSpaceCardVisible(true), 400);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [spaceCreated, spaceCardVisible]);

  // Auto-scroll when new content appears
  useEffect(() => {
    if (spaceCreated || spaceCardVisible) {
      requestAnimationFrame(scrollToBottom);
    }
  }, [spaceCreated, spaceCardVisible]);

  return (
  <div className="flex-1 flex flex-col px-[60px] pt-8 max-w-[1100px] mx-auto w-full">
    <TimestampDivider label="Today 2:30 PM" />

    {/* User message */}
    <div>
      <UserMessage>Create invoice for {fileName}</UserMessage>
    </div>

    {/* File card */}
    <div className="flex justify-end mb-6">
      <div className="rounded-xl border border-[#E6E7EA] bg-white p-4 max-w-[400px] w-full hover:border-[#B5BCCA] hover:shadow-[0_2px_8px_rgba(34,53,72,0.12)] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-chat-primary/10 flex items-center justify-center shrink-0">
            <FileText size={20} className="text-chat-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sap-sm font-semibold text-foreground truncate">{fileName}</p>
            <p className="text-sap-xs text-muted-foreground">File type: pdf • Size: {fileSize}</p>
          </div>
        </div>
      </div>
    </div>

    {/* AI Response with rich content */}
    <div>
      <AssistantMessage showActions={false}>
        I have created the invoice for you:
      </AssistantMessage>
    </div>

    {/* Invoice Card */}
    <div className="rounded-xl border border-[#E6E7EA] bg-white p-5 max-w-[700px] mb-5 hover:border-[#B5BCCA] hover:shadow-[0_2px_8px_rgba(34,53,72,0.12)] transition-all">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-chat-primary/10 flex items-center justify-center shrink-0">
          <FileText size={16} className="text-chat-primary" />
        </div>
        <span className="text-sap-base font-bold text-foreground">{invoiceNumber}</span>
        <span className="px-2.5 py-0.5 rounded-md bg-label-accent/15 text-label-accent text-sap-xs font-semibold">Price Mismatch</span>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 mb-5">
        <div>
          <p className="text-sap-sm text-muted-foreground mb-0.5">Sold-to Party</p>
          <p className="text-sap-sm font-medium text-primary">Meridian Frost Ltd (200400012)</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground mb-0.5">Net Value:</p>
          <p className="text-sap-sm font-medium text-foreground">83,240.00 USD</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground mb-0.5">Ship-to Party Data</p>
          <p className="text-sap-sm font-medium text-primary">Meridian Frost Ltd (200400012)</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground mb-0.5">Customer Reference</p>
          <p className="text-sap-sm font-medium text-foreground">PO-2026-HI-00731</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground mb-0.5">Order Reason</p>
          <p className="text-sap-sm font-medium text-foreground">Scheduled Production Run</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground mb-0.5">Address</p>
          <p className="text-sap-sm font-medium text-foreground">47 Industrial Pkwy, Detroit, MI 48201, USA</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground mb-0.5">Requested Delivery Date</p>
          <p className="text-sap-sm font-medium text-foreground">05.05.2026</p>
        </div>
        <div>
          <p className="text-sap-sm text-muted-foreground mb-0.5">Customer Group</p>
          <p className="text-sap-sm font-medium text-foreground">Industrial Accounts (04)</p>
        </div>
      </div>

      {/* Confidence Rating */}
      <div className="rounded-xl border border-[#E6E7EA] bg-white p-4 max-w-[280px] hover:border-[#B5BCCA] hover:shadow-[0_2px_8px_rgba(34,53,72,0.12)] transition-all">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-chat-primary/10 flex items-center justify-center">
            <TrendingUp size={14} className="text-chat-primary" />
          </div>
          <div>
            <p className="text-sap-sm font-semibold text-foreground">Confidence Rating</p>
            <p className="text-sap-sm text-muted-foreground">Trend of rating over 1 year</p>
          </div>
        </div>
        <div className="flex items-end gap-3 mt-2">
          <div>
            <p className="text-xl font-bold text-success">98%</p>
            <p className="text-sap-sm text-muted-foreground">Accuracy</p>
          </div>
          <svg width="120" height="30" viewBox="0 0 120 30" className="text-success/40">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              points="0,25 15,22 30,20 45,18 55,15 65,16 75,12 85,10 95,11 105,8 120,6"
            />
          </svg>
        </div>
      </div>
    </div>

    <MessageActions references={[{ label: "Invoice Processing", count: 3 }]} className="mb-5" />

    {/* Analysis text below invoice card */}
    <div>
    <JouleReplyContent references={[{ label: "Invoice Analysis", count: 2 }]}>
      <p>
        I noticed this invoice has a price mismatch issue on the following line items:
      </p>
      <ol className="list-decimal list-inside space-y-2 pl-1">
        <li>
          <strong>High-Tensile Steel Bolts M12 x 80mm (Box of 500)</strong>
          <p className="pl-5 text-muted-foreground">Invoice price differs from PO by 2.2% — exceeds 2% threshold.</p>
        </li>
        <li>
          <strong>Hydraulic Seal Kit — Type HK-440 Industrial</strong>
          <p className="pl-5 text-muted-foreground">Invoice price differs from PO by 2.5% — exceeds 2% threshold.</p>
        </li>
      </ol>
      <p>
        Price Match Discrepancy is <strong>2.2%</strong> (Line Item 1) and <strong>2.5%</strong> (Line Item 2), with an average discrepancy of <strong>2.35%</strong> — both exceeding the Allowed Price Variance Limit of <strong>2%</strong>. While slightly over allowed price variance, it has been released 5 times in the last 12 months.
      </p>
      <p>
        Do you want me to submit the invoice or do you want me to create a space so that you can manually resolve this issue?
      </p>
    </JouleReplyContent>
    </div>

    {/* Action buttons — hidden once space flow starts */}
    {!spaceCreated && (
      <div className="flex items-center gap-3 mt-2 mb-6">
        <button className="inline-flex items-center justify-center h-8 px-3 rounded-[4px] border border-chat-primary bg-white text-chat-primary text-sap-sm leading-5 hover:bg-chat-primary/5 transition-colors" style={{ fontWeight: 450 }}>
          Submit Invoice
        </button>
        <button
          onClick={handleCreateSpace}
          className="inline-flex items-center justify-center h-8 px-3 rounded-[4px] border border-chat-primary bg-white text-chat-primary text-sap-sm leading-5 hover:bg-chat-primary/5 transition-colors" style={{ fontWeight: 450 }}
        >
          Create Space
        </button>
      </div>
    )}

    {spaceCreated && (
      <>
        {/* User message */}
        <UserMessage className="animate-fade-in">Create Space</UserMessage>

        {!spaceCardVisible ? (
          /* Progress bar loading */
          <div className="rounded-xl border border-[#E6E7EA] bg-white p-4 max-w-[500px] mb-4 animate-fade-in">
            <div className="w-full bg-[hsl(var(--el-neutral-100))] rounded-full h-1.5 overflow-hidden mb-3">
              <div
                className="h-1.5 rounded-full transition-all duration-200 ease-linear"
                style={{
                  width: `${spaceProgress}%`,
                  background: `linear-gradient(90deg, hsl(262, 80%, 72%) 0%, hsl(262, 80%, 72%) ${Math.min(spaceProgress, 60)}%, hsl(262, 60%, 82%) ${Math.min(spaceProgress, 80)}%, hsl(210, 7%, 94%) 100%)`,
                }}
              />
            </div>
            <div className="flex items-center gap-2 text-sap-sm text-muted-foreground">
              <span className="inline-flex gap-0.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--el-purple-600))] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--el-purple-600))] animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--el-purple-600))] animate-pulse [animation-delay:300ms]" />
              </span>
              <span>Creating space...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Divider */}
            <div className="flex items-center gap-3 text-sap-xs text-muted-foreground mb-5 animate-fade-in">
              <div className="flex-1 h-px bg-border" />
              <span className="whitespace-nowrap">Space Mode is active</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <AssistantMessage showActions={false} className="animate-fade-in">
              <p>I've created a dedicated space for this invoice issue. You can review and resolve the price variance there.</p>
            </AssistantMessage>

            <div className="rounded-xl border border-[#E6E7EA] bg-white p-5 max-w-[541px] mb-6 animate-fade-in hover:border-[#B5BCCA] hover:shadow-[0_2px_8px_rgba(34,53,72,0.12)] transition-all">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
                  <img src={spaceIcon} alt="Space" className="w-10 h-10 object-contain" />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="text-sap-base font-semibold text-foreground">New Space created</p>
                  <p className="text-sap-sm text-muted-foreground truncate">A Space was created for Invoice {invoiceNumber}</p>
                  <div className="flex items-center gap-x-3 text-sap-sm text-muted-foreground">
                    <span>Supplier: Meridian Frost Ltd</span>
                    <span>Amount: $83,240</span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate("/invoice", { state: { fromSpace: true, fileName } })}
                      className="text-[#0057D2] text-sap-sm font-semibold hover:text-[#003D99] transition-colors"
                    >
                      View Space
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <MessageActions references={[{ label: "Space Management", count: 2 }]} className="mb-6 animate-fade-in" />
          </>
        )}
      </>
    )}

    <div ref={bottomRef} />
  </div>
  );
};

/* ===== Reusable Bottom Input ===== */
type BottomInputProps = {
  attachedFile: File | null;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
};

const BottomInput = ({ attachedFile, onFileSelect, onRemoveFile }: BottomInputProps) => (
  <div className="w-full">
    <div
      className="rounded-xl border-2 border-transparent p-4"
      style={{
        background: 'linear-gradient(hsl(0 0% 100%), hsl(0 0% 100%)) padding-box, linear-gradient(to right, hsl(216,100%,65%), hsl(262,80%,65%)) border-box',
        boxShadow: '0 22px 14px rgba(0,0,0,0.06), 0 182px 111px rgba(0,0,0,0.05)',
      }}
    >
        <textarea
          placeholder="Can I help with anything else?"
          className="w-full bg-transparent text-sap-sm text-foreground placeholder:text-muted-foreground resize-none outline-none h-7"
          rows={1}
        />
        {attachedFile && (
          <div className="mt-2 flex items-center gap-2 px-1">
            <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-2.5 py-1.5 text-sap-xs text-foreground">
              <FileText size={13} className="shrink-0 text-muted-foreground" />
              <span className="truncate max-w-[180px]">MeridianFrost_INV-2026-03847.pdf</span>
              <button onClick={onRemoveFile} className="ml-0.5 text-muted-foreground hover:text-foreground">
                <X size={12} />
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <JouleAttachmentPopover onFileSelect={onFileSelect} buttonClassName="text-[hsl(var(--el-purple-600))] hover:text-[hsl(var(--el-purple-600))]/80 transition-colors" />
            <button className="text-[hsl(var(--el-purple-600))] hover:text-[hsl(var(--el-purple-600))]/80 transition-colors"><AtSign size={18} /></button>
          </div>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-[hsl(var(--el-purple-600))] hover:bg-[hsl(var(--el-purple-50))] transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
);

export default JoulePage;
