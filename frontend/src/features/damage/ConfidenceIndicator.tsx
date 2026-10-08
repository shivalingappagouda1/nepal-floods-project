import React from 'react';

interface ConfidenceIndicatorProps {
  confidence?: number;
  method?: string;
  size?: 'sm' | 'md';
}

/**
 * Provenance-aware Confidence Indicator component.
 * Displays 'CONFIDENCE: Not available' to prevent fabricated AI confidence claims.
 */
export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  size = 'sm',
}) => {
  return (
    <span
      className={`inline-flex items-center font-mono text-command-dim border border-command-border rounded bg-command-panel/80 ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      title="Numerical confidence omitted until empirical ground-truth validation is connected"
    >
      CONFIDENCE: Not available
    </span>
  );
};
