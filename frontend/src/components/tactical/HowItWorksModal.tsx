import React from 'react';
import type { NavigationTab } from '../../types';
import { 
  X, 
  Search, 
  MapPin, 
  AlertTriangle, 
  Satellite, 
  ShieldAlert, 
  HelpCircle 
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '1',
      title: 'Search your village, town, or province',
      desc: 'Type the name of any location (e.g. Tatopani, Pokhara, Sindhupalchok, Bagmati) into the top search bar.',
      icon: Search,
      color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/80 dark:border-blue-700 dark:text-blue-300',
    },
    {
      num: '2',
      title: 'See the location on the map',
      desc: 'The map automatically moves to your selected place and shows its province, district, or reference boundary.',
      icon: MapPin,
      color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/80 dark:border-purple-700 dark:text-purple-300',
    },
    {
      num: '3',
      title: 'Check the estimated risk level',
      desc: 'Understand the status: Green (Normal), Yellow (Caution), Orange (High), or Red (Critical concern).',
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/80 dark:border-rose-700 dark:text-rose-300',
    },
    {
      num: '4',
      title: 'Compare satellite before and after views',
      desc: 'In Satellite Images, slide between pre-event and post-event views to see where river flow or landslide changes were detected.',
      icon: Satellite,
      color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/80 dark:border-amber-700 dark:text-amber-300',
    },
    {
      num: '5',
      title: 'Read simple next steps and safety advice',
      desc: 'Look at the "What should I do?" guidance card for clear precautions, and follow all instructions from local authorities.',
      icon: ShieldAlert,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/80 dark:border-emerald-700 dark:text-emerald-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-command-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 dark:bg-sky-950 dark:border-sky-700 dark:text-sky-300">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-command-text">
                How HIMALAYA-SHIELD Works
              </h3>
              <p className="text-xs text-slate-500 dark:text-command-dim">
                A simple 5-step guide for residents and community responders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-command-dim dark:hover:text-command-text hover:bg-slate-100 dark:hover:bg-command-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Steps Grid */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border flex items-start gap-3.5 hover:border-blue-300 transition-colors"
              >
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${step.color}`}>
                  {step.num}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-command-text flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-slate-500 dark:text-command-dim" />
                    <span>{step.title}</span>
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-command-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-command-border flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-command-dim">
            Public disaster safety portal
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
