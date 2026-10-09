import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import type { LanguageMode } from '../../types';
import { I18N } from '../../data/i18n';

interface HumanMapLegendProps {
  language?: LanguageMode;
}

export const HumanMapLegend: React.FC<HumanMapLegendProps> = ({ language = 'en' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTiers, setShowTiers] = useState(false);
  const t = I18N[language] || I18N.en;

  return (
    <div className="bg-white/95 dark:bg-command-card/95 backdrop-blur-md border border-slate-200 dark:border-command-border rounded-2xl p-3.5 font-sans shadow-lg text-xs select-none max-w-sm transition-all">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between gap-2 text-slate-900 dark:text-command-text hover:text-blue-600 font-bold pb-1 text-xs cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-600 dark:text-command-accent-glow" />
          <span>{t.legend}</span>
        </div>
        {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Legend Items */}
      {!isCollapsed && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-command-border/50 text-xs">
          {/* Earthquakes */}
          <div className="flex items-start gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-xs shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-800 dark:text-command-text font-semibold">
                {language === 'np' 
                  ? 'रातो: भूकम्प केन्द्र (M ≥ ४.५, USGS यन्त्र मापन)' 
                  : 'Red Dot: Live Earthquake Epicenter (USGS)'}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-command-dim leading-tight">
                {language === 'np'
                  ? 'ऊर्जा मापन मात्र; स्थानीय क्षति पुष्टि होइन'
                  : 'Instrument reading; not proof of surface damage.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
            <span className="text-slate-700 dark:text-command-text">
              {language === 'np' ? 'सुन्तला: पहिरो तथा गेग्रान बहाव क्षेत्र' : 'Orange: Landslide & Debris Flow Zone'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <span className="text-slate-700 dark:text-command-text">
              {language === 'np' ? 'पहेंलो: मौसम तथा वर्षा केन्द्र (Open-Meteo)' : 'Yellow: Live Rain Station (Open-Meteo)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-2.5 rounded bg-blue-500 shrink-0" />
            <span className="text-slate-700 dark:text-command-text">
              {language === 'np' ? 'नीलो: नदी तथा बाढी डुबान क्षेत्र' : 'Blue: River Channel & Flood Inundation Corridor'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-700 dark:text-command-text">
              {language === 'np' ? 'हरियो: स्वास्थ्य चौकी (आधारभूत तथ्याङ्क)' : 'Green: Health Facility (Baseline Map)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-2.5 rounded bg-purple-500 shrink-0" />
            <span className="text-slate-700 dark:text-command-text">
              {language === 'np' ? 'बैजनी: चयन गरिएको प्रशासनिक सीमा' : 'Purple: Selected Administrative Boundary'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-1 rounded bg-sky-400 shrink-0" />
            <span className="text-slate-500 dark:text-command-dim text-[11px]">
              {language === 'np' ? 'नेपाल सीमा तथा ७ प्रदेशहरू' : 'Cyan Line: Nepal National Border & 7 Provinces'}
            </span>
          </div>

          {/* Reliability Standards Accordion */}
          <div className="pt-2 border-t border-slate-100 dark:border-command-border/40">
            <button
              onClick={() => setShowTiers(!showTiers)}
              className="w-full flex items-center justify-between text-[11px] text-blue-600 dark:text-sky-400 hover:underline font-semibold cursor-pointer"
            >
              <span className="flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{language === 'np' ? 'तथ्याङ्क विश्वसनीयता स्तरहरू' : 'Data Reliability Standards'}</span>
              </span>
              <span>{showTiers ? '▲' : '▼'}</span>
            </button>

            {showTiers && (
              <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border/80 space-y-1.5 text-[11px] text-slate-600 dark:text-command-muted">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold shrink-0">CONFIRMED</span>
                  <span>Ground truth verified by field responders.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-semibold shrink-0">WARNING</span>
                  <span>Official bulletin issued by DHM / NDRRMA.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold shrink-0">MODEL</span>
                  <span>Computer spatial simulation / GIS projection.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-semibold shrink-0">PROTOTYPE</span>
                  <span>Scenario test estimate for demonstration.</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />
            <span>MapLibre GL &bull; Esri Satellite &bull; USGS Live API</span>
          </div>
        </div>
      )}
    </div>
  );
};
