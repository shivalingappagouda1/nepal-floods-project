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
  Sparkles,
  Activity,
  CloudRain
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
  selectedLocation?: SearchableLocation | null;
  onSelectLocation?: (loc: SearchableLocation | null) => void;
  onNavigateTab?: (tab: NavigationTab) => void;
  isExpertMode?: boolean;
  language?: LanguageMode;
  liveEarthquakes?: LiveEarthquakeEvent[];
  liveWeatherStations?: LiveWeatherStation[];
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
  selectedLocation = null,
  onSelectLocation,
  onNavigateTab,
  isExpertMode: _isExpertMode = false,
  language = 'en',
  liveEarthquakes = [],
  liveWeatherStations = [],
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

    // Fallback constructed location from verified province
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

  return (
    <div className="space-y-2.5 font-mono">
      {/* Search Header Bar — Prominent Search & Live Status Telemetry */}
      <div className="bg-command-card/95 backdrop-blur-md border border-command-border rounded-2xl p-3 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:max-w-2xl">
          <MapSearchBar
            onSelectLocation={handleSelectLocation}
            selectedLocation={selectedLocation}
            onClear={() => onSelectLocation && onSelectLocation(null)}
            language={language}
          />
        </div>

        {/* Live Feeds Quick Badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {liveEarthquakes.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 font-bold">
              <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>{liveEarthquakes.length} {language === 'np' ? 'भूकम्प फिड' : 'USGS QUAKES'}</span>
            </div>
          )}

          {liveWeatherStations.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-950/80 border border-sky-800 text-sky-300 font-bold">
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              <span>{liveWeatherStations.length} {language === 'np' ? 'मौसम केन्द्र' : 'WX STATIONS'}</span>
            </div>
          )}

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1 ${
              isSidePanelOpen
                ? 'bg-command-accent text-white border-command-accent shadow-sm'
                : 'bg-command-surface border-command-border text-command-muted hover:text-command-text'
            }`}
          >
            <span>{isSidePanelOpen ? 'Dock Panel ✕' : 'Open Details ☰'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Dominant Map (75–85%) + Collapsible Side Panel (15–25%) */}
      <div className={`grid gap-2.5 transition-all ${
        isMapFocused || !isSidePanelOpen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Dominant Map Viewport (80% of width on desktop) */}
        <div className={`${
          isMapFocused || !isSidePanelOpen ? 'col-span-1' : 'lg:col-span-8 xl:col-span-9'
        } flex flex-col h-[700px] relative`}>
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
          />

          {/* Quick Floating Suggested Location Pills on Map */}
          <div className="absolute top-4 left-4 z-10 hidden sm:flex items-center gap-1.5 bg-command-card/90 backdrop-blur-md border border-command-border p-1 rounded-xl shadow-lg text-[11px]">
            <span className="text-command-dim text-[10px] uppercase font-bold px-1.5">Quick:</span>
            {['Tatopani', 'Barhabise', 'Sindhupalchok', 'Bagmati Province', 'Kaski'].map((name) => (
              <button
                key={name}
                onClick={() => {
                  const found = NEPAL_SEARCH_LOCATIONS.find((l) =>
                    l.name.toLowerCase().includes(name.toLowerCase())
                  );
                  if (found) handleSelectLocation(found);
                }}
                className="px-2 py-0.5 rounded-lg bg-command-surface hover:bg-command-border text-command-text hover:text-command-accent-glow font-bold border border-command-border transition-colors"
              >
                📍 {name}
              </button>
            ))}
          </div>
        </div>

        {/* Tactical Analytical Side Deck */}
        {!isMapFocused && isSidePanelOpen && (
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col h-[700px] space-y-2 animate-in fade-in slide-in-from-right-2">
            {/* Side Tabs Selector */}
            <div className="flex items-center gap-1 bg-command-card border border-command-border rounded-xl p-1 text-xs shrink-0">
              <button
                onClick={() => setSideTab('LOCATION')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                  sideTab === 'LOCATION'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{language === 'np' ? 'स्थान' : 'LOCATION'}</span>
              </button>

              <button
                onClick={() => setSideTab('OVERVIEW')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  sideTab === 'OVERVIEW'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                {language === 'np' ? 'घटना' : 'EVENT'}
              </button>

              <button
                onClick={() => setSideTab('KPIS')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  sideTab === 'KPIS'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                {language === 'np' ? 'सूचक' : 'METRICS'}
              </button>

              <button
                onClick={() => setSideTab('QUEUE')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  sideTab === 'QUEUE'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                {language === 'np' ? 'कार्य' : 'ACTIONS'}
              </button>
            </div>

            {/* Tab 1: Selected Location & Human Decision Guidance */}
            {sideTab === 'LOCATION' && (
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {selectedLocation ? (
                  <SearchResultCard
                    location={selectedLocation}
                    onNavigateTab={(tab) => onNavigateTab && onNavigateTab(tab)}
                    onClose={() => onSelectLocation && onSelectLocation(null)}
                    language={language}
                  />
                ) : (
                  <div className="bg-command-card/90 border border-command-border rounded-2xl p-5 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-950 border border-sky-600 flex items-center justify-center mx-auto text-sky-400 shadow-tactical-glow">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-command-text text-sm mb-1">
                        {language === 'np' ? 'कुनै पनि स्थान खोज्नुहोस् वा क्लिक गर्नुहोस्' : 'Search or Click Any Location'}
                      </h4>
                      <p className="text-xs text-command-muted leading-relaxed">
                        {language === 'np'
                          ? 'आफ्नो गाउँ, सहर वा जिल्ला खोजेर आपतकालीन सुरक्षा निर्देशन र अवस्था हेर्नुहोस्।'
                          : 'Search any village, town, district, or province to get plain-language safety instructions and emergency guidance.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-command-border/60">
                      <span className="text-[10px] text-command-dim uppercase font-bold block mb-2">
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
                            className="px-2.5 py-1 rounded-lg bg-command-surface hover:bg-command-border text-command-accent-glow text-[11px] font-bold border border-command-border"
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
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                <KPIGrid cards={kpis} />
                <RiskIndicator
                  score={riskMetric.compositeScore}
                  zoneName={riskMetric.zoneName}
                  severity={riskMetric.severity}
                  provenance={riskMetric.provenance}
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
    </div>
  );
};
