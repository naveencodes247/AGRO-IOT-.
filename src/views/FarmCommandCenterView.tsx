import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Thermometer, 
  Wind, 
  Sun, 
  CloudRain, 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Compass, 
  ChevronDown, 
  Info, 
  ArrowRight,
  Sparkles,
  Layers,
  Sprout,
  CheckCircle2,
  Gauge,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Minus,
  X,
  Check,
  Wrench,
  Download,
  PhoneCall,
  Calendar,
  MapPin,
  ExternalLink,
  Zap,
  Cpu,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { 
  liveFarmSimulation, 
  LiveFarmState, 
  FarmPlotModel 
} from '../services/liveFarmSimulationService';
import { SimulationScenario } from '../types';
import { ASSETS } from '../assets/assetMap';
import { Card, CardHeader } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { SensorLogo } from '../components/common/SensorLogo';
import { HELPLINE_NUMBER, HELPLINE_TEL_HREF } from '../services/supportService';
import { ExecutiveFarmHeroView } from './ExecutiveFarmHeroView';

interface FarmCommandCenterViewProps {
  scenario: SimulationScenario;
  onNavigate: (tab: string) => void;
  lang: 'en' | 'hi';
  isLiveMode: boolean;
}

export const FarmCommandCenterView: React.FC<FarmCommandCenterViewProps> = ({
  onNavigate,
  lang,
  isLiveMode = false,
}) => {
  // Authoritative simulation/backend state
  const [farmState, setFarmState] = useState<LiveFarmState>(() => liveFarmSimulation.getState());
  
  // Edge AI Live vs Demo interactive state
  const [isEdgeLive, setIsEdgeLive] = useState<boolean>(isLiveMode);

  // Executive Reference Mode vs Detailed Satellite Command Center Mode
  // Defaults to 'reference_executive' so the website immediately opens to the user's reference design
  const [dashboardViewMode, setDashboardViewMode] = useState<'reference_executive' | 'detailed_satellite'>('reference_executive');

  // Map state for full space usage
  const [isPlotCardMinimized, setIsPlotCardMinimized] = useState<boolean>(false);
  const [mapLayer, setMapLayer] = useState<'satellite' | 'ndvi' | 'moisture'>('satellite');
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [pulseWaveActive, setPulseWaveActive] = useState<boolean>(false);

  // Countdown timer for automatic update (Next in 00:47)
  const [countdownSeconds, setCountdownSeconds] = useState<number>(47);
  const [isAutoUpdate, setIsAutoUpdate] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [selectedSensorCategory, setSelectedSensorCategory] = useState<'all' | 'soil' | 'environment' | 'water' | 'crop' | 'device'>('all');
  const [selectedPlotId, setSelectedPlotId] = useState<string>('plot-uttar-1');

  // Interactive Click Modals State
  const [selectedSensor, setSelectedSensor] = useState<any | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<'farm-status' | 'plots' | 'crops' | 'water' | 'irrigation' | 'risk' | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any | null>(null);
  const [isPlotModalOpen, setIsPlotModalOpen] = useState<boolean>(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active alerts list that updates when resolved
  const [alertsList, setAlertsList] = useState([
    {
      id: 'alt-1',
      title: 'Soil moisture is below target level',
      plot: 'Plot Alpha (Soybean)',
      time: '2 min ago',
      severity: 'High',
      badgeColor: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
      icon: AlertTriangle,
      iconBg: 'bg-rose-100 dark:bg-rose-950 text-rose-600',
      reason: 'Capacitive depth sensor at 15cm detected 27.8% moisture, which is below the 35% agronomic vegetative threshold.',
      action: 'Trigger 20-minute drip pulse to replenish root zone hydration.',
    },
    {
      id: 'alt-2',
      title: 'Temperature is rising in afternoon',
      plot: 'Plot Beta (Wheat)',
      time: '8 min ago',
      severity: 'Medium',
      badgeColor: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
      icon: Thermometer,
      iconBg: 'bg-amber-100 dark:bg-amber-950 text-amber-600',
      reason: 'Ambient temperature reached 31.6°C with 62% humidity. Evapotranspiration rate elevated.',
      action: 'Maintain shade net coverage and schedule evening irrigation cycle.',
    },
    {
      id: 'alt-3',
      title: 'Water tank level is decreasing',
      plot: 'Central Reservoir',
      time: '12 min ago',
      severity: 'Low',
      badgeColor: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
      icon: Droplets,
      iconBg: 'bg-sky-100 dark:bg-sky-950 text-sky-600',
      reason: 'Tank storage at 72% capacity (7,200 Litres remaining out of 10,000L).',
      action: 'Borewell pump standby ready if reservoir drops below 50%.',
    },
  ]);

  // Active recommendations list that updates when applied
  const [recommendationsList, setRecommendationsList] = useState([
    {
      id: 'rec-1',
      title: 'Consider irrigation soon',
      subtitle: 'Soil moisture is approaching the 35% threshold.',
      priority: 'High',
      badgeColor: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
      icon: Droplets,
      iconBg: 'bg-rose-100 dark:bg-rose-950 text-rose-600',
      details: 'Plot Alpha moisture has decreased by 1.4% in the last 4 hours. Early morning or late evening drip pulse recommended to reduce evaporative loss.',
      actionText: 'Execute 25-Min Drip Pulse',
    },
    {
      id: 'rec-2',
      title: 'Monitor canopy temperature',
      subtitle: 'Solar radiation peak expected at 1:30 PM.',
      priority: 'Medium',
      badgeColor: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
      icon: Thermometer,
      iconBg: 'bg-amber-100 dark:bg-amber-950 text-amber-600',
      details: 'Canopy infrared thermal readings indicate slight transpiration stress. Ensure inter-row mulching retains soil moisture.',
      actionText: 'Acknowledge Advisory',
    },
    {
      id: 'rec-3',
      title: 'Check foliar crop condition',
      subtitle: 'Environmental stress index is moderate.',
      priority: 'Low',
      badgeColor: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
      icon: Sprout,
      iconBg: 'bg-sky-100 dark:bg-sky-950 text-sky-600',
      details: 'Perform a leaf scan using the Crop Analyzer to detect any early cercospora leaf spot or rust symptoms.',
      actionText: 'Open Crop Analyzer',
    },
  ]);

  // Subscribe to live farm state updates
  useEffect(() => {
    const unsubscribe = liveFarmSimulation.subscribe((updatedState) => {
      setFarmState({ ...updatedState });
    });
    return () => unsubscribe();
  }, []);

  // 1-second interval for countdown clock
  useEffect(() => {
    if (!isAutoUpdate) return;
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          triggerSync();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isAutoUpdate]);

  // Toast auto-dismiss after 3.5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const triggerSync = () => {
    setIsSyncing(true);
    liveFarmSimulation.stepTelemetryCycle();
    setTimeout(() => {
      setIsSyncing(false);
      setCountdownSeconds(60);
      showToast('Telemetry refreshed from ESP32 & LoRa Gateway.');
    }, 600);
  };

  const handleToggleIrrigation = (mode: 'OFF' | 'ON' | 'AUTO') => {
    if (mode === 'OFF') {
      liveFarmSimulation.toggleIrrigation({ pumpActive: false, valveOpen: false, mode: 'MANUAL' });
      showToast('Irrigation Pump switched OFF (Manual Standby).');
    } else if (mode === 'ON') {
      liveFarmSimulation.toggleIrrigation({ pumpActive: true, valveOpen: true, mode: 'MANUAL' });
      showToast('Irrigation Pump switched ON (Flow: 32 L/min).');
    } else {
      liveFarmSimulation.toggleIrrigation({ pumpActive: false, valveOpen: false, mode: 'AUTO' });
      showToast('Automated Smart Moisture Threshold Mode activated.');
    }
  };

  const handleResolveAlert = (alertId: string) => {
    setAlertsList(prev => prev.filter(a => a.id !== alertId));
    setSelectedAlert(null);
    showToast('Alert resolved and logged to field history.');
  };

  const handleApplyRecommendation = (rec: any) => {
    if (rec.id === 'rec-1') {
      handleToggleIrrigation('ON');
    } else if (rec.id === 'rec-3') {
      onNavigate('crop-analyzer');
    }
    setRecommendationsList(prev => prev.filter(r => r.id !== rec.id));
    setSelectedRecommendation(null);
    showToast(`Recommendation applied: "${rec.title}"`);
  };

  // Selected plot details for floating card and modal
  const selectedPlot = farmState.plots.find(p => p.id === selectedPlotId) || farmState.plots[0];

  // Current formatted timestamp
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Format countdown string MM:SS
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Comprehensive Sensor Telemetry Database
  const allSensors = [
    {
      id: 'soil_moisture',
      name: 'Soil Moisture',
      category: 'soil',
      value: `${farmState.soil.moisture}%`,
      rawVal: farmState.soil.moisture,
      delta: '-1.4%',
      deltaType: 'down',
      deltaColor: 'text-sky-600',
      icon: Droplets,
      iconBg: 'bg-sky-100 dark:bg-sky-950 text-sky-600',
      sparklineColor: 'bg-sky-400',
      optimalRange: '35% – 50%',
      optimalMin: 35,
      optimalMax: 50,
      description: 'Capacitive frequency domain sensor measuring volumetric water content at 15cm root zone depth.',
      hardwareId: 'ESP32-SOIL-NODE-01',
      plotName: 'Plot A (Soybean)',
    },
    {
      id: 'soil_temp',
      name: 'Soil Temperature',
      category: 'soil',
      value: `${farmState.soil.temperature}°C`,
      rawVal: farmState.soil.temperature,
      delta: '+0.4°C',
      deltaType: 'up',
      deltaColor: 'text-rose-500',
      icon: Thermometer,
      iconBg: 'bg-rose-100 dark:bg-rose-950 text-rose-600',
      sparklineColor: 'bg-rose-400',
      optimalRange: '20°C – 28°C',
      optimalMin: 20,
      optimalMax: 28,
      description: 'DS18B20 digital waterproof probe embedded at 15cm soil depth measuring rhizosphere thermal buffer.',
      hardwareId: 'ESP32-SOIL-NODE-01',
      plotName: 'Plot A (Soybean)',
    },
    {
      id: 'soil_ph',
      name: 'Soil pH',
      category: 'soil',
      value: `${farmState.soil.ph}`,
      rawVal: farmState.soil.ph,
      delta: '→ 0.0',
      deltaType: 'neutral',
      deltaColor: 'text-stone-400',
      icon: Sprout,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
      sparklineColor: 'bg-emerald-400',
      optimalRange: '6.0 – 7.2 pH',
      optimalMin: 6.0,
      optimalMax: 7.2,
      description: 'Glass electrode electrochemical sensor measuring hydrogen ion activity in soil pore water solution.',
      hardwareId: 'ESP32-NPK-NODE-02',
      plotName: 'Plot A (Soybean)',
    },
    {
      id: 'soil_ec',
      name: 'EC (Salinity)',
      category: 'soil',
      value: `${farmState.soil.ec} mS/cm`,
      rawVal: farmState.soil.ec,
      delta: '-0.02',
      deltaType: 'down',
      deltaColor: 'text-emerald-600',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
      sparklineColor: 'bg-emerald-400',
      optimalRange: '0.4 – 1.2 mS/cm',
      optimalMin: 0.4,
      optimalMax: 1.2,
      description: 'Electrical conductivity probe measuring total dissolved mineral salinity in rhizosphere.',
      hardwareId: 'ESP32-NPK-NODE-02',
      plotName: 'Plot A (Soybean)',
    },
    {
      id: 'nitrogen',
      name: 'Nitrogen (N)',
      category: 'soil',
      value: `${farmState.soil.nitrogen} ppm`,
      rawVal: farmState.soil.nitrogen,
      delta: '+1.2',
      deltaType: 'up',
      deltaColor: 'text-emerald-600',
      icon: Sprout,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
      sparklineColor: 'bg-emerald-400',
      optimalRange: '20 – 35 ppm',
      optimalMin: 20,
      optimalMax: 35,
      description: 'Optical multi-spectral optical reflectance estimate of available nitrate (NO3-) nitrogen.',
      hardwareId: 'ESP32-NPK-NODE-02',
      plotName: 'Plot A (Soybean)',
    },
    {
      id: 'phosphorus',
      name: 'Phosphorus (P)',
      category: 'soil',
      value: `${farmState.soil.phosphorus} ppm`,
      rawVal: farmState.soil.phosphorus,
      delta: '→ 0.0',
      deltaType: 'neutral',
      deltaColor: 'text-stone-400',
      icon: Sprout,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
      sparklineColor: 'bg-emerald-400',
      optimalRange: '8 – 15 ppm',
      optimalMin: 8,
      optimalMax: 15,
      description: 'Rhizosphere available phosphate (P2O5) ion sensing for root development support.',
      hardwareId: 'ESP32-NPK-NODE-02',
      plotName: 'Plot A (Soybean)',
    },
    {
      id: 'potassium',
      name: 'Potassium (K)',
      category: 'soil',
      value: `${farmState.soil.potassium} ppm`,
      rawVal: farmState.soil.potassium,
      delta: '+0.8',
      deltaType: 'up',
      deltaColor: 'text-emerald-600',
      icon: Sprout,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
      sparklineColor: 'bg-emerald-400',
      optimalRange: '15 – 25 ppm',
      optimalMin: 15,
      optimalMax: 25,
      description: 'Readily available soil potassium (K+) ion concentration for stomatal regulation and drought tolerance.',
      hardwareId: 'ESP32-NPK-NODE-02',
      plotName: 'Plot A (Soybean)',
    },
    {
      id: 'air_temp',
      name: 'Air Temperature',
      category: 'environment',
      value: `${farmState.environment.temperature}°C`,
      rawVal: farmState.environment.temperature,
      delta: '+0.6°C',
      deltaType: 'up',
      deltaColor: 'text-amber-600',
      icon: Thermometer,
      iconBg: 'bg-amber-100 dark:bg-amber-950 text-amber-600',
      sparklineColor: 'bg-amber-400',
      optimalRange: '22°C – 32°C',
      optimalMin: 22,
      optimalMax: 32,
      description: 'SHT31 high-accuracy canopy ambient temperature sensor mounted in solar radiation shield.',
      hardwareId: 'ESP32-CANOPY-01',
      plotName: 'Plot A (Soybean)',
    },
    {
      id: 'humidity',
      name: 'Humidity',
      category: 'environment',
      value: `${farmState.environment.humidity}%`,
      rawVal: farmState.environment.humidity,
      delta: '-2%',
      deltaType: 'down',
      deltaColor: 'text-sky-600',
      icon: Droplets,
      iconBg: 'bg-sky-100 dark:bg-sky-950 text-sky-600',
      sparklineColor: 'bg-sky-400',
      optimalRange: '50% – 70%',
      optimalMin: 50,
      optimalMax: 70,
      description: 'Capacitive relative humidity sensor monitoring air moisture around upper crop foliage.',
      hardwareId: 'ESP32-CANOPY-01',
      plotName: 'Plot A (Soybean)',
    },
    {
      id: 'light_intensity',
      name: 'Light Intensity',
      category: 'environment',
      value: '680 lux',
      rawVal: 680,
      delta: '+40',
      deltaType: 'up',
      deltaColor: 'text-amber-600',
      icon: Sun,
      iconBg: 'bg-amber-100 dark:bg-amber-950 text-amber-500',
      sparklineColor: 'bg-amber-400',
      optimalRange: '500 – 900 lux',
      optimalMin: 500,
      optimalMax: 900,
      description: 'BH1750 ambient light luxmeter tracking solar radiation and PAR availability for photosynthesis.',
      hardwareId: 'ESP32-METEO-03',
      plotName: 'Farm Master Station',
    },
    {
      id: 'rainfall',
      name: 'Rainfall',
      category: 'environment',
      value: `${farmState.environment.rainfallMm} mm`,
      rawVal: farmState.environment.rainfallMm,
      delta: '→ 0.0',
      deltaType: 'neutral',
      deltaColor: 'text-stone-400',
      icon: CloudRain,
      iconBg: 'bg-blue-100 dark:bg-blue-950 text-blue-600',
      sparklineColor: 'bg-blue-400',
      optimalRange: '0 – 50 mm/day',
      optimalMin: 0,
      optimalMax: 50,
      description: 'Tipping-bucket rain gauge with 0.2mm per tip resolution connected to LoRa gateway interrupt.',
      hardwareId: 'ESP32-METEO-03',
      plotName: 'Farm Master Station',
    },
    {
      id: 'wind_speed',
      name: 'Wind Speed',
      category: 'environment',
      value: '8 km/h',
      rawVal: 8,
      delta: '→ 0.0',
      deltaType: 'neutral',
      deltaColor: 'text-stone-400',
      icon: Wind,
      iconBg: 'bg-sky-100 dark:bg-sky-950 text-sky-600',
      sparklineColor: 'bg-sky-400',
      optimalRange: '2 – 15 km/h',
      optimalMin: 2,
      optimalMax: 15,
      description: 'Three-cup optical anemometer measuring wind gusts and evapotranspiration wind factor.',
      hardwareId: 'ESP32-METEO-03',
      plotName: 'Farm Master Station',
    },
    {
      id: 'water_tank_sensor',
      name: 'Water Tank Level',
      category: 'water',
      value: `${farmState.water.tankLevelPercent}%`,
      rawVal: farmState.water.tankLevelPercent,
      delta: '-3%',
      deltaType: 'down',
      deltaColor: 'text-rose-500',
      icon: Droplets,
      iconBg: 'bg-sky-100 dark:bg-sky-950 text-sky-600',
      sparklineColor: 'bg-sky-400',
      optimalRange: '50% – 100%',
      optimalMin: 50,
      optimalMax: 100,
      description: 'Hydrostatic pressure level transducer installed at bottom of primary 10,000L irrigation reservoir.',
      hardwareId: 'ESP32-PUMP-CTRL-01',
      plotName: 'Central Tank Station',
    },
    {
      id: 'water_flow_sensor',
      name: 'Drip Flow Rate',
      category: 'water',
      value: `${farmState.water.flowRateLpm} L/min`,
      rawVal: farmState.water.flowRateLpm,
      delta: farmState.water.pumpActive ? '+32 L/min' : '→ 0.0',
      deltaType: farmState.water.pumpActive ? 'up' : 'neutral',
      deltaColor: farmState.water.pumpActive ? 'text-emerald-600' : 'text-stone-400',
      icon: Droplets,
      iconBg: 'bg-sky-100 dark:bg-sky-950 text-sky-600',
      sparklineColor: 'bg-sky-400',
      optimalRange: '0 – 60 L/min',
      optimalMin: 0,
      optimalMax: 60,
      description: 'YF-S201 Hall-effect turbine pulse flow sensor inline with primary drip irrigation header.',
      hardwareId: 'ESP32-PUMP-CTRL-01',
      plotName: 'Pump Header Line',
    },
    {
      id: 'crop_canopy_temp',
      name: 'Canopy Temp',
      category: 'crop',
      value: '27.4°C',
      rawVal: 27.4,
      delta: '-0.3°C',
      deltaType: 'down',
      deltaColor: 'text-emerald-600',
      icon: Thermometer,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
      sparklineColor: 'bg-emerald-400',
      optimalRange: '24°C – 30°C',
      optimalMin: 24,
      optimalMax: 30,
      description: 'MLX90614 infrared non-contact thermal sensor measuring soybean canopy surface temperature.',
      hardwareId: 'ESP32-CANOPY-01',
      plotName: 'Plot A (Soybean)',
    },
    {
      id: 'crop_leaf_wetness',
      name: 'Leaf Wetness',
      category: 'crop',
      value: '12%',
      rawVal: 12,
      delta: '-4%',
      deltaType: 'down',
      deltaColor: 'text-sky-600',
      icon: Droplets,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
      sparklineColor: 'bg-emerald-400',
      optimalRange: '< 20% (Dry)',
      optimalMin: 0,
      optimalMax: 20,
      description: 'Dielectric leaf wetness grid mimicking foliage to estimate fungal spore germination window.',
      hardwareId: 'ESP32-CANOPY-01',
      plotName: 'Plot A (Soybean)',
    },
    {
      id: 'gateway_battery',
      name: 'Gateway Battery',
      category: 'device',
      value: '94%',
      rawVal: 94,
      delta: 'Optimal',
      deltaType: 'up',
      deltaColor: 'text-emerald-600',
      icon: Radio,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
      sparklineColor: 'bg-emerald-400',
      optimalRange: '70% – 100%',
      optimalMin: 70,
      optimalMax: 100,
      description: 'LiFePO4 12.8V 20Ah field battery with MPPT solar charge controller.',
      hardwareId: 'ESP32-MASTER-GW-01',
      plotName: 'Farm Master Station',
    },
    {
      id: 'lora_rssi',
      name: 'LoRa RSSI Signal',
      category: 'device',
      value: '-78 dBm',
      rawVal: -78,
      delta: 'Strong',
      deltaType: 'up',
      deltaColor: 'text-emerald-600',
      icon: Radio,
      iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
      sparklineColor: 'bg-emerald-400',
      optimalRange: '> -95 dBm',
      optimalMin: -110,
      optimalMax: -50,
      description: 'SX1276 LoRa transceiver 865 MHz telemetry link with 99.8% packet reception rate.',
      hardwareId: 'ESP32-MASTER-GW-01',
      plotName: 'Farm Master Station',
    },
  ];

  // Dynamically filter sensors based on active category
  const visibleSensors = allSensors.filter(s => {
    if (selectedSensorCategory === 'all') return true;
    return s.category === selectedSensorCategory;
  });

  return (
    <div className="space-y-4 sm:space-y-5 select-none font-sans pb-10">
      {dashboardViewMode === 'reference_executive' ? (
        /* Executive Reference View matching the user's reference design */
        <ExecutiveFarmHeroView
          farmState={farmState}
          lang={lang}
          isEdgeLive={isEdgeLive}
          onToggleEdgeLive={() => {
            const nextState = !isEdgeLive;
            setIsEdgeLive(nextState);
            showToast(nextState 
              ? '⚡ EDGE AI: Live Mode Activated. Running edge neural inference on ESP32 field gateway.' 
              : '🧪 EDGE AI: Demo Simulation Active. Simulating microclimate sensor telemetry.'
            );
          }}
          onSwitchToDetailedMap={() => setDashboardViewMode('detailed_satellite')}
          onSelectSensor={(sensorId) => {
            const s = allSensors.find(item => item.id === sensorId) || allSensors[0];
            setSelectedSensor(s);
          }}
          onSelectKpi={(kpiId) => setSelectedKpi(kpiId)}
        />
      ) : (
        /* Detailed Interactive Satellite Map & 18-Sensor Matrix */
        <>
          {/* ============================================================== */}
          {/* 1. TOP TITLE BAR & CONTROLS                                    */}
          {/* ============================================================== */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 sm:gap-4">
            {/* Title & Subtitle + Button to Return to Executive View */}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100">
                  {lang === 'hi' ? 'कमांड सेंटर' : 'Command Center'}
                </h1>
                <button
                  onClick={() => setDashboardViewMode('reference_executive')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#84cc16] hover:bg-[#99e620] text-[#0a1b0e] text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5 hover:scale-102"
                  title="Switch to Executive Overview matching reference design"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'कार्यकारी दृश्य (Executive)' : 'Executive View'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5 font-medium">
                {lang === 'hi'
                  ? 'आपके खेत के स्वास्थ्य, पर्यावरण और संचालन का रीयल-टाइम दृश्य'
                  : "Real-time view of your farm's health, environment and operations"}
              </p>
            </div>

        {/* Right Status Badges & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* 1. EDGE AI: LIVE / DEMO Interactive Clickable Toggle Button */}
          <button
            onClick={() => {
              const nextState = !isEdgeLive;
              setIsEdgeLive(nextState);
              showToast(nextState 
                ? '⚡ EDGE AI: Live Mode Activated. Running edge neural inference on ESP32 field gateway.' 
                : '🧪 EDGE AI: Demo Simulation Active. Simulating microclimate sensor telemetry.'
              );
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 group ${
              isEdgeLive
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25'
            }`}
            title="Click to toggle between Edge AI Live and Demo Simulation Mode"
          >
            {isEdgeLive ? (
              <div className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
            ) : (
              <span className="text-sm">🧪</span>
            )}
            <div className="flex flex-col text-left leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {isEdgeLive ? '⚡ EDGE AI: LIVE' : 'EDGE AI: DEMO'}
                </span>
                <span className={`text-[8px] px-1 py-0.2 rounded font-mono font-bold ${
                  isEdgeLive ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {isEdgeLive ? 'TFLite' : 'Physics'}
                </span>
              </div>
              <span className="text-[9px] opacity-80">
                {isEdgeLive ? 'Click for Demo' : 'Click for Live'}
              </span>
            </div>
          </button>

          {/* Current Date & Time Pill */}
          <div className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#141b16] text-xs font-semibold text-stone-600 dark:text-stone-300 shadow-2xs flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="text-stone-700 dark:text-stone-200 font-bold">{dateStr}</span>
            <span className="hidden sm:inline text-stone-300 dark:text-stone-700">•</span>
            <span className="text-stone-500 dark:text-stone-400">{timeStr}</span>
          </div>

          {/* 2. Smart Telemetry Pulse Radar Pill (Interesting Auto Sync) */}
          <button
            onClick={() => {
              setIsAutoUpdate(!isAutoUpdate);
              showToast(isAutoUpdate ? 'Telemetry radar pulse paused' : 'Telemetry radar pulse active (Autonomous Heartbeat)');
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#141b16] text-xs font-semibold text-stone-700 dark:text-stone-200 shadow-2xs hover:bg-stone-50 dark:hover:bg-stone-850 cursor-pointer transition-all active:scale-98 group"
            title="Smart Telemetry Heartbeat - Click to pause/resume"
          >
            {/* Animated Sonar Radar Ping Wave */}
            <div className="relative flex h-3 w-3 items-center justify-center flex-shrink-0">
              {isAutoUpdate && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoUpdate ? 'bg-emerald-500' : 'bg-stone-400'}`}></span>
            </div>
            
            <div className="flex flex-col text-left leading-none">
              <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
                Pulse Radar
              </span>
              <span className="text-[9px] text-stone-400 dark:text-stone-500 font-mono mt-0.5">
                {isAutoUpdate ? `Next ping in ${formatSeconds(countdownSeconds)}` : 'Pulse Paused'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-0.5 group-hover:text-stone-600" />
          </button>

          {/* 3. Query Mesh Telemetry Button (Manual Sync Upgraded) */}
          <button
            onClick={triggerSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0fa958] to-[#13b963] hover:from-[#13b963] hover:to-[#0fa958] active:scale-95 text-white text-xs font-black shadow-md cursor-pointer transition-all disabled:opacity-75 relative overflow-hidden"
            title="Send immediate broadcast pulse across all LoRa sensor nodes"
          >
            <Radio className={`w-3.5 h-3.5 ${isSyncing ? 'animate-pulse text-amber-200' : ''}`} />
            <span>{isSyncing ? 'Pinging Mesh...' : 'Query Telemetry'}</span>
            {isSyncing && (
              <span className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. 6-CARD KPI ROW (Clickable Agricultural Diagnostic Drilldowns)*/}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
        {/* KPI 1: Farm Status */}
        <button
          onClick={() => setSelectedKpi('farm-status')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#141b16] border border-stone-200/90 dark:border-stone-800 shadow-2xs hover:shadow-md hover:border-emerald-500/60 hover:-translate-y-1 transition-all cursor-pointer text-left w-full group active:scale-98"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                Farm Status
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-[#0fa958] mt-1">
                Healthy
              </h3>
              <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <span>↑ +5% vs last week</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#0fa958] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
        </button>

        {/* KPI 2: Total Plots */}
        <button
          onClick={() => setSelectedKpi('plots')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#141b16] border border-stone-200/90 dark:border-stone-800 shadow-2xs hover:shadow-md hover:border-emerald-500/60 hover:-translate-y-1 transition-all cursor-pointer text-left w-full group active:scale-98"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                Total Plots
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
                12
              </h3>
              <p className="text-[10px] font-medium text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1">
                <span>📐 2.3 ha</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#0fa958] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </button>

        {/* KPI 3: Active Crops */}
        <button
          onClick={() => setSelectedKpi('crops')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#141b16] border border-stone-200/90 dark:border-stone-800 shadow-2xs hover:shadow-md hover:border-emerald-500/60 hover:-translate-y-1 transition-all cursor-pointer text-left w-full group active:scale-98"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                Active Crops
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
                6
              </h3>
              <p className="text-[9px] font-medium text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1">
                <span className="text-emerald-600 font-bold">● Healthy</span>
                <span className="text-amber-500 font-bold">● Attn</span>
                <span className="text-rose-500 font-bold">● Crit</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#0fa958] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
        </button>

        {/* KPI 4: Water Tank (Integer percentage strictly inside box, no overflow) */}
        <button
          onClick={() => setSelectedKpi('water')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#141b16] border border-stone-200/90 dark:border-stone-800 shadow-2xs hover:shadow-md hover:border-sky-500/60 hover:-translate-y-1 transition-all cursor-pointer text-left w-full group active:scale-98 overflow-hidden min-w-0"
        >
          <div className="flex items-start justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider group-hover:text-sky-600 transition-colors truncate">
                Water Tank
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1 truncate">
                {Math.round(farmState.water.tankLevelPercent)}%
              </h3>
              <p className="text-[10px] font-semibold text-rose-500 mt-0.5 flex items-center gap-1 truncate">
                <span>↓ -3% (Today)</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
        </button>

        {/* KPI 5: Irrigation */}
        <button
          onClick={() => setSelectedKpi('irrigation')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#141b16] border border-stone-200/90 dark:border-stone-800 shadow-2xs hover:shadow-md hover:border-emerald-500/60 hover:-translate-y-1 transition-all cursor-pointer text-left w-full group active:scale-98"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                Irrigation
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
                {farmState.water.pumpActive ? 'ON' : 'OFF'}
              </h3>
              <p className="text-[10px] font-medium text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1">
                <span>⚡ {farmState.water.mode} Mode</span>
              </p>
            </div>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${
              farmState.water.pumpActive ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'bg-sky-50 dark:bg-sky-950/60 text-sky-600'
            }`}>
              <Droplets className="w-5 h-5" />
            </div>
          </div>
        </button>

        {/* KPI 6: Environmental Risk */}
        <button
          onClick={() => setSelectedKpi('risk')}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#141b16] border border-stone-200/90 dark:border-stone-800 shadow-2xs hover:shadow-md hover:border-emerald-500/60 hover:-translate-y-1 transition-all cursor-pointer text-left w-full group active:scale-98"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                Environmental Risk
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
                {farmState.environment.environmentalRisk}
              </h3>
              <p className="text-[10px] font-medium text-stone-500 dark:text-stone-400 mt-0.5">
                All conditions normal
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#0fa958] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 3. ROW 2: LIVE SENSOR TELEMETRY (LEFT) + FARM MAP (RIGHT)      */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (7 cols on desktop): Live Sensor Telemetry */}
        <Card className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            {/* Header with Title + Last updated + View Details Link */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#0fa958] flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Live Sensor Telemetry
                  </h3>
                  <p className="text-[10px] text-stone-400 dark:text-stone-500">
                    Last updated: 8 seconds ago • Click any card for calibration & history
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('live-monitoring')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Full Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filter Category Pills (Fully Functional Filtering) */}
            <div className="flex flex-wrap items-center gap-1.5 my-3">
              {[
                { id: 'all', label: 'All Sensors', count: 12 },
                { id: 'soil', label: 'Soil', count: 7 },
                { id: 'environment', label: 'Environment', count: 5 },
                { id: 'water', label: 'Water', count: 2 },
                { id: 'crop', label: 'Crop', count: 2 },
                { id: 'device', label: 'Device', count: 2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedSensorCategory(tab.id as any);
                    showToast(`Filtered: showing ${tab.label} telemetry`);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedSensorCategory === tab.id
                      ? 'bg-[#0c2a1a] text-white shadow-xs font-black'
                      : 'bg-stone-100 dark:bg-stone-850 text-stone-600 dark:text-stone-300 hover:bg-stone-200/80 border border-stone-200/60 dark:border-stone-700/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedSensorCategory === tab.id ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Compact Sensor Tiles Grid (Filtered and 100% Clickable with Individual Sensor Logos) */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 transition-all ${pulseWaveActive ? 'ring-2 ring-emerald-500/50 rounded-2xl p-1 animate-pulse' : ''}`}>
              {visibleSensors.map((sensor) => {
                return (
                  <button
                    key={sensor.id}
                    onClick={() => setSelectedSensor(sensor)}
                    className="p-2.5 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-[#141b16] shadow-2xs space-y-1 hover:border-emerald-500/60 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer text-left w-full group active:scale-98"
                  >
                    <div className="flex items-center justify-between">
                      {/* Custom Distinctive Logo for Every Sensor */}
                      <div className="flex-shrink-0 transition-transform group-hover:scale-110">
                        <SensorLogo type={sensor.id} size="sm" />
                      </div>
                      <span className={`text-[10px] font-bold ${sensor.deltaColor} flex items-center gap-0.5`}>
                        {sensor.deltaType === 'up' && <TrendingUp className="w-3 h-3" />}
                        {sensor.deltaType === 'down' && <TrendingDown className="w-3 h-3" />}
                        {sensor.deltaType === 'neutral' && <Minus className="w-3 h-3" />}
                        {sensor.delta}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500 font-medium group-hover:text-emerald-600 transition-colors truncate">
                      {sensor.name}
                    </div>
                    <div className="text-base font-black text-stone-900 dark:text-stone-100">
                      {sensor.value}
                    </div>
                    {/* Micro sparkline */}
                    <div className="h-2 w-full flex items-end gap-0.5 pt-1 opacity-70">
                      <span className={`h-1 w-full ${sensor.sparklineColor} rounded-xs`} />
                      <span className={`h-1.5 w-full ${sensor.sparklineColor} rounded-xs`} />
                      <span className={`h-2 w-full ${sensor.sparklineColor} rounded-xs`} />
                      <span className={`h-1.5 w-full ${sensor.sparklineColor} rounded-xs`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Right Column: Farm Map & Plots (Fully Utilized Canvas Space) */}
        <Card className={`${isMapExpanded ? 'lg:col-span-12' : 'lg:col-span-5'} p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all duration-300`}>
          <div>
            {/* Header with Title + Interactive Layer Switcher + Fullscreen Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#0fa958] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Farm Precision Map
                  </h3>
                  <span className="text-[10px] text-stone-400">
                    {farmState.plots.length} Active Plots • 2.3 ha
                  </span>
                </div>
              </div>

              {/* Map Layer Switcher Pills & Expand Toggle */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700 text-[10px] font-bold">
                  {(['satellite', 'ndvi', 'moisture'] as const).map((layer) => (
                    <button
                      key={layer}
                      onClick={() => setMapLayer(layer)}
                      className={`px-2 py-0.5 rounded capitalize transition-all cursor-pointer ${
                        mapLayer === layer
                          ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-2xs font-extrabold'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                      }`}
                    >
                      {layer === 'satellite' ? 'Aerial' : layer === 'ndvi' ? 'NDVI' : 'Moisture'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsMapExpanded(!isMapExpanded)}
                  className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  title={isMapExpanded ? 'Collapse Map Width' : 'Expand Map to Full Width'}
                >
                  {isMapExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Satellite Map Area - Height Maximized to Fully Utilize Available Space */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 h-[420px] sm:h-[460px] xl:h-[480px] w-full bg-stone-950">
              {/* High-res Satellite Background with Dynamic Layer Filter */}
              <div 
                className="w-full h-full transition-transform duration-300 ease-out origin-center"
                style={{ transform: `scale(${mapZoom})` }}
              >
                <img
                  src={ASSETS.satelliteMap}
                  alt="Farm Satellite Aerial Map"
                  className={`w-full h-full object-cover transition-all ${
                    mapLayer === 'ndvi' 
                      ? 'contrast-125 saturate-150 hue-rotate-15' 
                      : mapLayer === 'moisture'
                      ? 'contrast-115 hue-rotate-180 brightness-95'
                      : ''
                  }`}
                />
                {/* Layer Overlay Tint */}
                {mapLayer === 'ndvi' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-amber-500/20 mix-blend-overlay pointer-events-none" />
                )}
                {mapLayer === 'moisture' && (
                  <div className="absolute inset-0 bg-blue-500/20 mix-blend-color pointer-events-none" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />

              {/* Overlaid SVG Polygons for Plots A, B, C, D (Clickable boundaries) */}
              <svg 
                className="absolute inset-0 w-full h-full transition-transform duration-300 origin-center" 
                viewBox="0 0 400 300" 
                preserveAspectRatio="none"
                style={{ transform: `scale(${mapZoom})` }}
              >
                {/* Plot A (Top Left) */}
                <polygon
                  points="25,30 155,25 150,135 20,140"
                  fill={selectedPlotId === 'plot-uttar-1' ? "rgba(34, 197, 94, 0.45)" : "rgba(34, 197, 94, 0.25)"}
                  stroke="#22c55e"
                  strokeWidth={selectedPlotId === 'plot-uttar-1' ? "3.5" : "2"}
                  strokeDasharray="4 2"
                  className="cursor-pointer transition-all hover:fill-emerald-500/50"
                  onClick={() => setSelectedPlotId('plot-uttar-1')}
                />
                {/* Plot B (Top Center) */}
                <polygon
                  points="165,25 260,30 255,135 160,135"
                  fill={selectedPlotId === 'plot-poorv-2' ? "rgba(245, 158, 11, 0.45)" : "rgba(245, 158, 11, 0.25)"}
                  stroke="#f59e0b"
                  strokeWidth={selectedPlotId === 'plot-poorv-2' ? "3.5" : "2"}
                  className="cursor-pointer transition-all hover:fill-amber-500/50"
                  onClick={() => setSelectedPlotId('plot-poorv-2')}
                />
                {/* Plot C (Bottom Left) */}
                <polygon
                  points="20,150 150,145 145,265 15,270"
                  fill={selectedPlotId === 'plot-dakshin-3' ? "rgba(34, 197, 94, 0.45)" : "rgba(34, 197, 94, 0.25)"}
                  stroke="#22c55e"
                  strokeWidth={selectedPlotId === 'plot-dakshin-3' ? "3.5" : "2"}
                  className="cursor-pointer transition-all hover:fill-emerald-500/50"
                  onClick={() => setSelectedPlotId('plot-dakshin-3')}
                />
                {/* Plot D (Bottom Center) */}
                <polygon
                  points="160,145 255,145 250,270 155,265"
                  fill={selectedPlotId === 'plot-nehar-4' ? "rgba(239, 68, 68, 0.45)" : "rgba(239, 68, 68, 0.25)"}
                  stroke="#ef4444"
                  strokeWidth={selectedPlotId === 'plot-nehar-4' ? "3.5" : "2"}
                  className="cursor-pointer transition-all hover:fill-rose-500/50"
                  onClick={() => setSelectedPlotId('plot-nehar-4')}
                />

                {/* LoRa Gateway Central Station */}
                <circle cx="280" cy="140" r="7" fill="#6366f1" stroke="white" strokeWidth="2" />
                <text x="290" y="143" fill="white" fontSize="9" fontWeight="bold">LoRa GW</text>
              </svg>

              {/* Zoom and Map View Controls */}
              <div className="absolute left-3 top-3 flex flex-col gap-1 z-20">
                <button
                  onClick={() => setMapZoom(prev => Math.min(1.5, prev + 0.15))}
                  className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/90 cursor-pointer shadow-md"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMapZoom(prev => Math.max(1, prev - 0.15))}
                  className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/90 cursor-pointer shadow-md"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMapZoom(1)}
                  className="w-8 h-8 rounded-lg bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/90 cursor-pointer shadow-md"
                  title="Reset View"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Interactive Plot Pins on Map */}
              {[
                { id: 'plot-uttar-1', label: 'Plot A (Soybean)', status: 'Healthy', x: '21%', y: '28%', bg: 'bg-[#0fa958]', ring: 'ring-[#0fa958]' },
                { id: 'plot-poorv-2', label: 'Plot B (Wheat)', status: 'Attention', x: '52%', y: '28%', bg: 'bg-amber-500', ring: 'ring-amber-500' },
                { id: 'plot-dakshin-3', label: 'Plot C (Mustard)', status: 'Healthy', x: '21%', y: '68%', bg: 'bg-[#0fa958]', ring: 'ring-[#0fa958]' },
                { id: 'plot-nehar-4', label: 'Plot D (Tomato)', status: 'Critical', x: '52%', y: '68%', bg: 'bg-rose-600', ring: 'ring-rose-600' },
              ].map((pin) => (
                <button
                  key={pin.id}
                  onClick={() => {
                    setSelectedPlotId(pin.id);
                    showToast(`Selected ${pin.label} (${pin.status})`);
                  }}
                  style={{ left: pin.x, top: pin.y }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-lg cursor-pointer transition-all hover:scale-110 z-10 ${pin.bg} text-white ${
                    selectedPlotId === pin.id ? `ring-2 ring-white scale-105 shadow-xl` : 'opacity-95'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>{pin.label.split(' ')[0]} {pin.label.split(' ')[1]}</span>
                  <span className="text-[9px] opacity-90 font-medium">({pin.status})</span>
                </button>
              ))}

              {/* Floating Plot Detail Card on Right Side (Minimizable to Free 100% Map Space) */}
              {isPlotCardMinimized ? (
                <div className="absolute right-3 top-3 bg-[#0c1f15]/95 backdrop-blur-md border border-emerald-500/40 rounded-xl px-3 py-1.5 text-white flex items-center gap-2.5 shadow-2xl z-20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-xs">{selectedPlot.name.split('(')[0]}</span>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold">{selectedPlot.soilMoisture}%</span>
                  <button
                    onClick={() => setIsPlotCardMinimized(false)}
                    className="ml-1 px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    + View Details
                  </button>
                </div>
              ) : (
                <div className="absolute right-2 sm:right-3 top-2 sm:top-3 bottom-2 sm:bottom-3 w-48 sm:w-56 bg-[#0c1f15]/95 backdrop-blur-md border border-emerald-500/40 rounded-xl p-3.5 text-white flex flex-col justify-between shadow-2xl z-20 animate-in fade-in duration-150">
                  <div>
                    <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2 mb-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-black text-sm text-white tracking-wide truncate">
                          {selectedPlot.name.includes('Plot A') ? 'Plot A' : selectedPlot.name.includes('Plot B') ? 'Plot B' : selectedPlot.name.includes('Plot C') ? 'Plot C' : 'Plot D'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          selectedPlot.status === 'Healthy'
                            ? 'bg-[#0fa958] text-white'
                            : selectedPlot.status === 'Attention'
                            ? 'bg-amber-500 text-stone-900'
                            : 'bg-rose-600 text-white'
                        }`}>
                          {selectedPlot.status}
                        </span>
                      </div>

                      {/* Minimize Button */}
                      <button
                        onClick={() => setIsPlotCardMinimized(true)}
                        className="p-1 rounded text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer"
                        title="Minimize panel to see full map"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-stone-300">
                        <span>Crop</span>
                        <strong className="text-white">{selectedPlot.crop.split('(')[0].trim()}</strong>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>Stage</span>
                        <span className="text-white">Vegetative</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>Area</span>
                        <span className="text-white">{selectedPlot.areaHa} ha</span>
                      </div>
                      <div className="flex justify-between text-stone-300 pt-1 border-t border-white/10">
                        <span>Soil Moisture</span>
                        <strong className="text-emerald-400">{selectedPlot.soilMoisture}%</strong>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>Temperature</span>
                        <span className="text-white">{selectedPlot.temperature}°C</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>Crop Health</span>
                        <span className="text-emerald-300 font-semibold">{selectedPlot.cropHealth}%</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span>Irrigation</span>
                        <span className="text-stone-300 font-mono">{farmState.water.pumpActive ? 'ON' : 'OFF'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-white/10">
                    <button
                      onClick={() => setIsPlotModalOpen(true)}
                      className="w-full py-1.5 rounded-lg bg-[#0fa958] hover:bg-[#13b963] text-white text-[11px] font-bold text-center cursor-pointer shadow-xs transition-colors"
                    >
                      Inspect Plot Telemetry
                    </button>
                    <button
                      onClick={() => onNavigate('farm-info')}
                      className="w-full text-center text-[10px] text-stone-400 hover:text-white cursor-pointer py-0.5"
                    >
                      Edit Boundaries →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Map Legend */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-3 border-t border-stone-100 dark:border-stone-800 mt-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Attention
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-[10px]">
                <span>⛯ Sensor</span>
                <span>🚿 Irrigation</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ============================================================== */}
      {/* 4. ROW 3: WEATHER & ENV + IRRIGATION CONTROL + CROP HEALTH     */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Weather & Environment (Clickable to open 7-day forecast) */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-500/50 transition-all cursor-pointer group" onClick={() => setIsWeatherModalOpen(true)}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#0fa958] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sun className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 transition-colors">
                  Weather & Environment
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>View 7-Day</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* Weather Metric Display */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  ⛅
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                    30.4°C
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    Partly Cloudy • Click for hourly
                  </div>
                </div>
              </div>
            </div>

            {/* 2-column metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span className="text-stone-400">💧 Humidity</span>
                <strong>64%</strong>
              </div>
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span className="text-stone-400">⚡ Pressure</span>
                <strong>1012 hPa</strong>
              </div>
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span className="text-stone-400">💨 Wind</span>
                <strong>8 km/h</strong>
              </div>
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span className="text-stone-400">☀️ Light</span>
                <strong>680 lux</strong>
              </div>
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span className="text-stone-400">🌧️ Rainfall</span>
                <strong>0 mm</strong>
              </div>
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span className="text-stone-400">🛡️ Env Risk</span>
                <strong className="text-emerald-600">Low</strong>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Irrigation Control (Interactive Simulation Controls) */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Irrigation Control <span className="text-[11px] font-normal text-stone-400">(Live Switch)</span>
                </h3>
              </div>
              <button
                onClick={() => onNavigate('smart-irrigation')}
                className="text-stone-400 hover:text-emerald-600 cursor-pointer"
                title="Open Smart Irrigation View"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Toggle: OFF / ON / AUTO */}
            <div className="flex items-center justify-center p-1 bg-stone-100 dark:bg-stone-850 rounded-xl my-3">
              <button
                onClick={() => handleToggleIrrigation('OFF')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 ${
                  !farmState.water.pumpActive && farmState.water.mode !== 'AUTO'
                    ? 'bg-white dark:bg-stone-750 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>OFF</span>
              </button>
              <button
                onClick={() => handleToggleIrrigation('ON')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  farmState.water.pumpActive
                    ? 'bg-[#0fa958] text-white shadow-xs font-black'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                ON
              </button>
              <button
                onClick={() => handleToggleIrrigation('AUTO')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  farmState.water.mode === 'AUTO'
                    ? 'bg-[#86efac] text-emerald-950 shadow-xs font-black'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                AUTO
              </button>
            </div>

            {/* Metrics: Tank Level, Flow, Today's Usage */}
            <div className="grid grid-cols-3 gap-2 text-center py-2 border-t border-stone-100 dark:border-stone-800">
              <div 
                onClick={() => setSelectedKpi('water')}
                className="flex items-center gap-2 text-left cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-850/50 p-1 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 font-medium leading-none">Water Tank</div>
                  <div className="text-sm font-black text-stone-900 dark:text-stone-100 mt-0.5">
                    {farmState.water.tankLevelPercent}%
                  </div>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-stone-400 font-medium">Flow Rate</div>
                <div className="text-sm font-black text-stone-900 dark:text-stone-100">
                  {farmState.water.flowRateLpm} <span className="text-[10px] font-normal text-stone-400">L/min</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-stone-400 font-medium">Today's Usage</div>
                <div className="text-sm font-black text-stone-900 dark:text-stone-100">
                  {farmState.water.dailyUsageLitres.toLocaleString()} <span className="text-[10px] font-normal text-stone-400">L</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => onNavigate('smart-irrigation')}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Open Irrigation Management →
              </button>
            </div>
          </div>
        </Card>

        {/* Card 3: Crop Health (Clickable) */}
        <Card 
          className="p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-500/50 transition-all cursor-pointer group"
          onClick={() => onNavigate('crop-analyzer')}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#0fa958] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sprout className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 transition-colors">
                  Crop Health
                </h3>
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>Scan Leaf</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>

            {/* Circular Progress Ring + Crop Information + Scanner Badge */}
            <div className="flex items-center justify-between gap-3 py-3">
              {/* Radial Progress Ring */}
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-stone-100 dark:text-stone-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#0fa958]"
                    strokeDasharray="78, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black text-stone-900 dark:text-stone-100 leading-none">78%</span>
                  <span className="text-[8px] font-bold text-[#0fa958] uppercase">Good</span>
                </div>
              </div>

              {/* Crop Stats List */}
              <div className="flex-1 space-y-1 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-400">Crop:</span>
                  <strong className="text-stone-900 dark:text-stone-100">Soybean</strong>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-400">Stage:</span>
                  <span>Vegetative</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-400">Water Stress:</span>
                  <span className="text-emerald-600 font-semibold">Low</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-400">Env Stress:</span>
                  <span className="text-amber-600 font-semibold">Moderate</span>
                </div>
                <div className="flex justify-between text-stone-400 text-[10px] pt-1 border-t border-stone-100 dark:border-stone-800">
                  <span>Last Scan:</span>
                  <span>2 hours ago</span>
                </div>
              </div>

              {/* Scanner badge icon on far right */}
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ============================================================== */}
      {/* 5. ROW 4: RECENT ACTIVITY + ACTIVE ALERTS + RECOMMENDATIONS    */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Recent Activity (Clickable Items) */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#0fa958] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Recent Activity
                </h3>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Activity Timeline List (Clickable to inspect event details) */}
            <div className="space-y-2 text-xs py-1">
              {[
                { time: '10:24:12', msg: 'Soil moisture updated to 42.8%', icon: Droplets, color: 'text-emerald-600 bg-emerald-100' },
                { time: '10:23:48', msg: 'Temperature increased to 30.4°C', icon: Thermometer, color: 'text-amber-600 bg-amber-100' },
                { time: '10:23:20', msg: 'Pump status checked (OFF)', icon: Droplets, color: 'text-blue-600 bg-blue-100' },
                { time: '10:22:55', msg: 'Environmental risk recalculated (Low)', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-100' },
              ].map((act, idx) => {
                const Icon = act.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => showToast(`Telemetry event at ${act.time}: ${act.msg}`)}
                    className="w-full flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-850/60 transition-colors text-left cursor-pointer active:scale-98"
                  >
                    <div className={`w-5 h-5 rounded-full ${act.color} dark:bg-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[10px] text-stone-400 block">{act.time}</span>
                      <p className="text-stone-700 dark:text-stone-200 text-xs font-medium truncate">
                        {act.msg}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Card 2: Active Alerts [3] (Clickable Items with Resolution Modal) */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Active Alerts
                  </h3>
                  <span className="w-4 h-4 rounded-full bg-[#ef4444] text-white text-[9px] font-black flex items-center justify-center">
                    {alertsList.length}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alerts List */}
            <div className="space-y-2 text-xs py-1">
              {alertsList.length === 0 ? (
                <div className="p-4 text-center text-stone-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">All alerts resolved!</p>
                  <p className="text-[10px]">No active agronomic warnings on any plot.</p>
                </div>
              ) : (
                alertsList.map((alert) => {
                  const Icon = alert.icon;
                  return (
                    <button
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141b16] border border-stone-200/80 dark:border-stone-800 shadow-2xs hover:border-rose-500/50 hover:shadow-xs transition-all flex items-start justify-between gap-2 text-left cursor-pointer active:scale-98"
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <div className={`w-5 h-5 rounded-full ${alert.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-stone-800 dark:text-stone-100 truncate text-xs">
                            {alert.title}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            {alert.plot} • {alert.time}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${alert.badgeColor}`}>
                        {alert.severity}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </Card>

        {/* Card 3: Smart Recommendations (Clickable with Execution Modal) */}
        <Card className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#0fa958] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Smart Recommendations
                </h3>
              </div>
              <button
                onClick={() => onNavigate('recommendations')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recommendations List */}
            <div className="space-y-2 text-xs py-1">
              {recommendationsList.length === 0 ? (
                <div className="p-4 text-center text-stone-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">All actions executed!</p>
                  <p className="text-[10px]">Farm running under optimal precision parameters.</p>
                </div>
              ) : (
                recommendationsList.map((rec) => {
                  const Icon = rec.icon;
                  return (
                    <button
                      key={rec.id}
                      onClick={() => setSelectedRecommendation(rec)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141b16] border border-stone-200/80 dark:border-stone-800 shadow-2xs hover:border-emerald-500/50 hover:shadow-xs transition-all flex items-start justify-between gap-2 text-left cursor-pointer active:scale-98"
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <div className={`w-5 h-5 rounded-full ${rec.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-stone-800 dark:text-stone-100 truncate text-xs">
                            {rec.title}
                          </p>
                          <p className="text-[10px] text-stone-400 truncate">
                            {rec.subtitle}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${rec.badgeColor}`}>
                        {rec.priority}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </Card>
      </div>
      </>
      )}

      {/* ============================================================== */}
      {/* 6. MODALS SYSTEM FOR HIGH-FIDELITY CLICK INTERACTIONS           */}
      {/* ============================================================== */}

      {/* MODAL 1: SENSOR TELEMETRY & CALIBRATION */}
      <Modal
        isOpen={!!selectedSensor}
        onClose={() => setSelectedSensor(null)}
        title={selectedSensor ? `${selectedSensor.name} Telemetry & Calibration` : ''}
        subtitle={selectedSensor ? `Hardware Node: ${selectedSensor.hardwareId} • ${selectedSensor.plotName}` : ''}
      >
        {selectedSensor && (
          <div className="space-y-4 text-xs">
            {/* Top Reading Banner */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700">
              <div className="flex items-center gap-3.5">
                <SensorLogo type={selectedSensor.id} size="lg" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400">Current Reading</span>
                  <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-0.5">
                    {selectedSensor.value}
                  </div>
                  <div className={`text-xs font-bold mt-1 ${selectedSensor.deltaColor}`}>
                    {selectedSensor.delta} trend over past 4 hours
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400">Agronomic Optimal</span>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {selectedSensor.optimalRange}
                </div>
                <span className="text-[10px] text-stone-500">ICAR-standard range</span>
              </div>
            </div>

            {/* Description & Agronomic Context */}
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-xs">
              {selectedSensor.description}
            </p>

            {/* Mock 24-hr historical SVG chart */}
            <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#141b16] space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-stone-600 dark:text-stone-300">
                <span>24-Hour Telemetry Trend</span>
                <span className="text-emerald-600 font-normal">Sampled every 5 min</span>
              </div>
              <svg className="w-full h-24 overflow-visible" viewBox="0 0 300 80">
                <defs>
                  <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0fa958" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0fa958" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,55 Q 50,45 100,50 T 200,35 T 300,42 L 300,80 L 0,80 Z"
                  fill="url(#sensorGrad)"
                />
                <path
                  d="M 0,55 Q 50,45 100,50 T 200,35 T 300,42"
                  fill="none"
                  stroke="#0fa958"
                  strokeWidth="2.5"
                />
                <circle cx="300" cy="42" r="4" fill="#0fa958" />
              </svg>
              <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>Now</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => {
                  liveFarmSimulation.stepTelemetryCycle();
                  showToast(`Telemetry pulse sent to ${selectedSensor.hardwareId}`);
                }}
                className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold hover:bg-stone-200 cursor-pointer text-xs"
              >
                Send Telemetry Pulse
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedSensor(null);
                    showToast(`${selectedSensor.name} calibrated successfully.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0fa958] hover:bg-[#13b963] text-white font-bold cursor-pointer text-xs shadow-xs"
                >
                  Recalibrate Sensor
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: KPI DRILLDOWN MODAL */}
      <Modal
        isOpen={!!selectedKpi}
        onClose={() => setSelectedKpi(null)}
        title={
          selectedKpi === 'farm-status' ? 'Farm Health Diagnostics' :
          selectedKpi === 'plots' ? 'Agricultural Plots Overview' :
          selectedKpi === 'crops' ? 'Active Crop Cultivations' :
          selectedKpi === 'water' ? 'Water Storage & Reservoir Telemetry' :
          selectedKpi === 'irrigation' ? 'Irrigation Actuator Status' :
          'Environmental & Microclimate Advisory'
        }
        subtitle="AGRO-IOT Precision Farm Management System"
      >
        <div className="space-y-4 text-xs">
          {selectedKpi === 'farm-status' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Composite Health Index</span>
                  <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">94 / 100</div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">All vegetative parcels meeting ICAR target parameters.</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#0fa958] text-white flex items-center justify-center font-bold text-lg">
                  ✓
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-stone-700 dark:text-stone-200">
                <div className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850">
                  <div className="text-stone-400 text-[10px]">Soil Moisture Buffer</div>
                  <strong className="text-sm text-emerald-600">Optimal (42.8%)</strong>
                </div>
                <div className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850">
                  <div className="text-stone-400 text-[10px]">Canopy Thermal Stress</div>
                  <strong className="text-sm text-emerald-600">None (27.4°C)</strong>
                </div>
              </div>
            </div>
          )}

          {selectedKpi === 'plots' && (
            <div className="space-y-2">
              {farmState.plots.map((p) => (
                <div key={p.id} className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <div>
                    <strong className="text-stone-900 dark:text-stone-100">{p.name}</strong>
                    <div className="text-stone-400 text-[10px]">{p.crop} • {p.areaHa} ha</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.status === 'Healthy' ? 'bg-emerald-500/15 text-emerald-700' : 'bg-amber-500/15 text-amber-700'
                  }`}>
                    {p.status} ({p.soilMoisture}%)
                  </span>
                </div>
              ))}
            </div>
          )}

          {selectedKpi === 'water' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-400">Total Available Water</span>
                  <div className="text-3xl font-black text-sky-700 dark:text-sky-300">7,200 Litres</div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">72% of 10,000L tank capacity remaining.</p>
                </div>
                <Droplets className="w-10 h-10 text-sky-500" />
              </div>
              <button
                onClick={() => {
                  setSelectedKpi(null);
                  showToast('Borewell pulse initiated: tank refilling +500L');
                }}
                className="w-full py-2.5 rounded-xl bg-[#0fa958] text-white font-bold cursor-pointer"
              >
                Trigger Borewell Refill Pulse
              </button>
            </div>
          )}

          {selectedKpi === 'crops' && (
            <div className="space-y-2">
              <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="flex justify-between font-bold text-stone-800 dark:text-stone-200">
                  <span>Soybean (JS-335)</span>
                  <span className="text-emerald-600">Vegetative (Day 42)</span>
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">Plot A • 0.8 ha • Expected Yield: 2.8 t/ha</p>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="flex justify-between font-bold text-stone-800 dark:text-stone-200">
                  <span>Wheat (HD-3086)</span>
                  <span className="text-amber-600">Tillering Stage</span>
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">Plot B • 2.1 ha • Soil Moisture: 27.8%</p>
              </div>
            </div>
          )}

          {selectedKpi === 'irrigation' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <div>
                  <strong className="text-stone-800 dark:text-stone-200">Main Line Submersible Pump</strong>
                  <div className="text-stone-400 text-[10px]">3-Phase 5HP Solar Inverter Driven</div>
                </div>
                <button
                  onClick={() => handleToggleIrrigation(farmState.water.pumpActive ? 'OFF' : 'ON')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white ${
                    farmState.water.pumpActive ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}
                >
                  {farmState.water.pumpActive ? 'Turn OFF' : 'Turn ON'}
                </button>
              </div>
            </div>
          )}

          {selectedKpi === 'risk' && (
            <div className="space-y-2 text-stone-600 dark:text-stone-300">
              <p>No acute agricultural risks detected across monitored plots. Temperature and wind remain inside safe limits.</p>
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                ✓ Heatwave warning: Inactive
                <br />
                ✓ Rainstorm alert: Clear
                <br />
                ✓ Pest pressure: Minimal
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => setSelectedKpi(null)}
              className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold cursor-pointer text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: ALERT ACTION MODAL */}
      <Modal
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert ? selectedAlert.title : ''}
        subtitle={selectedAlert ? `${selectedAlert.plot} • Priority: ${selectedAlert.severity}` : ''}
      >
        {selectedAlert && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
              <strong className="text-stone-800 dark:text-stone-200">Root Cause & Sensor Observation:</strong>
              <p className="text-stone-600 dark:text-stone-300">{selectedAlert.reason}</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <strong className="text-emerald-800 dark:text-emerald-300">Recommended Agronomic Action:</strong>
              <p className="text-stone-700 dark:text-stone-200">{selectedAlert.action}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <a
                href={HELPLINE_TEL_HREF}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-200"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#0fa958]" />
                <span>Call Helpline</span>
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => handleResolveAlert(selectedAlert.id)}
                  className="px-4 py-2 rounded-xl bg-[#0fa958] hover:bg-[#13b963] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Resolve Alert Now
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 4: RECOMMENDATION ACTION MODAL */}
      <Modal
        isOpen={!!selectedRecommendation}
        onClose={() => setSelectedRecommendation(null)}
        title={selectedRecommendation ? selectedRecommendation.title : ''}
        subtitle={selectedRecommendation ? `Priority: ${selectedRecommendation.priority}` : ''}
      >
        {selectedRecommendation && (
          <div className="space-y-4 text-xs">
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              {selectedRecommendation.details}
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-stone-500">Expected Benefit:</span>
              <strong className="text-emerald-600">Preserves optimal root vigor & +6% yield</strong>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => setSelectedRecommendation(null)}
                className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplyRecommendation(selectedRecommendation)}
                className="px-4 py-2 rounded-xl bg-[#0fa958] hover:bg-[#13b963] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {selectedRecommendation.actionText}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 5: PLOT INSPECTION DETAILS MODAL */}
      <Modal
        isOpen={isPlotModalOpen}
        onClose={() => setIsPlotModalOpen(false)}
        title={`${selectedPlot.name} — Full Field Inspection`}
        subtitle={`Crop: ${selectedPlot.crop} • Area: ${selectedPlot.areaHa} ha • Status: ${selectedPlot.status}`}
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <div className="text-[10px] text-stone-400">Soil Moisture</div>
              <strong className="text-base text-emerald-600">{selectedPlot.soilMoisture}%</strong>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <div className="text-[10px] text-stone-400">Soil Temp</div>
              <strong className="text-base text-stone-900 dark:text-stone-100">{selectedPlot.temperature}°C</strong>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <div className="text-[10px] text-stone-400">Crop Health</div>
              <strong className="text-base text-[#0fa958]">{selectedPlot.cropHealth}%</strong>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <div className="text-[10px] text-stone-400">Drip Valve</div>
              <strong className="text-base text-sky-600">{farmState.water.pumpActive ? 'OPEN' : 'CLOSED'}</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
            <strong className="text-stone-800 dark:text-stone-200">Agronomic Status Notes:</strong>
            <p className="text-stone-600 dark:text-stone-300">{selectedPlot.statusReason}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => {
                handleToggleIrrigation('ON');
                setIsPlotModalOpen(false);
              }}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
            >
              Pulse Drip to this Plot
            </button>
            <button
              onClick={() => {
                setIsPlotModalOpen(false);
                onNavigate('crop-analyzer');
              }}
              className="px-4 py-2 rounded-xl bg-[#0fa958] hover:bg-[#13b963] text-white font-bold text-xs shadow-xs"
            >
              Analyze Leaf Health
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 6: 7-DAY HOURLY WEATHER MODAL */}
      <Modal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        title="7-Day Microclimate & Precipitation Forecast"
        subtitle="Indian Meteorological Department (IMD) Ground Station Sync"
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center">
            {[
              { day: 'Today', icon: '⛅', temp: '30°/22°', rain: '0%' },
              { day: 'Sat', icon: '☀️', temp: '32°/23°', rain: '5%' },
              { day: 'Sun', icon: '☀️', temp: '33°/24°', rain: '10%' },
              { day: 'Mon', icon: '🌦️', temp: '29°/21°', rain: '45%' },
              { day: 'Tue', icon: '🌧️', temp: '27°/20°', rain: '65%' },
              { day: 'Wed', icon: '⛅', temp: '28°/20°', rain: '20%' },
              { day: 'Thu', icon: '☀️', temp: '31°/22°', rain: '0%' },
            ].map((d, i) => (
              <div key={i} className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 space-y-1">
                <span className="text-[10px] font-bold text-stone-500 block">{d.day}</span>
                <span className="text-xl block">{d.icon}</span>
                <strong className="text-[11px] text-stone-800 dark:text-stone-200 block">{d.temp}</strong>
                <span className="text-[9px] text-sky-600 font-bold block">{d.rain}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-stone-700 dark:text-stone-200">
            <strong>Agronomist Summary:</strong> Rain predicted on Monday and Tuesday (18-25mm). Reduce scheduled irrigation pulses over the weekend to maximize rainwater catchment.
          </div>

          <div className="flex justify-end pt-2 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => setIsWeatherModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold cursor-pointer text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* ============================================================== */}
      {/* 7. FLOATING TOAST NOTIFICATION COMPONENT                        */}
      {/* ============================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#092317] text-white border border-[#0fa958]/50 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="w-6 h-6 rounded-full bg-[#0fa958] flex items-center justify-center text-white flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold pr-2">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
