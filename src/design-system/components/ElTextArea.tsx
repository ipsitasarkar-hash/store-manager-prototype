/**
 * EL-Design System — Text Area Component
 * Maps to Figma: ❖ Text Area
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const elTextAreaVariants = cva(
  'flex w-full bg-el-surface text-el-foreground placeholder:text-el-foreground-muted border transition-colors resize-y focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-el-border-strong focus-visible:ring-2 focus-visible:ring-el-ring',
        error: 'border-el-error focus-visible:ring-2 focus-visible:ring-el-error',
        readonly: 'border-el-border bg-el-neutral-100 cursor-default resize-none',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

export interface ElTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof elTextAreaVariants> {}

const ElTextArea = React.forwardRef<HTMLTextAreaElement, ElTextAreaProps>(
  ({ className, state, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        elTextAreaVariants({ state }),
        'min-h-[80px] px-3 py-2 text-el-sm rounded-el-xs',
        className
      )}
      {...props}
    />
  )
);
ElTextArea.displayName = 'ElTextArea';

export { ElTextArea, elTextAreaVariants };
