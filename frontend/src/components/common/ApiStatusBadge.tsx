/**
 * HIMALAYA-SHIELD: ApiStatusBadge Component
 * 
 * Explicitly surfaces backend connectivity status:
 * - "API CONNECTED" (Green / verified live backend sync)
 * - "LOCAL PROTOTYPE FALLBACK" (Amber / local precomputed baseline)
 */

import React from 'react';
import { useApiConnection } from '../../services/api/useApiConnection';
import { Server, Database } from 'lucide-react';

interface ApiStatusBadgeProps {
  className?: string;
  showIcon?: boolean;
}

export const ApiStatusBadge: React.FC<ApiStatusBadgeProps> = ({
  className = '',
  showIcon = true,
}) => {
  const { status, isConnected } = useApiConnection();

  if (status === 'CHECKING') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono bg-command-panel text-command-dim border-command-border ${className}`}>
        {showIcon && <Server className="w-3 h-3 text-command-dim animate-spin" />}
        <span>CHECKING API...</span>
      </span>
    );
  }

  if (isConnected) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.25)] ${className}`}
        title="Connected to live FastAPI backend service on http://localhost:8000/api"
      >
        {showIcon && <Server className="w-3 h-3 text-emerald-400" />}
        <span>API CONNECTED</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.2)] ${className}`}
      title="FastAPI backend currently unreachable. Operating safely with verified local precomputed prototype datasets."
    >
      {showIcon && <Database className="w-3 h-3 text-amber-400" />}
      <span>LOCAL PROTOTYPE FALLBACK</span>
    </span>
  );
};
