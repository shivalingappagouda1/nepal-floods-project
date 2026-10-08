import React from 'react';
import { Loader2, Radio } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  subtext?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "INITIALIZING GEOSPATIAL TELEMETRY...",
  subtext = "Querying local raster caches and vector indexes" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[220px] rounded-lg border border-command-border bg-command-panel/60">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-command-accent/30 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-command-accent-glow animate-spin" />
        </div>
        <Radio className="w-4 h-4 text-command-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-75" />
      </div>
      <p className="font-mono text-xs font-semibold tracking-wider text-command-text uppercase">
        {message}
      </p>
      <p className="text-[11px] font-mono text-command-muted mt-1 max-w-xs">
        {subtext}
      </p>
    </div>
  );
};
