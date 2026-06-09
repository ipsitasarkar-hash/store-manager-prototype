/**
 * EL-Design System — Status / Badge Component
 * Maps to Figma: ❖ Status
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const elStatusVariants = cva(
  'inline-flex items-center gap-1.5 font-medium select-none',
  {
    variants: {
      variant: {
        success: 'text-el-success',
        warning: 'text-el-warning',
        error: 'text-el-error',
        info: 'text-el-info',
        neutral: 'text-el-foreground-muted',
      },
      size: {
        sm: 'text-el-xs',
        md: 'text-el-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
);

export interface ElStatusProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof elStatusVariants> {
  dot?: boolean;
}

const ElStatus = React.forwardRef<HTMLSpanElement, ElStatusProps>(
  ({ className, variant, size, dot = true, children, ...props }, ref) => (
    <span ref={ref} className={cn(elStatusVariants({ variant, size }), className)} {...props}>
      {dot && <span className="h-2 w-2 rounded-full bg-current shrink-0" />}
      {children}
    </span>
  )
);
ElStatus.displayName = 'ElStatus';

const elBadgeVariants = cva(
  'inline-flex items-center rounded-el-full px-2.5 py-0.5 text-el-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        brand: 'bg-el-blue-50 text-el-brand',
        joule: 'bg-el-purple-50 text-el-joule',
        success: 'bg-el-success-surface text-el-green-600',
        warning: 'bg-el-warning-surface text-el-orange-600',
        error: 'bg-el-error-surface text-el-red-600',
        neutral: 'bg-el-neutral-100 text-el-foreground-muted',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface ElBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof elBadgeVariants> {}

const ElBadge = React.forwardRef<HTMLSpanElement, ElBadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(elBadgeVariants({ variant }), className)} {...props} />
  )
);
ElBadge.displayName = 'ElBadge';

export { ElStatus, elStatusVariants, ElBadge, elBadgeVariants };
