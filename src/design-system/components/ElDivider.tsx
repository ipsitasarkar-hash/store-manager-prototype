/**
 * EL-Design System — Line Divider Component
 * Maps to Figma: ❖ Line Divider
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ElDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

const ElDivider = React.forwardRef<HTMLDivElement, ElDividerProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-el-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      {...props}
    />
  )
);
ElDivider.displayName = 'ElDivider';

export { ElDivider };
