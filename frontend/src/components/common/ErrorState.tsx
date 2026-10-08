import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  error?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "TELEMETRY RETRIEVAL FAULT",
  error = "Failed to communicate with geospatial service endpoint.",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center min-h-[200px] rounded-lg border border-tactical-critical/30 bg-tactical-critical/5">
      <div className="w-10 h-10 rounded-full bg-tactical-critical/10 border border-tactical-critical/30 flex items-center justify-center mb-3 text-tactical-critical">
        <AlertOctagon className="w-5 h-5" />
      </div>
      <h4 className="font-mono text-xs font-semibold uppercase text-tactical-critical tracking-wider">
        {title}
      </h4>
      <p className="text-xs text-command-muted mt-1 max-w-sm font-mono">
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-rose-300 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 rounded transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          RETRY TELEMETRY FETCH
        </button>
      )}
    </div>
  );
};
