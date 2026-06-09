/**
 * EL-Design System — File Uploader Component
 * Maps to Figma: ❖ File Uploader
 */
import * as React from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ElFileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFilesSelected?: (files: FileList) => void;
}

const ElFileUploader = React.forwardRef<HTMLDivElement, ElFileUploaderProps>(
  ({ className, accept, multiple, disabled, onFilesSelected, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = React.useState(false);

    const handleFiles = (files: FileList | null) => {
      if (files && onFilesSelected) onFilesSelected(files);
    };

    return (
      <div
        ref={ref}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (!disabled) handleFiles(e.dataTransfer.files); }}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-el-md border-2 border-dashed px-6 py-8 text-center cursor-pointer transition-colors',
          dragOver ? 'border-el-brand bg-el-blue-50' : 'border-el-border hover:border-el-brand hover:bg-el-neutral-50-alt',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <Upload className="h-8 w-8 text-el-icon-muted" />
        <p className="text-el-sm font-medium text-el-foreground">Drop files here or click to browse</p>
        <p className="text-el-xs text-el-foreground-muted">Supported formats: {accept || 'any'}</p>
      </div>
    );
  }
);
ElFileUploader.displayName = 'ElFileUploader';

export { ElFileUploader };
