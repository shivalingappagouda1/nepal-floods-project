import React from 'react';
import { Layers } from 'lucide-react';

export const SeverityLegend: React.FC = () => {
  const levels = [
    {
      label: 'CRITICAL',
      color: 'bg-rose-500',
      border: 'border-rose-400',
      description: 'Severe structural destruction / Active debris flow / Imminent evacuation',
    },
    {
      label: 'HIGH',
      color: 'bg-orange-500',
      border: 'border-orange-400',
      description: 'Major inundation / Cut-off access roads / Immediate assistance needed',
    },
    {
      label: 'MODERATE',
      color: 'bg-amber-500',
      border: 'border-amber-400',
      description: 'Partial flooding / Erosion perimeter / Secondary staging',
    },
    {
      label: 'LOW',
      color: 'bg-emerald-500',
      border: 'border-emerald-400',
      description: 'Minor impact / Stable drainage / Continual monitoring',
    },
    {
      label: 'BASELINE INFRASTRUCTURE',
      color: 'bg-sky-500',
      border: 'border-sky-400',
      description: 'OpenStreetMap verified buildings, arterial roads, and medical posts',
    },
  ];

  return (
    <div className="bg-command-card/95 backdrop-blur-md border border-command-border rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-command-border/60">
        <Layers className="w-3.5 h-3.5 text-command-accent-glow" />
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-command-text">
          DISASTER SEVERITY MATRIX
        </span>
      </div>
      <div className="space-y-1.5">
        {levels.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-[10px] font-mono">
            <span className={`w-2.5 h-2.5 rounded-sm ${item.color} border ${item.border} flex-shrink-0`} />
            <span className="font-semibold text-command-text w-20 flex-shrink-0">{item.label}</span>
            <span className="text-command-dim truncate">{item.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
