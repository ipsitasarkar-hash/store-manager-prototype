/**
 * EL-Design System — Tabs / Tabbar Component
 * Maps to Figma: ❖ Tabbar
 */
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

const ElTabs = TabsPrimitive.Root;

const ElTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center gap-1 border-b border-el-border',
      className
    )}
    {...props}
  />
));
ElTabsList.displayName = 'ElTabsList';

const ElTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-2 px-4 py-2 text-el-sm font-medium text-el-foreground-muted',
      'border-b-2 border-transparent transition-colors',
      'hover:text-el-foreground',
      'data-[state=active]:text-el-brand data-[state=active]:border-el-brand',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-el-ring',
      'disabled:opacity-50 disabled:pointer-events-none',
      className
    )}
    {...props}
  />
));
ElTabsTrigger.displayName = 'ElTabsTrigger';

const ElTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-4 focus-visible:outline-none', className)}
    {...props}
  />
));
ElTabsContent.displayName = 'ElTabsContent';

export { ElTabs, ElTabsList, ElTabsTrigger, ElTabsContent };
