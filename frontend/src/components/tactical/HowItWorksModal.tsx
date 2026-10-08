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
      title: 'SEARCH YOUR PLACE',
      desc: 'Type your village, town, district, or province (e.g., Tatopani, Sindhupalchok, Bagmati) into the search bar.',
      icon: Search,
      color: 'text-sky-400 bg-sky-950/80 border-sky-700',
    },
    {
      num: '2',
      title: 'SEE THE HIGHLIGHTED AREA',
      desc: 'The map smoothly flies to your location and highlights the exact boundary or circular reference area.',
      icon: MapPin,
      color: 'text-purple-400 bg-purple-950/80 border-purple-700',
    },
    {
      num: '3',
      title: 'CHECK THE RISK LEVEL',
      desc: 'Look at the color indicator: Red (Very High), Orange (High), Yellow (Moderate), or Green (Normal).',
      icon: AlertTriangle,
      color: 'text-rose-400 bg-rose-950/80 border-rose-700',
    },
    {
      num: '4',
      title: 'SEE WHAT CHANGED',
      desc: 'Compare before and after satellite images with an easy swipe slider to see where water or landslides occurred.',
      icon: Satellite,
      color: 'text-amber-400 bg-amber-950/80 border-amber-700',
    },
    {
      num: '5',
      title: 'CHECK WHAT TO DO',
      desc: 'Read the clear "WHAT SHOULD I DO?" box for practical advice and follow official local emergency directives.',
      icon: ShieldAlert,
      color: 'text-emerald-400 bg-emerald-950/80 border-emerald-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="bg-command-card border border-command-border rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-command-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-950 border border-sky-700 text-command-accent-glow">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-command-text">
                HOW DOES HIMALAYA-SHIELD WORK?
              </h3>
              <p className="text-[10px] text-command-dim">
                5-step guide for residents, responders, and commanders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-command-dim hover:text-command-text hover:bg-command-surface"
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
                className="p-3 rounded-xl bg-command-panel/90 border border-command-border flex items-start gap-3.5 hover:border-command-accent/60 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-sm shrink-0 ${step.color}`}>
                  {step.num}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-command-text flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{step.title}</span>
                  </h4>
                  <p className="text-[11px] text-command-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-command-border flex items-center justify-between">
          <span className="text-[10px] text-command-dim">
            Human-first disaster intelligence platform
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-command-accent hover:bg-sky-500 text-white text-xs font-bold shadow-tactical-glow transition-all"
          >
            GOT IT, LET'S EXPLORE
          </button>
        </div>
      </div>
    </div>
  );
};
