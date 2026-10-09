import React, { useState, useRef, useEffect } from 'react';
import { 
  NEPAL_SEARCH_LOCATIONS, 
  type SearchableLocation 
} from '../../data/searchLocations';
import { searchNepalPlaces } from '../../services/api/liveApi';
import type { LanguageMode } from '../../types';
import { I18N } from '../../data/i18n';
import { 
  Search, 
  MapPin, 
  X, 
  ChevronRight,
  Loader2
} from 'lucide-react';

interface MapSearchBarProps {
  onSelectLocation: (loc: SearchableLocation) => void;
  selectedLocation?: SearchableLocation | null;
  onClear?: () => void;
  language?: LanguageMode;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  onSelectLocation,
  selectedLocation,
  onClear,
  language = 'en',
}) => {
  const [query, setQuery] = useState(selectedLocation?.name || '');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchableLocation[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = I18N[language] || I18N.en;

  // Sync query when external selected location changes
  useEffect(() => {
    if (selectedLocation && selectedLocation.name !== query) {
      setQuery(selectedLocation.name);
    }
  }, [selectedLocation]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const found = await searchNepalPlaces(query);
        setResults(found);
      } catch {
        // Fallback local match
        const local = NEPAL_SEARCH_LOCATIONS.filter((l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          (l.nepaliName && l.nepaliName.includes(query))
        );
        setResults(local.slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: SearchableLocation) => {
    setQuery(loc.name);
    setIsOpen(false);
    onSelectLocation(loc);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    if (onClear) onClear();
  };

  const getRiskBadge = (status: SearchableLocation['riskStatus']) => {
    switch (status) {
      case 'CRITICAL':
        return { label: language === 'np' ? 'अत्यधिक जोखिम' : 'CRITICAL', class: 'bg-rose-950/90 text-rose-300 border-rose-700' };
      case 'HIGH':
        return { label: language === 'np' ? 'उच्च जोखिम' : 'HIGH RISK', class: 'bg-orange-950/90 text-orange-300 border-orange-700' };
      case 'MODERATE':
        return { label: language === 'np' ? 'मध्यम निगरानी' : 'MODERATE', class: 'bg-amber-950/90 text-amber-300 border-amber-700' };
      default:
        return { label: language === 'np' ? 'सामान्य' : 'NORMAL', class: 'bg-emerald-950/90 text-emerald-300 border-emerald-700' };
    }
  };

  return (
    <div ref={containerRef} className="relative w-full z-20 font-mono">
      {/* Search Input Box */}
      <div className="relative flex items-center bg-command-panel/95 backdrop-blur-md border border-command-border hover:border-command-accent focus-within:border-command-accent rounded-xl shadow-2xl transition-all">
        <div className="pl-3.5 pr-2 text-command-dim flex items-center">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-command-accent-glow animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-command-accent-glow" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-transparent py-2.5 pr-10 text-xs sm:text-sm text-command-text placeholder-command-dim focus:outline-none"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-md text-command-dim hover:text-command-text hover:bg-command-surface transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-command-card/95 backdrop-blur-lg border border-command-border rounded-xl shadow-2xl overflow-hidden divide-y divide-command-border/50 max-h-80 overflow-y-auto">
          <div className="px-3 py-1.5 bg-command-surface/70 text-[10px] text-command-dim uppercase tracking-wider font-bold flex items-center justify-between">
            <span>{language === 'np' ? `नेपालका स्थानहरू (${results.length})` : `Matching Places in Nepal (${results.length})`}</span>
            <span className="text-[9px] text-sky-400 font-normal">Real Geocoding + Verified GIS</span>
          </div>

          {results.map((loc) => {
            const risk = getRiskBadge(loc.riskStatus);
            return (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-command-surface/80 transition-colors group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-command-panel border border-command-border text-command-accent-glow group-hover:border-command-accent shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-command-text group-hover:text-command-accent-glow">
                        {loc.name}
                      </span>
                      {loc.nepaliName && (
                        <span className="text-[11px] text-command-dim">
                          ({loc.nepaliName})
                        </span>
                      )}
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-command-panel border border-command-border text-command-dim font-bold">
                        {loc.type}
                      </span>
                      {loc.hasActualBoundary && (
                        <span className="text-[8px] px-1 rounded bg-purple-950 text-purple-300 border border-purple-800">
                          Polygon Available
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-command-muted truncate mt-0.5">
                      {loc.province} {loc.district ? `• ${loc.district} District` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${risk.class}`}>
                    {risk.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-command-dim group-hover:text-command-accent-glow transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
