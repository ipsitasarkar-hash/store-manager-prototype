/**
 * EL-Design System — Navigation Component
 * Maps to Figma: ❖ Main Navigation
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const ElNavigation = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cn('flex flex-col bg-el-surface border-r border-el-border h-full', className)} {...props} />
  )
);
ElNavigation.displayName = 'ElNavigation';

const elNavItemVariants = cva(
  'flex items-center gap-3 px-3 py-2 text-el-sm font-medium rounded-el-md transition-colors cursor-pointer [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      state: {
        default: 'text-el-foreground-muted hover:bg-el-neutral-100 hover:text-el-foreground',
        active: 'bg-el-brand-selected text-el-brand',
        disabled: 'text-el-foreground-subtle cursor-not-allowed opacity-50',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

export interface ElNavItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof elNavItemVariants> {}

const ElNavItem = React.forwardRef<HTMLDivElement, ElNavItemProps>(
  ({ className, state, ...props }, ref) => (
    <div ref={ref} className={cn(elNavItemVariants({ state }), className)} {...props} />
  )
);
ElNavItem.displayName = 'ElNavItem';

const ElNavSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1 px-2 py-2', className)} {...props} />
  )
);
ElNavSection.displayName = 'ElNavSection';

const ElNavSectionLabel = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('px-3 py-1 text-el-xs font-semibold text-el-foreground-muted uppercase tracking-wider', className)} {...props} />
  )
);
ElNavSectionLabel.displayName = 'ElNavSectionLabel';

export { ElNavigation, ElNavItem, ElNavSection, ElNavSectionLabel, elNavItemVariants };
