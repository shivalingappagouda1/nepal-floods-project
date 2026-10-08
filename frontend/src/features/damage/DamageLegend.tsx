import React from 'react';
import type { DamageCategory } from '../../types/damage';
import { DAMAGE_CATEGORY_CONFIGS } from '../../data/damageConfigs';
import { 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert 
} from 'lucide-react';

export const DamageLegend: React.FC = () => {
  const getIcon = (id: DamageCategory) => {
    switch (id) {
      case 'NO_SIGNIFICANT_CHANGE':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'POSSIBLE_DAMAGE':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'MODERATE_DAMAGE':
        return <AlertCircle className="w-3.5 h-3.5 text-orange-400" />;
      case 'SEVERE_DAMAGE':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      case 'DESTROYED_INACCESSIBLE':
        return <XCircle className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="bg-command-card border border-command-border rounded-lg p-3.5 font-mono shadow-xl space-y-2.5">
      <div className="flex items-center justify-between pb-2 border-b border-command-border">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-command-accent-glow" />
          <h4 className="text-xs font-bold text-command-text uppercase tracking-wider">
            IMAGE & GIS DAMAGE EVIDENCE TIERS
          </h4>
        </div>
        <span className="text-[9px] text-command-dim">
          5 STANDARDIZED LEVELS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {Object.values(DAMAGE_CATEGORY_CONFIGS).map((cfg) => (
          <div
            key={cfg.id}
            className={`p-2 rounded border ${cfg.bgClass} ${cfg.borderClass} space-y-1`}
          >
            <div className="flex items-center gap-1.5">
              {getIcon(cfg.id)}
              <span className={`text-[10px] font-bold ${cfg.colorClass} truncate`}>
                {cfg.label}
              </span>
            </div>
            <p className="text-[9px] text-command-muted leading-tight">
              {cfg.description}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-command-border/60 flex items-center gap-2 text-[10px] text-amber-300/80 bg-amber-950/20 px-2 py-1 rounded">
        <span className="font-bold text-amber-400">LEGAL & SCIENTIFIC NOTICE:</span>
        <span>Categories reflect satellite & GIS change evidence only. They do <strong>NOT</strong> constitute certified on-site structural engineering inspections.</span>
      </div>
    </div>
  );
};
