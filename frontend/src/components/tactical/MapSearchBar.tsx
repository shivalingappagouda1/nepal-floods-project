import React, { useState, useRef, useEffect } from 'react';
import { 
  NEPAL_SEARCH_LOCATIONS, 
  type SearchableLocation 
} from '../../data/searchLocations';
import { searchNepalPlaces } from '../../services/api/liveApi';
import type { LanguageMode } from '../../types';
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

  // Sync query when selectedLocation changes externally
  const prevSelectedNameRef = useRef(selectedLocation?.name);
  useEffect(() => {
    if (selectedLocation?.name !== prevSelectedNameRef.current) {
      prevSelectedNameRef.current = selectedLocation?.name;
      setQuery(selectedLocation?.name || '');
    }
  }, [selectedLocation]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
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
    setIsOpen(false);
    if (onClear) onClear();
  };

  const getRiskBadge = (status: SearchableLocation['riskStatus']) => {
    switch (status) {
      case 'CRITICAL':
        return { label: language === 'np' ? 'अत्यधिक जोखिम' : 'Critical', class: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300' };
      case 'HIGH':
        return { label: language === 'np' ? 'उच्च जोखिम' : 'High Risk', class: 'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300' };
      case 'MODERATE':
        return { label: language === 'np' ? 'मध्यम निगरानी' : 'Moderate', class: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300' };
      default:
        return { label: language === 'np' ? 'सामान्य' : 'Normal', class: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300' };
    }
  };

  return (
    <div ref={containerRef} className="relative w-full z-20 font-sans">
      {/* Prominent Label (Requirement 6) */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <label className="text-xs font-bold text-slate-700 dark:text-command-text flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-blue-600" />
          <span>Search a village, town or province</span>
        </label>
        {selectedLocation && (
          <button
            onClick={handleClear}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Clear selection</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search Input Box */}
      <div className="relative flex items-center bg-white dark:bg-command-panel border border-slate-300 dark:border-command-border hover:border-blue-500 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 rounded-xl shadow-xs transition-all">
        <div className="pl-3.5 pr-2 text-slate-400 flex items-center">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-slate-400" />
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
          placeholder={language === 'np' ? 'गाउँ, सहर, जिल्ला वा प्रदेश खोज्नुहोस्...' : 'Search a village, town or province (e.g. Tatopani, Pokhara, Bagmati)...'}
          className="w-full bg-transparent py-2.5 pr-10 text-xs sm:text-sm text-slate-900 dark:text-command-text placeholder-slate-400 focus:outline-none"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-command-surface transition-colors cursor-pointer"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim() && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-command-card border border-slate-200 dark:border-command-border rounded-xl shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-command-border/50 max-h-80 overflow-y-auto">
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-command-surface/70 text-[11px] text-slate-500 dark:text-command-dim font-semibold flex items-center justify-between">
            <span>{language === 'np' ? `नेपालका स्थानहरू (${results.length})` : `Matching Places (${results.length})`}</span>
            <span className="text-[10px] text-blue-600 dark:text-sky-400 font-normal">Official Geocoding + Boundaries</span>
          </div>

          {results.map((loc) => {
            const risk = getRiskBadge(loc.riskStatus);
            return (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-blue-50/60 dark:hover:bg-command-surface/80 transition-colors group cursor-pointer"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-command-panel border border-slate-200 dark:border-command-border text-blue-600 group-hover:border-blue-400 shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-command-text group-hover:text-blue-600">
                        {loc.name}
                      </span>
                      {loc.nepaliName && (
                        <span className="text-xs text-slate-400 dark:text-command-dim">
                          ({loc.nepaliName})
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-command-panel border border-slate-200 dark:border-command-border text-slate-600 dark:text-command-dim font-medium">
                        {loc.type}
                      </span>
                      {loc.hasActualBoundary && (
                        <span className="text-[10px] px-1.5 rounded bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 font-medium">
                          Boundary Available
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-command-muted truncate mt-0.5">
                      {loc.province} {loc.district ? `• ${loc.district} District` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${risk.class}`}>
                    {risk.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
