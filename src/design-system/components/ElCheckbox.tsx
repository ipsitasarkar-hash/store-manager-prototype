/**
 * EL-Design System — Checkbox Component
 * Maps to Figma: ❖ Checkbox
 */
import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ElCheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const ElCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  ElCheckboxProps
>(({ className, indeterminate, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-el-xs border border-el-border-strong bg-el-surface transition-colors',
      'data-[state=checked]:bg-el-brand data-[state=checked]:border-el-brand data-[state=checked]:text-el-brand-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-el-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {indeterminate ? <Minus className="h-3 w-3" /> : <Check className="h-3 w-3" />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
ElCheckbox.displayName = 'ElCheckbox';

export { ElCheckbox };
