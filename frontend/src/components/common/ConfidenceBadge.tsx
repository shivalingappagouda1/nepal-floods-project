import React from 'react';

interface ConfidenceBadgeProps {
  confidence?: number; // 0.0 to 1.0 or null
  method?: string;
  size?: 'sm' | 'md';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ 
  confidence, 
  method,
  size = 'sm' 
}) => {
  if (confidence === undefined || confidence === null) {
    return (
      <span className="inline-flex items-center text-[10px] font-mono text-command-dim border border-command-border px-1.5 py-0.5 rounded bg-command-panel">
        CONFIDENCE: N/A
      </span>
    );
  }

  const percentage = Math.round(confidence * 100);
  
  let colorClass = 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40';
  if (percentage < 70) {
    colorClass = 'text-amber-400 border-amber-800/60 bg-amber-950/40';
  }
  if (percentage < 50) {
    colorClass = 'text-rose-400 border-rose-800/60 bg-rose-950/40';
  }

  return (
    <div 
      className={`inline-flex items-center gap-1.5 font-mono rounded border ${colorClass} ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      title={method ? `Confidence derived via: ${method}` : 'Confidence score'}
    >
      <span className="text-command-dim text-[9px]">CONF:</span>
      <span className="font-bold">{percentage}%</span>
    </div>
  );
};
