import React, { useState } from 'react';
import type { SearchableLocation } from '../../data/searchLocations';
import type { NavigationTab, LanguageMode } from '../../types';
import { 
  MapPin, 
  ShieldAlert, 
  Satellite, 
  AlertTriangle, 
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

  const getRiskTheme = (status: SearchableLocation['riskStatus']) => {
    switch (status) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700',
          indicator: language === 'np' ? '🔴 उच्च जोखिम आकलन' : 'Critical Hazard Concern',
          subLabel: 'Model Estimate (Not Confirmed Disaster)',
          border: 'border-rose-300 dark:border-rose-800',
          guidanceBg: 'bg-rose-50/70 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800/80 dark:text-rose-100',
        };
      case 'HIGH':
        return {
          badge: 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-700',
          indicator: language === 'np' ? '🟠 उच्च जोखिम' : 'High Risk Area',
          subLabel: 'Model Estimate (Field Check Required)',
          border: 'border-orange-300 dark:border-orange-800',
          guidanceBg: 'bg-orange-50/70 border-orange-200 text-orange-900 dark:bg-orange-950/40 dark:border-orange-800/80 dark:text-orange-100',
        };
      case 'MODERATE':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700',
          indicator: language === 'np' ? '🟡 मध्यम निगरानी' : 'Moderate Advisory',
          subLabel: 'Advisory Monitoring',
          border: 'border-amber-300 dark:border-amber-800',
          guidanceBg: 'bg-amber-50/70 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/80 dark:text-amber-100',
        };
      default:
        return {
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700',
          indicator: language === 'np' ? '🟢 सामान्य / स्थिर' : 'Normal / Low Concern',
          subLabel: 'Baseline Conditions',
          border: 'border-emerald-300 dark:border-emerald-800',
          guidanceBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800/80 dark:text-emerald-100',
        };
    }
  };

  const theme = getRiskTheme(location.riskStatus);
  const isArea = location.type === 'PROVINCE' || location.type === 'DISTRICT' || !!location.hasActualBoundary;

  return (
    <div className={`bg-white dark:bg-command-card border ${theme.border} rounded-2xl p-4 sm:p-5 font-sans shadow-md space-y-4 max-w-md w-full animate-in fade-in duration-200`}>
      {/* Header: Location Title & Close / Clear Button */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-command-border/70">
        <div>
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-command-surface border border-slate-200 dark:border-command-border text-slate-700 dark:text-command-accent-glow">
              {location.type}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${theme.badge}`}>
              {theme.indicator}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 font-medium">
              Prototype estimate
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-command-text flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-command-accent-glow shrink-0" />
            <span>{location.name}</span>
            {location.nepaliName && (
              <span className="text-xs text-slate-400 dark:text-command-dim font-normal">
                ({location.nepaliName})
              </span>
            )}
          </h3>

          <div className="text-xs text-slate-500 dark:text-command-muted mt-0.5">
            {location.province} {location.district ? `• ${location.district} District` : ''}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-command-dim dark:hover:text-command-text dark:hover:bg-command-surface transition-colors cursor-pointer"
          title="Clear location selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Boundary / Geometry Type Explanation (Requirement 6) */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border text-xs">
        {isArea ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="text-purple-900 dark:text-purple-300 font-medium">
              {language === 'np' ? 'आधिकारिक प्रशासनिक क्षेत्र सिमाना नक्सामा हाइलाइट गरिएको छ' : 'Administrative Boundary: Highlighted on Map'}
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" />
            <span className="text-slate-700 dark:text-sky-300 font-medium">
              {language === 'np' ? 'गाउँ / बजार निर्देशांक बिन्दु (स्थान सन्दर्भ)' : 'Settlement Point Pin: Approximate location coordinate'}
            </span>
          </>
        )}
      </div>

      {/* Section 1: What is happening? */}
      <div className="space-y-1">
        <span className="text-xs text-slate-500 dark:text-command-dim font-semibold block uppercase tracking-wide">
          What is happening here?
        </span>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-command-text leading-relaxed bg-slate-50 dark:bg-command-panel p-3 rounded-xl border border-slate-200 dark:border-command-border">
          {location.disasterOverview}
        </p>
      </div>

      {/* Section 2: What should I do? (Clear separation of guidance) */}
      <div className={`p-3.5 rounded-xl border space-y-2 ${theme.guidanceBg}`}>
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>What should I do?</span>
        </div>
        <p className="text-xs sm:text-sm font-medium leading-relaxed">
          {location.whatShouldIDo}
        </p>
        <div className="text-[11px] text-slate-500 dark:text-command-dim pt-2 border-t border-slate-200/60 dark:border-command-border/40 leading-tight">
          <strong>Important:</strong> This is general automated safety guidance. Always follow explicit verbal instructions and evacuation orders issued by local authorities, Nepal Police, and Nepal Army.
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="space-y-1.5 pt-1">
        <span className="text-xs text-slate-500 dark:text-command-dim font-semibold block uppercase tracking-wide">
          Explore Related Analyses:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onNavigateTab('satellite')}
            className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-slate-700 hover:text-blue-700 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            title="Inspect Satellite Before/After Change"
          >
            <Satellite className="w-4 h-4 text-blue-600" />
            <span>Satellite</span>
          </button>

          <button
            onClick={() => onNavigateTab('risk')}
            className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs font-semibold text-slate-700 hover:text-amber-800 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            title="Evaluate Multi-Factor Risk"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Risk Map</span>
          </button>

          <button
            onClick={() => onNavigateTab('damage')}
            className="p-2 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-xs font-semibold text-slate-700 hover:text-orange-800 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            title="Inspect Damaged Assets & Roads"
          >
            <Building2 className="w-4 h-4 text-orange-600" />
            <span>Damage</span>
          </button>
        </div>
      </div>

      {/* Clear Selection Action & Technical Details */}
      <div className="border-t border-slate-200 dark:border-command-border/60 pt-3 flex items-center justify-between gap-2">
        <button
          onClick={onClose}
          className="text-xs font-semibold text-slate-600 hover:text-red-600 dark:text-command-dim dark:hover:text-red-400 transition-colors cursor-pointer"
        >
          Clear selection
        </button>

        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-command-dim font-medium transition-colors cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showTechnicalDetails ? 'Hide details' : 'Data provenance'}</span>
          {showTechnicalDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {showTechnicalDetails && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-1 text-xs text-slate-600 dark:text-command-dim animate-in slide-in-from-top-1">
          <div>GPS Coordinates: <strong className="text-slate-800 dark:text-command-text">{location.coordinates[1].toFixed(4)}°N, {location.coordinates[0].toFixed(4)}°E</strong></div>
          <div>Authoritative Source: <strong className="text-slate-800 dark:text-command-text">{location.authoritativeSource}</strong></div>
          <div>Reliability Tier: <strong className="text-amber-700 dark:text-amber-300">Model estimate (Prototype demonstration)</strong></div>
          <div>Boundary: <strong>{isArea ? 'geoBoundaries Nepal ADM boundary polygon' : 'Point coordinate reference'}</strong></div>
        </div>
      )}
    </div>
  );
};
