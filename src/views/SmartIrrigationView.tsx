import React, { useState } from 'react';
import { 
  Droplets, 
  Power, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Sliders, 
  ShieldCheck, 
  Play, 
  Pause,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { Language } from '../types';

interface SmartIrrigationViewProps {
  lang: Language;
}

export const SmartIrrigationView: React.FC<SmartIrrigationViewProps> = ({ lang }) => {
  const [valveActive, setValveActive] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<string>('zone-1');
  const [moistureThreshold, setMoistureThreshold] = useState<number>(24);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              <span>{lang === 'hi' ? 'स्मार्ट सिंचाई स्वचालन' : 'Autonomous Precision Irrigation'}</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
              Closed Loop Field Valve
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {lang === 'hi'
              ? 'जड़ क्षेत्र की नमी के आधार पर स्वचालित ड्रिप वाल्व नियंत्रण — 38% भूजल बचत'
              : 'Soil matric suction triggers solenoid valves automatically when root water drops below field threshold.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-mono">
            Active Line: Drip Manifold #1
          </span>
        </div>
      </div>

      {/* Main Grid: Valve Controller + Depletion Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Solenoid Actuator Card */}
        <div className="lg:col-span-5 bg-white dark:bg-[#151916] rounded-xl border border-stone-200 dark:border-stone-800 p-5 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                ZONE 1 DRIP EMITTER CONTROLLER
              </span>
              <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                12V Solenoid Valve #1
              </h3>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
              valveActive
                ? 'bg-emerald-500 text-white animate-pulse'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}>
              {valveActive ? 'DISCHARGING' : 'STANDBY'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Current Root Moisture:</span>
              <span className="font-mono font-bold text-stone-900 dark:text-stone-100 text-sm">28.4% VWC</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Auto-Trigger Threshold:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                &lt; {moistureThreshold}% VWC
              </span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '56.8%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>Wilting Point (12%)</span>
              <span>Trigger Point ({moistureThreshold}%)</span>
              <span>Field Capacity (36%)</span>
            </div>
          </div>

          {/* Trigger Toggle Button */}
          <button
            onClick={() => setValveActive(!valveActive)}
            className={`w-full py-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              valveActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-[#143e24] hover:bg-[#1a4f2e] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{valveActive ? 'Halt Active Irrigation Line' : 'Engage 30-Minute Drip Cycle'}</span>
          </button>

          <p className="text-[11px] text-stone-400 text-center">
            ESP32 GPIO 25 Relay Actuator • Auto-timeout safety interlock enabled.
          </p>
        </div>

        {/* Right: Water Conservation Analytics */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white dark:bg-[#151916] rounded-xl border border-stone-200 dark:border-stone-800 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Groundwater & Yield Impact Audit
              </h3>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                PAU Standards Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                  WATER SAVED THIS SEASON
                </span>
                <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-1 block">
                  38.4%
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">vs traditional flood irrigation</span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                  PUMPING ELECTRICITY SAVED
                </span>
                <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                  142 kWh
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">Reduced pump wear</span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                  NEXT SCHEDULED CYCLE
                </span>
                <span className="text-xl font-black font-mono text-stone-900 dark:text-stone-100 mt-1 block">
                  05:30 AM
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">Tomorrow (Early Morning Dew)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#f4f7f4] dark:bg-[#14261a] border border-[#d6e2d8] dark:border-[#20402b] text-xs text-stone-700 dark:text-stone-300 space-y-1">
              <div className="font-bold text-[#143e24] dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Root Aeration Verdict:</span>
              </div>
              <p className="leading-relaxed">
                By maintaining root zone moisture strictly between 24% and 34%, roots avoid anaerobic stress, preventing crown rot and boosting nitrogen uptake efficiency by 18%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
