/**
 * EL-Design System — Search Field Component
 * Maps to Figma: ❖ Search Field
 */
import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ElSearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

const ElSearchField = React.forwardRef<HTMLInputElement, ElSearchFieldProps>(
  ({ className, value, onClear, ...props }, ref) => (
    <div className={cn('relative flex items-center w-full', className)}>
      <Search className="absolute left-3 h-4 w-4 text-el-icon-muted pointer-events-none" />
      <input
        ref={ref}
        type="search"
        value={value}
        className={cn(
          'flex h-9 w-full rounded-el-full border border-el-border bg-el-surface pl-9 pr-9 text-el-sm text-el-foreground',
          'placeholder:text-el-foreground-muted',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-el-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          '[&::-webkit-search-cancel-button]:hidden'
        )}
        {...props}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 text-el-icon-muted hover:text-el-foreground transition-colors"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
);
ElSearchField.displayName = 'ElSearchField';

export { ElSearchField };
