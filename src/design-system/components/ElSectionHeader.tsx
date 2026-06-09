/**
 * EL-Design System — Section Header Component
 * Maps to Figma: ❖ Section Header
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ElSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const ElSectionHeader = React.forwardRef<HTMLDivElement, ElSectionHeaderProps>(
  ({ className, title, subtitle, actions, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between py-3', className)} {...props}>
      <div>
        <h2 className="text-el-base font-semibold text-el-foreground">{title}</h2>
        {subtitle && <p className="text-el-sm text-el-foreground-muted mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
);
ElSectionHeader.displayName = 'ElSectionHeader';

export { ElSectionHeader };
