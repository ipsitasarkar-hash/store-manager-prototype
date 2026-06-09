import { useRef, useState, ChangeEvent } from "react";
import { Plus, Search, Send, X, ChevronDown, AtSign, Link2, Paperclip, FlaskConical, Code2, Layers, GitFork, FileText, MessageSquareText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ElButton } from "@/design-system/components/ElButton";

const ChatPanel = () => {
  const [plusOpen, setPlusOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="w-full md:w-[360px] lg:w-[420px] bg-[#FAFAFA] flex flex-col shrink-0 border-l border-border min-h-0 max-h-[50vh] md:max-h-none shadow-[inset_6px_0_12px_-6px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 md:py-6">
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquareText size={16} className="text-foreground shrink-0" />
          <h2 className="text-sap-sm font-semibold text-foreground truncate">Create Invoice</h2>
        </div>
        <button className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[hsl(var(--el-purple-600))] flex items-center justify-center text-white hover:bg-[hsl(var(--el-purple-600))]/90 transition-colors shadow-md shrink-0">
          <Plus size={18} />
        </button>
      </div>

      {/* Chat content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 md:pt-6 space-y-4 min-h-0">
        {/* User message */}
        <div className="flex justify-end">
          <div className="bg-[#E6E7EA] text-foreground px-4 py-2.5 rounded-2xl rounded-br-[2px] text-sap-sm max-w-[80%]">
            I want to work on the first one.
          </div>
        </div>

        {/* Bot response */}
        <div className="text-sap-sm text-foreground leading-relaxed">
          Got you! To handle a return order you need additional information. I would suggest creating a space for that.
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 text-sap-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          <span className="whitespace-nowrap">Space Mode is active</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Space created notification */}
        <div className="flex items-start gap-3 p-3 rounded-md bg-white border border-border">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--el-purple-50))] flex items-center justify-center shrink-0 mt-0.5">
            <Link2 size={14} className="text-[hsl(var(--el-purple-600))]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sap-sm font-semibold text-foreground">New Space created</p>
            <p className="text-sap-xs text-muted-foreground truncate">A Space was created for Return 13034557</p>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-sap-xs text-muted-foreground">
              <span>Return Order</span>
              <span>Sales</span>
              <span>11:13</span>
              <ElButton variant="brand-tertiary" size="sm" className="ml-auto h-auto p-0">View Space</ElButton>
            </div>
          </div>
        </div>

        {/* Action suggestion */}
        <div className="flex justify-end">
          <div className="bg-[#E6E7EA] text-foreground px-4 py-3 rounded-2xl rounded-br-[2px] text-sap-sm leading-relaxed max-w-[85%]">
            Submit the Invoice and overwrite price variance limit for future invoices for this supplier.
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2">
          <div className="w-full bg-[hsl(var(--el-neutral-100))] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-1.5 rounded-full"
              style={{
                width: "65%",
                background: 'linear-gradient(90deg, hsl(262, 80%, 72%) 0%, hsl(262, 80%, 72%) 40%, hsl(262, 60%, 82%) 60%, hsl(210, 7%, 94%) 100%)',
              }}
            />
          </div>
        </div>

        {/* Status message */}
        <div className="flex items-center gap-2 text-sap-sm text-muted-foreground">
          <span className="inline-flex gap-0.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--el-purple-600))] animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--el-purple-600))] animate-pulse [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--el-purple-600))] animate-pulse [animation-delay:300ms]" />
          </span>
          <span className="truncate">Taking you to your job's configurations.</span>
        </div>
        <div className="flex justify-center">
          <button className="w-7 h-7 rounded-full border border-[hsl(var(--el-neutral-200))] flex items-center justify-center text-[hsl(var(--el-purple-600))] hover:bg-[hsl(var(--el-neutral-100))]">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Input area */}
      <div className="p-3 md:p-4">
        <div
          className="rounded-xl border-2 border-transparent p-4"
          style={{
            background: 'linear-gradient(hsl(0 0% 100%), hsl(0 0% 100%)) padding-box, linear-gradient(to right, hsl(216,100%,65%), hsl(262,80%,65%)) border-box',
            boxShadow: '0 22px 14px rgba(0,0,0,0.06), 0 182px 111px rgba(0,0,0,0.05)',
          }}
        >
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Can I help with anything else?"
            className="w-full bg-transparent text-sap-sm text-foreground placeholder:text-muted-foreground resize-none outline-none h-7"
            rows={1}
          />
          <div className="flex items-center justify-between mt-3">
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
                  <button className="text-[hsl(var(--el-purple-600))] hover:text-[hsl(var(--el-purple-600))]/80 transition-colors"><Plus size={18} /></button>
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
              <button className="text-[hsl(var(--el-purple-600))] hover:text-[hsl(var(--el-purple-600))]/80 transition-colors"><AtSign size={18} /></button>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[hsl(var(--el-purple-50))] text-[hsl(var(--el-purple-600))] text-sap-xs font-medium border border-[hsl(var(--el-purple-200))]">
                <Link2 size={14} />
                <span>Space</span>
                <button className="text-[hsl(var(--el-purple-400))] hover:text-[hsl(var(--el-purple-600))]"><X size={11} /></button>
              </div>
              {uploadedFile && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-muted/60 text-sap-xs text-foreground">
                  <FileText size={13} className="shrink-0 text-muted-foreground" />
                  <span className="truncate max-w-[140px]">{uploadedFile.name}</span>
                  <button onClick={() => setUploadedFile(null)} className="ml-0.5 text-muted-foreground hover:text-foreground">
                    <X size={11} />
                  </button>
                </div>
              )}
            </div>
            <button
              disabled={!message.trim()}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${message.trim() ? "text-[hsl(var(--el-purple-600))] hover:bg-[hsl(var(--el-purple-50))]" : "text-muted-foreground opacity-40 cursor-not-allowed"}`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-3 mb-1">Joule uses AI. Verify results.</p>
      </div>
    </aside>
  );
};

export default ChatPanel;
