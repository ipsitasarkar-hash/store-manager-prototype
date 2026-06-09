/**
 * EL-Design System — File Tree Component
 * Maps to Figma: ❖ File Tree
 */
import * as React from 'react';
import { ChevronRight, File, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileTreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  icon?: React.ReactNode;
}

export interface ElFileTreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  nodes: FileTreeNode[];
  onSelect?: (node: FileTreeNode) => void;
  selectedId?: string;
}

const ElFileTree: React.FC<ElFileTreeProps> = ({ nodes, onSelect, selectedId, className, ...props }) => (
  <div className={cn('flex flex-col text-el-sm', className)} {...props}>
    {nodes.map((node) => (
      <FileTreeItem key={node.id} node={node} depth={0} onSelect={onSelect} selectedId={selectedId} />
    ))}
  </div>
);

const FileTreeItem: React.FC<{
  node: FileTreeNode;
  depth: number;
  onSelect?: (node: FileTreeNode) => void;
  selectedId?: string;
}> = ({ node, depth, onSelect, selectedId }) => {
  const [open, setOpen] = React.useState(false);
  const isFolder = node.type === 'folder';
  const isSelected = node.id === selectedId;

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) setOpen(!open);
          onSelect?.(node);
        }}
        className={cn(
          'flex items-center gap-1.5 w-full px-2 py-1 rounded-el-xs text-left transition-colors hover:bg-el-neutral-100',
          isSelected && 'bg-el-brand-selected text-el-brand'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder && (
          <ChevronRight className={cn('h-3.5 w-3.5 transition-transform shrink-0', open && 'rotate-90')} />
        )}
        {node.icon || (isFolder ? <Folder className="h-4 w-4 text-el-icon-muted shrink-0" /> : <File className="h-4 w-4 text-el-icon-muted shrink-0" />)}
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder && open && node.children?.map((child) => (
        <FileTreeItem key={child.id} node={child} depth={depth + 1} onSelect={onSelect} selectedId={selectedId} />
      ))}
    </div>
  );
};

export { ElFileTree };
