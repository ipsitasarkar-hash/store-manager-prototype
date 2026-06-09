/**
 * EL-Design System — Avatar Component
 * Maps to Figma: ❖ Avatar
 */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden bg-el-neutral-200 text-el-foreground-muted font-medium select-none',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-el-xs rounded-el-xs',
        sm: 'h-8 w-8 text-el-xs rounded-el-sm',
        md: 'h-10 w-10 text-el-sm rounded-el-md',
        lg: 'h-12 w-12 text-el-base rounded-el-md',
        xl: 'h-16 w-16 text-el-lg rounded-el-lg',
      },
      shape: {
        circle: 'rounded-full',
        square: '',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  }
);

export interface ElAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const ElAvatar = React.forwardRef<HTMLDivElement, ElAvatarProps>(
  ({ className, size, shape, src, alt, fallback, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);

    return (
      <div ref={ref} className={cn(avatarVariants({ size, shape }), className)} {...props}>
        {src && !imgError ? (
          <img
            src={src}
            alt={alt || ''}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{fallback || (alt ? alt.charAt(0).toUpperCase() : '?')}</span>
        )}
      </div>
    );
  }
);
ElAvatar.displayName = 'ElAvatar';

export { ElAvatar, avatarVariants };
