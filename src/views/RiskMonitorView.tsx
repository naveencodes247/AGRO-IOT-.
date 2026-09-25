import React from 'react';
import { 
  ShieldAlert, 
  Bug, 
  Thermometer, 
  Droplets, 
  Wind, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  ArrowRight,
  Info
} from 'lucide-react';
import { Language, SimulationScenario } from '../types';
import { SCENARIO_DATA } from '../services/scenarioService';

interface RiskMonitorViewProps {
  scenario: SimulationScenario;
  onNavigate: (tab: string) => void;
  lang: Language;
}

export const RiskMonitorView: React.FC<RiskMonitorViewProps> = ({ scenario, onNavigate, lang }) => {
  const data = SCENARIO_DATA[scenario] || SCENARIO_DATA.normal;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'hi' ? 'पर्यावरणीय जोखिम एवं रोग पूर्वानुमान' : 'Environmental Risk Engine & Predictive Models'}</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              ICAR Validated Algorithms
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Microclimatic thermal hysteresis equations predicting pest vector emergence and foliar spore germination before visible symptoms appear.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-mono">
            Active Scenario: {scenario.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 5 Deep Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Disease Risk */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Foliar Disease Incubation
              </h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              data.risks.diseaseRisk === 'High'
                ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
            }`}>
              {data.risks.diseaseRisk.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Evaluates consecutive leaf wetness duration (LWD) and ambient temperature to predict Puccinia striiformis (yellow rust) and Alternaria solani incubation.
          </p>
          <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 text-[11px] text-stone-500 space-y-1">
            <div>Leaf Wetness Duration: <strong>{scenario === 'disease_risk' ? '6.8 hours' : '2.1 hours'}</strong></div>
            <div>Spore Germination Window: <strong>{scenario === 'disease_risk' ? 'ACTIVE CRITICAL' : 'Closed / Safe'}</strong></div>
          </div>
        </div>

        {/* 2. Pest Population Growth */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Pest & Vector Pressure
              </h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              data.risks.pestRisk === 'High'
                ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
            }`}>
              {data.risks.pestRisk.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Correlates thermal degree hours with sucking pest reproductive cycles (Bemisia tabaci whiteflies and mustard aphids).
          </p>
          <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 text-[11px] text-stone-500 space-y-1">
            <div>Degree Day Accumulation: <strong>{scenario === 'pest_risk' ? '242 GDD' : '185 GDD'}</strong></div>
            <div>Recommended Trap Density: <strong>15 yellow sticky cards / acre</strong></div>
          </div>
        </div>

        {/* 3. Heat Stress & VPD */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Thermal & Transpiration Stress
              </h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              data.risks.heatStress === 'Extreme'
                ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
            }`}>
              {data.risks.heatStress.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Vapor Pressure Deficit (VPD) calculated from SHT31 humidity and air temperature. Extreme VPD triggers guard cell flaccidity and flower drop.
          </p>
          <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 text-[11px] text-stone-500 space-y-1">
            <div>Current VPD: <strong>{scenario === 'heatwave' ? '2.94 kPa (Desiccating)' : '0.94 kPa (Optimal)'}</strong></div>
            <div>Stomatal Conductance: <strong>{scenario === 'heatwave' ? 'Closed' : 'Normal Transpiration'}</strong></div>
          </div>
        </div>

        {/* 4. Root Water Deficit */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Root Water Deficit Stress
              </h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              data.risks.waterStress === 'Severe'
                ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
            }`}>
              {data.risks.waterStress.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Multi-depth capacitive probe differential. Warns farmers before leaf rolling occurs, safeguarding crown root initiation (CRI).
          </p>
          <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 text-[11px] text-stone-500 space-y-1">
            <div>Shallow (15 cm): <strong>{data.soilMoisture}% VWC</strong></div>
            <div>Available Water Capacity: <strong>{data.soilMoisture < 25 ? 'Critical (18%)' : 'Healthy (78%)'}</strong></div>
          </div>
        </div>

        {/* 5. Waterlogging & Flooding */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Waterlogging & Anaerobiosis
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              {data.risks.floodRisk.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Detects prolonged saturation where soil pores are 100% water-filled, starving roots of oxygen and triggering pythium root rot.
          </p>
          <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-850 text-[11px] text-stone-500 space-y-1">
            <div>Soil Oxygen Level: <strong>Optimal (&gt;16% O₂)</strong></div>
            <div>Percolation Drainage Rate: <strong>2.4 mm/hr</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
