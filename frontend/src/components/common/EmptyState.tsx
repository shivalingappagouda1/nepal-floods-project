import React from 'react';
import { Layers, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Layers
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[220px] rounded-lg border border-dashed border-command-border bg-command-panel/40">
      <div className="w-10 h-10 rounded-lg bg-command-card border border-command-border flex items-center justify-center mb-3 text-command-dim">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="font-mono text-xs font-semibold uppercase text-command-text tracking-wider">
        {title}
      </h4>
      <p className="text-xs text-command-muted mt-1 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-command-text bg-command-surface hover:bg-command-border border border-command-border rounded transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-command-accent-glow" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
