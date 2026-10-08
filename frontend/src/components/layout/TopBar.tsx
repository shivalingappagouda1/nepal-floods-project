import React, { useState, useEffect } from 'react';
import type { IncidentInfo, SystemStatus } from '../../types';
import { 
  Clock, 
  Radio, 
  ShieldAlert, 
  UserCheck 
} from 'lucide-react';
import { ApiStatusBadge } from '../common/ApiStatusBadge';

interface TopBarProps {
  incident: IncidentInfo;
  systemStatus: SystemStatus;
}

export const TopBar: React.FC<TopBarProps> = ({ incident, systemStatus }) => {
  const [utcTime, setUtcTime] = useState('');
  const [nptTime, setNptTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
      
      // Nepal Time is UTC + 5:45
      const nepalOffset = 5.75 * 60 * 60 * 1000;
      const nepalDate = new Date(now.getTime() + nepalOffset);
      setNptTime(nepalDate.toUTCString().slice(17, 25) + ' NPT');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-command-panel border-b border-command-border px-4 flex items-center justify-between text-xs font-mono select-none z-30">
      {/* Left: Brand & Incident Identifier */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-sky-950 border border-command-accent-glow flex items-center justify-center text-command-accent-glow font-extrabold shadow-tactical-glow">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-widest text-sm text-command-text">
                HIMALAYA-SHIELD
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-command-surface border border-command-border text-command-accent-glow">
                v1.0-EOC
              </span>
            </div>
            <span className="text-[10px] text-command-dim tracking-wider block">
              DISASTER INTELLIGENCE PLATFORM
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-command-border/80">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/70 border border-rose-800/80 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold text-[11px] tracking-wide">
              {incident.code}: {incident.title}
            </span>
          </div>
          <span className="text-[10px] text-command-muted">
            [{incident.region}, {incident.country}]
          </span>
        </div>
      </div>

      {/* Center: Real-time Clocks */}
      <div className="hidden md:flex items-center gap-4 text-command-muted bg-command-card/80 border border-command-border px-3 py-1 rounded-md">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-command-accent-glow" />
          <span className="text-command-text font-bold">{nptTime || '12:00:00 NPT'}</span>
        </div>
        <span className="text-command-dim">|</span>
        <span className="text-[11px]">{utcTime || '06:15:00 UTC'}</span>
      </div>

      {/* Right: Telemetry & Human-in-the-Loop Mode */}
      <div className="flex items-center gap-3">
        <div className="hidden xl:flex items-center gap-2 text-[10px] text-command-dim">
          <span>CRS: <strong className="text-command-text">{systemStatus.activeCrs}</strong></span>
          <span>LATENCY: <strong className="text-emerald-400">{systemStatus.networkLatencyMs}ms</strong></span>
        </div>

        {/* Human in the loop badge */}
        <div 
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-sky-950/50 border border-sky-800/70 text-sky-400 text-[10px]"
          title="Autonomous execution disabled. Human approval required for priority dispatch."
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span className="font-bold hidden sm:inline">DECISION-SUPPORT (HITL)</span>
        </div>

        {/* Explicit Backend API vs Local Fallback Status */}
        <ApiStatusBadge />

        {/* System Online Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-[11px] font-bold">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>{systemStatus.serviceStatus}</span>
        </div>
      </div>
    </header>
  );
};
