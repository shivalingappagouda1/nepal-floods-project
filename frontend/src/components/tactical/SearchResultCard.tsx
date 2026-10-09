import React, { useState } from 'react';
import type { SearchableLocation } from '../../data/searchLocations';
import type { NavigationTab, LanguageMode } from '../../types';
import { I18N } from '../../data/i18n';
import { 
  MapPin, 
  ShieldAlert, 
  Satellite, 
  Flame, 
  Building2, 
  X,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SearchResultCardProps {
  location: SearchableLocation;
  onNavigateTab: (tab: NavigationTab) => void;
  onClose: () => void;
  language?: LanguageMode;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  location,
  onNavigateTab,
  onClose,
  language = 'en',
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const t = I18N[language] || I18N.en;

  const getRiskTheme = (status: SearchableLocation['riskStatus']) => {
    switch (status) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-950/90 text-rose-300 border-rose-600',
          indicator: language === 'np' ? '🔴 अत्यधिक जोखिम' : '🔴 CRITICAL ALERT',
          border: 'border-rose-600/80',
          glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
          guidanceBg: 'bg-rose-950/40 border-rose-800/80 text-rose-100',
        };
      case 'HIGH':
        return {
          badge: 'bg-orange-950/90 text-orange-300 border-orange-600',
          indicator: language === 'np' ? '🟠 उच्च जोखिम' : '🟠 HIGH RISK',
          border: 'border-orange-600/80',
          glow: 'shadow-[0_0_15px_rgba(249,115,22,0.25)]',
          guidanceBg: 'bg-orange-950/40 border-orange-800/80 text-orange-100',
        };
      case 'MODERATE':
        return {
          badge: 'bg-amber-950/90 text-amber-300 border-amber-600',
          indicator: language === 'np' ? '🟡 मध्यम जोखिम' : '🟡 MODERATE WATCH',
          border: 'border-amber-600/80',
          glow: 'shadow-[0_0_12px_rgba(245,158,11,0.2)]',
          guidanceBg: 'bg-amber-950/40 border-amber-800/80 text-amber-100',
        };
      default:
        return {
          badge: 'bg-emerald-950/90 text-emerald-300 border-emerald-600',
          indicator: language === 'np' ? '🟢 सामान्य' : '🟢 NORMAL / STABLE',
          border: 'border-emerald-600/80',
          glow: '',
          guidanceBg: 'bg-emerald-950/40 border-emerald-800/80 text-emerald-100',
        };
    }
  };

  const theme = getRiskTheme(location.riskStatus);
  const isArea = location.type === 'PROVINCE' || location.type === 'DISTRICT' || !!location.hasActualBoundary;

  return (
    <div className={`bg-command-card/95 backdrop-blur-md border ${theme.border} ${theme.glow} rounded-2xl p-4 font-mono shadow-2xl space-y-3.5 max-w-md w-full animate-in fade-in slide-in-from-top-2 duration-200`}>
      {/* Header: Location Title & Close Button */}
      <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-command-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-command-surface border border-command-border text-command-accent-glow font-bold">
              {location.type}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase ${theme.badge}`}>
              {theme.indicator}
            </span>
          </div>

          <h3 className="text-base font-bold text-command-text flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-command-accent-glow shrink-0" />
            <span>{location.name}</span>
            {location.nepaliName && (
              <span className="text-xs text-command-dim font-normal">
                ({location.nepaliName})
              </span>
            )}
          </h3>

          <div className="text-xs text-command-muted mt-0.5">
            {location.province} {location.district ? `• ${location.district} District` : ''}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-command-dim hover:text-command-text hover:bg-command-surface transition-colors"
          title="Close search result"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Boundary Status Indicator */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-command-panel/80 border border-command-border text-[11px]">
        {isArea ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="text-purple-300 font-bold">
              {language === 'np' ? 'प्रशासनिक क्षेत्र नक्सामा हाइलाइट गरिएको छ' : 'Actual Geographic Boundary Highlighted on Map'}
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-sky-300">
              {language === 'np' ? 'स्थान बिन्दु (गाउँ / बजार निर्देशांक)' : 'Settlement Point Pin (Coordinates Navigation Reference)'}
            </span>
          </>
        )}
      </div>

      {/* Section 1: WHAT IS HAPPENING? */}
      <div className="space-y-1">
        <span className="text-[10px] text-command-dim uppercase font-bold tracking-wider block">
          {t.whatIsHappening}
        </span>
        <p className="text-xs text-command-text leading-relaxed bg-command-panel/80 p-2.5 rounded-xl border border-command-border">
          {location.disasterOverview}
        </p>
      </div>

      {/* Section 2: WHAT SHOULD I DO? (Prominent Decision Support) */}
      <div className={`p-3 rounded-xl border space-y-1.5 ${theme.guidanceBg}`}>
        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{t.whatShouldIDo}</span>
        </div>
        <p className="text-xs font-semibold leading-relaxed">
          {location.whatShouldIDo}
        </p>
        <div className="text-[9px] text-command-dim pt-1 border-t border-command-border/40 italic">
          {t.disclaimer}
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] text-command-dim uppercase font-bold tracking-wider block">
          {language === 'np' ? 'विस्तृत विश्लेषण तहहरू:' : 'EXPLORE SITUATION:'}
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onNavigateTab('satellite')}
            className="px-2 py-2 rounded-xl bg-command-surface hover:bg-command-border border border-command-border text-[11px] font-bold text-command-text hover:text-command-accent-glow flex flex-col items-center justify-center gap-1 transition-all"
            title="Inspect Satellite Before/After Change"
          >
            <Satellite className="w-3.5 h-3.5 text-sky-400" />
            <span>SATELLITE</span>
          </button>

          <button
            onClick={() => onNavigateTab('risk')}
            className="px-2 py-2 rounded-xl bg-command-surface hover:bg-command-border border border-command-border text-[11px] font-bold text-command-text hover:text-amber-300 flex flex-col items-center justify-center gap-1 transition-all"
            title="Evaluate Multi-Factor Risk"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>RISK</span>
          </button>

          <button
            onClick={() => onNavigateTab('damage')}
            className="px-2 py-2 rounded-xl bg-command-surface hover:bg-command-border border border-command-border text-[11px] font-bold text-command-text hover:text-orange-300 flex flex-col items-center justify-center gap-1 transition-all"
            title="Inspect Damaged Assets & Roads"
          >
            <Building2 className="w-3.5 h-3.5 text-orange-400" />
            <span>DAMAGE</span>
          </button>
        </div>
      </div>

      {/* Collapsible Technical Details & Source Citation */}
      <div className="border-t border-command-border/60 pt-2">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full flex items-center justify-between text-[10px] text-command-dim hover:text-command-muted font-bold transition-colors"
        >
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>{language === 'np' ? 'प्राविधिक विवरण र तथ्याङ्क स्रोत' : 'Technical Details & Source Provenance'}</span>
          </span>
          {showTechnicalDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showTechnicalDetails && (
          <div className="mt-2 p-2.5 rounded-xl bg-command-panel/90 border border-command-border space-y-1 text-[10px] text-command-dim">
            <div>Coordinates: <strong className="text-command-text">{location.coordinates[1].toFixed(4)}°N, {location.coordinates[0].toFixed(4)}°E</strong></div>
            <div>Source: <strong className="text-command-text">{location.authoritativeSource}</strong></div>
            <div>Coverage: <strong>{isArea ? 'Verified Boundary Geometry (WGS84)' : 'Geocoded Point Coordinate'}</strong></div>
          </div>
        )}
      </div>
    </div>
  );
};
