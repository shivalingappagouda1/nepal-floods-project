import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Layers,
  HelpCircle
} from 'lucide-react';
import type { LanguageMode } from '../../types';
import { I18N } from '../../data/i18n';

interface HumanMapLegendProps {
  language?: LanguageMode;
}

export const HumanMapLegend: React.FC<HumanMapLegendProps> = ({ language = 'en' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const t = I18N[language] || I18N.en;

  return (
    <div className="bg-command-card/95 backdrop-blur-md border border-command-border rounded-2xl p-3 font-mono shadow-2xl text-xs select-none max-w-xs transition-all">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between gap-2 text-command-text hover:text-command-accent-glow font-bold pb-1 text-[11px]"
      >
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-command-accent-glow" />
          <span>{t.legend}</span>
        </div>
        {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Legend Items */}
      {!isCollapsed && (
        <div className="space-y-1.5 pt-2 border-t border-command-border/50 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] shrink-0" />
            <span className="text-command-text font-bold">
              {language === 'np' ? 'अत्यधिक खतरा / तीव्र विपद् (M ≥ 4.5)' : 'Red: Severe Hazard Alert (M ≥ 4.5)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)] shrink-0" />
            <span className="text-command-text">
              {language === 'np' ? 'उच्च जोखिम / पहिरो तथा गेग्रान' : 'Orange: High Risk / Landslide Scarp'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-command-text">
              {language === 'np' ? 'मध्यम निगरानी / वर्षा केन्द्र' : 'Yellow: Moderate Watch / Weather Station'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded bg-sky-500/70 border border-sky-400 shrink-0" />
            <span className="text-command-text">
              {language === 'np' ? 'नदी तथा बाढी डुबान क्षेत्र' : 'Blue: River Channel & Flood Inundation'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-command-text">
              {language === 'np' ? 'स्वास्थ्य चौकी तथा सुरक्षित संरचना' : 'Green: Health Post / Operational Facility'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded bg-purple-500/60 border border-purple-400 shrink-0" />
            <span className="text-command-text">
              {language === 'np' ? 'चयन गरिएको खोज क्षेत्र (Polygon)' : 'Purple: Selected Administrative Boundary'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 rounded bg-sky-300 border-dashed border-b shrink-0" />
            <span className="text-command-dim">
              {language === 'np' ? 'नेपाल अन्तर्राष्ट्रिय तथा प्रदेश सिमाना' : 'Cyan: Nepal Border & 7 Provinces'}
            </span>
          </div>

          <div className="pt-1.5 border-t border-command-border/40 text-[9px] text-command-dim flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-sky-400 shrink-0" />
            <span>{language === 'np' ? 'प्रत्यक्ष फिड र केस स्टडी स्पष्ट छुट्याइएको छ' : 'Distinguishes Live Feeds from Case Studies'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
