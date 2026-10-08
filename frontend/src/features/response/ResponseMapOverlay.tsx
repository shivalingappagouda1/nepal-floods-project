import React from 'react';
import type { ResponsePriorityTier } from '../../types/response';
import { ShieldAlert, AlertTriangle, AlertOctagon, Layers } from 'lucide-react';

interface ResponseMapOverlayProps {
  selectedTier: ResponsePriorityTier | 'ALL';
  onSelectTier: (tier: ResponsePriorityTier | 'ALL') => void;
  zoneCounts: Record<ResponsePriorityTier, number>;
}

export const ResponseMapOverlay: React.FC<ResponseMapOverlayProps> = ({
  selectedTier,
  onSelectTier,
  zoneCounts,
}) => {
  return (
    <div className="bg-command-card border border-command-border rounded-lg p-3 font-mono text-xs space-y-2.5 shadow-xl">
      <div className="flex items-center justify-between pb-1.5 border-b border-command-border/60">
        <div className="flex items-center gap-1.5 font-bold text-command-text">
          <Layers className="w-3.5 h-3.5 text-command-accent-glow" />
          <span className="uppercase">RESPONSE PRIORITY TIERS</span>
        </div>
        <span className="text-[9px] text-command-dim">DECISION SUPPORT</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {/* All Tiers */}
        <button
          onClick={() => onSelectTier('ALL')}
          className={`p-2 rounded border text-left transition-all ${
            selectedTier === 'ALL'
              ? 'bg-command-accent/20 border-command-accent text-command-text shadow-tactical-glow'
              : 'bg-command-panel/70 border-command-border text-command-muted hover:border-command-border-light'
          }`}
        >
          <div className="text-[9px] uppercase font-bold text-command-dim">ALL SECTORS</div>
          <div className="text-sm font-bold text-command-text">
            {Object.values(zoneCounts).reduce((a, b) => a + b, 0)}
          </div>
        </button>

        {/* Priority 1 */}
        <button
          onClick={() => onSelectTier('PRIORITY_1')}
          className={`p-2 rounded border text-left transition-all ${
            selectedTier === 'PRIORITY_1'
              ? 'bg-rose-950/60 border-rose-600 text-rose-300 shadow-tactical-glow'
              : 'bg-command-panel/70 border-command-border text-command-muted hover:border-rose-800'
          }`}
        >
          <div className="text-[9px] uppercase font-bold text-rose-400 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" />
            <span>PRIORITY 1</span>
          </div>
          <div className="text-sm font-bold text-rose-300">{zoneCounts.PRIORITY_1 || 0}</div>
        </button>

        {/* Priority 2 */}
        <button
          onClick={() => onSelectTier('PRIORITY_2')}
          className={`p-2 rounded border text-left transition-all ${
            selectedTier === 'PRIORITY_2'
              ? 'bg-orange-950/60 border-orange-600 text-orange-300 shadow-tactical-glow'
              : 'bg-command-panel/70 border-command-border text-command-muted hover:border-orange-800'
          }`}
        >
          <div className="text-[9px] uppercase font-bold text-orange-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>PRIORITY 2</span>
          </div>
          <div className="text-sm font-bold text-orange-300">{zoneCounts.PRIORITY_2 || 0}</div>
        </button>

        {/* Priority 3 */}
        <button
          onClick={() => onSelectTier('PRIORITY_3')}
          className={`p-2 rounded border text-left transition-all ${
            selectedTier === 'PRIORITY_3'
              ? 'bg-amber-950/60 border-amber-600 text-amber-300 shadow-tactical-glow'
              : 'bg-command-panel/70 border-command-border text-command-muted hover:border-amber-800'
          }`}
        >
          <div className="text-[9px] uppercase font-bold text-amber-400 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            <span>PRIORITY 3</span>
          </div>
          <div className="text-sm font-bold text-amber-300">{zoneCounts.PRIORITY_3 || 0}</div>
        </button>
      </div>
    </div>
  );
};
