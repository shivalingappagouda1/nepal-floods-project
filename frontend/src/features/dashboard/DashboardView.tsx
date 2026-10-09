import React, { useState } from 'react';
import type { 
  KPICardData, 
  MapLayerConfig, 
  PriorityActionItem, 
  RiskZoneMetric, 
  ActivityEvent, 
  IncidentInfo, 
  NavigationTab, 
  LanguageMode, 
  LiveEarthquakeEvent, 
  LiveWeatherStation 
} from '../../types';
import { 
  NEPAL_SEARCH_LOCATIONS, 
  type SearchableLocation 
} from '../../data/searchLocations';
import type { ProvinceProperties } from '../../data/nepalProvincesGeoJson';
import { MapPanel } from '../../components/tactical/MapPanel';
import { MapSearchBar } from '../../components/tactical/MapSearchBar';
import { SearchResultCard } from '../../components/tactical/SearchResultCard';
import { EventSummaryPanel } from '../../components/tactical/EventSummaryPanel';
import { KPIGrid } from '../../components/tactical/KPIGrid';
import { PriorityList } from '../../components/tactical/PriorityList';
import { RiskIndicator } from '../../components/tactical/RiskIndicator';
import { 
  MapPin, 
  Activity, 
  CloudRain,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Info
} from 'lucide-react';

interface DashboardViewProps {
  incident: IncidentInfo;
  kpis: KPICardData[];
  layers: MapLayerConfig[];
  priorityItems: PriorityActionItem[];
  riskMetric: RiskZoneMetric;
  activityLogs: ActivityEvent[];
  onToggleLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onApproveAction: (id: string) => void;
  isMapFocused?: boolean;
  onToggleFocusMap?: () => void;
  selectedLocation?: SearchableLocation | null;
  onSelectLocation?: (loc: SearchableLocation | null) => void;
  onNavigateTab?: (tab: NavigationTab) => void;
  isExpertMode?: boolean;
  language?: LanguageMode;
  liveEarthquakes?: LiveEarthquakeEvent[];
  liveWeatherStations?: LiveWeatherStation[];
  basemapStatus?: 'OPERATIONAL' | 'DEGRADED' | 'DISCONNECTED';
  basemapProvider?: string;
  onBasemapStatusChange?: (status: 'OPERATIONAL' | 'DEGRADED' | 'DISCONNECTED', provider: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incident,
  kpis,
  layers,
  priorityItems,
  riskMetric,
  onToggleLayer,
  onOpacityChange,
  onApproveAction,
  isMapFocused = false,
  onToggleFocusMap,
  selectedLocation = null,
  onSelectLocation,
  onNavigateTab,
  isExpertMode: _isExpertMode = false,
  language = 'en',
  liveEarthquakes = [],
  liveWeatherStations = [],
  onBasemapStatusChange,
}) => {
  const [focusedWaypoint, setFocusedWaypoint] = useState<[number, number] | null>(null);
  const [sideTab, setSideTab] = useState<'LOCATION' | 'OVERVIEW' | 'KPIS' | 'QUEUE'>('LOCATION');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const handleSelectLocation = (loc: SearchableLocation) => {
    if (onSelectLocation) {
      onSelectLocation(loc);
    }
    setFocusedWaypoint(loc.coordinates);
    setSideTab('LOCATION');
    setIsSidePanelOpen(true);
  };

  const handleSelectProvince = (prov: ProvinceProperties) => {
    const matching = NEPAL_SEARCH_LOCATIONS.find((l) =>
      l.name.toLowerCase().includes(prov.name.toLowerCase()) ||
      prov.name.toLowerCase().includes(l.name.toLowerCase())
    );

    if (matching) {
      handleSelectLocation(matching);
      return;
    }

    const fallback: SearchableLocation = {
      id: `loc-prov-${prov.id}`,
      name: prov.name,
      nepaliName: prov.nepaliName,
      type: 'PROVINCE',
      province: prov.name,
      coordinates: [84.1240, 28.3949],
      zoom: 7.5,
      riskStatus: prov.riskStatus,
      riskLabel: `${prov.riskStatus} (Provincial Monitoring)`,
      disasterOverview: prov.description || `${prov.name} administrative monitoring region.`,
      whatShouldIDo: 'Monitor regional river gauge telemetry and check official bulletins from DEOC.',
      isHazardZone: prov.riskStatus === 'CRITICAL' || prov.riskStatus === 'HIGH',
      hasActualBoundary: true,
      authoritativeSource: 'Survey Department of Nepal / geoBoundaries',
    };

    handleSelectLocation(fallback);
  };

  const mapHeightClass = isMapFocused 
    ? 'h-[calc(100vh-140px)] min-h-[720px]' 
    : 'h-[700px] min-h-[580px]';

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Prominent Search & Quick Feeds Header Bar */}
      <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:max-w-2xl">
          <MapSearchBar
            onSelectLocation={handleSelectLocation}
            selectedLocation={selectedLocation}
            onClear={() => onSelectLocation && onSelectLocation(null)}
            language={language}
          />
        </div>

        {/* Live Feeds Quick Badges & Panel Toggle */}
        <div className="flex items-center gap-2 flex-wrap text-xs self-start md:self-auto">
          {liveEarthquakes.length > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-semibold">
              <Activity className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>{liveEarthquakes.length} {language === 'np' ? 'भूकम्प फिड' : 'USGS Quakes'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-command-surface border border-slate-200 dark:border-command-border text-slate-600 dark:text-command-dim text-xs">
              <span>0 USGS Quakes</span>
            </div>
          )}

          {liveWeatherStations.length > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-sky-950/80 border border-blue-200 dark:border-sky-800 text-blue-800 dark:text-sky-300 font-semibold">
              <CloudRain className="w-3.5 h-3.5 text-blue-600" />
              <span>{liveWeatherStations.length} {language === 'np' ? 'मौसम केन्द्र' : 'Weather Stations'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-command-surface border border-slate-200 dark:border-command-border text-slate-600 dark:text-command-dim text-xs">
              <span>Weather Data Offline</span>
            </div>
          )}

          {/* Panel Toggle Button */}
          {!isMapFocused && (
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSidePanelOpen
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 dark:bg-command-surface dark:border-command-border dark:text-command-muted'
                  : 'bg-blue-600 text-white border-blue-600 shadow-xs'
              }`}
              title={isSidePanelOpen ? 'Collapse side panel to expand map area' : 'Open details side panel'}
            >
              {isSidePanelOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              <span>{isSidePanelOpen ? 'Collapse Details' : 'Open Details'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top-to-Bottom Flow: What is happening? / Where is it? Overview Banner */}
      <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 dark:text-command-dim uppercase tracking-wider">
              A. What is happening?
            </span>
            {selectedLocation ? (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Selected Location
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                Active Scenario Case
              </span>
            )}
          </div>

          <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-command-text">
            {selectedLocation ? (
              <span>{selectedLocation.name} ({selectedLocation.province}): {selectedLocation.disasterOverview}</span>
            ) : (
              <span>Bhote Koshi River Basin (Sindhupalchok): Monitoring monsoon debris flow and river surge corridor.</span>
            )}
          </div>
        </div>

        {selectedLocation && (
          <button
            onClick={() => onSelectLocation && onSelectLocation(null)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* 3. Main Workspace: Dominant Map + Collapsible Side Panel */}
      <div className={`grid gap-4 transition-all ${
        isMapFocused || !isSidePanelOpen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Dominant Map Viewport (Requirement B: Where is it?) */}
        <div className={`${
          isMapFocused || !isSidePanelOpen ? 'col-span-1' : 'lg:col-span-8 xl:col-span-8'
        } flex flex-col ${mapHeightClass} relative transition-all rounded-2xl overflow-hidden shadow-xs border border-slate-200 dark:border-command-border`}>
          <MapPanel
            layers={layers}
            onToggleLayer={onToggleLayer}
            onOpacityChange={onOpacityChange}
            activeAoiName="Bhote Koshi / Tatopani Transboundary AOI"
            coordinates={incident.centerCoordinates}
            focusedWaypoint={focusedWaypoint}
            selectedLocation={selectedLocation}
            onSelectProvince={handleSelectProvince}
            initialViewMode="NATION"
            language={language}
            liveEarthquakes={liveEarthquakes}
            liveWeatherStations={liveWeatherStations}
            isMapFocused={isMapFocused}
            onToggleFocusMap={onToggleFocusMap}
            onBasemapStatusChange={onBasemapStatusChange}
          />

          {/* Quick Floating Suggested Location Pills on Map */}
          <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-1.5 bg-white/95 dark:bg-command-card/90 backdrop-blur-md border border-slate-200 dark:border-command-border p-1.5 rounded-xl shadow-md text-xs">
            <span className="text-slate-400 dark:text-command-dim text-[11px] font-semibold px-1.5">Quick:</span>
            {['Tatopani', 'Barhabise', 'Sindhupalchok', 'Bagmati Province', 'Kaski'].map((name) => (
              <button
                key={name}
                onClick={() => {
                  const found = NEPAL_SEARCH_LOCATIONS.find((l) =>
                    l.name.toLowerCase().includes(name.toLowerCase())
                  );
                  if (found) handleSelectLocation(found);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium border border-slate-200 dark:bg-command-surface dark:border-command-border dark:text-command-text transition-colors cursor-pointer"
              >
                📍 {name}
              </button>
            ))}
          </div>

          {/* Expand Side Panel Pill when collapsed */}
          {!isSidePanelOpen && !isMapFocused && (
            <button
              onClick={() => setIsSidePanelOpen(true)}
              className="absolute top-1/2 -translate-y-1/2 right-3 z-20 px-3 py-2 rounded-xl bg-white/95 hover:bg-blue-50 dark:bg-command-card/95 border border-slate-200 text-blue-600 font-semibold text-xs shadow-xl flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md"
              title="Expand Information Panel"
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
              <span>Details Panel</span>
            </button>
          )}
        </div>

        {/* Side Panel: Location, Event, Metrics, Action Queue */}
        {!isMapFocused && isSidePanelOpen && (
          <div className={`lg:col-span-4 xl:col-span-4 flex flex-col ${mapHeightClass} space-y-3 animate-in fade-in`}>
            {/* Side Tabs Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-xl p-1 text-xs shrink-0 shadow-xs">
              <button
                onClick={() => setSideTab('LOCATION')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  sideTab === 'LOCATION'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{language === 'np' ? 'स्थान' : 'Location'}</span>
              </button>

              <button
                onClick={() => setSideTab('OVERVIEW')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'OVERVIEW'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                <span>{language === 'np' ? 'घटना' : 'Event'}</span>
              </button>

              <button
                onClick={() => setSideTab('KPIS')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'KPIS'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                <span>{language === 'np' ? 'सूचक' : 'Metrics'}</span>
              </button>

              <button
                onClick={() => setSideTab('QUEUE')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sideTab === 'QUEUE'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-command-muted hover:text-slate-900'
                }`}
              >
                <span>{language === 'np' ? 'कार्य' : 'Actions'}</span>
              </button>

              {/* Direct Collapse Handle */}
              <button
                onClick={() => setIsSidePanelOpen(false)}
                className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-xs font-bold cursor-pointer shrink-0 ml-0.5"
                title="Collapse Panel (Maximize Map)"
              >
                ✕
              </button>
            </div>

            {/* Tab 1: Selected Location & Decision Support */}
            {sideTab === 'LOCATION' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {selectedLocation ? (
                  <SearchResultCard
                    location={selectedLocation}
                    onNavigateTab={(tab) => onNavigateTab && onNavigateTab(tab)}
                    onClose={() => onSelectLocation && onSelectLocation(null)}
                    language={language}
                  />
                ) : (
                  <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-5 text-center space-y-3 shadow-xs">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-sky-950 border border-blue-200 dark:border-sky-700 flex items-center justify-center mx-auto text-blue-600 dark:text-sky-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-command-text text-sm mb-1">
                        {language === 'np' ? 'कुनै पनि स्थान खोज्नुहोस् वा क्लिक गर्नुहोस्' : 'Search or Click Any Location'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-command-muted leading-relaxed">
                        {language === 'np'
                          ? 'आफ्नो गाउँ, सहर वा जिल्ला खोजेर आपतकालीन सुरक्षा निर्देशन र अवस्था हेर्नुहोस्।'
                          : 'Search any village, town, district, or province above to see localized safety guidance and hazard estimates.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-command-border/60">
                      <span className="text-xs text-slate-400 dark:text-command-dim font-semibold block mb-2">
                        {language === 'np' ? 'सुझाइएका स्थानहरू:' : 'Suggested Locations:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {['Tatopani', 'Barhabise', 'Larcha', 'Sindhupalchok', 'Bagmati Province'].map((name) => (
                          <button
                            key={name}
                            onClick={() => {
                              const found = NEPAL_SEARCH_LOCATIONS.find((l) =>
                                l.name.toLowerCase().includes(name.toLowerCase())
                              );
                              if (found) handleSelectLocation(found);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-medium border border-slate-200 dark:bg-command-surface dark:border-command-border dark:text-command-accent-glow cursor-pointer"
                          >
                            📍 {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Risk Metric Card */}
                <RiskIndicator
                  score={riskMetric.compositeScore}
                  zoneName={riskMetric.zoneName}
                  severity={riskMetric.severity}
                  provenance={riskMetric.provenance}
                  isPrototype={true}
                />
              </div>
            )}

            {/* Tab 2: Event Summary & Waypoints */}
            {sideTab === 'OVERVIEW' && (
              <div className="flex-1 overflow-y-auto">
                <EventSummaryPanel onFocusWaypoint={(coords) => setFocusedWaypoint(coords)} />
              </div>
            )}

            {/* Tab 3: KPIS & Risk Indicator */}
            {sideTab === 'KPIS' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <KPIGrid cards={kpis} />
                <RiskIndicator
                  score={riskMetric.compositeScore}
                  zoneName={riskMetric.zoneName}
                  severity={riskMetric.severity}
                  provenance={riskMetric.provenance}
                  isPrototype={true}
                />
              </div>
            )}

            {/* Tab 4: Action Queue */}
            {sideTab === 'QUEUE' && (
              <div className="flex-1 overflow-y-auto pr-1">
                <PriorityList
                  items={priorityItems}
                  onApproveAction={onApproveAction}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Top-to-Bottom Flow: What do we know? Section (Requirement 4.C) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-command-dim uppercase tracking-wider">
            C. What do we know right now?
          </span>
          <span className="text-[11px] text-slate-500">
            (Verified live sensor and authority updates)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Official Warnings */}
          <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-command-muted">Official Warnings</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
                Officially reported
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-command-text">
              No national evacuation order
            </div>
            <p className="text-xs text-slate-500 dark:text-command-muted leading-relaxed">
              DHM / NDRRMA flood advisory bulletin remains in alert phase. Follow instructions from local DEOC.
            </p>
          </div>

          {/* Card 2: Reported Earthquakes */}
          <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-command-muted">Reported Earthquakes</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                Live sensor feed
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-command-text">
              {liveEarthquakes.length > 0 ? `${liveEarthquakes.length} seismic events in feed` : 'No recent quakes in region'}
            </div>
            <p className="text-xs text-slate-500 dark:text-command-muted leading-relaxed">
              {liveEarthquakes.length > 0 
                ? 'Monitored via USGS Real-Time Earthquake API within 400km buffer.' 
                : 'No seismic tremors detected in current reporting window.'}
            </p>
          </div>

          {/* Card 3: Weather Information */}
          <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-command-muted">Weather Information</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                Live sensor feed
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-command-text">
              {liveWeatherStations.length > 0 ? `${liveWeatherStations.length} provincial stations active` : 'Data unavailable'}
            </div>
            <p className="text-xs text-slate-500 dark:text-command-muted leading-relaxed">
              {liveWeatherStations.length > 0
                ? 'Rainfall and temperature readings polled from Open-Meteo provincial stations.'
                : 'Live weather telemetry currently disconnected.'}
            </p>
          </div>

          {/* Card 4: Areas Requiring Further Assessment */}
          <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-command-muted">Areas Needing Inspection</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-semibold">
                Model estimate
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-command-text">
              Araniko Highway & Tatopani
            </div>
            <p className="text-xs text-slate-500 dark:text-command-muted leading-relaxed">
              Debris blockage and bridge abutments require field visual check by Nepal Army / road engineers.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Top-to-Bottom Flow: What should I do? (Requirement 4.D) & Reliability (4.E) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Safety Guidance Card */}
        <div className="bg-emerald-50/70 dark:bg-command-card border border-emerald-200 dark:border-command-border rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>D. What should I do next? (Safety Guidance)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-command-muted leading-relaxed">
            • Avoid walking or driving along flooded riverbanks and narrow gorge roads during continuous rainfall.
            <br />
            • If you notice sudden muddy river water or tree debris, move immediately to higher ground.
            <br />
            • Always follow instructions broadcast by local police, ward representatives, and district authorities.
          </p>
          <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-slate-500 italic">
            Automated preparedness guidance. Official evacuation orders are issued exclusively by local government officers.
          </div>
        </div>

        {/* Reliability / Provenance Breakdown Card */}
        <div className="bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 dark:text-command-text font-bold text-sm">
            <Info className="w-5 h-5 text-blue-600" />
            <span>E. How reliable is this information?</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border">
              <span className="font-semibold text-emerald-700 block">Officially Reported</span>
              <span className="text-[11px] text-slate-500">Government bulletins (NDRRMA / DHM)</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border">
              <span className="font-semibold text-blue-700 block">Live Sensor Feed</span>
              <span className="text-[11px] text-slate-500">USGS quakes & weather telemetry</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border">
              <span className="font-semibold text-amber-700 block">Model Estimate</span>
              <span className="text-[11px] text-slate-500">Simulated risk index & water polygons</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border">
              <span className="font-semibold text-purple-700 block">Demonstration Data</span>
              <span className="text-[11px] text-slate-500">Prototype case study scenario</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
