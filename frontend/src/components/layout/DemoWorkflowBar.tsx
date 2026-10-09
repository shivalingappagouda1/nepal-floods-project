import React from 'react';
import type { NavigationTab } from '../../types';
import { 
  Home, 
  Satellite, 
  AlertTriangle, 
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
      number: '1',
      title: 'Home Overview',
      sublabel: 'Current situation',
      icon: Home,
    },
    {
      tab: 'satellite',
      number: '2',
      title: 'Satellite Images',
      sublabel: 'Before vs after',
      icon: Satellite,
    },
    {
      tab: 'risk',
      number: '3',
      title: 'Risk Map',
      sublabel: 'Hazard assessment',
      icon: AlertTriangle,
    },
    {
      tab: 'damage',
      number: '4',
      title: 'Damage Check',
      sublabel: 'Roads & structures',
      icon: Building2,
    },
    {
      tab: 'response',
      number: '5',
      title: 'Emergency Help',
      sublabel: 'Safety guidance',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="mb-3 bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-xl px-3 py-2 flex items-center justify-between font-sans text-xs shadow-sm">
      <div className="flex items-center gap-2 flex-1 overflow-x-auto py-0.5">
        <span className="text-xs text-slate-500 dark:text-command-dim uppercase font-semibold px-2 hidden lg:inline shrink-0">
          Demo Steps:
        </span>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentTab === step.tab;

          return (
            <React.Fragment key={step.tab}>
              <button
                onClick={() => onSelectTab(step.tab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900 dark:hover:text-command-text hover:bg-slate-100 dark:hover:bg-command-surface'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-command-surface text-slate-700 dark:text-command-dim'
                }`}>
                  {step.number}
                </span>
                <Icon className="w-3.5 h-3.5" />
                <span className="font-semibold">{step.title}</span>
                <span className="text-[11px] opacity-75 hidden xl:inline">({step.sublabel})</span>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-command-dim shrink-0 hidden sm:inline" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
