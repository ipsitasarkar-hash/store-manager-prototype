/**
 * EL-Design System — Toast Component
 * Maps to Figma: ❖ Toast
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const elToastVariants = cva(
  'relative flex items-start gap-3 rounded-el-md border p-4 shadow-el-xl transition-all',
  {
    variants: {
      variant: {
        default: 'bg-el-surface border-el-joule-border text-el-foreground',
        success: 'bg-el-surface border-el-green-200 text-el-foreground',
        error: 'bg-el-surface border-el-red-200 text-el-foreground',
        warning: 'bg-el-surface border-el-orange-200 text-el-foreground',
        info: 'bg-el-surface border-el-blue-200 text-el-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ElToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof elToastVariants> {
  title?: string;
  description?: string;
  onClose?: () => void;
}

const ElToast = React.forwardRef<HTMLDivElement, ElToastProps>(
  ({ className, variant, title, description, onClose, children, ...props }, ref) => (
    <div ref={ref} className={cn(elToastVariants({ variant }), className)} {...props}>
      <div className="flex-1 min-w-0">
        {title && <p className="text-el-sm font-semibold">{title}</p>}
        {description && <p className="text-el-sm text-el-foreground-muted mt-0.5">{description}</p>}
        {children}
      </div>
      {onClose && (
        <button onClick={onClose} className="shrink-0 text-el-foreground-muted hover:text-el-foreground transition-colors rounded-el-xs p-0.5">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
);
ElToast.displayName = 'ElToast';

export { ElToast, elToastVariants };
