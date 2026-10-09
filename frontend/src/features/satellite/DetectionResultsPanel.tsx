import React from 'react';
import type { ChangeDetectionResult } from '../../types/satellite';
import { DataSourceBadge } from '../../components/common/DataSourceBadge';
import { 
  Waves, 
  Mountain, 
  Activity, 
  AlertTriangle, 
  FileCheck
} from 'lucide-react';

interface DetectionResultsPanelProps {
  result: ChangeDetectionResult;
  isAnalyzing?: boolean;
}

export const DetectionResultsPanel: React.FC<DetectionResultsPanelProps> = ({
  result,
  isAnalyzing = false,
}) => {
  return (
    <div className={`bg-white dark:bg-command-card border rounded-2xl p-4 sm:p-5 font-sans shadow-md space-y-4 transition-all ${
      isAnalyzing ? 'border-blue-500 shadow-lg' : 'border-slate-200 dark:border-command-border'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-command-border">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300">
              Prototype Analysis Result
            </span>
            <span className="text-xs text-slate-500 dark:text-command-dim">
              Method: {result.method.replace(/_/g, ' ')}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-command-text">
            Satellite Change Summary & Measured Area
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center text-xs text-slate-500 dark:text-command-dim border border-slate-200 dark:border-command-border px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-command-panel">
            Confidence: Not available (requires ground survey)
          </span>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Flood Inundation Area */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Water & Flood Extent</span>
            <Waves className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-xl font-bold text-cyan-700 dark:text-cyan-400">
            {result.metrics.floodExtentKm2} <span className="text-xs font-normal text-slate-500">km²</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-command-dim">
            {result.metrics.floodExtentHectares} hectares
          </div>
        </div>

        {/* Metric 2: Scarp & Debris Modification */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Landslide & Scarp Area</span>
            <Mountain className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
            {result.metrics.scarpDebrisExtentKm2} <span className="text-xs font-normal text-slate-500">km²</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-command-dim">
            {result.metrics.scarpDebrisExtentHectares} hectares
          </div>
        </div>

        {/* Metric 3: Active Surge Corridor */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Affected River Length</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-rose-700 dark:text-rose-400">
            {result.metrics.riverCorridorLengthKm} <span className="text-xs font-normal text-slate-500">km</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-command-dim">
            Bhote Koshi valley corridor
          </div>
        </div>

        {/* Metric 4: Total Examined Corridor */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-command-panel border border-slate-200 dark:border-command-border space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Examined Area</span>
            <FileCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
            4.82 <span className="text-xs font-normal text-slate-500">km²</span>
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            {result.detectedPolygonsCount} change zones detected
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-command-panel border border-blue-200 dark:border-command-border text-xs space-y-1">
        <span className="font-bold text-slate-700 dark:text-command-dim uppercase tracking-wider block">
          Plain Language Interpretation:
        </span>
        <p className="text-slate-800 dark:text-command-text leading-relaxed text-xs">
          {result.summary}
        </p>
      </div>

      {/* Provenance & Acquisition Strip */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-command-surface/60 border border-slate-200 dark:border-command-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <DataSourceBadge provenance={result.sensorProvenance} showDetails />
        </div>

        <div className="flex items-center gap-4 text-slate-500 dark:text-command-dim text-xs flex-wrap">
          <div>
            <span>Data Source: </span>
            <strong className="text-slate-800 dark:text-command-text">Copernicus Sentinel Hub / USGS</strong>
          </div>
          <div>
            <span>Status: </span>
            <strong className="text-amber-800 dark:text-amber-300">Precomputed prototype analysis</strong>
          </div>
          <div>
            <span>Recommended Next Step: </span>
            <strong className="text-blue-700 dark:text-sky-300">Ground survey by local teams</strong>
          </div>
        </div>
      </div>

      {/* Caveats / Limitations Notice */}
      <div className="space-y-1.5 pt-1">
        {result.caveats.map((caveat, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-2.5 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>{caveat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
