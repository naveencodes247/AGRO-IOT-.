import React, { useState } from 'react';
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Wind, 
  Sun, 
  Radio, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  Power, 
  BatteryMedium, 
  Cpu, 
  CheckCircle2, 
  Info,
  Clock
} from 'lucide-react';
import { Farm, Language, SensorReading } from '../types';
import { DemoBadge } from '../components/common/DemoBadge';
import { EmptyState } from '../components/common/EmptyState';
import { FieldConditionHub } from '../components/common/FieldConditionHub';

interface LiveMonitoringViewProps {
  farm: Farm | null;
  readings: SensorReading[];
  onRefresh: () => void;
  lang: Language;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onConnectFarmModal: () => void;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  farm,
  readings,
  onRefresh,
  lang,
  isDemoMode,
  onToggleDemoMode,
  onConnectFarmModal,
}) => {
  const [isValveActive, setIsValveActive] = useState<boolean>(false);
  const [selectedDepth, setSelectedDepth] = useState<'15' | '30'>('15');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      onRefresh();
      setIsRefreshing(false);
    }, 600);
  };

  // If no farm registered at all
  if (!farm) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={Radio}
          badge="WAITING FOR FARM CONNECTION"
          title={lang === 'hi' ? 'कोई सक्रिय खेत सेंसर कनेक्ट नहीं है' : 'No Active Farm Sensors Connected'}
          description={lang === 'hi'
            ? 'सेंसर डेटा प्राप्त करने के लिए अपने खेत के ESP32 या LoRaWAN गेटवे को पेयर करें। या इंटरफ़ेस का परीक्षण करने के लिए डेमो डेटा देखें।'
            : 'To receive real-time microclimate and soil moisture readings, pair your on-field ESP32 or LoRaWAN gateway. You can also toggle demo mode to test the telemetry interface.'}
          actionLabel={lang === 'hi' ? 'खेत डिवाइस कनेक्ट करें' : 'Connect Farm Device'}
          onAction={onConnectFarmModal}
          secondaryActionLabel={lang === 'hi' ? 'डेमो टेलीमेट्री दिखाएं' : 'View Demo Telemetry'}
          onSecondaryAction={onToggleDemoMode}
        />
      </div>
    );
  }

  const moisture15 = readings.find(r => r.sensorType === 'soil_moisture_shallow');
  const moisture30 = readings.find(r => r.sensorType === 'soil_moisture_deep');
  const temp = readings.find(r => r.sensorType === 'ambient_temp');
  const humidity = readings.find(r => r.sensorType === 'humidity');
  const soilTemp = readings.find(r => r.sensorType === 'soil_temp');
  const solar = readings.find(r => r.sensorType === 'solar_radiation');

  return (
    <div className="space-y-6">
      {/* Highlighted Field Condition Hub */}
      <FieldConditionHub
        farm={farm}
        readings={readings}
        lang={lang}
        isLiveMode={!isDemoMode}
      />

      {/* Top Telemetry Header & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {lang === 'hi' ? 'लाइव खेत निगरानी एवं टेलीमेट्री' : 'Live Farm Telemetry & Environmental Status'}
            </h2>
            <DemoBadge mode="demo" onToggleMode={onToggleDemoMode} />
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <span>Gateway: <strong className="font-mono text-stone-700 dark:text-stone-300">{farm.gatewayId}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              RF Signal 82 dBm
            </span>
            <span>•</span>
            <span>Last Packet: Just now</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 text-stone-700 dark:text-stone-200 text-xs font-semibold transition-all cursor-pointer ${
              isRefreshing ? 'opacity-70' : ''
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{lang === 'hi' ? 'ताज़ा करें' : 'Refresh Telemetry'}</span>
          </button>

          <button
            onClick={onToggleDemoMode}
            className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline px-2 py-1 cursor-pointer"
          >
            {lang === 'hi' ? 'खाली स्थिति देखें' : 'Test Empty State'}
          </button>
        </div>
      </div>

      {/* Primary Soil Moisture Telemetry Block */}
      <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {lang === 'hi' ? 'मृदा नमी प्रोफ़ाइल (Soil Moisture Depth Analysis)' : 'Root Zone Soil Moisture Profile'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Capacitive frequency domain sensors in active wheat root zone
                </p>
              </div>
            </div>
          </div>

          {/* Depth Toggle */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setSelectedDepth('15')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                selectedDepth === '15'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              15 cm (Topsoil)
            </button>
            <button
              onClick={() => setSelectedDepth('30')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                selectedDepth === '30'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              30 cm (Root Reservoir)
            </button>
          </div>
        </div>

        {/* Moisture Reading Gauges & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 items-center">
          {/* Main Visual Percentage */}
          <div className="space-y-2">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              Current Moisture Reading ({selectedDepth === '15' ? '15 cm Depth' : '30 cm Depth'})
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-blue-700 dark:text-blue-400 font-mono">
                {selectedDepth === '15' ? moisture15?.value : moisture30?.value}%
              </span>
              <span className="text-sm font-semibold text-stone-500">Volumetric Water Content (VWC)</span>
            </div>

            {/* Gauge bar */}
            <div className="space-y-1 pt-2">
              <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden flex">
                {/* Dry zone 0-25% */}
                <div className="w-1/4 h-full bg-amber-400/40 border-r border-white/20" title="Wilting point risk" />
                {/* Optimal zone 25-45% */}
                <div className="w-1/2 h-full bg-emerald-500/40 border-r border-white/20 relative">
                  <div 
                    className="absolute top-0 bottom-0 w-1.5 bg-blue-600 rounded-full"
                    style={{ left: `${((Number(selectedDepth === '15' ? moisture15?.value : moisture30?.value) - 25) / 20) * 100}%` }}
                  />
                </div>
                {/* Waterlogged zone 45-100% */}
                <div className="w-1/4 h-full bg-blue-400/40" title="Excess saturation / hypoxia" />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>0% Dry</span>
                <span className="text-emerald-600 font-bold">Optimal Range (25 - 45%)</span>
                <span>100% Saturation</span>
              </div>
            </div>
          </div>

          {/* Soil Agronomic Context */}
          <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-950/50 border border-stone-200/80 dark:border-stone-800 space-y-1.5 text-xs">
            <div className="font-bold text-stone-900 dark:text-stone-100">
              Soil Matrix Status: Optimal Aerobic Retention
            </div>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Available capillary water is adequate for root nutrient transport. Permanent Wilting Point (PWP) for this loamy alluvial soil is 12% VWC. Field capacity is 36% VWC.
            </p>
            <div className="pt-2 text-[11px] text-stone-500 flex items-center justify-between">
              <span>Depletion Rate: -0.4% / day</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">No Water Stress</span>
            </div>
          </div>

          {/* Simulated Irrigation Valve Control */}
          <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                  Solenoid Irrigation Valve #1
                </span>
                <span className="text-[11px] text-stone-500">
                  {isValveActive ? 'Water flowing via drip line' : 'Valve closed (Standby)'}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                isValveActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
              }`}>
                {isValveActive ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>

            <button
              onClick={() => setIsValveActive(!isValveActive)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isValveActive
                  ? 'bg-rose-700 hover:bg-rose-800 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isValveActive ? 'Close Valve #1' : 'Simulate Open Valve #1'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Environmental & Microclimate Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Air Temperature */}
        <div className="p-5 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {lang === 'hi' ? 'वायु तापमान' : 'Air Temperature'}
            </span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {temp?.value}°C
            </span>
            <span className="text-xs text-stone-400">Ambient</span>
          </div>
          <div className="mt-2 text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
            <span>Ideal Range: 18 - 30°C</span>
            <span className="text-emerald-600 font-bold">Normal</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="p-5 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {lang === 'hi' ? 'हवा में नमी' : 'Relative Humidity'}
            </span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {humidity?.value}%
            </span>
            <span className="text-xs text-stone-400">RH</span>
          </div>
          <div className="mt-2 text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
            <span>Morning dew present</span>
            <span className="text-amber-600 font-bold">Watch Fungi</span>
          </div>
        </div>

        {/* Soil Temperature */}
        <div className="p-5 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {lang === 'hi' ? 'मिट्टी का तापमान' : 'Soil Temperature (15cm)'}
            </span>
            <Thermometer className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {soilTemp?.value}°C
            </span>
            <span className="text-xs text-stone-400">Probe</span>
          </div>
          <div className="mt-2 text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
            <span>Root absorption active</span>
            <span className="text-emerald-600 font-bold">Optimal</span>
          </div>
        </div>

        {/* Solar Radiation */}
        <div className="p-5 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {lang === 'hi' ? 'सौर विकिरण' : 'Solar Radiation'}
            </span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {solar?.value}
            </span>
            <span className="text-xs text-stone-400">W/m²</span>
          </div>
          <div className="mt-2 text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
            <span>Photosynthesis: Strong</span>
            <span className="text-emerald-600 font-bold">Active</span>
          </div>
        </div>
      </div>

      {/* Environmental Disease Risk Assessment */}
      <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              {lang === 'hi' ? 'रोग संवेदनशीलता सूचकांक' : 'Environmental Disease Vulnerability Matrix'}
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5 leading-relaxed">
              Combination of 68% air humidity and 24.6°C temperature elevates yellow rust and blight incubation risk by 35% compared to baseline. Keep morning scouting active.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="px-3 py-1 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-xs font-extrabold whitespace-nowrap">
            MODERATE RISK
          </span>
        </div>
      </div>
    </div>
  );
};
