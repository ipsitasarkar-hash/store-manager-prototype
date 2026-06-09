/**
 * EL-Design System — Input Component
 * Maps to Figma: ❖ Input
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const elInputVariants = cva(
  'flex w-full bg-el-surface text-el-foreground placeholder:text-el-foreground-muted border transition-colors file:border-0 file:bg-transparent file:text-el-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-el-xs rounded-el-xs',
        md: 'h-9 px-3 text-el-sm rounded-el-xs',
        lg: 'h-10 px-4 text-el-sm rounded-el-sm',
      },
      state: {
        default: 'border-el-border-strong focus-visible:ring-2 focus-visible:ring-el-ring',
        error: 'border-el-error focus-visible:ring-2 focus-visible:ring-el-error',
        success: 'border-el-success focus-visible:ring-2 focus-visible:ring-el-success',
        readonly: 'border-el-border bg-el-neutral-100 cursor-default',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

export interface ElInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof elInputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ElInput = React.forwardRef<HTMLInputElement, ElInputProps>(
  ({ className, size, state, leftIcon, rightIcon, ...props }, ref) => {
    if (leftIcon || rightIcon) {
      return (
        <div className="relative flex items-center w-full">
          {leftIcon && <span className="absolute left-3 text-el-icon-muted [&_svg]:size-4">{leftIcon}</span>}
          <input
            ref={ref}
            className={cn(
              elInputVariants({ size, state }),
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className
            )}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 text-el-icon-muted [&_svg]:size-4">{rightIcon}</span>}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        className={cn(elInputVariants({ size, state }), className)}
        {...props}
      />
    );
  }
);
ElInput.displayName = 'ElInput';

export { ElInput, elInputVariants };
