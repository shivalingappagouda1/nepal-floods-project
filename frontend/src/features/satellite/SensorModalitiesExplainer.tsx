import React, { useState } from 'react';
import { 
  Radar, 
  Sun, 
  Info, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const SensorModalitiesExplainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 font-sans shadow-sm relative">
      {/* Header Toggle */}
      <div 
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-sky-950 text-blue-600 dark:text-sky-400 border border-blue-200 dark:border-sky-700">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-command-text">
              How do these satellites see disasters? (Radar vs Optical)
            </h3>
            <p className="text-xs text-slate-500 dark:text-command-dim">
              Click to understand how satellite images work through monsoon clouds
            </p>
          </div>
        </div>

        <button 
          className="text-slate-500 hover:text-slate-800 dark:text-command-dim dark:hover:text-command-text p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-command-surface"
          aria-label="Toggle sensor explanation"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-command-border/70 space-y-3 text-xs animate-in slide-in-from-top-1">
          {/* 2-Column Sensor Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Sentinel-1 SAR Radar */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-sky-950/20 border border-blue-200 dark:border-sky-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-900 dark:text-sky-300 font-bold">
                  <Radar className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                  <span>Sentinel-1 SAR Radar (Sees Through Clouds)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold">
                  All-Weather
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-sky-100/80 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Penetrates heavy clouds:</strong> Radar beams pass straight through clouds, rain, fog, and nighttime darkness.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Detects standing water:</strong> Calm flood waters bounce radar away like a mirror, creating dark patches on the image.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Mountain shadows:</strong> Very steep Himalayan cliffs can cast radar shadows in narrow gorges.</span>
                </li>
              </ul>
            </div>

            {/* Sentinel-2 / Landsat Optical */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold">
                  <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Sentinel-2 Optical (Natural Color Camera)</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-semibold">
                  Clear Skies Only
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-amber-100/80 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Blocked by clouds:</strong> Optical satellite cameras cannot see through dense monsoon clouds or night.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>High-detail colors:</strong> When skies are clear, provides crisp 10-meter views of mud, rivers, and trees.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Water and vegetation index:</strong> Uses infrared light to separate sediment water from healthy hillside trees.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
