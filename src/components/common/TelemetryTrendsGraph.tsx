import React, { useState } from 'react';
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Wind, 
  Zap, 
  Sun, 
  ArrowUp, 
  ArrowDown, 
  Clock, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { HistoryPoint, FarmActivityEvent } from '../../services/liveFarmSimulationService';

interface TelemetryTrendsGraphProps {
  history: HistoryPoint[];
  activities: FarmActivityEvent[];
  lang: 'en' | 'hi';
}

export type TrendMetric = 'moisture' | 'temperature' | 'humidity' | 'waterFlow' | 'solar';

export const TelemetryTrendsGraph: React.FC<TelemetryTrendsGraphProps> = ({
  history,
  activities,
  lang,
}) => {
  const [metric, setMetric] = useState<TrendMetric>('moisture');
  const [timeframe, setTimeframe] = useState<'15m' | '1h' | '6h' | '24h'>('15m');
  const [hoveredPoint, setHoveredPoint] = useState<{ point: HistoryPoint; index: number } | null>(null);
  const [showEventsTicker, setShowEventsTicker] = useState<boolean>(false);

  // Metric configurations
  const metricConfigs: Record<
    TrendMetric,
    {
      name: string;
      nameHi: string;
      unit: string;
      color: string;
      strokeColor: string;
      fillGradient: string;
      minTarget: number;
      maxTarget: number;
      maxChartScale: number;
      icon: any;
      getValue: (pt: HistoryPoint) => number;
    }
  > = {
    moisture: {
      name: 'Soil Moisture (VWC)',
      nameHi: 'मृदा नमी (रूट ज़ोन)',
      unit: '% VWC',
      color: 'text-blue-500',
      strokeColor: '#3b82f6',
      fillGradient: 'url(#moistureGradient)',
      minTarget: 38,
      maxTarget: 48,
      maxChartScale: 60,
      icon: Droplets,
      getValue: (pt) => pt.moisture,
    },
    temperature: {
      name: 'Canopy Temperature',
      nameHi: 'फसल आवरण तापमान',
      unit: '°C',
      color: 'text-amber-500',
      strokeColor: '#f59e0b',
      fillGradient: 'url(#tempGradient)',
      minTarget: 22,
      maxTarget: 35,
      maxChartScale: 45,
      icon: Thermometer,
      getValue: (pt) => pt.temperature,
    },
    humidity: {
      name: 'Relative Humidity',
      nameHi: 'सापेक्ष आर्द्रता',
      unit: '% RH',
      color: 'text-teal-500',
      strokeColor: '#14b8a6',
      fillGradient: 'url(#humidityGradient)',
      minTarget: 40,
      maxTarget: 80,
      maxChartScale: 100,
      icon: Wind,
      getValue: (pt) => pt.humidity,
    },
    waterFlow: {
      name: 'Irrigation Line Flow',
      nameHi: 'सिंचाई प्रवाह दर',
      unit: 'L/min',
      color: 'text-emerald-500',
      strokeColor: '#10b981',
      fillGradient: 'url(#flowGradient)',
      minTarget: 0,
      maxTarget: 22,
      maxChartScale: 30,
      icon: Zap,
      getValue: (pt) => pt.waterFlow,
    },
    solar: {
      name: 'Solar Insolation',
      nameHi: 'सौर विकिरण दर',
      unit: 'W/m²',
      color: 'text-orange-500',
      strokeColor: '#f97316',
      fillGradient: 'url(#solarGradient)',
      minTarget: 200,
      maxTarget: 900,
      maxChartScale: 1000,
      icon: Sun,
      getValue: (pt) => (pt.waterFlow > 0 ? 680 : 620), // correlated
    },
  };

  const currentCfg = metricConfigs[metric];
  const IconComponent = currentCfg.icon;

  // Extract values
  const values = history.map((pt) => currentCfg.getValue(pt));
  const currentVal = values[values.length - 1] ?? 0;
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const avgVal = (values.reduce((a, b) => a + b, 0) / (values.length || 1)).toFixed(1);
  const diffVal = (values[values.length - 1] - values[0]).toFixed(1);

  // SVG Geometry Calculation (viewBox 0 0 500 160)
  const width = 500;
  const height = 150;
  const paddingX = 24;
  const paddingY = 20;

  const pointsCount = history.length;
  const xStep = pointsCount > 1 ? (width - paddingX * 2) / (pointsCount - 1) : 0;

  const coords = history.map((pt, i) => {
    const val = currentCfg.getValue(pt);
    const x = paddingX + i * xStep;
    // Map val to Y (inverted)
    const normalizedY = (val / currentCfg.maxChartScale) * (height - paddingY * 2);
    const y = height - paddingY - normalizedY;
    return { x, y, val, timeLabel: pt.timeLabel };
  });

  // Generate smooth SVG cubic Bézier path
  const generatePath = () => {
    if (coords.length === 0) return '';
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = generatePath();
  const lastCoord = coords[coords.length - 1] || { x: width - paddingX, y: height / 2 };
  const firstCoord = coords[0] || { x: paddingX, y: height / 2 };
  const areaPath = `${linePath} L ${lastCoord.x} ${height - paddingY} L ${firstCoord.x} ${height - paddingY} Z`;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#151916] border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4 font-sans select-none">
      {/* ============================================================ */}
      {/* 1. TOP HEADER & METRIC SELECTOR TABS                        */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
                {lang === 'hi' ? 'सजीव टेलीमेट्री प्रवृत्तियां एवं ग्राफ' : 'LIVE TELEMETRY TRENDS & ANIMATION'}
              </h3>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                2-MIN PULSE
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              {lang === 'hi' ? 'वास्तविक समय में सूक्ष्म-जलवायु एवं मृदा वक्र' : 'Correlated microclimate & root zone kinetics'}
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center p-0.5 rounded-lg bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-[10px] font-bold">
          {(['15m', '1h', '6h', '24h'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.8 rounded-md transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
        {(Object.keys(metricConfigs) as TrendMetric[]).map((mKey) => {
          const cfg = metricConfigs[mKey];
          const MIcon = cfg.icon;
          const isSelected = metric === mKey;
          return (
            <button
              key={mKey}
              onClick={() => setMetric(mKey)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-transparent shadow-xs font-bold'
                  : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-750 text-stone-600 dark:text-stone-300 hover:border-stone-300'
              }`}
            >
              <MIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-stone-400'}`} />
              <span>{lang === 'hi' ? cfg.nameHi.split('(')[0] : cfg.name.split('(')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* 2. STATISTICAL SUMMARY PILL ROW                             */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200/70 dark:border-stone-800">
          <span className="text-[10px] text-stone-400 font-mono uppercase block">CURRENT VALUE</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-mono font-black text-stone-900 dark:text-stone-100">{currentVal}</span>
            <span className="text-[10px] text-stone-400">{currentCfg.unit}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200/70 dark:border-stone-800">
          <span className="text-[10px] text-stone-400 font-mono uppercase block">24H HIGH / LOW</span>
          <div className="flex items-baseline gap-1.5 mt-0.5 font-mono text-xs font-bold">
            <span className="text-rose-500">▲ {maxVal}</span>
            <span className="text-stone-300 dark:text-stone-600">/</span>
            <span className="text-blue-500">▼ {minVal}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200/70 dark:border-stone-800">
          <span className="text-[10px] text-stone-400 font-mono uppercase block">CYCLE AVERAGE</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-mono font-bold text-stone-800 dark:text-stone-200">{avgVal}</span>
            <span className="text-[10px] text-stone-400">{currentCfg.unit}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200/70 dark:border-stone-800">
          <span className="text-[10px] text-stone-400 font-mono uppercase block">NET DRIFT</span>
          <div className="flex items-center gap-1 mt-0.5 font-mono font-bold text-xs">
            {Number(diffVal) >= 0 ? (
              <span className="text-emerald-600 flex items-center">
                <ArrowUp className="w-3 h-3" /> +{diffVal}
              </span>
            ) : (
              <span className="text-amber-500 flex items-center">
                <ArrowDown className="w-3 h-3" /> {diffVal}
              </span>
            )}
            <span className="text-[10px] font-normal text-stone-400">/hr</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. HIGH-PRECISION ANIMATED SVG SPLINE GRAPH                  */}
      {/* ============================================================ */}
      <div className="relative w-full h-48 bg-stone-50/50 dark:bg-[#111311] rounded-2xl border border-stone-200 dark:border-stone-800/80 p-2 overflow-hidden group">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Moisture Blue Gradient */}
            <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>

            {/* Temp Amber Gradient */}
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>

            {/* Humidity Teal Gradient */}
            <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
            </linearGradient>

            {/* Flow Emerald Gradient */}
            <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>

            {/* Solar Orange Gradient */}
            <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Reference Grid Lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="currentColor" strokeOpacity="0.15" />

          {/* Gradient Area Fill */}
          <path 
            d={areaPath} 
            fill={currentCfg.fillGradient} 
            className="transition-all duration-700 ease-in-out" 
          />

          {/* Animated Main Spline Curve */}
          <path 
            d={linePath} 
            fill="none" 
            stroke={currentCfg.strokeColor} 
            strokeWidth="2.5" 
            strokeLinecap="round"
            className="transition-all duration-700 ease-in-out"
          />

          {/* Data Points on Spline */}
          {coords.map((c, i) => (
            <g key={i} className="cursor-pointer group/dot">
              <circle
                cx={c.x}
                cy={c.y}
                r="3.5"
                fill="white"
                stroke={currentCfg.strokeColor}
                strokeWidth="2"
                className="transition-transform group-hover/dot:scale-150"
              />
            </g>
          ))}

          {/* Pulsating Ping Dot on the Most Recent Point */}
          <g transform={`translate(${lastCoord.x}, ${lastCoord.y})`}>
            <circle cx="0" cy="0" r="10" fill={currentCfg.strokeColor} opacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="5" fill={currentCfg.strokeColor} />
            <circle cx="0" cy="0" r="2" fill="white" />
          </g>

          {/* Time Labels at Bottom */}
          {coords.map((c, i) => (
            <text
              key={i}
              x={c.x}
              y={height - 4}
              textAnchor="middle"
              className="fill-stone-400 font-mono text-[9px] pointer-events-none"
            >
              {c.timeLabel}
            </text>
          ))}
        </svg>

        {/* Live Scanning Laser Light Beam (Animation) */}
        <div className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/10 dark:via-emerald-400/10 to-transparent pointer-events-none animate-[shimmer_3s_infinite]" />
      </div>

      {/* ============================================================ */}
      {/* 4. COLLAPSIBLE RECENT ACTIVITY TICKER                        */}
      {/* Preserves activity context cleanly beneath trends            */}
      {/* ============================================================ */}
      <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
        <button
          onClick={() => setShowEventsTicker(!showEventsTicker)}
          className="w-full flex items-center justify-between text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer py-1"
        >
          <span className="font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{lang === 'hi' ? 'नवीनतम कृषि घटनाक्रम लॉग (Recent Activity)' : 'Recent Agricultural Event Log'}</span>
            <span className="text-[10px] font-mono text-stone-400">({activities.length})</span>
          </span>
          {showEventsTicker ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showEventsTicker && (
          <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto pr-1 animate-fade-in text-xs">
            {activities.map((act) => (
              <div 
                key={act.id} 
                className="flex items-start gap-2 p-2 rounded-lg bg-stone-50 dark:bg-stone-850/80 border border-stone-200/60 dark:border-stone-800 text-[11px]"
              >
                <span className="font-mono text-[10px] text-stone-400 mt-0.5">{act.time}</span>
                <span className="text-stone-700 dark:text-stone-300 leading-tight">{act.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
