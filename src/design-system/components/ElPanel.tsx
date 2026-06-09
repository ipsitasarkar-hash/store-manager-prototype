/**
 * EL-Design System — Panel Component
 * Maps to Figma: ❖ Panel
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const elPanelVariants = cva(
  'flex flex-col bg-el-surface overflow-hidden',
  {
    variants: {
      position: {
        left: 'border-r border-el-border',
        right: 'border-l border-el-border',
        bottom: 'border-t border-el-border',
        floating: 'border border-el-border rounded-el-lg shadow-el-lg',
      },
    },
    defaultVariants: {
      position: 'right',
    },
  }
);

export interface ElPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof elPanelVariants> {}

const ElPanel = React.forwardRef<HTMLDivElement, ElPanelProps>(
  ({ className, position, ...props }, ref) => (
    <div ref={ref} className={cn(elPanelVariants({ position }), className)} {...props} />
  )
);
ElPanel.displayName = 'ElPanel';

const ElPanelHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between px-4 py-3 border-b border-el-border shrink-0', className)} {...props} />
  )
);
ElPanelHeader.displayName = 'ElPanelHeader';

const ElPanelContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-y-auto', className)} {...props} />
  )
);
ElPanelContent.displayName = 'ElPanelContent';

const ElPanelFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('shrink-0 border-t border-el-border px-4 py-3', className)} {...props} />
  )
);
ElPanelFooter.displayName = 'ElPanelFooter';

export { ElPanel, ElPanelHeader, ElPanelContent, ElPanelFooter, elPanelVariants };
