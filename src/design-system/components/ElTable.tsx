/**
 * EL-Design System — Table Component
 * Maps to Figma: ❖ Table
 */
import * as React from 'react';
import { cn } from '@/lib/utils';

const ElTable = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn('w-full caption-bottom text-el-sm', className)} {...props} />
    </div>
  )
);
ElTable.displayName = 'ElTable';

const ElTableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('bg-el-neutral-50-alt [&_tr]:border-b', className)} {...props} />
  )
);
ElTableHeader.displayName = 'ElTableHeader';

const ElTableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
);
ElTableBody.displayName = 'ElTableBody';

const ElTableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn('border-b border-el-border transition-colors hover:bg-el-neutral-50-alt data-[state=selected]:bg-el-brand-selected', className)} {...props} />
  )
);
ElTableRow.displayName = 'ElTableRow';

const ElTableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn('h-10 px-4 text-left align-middle font-semibold text-el-foreground-muted [&:has([role=checkbox])]:pr-0', className)} {...props} />
  )
);
ElTableHead.displayName = 'ElTableHead';

const ElTableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />
  )
);
ElTableCell.displayName = 'ElTableCell';

export { ElTable, ElTableHeader, ElTableBody, ElTableRow, ElTableHead, ElTableCell };
