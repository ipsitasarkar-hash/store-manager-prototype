/**
 * EL-Design System — Canvas / Panes Component
 * Maps to Figma: ❖ Canvas + ❖ Panes
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

/** Canvas — the main content area wrapper */
export interface ElCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gradient background matching SAP Horizon canvas */
  gradient?: boolean;
}

const ElCanvas = React.forwardRef<HTMLDivElement, ElCanvasProps>(
  ({ className, gradient, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex-1 overflow-y-auto',
        gradient ? 'bg-gradient-to-b from-el-neutral-50-alt to-el-neutral-100' : 'bg-el-background',
        className
      )}
      {...props}
    />
  )
);
ElCanvas.displayName = 'ElCanvas';

/** Panes — split layout container */
export interface ElPanesProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
}

const ElPanes = React.forwardRef<HTMLDivElement, ElPanesProps>(
  ({ className, direction = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex overflow-hidden',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
      {...props}
    />
  )
);
ElPanes.displayName = 'ElPanes';

const ElPane = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-hidden', className)} {...props} />
  )
);
ElPane.displayName = 'ElPane';

export { ElCanvas, ElPanes, ElPane };
