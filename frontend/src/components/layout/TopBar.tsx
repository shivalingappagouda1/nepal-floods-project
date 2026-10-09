import React from 'react';
import type { IncidentInfo, SystemStatus, LanguageMode } from '../../types';
import { 
  ShieldAlert, 
  Maximize2, 
  Minimize2, 
  HelpCircle,
  Eye,
  Sliders,
  Languages,
  Radio,
  FileText
} from 'lucide-react';
import { ApiStatusBadge } from '../common/ApiStatusBadge';
import { I18N } from '../../data/i18n';

interface TopBarProps {
  incident: IncidentInfo;
  systemStatus: SystemStatus;
  isMapFocused?: boolean;
  onToggleFocusMap?: () => void;
  isExpertMode?: boolean;
  onToggleExpertMode?: () => void;
  onOpenHowItWorks?: () => void;
  language?: LanguageMode;
  onToggleLanguage?: () => void;
  isDemoMode?: boolean;
  onToggleDemoMode?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  isMapFocused = false,
  onToggleFocusMap,
  isExpertMode = false,
  onToggleExpertMode,
  onOpenHowItWorks,
  language = 'en',
  onToggleLanguage,
  isDemoMode = false,
  onToggleDemoMode,
}) => {
  const t = I18N[language] || I18N.en;

  return (
    <header className="h-14 bg-command-panel/95 backdrop-blur-md border-b border-command-border px-3 sm:px-4 flex items-center justify-between text-xs font-mono select-none z-30 sticky top-0">
      {/* Left: Brand & Incident Identifier */}
      <div className="flex items-center gap-2.5 md:gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-950 border border-command-accent flex items-center justify-center text-command-accent-glow font-extrabold shadow-tactical-glow">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-widest text-sm text-command-text">
                {t.appTitle}
              </span>
            </div>
            <span className="text-[10px] text-command-dim tracking-wider block font-semibold">
              {t.appSubtitle}
            </span>
          </div>
        </div>

        {/* Operational Mode Tag */}
        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-command-border">
          {isDemoMode ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-950/80 border border-amber-700 text-amber-300">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-[11px] tracking-wide">
                {language === 'np' ? 'केस स्टडी डेमो: २६ अगस्ट २०२६' : 'DEMO CASE: 26 AUG 2026 TRANSBOUNDARY CORRIDOR'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-bold text-[11px] tracking-wide">
                {language === 'np' ? 'प्रत्यक्ष नेपाल विपद् निगरानी' : 'LIVE OPERATIONAL NEPAL GIS'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Language, Demo Toggle, View Mode, Help, Focus Map */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Language Switcher (English / नेपाली) */}
        {onToggleLanguage && (
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-command-surface hover:bg-command-border border border-command-border text-command-text hover:text-sky-300 text-xs font-bold transition-all"
            title="Switch language (English / नेपाली)"
          >
            <Languages className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
          </button>
        )}

        {/* Demo Mode Toggle */}
        {onToggleDemoMode && (
          <button
            onClick={onToggleDemoMode}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isDemoMode
                ? 'bg-amber-950 text-amber-200 border-amber-600 shadow-sm'
                : 'bg-command-surface text-command-muted hover:text-command-text border-command-border'
            }`}
            title="Toggle 26 Aug 2026 Case Study Demo Mode"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{isDemoMode ? 'Demo Mode: ON' : 'Demo Mode'}</span>
          </button>
        )}

        {/* HOW IT WORKS Button */}
        {onOpenHowItWorks && (
          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-950/70 hover:bg-sky-900 border border-sky-600/70 text-sky-300 text-xs font-bold transition-all shadow-sm"
            title="Open Plain Language Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">{language === 'np' ? 'मार्गदर्शन' : 'HOW IT WORKS'}</span>
          </button>
        )}

        {/* PUBLIC VIEW vs EXPERT VIEW Mode Toggle */}
        {onToggleExpertMode && (
          <button
            onClick={onToggleExpertMode}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isExpertMode
                ? 'bg-amber-950/80 text-amber-200 border-amber-600/80'
                : 'bg-emerald-950/80 text-emerald-200 border-emerald-600/80'
            }`}
            title={isExpertMode ? 'Switch to Simple Public View' : 'Switch to Technical Expert View'}
          >
            {isExpertMode ? (
              <>
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>EXPERT VIEW</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>PUBLIC VIEW</span>
              </>
            )}
          </button>
        )}

        {/* Live / Fallback Backend API Status */}
        <ApiStatusBadge />

        {/* FOCUS MAP / EXPAND MAP Button */}
        {onToggleFocusMap && (
          <button
            onClick={onToggleFocusMap}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isMapFocused
                ? 'bg-command-accent text-white border-sky-400 shadow-tactical-glow'
                : 'bg-command-surface hover:bg-command-border text-command-accent-glow border-command-border'
            }`}
            title={isMapFocused ? 'Exit Full Map (Restore Panels)' : 'Maximize Map'}
          >
            {isMapFocused ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">RESTORE</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">FOCUS MAP</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};
