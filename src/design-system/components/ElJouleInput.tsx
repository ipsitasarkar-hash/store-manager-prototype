/**
 * EL-Design System — Joule Input Component
 * Maps to Figma: ❖ Joule Input
 */
import * as React from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ElJouleInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSubmit'> {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  leftSlot?: React.ReactNode;
}

const ElJouleInput: React.FC<ElJouleInputProps> = ({
  className, value = '', onChange, onSubmit, placeholder = 'Ask Joule…', disabled, leftSlot, ...props
}) => {
  const [internal, setInternal] = React.useState(value);
  const val = onChange ? value : internal;
  const set = (v: string) => { onChange ? onChange(v) : setInternal(v); };

  const handleSubmit = () => {
    if (val.trim() && onSubmit) {
      onSubmit(val.trim());
      set('');
    }
  };

  return (
    <div
      className={cn(
        'flex items-end gap-2 rounded-el-2xl border border-el-joule-border bg-el-surface p-2 shadow-el-sm transition-shadow focus-within:shadow-el-md focus-within:border-el-joule/40',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {leftSlot}
      <textarea
        value={val}
        onChange={(e) => set(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none bg-transparent text-el-sm text-el-foreground placeholder:text-el-foreground-muted outline-none min-h-[24px] max-h-[120px] py-1 px-2"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !val.trim()}
        className={cn(
          'shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors',
          val.trim()
            ? 'bg-el-joule text-el-joule-foreground hover:bg-el-joule-hover'
            : 'bg-el-neutral-200 text-el-foreground-muted'
        )}
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
};

export { ElJouleInput };
