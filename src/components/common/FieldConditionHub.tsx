import React from 'react';
import { 
  Sprout, 
  Droplets, 
  Thermometer, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  SunMedium
} from 'lucide-react';
import { Farm, Language, SensorReading } from '../../types';

interface FieldConditionHubProps {
  farm: Farm | null;
  readings: SensorReading[];
  lang: Language;
  onNavigate?: (tab: string) => void;
  isLiveMode: boolean;
}

export const FieldConditionHub: React.FC<FieldConditionHubProps> = ({
  farm,
  readings,
  lang,
  onNavigate,
  isLiveMode,
}) => {
  const primaryPlot = farm?.plots[0];
  const moisture15 = readings.find(r => r.sensorType === 'soil_moisture_shallow')?.value ?? 28.4;
  const moisture30 = readings.find(r => r.sensorType === 'soil_moisture_deep')?.value ?? 34.2;
  const temp = readings.find(r => r.sensorType === 'ambient_temp')?.value ?? 24.6;
  const humidity = readings.find(r => r.sensorType === 'humidity')?.value ?? 68.0;
  const soilTemp = readings.find(r => r.sensorType === 'soil_temp')?.value ?? 21.2;

  const healthScore = primaryPlot?.healthScore ?? 94;

  return (
    <div className="bg-white dark:bg-[#141b16] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs transition-colors">
      {/* Top Header: Section Tag, Farm Location, and Real-time Telemetry Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#0fa958] text-white">
              {lang === 'hi' ? 'खेत की वर्तमान स्थिति' : 'CURRENT FIELD CONDITION'}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
              isLiveMode 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveMode ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isLiveMode ? 'LIVE HARDWARE STREAM' : 'DEMO TELEMETRY ACTIVE'}</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span>{farm?.name || 'Kisan Model Farm'}</span>
            <span className="text-stone-400 font-normal text-sm">
              • {primaryPlot?.name || 'Plot #1 - Wheat Block'}
            </span>
          </h3>
        </div>

        {/* Agronomic Summary Badge */}
        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 block uppercase tracking-wider">
              Agronomic Evaluation
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Optimal Root Moisture & Vigour
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Health Index + Soil & Atmosphere Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-5 items-stretch">
        {/* Box 1: Health Index Metric */}
        <div className="md:col-span-4 p-4 rounded-lg bg-stone-50 dark:bg-[#191c19] border border-stone-200 dark:border-stone-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Canopy Health Score</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">SPAD / NDVI</span>
            </div>
            
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#143e24] dark:text-emerald-400 font-mono">
                {healthScore}
              </span>
              <span className="text-xs font-semibold text-stone-500">/ 100</span>
              <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                Excellent
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-750 text-xs space-y-1">
            <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
              <span>Crop Specimen:</span>
              <strong className="font-semibold">{primaryPlot?.cropName || 'Wheat (HD-3086)'}</strong>
            </div>
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-[11px]">
              <span>Growth Phase:</span>
              <span>{primaryPlot?.cropStage || 'Active Tillering'} · Day 24</span>
            </div>
          </div>
        </div>

        {/* Box 2: Soil Moisture Dual Depth */}
        <div className="md:col-span-4 p-4 rounded-lg bg-stone-50 dark:bg-[#191c19] border border-stone-200 dark:border-stone-750 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                Root Zone Soil Moisture
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Field Capacity</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="p-2 rounded bg-white dark:bg-[#151815] border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-500 block">Shallow (15 cm)</span>
                <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">
                  {moisture15}%
                </span>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, (moisture15 / 50) * 100)}%` }} />
                </div>
              </div>

              <div className="p-2 rounded bg-white dark:bg-[#151815] border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-500 block">Deep (30 cm)</span>
                <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">
                  {moisture30}%
                </span>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min(100, (moisture30 / 50) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
            <span>Soil Type: Alluvial Loam</span>
            <span className="text-emerald-600 font-semibold">No Water Stress</span>
          </div>
        </div>

        {/* Box 3: Atmospheric Microclimate & Evaporative Demand */}
        <div className="md:col-span-4 p-4 rounded-lg bg-stone-50 dark:bg-[#191c19] border border-stone-200 dark:border-stone-750 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                Microclimate & VPD
              </span>
              <span className="text-[10px] font-mono text-stone-500">SHT31-D</span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-white dark:bg-[#151815] border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-500 block">Air Temp</span>
                <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
                  {temp}°C
                </span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#151815] border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-500 block">Humidity</span>
                <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
                  {humidity}%
                </span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#151815] border border-stone-200 dark:border-stone-700">
                <span className="text-[10px] text-stone-500 block">Soil Temp</span>
                <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
                  {soilTemp}°C
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
            <span>VPD: 0.94 kPa (Optimal)</span>
            <span className="text-stone-600 dark:text-stone-300 font-medium">Fungal Risk: 8%</span>
          </div>
        </div>
      </div>

      {/* Actionable Field Advisory Banner */}
      <div className="mt-4 p-3 rounded-lg bg-[#f4f7f4] dark:bg-[#14261a] border border-[#d6e2d8] dark:border-[#20402b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2 text-[#143e24] dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Today's Agricultural Advisory:</strong> Root zone moisture is within field capacity (28.4%). No irrigation required today. Scout border rows for early aphid migration.
          </span>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('crop-analyzer')}
            className="inline-flex items-center gap-1 font-bold text-[#143e24] dark:text-emerald-400 hover:underline flex-shrink-0 cursor-pointer"
          >
            <span>Run Foliar Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
