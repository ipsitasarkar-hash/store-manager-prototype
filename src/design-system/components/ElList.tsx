/**
 * EL-Design System — List Component
 * Maps to Figma: ❖ List
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

const ElList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="list" className={cn('flex flex-col', className)} {...props} />
  )
);
ElList.displayName = 'ElList';

export interface ElListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  disabled?: boolean;
}

const ElListItem = React.forwardRef<HTMLDivElement, ElListItemProps>(
  ({ className, selected, disabled, ...props }, ref) => (
    <div
      ref={ref}
      role="listitem"
      data-state={selected ? 'selected' : undefined}
      aria-disabled={disabled}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 text-el-sm transition-colors cursor-pointer border-b border-el-border last:border-b-0',
        'hover:bg-el-neutral-50-alt',
        selected && 'bg-el-brand-selected',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
);
ElListItem.displayName = 'ElListItem';

export { ElList, ElListItem };
