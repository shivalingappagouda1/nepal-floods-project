import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Layers 
} from 'lucide-react';

export const HumanMapLegend: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="bg-command-card/95 backdrop-blur-md border border-command-border rounded-xl p-2.5 font-mono shadow-xl text-xs select-none max-w-xs transition-all">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between gap-2 text-command-text hover:text-command-accent-glow font-bold pb-1 text-[11px]"
      >
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-command-accent-glow" />
          <span>MAP LEGEND</span>
        </div>
        {isCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {/* Legend Items */}
      {!isCollapsed && (
        <div className="space-y-1.5 pt-1.5 border-t border-command-border/50 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <span className="text-command-text font-bold">Very High / Critical Risk</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]" />
            <span className="text-command-text">High Risk Area</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-command-text">Moderate Risk</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-command-text">Low Risk / Normal</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded bg-sky-500/70 border border-sky-400" />
            <span className="text-command-text">Flood / Water Surge Mask</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded bg-purple-500/60 border border-purple-400" />
            <span className="text-command-text">Selected Search Area</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 rounded bg-sky-300 border-dashed border-b" />
            <span className="text-command-dim">Nepal Province Boundary</span>
          </div>
        </div>
      )}
    </div>
  );
};
