/**
 * HIMALAYA-SHIELD: ApiStatusBadge Component
 * 
 * Explicitly surfaces backend connectivity status:
 * - "API Connected" (Green / verified live backend sync)
 * - "Local Prototype Baseline" (Amber / local precomputed baseline)
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
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-sans bg-slate-100 text-slate-600 border-slate-300 ${className}`}>
        {showIcon && <Server className="w-3 h-3 text-slate-500 animate-spin" />}
        <span>Checking API...</span>
      </span>
    );
  }

  if (isConnected) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-sans font-medium bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700 shadow-sm ${className}`}
        title="Connected to live FastAPI backend service on http://localhost:8000/api"
      >
        {showIcon && <Server className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
        <span>API Connected</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-sans font-medium bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700 shadow-sm ${className}`}
      title="FastAPI backend currently unreachable. Operating safely with verified local precomputed prototype datasets."
    >
      {showIcon && <Database className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
      <span>Local Prototype Data</span>
    </span>
  );
};
