/**
 * Conversation message components matching Figma ❖ Messages design.
 * - UserMessage: right-aligned simple text
 * - AssistantMessage: left-aligned with optional action bar
 * - TimestampDivider: centered timestamp
 */
import { type ReactNode } from "react";
import MessageActions from "./MessageActions";

/* ===== Timestamp Divider ===== */
export const TimestampDivider = ({ label }: { label: string }) => (
  <div className="flex justify-center py-4">
    <span className="text-sap-xs text-muted-foreground font-medium">{label}</span>
  </div>
);

/* ===== User Message ===== */
export const UserMessage = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`flex justify-end mb-5 ${className}`}>
    <div className="text-sap-base text-foreground max-w-[70%] text-right leading-normal bg-[#E6E7EA] px-4 py-2.5 rounded-2xl rounded-br-[2px]">
      {children}
    </div>
  </div>
);

/* ===== Assistant Message ===== */
interface AssistantMessageProps {
  children: ReactNode;
  references?: { label: string; count?: number }[];
  showActions?: boolean;
  className?: string;
}

export const AssistantMessage = ({
  children,
  references = [{ label: "API Migration Tracker", count: 3 }],
  showActions = true,
  className = "",
}: AssistantMessageProps) => (
  <div className={`mb-6 ${className}`}>
    <div className="text-sap-base text-foreground leading-relaxed mb-3 max-w-[85%]">
      {children}
    </div>
    {showActions && (
      <MessageActions references={references} />
    )}
  </div>
);

/* ===== Joule Reply Content (rich text) ===== */
interface JouleReplyContentProps {
  children: ReactNode;
  references?: { label: string; count?: number }[];
  showActions?: boolean;
  className?: string;
}

export const JouleReplyContent = ({
  children,
  references = [{ label: "API Migration Tracker", count: 3 }],
  showActions = true,
  className = "",
}: JouleReplyContentProps) => (
  <div className={`mb-6 ${className}`}>
    <div className="text-sap-base text-foreground leading-relaxed space-y-3 max-w-[85%] mb-3">
      {children}
    </div>
    {showActions && (
      <MessageActions references={references} />
    )}
  </div>
);
