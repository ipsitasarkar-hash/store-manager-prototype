/**
 * EL-Design System — Messages Component
 * Maps to Figma: ❖ Messages
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ElAvatar } from './ElAvatar';

export interface ElMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  sender: 'user' | 'assistant';
  avatarSrc?: string;
  avatarFallback?: string;
  timestamp?: string;
}

const ElMessage = React.forwardRef<HTMLDivElement, ElMessageProps>(
  ({ className, sender, avatarSrc, avatarFallback, timestamp, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex gap-3',
        sender === 'user' ? 'flex-row-reverse' : 'flex-row',
        className
      )}
      {...props}
    >
      <ElAvatar
        src={avatarSrc}
        fallback={avatarFallback || (sender === 'assistant' ? 'J' : 'U')}
        size="sm"
        className={sender === 'assistant' ? 'bg-el-joule-surface text-el-joule' : 'bg-el-blue-50 text-el-brand'}
      />
      <div className={cn('flex flex-col gap-1 max-w-[80%]', sender === 'user' ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-el-lg px-4 py-2.5 text-el-sm',
            sender === 'user'
              ? 'bg-el-brand text-el-brand-foreground rounded-tr-el-xs'
              : 'bg-el-joule-surface text-el-foreground rounded-tl-el-xs'
          )}
        >
          {children}
        </div>
        {timestamp && <span className="text-[10px] text-el-foreground-muted">{timestamp}</span>}
      </div>
    </div>
  )
);
ElMessage.displayName = 'ElMessage';

export { ElMessage };
