/**
 * EL-Design System — Label Component
 * Maps to Figma: ❖ Label
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const elLabelVariants = cva('font-medium leading-none select-none', {
  variants: {
    size: {
      sm: 'text-el-xs',
      md: 'text-el-sm',
      lg: 'text-el-base',
    },
    tone: {
      default: 'text-el-foreground',
      muted: 'text-el-foreground-muted',
      brand: 'text-el-brand',
      error: 'text-el-error',
      success: 'text-el-success',
    },
    required: {
      true: "after:content-['*'] after:ml-0.5 after:text-el-error",
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
  },
});

export interface ElLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof elLabelVariants> {}

const ElLabel = React.forwardRef<HTMLLabelElement, ElLabelProps>(
  ({ className, size, tone, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(elLabelVariants({ size, tone, required: required || undefined }), className)}
      {...props}
    />
  )
);
ElLabel.displayName = 'ElLabel';

export { ElLabel, elLabelVariants };
