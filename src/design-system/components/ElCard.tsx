/**
 * EL-Design System — Card Component
 * Maps to Figma: ❖ Card
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const elCardVariants = cva(
  'bg-el-surface text-el-foreground transition-shadow',
  {
    variants: {
      elevation: {
        flat: 'border border-el-border',
        raised: 'shadow-el-md',
        elevated: 'shadow-el-lg',
      },
      radius: {
        md: 'rounded-el-md',
        lg: 'rounded-el-lg',
        xl: 'rounded-el-xl',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-5',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      elevation: 'flat',
      radius: 'lg',
      padding: 'md',
    },
  }
);

export interface ElCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof elCardVariants> {}

const ElCard = React.forwardRef<HTMLDivElement, ElCardProps>(
  ({ className, elevation, radius, padding, ...props }, ref) => (
    <div ref={ref} className={cn(elCardVariants({ elevation, radius, padding }), className)} {...props} />
  )
);
ElCard.displayName = 'ElCard';

const ElCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 pb-4', className)} {...props} />
  )
);
ElCardHeader.displayName = 'ElCardHeader';

const ElCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-el-base font-semibold leading-none', className)} {...props} />
  )
);
ElCardTitle.displayName = 'ElCardTitle';

const ElCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-el-sm text-el-foreground-muted', className)} {...props} />
  )
);
ElCardDescription.displayName = 'ElCardDescription';

const ElCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);
ElCardContent.displayName = 'ElCardContent';

const ElCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
  )
);
ElCardFooter.displayName = 'ElCardFooter';

export { ElCard, ElCardHeader, ElCardTitle, ElCardDescription, ElCardContent, ElCardFooter, elCardVariants };
