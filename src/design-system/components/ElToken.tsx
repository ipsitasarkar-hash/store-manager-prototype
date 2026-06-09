/**
 * EL-Design System — Token / Tag Component
 * Maps to Figma: ❖ Token
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const elTokenVariants = cva(
  'inline-flex items-center gap-1 rounded-el-full text-el-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        neutral: 'bg-el-neutral-100 text-el-foreground',
        brand: 'bg-el-blue-50 text-el-brand',
        joule: 'bg-el-purple-50 text-el-joule',
        success: 'bg-el-success-surface text-el-green-600',
        warning: 'bg-el-warning-surface text-el-orange-600',
        error: 'bg-el-error-surface text-el-red-600',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5',
        lg: 'px-3 py-1 text-el-sm',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'md' },
  }
);

export interface ElTokenProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof elTokenVariants> {
  onRemove?: () => void;
}

const ElToken = React.forwardRef<HTMLSpanElement, ElTokenProps>(
  ({ className, variant, size, onRemove, children, ...props }, ref) => (
    <span ref={ref} className={cn(elTokenVariants({ variant, size }), className)} {...props}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70 transition-opacity">
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
);
ElToken.displayName = 'ElToken';

export { ElToken, elTokenVariants };
