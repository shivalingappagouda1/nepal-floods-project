import React from 'react';
import type { NavigationTab } from '../../types';
import { 
  Compass, 
  Satellite, 
  Flame, 
  Building2, 
  ShieldAlert, 
  ChevronRight,
} from 'lucide-react';

interface DemoWorkflowBarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const DemoWorkflowBar: React.FC<DemoWorkflowBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const steps: { 
    tab: NavigationTab; 
    number: string; 
    title: string; 
    sublabel: string;
    icon: React.ElementType;
  }[] = [
    {
      tab: 'dashboard',
      number: '01',
      title: 'EVENT OVERVIEW',
      sublabel: 'Where is the problem?',
      icon: Compass,
    },
    {
      tab: 'satellite',
      number: '02',
      title: 'SEE WHAT CHANGED',
      sublabel: 'Satellite comparison',
      icon: Satellite,
    },
    {
      tab: 'risk',
      number: '03',
      title: 'CHECK RISK',
      sublabel: 'How serious is it?',
      icon: Flame,
    },
    {
      tab: 'damage',
      number: '04',
      title: 'AFFECTED AREAS',
      sublabel: 'Damaged roads & bridges',
      icon: Building2,
    },
    {
      tab: 'response',
      number: '05',
      title: 'PLAN RESPONSE',
      sublabel: 'Emergency assistance',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="mb-3 bg-command-card/90 border border-command-border rounded-lg px-2 py-1.5 flex items-center justify-between font-mono text-xs shadow-md">
      <div className="flex items-center gap-1 sm:gap-2 flex-1 overflow-x-auto py-0.5">
        <span className="text-[10px] text-command-dim uppercase font-bold tracking-wider px-2 hidden lg:inline shrink-0">
          WORKFLOW:
        </span>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentTab === step.tab;

          return (
            <React.Fragment key={step.tab}>
              <button
                onClick={() => onSelectTab(step.tab)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-command-accent text-white shadow-tactical-glow border border-sky-400'
                    : 'text-command-muted hover:text-command-text hover:bg-command-surface border border-transparent'
                }`}
                title={`${step.number} ${step.title} — ${step.sublabel}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-command-dim'}`} />
                <div className="text-left">
                  <span>{step.number} {step.title}</span>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-command-dim shrink-0 hidden sm:inline opacity-40" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
