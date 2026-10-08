import React, { useState } from 'react';
import type { 
  KPICardData, 
  MapLayerConfig, 
  PriorityActionItem, 
  RiskZoneMetric, 
  ActivityEvent,
  IncidentInfo,
  NavigationTab
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
  Clock, 
  MapPin, 
  Sparkles
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
}) => {
  const [focusedWaypoint, setFocusedWaypoint] = useState<[number, number] | null>(null);
  const [sideTab, setSideTab] = useState<'LOCATION' | 'OVERVIEW' | 'KPIS' | 'QUEUE'>('LOCATION');

  const handleSelectLocation = (loc: SearchableLocation) => {
    if (onSelectLocation) {
      onSelectLocation(loc);
    }
    setFocusedWaypoint(loc.coordinates);
    setSideTab('LOCATION');
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

    // Fallback constructed location
    const fallback: SearchableLocation = {
      id: `loc-prov-${prov.id}`,
      name: prov.name,
      nepaliName: prov.nepaliName,
      type: 'PROVINCE',
      province: prov.name,
      coordinates: [84.1240, 28.3949],
      zoom: 7.5,
      riskStatus: prov.riskStatus,
      riskLabel: `${prov.riskStatus} RISK (Provincial Monitoring)`,
      disasterOverview: prov.description || `${prov.name} administrative monitoring region.`,
      whatShouldIDo: 'Monitor regional river gauge telemetry and check official bulletins from DEOC.',
      isHazardZone: prov.riskStatus === 'CRITICAL' || prov.riskStatus === 'HIGH',
      authoritativeSource: 'Survey Department / NDRRMA Nepal',
    };

    handleSelectLocation(fallback);
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Search Header Bar — Prominent Search & Help for Villagers and Responders */}
      <div className="bg-command-card/95 border border-command-border rounded-xl p-3 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:max-w-2xl">
          <MapSearchBar
            onSelectLocation={handleSelectLocation}
            selectedLocation={selectedLocation}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>ACTIVE SURGE: SINDHUPALCHOK (BHOTE KOSHI)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-800 text-amber-300 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>26 AUG 2026 EVENT</span>
          </div>
        </div>
      </div>

      {/* Main Workspace: Dominant Map (65-70%) + Floating / Side Panel (30-35%) */}
      <div className={`grid gap-3 transition-all ${
        isMapFocused ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
      }`}>
        {/* Left/Center Map Viewport */}
        <div className={`${isMapFocused ? 'col-span-1' : 'lg:col-span-8'} flex flex-col h-[650px] relative`}>
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
          />

          {/* Floating Search Result Card on Map if focused */}
          {selectedLocation && isMapFocused && (
            <div className="absolute top-4 right-4 z-20 max-w-sm w-full">
              <SearchResultCard
                location={selectedLocation}
                onNavigateTab={(tab) => onNavigateTab && onNavigateTab(tab)}
                onClose={() => onSelectLocation && onSelectLocation(null)}
              />
            </div>
          )}
        </div>

        {/* Right Tactical Analytical Deck */}
        {!isMapFocused && (
          <div className="lg:col-span-4 flex flex-col h-[650px] space-y-2">
            {/* Side Tabs Selector */}
            <div className="flex items-center gap-1 bg-command-card border border-command-border rounded-lg p-1 text-xs shrink-0">
              <button
                onClick={() => setSideTab('LOCATION')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                  sideTab === 'LOCATION'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>LOCATION INFO</span>
              </button>

              <button
                onClick={() => setSideTab('OVERVIEW')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'OVERVIEW'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                EVENT
              </button>

              <button
                onClick={() => setSideTab('KPIS')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'KPIS'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                METRICS
              </button>

              <button
                onClick={() => setSideTab('QUEUE')}
                className={`flex-1 py-1.5 rounded text-[11px] font-bold transition-all ${
                  sideTab === 'QUEUE'
                    ? 'bg-command-accent text-white shadow-sm'
                    : 'text-command-muted hover:text-command-text'
                }`}
              >
                ACTIONS
              </button>
            </div>

            {/* Tab 1: Selected Location & Human Decision Guidance */}
            {sideTab === 'LOCATION' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {selectedLocation ? (
                  <SearchResultCard
                    location={selectedLocation}
                    onNavigateTab={(tab) => onNavigateTab && onNavigateTab(tab)}
                    onClose={() => onSelectLocation && onSelectLocation(null)}
                  />
                ) : (
                  <div className="bg-command-card/90 border border-command-border rounded-xl p-5 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-sky-950 border border-sky-600 flex items-center justify-center mx-auto text-sky-400 shadow-tactical-glow">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-command-text text-sm mb-1">
                        Search or Click Any Location
                      </h4>
                      <p className="text-xs text-command-muted leading-relaxed">
                        Search any village, town, district, or province (e.g. <strong>Tatopani</strong>, <strong>Sindhupalchok</strong>, <strong>Bagmati Province</strong>) to get plain-English safety instructions and emergency guidance.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-command-border/60">
                      <span className="text-[10px] text-command-dim uppercase font-bold block mb-2">
                        Quick Suggested Locations:
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
                            className="px-2.5 py-1 rounded bg-command-surface hover:bg-command-border text-command-accent-glow text-[11px] font-bold border border-command-border"
                          >
                            📍 {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Always display quick risk summary underneath */}
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
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
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
