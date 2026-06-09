/**
 * EL-Design System — Button Component
 * Figma: ❖ Button (539:856)
 * Variants: Size (Large/Medium/Small) × Color (Brand/Joule/Neutral) × Type (Primary/Secondary/Tertiary)
 * States: Regular, Hover, Pressed, Disabled (opacity 0.4), Focus (ring + inner shadow)
 */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const elButtonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        /* ── Brand ── */
        'brand-primary': [
          'bg-el-brand text-el-brand-foreground',
          'hover:bg-el-brand-hover',
          'active:bg-el-brand-pressed',
          'focus-visible:ring-el-brand',
        ].join(' '),
        'brand-secondary': [
          'bg-el-surface text-el-brand-hover border border-el-brand-hover',
          'hover:bg-el-blue-50',
          'active:bg-el-blue-100',
          'focus-visible:ring-el-brand',
        ].join(' '),
        'brand-tertiary': [
          'text-el-brand-hover',
          'hover:bg-el-blue-50',
          'active:bg-el-blue-100',
          'focus-visible:ring-el-brand',
        ].join(' '),

        /* ── Joule ── */
        'joule-primary': [
          'bg-el-joule text-el-joule-foreground',
          'hover:bg-el-joule-hover',
          'active:bg-el-joule-pressed',
          'focus-visible:ring-el-joule',
        ].join(' '),
        'joule-secondary': [
          'bg-el-surface text-el-joule border border-el-joule',
          'hover:bg-el-purple-50',
          'active:bg-el-purple-100',
          'focus-visible:ring-el-joule',
        ].join(' '),
        'joule-tertiary': [
          'text-el-joule',
          'hover:bg-el-purple-50',
          'active:bg-el-purple-100',
          'focus-visible:ring-el-joule',
        ].join(' '),

        /* ── Neutral ── */
        'neutral-primary': [
          'text-el-foreground border border-el-neutral-500',
          'hover:bg-el-neutral-100',
          'active:bg-el-neutral-200',
          'focus-visible:ring-el-neutral-500',
        ].join(' '),
        'neutral-secondary': [
          'text-el-foreground border border-el-neutral-500',
          'hover:bg-el-neutral-100',
          'active:bg-el-neutral-200',
          'focus-visible:ring-el-neutral-500',
        ].join(' '),
        'neutral-tertiary': [
          'text-el-foreground',
          'hover:bg-el-neutral-100',
          'active:bg-el-neutral-200',
          'focus-visible:ring-el-neutral-500',
        ].join(' '),

        /* ── Utility ── */
        destructive: [
          'bg-el-error text-el-error-foreground',
          'hover:bg-el-red-600 active:bg-el-red-700',
          'focus-visible:ring-el-error',
        ].join(' '),
        ghost: [
          'text-el-foreground',
          'hover:bg-el-neutral-100 active:bg-el-neutral-200',
        ].join(' '),
        link: 'text-el-brand underline-offset-4 hover:underline',
      },
      size: {
        /* Figma Large: h=40, py=12, px=16, text 16px/22px, radius 8 */
        lg: 'h-10 px-4 py-3 text-base rounded-el-sm [&_svg]:size-5',
        /* Figma Medium: h=36, py=8, px=12, text 14px/20px, radius 8 */
        md: 'h-9 px-3 py-2 text-sm rounded-el-sm [&_svg]:size-4',
        /* Figma Small: h=32, py=4, px=8, text 12px/16px, radius 8 */
        sm: 'h-8 px-2 py-1 text-xs rounded-el-sm [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'brand-primary',
      size: 'md',
    },
  }
);

export interface ElButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof elButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const ElButton = React.forwardRef<HTMLButtonElement, ElButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(elButtonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
ElButton.displayName = 'ElButton';

export { ElButton, elButtonVariants };
