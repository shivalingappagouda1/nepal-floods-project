import React, { useState } from 'react';
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
  FileText,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sun,
  Moon
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
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  basemapStatus?: 'OPERATIONAL' | 'DEGRADED' | 'DISCONNECTED';
  basemapProvider?: string;
  boundariesStatus?: 'OPERATIONAL' | 'UNAVAILABLE';
  liveFeedsStatus?: 'OPERATIONAL' | 'DEGRADED' | 'DISCONNECTED' | 'CHECKING';
  liveEarthquakesCount?: number;
  liveWeatherCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  incident: _incident,
  systemStatus: _systemStatus,
  isMapFocused = false,
  onToggleFocusMap,
  isExpertMode = false,
  onToggleExpertMode,
  onOpenHowItWorks,
  language = 'en',
  onToggleLanguage,
  isDemoMode = false,
  onToggleDemoMode,
  theme = 'light',
  onToggleTheme,
  basemapStatus = 'OPERATIONAL',
  basemapProvider = 'OpenFreeMap Tactical (Vector)',
  boundariesStatus = 'OPERATIONAL',
  liveFeedsStatus = 'OPERATIONAL',
  liveEarthquakesCount = 0,
  liveWeatherCount = 0,
}) => {
  const [showTelemetryDrawer, setShowTelemetryDrawer] = useState(false);
  const t = I18N[language] || I18N.en;

  const isBasemapHealthy = basemapStatus === 'OPERATIONAL';
  const isFeedsHealthy = liveFeedsStatus === 'OPERATIONAL';
  const isFeedsDisconnected = liveFeedsStatus === 'DISCONNECTED';

  return (
    <header className="bg-white/95 dark:bg-command-panel/95 backdrop-blur-md border-b border-slate-200 dark:border-command-border px-3 sm:px-5 py-2.5 font-sans select-none z-30 sticky top-0 transition-colors">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900 dark:text-command-text tracking-tight">
                {t.appTitle}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-command-dim block font-medium">
              {t.appSubtitle}
            </span>
          </div>

          {/* Operational Status synthesis */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-command-border">
            {isDemoMode ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300">
                <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold text-xs">
                  {language === 'np' ? 'केस स्टडी डेमो: २६ अगस्ट २०२६' : 'Case Study: 26 Aug 2026 Flood Corridor'}
                </span>
              </div>
            ) : isFeedsDisconnected || !isBasemapHealthy ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span className="font-semibold text-xs">
                  {language === 'np' ? 'केही फिडहरू विच्छेद भएका छन्' : 'Some Data Feeds Offline'}
                </span>
              </div>
            ) : (
              <button
                onClick={() => setShowTelemetryDrawer(!showTelemetryDrawer)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                title="View data sources and service connectivity status"
              >
                <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                <span className="font-semibold text-xs">
                  {language === 'np' ? 'प्रणाली स्थिति: प्रत्यक्ष' : 'System: Live Status'}
                </span>
                {showTelemetryDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Center: Live Connectivity indicators */}
        <div className="hidden xl:flex items-center gap-2 text-xs">
          {/* Basemap Connection Indicator */}
          <div 
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 ${
              isBasemapHealthy 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-700 dark:text-emerald-300' 
                : 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/80 dark:border-rose-700 dark:text-rose-300'
            }`}
            title={`Basemap Tile Provider: ${basemapProvider}`}
          >
            <span className={`w-2 h-2 rounded-full ${isBasemapHealthy ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`} />
            <span>Map: {isBasemapHealthy ? 'Online' : 'Offline'}</span>
          </div>

          {/* Boundaries Dataset */}
          <div 
            className="px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-700 dark:text-emerald-300"
            title="Nepal 7 Provinces and 77 Districts official boundaries loaded"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Boundaries: {boundariesStatus === 'OPERATIONAL' ? 'Nepal 7 Provinces' : 'Unavailable'}</span>
          </div>

          {/* Live Feeds */}
          <div 
            className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 ${
              isFeedsHealthy 
                ? 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-sky-950/80 dark:border-sky-700 dark:text-sky-300' 
                : isFeedsDisconnected
                ? 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/80 dark:border-rose-700 dark:text-rose-300'
                : 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/80 dark:border-amber-700 dark:text-amber-300'
            }`}
            title={isFeedsHealthy ? `Live Feeds Connected: ${liveEarthquakesCount} USGS earthquakes, ${liveWeatherCount} Weather stations` : 'Live feeds checking or disconnected'}
          >
            <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            <span>
              {isFeedsHealthy 
                ? `Live: ${liveEarthquakesCount} Quakes • ${liveWeatherCount} Weather` 
                : isFeedsDisconnected
                ? 'Live Feeds: Disconnected'
                : 'Live Feeds: Checking...'}
            </span>
          </div>

          <ApiStatusBadge />
        </div>

        {/* Right: Actions & Controls */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden md:inline">Dark</span>
                </>
              )}
            </button>
          )}

          {/* Language Switcher */}
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
              title="Switch language (English / नेपाली)"
            >
              <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
              <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
            </button>
          )}

          {/* How It Works Button */}
          {onOpenHowItWorks && (
            <button
              onClick={onOpenHowItWorks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 dark:bg-blue-950/70 dark:hover:bg-blue-900 dark:border-blue-700 dark:text-blue-300 text-xs font-semibold transition-all shadow-sm"
              title="Open simple user guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">{language === 'np' ? 'मार्गदर्शन' : 'How It Works'}</span>
            </button>
          )}

          {/* Demo Mode Toggle */}
          {onToggleDemoMode && (
            <button
              onClick={onToggleDemoMode}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isDemoMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-600'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
              title="Toggle demonstration flood case"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{isDemoMode ? 'Demo: On' : 'Demo Mode'}</span>
            </button>
          )}

          {/* Expert / Public View Mode Toggle */}
          {onToggleExpertMode && (
            <button
              onClick={onToggleExpertMode}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isExpertMode
                  ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-600'
                  : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
              title={isExpertMode ? 'Switch to Simple Public View' : 'Switch to Technical Details View'}
            >
              {isExpertMode ? (
                <>
                  <Sliders className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Advanced</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Simple View</span>
                </>
              )}
            </button>
          )}

          {/* Focus Map Button */}
          {onToggleFocusMap && (
            <button
              onClick={onToggleFocusMap}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isMapFocused
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
              }`}
              title={isMapFocused ? 'Restore side panel' : 'Expand map to full width'}
            >
              {isMapFocused ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Show Details</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Focus Map</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Telemetry Drawer */}
      {showTelemetryDrawer && (
        <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-command-card border border-slate-200 dark:border-command-border text-xs space-y-3 animate-in slide-in-from-top-1 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-command-border/60">
            <span className="font-bold text-slate-900 dark:text-command-text flex items-center gap-1.5 text-xs">
              <Radio className="w-4 h-4 text-blue-600 dark:text-sky-400" />
              <span>Service and Data Sources Status</span>
            </span>
            <button
              onClick={() => setShowTelemetryDrawer(false)}
              className="text-slate-500 hover:text-slate-800 dark:text-command-dim dark:hover:text-command-text text-xs font-semibold px-2 py-0.5"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Basemap Service */}
            <div className="p-3 rounded-lg bg-white dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">1. Map Service</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isBasemapHealthy ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-300'
                }`}>
                  {isBasemapHealthy ? 'Connected' : 'Offline'}
                </span>
              </div>
              <div className="text-slate-900 dark:text-command-text font-semibold">{basemapProvider}</div>
              <div className="text-slate-500 dark:text-command-muted text-[11px]">
                {isBasemapHealthy ? 'High-speed vector map tiles online.' : 'Tile connection issue.'}
              </div>
            </div>

            {/* Boundary Data */}
            <div className="p-3 rounded-lg bg-white dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">2. Boundaries</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                  Verified
                </span>
              </div>
              <div className="text-slate-900 dark:text-command-text font-semibold">geoBoundaries Nepal (ADM0/1/2)</div>
              <div className="text-slate-500 dark:text-command-muted text-[11px]">
                National boundary, all 7 provinces, and 77 districts loaded.
              </div>
            </div>

            {/* Live Feeds */}
            <div className="p-3 rounded-lg bg-white dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">3. Live Feeds</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isFeedsHealthy 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                    : isFeedsDisconnected
                    ? 'bg-rose-50 text-rose-800 border border-rose-300'
                    : 'bg-amber-50 text-amber-800 border border-amber-300'
                }`}>
                  {isFeedsHealthy ? 'Active' : isFeedsDisconnected ? 'Disconnected' : 'Checking'}
                </span>
              </div>
              <div className="text-slate-900 dark:text-command-text font-semibold">
                USGS ({liveEarthquakesCount}) • Open-Meteo ({liveWeatherCount})
              </div>
              <div className="text-slate-500 dark:text-command-muted text-[11px]">
                {isFeedsHealthy 
                  ? 'Real-time seismic and rain station polling active.' 
                  : 'Live external feeds currently offline.'}
              </div>
            </div>

            {/* Analytical Backend */}
            <div className="p-3 rounded-lg bg-white dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 uppercase font-semibold text-[10px]">4. Disaster Models</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                  Prototype Baseline
                </span>
              </div>
              <div className="text-slate-900 dark:text-command-text font-semibold">Verified Demonstration Scenario</div>
              <div className="text-slate-500 dark:text-command-muted text-[11px]">
                Running verified precomputed simulation models for Sindhupalchok corridor.
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
