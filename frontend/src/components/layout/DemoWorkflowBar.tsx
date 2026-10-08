/**
 * HIMALAYA-SHIELD: DemoWorkflowBar Component
 * 
 * Provides an interactive 15-second executive walkthrough for judges and incident commanders:
 * Dashboard → 2026 Case Study → Satellite Evidence → Change Analysis → Damage Assessment → Risk Engine → Lifeline Exposure → Response Priority
 */

import React from 'react';
import type { NavigationTab } from '../../types';
import { 
  Compass, 
  Satellite, 
  Building2, 
  Flame, 
  ShieldAlert, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DemoWorkflowBarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const DemoWorkflowBar: React.FC<DemoWorkflowBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const steps: { tab: NavigationTab; number: string; title: string; subtitle: string; icon: React.ElementType }[] = [
    {
      tab: 'dashboard',
      number: '01',
      title: 'EOC Incident Brief',
      subtitle: '2026 Nepal-China Case',
      icon: Compass,
    },
    {
      tab: 'satellite',
      number: '02',
      title: 'Satellite Analysis',
      subtitle: 'Prototype Imagery (Precomputed)',
      icon: Satellite,
    },
    {
      tab: 'damage',
      number: '03',
      title: 'Damage Assessment',
      subtitle: '5 GIS Evidence Tiers',
      icon: Building2,
    },
    {
      tab: 'risk',
      number: '04',
      title: 'Geospatial Risk Engine',
      subtitle: '6 Transparent Factors',
      icon: Flame,
    },
    {
      tab: 'response',
      number: '05',
      title: 'Response Priority',
      subtitle: 'Decision Support (HITL)',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="mb-4 bg-command-panel/90 border border-command-border/80 rounded-lg p-2.5 font-mono shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-command-border/40 text-[10px]">
        <div className="flex items-center gap-1.5 text-command-accent-glow font-bold">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span className="tracking-wider uppercase">PRIMARY DISASTER INTELLIGENCE WORKFLOW PIPELINE:</span>
        </div>
        <span className="text-command-dim hidden lg:inline">
          Click any phase to navigate direct analytical telemetry
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 mt-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentTab === step.tab;

          return (
            <button
              key={step.tab}
              onClick={() => onSelectTab(step.tab)}
              className={`flex items-center justify-between p-2 rounded border text-left transition-all ${
                isActive
                  ? 'bg-command-surface border-command-accent text-command-text shadow-tactical-glow ring-1 ring-command-accent/50'
                  : 'bg-command-card/60 border-command-border/60 hover:border-command-border hover:bg-command-surface/40 text-command-muted'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 text-xs font-bold ${
                  isActive
                    ? 'bg-command-accent text-white'
                    : 'bg-command-panel border border-command-border text-command-dim'
                }`}>
                  {step.number}
                </div>
                <div className="truncate">
                  <div className={`text-[11px] font-bold truncate flex items-center gap-1 ${
                    isActive ? 'text-command-accent-glow' : 'text-command-text'
                  }`}>
                    <Icon className="w-3 h-3 shrink-0" />
                    <span className="truncate">{step.title}</span>
                  </div>
                  <div className="text-[9px] text-command-dim truncate">
                    {step.subtitle}
                  </div>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-3 h-3 text-command-dim/50 hidden xl:block shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
