import React from 'react';

interface ConfidenceBadgeProps {
  confidence?: number;
  method?: string;
  size?: 'sm' | 'md';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ 
  size = 'sm' 
}) => {
  return (
    <span 
      className={`inline-flex items-center font-mono text-command-dim border border-command-border rounded bg-command-panel/80 ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
      }`}
      title="Numerical confidence omitted until empirical ground-truth validation is connected"
    >
      CONFIDENCE: Not available
    </span>
  );
};
