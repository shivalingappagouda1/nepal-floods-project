import React from 'react';

interface ConfidenceIndicatorProps {
  confidence?: number;
  method?: string;
  size?: 'sm' | 'md';
}

/**
 * Provenance-aware Confidence Indicator component.
 * If confidence is undefined (no calibrated ground-truth dataset connected),
 * it displays 'CONFIDENCE: Not available' rather than fabricating a percentage.
 */
export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  confidence,
  method,
  size = 'sm',
}) => {
  if (confidence === undefined || confidence === null) {
    return (
      <span
        className="inline-flex items-center text-[10px] font-mono text-command-dim border border-command-border px-2 py-0.5 rounded bg-command-panel/70"
        title="Numerical confidence omitted until empirical ground-truth validation is connected"
      >
        CONFIDENCE: Not available
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
      title={method ? `Calibrated confidence derived via: ${method}` : 'Calibrated confidence score'}
    >
      <span className="text-command-dim text-[9px]">CONFIDENCE:</span>
      <span className="font-bold">{percentage}%</span>
    </div>
  );
};
