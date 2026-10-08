import React from 'react';
import type { IncidentInfo, SystemStatus } from '../../types';
import { 
  ShieldAlert, 
  Maximize2, 
  Minimize2, 
  UserCheck 
} from 'lucide-react';
import { ApiStatusBadge } from '../common/ApiStatusBadge';

interface TopBarProps {
  incident: IncidentInfo;
  systemStatus: SystemStatus;
  isMapFocused?: boolean;
  onToggleFocusMap?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  isMapFocused = false,
  onToggleFocusMap 
}) => {
  return (
    <header className="h-14 bg-command-panel/95 backdrop-blur border-b border-command-border px-4 flex items-center justify-between text-xs font-mono select-none z-30 sticky top-0">
      {/* Left: Brand & Incident Identifier */}
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-950 border border-command-accent flex items-center justify-center text-command-accent-glow font-extrabold shadow-tactical-glow">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-widest text-sm text-command-text">
                HIMALAYA-SHIELD
              </span>
            </div>
            <span className="text-[10px] text-command-dim tracking-wider block font-semibold">
              DISASTER COMMAND CENTER
            </span>
          </div>
        </div>

        {/* Central Event Tag */}
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-command-border">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/70 border border-rose-800 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold text-[11px] tracking-wide">
              26 AUG 2026 — NEPAL–CHINA FLOOD / DEBRIS EVENT
            </span>
          </div>
        </div>
      </div>

      {/* Right: Key Status Badges & Focus Map Control */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Precomputed Demo Data Badge */}
        <span className="hidden lg:inline-flex items-center px-2 py-1 rounded bg-amber-950/70 border border-amber-800 text-amber-300 text-[10px] font-bold tracking-wide">
          PRECOMPUTED DEMO DATA
        </span>

        {/* Decision Support / Human in the loop */}
        <div 
          className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-sky-950/60 border border-sky-800 text-sky-400 text-[10px] font-bold"
          title="Autonomous execution disabled. Human decision-support only."
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>DECISION SUPPORT</span>
        </div>

        {/* Live / Fallback Backend API Status */}
        <ApiStatusBadge />

        {/* FOCUS MAP / EXPAND MAP Button */}
        {onToggleFocusMap && (
          <button
            onClick={onToggleFocusMap}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isMapFocused
                ? 'bg-command-accent text-white border-sky-400 shadow-tactical-glow'
                : 'bg-command-surface hover:bg-command-border text-command-accent-glow border-command-border'
            }`}
            title={isMapFocused ? 'Exit Focus Map (Restore Panels)' : 'Focus Map (Maximize Map Viewport)'}
          >
            {isMapFocused ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">RESTORE PANELS</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">FOCUS MAP</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
