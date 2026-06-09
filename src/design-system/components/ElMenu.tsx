/**
 * EL-Design System — Menu Component
 * Maps to Figma: ❖ Menu
 */
import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const ElMenu = DropdownMenuPrimitive.Root;
const ElMenuTrigger = DropdownMenuPrimitive.Trigger;
const ElMenuGroup = DropdownMenuPrimitive.Group;
const ElMenuSub = DropdownMenuPrimitive.Sub;

const ElMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-[var(--el-z-dropdown)] min-w-[180px] overflow-hidden rounded-el-md border border-el-border bg-el-surface p-1 shadow-el-lg text-el-foreground',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
ElMenuContent.displayName = 'ElMenuContent';

const ElMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex items-center gap-2 rounded-el-xs px-2 py-1.5 text-el-sm cursor-pointer select-none outline-none transition-colors',
      'hover:bg-el-neutral-100 focus:bg-el-neutral-100',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      '[&_svg]:size-4 [&_svg]:shrink-0',
      className
    )}
    {...props}
  />
));
ElMenuItem.displayName = 'ElMenuItem';

const ElMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-el-border', className)}
    {...props}
  />
));
ElMenuSeparator.displayName = 'ElMenuSeparator';

const ElMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-el-xs font-semibold text-el-foreground-muted', className)}
    {...props}
  />
));
ElMenuLabel.displayName = 'ElMenuLabel';

const ElMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex items-center rounded-el-xs py-1.5 pl-8 pr-2 text-el-sm cursor-pointer select-none outline-none transition-colors',
      'hover:bg-el-neutral-100 focus:bg-el-neutral-100',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
ElMenuCheckboxItem.displayName = 'ElMenuCheckboxItem';

const ElMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex items-center rounded-el-xs px-2 py-1.5 text-el-sm cursor-pointer select-none outline-none',
      'hover:bg-el-neutral-100 focus:bg-el-neutral-100',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
ElMenuSubTrigger.displayName = 'ElMenuSubTrigger';

const ElMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-[var(--el-z-dropdown)] min-w-[180px] overflow-hidden rounded-el-md border border-el-border bg-el-surface p-1 shadow-el-lg',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      className
    )}
    {...props}
  />
));
ElMenuSubContent.displayName = 'ElMenuSubContent';

export {
  ElMenu, ElMenuTrigger, ElMenuContent, ElMenuItem, ElMenuGroup,
  ElMenuSeparator, ElMenuLabel, ElMenuCheckboxItem,
  ElMenuSub, ElMenuSubTrigger, ElMenuSubContent,
};
