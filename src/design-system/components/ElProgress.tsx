/**
 * EL-Design System — Progress Indicator Component
 * Maps to Figma: ❖ Progress Indicator / ❖ Busy Indicator
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const elProgressVariants = cva('relative w-full overflow-hidden rounded-el-full bg-el-neutral-200', {
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface ElProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof elProgressVariants> {
  value?: number;
  max?: number;
  variant?: 'brand' | 'joule' | 'success' | 'warning' | 'error';
}

const variantColors: Record<string, string> = {
  brand: 'bg-el-brand',
  joule: 'bg-el-joule',
  success: 'bg-el-success',
  warning: 'bg-el-warning',
  error: 'bg-el-error',
};

const ElProgress = React.forwardRef<HTMLDivElement, ElProgressProps>(
  ({ className, value = 0, max = 100, size, variant = 'brand', ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div ref={ref} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} className={cn(elProgressVariants({ size }), className)} {...props}>
        <div className={cn('h-full transition-all rounded-el-full', variantColors[variant])} style={{ width: `${pct}%` }} />
      </div>
    );
  }
);
ElProgress.displayName = 'ElProgress';

/** Busy / Spinner indicator */
export interface ElSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'joule';
}

const spinnerSizes: Record<string, string> = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
const spinnerColors: Record<string, string> = { brand: 'text-el-brand', joule: 'text-el-joule' };

const ElSpinner: React.FC<ElSpinnerProps> = ({ className, size = 'md', variant = 'brand', ...props }) => (
  <div role="status" className={cn('inline-flex', className)} {...props}>
    <svg className={cn('animate-spin', spinnerSizes[size], spinnerColors[variant])} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
    </svg>
    <span className="sr-only">Loading…</span>
  </div>
);

export { ElProgress, elProgressVariants, ElSpinner };
