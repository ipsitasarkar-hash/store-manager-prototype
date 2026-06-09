/**
 * EL-Design System — Illustrated Message Component
 * Maps to Figma: ❖ Illustrated Message
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ElIllustratedMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  illustration?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const ElIllustratedMessage = React.forwardRef<HTMLDivElement, ElIllustratedMessageProps>(
  ({ className, illustration, title, description, actions, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)} {...props}>
      {illustration && <div className="mb-6 text-el-foreground-muted">{illustration}</div>}
      <h3 className="text-el-lg font-semibold text-el-foreground">{title}</h3>
      {description && <p className="text-el-sm text-el-foreground-muted mt-2 max-w-sm">{description}</p>}
      {actions && <div className="flex items-center gap-2 mt-6">{actions}</div>}
    </div>
  )
);
ElIllustratedMessage.displayName = 'ElIllustratedMessage';

export { ElIllustratedMessage };
