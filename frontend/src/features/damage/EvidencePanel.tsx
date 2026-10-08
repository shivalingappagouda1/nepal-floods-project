import React from 'react';
import type { DamageFeature } from '../../types/damage';
import { 
  Waves, 
  Mountain, 
  Radar, 
  FileText 
} from 'lucide-react';

interface EvidencePanelProps {
  feature: DamageFeature;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ feature }) => {
  const { evidence } = feature;

  return (
    <div className="bg-command-panel/90 border border-command-border rounded-lg p-3.5 font-mono text-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-command-border/70">
        <div className="flex items-center gap-1.5 font-bold text-command-text">
          <FileText className="w-3.5 h-3.5 text-command-accent-glow" />
          <span className="uppercase">GEOSPATIAL & SENSOR EVIDENCE DECK</span>
        </div>
        <span className="text-[10px] text-command-dim">
          BAND: {evidence.opticalBandPreview}
        </span>
      </div>

      {/* Quantitative Sensor Deltas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Radar Backscatter Drop */}
        {evidence.radarBackscatterDropDb !== undefined && (
          <div className="p-2.5 rounded bg-sky-950/30 border border-sky-800/60 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-sky-300 font-bold">
              <span className="flex items-center gap-1">
                <Radar className="w-3 h-3" />
                SAR Δσ₀ DROP
              </span>
              <span>{evidence.radarBackscatterDropDb} dB</span>
            </div>
            <p className="text-[9px] text-sky-100/70 leading-tight">
              Microwave specular scattering indicates standing flood waters.
            </p>
          </div>
        )}

        {/* MNDWI Water Index Delta */}
        {evidence.waterIndexDeltaMndwi !== undefined && (
          <div className="p-2.5 rounded bg-blue-950/30 border border-blue-800/60 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-blue-300 font-bold">
              <span className="flex items-center gap-1">
                <Waves className="w-3 h-3" />
                ΔMNDWI WATER
              </span>
              <span>+{evidence.waterIndexDeltaMndwi}</span>
            </div>
            <p className="text-[9px] text-blue-100/70 leading-tight">
              Green vs SWIR reflection surge indicates surface water expansion.
            </p>
          </div>
        )}

        {/* NDVI Vegetation Loss */}
        {evidence.vegetationIndexDeltaNdvi !== undefined && (
          <div className="p-2.5 rounded bg-amber-950/30 border border-amber-800/60 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold">
              <span className="flex items-center gap-1">
                <Mountain className="w-3 h-3" />
                ΔNDVI SCARP
              </span>
              <span>{evidence.vegetationIndexDeltaNdvi}</span>
            </div>
            <p className="text-[9px] text-amber-100/70 leading-tight">
              Near-Infrared canopy loss indicates slope scouring & debris scouring.
            </p>
          </div>
        )}
      </div>

      {/* Before / After Observation Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
        {/* Pre-Disaster Baseline */}
        <div className="p-2.5 rounded bg-command-surface/60 border border-command-border space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>PRE-DISASTER SATELLITE BASELINE</span>
          </div>
          <p className="text-command-muted text-[10px] leading-relaxed">
            {evidence.preDisasterObservation}
          </p>
        </div>

        {/* Post-Disaster Observation */}
        <div className="p-2.5 rounded bg-command-surface/60 border border-command-border space-y-1">
          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[10px]">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>POST-DISASTER OBSERVATION</span>
          </div>
          <p className="text-rose-100/90 text-[10px] leading-relaxed">
            {evidence.postDisasterObservation}
          </p>
        </div>
      </div>

      {/* Synthesis Note */}
      <div className="p-2 rounded bg-command-surface/40 border border-command-border/50 text-[10px] text-command-muted leading-relaxed">
        <strong className="text-command-text">Analytical Synthesis: </strong>
        {evidence.description}
      </div>
    </div>
  );
};
