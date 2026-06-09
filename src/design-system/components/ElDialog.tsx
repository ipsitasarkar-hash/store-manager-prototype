/**
 * EL-Design System — Dialog Component
 * Maps to Figma: ❖ Dialog
 */
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ElDialog = DialogPrimitive.Root;
const ElDialogTrigger = DialogPrimitive.Trigger;
const ElDialogClose = DialogPrimitive.Close;
const ElDialogPortal = DialogPrimitive.Portal;

const ElDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-[var(--el-z-overlay)] bg-el-neutral-black/60 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
ElDialogOverlay.displayName = 'ElDialogOverlay';

const ElDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ElDialogPortal>
    <ElDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-[var(--el-z-modal)] w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
        'bg-el-surface rounded-el-lg shadow-el-lg border border-el-border p-6 gap-4 grid',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-el-xs opacity-70 hover:opacity-100 transition-opacity text-el-foreground-muted">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </ElDialogPortal>
));
ElDialogContent.displayName = 'ElDialogContent';

const ElDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1.5', className)} {...props} />
);

const ElDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex justify-end gap-2 pt-2', className)} {...props} />
);

const ElDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-el-base font-semibold text-el-foreground', className)}
    {...props}
  />
));
ElDialogTitle.displayName = 'ElDialogTitle';

const ElDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-el-sm text-el-foreground-muted', className)}
    {...props}
  />
));
ElDialogDescription.displayName = 'ElDialogDescription';

export {
  ElDialog,
  ElDialogTrigger,
  ElDialogClose,
  ElDialogContent,
  ElDialogHeader,
  ElDialogFooter,
  ElDialogTitle,
  ElDialogDescription,
};
