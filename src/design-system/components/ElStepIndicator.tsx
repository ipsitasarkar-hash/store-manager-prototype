/**
 * EL-Design System — Step Indicator Component
 * Maps to Figma: ❖ Step Indicator
 */
import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ElStepIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: { label: string; description?: string }[];
  currentStep: number;
}

const ElStepIndicator: React.FC<ElStepIndicatorProps> = ({ steps, currentStep, className, ...props }) => (
  <div className={cn('flex items-center gap-2', className)} {...props}>
    {steps.map((step, idx) => {
      const isCompleted = idx < currentStep;
      const isCurrent = idx === currentStep;
      return (
        <React.Fragment key={idx}>
          {idx > 0 && <div className={cn('flex-1 h-px', isCompleted ? 'bg-el-brand' : 'bg-el-border')} />}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center justify-center h-7 w-7 rounded-full text-el-xs font-semibold shrink-0 transition-colors',
                isCompleted && 'bg-el-brand text-el-brand-foreground',
                isCurrent && 'border-2 border-el-brand text-el-brand bg-el-surface',
                !isCompleted && !isCurrent && 'border border-el-border text-el-foreground-muted bg-el-surface'
              )}
            >
              {isCompleted ? <Check className="h-3.5 w-3.5" /> : idx + 1}
            </div>
            <div className="hidden sm:block">
              <p className={cn('text-el-xs font-medium', isCurrent ? 'text-el-foreground' : 'text-el-foreground-muted')}>{step.label}</p>
              {step.description && <p className="text-el-xs text-el-foreground-subtle">{step.description}</p>}
            </div>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

export { ElStepIndicator };
