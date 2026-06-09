/**
 * EL-Design System — Link Component
 * Maps to Figma: ❖ Link
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const elLinkVariants = cva(
  'inline-flex items-center gap-1 underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-el-ring rounded-el-xs',
  {
    variants: {
      variant: {
        brand: 'text-el-brand hover:text-el-brand-hover hover:underline',
        joule: 'text-el-joule hover:text-el-joule-hover hover:underline',
        subtle: 'text-el-foreground-muted hover:text-el-foreground hover:underline',
        default: 'text-el-foreground hover:text-el-brand hover:underline',
      },
      size: {
        sm: 'text-el-xs',
        md: 'text-el-sm',
        lg: 'text-el-base',
      },
    },
    defaultVariants: {
      variant: 'brand',
      size: 'md',
    },
  }
);

export interface ElLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof elLinkVariants> {}

const ElLink = React.forwardRef<HTMLAnchorElement, ElLinkProps>(
  ({ className, variant, size, ...props }, ref) => (
    <a ref={ref} className={cn(elLinkVariants({ variant, size }), className)} {...props} />
  )
);
ElLink.displayName = 'ElLink';

export { ElLink, elLinkVariants };
