/**
 * EL-Design System — Icon Button Component
 * Figma: ❖ Icon Button (554:2676)
 * Icon-only square button. Same color variants as ElButton.
 * Sizes: Large (40×40, p=10), Medium (36×36, p=8), Small (32×32, p=6)
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const elIconButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
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
          'hover:bg-el-brand-hover active:bg-el-brand-pressed',
          'focus-visible:ring-el-brand',
        ].join(' '),
        'brand-secondary': [
          'bg-el-surface text-el-brand-hover border border-el-brand-hover',
          'hover:bg-el-blue-50 active:bg-el-blue-100',
          'focus-visible:ring-el-brand',
        ].join(' '),
        'brand-tertiary': [
          'text-el-brand-hover',
          'hover:bg-el-blue-50 active:bg-el-blue-100',
          'focus-visible:ring-el-brand',
        ].join(' '),

        /* ── Joule ── */
        'joule-primary': [
          'bg-el-joule text-el-joule-foreground',
          'hover:bg-el-joule-hover active:bg-el-joule-pressed',
          'focus-visible:ring-el-joule',
        ].join(' '),
        'joule-secondary': [
          'bg-el-surface text-el-joule border border-el-joule',
          'hover:bg-el-purple-50 active:bg-el-purple-100',
          'focus-visible:ring-el-joule',
        ].join(' '),
        'joule-tertiary': [
          'text-el-joule',
          'hover:bg-el-purple-50 active:bg-el-purple-100',
          'focus-visible:ring-el-joule',
        ].join(' '),

        /* ── Neutral ── */
        'neutral-primary': [
          'text-el-foreground border border-el-neutral-500',
          'hover:bg-el-neutral-100 active:bg-el-neutral-200',
          'focus-visible:ring-el-neutral-500',
        ].join(' '),
        'neutral-secondary': [
          'text-el-foreground border border-el-neutral-500',
          'hover:bg-el-neutral-100 active:bg-el-neutral-200',
          'focus-visible:ring-el-neutral-500',
        ].join(' '),
        'neutral-tertiary': [
          'text-el-foreground',
          'hover:bg-el-neutral-100 active:bg-el-neutral-200',
          'focus-visible:ring-el-neutral-500',
        ].join(' '),

        /* ── Utility ── */
        ghost: [
          'text-el-foreground',
          'hover:bg-el-neutral-100 active:bg-el-neutral-200',
        ].join(' '),
      },
      size: {
        /* Figma Large: 40×40, padding 10 */
        lg: 'h-10 w-10 rounded-el-sm [&_svg]:size-5',
        /* Figma Medium: 36×36, padding 8 */
        md: 'h-9 w-9 rounded-el-sm [&_svg]:size-5',
        /* Figma Small: 32×32, padding 6 */
        sm: 'h-8 w-8 rounded-el-sm [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'brand-primary',
      size: 'md',
    },
  }
);

export interface ElIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof elIconButtonVariants> {
  'aria-label': string;
}

const ElIconButton = React.forwardRef<HTMLButtonElement, ElIconButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <button
      className={cn(elIconButtonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
);
ElIconButton.displayName = 'ElIconButton';

export { ElIconButton, elIconButtonVariants };
