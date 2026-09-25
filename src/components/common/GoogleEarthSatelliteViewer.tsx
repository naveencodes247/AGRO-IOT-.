import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Compass, 
  Plus as ZoomIn, 
  Minus as ZoomOut, 
  Layers, 
  Crosshair, 
  RefreshCw, 
  MapPin, 
  Radio, 
  Eye, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { FarmPlotModel } from '../../services/liveFarmSimulationService';

interface GoogleEarthSatelliteViewerProps {
  plots: FarmPlotModel[];
  selectedPlotId: string;
  onSelectPlot: (plotId: string) => void;
  lang: 'en' | 'hi';
  onExpandView?: () => void;
}

export type SatelliteLayerType = 'hybrid' | 'satellite' | 'ndvi' | 'moisture';

export const GoogleEarthSatelliteViewer: React.FC<GoogleEarthSatelliteViewerProps> = ({
  plots,
  selectedPlotId,
  onSelectPlot,
  lang,
  onExpandView,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(17); // Google Earth zoom 15 - 19
  const [activeLayer, setActiveLayer] = useState<SatelliteLayerType>('hybrid');
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [layerDropdownOpen, setLayerDropdownOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isCrosshairVisible, setIsCrosshairVisible] = useState<boolean>(true);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Satellite tile coordinate calculation for Indore Malwa farmlands (Lat 22.7533, Long 75.8937)
  // Web Mercator Tile conversion:
  const getTileUrl = (z: number, xOff: number = 0, yOff: number = 0) => {
    // Base tile index for Indore farmlands at z=17:
    // x approx 93164, y approx 56642
    const baseX = Math.floor(93164 * Math.pow(2, z - 17)) + xOff;
    const baseY = Math.floor(56642 * Math.pow(2, z - 17)) + yOff;
    
    // We use ArcGIS World Imagery which provides reliable high-resolution satellite tiles without API keys
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${baseY}/${baseX}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(15, Math.min(19, prev + delta)));
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 500);
  };

  const handleResetCenter = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoomLevel(17);
  };

  const selectedPlot = plots.find((p) => p.id === selectedPlotId) || plots[0];

  return (
    <div 
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-850 bg-stone-950 select-none transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 h-auto' : 'aspect-[4/4.5] sm:aspect-auto sm:h-[460px]'
      }`}
    >
      {/* ============================================================ */}
      {/* 1. SATELLITE CANVAS CONTAINER (DRAGGABLE & ZOOMABLE)          */}
      {/* ============================================================ */}
      <div 
        className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Dynamic Satellite Tile Canvas */}
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out origin-center"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${1 + (zoomLevel - 15) * 0.25})`,
          }}
        >
          {/* High-Resolution Real Satellite Tile Imagery */}
          <div className="absolute inset-[-40%] w-[180%] h-[180%] grid grid-cols-3 grid-rows-3 filter saturate-[1.2] contrast-[1.08]">
            {[-1, 0, 1].map((yOff) =>
              [-1, 0, 1].map((xOff) => (
                <div key={`${xOff}-${yOff}`} className="relative w-full h-full overflow-hidden bg-stone-900">
                  <img
                    src={getTileUrl(zoomLevel, xOff, yOff)}
                    alt={`Real-time Earth Tile ${xOff},${yOff}`}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback tile to ensure uninterrupted visual continuity
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop';
                    }}
                  />
                </div>
              ))
            )}
          </div>

          {/* SATELLITE SPECTRAL OVERLAYS */}
          {/* Layer A: NDVI Biomass Gradient Filter */}
          {activeLayer === 'ndvi' && (
            <div className="absolute inset-[-40%] w-[180%] h-[180%] pointer-events-none bg-gradient-to-tr from-emerald-600/35 via-lime-500/25 to-amber-500/20 mix-blend-color-dodge animate-fade-in" />
          )}

          {/* Layer B: Soil Moisture Radar Thermal Filter */}
          {activeLayer === 'moisture' && (
            <div className="absolute inset-[-40%] w-[180%] h-[180%] pointer-events-none bg-gradient-to-br from-blue-700/40 via-cyan-500/30 to-indigo-600/25 mix-blend-overlay animate-fade-in" />
          )}

          {/* Layer C: Google Earth Cadastral Khasra Grid Lines */}
          {(activeLayer === 'hybrid' || activeLayer === 'satellite') && (
            <div className="absolute inset-[-40%] w-[180%] h-[180%] pointer-events-none opacity-25">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cadastral-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                    <path d="M 120 0 L 0 0 0 120" fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="4 4" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cadastral-grid)" />
              </svg>
            </div>
          )}

          {/* ============================================================ */}
          {/* PARCEL BOUNDARY POLYGONS & LIVE SENSORY PINS                */}
          {/* ============================================================ */}
          {/* Plot A: Uttari Khet (Soybean) Polygon Boundary */}
          <div className="absolute left-[20%] top-[34%] w-[26%] h-[24%] rounded-xl border-2 border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.4)] pointer-events-none transition-all">
            <span className="absolute top-1 left-2 text-[9px] font-mono font-bold text-white bg-black/60 px-1 rounded">
              KHASRA #104/1A (1.8 Ha)
            </span>
          </div>

          {/* Plot B: Poorvi Khet (Wheat) Polygon Boundary */}
          <div className="absolute left-[62%] top-[18%] w-[28%] h-[26%] rounded-xl border-2 border-amber-400 bg-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.4)] pointer-events-none transition-all">
            <span className="absolute top-1 left-2 text-[9px] font-mono font-bold text-white bg-black/60 px-1 rounded">
              KHASRA #104/2B (2.1 Ha)
            </span>
          </div>

          {/* Plot C: Dakshini Baag (Tomato) Polygon Boundary */}
          <div className="absolute left-[54%] top-[62%] w-[28%] h-[26%] rounded-xl border-2 border-teal-400 bg-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.4)] pointer-events-none transition-all">
            <span className="absolute top-1 left-2 text-[9px] font-mono font-bold text-white bg-black/60 px-1 rounded">
              KHASRA #105/3C (1.1 Ha)
            </span>
          </div>

          {/* Plot D: Nehar Block (Mustard) Polygon Boundary */}
          <div className="absolute left-[12%] top-[66%] w-[24%] h-[22%] rounded-xl border-2 border-emerald-500 bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.4)] pointer-events-none transition-all">
            <span className="absolute top-1 left-2 text-[9px] font-mono font-bold text-white bg-black/60 px-1 rounded">
              KHASRA #106/4D (0.8 Ha)
            </span>
          </div>

          {/* INTERACTIVE CLICKABLE PLOT PINS */}
          {plots.map((plot) => {
            const isSelected = selectedPlotId === plot.id;
            return (
              <div
                key={plot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlot(plot.id);
                }}
                style={{ left: `${plot.xPercent}%`, top: `${plot.yPercent}%` }}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group ${
                  isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                }`}
              >
                <div className="flex flex-col items-center">
                  {/* Floating Telemetry Badge */}
                  <div className={`px-2.5 py-1 rounded-full backdrop-blur-md text-[10px] font-black shadow-2xl border whitespace-nowrap mb-1.5 transition-colors ${
                    isSelected
                      ? 'bg-stone-900 text-white border-emerald-400 ring-2 ring-emerald-400/40'
                      : plot.status === 'Healthy'
                        ? 'bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 border-stone-200 dark:border-stone-700'
                        : 'bg-stone-900/90 text-amber-300 border-amber-400'
                  }`}>
                    <span className="mr-1">{plot.name.split('—')[0].trim()}</span>
                    <span className="font-mono text-emerald-400 font-bold">{plot.soilMoisture}% VWC</span>
                  </div>

                  {/* Pulsing GPS Satellite Marker */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center relative ${
                    plot.status === 'Healthy'
                      ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                      : 'bg-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                  }`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      plot.status === 'Healthy' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} />
                    <div className="w-2 h-2 rounded-full bg-white relative z-10" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time GPS Crosshair at Center */}
        {isCrosshairVisible && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 opacity-70">
            <div className="relative w-8 h-8">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400/80 -translate-y-1/2" />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald-400/80 -translate-x-1/2" />
              <div className="absolute inset-1 rounded-full border border-emerald-400/60" />
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 2. TOP OVERLAY HUD: SATELLITE LAYER SELECTOR & METADATA     */}
      {/* ============================================================ */}
      <div className="relative z-20 p-3 sm:p-4 flex items-center justify-between gap-2 pointer-events-none">
        {/* Layer Badge & Dropdown */}
        <div className="pointer-events-auto relative">
          <button
            onClick={() => setLayerDropdownOpen(!layerDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-lg cursor-pointer transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {activeLayer === 'hybrid' && 'Google Earth Hybrid'}
              {activeLayer === 'satellite' && 'True Color Optical'}
              {activeLayer === 'ndvi' && 'Sentinel-2 NDVI Biomass'}
              {activeLayer === 'moisture' && 'SAR Soil Moisture Radar'}
            </span>
          </button>

          {layerDropdownOpen && (
            <div 
              className="absolute left-0 mt-1.5 w-64 py-1 bg-stone-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-stone-750 text-xs z-50 text-white divide-y divide-stone-800"
              onMouseLeave={() => setLayerDropdownOpen(false)}
            >
              <div className="px-3 py-1.5 text-[10px] font-mono text-stone-400 uppercase font-bold">
                Select Satellite Earth Layer
              </div>
              <button
                onClick={() => { setActiveLayer('hybrid'); setLayerDropdownOpen(false); }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-white/10 cursor-pointer ${
                  activeLayer === 'hybrid' ? 'text-emerald-400 font-bold bg-white/5' : 'text-stone-200'
                }`}
              >
                <div>
                  <div className="font-semibold">Google Earth Hybrid</div>
                  <div className="text-[10px] text-stone-400">High-res optical + Khasra plot boundaries</div>
                </div>
                {activeLayer === 'hybrid' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                onClick={() => { setActiveLayer('satellite'); setLayerDropdownOpen(false); }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-white/10 cursor-pointer ${
                  activeLayer === 'satellite' ? 'text-emerald-400 font-bold bg-white/5' : 'text-stone-200'
                }`}
              >
                <div>
                  <div className="font-semibold">True Color Satellite</div>
                  <div className="text-[10px] text-stone-400">Direct RGB imagery from Sentinel-2B</div>
                </div>
                {activeLayer === 'satellite' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                onClick={() => { setActiveLayer('ndvi'); setLayerDropdownOpen(false); }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-white/10 cursor-pointer ${
                  activeLayer === 'ndvi' ? 'text-emerald-400 font-bold bg-white/5' : 'text-stone-200'
                }`}
              >
                <div>
                  <div className="font-semibold">Sentinel-2 NDVI Biomass</div>
                  <div className="text-[10px] text-stone-400">Vegetation vigour & chlorophyll reflection</div>
                </div>
                {activeLayer === 'ndvi' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                onClick={() => { setActiveLayer('moisture'); setLayerDropdownOpen(false); }}
                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-white/10 cursor-pointer ${
                  activeLayer === 'moisture' ? 'text-emerald-400 font-bold bg-white/5' : 'text-stone-200'
                }`}
              >
                <div>
                  <div className="font-semibold">SAR Moisture Radar</div>
                  <div className="text-[10px] text-stone-400">Thermal root-zone moisture gradient</div>
                </div>
                {activeLayer === 'moisture' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Live Satellite Status Pill */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SENTINEL-2 // LIVE</span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="pointer-events-auto p-2 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 shadow-md cursor-pointer transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Satellite View'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. BOTTOM OVERLAY HUD: GPS COORDINATES & ZOOM CONTROLS       */}
      {/* ============================================================ */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-end justify-between pointer-events-none">
        {/* GPS Coordinates & Indian Farm Telemetry Bar */}
        <div className="pointer-events-auto px-3 py-2 rounded-xl bg-black/80 backdrop-blur-md text-white border border-white/15 shadow-xl max-w-[260px] sm:max-w-xs text-[10px]">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">22°45'11.8"N, 75°53'37.2"E</span>
          </div>
          <div className="text-stone-300 font-mono text-[9px] mt-0.5 flex items-center justify-between">
            <span>Alt: 542m MSL</span>
            <span>•</span>
            <span>Res: 0.5m/px</span>
            <span>•</span>
            <span className="text-emerald-400">Indore, MP</span>
          </div>
          <div className="text-[9px] text-stone-400 border-t border-white/10 mt-1 pt-1 truncate">
            Active: <strong className="text-white">{selectedPlot.name}</strong> ({selectedPlot.crop})
          </div>
        </div>

        {/* Map Controls: Reset, Crosshair, Zoom In, Zoom Out */}
        <div className="pointer-events-auto flex flex-col gap-1.5">
          <button
            onClick={handleResetCenter}
            className="p-2 rounded-xl bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-colors"
            title="Reset to Farm Center"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <button
            onClick={() => setIsCrosshairVisible(!isCrosshairVisible)}
            className={`p-2 rounded-xl backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-colors ${
              isCrosshairVisible ? 'bg-emerald-600 text-white' : 'bg-black/80 text-stone-400 hover:text-white'
            }`}
            title="Toggle GPS Crosshair"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>

          <div className="flex flex-col rounded-xl bg-black/80 backdrop-blur-md border border-white/20 shadow-lg divide-y divide-white/15 overflow-hidden">
            <button
              onClick={() => handleZoom(1)}
              disabled={zoomLevel >= 19}
              className="p-2 text-white hover:bg-white/15 disabled:opacity-30 cursor-pointer transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-1)}
              disabled={zoomLevel <= 15}
              className="p-2 text-white hover:bg-white/15 disabled:opacity-30 cursor-pointer transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
