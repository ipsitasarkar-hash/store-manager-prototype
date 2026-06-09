/**
 * EL-Design System — User Menu Component
 * Maps to Figma: ❖ User Menu
 */
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ElAvatar } from './ElAvatar';
import { ElMenu, ElMenuTrigger, ElMenuContent, ElMenuItem, ElMenuSeparator } from './ElMenu';

export interface ElUserMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
  separator?: boolean;
}

export interface ElUserMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  email?: string;
  avatarSrc?: string;
  items: ElUserMenuItem[];
}

const ElUserMenu: React.FC<ElUserMenuProps> = ({ className, name, email, avatarSrc, items }) => (
  <ElMenu>
    <ElMenuTrigger asChild>
      <button className={cn('flex items-center gap-2 rounded-el-full p-1 hover:bg-el-neutral-100 transition-colors', className)}>
        <ElAvatar src={avatarSrc} alt={name} size="sm" />
      </button>
    </ElMenuTrigger>
    <ElMenuContent align="end" className="w-56">
      <div className="px-3 py-2">
        <p className="text-el-sm font-semibold text-el-foreground">{name}</p>
        {email && <p className="text-el-xs text-el-foreground-muted">{email}</p>}
      </div>
      <ElMenuSeparator />
      {items.map((item, idx) =>
        item.separator ? (
          <ElMenuSeparator key={idx} />
        ) : (
          <ElMenuItem
            key={idx}
            onClick={item.onClick}
            className={item.destructive ? 'text-el-error focus:text-el-error' : ''}
          >
            {item.icon}
            {item.label}
          </ElMenuItem>
        )
      )}
    </ElMenuContent>
  </ElMenu>
);

export { ElUserMenu };
