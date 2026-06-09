/**
 * EL-Design System — Notification Component
 * Maps to Figma: ❖ Notifications
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

const elNotificationVariants = cva(
  'flex items-start gap-3 rounded-el-md border p-4',
  {
    variants: {
      variant: {
        info: 'bg-el-info-surface border-el-blue-200',
        success: 'bg-el-success-surface border-el-green-200',
        warning: 'bg-el-warning-surface border-el-orange-200',
        error: 'bg-el-error-surface border-el-red-200',
      },
    },
    defaultVariants: { variant: 'info' },
  }
);

const iconMap = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: AlertCircle };
const iconColors = { info: 'text-el-info', success: 'text-el-success', warning: 'text-el-warning', error: 'text-el-error' };

export interface ElNotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof elNotificationVariants> {
  title?: string;
  description?: string;
  onClose?: () => void;
}

const ElNotification = React.forwardRef<HTMLDivElement, ElNotificationProps>(
  ({ className, variant = 'info', title, description, onClose, children, ...props }, ref) => {
    const Icon = iconMap[variant!];
    return (
      <div ref={ref} className={cn(elNotificationVariants({ variant }), className)} {...props}>
        <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconColors[variant!])} />
        <div className="flex-1 min-w-0">
          {title && <p className="text-el-sm font-semibold text-el-foreground">{title}</p>}
          {description && <p className="text-el-sm text-el-foreground-muted mt-0.5">{description}</p>}
          {children}
        </div>
        {onClose && (
          <button onClick={onClose} className="shrink-0 text-el-foreground-muted hover:text-el-foreground rounded-el-xs p-0.5">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
ElNotification.displayName = 'ElNotification';

export { ElNotification, elNotificationVariants };
