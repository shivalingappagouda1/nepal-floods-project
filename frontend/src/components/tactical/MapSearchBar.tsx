import React, { useState, useRef, useEffect } from 'react';
import { 
  NEPAL_SEARCH_LOCATIONS, 
  type SearchableLocation 
} from '../../data/searchLocations';
import { 
  Search, 
  MapPin, 
  X, 
  ChevronRight
} from 'lucide-react';

interface MapSearchBarProps {
  onSelectLocation: (loc: SearchableLocation) => void;
  selectedLocation?: SearchableLocation | null;
  onClear?: () => void;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  onSelectLocation,
  selectedLocation,
  onClear,
}) => {
  const [query, setQuery] = useState(selectedLocation?.name || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedLocation) {
      setQuery(selectedLocation.name);
    }
  }, [selectedLocation]);

  // Filter locations based on query
  const filtered = query.trim()
    ? NEPAL_SEARCH_LOCATIONS.filter((loc) => {
        const q = query.toLowerCase();
        return (
          loc.name.toLowerCase().includes(q) ||
          (loc.nepaliName && loc.nepaliName.includes(q)) ||
          loc.province.toLowerCase().includes(q) ||
          (loc.district && loc.district.toLowerCase().includes(q))
        );
      }).slice(0, 6)
    : [];

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
    if (onClear) onClear();
  };

  const getRiskBadge = (status: SearchableLocation['riskStatus']) => {
    switch (status) {
      case 'CRITICAL':
        return { label: 'CRITICAL', class: 'bg-rose-950/90 text-rose-300 border-rose-700' };
      case 'HIGH':
        return { label: 'HIGH RISK', class: 'bg-orange-950/90 text-orange-300 border-orange-700' };
      case 'MODERATE':
        return { label: 'MODERATE', class: 'bg-amber-950/90 text-amber-300 border-amber-700' };
      default:
        return { label: 'NORMAL', class: 'bg-emerald-950/90 text-emerald-300 border-emerald-700' };
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl z-20 font-mono">
      {/* Search Input Box */}
      <div className="relative flex items-center bg-command-panel/95 backdrop-blur-md border border-command-border hover:border-command-accent focus-within:border-command-accent rounded-xl shadow-2xl transition-all">
        <div className="pl-3.5 pr-2 text-command-dim flex items-center">
          <Search className="w-4 h-4 text-command-accent-glow" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search your village, town, district or province (e.g. Tatopani, Sindhupalchok, Bagmati)"
          className="w-full bg-transparent py-2.5 pr-10 text-xs sm:text-sm text-command-text placeholder-command-dim focus:outline-none"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-md text-command-dim hover:text-command-text hover:bg-command-surface"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-command-card/95 backdrop-blur-lg border border-command-border rounded-xl shadow-2xl overflow-hidden divide-y divide-command-border/50">
          <div className="px-3 py-1.5 bg-command-surface/60 text-[10px] text-command-dim uppercase tracking-wider font-bold">
            Matching Locations in Nepal ({filtered.length})
          </div>

          {filtered.map((loc) => {
            const risk = getRiskBadge(loc.riskStatus);
            return (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-command-surface/80 transition-colors group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-command-panel border border-command-border text-command-accent-glow group-hover:border-command-accent">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
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
