/**
 * HIMALAYA-SHIELD: DemoWorkflowBar Component (3-Minute Live Hackathon Demonstration Mode)
 * 
 * Provides an interactive 3-minute executive walkthrough for judges and incident commanders:
 * 1. Real Nepal 2026 event (DHM Station 610, Bhote Koshi/Poiqu Transboundary Basin)
 * 2. Satellite before/after evidence (Sentinel-1 SAR C-Band vs Sentinel-2 Optical)
 * 3. Change detection (MNDWI water expansion & SAR backscatter attenuation)
 * 4. Damage visualization (5 GIS evidence tiers: Miteri Bridge, Larcha Fan, Chaku Hydro)
 * 5. Risk factors (6 explainable factors with configurable weights)
 * 6. Exposed assets (Araniko Highway corridor severance & critical lifelines)
 * 7. Priority ranking (Zone A-E transparent ranking deck)
 * 8. Emergency recommendation (Human-in-the-loop decision-support directives)
 * 9. Source & Confidence (DHM/NDRRMA/ICIMOD citations, "CONFIDENCE: Not available")
 */

import React, { useState } from 'react';
import type { NavigationTab } from '../../types';
import { 
  Compass, 
  Satellite, 
  Building2, 
  Flame, 
  ShieldAlert, 
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';

interface DemoWorkflowBarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const DemoWorkflowBar: React.FC<DemoWorkflowBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const [showPitchGuide, setShowPitchGuide] = useState(false);

  const steps: { 
    tab: NavigationTab; 
    number: string; 
    title: string; 
    subtitle: string; 
    timeWindow: string;
    icon: React.ElementType;
    highlights: string[];
  }[] = [
    {
      tab: 'dashboard',
      number: '01',
      title: 'EOC Brief & 2026 Event',
      subtitle: 'DHM Station 610 Baseline',
      timeWindow: '0:00 - 0:35',
      icon: Compass,
      highlights: [
        'Real 26 August 2026 Nepal-China transboundary surge',
        'DHM Barhabise Gauge Station 610 telemetry reference',
        'Authoritative source citations (DHM, NDRRMA, ICIMOD)'
      ],
    },
    {
      tab: 'satellite',
      number: '02',
      title: 'Satellite & Change Delta',
      subtitle: 'Sentinel-1/2 SAR & Optical',
      timeWindow: '0:35 - 1:10',
      icon: Satellite,
      highlights: [
        'Sentinel-1 SAR C-band all-weather radar penetration',
        'Differential MNDWI water index & coherence loss delta',
        '4.82 km² precomputed change corridor footprint'
      ],
    },
    {
      tab: 'damage',
      number: '03',
      title: 'Damage Assessment',
      subtitle: '5 GIS Evidence Tiers',
      timeWindow: '1:10 - 1:45',
      icon: Building2,
      highlights: [
        '5 standardized image/GIS change categories',
        'Zero structural engineering speculation claims',
        'Feature 184 (Miteri Bridge) & Larcha Confluence Fan'
      ],
    },
    {
      tab: 'risk',
      number: '04',
      title: 'Geospatial Risk Engine',
      subtitle: '6 Transparent Factors',
      timeWindow: '1:45 - 2:20',
      icon: Flame,
      highlights: [
        '6 explainable factors: slope, elevation, rainfall, geology, satellite, history',
        'Configurable multi-criteria decision-support weights',
        'Weight renormalization for missing factor resilience'
      ],
    },
    {
      tab: 'response',
      number: '05',
      title: 'Response & Decision Triage',
      subtitle: 'Human-in-the-Loop Directives',
      timeWindow: '2:20 - 3:00',
      icon: ShieldAlert,
      highlights: [
        'Zone A-E Priority 1/2/3 multi-factor ranking',
        'Route analysis unavailable indicator (No fake times)',
        'Advisory operational recommendation queue'
      ],
    },
  ];

  const currentIdx = steps.findIndex((s) => s.tab === currentTab);

  const handleNext = () => {
    if (currentIdx < steps.length - 1) {
      onSelectTab(steps[currentIdx + 1].tab);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      onSelectTab(steps[currentIdx - 1].tab);
    }
  };

  return (
    <div className="mb-4 bg-command-panel border border-command-border rounded-lg p-3 font-mono shadow-2xl space-y-3">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-command-border/60 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-command-accent-glow font-bold">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="tracking-wider uppercase">3-MINUTE LIVE DEMONSTRATION WORKFLOW:</span>
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-bold bg-amber-950/70 border-amber-700 text-amber-300">
            <Layers className="w-2.5 h-2.5" />
            <span>PRECOMPUTED ANALYSIS / DEMO DATA</span>
          </span>
        </div>

        {/* Stepper Controls & Pitch Guide Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setShowPitchGuide((prev) => !prev)}
            className={`px-2.5 py-1 rounded border text-[10px] font-bold flex items-center gap-1 transition-colors ${
              showPitchGuide
                ? 'bg-command-accent text-white border-command-accent'
                : 'bg-command-surface hover:bg-command-card text-command-muted border-command-border'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            <span>{showPitchGuide ? 'HIDE PITCH GUIDE' : '3-MIN PITCH GUIDE'}</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="p-1 rounded bg-command-surface hover:bg-command-card disabled:opacity-40 disabled:hover:bg-command-surface border border-command-border text-command-text"
              title="Previous Step"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold px-1 text-command-dim">
              {currentIdx + 1}/5
            </span>
            <button
              onClick={handleNext}
              disabled={currentIdx === steps.length - 1}
              className="p-1 rounded bg-command-surface hover:bg-command-card disabled:opacity-40 disabled:hover:bg-command-surface border border-command-border text-command-text"
              title="Next Step"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Step Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentTab === step.tab;

          return (
            <button
              key={step.tab}
              onClick={() => onSelectTab(step.tab)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                isActive
                  ? 'bg-command-surface border-command-accent text-command-text shadow-tactical-glow ring-1 ring-command-accent/60'
                  : 'bg-command-card/70 border-command-border/70 hover:border-command-border hover:bg-command-surface/50 text-command-muted'
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
                  <div className="text-[9px] text-command-dim truncate flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 shrink-0" />
                    <span>{step.timeWindow}</span>
                  </div>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-command-dim/40 hidden xl:block shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive 3-Minute Live Pitch Guide Accordion */}
      {showPitchGuide && (
        <div className="mt-3 p-3.5 rounded-lg bg-command-surface border border-command-accent/40 space-y-2.5 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-command-border/60 pb-1.5 text-sky-400 font-bold">
            <span className="uppercase">Presenter Script & Milestone Checklist (3 Minutes Total):</span>
            <span className="text-[10px] text-command-dim font-normal">Active Milestone: Step {currentIdx + 1} ({steps[currentIdx].timeWindow})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-[11px]">
            {steps.map((s, idx) => (
              <div 
                key={s.tab} 
                onClick={() => onSelectTab(s.tab)}
                className={`p-2.5 rounded border cursor-pointer transition-all space-y-1 ${
                  currentTab === s.tab 
                    ? 'bg-command-panel border-command-accent text-command-text shadow-tactical-glow' 
                    : 'bg-command-card/60 border-command-border/60 text-command-muted hover:border-command-border'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-command-accent-glow">Step {idx + 1}: {s.title}</span>
                  <span className="text-[9px] text-command-dim">{s.timeWindow}</span>
                </div>
                <ul className="space-y-0.5 text-[10px] text-command-dim">
                  {s.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-command-accent-glow font-bold">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
