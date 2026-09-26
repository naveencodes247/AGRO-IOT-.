import React from 'react';
import { 
  Zap, 
  Radio, 
  MapPin, 
  Maximize2, 
  SlidersHorizontal, 
  Layers, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Droplets,
  Sprout,
  Activity,
  Sun,
  ShieldCheck,
  Menu,
  ExternalLink,
  Cpu,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { LiveFarmState } from '../services/liveFarmSimulationService';
import { ASSETS } from '../assets/assetMap';
import { SensorLogo } from '../components/common/SensorLogo';

interface ExecutiveFarmHeroViewProps {
  farmState: LiveFarmState;
  lang: 'en' | 'hi';
  isEdgeLive: boolean;
  onToggleEdgeLive: () => void;
  onSwitchToDetailedMap: () => void;
  onSelectSensor: (sensorId: string) => void;
  onSelectKpi: (kpiId: any) => void;
}

export const ExecutiveFarmHeroView: React.FC<ExecutiveFarmHeroViewProps> = ({
  farmState,
  lang,
  isEdgeLive,
  onToggleEdgeLive,
  onSwitchToDetailedMap,
  onSelectSensor,
  onSelectKpi,
}) => {
  // Live formatted values directly from AGRO-IOT simulation/sensors
  const soilMoisture = Math.round(farmState.soil.moisturePercent);
  const airTemp = Math.round(farmState.environment.airTempC || farmState.environment.temperature);
  const tankLevel = Math.round(farmState.water.tankLevelPercent);
  const soilPh = farmState.soil.ph.toFixed(1);
  const soilNitrogen = farmState.soil.nitrogen;
  const flowRate = Math.round(farmState.water.flowRateLpm || 32);
  const lightLux = farmState.environment.lightLux || 680;
  const soilEc = (Math.round(farmState.soil.ec * 100) / 100).toFixed(2);
  const soilTemp = Math.round(farmState.soil.temperature);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 select-none font-sans min-h-[820px] flex flex-col justify-between p-4 sm:p-6 lg:p-7">
      {/* ============================================================== */}
      {/* 1. FULL-BLEED AERIAL GREEN FARM FIELD BACKDROP                 */}
      {/* High-res precision agricultural landscape from the workspace   */}
      {/* ============================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <img
          src={ASSETS.satelliteMap}
          alt="Aerial Precision Farm Field"
          className="w-full h-full object-cover object-[center_30%] filter brightness-90 contrast-110"
        />
        {/* Natural deep olive-forest vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a180e]/65 via-[#102416]/45 to-[#07130b]/85" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>

      {/* ============================================================== */}
      {/* 2. TOP NAVIGATION BAR (Authentic AGRO-IOT English & Hindi)     */}
      {/* ============================================================== */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 sm:pb-5">
        {/* Left Pill Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectKpi('farm-status')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-[#0f2416] text-xs font-black tracking-wide shadow-xl transition-all cursor-pointer hover:scale-102"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#84cc16] animate-pulse" />
            <span>{lang === 'hi' ? 'खेत अवलोकन 2026' : 'AGRO-IOT 2026 • FIELD OVERVIEW'}</span>
          </button>
        </div>

        {/* Center Prominent Headline (Bilingual AGRO-IOT Intelligence) */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {lang === 'hi' ? 'स्मार्ट कृषि कमान एवं नियंत्रण केंद्र' : 'Smart Farm Intelligence & Telemetry'}
          </h1>
          <p className="text-[11px] sm:text-xs text-[#a3e635] font-semibold tracking-wider drop-shadow-md hidden sm:block mt-0.5">
            {lang === 'hi' 
              ? 'रीयल-टाइम आईओटी सेंसर मेश, मिट्टी स्वास्थ्य एवं स्वचालित सिंचाई' 
              : 'Real-Time Edge Sensor Mesh, Soil Stratigraphy & Automated Irrigation'}
          </p>
        </div>

        {/* Right Pill Group */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Edge AI Live / Demo Toggle Pill */}
          <button
            onClick={onToggleEdgeLive}
            className={`px-3.5 py-1.5 rounded-xl border text-[11px] font-black tracking-wide shadow-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              isEdgeLive
                ? 'bg-white/90 text-[#0d2215] border-white hover:bg-white'
                : 'bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-md'
            }`}
            title="Toggle Edge AI Live Telemetry Stream"
          >
            <span className={`w-2 h-2 rounded-full ${isEdgeLive ? 'bg-[#84cc16] animate-pulse' : 'bg-amber-400'}`} />
            <span>{isEdgeLive ? (lang === 'hi' ? 'एज एआई: लाइव' : 'EDGE AI: LIVE') : (lang === 'hi' ? 'डेमो सिमुलेशन' : 'EDGE AI: DEMO')}</span>
          </button>

          {/* Connected Gateway Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold shadow-lg hidden sm:flex items-center gap-1.5 font-mono">
            <Radio className="w-3.5 h-3.5 text-[#84cc16]" />
            <span>ESP32-GW-901</span>
          </div>

          {/* Switch to Detailed Satellite Map & Calibrations */}
          <button
            onClick={onSwitchToDetailedMap}
            className="px-3.5 py-1.5 rounded-xl bg-[#84cc16] hover:bg-[#99e620] text-[#0a1b0e] font-black text-xs transition-all shadow-lg cursor-pointer flex items-center gap-1.5 hover:scale-102"
            title="Open Interactive Satellite Map & All 18 Sensors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'नक्शा व सेंसर' : 'Map & Sensors'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. THREE-COLUMN GLASSMORPHIC MAIN DASHBOARD GRID               */}
      {/* Proportions and visual styling from reference, 100% AGRO-IOT   */}
      {/* ============================================================== */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch flex-1">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN (3 cols out of 12): Soil Health & Field Crop     */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-5 sm:gap-6">
          {/* Card 1: Soil & Irrigation Health (मृदा एवं सिंचाई स्वास्थ्य) */}
          <div 
            onClick={() => onSelectKpi('water')}
            className="p-5 sm:p-6 rounded-3xl bg-[#182c1d]/75 hover:bg-[#182c1d]/85 backdrop-blur-2xl border border-white/20 shadow-2xl text-white space-y-4 cursor-pointer transition-all hover:border-[#84cc16]/50 flex-1 flex flex-col justify-around"
          >
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white/90 tracking-wide">
              <span>{lang === 'hi' ? 'मृदा एवं सिंचाई संतुलन' : 'Soil & Irrigation Health'}</span>
              <span className="w-2 h-2 rounded-full bg-[#84cc16]" />
            </div>

            {/* Metric 1: Root Soil Moisture */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{soilMoisture}%</span>
                <span className="text-xs font-bold text-[#84cc16]">
                  <span className="text-[10px] text-white/70 mr-1">Target 50%</span>
                  {soilMoisture >= 40 && soilMoisture <= 65 ? 'Optimal' : 'Needs Water'}
                </span>
              </div>
              <div className="text-[11px] text-stone-300 font-medium leading-tight">
                {lang === 'hi' ? 'जड़ क्षेत्र मिट्टी की नमी (Root-Zone Moisture)' : 'Root-Zone Capacitive Soil Moisture'}
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* Metric 2: Soil pH Balance */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{soilPh}</span>
                <span className="text-xs font-bold text-[#a3e635]">
                  <span className="text-[10px] text-white/70 mr-1">pH 6.5–7.5</span>
                  Neutral
                </span>
              </div>
              <div className="text-[11px] text-stone-300 font-medium leading-tight">
                {lang === 'hi' ? 'मृदा रासायनिक पीएच स्तर (Soil Acidity/Alkalinity)' : 'Soil Chemical Equilibrium (pH)'}
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* Metric 3: Water Tank Storage Capacity */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{tankLevel}%</span>
                <span className="text-[10px] font-bold text-[#84cc16]">4,200 L Reserve</span>
              </div>
              <div className="text-[11px] text-stone-300 font-medium leading-tight">
                {lang === 'hi' ? 'सिंचाई जल टैंक भंडारण (Water Tank Level)' : 'Irrigation Reservoir Storage Level'}
              </div>
            </div>
          </div>

          {/* Card 2: Golden Wheat Crop in Field Preview */}
          <div 
            onClick={() => onSelectKpi('plots')}
            className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl h-44 sm:h-52 relative group cursor-pointer"
          >
            <img
              src={ASSETS.samples.wheatRust}
              alt="Golden Wheat Ears in Sun"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-xs font-bold text-white drop-shadow-md space-y-0.5">
              <div className="flex items-center justify-between">
                <span>{lang === 'hi' ? 'सक्रिय प्लॉट A: गेहूं एवं सोयाबीन' : 'Active Plot A: Wheat & Soybean'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#84cc16] text-[#0a1b0e] font-black">
                  Optimal
                </span>
              </div>
              <p className="text-[10px] text-stone-300 font-medium">
                {lang === 'hi' ? 'वानस्पतिक कल्ले फूटने की अवस्था • 45 दिन' : 'Vegetative Tillering Stage • 45 Days'}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CENTER COLUMN (6 cols out of 12): THE SHOWSTOPPER CARD       */}
        {/* Donut Ring with Golden Wheat Ear Spike + 6 Sensor Badges     */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl bg-[#162a1c]/80 hover:bg-[#162a1c]/85 backdrop-blur-2xl border border-white/20 p-6 sm:p-7 shadow-2xl text-white relative overflow-hidden transition-all hover:border-[#84cc16]/50">
          
          {/* Card Top Title: Crop Vitality & Sensor Telemetry */}
          <div className="text-center text-xs sm:text-sm font-bold text-white/90 tracking-wide pb-2 flex items-center justify-center gap-2">
            <Sprout className="w-4 h-4 text-[#84cc16]" />
            <span>{lang === 'hi' ? 'फसल स्वास्थ्य एवं लाइव सेंसर मेश टेलीमेट्री' : 'Crop Vitality & Live Sensor Mesh Telemetry'}</span>
          </div>

          {/* Donut Visual Area with Golden Wheat Spike in the Center */}
          <div className="relative my-auto flex flex-col sm:flex-row items-center justify-center gap-6 py-3 sm:py-5">
            
            {/* Left Big Percentage KPI (Crop Vitality Score) */}
            <div className="text-left max-w-[170px] sm:max-w-[190px] z-10">
              <div className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-none flex items-baseline">
                <span>94</span>
                <span className="text-3xl sm:text-4xl text-[#84cc16] font-extrabold">%</span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-200 font-medium leading-snug mt-2">
                {lang === 'hi'
                  ? 'खेत का समग्र स्वास्थ्य सूचकांक: इष्टतम जड़ नमी, नाइट्रोजन संतुलन एवं निम्न फफूंद जोखिम'
                  : 'Overall Field Health Index: Optimal root hydration, balanced NPK nutrients, and low foliar blight risk'}
              </p>
            </div>

            {/* Center Donut Ring with 3D Golden Wheat Ear Spike */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center flex-shrink-0">
              {/* Circular Donut Gauge SVG */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="78"
                  className="stroke-[#132216]/80"
                  strokeWidth="14"
                  fill="transparent"
                />

                {/* Orange Slice (15% - Evaporation & Transpiration) */}
                <circle
                  cx="100"
                  cy="100"
                  r="78"
                  className="stroke-[#ea580c]"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray="490"
                  strokeDashoffset="370"
                  strokeLinecap="round"
                />

                {/* Main Lime Green Slice (74% - Optimal Photosynthesis) */}
                <circle
                  cx="100"
                  cy="100"
                  r="78"
                  className="stroke-[#84cc16]"
                  strokeWidth="14"
                  fill="transparent"
                  strokeDasharray="490"
                  strokeDashoffset="130"
                  strokeLinecap="round"
                />
              </svg>

              {/* 3D Golden Wheat Ear Spike Piercing Through Center Diagonally */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2">
                <img
                  src={ASSETS.wheatSpike}
                  alt="Golden Wheat Ear Stalk"
                  className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] transform -rotate-12 scale-110"
                />
              </div>
            </div>
          </div>

          {/* Bottom 6 Real Telemetry Metrics with bespoke SensorLogo icons */}
          <div className="grid grid-cols-3 gap-y-3.5 gap-x-2.5 pt-4 border-t border-white/10 text-xs">
            {/* Sensor 1: Water Flow Meter */}
            <button
              onClick={() => onSelectSensor('water_flow_sensor')}
              className="text-left group cursor-pointer p-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] transition-all border border-white/10"
              title="Click for Water Flow Telemetry & Calibration"
            >
              <div className="flex items-center gap-2">
                <SensorLogo type="water_flow_sensor" size="sm" />
                <div>
                  <div className="text-sm sm:text-base font-black text-white group-hover:text-[#84cc16] transition-colors leading-none">
                    {flowRate} L/min
                  </div>
                  <div className="text-[10px] text-stone-300 font-medium truncate mt-0.5">
                    {lang === 'hi' ? 'सिंचाई जल प्रवाह' : 'Water Flow Rate'}
                  </div>
                </div>
              </div>
            </button>

            {/* Sensor 2: Soil Nitrogen N */}
            <button
              onClick={() => onSelectSensor('nitrogen')}
              className="text-left group cursor-pointer p-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] transition-all border border-white/10"
              title="Click for Nitrogen N Telemetry"
            >
              <div className="flex items-center gap-2">
                <SensorLogo type="nitrogen" size="sm" />
                <div>
                  <div className="text-sm sm:text-base font-black text-white group-hover:text-amber-400 transition-colors leading-none">
                    {soilNitrogen} ppm
                  </div>
                  <div className="text-[10px] text-stone-300 font-medium truncate mt-0.5">
                    {lang === 'hi' ? 'मृदा नाइट्रोजन (N)' : 'Soil Nitrogen (N)'}
                  </div>
                </div>
              </div>
            </button>

            {/* Sensor 3: Solar Flux */}
            <button
              onClick={() => onSelectSensor('light_intensity')}
              className="text-left group cursor-pointer p-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] transition-all border border-white/10"
              title="Click for Solar Radiation Telemetry"
            >
              <div className="flex items-center gap-2">
                <SensorLogo type="light_intensity" size="sm" />
                <div>
                  <div className="text-sm sm:text-base font-black text-white group-hover:text-[#84cc16] transition-colors leading-none">
                    {lightLux} lux
                  </div>
                  <div className="text-[10px] text-stone-300 font-medium truncate mt-0.5">
                    {lang === 'hi' ? 'सौर प्रकाश (Lux)' : 'Photosynthetic Lux'}
                  </div>
                </div>
              </div>
            </button>

            {/* Sensor 4: Soil EC Electrical Conductivity */}
            <button
              onClick={() => onSelectSensor('soil_ec')}
              className="text-left group cursor-pointer p-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] transition-all border border-white/10"
              title="Click for Soil EC Telemetry"
            >
              <div className="flex items-center gap-2">
                <SensorLogo type="soil_ec" size="sm" />
                <div>
                  <div className="text-sm sm:text-base font-black text-white group-hover:text-amber-400 transition-colors leading-none">
                    {soilEc} mS
                  </div>
                  <div className="text-[10px] text-stone-300 font-medium truncate mt-0.5">
                    {lang === 'hi' ? 'विद्युत चालकता (EC)' : 'Soil Salinity (EC)'}
                  </div>
                </div>
              </div>
            </button>

            {/* Sensor 5: Root Soil Temp */}
            <button
              onClick={() => onSelectSensor('soil_temp')}
              className="text-left group cursor-pointer p-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] transition-all border border-white/10"
              title="Click for Soil Temperature Telemetry"
            >
              <div className="flex items-center gap-2">
                <SensorLogo type="soil_temp" size="sm" />
                <div>
                  <div className="text-sm sm:text-base font-black text-white group-hover:text-[#84cc16] transition-colors leading-none">
                    {soilTemp}°C
                  </div>
                  <div className="text-[10px] text-stone-300 font-medium truncate mt-0.5">
                    {lang === 'hi' ? 'जड़ मृदा तापमान' : 'Soil Root Temp'}
                  </div>
                </div>
              </div>
            </button>

            {/* Sensor 6: Canopy Air Temp */}
            <button
              onClick={() => onSelectSensor('air_temp')}
              className="text-left group cursor-pointer p-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.12] transition-all border border-white/10"
              title="Click for Canopy Ambient Temperature"
            >
              <div className="flex items-center gap-2">
                <SensorLogo type="crop_canopy_temp" size="sm" />
                <div>
                  <div className="text-sm sm:text-base font-black text-white group-hover:text-[#84cc16] transition-colors leading-none">
                    {airTemp}°C
                  </div>
                  <div className="text-[10px] text-stone-300 font-medium truncate mt-0.5">
                    {lang === 'hi' ? 'कैनोपी तापमान' : 'Canopy Air Temp'}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN (3 cols out of 12): Coverage, Machinery & Rank  */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-5 sm:gap-6">
          {/* Card 1: Smart Mesh Coverage (सक्रिय नोड क्षेत्र) */}
          <div 
            onClick={() => onSelectKpi('crops')}
            className="p-5 sm:p-6 rounded-3xl bg-[#182c1d]/75 hover:bg-[#182c1d]/85 backdrop-blur-2xl border border-white/20 shadow-2xl text-white space-y-2 cursor-pointer transition-all hover:border-[#84cc16]/50"
          >
            <div className="text-xs sm:text-sm font-bold text-white/90 tracking-wide flex items-center justify-between">
              <span>{lang === 'hi' ? 'सक्रिय आईओटी मेश क्षेत्र' : 'IoT Sensor Mesh Area'}</span>
              <Activity className="w-4 h-4 text-[#84cc16]" />
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">3.8</span>
              <span className="text-xs font-bold text-stone-300 uppercase">
                {lang === 'hi' ? 'हेक्टेयर क्षेत्र' : 'HECTARES'}
              </span>
            </div>
            <div className="text-[11px] text-stone-300 font-medium leading-tight">
              {lang === 'hi' 
                ? '18 फील्ड नोड्स • 4 स्मार्ट प्लॉट्स • 865MHz LoRaWAN कनेक्टिविटी' 
                : '18 Precision Telemetry Nodes across 4 Smart Plots'}
            </div>
          </div>

          {/* Card 2: Precision Sprayer Machinery in Field Photo Card */}
          <div 
            onClick={() => onSelectKpi('irrigation')}
            className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl h-44 sm:h-52 relative group cursor-pointer"
          >
            <img
              src={ASSETS.tasks.irrigation}
              alt="Precision Agricultural Machinery Working in Field"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-xs font-bold text-white drop-shadow-md space-y-0.5">
              <div className="flex items-center justify-between">
                <span>{lang === 'hi' ? 'स्वचालित सिंचाई एवं स्प्रिंकलर' : 'Automated Irrigation & Sprayers'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#84cc16] text-[#0a1b0e] font-black">
                  Auto ON
                </span>
              </div>
              <p className="text-[10px] text-stone-300 font-medium">
                {lang === 'hi' ? 'स्मार्ट मोटर ड्राई-रन सुरक्षा सक्रिय' : 'Zero Dry-Run Impeller Protection Active'}
              </p>
            </div>
          </div>

          {/* Card 3: Ranking / Farm Efficiency (दक्षता रैंकिंग) */}
          <div 
            onClick={() => onSelectKpi('risk')}
            className="p-5 sm:p-6 rounded-3xl bg-[#182c1d]/75 hover:bg-[#182c1d]/85 backdrop-blur-2xl border border-white/20 shadow-2xl text-white space-y-2 cursor-pointer transition-all hover:border-[#84cc16]/50"
          >
            <div className="text-xs sm:text-sm font-bold text-white/90 tracking-wide flex items-center justify-between">
              <span>{lang === 'hi' ? 'एज एआई परिशुद्धता दक्षता' : 'Edge AI Autonomy Index'}</span>
              <ShieldCheck className="w-4 h-4 text-[#84cc16]" />
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">Grade A+</span>
            </div>
            <div className="text-[11px] text-stone-300 font-medium leading-tight">
              {lang === 'hi' 
                ? '99.8% गेटवे अपटाइम • शून्य जल अपव्यय • ICAR मानक' 
                : '99.8% Gateway Reliability • Zero Water Waste • ICAR Standards'}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. BOTTOM ACTION & DETAILED SATELLITE SWITCHER STRIP          */}
      {/* ============================================================== */}
      <div className="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#84cc16] animate-pulse" />
          <span className="font-semibold text-white">
            {lang === 'hi' ? 'रीयल-टाइम एज आईओटी टेलीमेट्री सक्रिय' : 'Live Edge IoT Telemetry Active'}
          </span>
          <span className="text-white/40">•</span>
          <span className="font-mono text-stone-300">ESP32-GW-901 (865.2 MHz India Band)</span>
        </div>

        <button
          onClick={onSwitchToDetailedMap}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold text-xs shadow-lg transition-all cursor-pointer hover:scale-102"
        >
          <Layers className="w-3.5 h-3.5 text-[#84cc16]" />
          <span>{lang === 'hi' ? 'विस्तृत उपग्रह खेत मानचित्र एवं 18 सेंसर देखें' : 'View Detailed Satellite Field Map & 18 Sensors'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
