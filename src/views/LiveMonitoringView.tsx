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
  CheckCircle2, 
  Cpu, 
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react';
import { Farm, Language, SensorReading } from '../types';
import { EmptyState } from '../components/common/EmptyState';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';

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

  const currentMoistureVal = selectedDepth === '15' ? (moisture15?.value ?? 28.4) : (moisture30?.value ?? 34.2);

  return (
    <div className="space-y-5 select-none font-sans pb-10">
      {/* Unified Page Header */}
      <PageHeader
        title={lang === 'hi' ? 'लाइव खेत निगरानी' : 'Live Monitoring'}
        subtitle={lang === 'hi'
          ? 'रीयल-टाइम सेंसर टेलीमेट्री, मृदा नमी प्रोफाइल और फील्ड उपकरण स्थिति'
          : "Granular sensor telemetry, capacitive soil moisture depth profiles, and field actuator telemetry"}
        actions={
          <>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#141b16] text-xs font-semibold text-stone-600 dark:text-stone-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gateway: <strong className="font-mono text-stone-800 dark:text-stone-200">{farm.gatewayId}</strong></span>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#141b16] border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 text-xs font-semibold text-stone-700 dark:text-stone-200 shadow-2xs cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#0fa958] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{lang === 'hi' ? 'ताज़ा करें' : 'Refresh Telemetry'}</span>
            </button>

            <button
              onClick={onToggleDemoMode}
              className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 underline px-2 py-1 cursor-pointer"
            >
              {isDemoMode ? 'Simulated' : 'Live Mode'}
            </button>
          </>
        }
      />

      {/* Main Grid: Soil Moisture Profile + Microclimate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (7 cols): Soil Moisture Depth Profile Card */}
        <Card className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Root Zone Soil Moisture Profile
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Multi-depth capacitive frequency domain reflectometry
                  </p>
                </div>
              </div>

              {/* Depth Selector Pill Toggle */}
              <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-850 rounded-xl text-xs font-semibold self-start sm:self-auto">
                <button
                  onClick={() => setSelectedDepth('15')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedDepth === '15'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  15 cm Topsoil
                </button>
                <button
                  onClick={() => setSelectedDepth('30')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedDepth === '30'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  30 cm Deep Root
                </button>
              </div>
            </div>

            {/* Reading Gauge Area */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2 items-center">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                  Active Depth ({selectedDepth} cm)
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-sky-600 font-mono">
                    {currentMoistureVal}%
                  </span>
                  <span className="text-xs text-stone-400 font-medium">VWC</span>
                </div>
                <StatusBadge status="Optimal" variant="healthy" size="xs" dot={true} />
              </div>

              {/* Threshold Gauge Bar */}
              <div className="sm:col-span-2 space-y-2">
                <div className="flex justify-between text-[11px] text-stone-500 font-medium">
                  <span>Wilting Point (20%)</span>
                  <span>Target Range (25 - 45%)</span>
                  <span>Saturation (50%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden flex relative">
                  <div className="w-1/4 h-full bg-amber-400/40 border-r border-white/20" />
                  <div className="w-1/2 h-full bg-[#0fa958]/30 border-r border-white/20" />
                  <div className="w-1/4 h-full bg-sky-400/30" />
                  {/* Position pointer marker */}
                  <div
                    className="absolute top-0 bottom-0 w-2 bg-sky-600 rounded-full shadow-sm -ml-1 transition-all duration-300"
                    style={{ left: `${Math.min(100, Math.max(0, (currentMoistureVal / 50) * 100))}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-400">
                  {selectedDepth === '15' 
                    ? 'Topsoil moisture is stable. Drip pulse not required for the next 4 hours.'
                    : 'Subsurface root zone water buffer adequate for active vegetative transpiration.'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
            <span>Sensor Node: <strong className="font-mono text-stone-700 dark:text-stone-300">NODE-ESP32-W1</strong></span>
            <span>Transmission: LoRa 865 MHz (SF7)</span>
          </div>
        </Card>

        {/* Right Column (5 cols): Microclimate Readings */}
        <Card className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <CardHeader
              icon={Sun}
              title="Microclimate Environment"
              subtitle="Gateway weather sensor array"
              actionText="Calibrate"
              onAction={() => {}}
            />

            <div className="grid grid-cols-2 gap-2.5">
              {/* Temp */}
              <div className="p-3 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-medium">Ambient Temp</span>
                  <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="text-xl font-black text-stone-900 dark:text-stone-100">
                  {temp?.value ?? 24.6}°C
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">Ideal: 18 - 30°C</div>
              </div>

              {/* Humidity */}
              <div className="p-3 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-medium">Rel Humidity</span>
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                </div>
                <div className="text-xl font-black text-stone-900 dark:text-stone-100">
                  {humidity?.value ?? 68}%
                </div>
                <div className="text-[10px] text-stone-400">VPD: 1.14 kPa</div>
              </div>

              {/* Soil Temp */}
              <div className="p-3 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-medium">Soil Temp</span>
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-black text-stone-900 dark:text-stone-100">
                  {soilTemp?.value ?? 22.1}°C
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">Microbial active</div>
              </div>

              {/* Solar Radiation */}
              <div className="p-3 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-medium">Solar Insolation</span>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-black text-stone-900 dark:text-stone-100">
                  {solar?.value ?? 720} <span className="text-[10px] font-normal text-stone-400">W/m²</span>
                </div>
                <div className="text-[10px] text-stone-400">Clear Sky Index</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400 flex justify-between">
            <span>Dew Point: 18.2°C</span>
            <span>Barometric: 1012 hPa</span>
          </div>
        </Card>
      </div>

      {/* Row 2: Hydraulic Actuators + Device Hardware Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Hydraulic Actuators */}
        <Card className="p-4 sm:p-5 space-y-4">
          <CardHeader
            icon={Droplets}
            title="Field Actuators & Solenoid Valves"
            subtitle="ESP32 Relay Controller channel #1"
          />

          <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/40 dark:bg-stone-900/30 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Solenoid Valve Line 01 (North Block Drip)
              </div>
              <div className="text-[11px] text-stone-400">
                24V DC normally closed solenoid valve
              </div>
            </div>

            <button
              onClick={() => setIsValveActive(!isValveActive)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isValveActive
                  ? 'bg-[#0fa958] text-white'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              {isValveActive ? 'VALVE OPEN' : 'VALVE CLOSED'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800/60">
              <span className="text-[10px] text-stone-400">Line Pressure</span>
              <div className="font-bold text-stone-800 dark:text-stone-200 mt-0.5">{isValveActive ? '2.1 bar' : '0.0 bar'}</div>
            </div>
            <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800/60">
              <span className="text-[10px] text-stone-400">Flow Rate</span>
              <div className="font-bold text-stone-800 dark:text-stone-200 mt-0.5">{isValveActive ? '18.5 L/min' : '0 L/min'}</div>
            </div>
            <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800/60">
              <span className="text-[10px] text-stone-400">Mode</span>
              <div className="font-bold text-emerald-600 mt-0.5">Automated</div>
            </div>
          </div>
        </Card>

        {/* Card 2: Field Gateway Hardware Telemetry */}
        <Card className="p-4 sm:p-5 space-y-4">
          <CardHeader
            icon={Cpu}
            title="Gateway Device Telemetry"
            subtitle="Hardware health & battery charge"
          />

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-800">
              <span className="text-stone-500">Gateway Battery</span>
              <strong className="text-emerald-600 font-mono">{farm.batteryLevel}% (LiFePO4 Solar)</strong>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-800">
              <span className="text-stone-500">LoRa RF Signal Strength</span>
              <strong className="text-stone-800 dark:text-stone-200 font-mono">-{farm.signalStrength} dBm (Good)</strong>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-stone-100 dark:border-stone-800">
              <span className="text-stone-500">Total Plots Linked</span>
              <strong className="text-stone-800 dark:text-stone-200">{farm.plots.length} Active Plots</strong>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500">Firmware Build</span>
              <span className="font-mono text-stone-400 text-[11px]">AGRO-ESP32-v2.4.1-IN</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
