import React from 'react';
import type { GeoFeatureProperties } from '../../data/demoGeoData';
import { DataSourceBadge } from '../common/DataSourceBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { 
  X, 
  Crosshair
} from 'lucide-react';

interface MapPopupProps {
  properties: GeoFeatureProperties;
  coordinates: [number, number]; // [lng, lat]
  onClose: () => void;
  onFocus?: (coords: [number, number]) => void;
}

export const MapPopup: React.FC<MapPopupProps> = ({
  properties,
  coordinates,
  onClose,
  onFocus,
}) => {
  const getSeverityBadgeClass = (severity?: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-300 border-rose-700';
      case 'HIGH':
        return 'bg-orange-950/80 text-orange-300 border-orange-700';
      case 'MODERATE':
        return 'bg-amber-950/80 text-amber-300 border-amber-700';
      case 'LOW':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700';
      default:
        return 'bg-sky-950/80 text-sky-300 border-sky-700';
    }
  };

  return (
    <div className="bg-command-card/95 backdrop-blur-md border border-command-accent/60 rounded-lg p-3.5 shadow-2xl max-w-sm font-mono text-command-text z-50 animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-command-border/80">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-command-surface border border-command-border text-command-accent-glow">
            {properties.type}
          </span>
          {properties.severity && (
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getSeverityBadgeClass(properties.severity)}`}>
              {properties.severity}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-command-dim hover:text-command-text p-0.5 rounded transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Title & Description */}
      <h4 className="text-xs font-bold text-command-text leading-tight mb-1">
        {properties.name}
      </h4>
      <p className="text-[11px] text-command-muted leading-relaxed mb-3">
        {properties.description}
      </p>

      {/* Coordinate & Status Info */}
      <div className="bg-command-panel/80 rounded p-2 border border-command-border text-[10px] space-y-1 mb-3">
        <div className="flex items-center justify-between text-command-dim">
          <span>COORDINATES:</span>
          <span className="text-command-text font-bold">
            {coordinates[1].toFixed(4)}° N, {coordinates[0].toFixed(4)}° E
          </span>
        </div>
        <div className="flex items-center justify-between text-command-dim">
          <span>OPERATIONAL STATUS:</span>
          <span className="text-amber-400 font-semibold">{properties.status}</span>
        </div>
      </div>

      {/* Provenance & Confidence */}
      <div className="pt-2 border-t border-command-border/60 flex items-center justify-between gap-2 mb-3">
        <DataSourceBadge provenance={properties.provenance} />
        {properties.provenance.confidence !== undefined && (
          <ConfidenceBadge confidence={properties.provenance.confidence} size="sm" />
        )}
      </div>

      {/* Quick Action Footer */}
      {onFocus && (
        <button
          onClick={() => onFocus(coordinates)}
          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-command-surface hover:bg-command-border border border-command-border text-xs text-command-accent-glow font-bold transition-colors"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span>CENTER VIEWPORT ON TARGET</span>
        </button>
      )}
    </div>
  );
};
