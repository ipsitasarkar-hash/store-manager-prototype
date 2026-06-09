/**
 * Message action bar matching Figma ❖ Messages design.
 * Reference pills + action icons (copy, thumbs up/down, retry, audio, share, more).
 */
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Volume2, Share2, MoreHorizontal } from "lucide-react";

interface MessageActionsProps {
  references?: { label: string; count?: number }[];
  className?: string;
}

const MessageActions = ({ references, className = "" }: MessageActionsProps) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {/* Reference pills */}
    {references && references.length > 0 && (
      <div className="flex items-center gap-1.5">
        {references.map((ref, i) => (
          <button
            key={i}
            className="px-3 py-1 rounded-md border border-[hsl(var(--el-neutral-200))] bg-[hsl(var(--el-neutral-50-alt))] text-sap-xs font-medium text-foreground hover:bg-[hsl(var(--el-neutral-100))] transition-colors"
          >
            {ref.label}
          </button>
        ))}
        {references[0]?.count && references[0].count > 0 && (
          <span className="px-2 py-1 rounded-md border border-[hsl(var(--el-neutral-200))] bg-[hsl(var(--el-neutral-50-alt))] text-sap-xs font-medium text-muted-foreground">
            +{references[0].count}
          </span>
        )}
      </div>
    )}

    {/* Action icons */}
    <div className="flex items-center gap-0.5">
      {[
        { icon: Copy, label: "Copy" },
        { icon: ThumbsUp, label: "Like" },
        { icon: ThumbsDown, label: "Dislike" },
        { icon: RotateCcw, label: "Retry" },
        { icon: Volume2, label: "Read aloud" },
        { icon: Share2, label: "Share" },
        { icon: MoreHorizontal, label: "More" },
      ].map(({ icon: Icon, label }) => (
        <button
          key={label}
          title={label}
          className="w-7 h-7 flex items-center justify-center rounded-md text-[hsl(var(--el-neutral-400))] hover:text-foreground hover:bg-[hsl(var(--el-neutral-100))] transition-colors"
        >
          <Icon size={15} strokeWidth={1.8} />
        </button>
      ))}
    </div>
  </div>
);

export default MessageActions;
