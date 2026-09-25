import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Thermometer, 
  Wind, 
  Cloud, 
  Sun, 
  CloudRain, 
  Power, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  Sliders, 
  ArrowUp, 
  ArrowDown, 
  Compass, 
  ChevronDown, 
  ChevronRight, 
  Info, 
  Cpu, 
  Camera, 
  Radio, 
  BatteryMedium, 
  SunMedium, 
  FileText,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
  Check,
  Zap,
  MapPin,
  Building2
} from 'lucide-react';
import { 
  liveFarmSimulation, 
  LiveFarmState, 
  FarmPlotModel 
} from '../services/liveFarmSimulationService';
import { SimulationScenario } from '../types';
import { GoogleEarthSatelliteViewer } from '../components/common/GoogleEarthSatelliteViewer';
import { TelemetryTrendsGraph } from '../components/common/TelemetryTrendsGraph';

interface FarmCommandCenterViewProps {
  scenario: SimulationScenario;
  onNavigate: (tab: string) => void;
  lang: 'en' | 'hi';
  isLiveMode: boolean;
}

export const FarmCommandCenterView: React.FC<FarmCommandCenterViewProps> = ({
  scenario,
  onNavigate,
  lang,
  isLiveMode,
}) => {
  // Shared stateful telemetry from simulation engine
  const [farmState, setFarmState] = useState<LiveFarmState>(() => liveFarmSimulation.getState());
  
  // 2-Minute Telemetry Countdown Clock
  const [secondsRemaining, setSecondsRemaining] = useState<number>(120);
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState<boolean>(false);
  const [pulseActive, setPulseActive] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Subscribe to engine state updates
  useEffect(() => {
    const unsubscribe = liveFarmSimulation.subscribe((updatedState) => {
      setFarmState({ ...updatedState });
    });
    return () => unsubscribe();
  }, []);

  // 1-second countdown clock for the 2-minute cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          triggerSync();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger telemetry step manually or on timer expiration
  const triggerSync = () => {
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 800);
    liveFarmSimulation.stepTelemetryCycle();
    setSecondsRemaining(120);
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Web Speech API Voice Narration for Advisory
  const handleSpeakAdvisory = () => {
    if (!('speechSynthesis' in window)) {
      alert(lang === 'hi' ? 'आपका ब्राउज़र वॉयस एडवाइजरी का समर्थन नहीं करता।' : 'Speech synthesis not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const advisoryText = lang === 'hi'
      ? `किसान सलाहकार सूचना। उत्तरी खेत में मृदा नमी इष्टतम स्तर 42.5 प्रतिशत पर है। आज दिन में वर्षा की संभावना शून्य है। पूर्वी खेत के गेंहू हेतु शाम को 30 मिनट का ड्रिप चक्र निर्धारित करें।`
      : `Kisan Advisory Notice. Soil moisture in Uttari Khet is optimal at 42.5 percent. Rain probability today is low. Maintain current standby and schedule a 30-minute evening drip pulse for Poorvi Khet wheat crop.`;

    const utterance = new SpeechSynthesisUtterance(advisoryText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const selectedPlot = farmState.plots.find(p => p.id === farmState.selectedPlotId) || farmState.plots[0];

  return (
    <div className="space-y-6 font-sans select-none">
      {/* ============================================================== */}
      {/* 1. COMMAND CENTER TOP OPERATIONAL HEADER                        */}
      {/* Authentic Indian Farm Name & Real-Time Sync Controls           */}
      {/* ============================================================== */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                COMMAND CENTER // SMART FARM OPERATIONS
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                DEMO SIMULATION ACTIVE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                ICAR-ZONE VII // MALWA
              </span>
            </div>

            {/* Indian Farm Name */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                {farmState.farmName}
              </h1>

              {/* Parcel Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFieldDropdownOpen(!fieldDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedPlot.name.split('—')[0].trim()}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {fieldDropdownOpen && (
                  <div 
                    className="absolute left-0 mt-1.5 w-72 py-1.5 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-750 z-50 text-xs"
                    onMouseLeave={() => setFieldDropdownOpen(false)}
                  >
                    <div className="px-3 py-1 text-[10px] font-mono text-stone-400 uppercase font-bold border-b border-stone-100 dark:border-stone-800">
                      Switch Monitored Farm Parcel
                    </div>
                    {farmState.plots.map((plot) => (
                      <button
                        key={plot.id}
                        onClick={() => {
                          liveFarmSimulation.selectPlot(plot.id);
                          setFieldDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center justify-between cursor-pointer ${
                          farmState.selectedPlotId === plot.id ? 'font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' : 'text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{plot.name}</div>
                          <div className="text-[10px] text-stone-400">{plot.crop} • {plot.areaHa} Ha</div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          plot.status === 'Healthy' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {plot.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex flex-wrap items-center gap-2">
              <span>स्थान: <strong className="text-stone-800 dark:text-stone-200">{farmState.location}</strong></span>
              <span>•</span>
              <span>फसल: <strong className="text-stone-800 dark:text-stone-200">{selectedPlot.crop}</strong></span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">स्थिति: {selectedPlot.status.toUpperCase()}</span>
            </p>
          </div>

          {/* Real-time Simulation Controls (Auto Update Timer, Sync Now, Diurnal Cycle) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 2-Minute Auto Telemetry Countdown Indicator */}
            <div 
              onClick={triggerSync}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                pulseActive 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 scale-105' 
                  : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-500'
              }`}
              title="Click to trigger immediate simulated telemetry synchronization"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] text-stone-400 uppercase font-mono">2-MIN AUTO UPDATE</span>
                <span className="font-mono text-xs font-bold mt-0.5">
                  {formatCountdown(secondsRemaining)}
                </span>
              </div>
              <RefreshCw className={`w-3.5 h-3.5 text-stone-400 ml-1 ${pulseActive ? 'animate-spin text-emerald-500' : ''}`} />
            </div>

            {/* Sync Now Button */}
            <button
              onClick={triggerSync}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Sync Now
            </button>

            {/* Diurnal Time-of-Day Simulator */}
            <div className="flex items-center p-0.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] font-bold">
              {(['morning', 'afternoon', 'evening', 'night'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => liveFarmSimulation.setTimeOfDay(t)}
                  className={`px-2 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                    farmState.environment.timeOfDay === t
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Rain Simulator Toggle */}
            <button
              onClick={() => liveFarmSimulation.toggleRain()}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                farmState.environment.isRaining
                  ? 'bg-blue-600 text-white border-blue-700 animate-pulse'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
              }`}
              title="Toggle simulated precipitation"
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>{farmState.environment.isRaining ? 'Rain Active (4.5mm)' : 'Simulate Rain'}</span>
            </button>
          </div>
        </div>

        {/* 4 Farm Overview KPI Metrics Row (Inspired by reference layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-750">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">TOTAL PLOTS</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">{farmState.plots.length}</span>
              <span className="text-xs text-stone-400">Parcels</span>
            </div>
            <span className="text-[10px] text-stone-400 mt-0.5 block">Khasra #104 — #107</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-750">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">ACTIVE CROPS</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">4</span>
              <span className="text-xs text-stone-400">Varieties</span>
            </div>
            <span className="text-[10px] text-stone-400 mt-0.5 block">Soybean • Wheat • Tomato • Mustard</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-750">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">TOTAL AREA</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">5.8</span>
              <span className="text-xs text-stone-400">ha (14.3 acres)</span>
            </div>
            <span className="text-[10px] text-stone-400 mt-0.5 block">Malwa Deep Vertisols</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-750">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">FARM HEALTH INDEX</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{farmState.overallFarmHealthScore}</span>
              <span className="text-xs text-stone-400">/ 100</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Optimal Biomass Score</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. CORE COMMAND CENTER KPI ROW (MATCHES SHARED DESIGN)          */}
      {/* Replaces previous live farm telemetry as requested             */}
      {/* ============================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
              FIELD INTELLIGENCE // SENSORY STATE & RISK OVERVIEW
            </h2>
          </div>
          <span className="text-[11px] font-mono text-stone-400">
            Node Packet #{farmState.system.packetCount} • Synced: {farmState.system.lastPacketTimestamp}
          </span>
        </div>

        {/* 6 Core KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Card 1: CROP HEALTH */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[10px] uppercase tracking-wider text-stone-500">CROP HEALTH</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Optimal
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">95</span>
                <span className="text-xs text-stone-400">/ 100</span>
              </div>
              <div className="text-[10px] font-mono text-emerald-600 font-bold mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Edge Scored</span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400 truncate">
              Chl Index: 48.2 SPAD
            </div>
          </div>

          {/* Card 2: SOIL MOISTURE */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[10px] uppercase tracking-wider text-stone-500">SOIL MOISTURE</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Optimal
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
                  {farmState.soil.moisture}%
                </span>
                <span className="text-xs text-stone-400">VWC</span>
              </div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                Target: 38% - 45%
              </div>
            </div>

            <div className="pt-1.5 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400 truncate">
              Depth: 15cm & 30cm
            </div>
          </div>

          {/* Card 3: TEMPERATURE */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[10px] uppercase tracking-wider text-stone-500">TEMPERATURE</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Normal
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
                  {farmState.environment.temperature}°C
                </span>
              </div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                Range: 22° - 36°
              </div>
            </div>

            <div className="pt-1.5 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400 truncate">
              Soil Temp: {farmState.soil.temperature}°C
            </div>
          </div>

          {/* Card 4: HUMIDITY */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[10px] uppercase tracking-wider text-stone-500">HUMIDITY</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                Moderate
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
                  {farmState.environment.humidity}%
                </span>
                <span className="text-xs text-stone-400">RH</span>
              </div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                Safe &lt; 80%
              </div>
            </div>

            <div className="pt-1.5 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400 truncate">
              Dew Point: {farmState.environment.dewPoint}°C
            </div>
          </div>

          {/* Card 5: RAIN PROBABILITY */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[10px] uppercase tracking-wider text-stone-500">RAIN PROB.</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                Low
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
                  {farmState.environment.isRaining ? '95%' : '10%'}
                </span>
              </div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                Today: {farmState.environment.rainfallMm} mm
              </div>
            </div>

            <div className="pt-1.5 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400 truncate">
              Sky: Partly Cloudy
            </div>
          </div>

          {/* Card 6: IRRIGATION */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[10px] uppercase tracking-wider text-stone-500">IRRIGATION</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                farmState.water.pumpActive 
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
              }`}>
                {farmState.water.pumpActive ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black font-mono ${
                  farmState.water.pumpActive ? 'text-emerald-600' : 'text-stone-900 dark:text-stone-100'
                }`}>
                  {farmState.water.pumpActive ? `${farmState.water.flowRateLpm}` : '0.0'}
                </span>
                <span className="text-xs text-stone-400">L/min</span>
              </div>
              <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                Tank: {Math.round(farmState.water.tankLevelPercent)}%
              </div>
            </div>

            <div className="pt-1.5 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400 truncate">
              Mode: Smart Solar Drip
            </div>
          </div>
        </div>

        {/* 3 High-Impact Intelligence Panels (Risk Matrix, Farmer Advisory, Edge AI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Panel 1: Environmental Risk Indicators */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-extrabold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>ENVIRONMENTAL RISKS</span>
                </span>
                <button
                  onClick={() => onNavigate('risk-monitor')}
                  className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Monitor</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-850 flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-400">Foliar Disease:</span>
                  <span className="font-mono font-bold text-emerald-600">LOW</span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-850 flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-400">Pest Vector:</span>
                  <span className="font-mono font-bold text-amber-600">MODERATE</span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-850 flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-400">Heat Stress:</span>
                  <span className="font-mono font-bold text-emerald-600">LOW</span>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-850 flex items-center justify-between">
                  <span className="text-stone-600 dark:text-stone-400">Waterlogging:</span>
                  <span className="font-mono font-bold text-emerald-600">MINIMAL</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-stone-400 mt-2.5">
              Hysteresis thermal model: Atmospheric transpiration safe (VPD: 1.12 kPa).
            </p>
          </div>

          {/* Panel 2: Farmer Advisory Card with Working Voice Synthesis */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-extrabold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI AGRONOMIST ADVISORY</span>
                </span>
                
                {/* Working Voice Narration Button */}
                <button
                  onClick={handleSpeakAdvisory}
                  className={`px-2 py-0.8 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    isSpeaking
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300'
                  }`}
                  title="Speak Advisory aloud"
                >
                  {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  <span>{isSpeaking ? 'Stop' : 'Speak'}</span>
                </button>
              </div>

              <div className="mt-2 text-xs space-y-1">
                <p className="text-stone-700 dark:text-stone-300 text-[11px] leading-relaxed">
                  {lang === 'hi'
                    ? 'उत्तरी खेत में सोयाबीन की जड़ क्षेत्र नमी 42.5% इष्टतम है। आज दिन में वर्षा नहीं होगी। पूर्वी खेत (गेंहू) के लिए शाम 6 बजे 30 मिनट का ड्रिप चक्र सक्रिय करें।'
                    : 'Maintain current standby. Soil moisture in Uttari Khet is optimal at 42.5%. Schedule a light 30-minute evening drip pulse for Poorvi Khet (Wheat) before sunset.'}
                </p>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[10px]">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Source: ICAR-IISR & KVK Malwa</span>
              <button
                onClick={() => onNavigate('recommendations')}
                className="font-bold text-stone-600 dark:text-stone-300 hover:text-emerald-600 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Full Plan</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Panel 3: Edge AI Vision Status Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-extrabold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                  <span>EDGE AI ON-DEVICE TINYML</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                  INT8 // 84ms
                </span>
              </div>

              <div className="mt-2.5 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span>CMOS Camera Node:</span>
                  <span className="font-mono text-emerald-600 font-bold">READY (1080p)</span>
                </div>
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span>Local Diagnostic Engine:</span>
                  <span className="font-mono text-stone-800 dark:text-stone-200">ICAR MobileNet-V3</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('crop-analyzer')}
              className="mt-2.5 w-full py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Launch Interactive Crop Scan</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN DASHBOARD: SOIL HEALTH, IRRIGATION, GIS EARTH & TRENDS */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================ */}
        {/* LEFT COLUMN (7 COLS): SOIL HEALTH & IRRIGATION CONTROL       */}
        {/* Note: Previous Telemetry Trends REMOVED as requested in #4   */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 space-y-5">
          {/* Soil Health Section (Enhanced from image.png with Indian Vertisol Calibration) */}
          <div className="p-5 rounded-2xl bg-[#3f704d] text-white shadow-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/20">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-200" />
                <span className="font-extrabold text-sm tracking-wide">
                  SOIL HEALTH & CHEMICAL PROFILE (VERTISOLS)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/20 text-white/90">
                MALWA BLACK SOIL
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Nitrogen Bar */}
              <div>
                <div className="flex items-center justify-between text-white/90 text-xs mb-1">
                  <span className="font-semibold">Nitrogen (N Level)</span>
                  <span className="font-mono font-bold">{farmState.soil.nitrogen} ppm (Optimal Range 20-30)</span>
                </div>
                <div className="relative w-full h-3.5 bg-white/20 rounded-md overflow-hidden flex items-center">
                  <div 
                    className="h-full bg-gradient-to-r from-white/40 to-white rounded-md shadow-xs transition-all duration-300"
                    style={{ width: `${Math.min(100, (farmState.soil.nitrogen / 35) * 100)}%` }}
                  />
                  <div className="absolute inset-0 flex justify-between px-1 opacity-20 pointer-events-none">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <span key={i} className="w-0.5 h-full bg-black/40" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Phosphorus Bar */}
              <div>
                <div className="flex items-center justify-between text-white/90 text-xs mb-1">
                  <span className="font-semibold">Phosphorus (P Level)</span>
                  <span className="font-mono font-bold">{farmState.soil.phosphorus} ppm (Adequate)</span>
                </div>
                <div className="relative w-full h-3.5 bg-white/20 rounded-md overflow-hidden flex items-center">
                  <div 
                    className="h-full bg-gradient-to-r from-white/40 to-white rounded-md shadow-xs transition-all duration-300"
                    style={{ width: `${Math.min(100, (farmState.soil.phosphorus / 20) * 100)}%` }}
                  />
                  <div className="absolute inset-0 flex justify-between px-1 opacity-20 pointer-events-none">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <span key={i} className="w-0.5 h-full bg-black/40" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Potassium Bar */}
              <div>
                <div className="flex items-center justify-between text-white/90 text-xs mb-1">
                  <span className="font-semibold">Potassium (K Level)</span>
                  <span className="font-mono font-bold">{farmState.soil.potassium} ppm (Rich Vertisol Reserve)</span>
                </div>
                <div className="relative w-full h-3.5 bg-white/20 rounded-md overflow-hidden flex items-center">
                  <div 
                    className="h-full bg-gradient-to-r from-white/40 to-white rounded-md shadow-xs transition-all duration-300"
                    style={{ width: `${Math.min(100, (farmState.soil.potassium / 30) * 100)}%` }}
                  />
                  <div className="absolute inset-0 flex justify-between px-1 opacity-20 pointer-events-none">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <span key={i} className="w-0.5 h-full bg-black/40" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary Soil Metrics (pH and EC) */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/15 text-xs text-white/90">
                <div className="flex items-center justify-between bg-black/15 p-2 rounded-lg">
                  <span>Soil pH Reaction:</span>
                  <strong className="font-mono">7.2 (Neutral Vertisol)</strong>
                </div>
                <div className="flex items-center justify-between bg-black/15 p-2 rounded-lg">
                  <span>Electrical Cond. (EC):</span>
                  <strong className="font-mono">{farmState.soil.ec} mS/cm</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Irrigation Command Panel (Requirement #14) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    IRRIGATION COMMAND & HYDRAULIC CONTROL
                  </h3>
                  <span className="text-[10px] text-stone-400">
                    Source: Narmada Sump & Solar Tubewell (7.5 HP) • Last Cycle: {farmState.water.lastIrrigationTime}
                  </span>
                </div>
              </div>

              {/* Interactive ON / OFF Toggle Button */}
              <button
                onClick={() => liveFarmSimulation.toggleIrrigation()}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                  farmState.water.pumpActive
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-[#143e24] hover:bg-[#1a4f2e] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{farmState.water.pumpActive ? 'HALT SOLAR PUMP' : 'ENGAGE SOLAR PUMP'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750">
                <span className="text-[10px] text-stone-400 font-semibold block">PUMP STATUS</span>
                <span className={`text-base font-black font-mono mt-0.5 block ${
                  farmState.water.pumpActive ? 'text-emerald-600' : 'text-stone-500'
                }`}>
                  {farmState.water.pumpActive ? 'ACTIVE (7.5 HP)' : 'OFF'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750">
                <span className="text-[10px] text-stone-400 font-semibold block">SOLENOID VALVE #1</span>
                <span className={`text-base font-black font-mono mt-0.5 block ${
                  farmState.water.valveOpen ? 'text-emerald-600' : 'text-stone-500'
                }`}>
                  {farmState.water.valveOpen ? 'OPEN (Zone A)' : 'CLOSED'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750">
                <span className="text-[10px] text-stone-400 font-semibold block">HYDRAULIC FLOW</span>
                <span className="text-base font-black font-mono text-blue-600 mt-0.5 block">
                  {farmState.water.flowRateLpm} L/min
                </span>
              </div>

              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750">
                <span className="text-[10px] text-stone-400 font-semibold block">SUMP TANK LEVEL</span>
                <span className="text-base font-black font-mono text-stone-900 dark:text-stone-100 mt-0.5 block">
                  {Math.round(farmState.water.tankLevelPercent)}%
                </span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed bg-[#f4f7f4] dark:bg-[#14261a] p-2.5 rounded-lg border border-[#d6e2d8] dark:border-[#20402b]">
              💡 <strong>Hydraulic Simulation Physics:</strong> Engaging irrigation immediately activates the 7.5 HP solar pump, opens solenoid valve #1, records discharge flow rate, draws from the Narmada sump, and gradually increases root-zone soil moisture.
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN (5 COLS): REAL-TIME GOOGLE EARTH/SATELLITE MAP, */}
        {/* PARCEL DOSSIER & ANIMATED TRENDS GRAPH                       */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 space-y-5">
          {/* REQUIREMENT 4: REAL-TIME GOOGLE EARTH / SATELLITE IMAGE VIEWER */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
                <span>REAL-TIME GOOGLE EARTH & SATELLITE GIS</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">
                SENTINEL-2 • SUB-METER
              </span>
            </div>

            <GoogleEarthSatelliteViewer
              plots={farmState.plots}
              selectedPlotId={farmState.selectedPlotId}
              onSelectPlot={(pId) => liveFarmSimulation.selectPlot(pId)}
              lang={lang}
              onExpandView={() => onNavigate('live-monitoring')}
            />
          </div>

          {/* Selected Plot Detailed Telemetry Inspector */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                PARCEL INSPECTION DOSSIER
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedPlot.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedPlot.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px]">Active Parcel:</span>
                <strong className="text-stone-900 dark:text-stone-100">{selectedPlot.name}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Crop Variety:</span>
                <strong className="text-stone-900 dark:text-stone-100">{selectedPlot.crop}</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Plot Moisture:</span>
                <strong className="font-mono text-blue-600">{selectedPlot.soilMoisture}% VWC</strong>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">Plot Area:</span>
                <strong className="font-mono text-stone-900 dark:text-stone-100">{selectedPlot.areaHa} Hectares</strong>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
              {selectedPlot.statusReason}
            </p>
          </div>

          {/* REQUIREMENT 5: IN PLACE OF RECENT FARM ACTIVITY LOG -> TRENDS WITH GRAPH & ANIMATION */}
          <TelemetryTrendsGraph
            history={farmState.history}
            activities={farmState.activities}
            lang={lang}
          />

          {/* Live Alerts & Recommendations */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                ACTIVE ALERTS & DIRECTIVES
              </span>
              <span className="text-[10px] font-mono text-stone-400">{farmState.alerts.length} Active</span>
            </div>

            {farmState.alerts.length > 0 ? (
              <div className="space-y-2">
                {farmState.alerts.map((alt) => (
                  <div key={alt.id} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-300">
                      <span>{alt.title}</span>
                      <span className="text-[10px] font-mono">{alt.time}</span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 text-[11px]">{alt.description}</p>
                    <div className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                      Action: {alt.action}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero active alerts. All soil & microclimate telemetry within safe agronomic parameters.</span>
              </div>
            )}
          </div>

          {/* Sensor Device Status Health Check */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs space-y-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-stone-900 dark:text-stone-100 block">
              SENSOR & HARDWARE MATRIX
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-stone-50 dark:bg-stone-850 flex justify-between">
                <span>Soil Sensor Probes:</span>
                <span className="font-mono font-bold text-emerald-600">LoRa Node-01</span>
              </div>
              <div className="p-2 rounded bg-stone-50 dark:bg-stone-850 flex justify-between">
                <span>Weather SHT31:</span>
                <span className="font-mono font-bold text-emerald-600">ACTIVE</span>
              </div>
              <div className="p-2 rounded bg-stone-50 dark:bg-stone-850 flex justify-between">
                <span>Narmada Sump Float:</span>
                <span className="font-mono font-bold text-emerald-600">CONNECTED</span>
              </div>
              <div className="p-2 rounded bg-stone-50 dark:bg-stone-850 flex justify-between">
                <span>Foliar CMOS Camera:</span>
                <span className="font-mono font-bold text-emerald-600">READY</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
              <span>ESP32 Gateway: Malwa Node #901</span>
              <span className="font-mono">Battery: {Math.round(farmState.system.batteryPercent)}% • Solar 14.8W</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
