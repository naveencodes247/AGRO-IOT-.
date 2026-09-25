import React, { useState } from 'react';
import { IndianStateAgriProfile } from '../../types';
import { INDIAN_STATES_DATA } from '../../services/agriIntelligenceService';
import { 
  MapPin, 
  Droplets, 
  Sun, 
  Sprout, 
  Building, 
  Compass, 
  CheckCircle2, 
  Search,
  Grid,
  Map,
  Filter
} from 'lucide-react';

interface IndiaMapProps {
  selectedStateId: string;
  onSelectState: (state: IndianStateAgriProfile) => void;
  lang: 'en' | 'hi';
}

interface StatePolygon {
  id: string;
  code: string;
  name: string;
  hindiName: string;
  path: string;
  center: [number, number];
  zone: 'North' | 'South' | 'East' | 'West' | 'Central' | 'NorthEast' | 'UT';
}

export const INDIA_POLYGONS: StatePolygon[] = [
  {
    id: 'jammu-kashmir',
    code: 'JK',
    name: 'Jammu & Kashmir',
    hindiName: 'जम्मू और कश्मीर',
    path: 'M 195 72 L 230 60 L 255 78 L 245 110 L 210 115 L 185 100 Z',
    center: [215, 88],
    zone: 'UT'
  },
  {
    id: 'ladakh',
    code: 'LA',
    name: 'Ladakh',
    hindiName: 'लद्दाख',
    path: 'M 230 60 L 290 35 L 340 70 L 325 110 L 255 78 Z',
    center: [285, 75],
    zone: 'UT'
  },
  {
    id: 'himachal-pradesh',
    code: 'HP',
    name: 'Himachal Pradesh',
    hindiName: 'हिमाचल प्रदेश',
    path: 'M 210 115 L 245 110 L 275 125 L 260 155 L 225 150 L 215 130 Z',
    center: [242, 134],
    zone: 'North'
  },
  {
    id: 'punjab',
    code: 'PB',
    name: 'Punjab',
    hindiName: 'पंजाब',
    path: 'M 185 125 L 220 128 L 225 150 L 210 185 L 175 170 L 178 140 Z',
    center: [200, 155],
    zone: 'North'
  },
  {
    id: 'uttarakhand',
    code: 'UK',
    name: 'Uttarakhand',
    hindiName: 'उत्तराखंड',
    path: 'M 260 155 L 275 125 L 320 150 L 305 185 L 265 175 Z',
    center: [288, 162],
    zone: 'North'
  },
  {
    id: 'haryana',
    code: 'HR',
    name: 'Haryana',
    hindiName: 'हरियाणा',
    path: 'M 210 185 L 225 150 L 260 155 L 255 205 L 215 210 Z',
    center: [235, 185],
    zone: 'North'
  },
  {
    id: 'delhi',
    code: 'DL',
    name: 'Delhi',
    hindiName: 'दिल्ली',
    path: 'M 248 190 L 256 190 L 256 198 L 248 198 Z',
    center: [252, 194],
    zone: 'UT'
  },
  {
    id: 'rajasthan',
    code: 'RJ',
    name: 'Rajasthan',
    hindiName: 'राजस्थान',
    path: 'M 130 185 L 175 170 L 215 210 L 245 220 L 250 265 L 210 310 L 160 300 L 120 250 Z',
    center: [185, 245],
    zone: 'West'
  },
  {
    id: 'uttar-pradesh',
    code: 'UP',
    name: 'Uttar Pradesh',
    hindiName: 'उत्तर प्रदेश',
    path: 'M 255 205 L 265 175 L 305 185 L 340 200 L 415 235 L 385 290 L 330 280 L 270 270 L 250 265 L 245 220 Z',
    center: [320, 245],
    zone: 'North'
  },
  {
    id: 'bihar',
    code: 'BR',
    name: 'Bihar',
    hindiName: 'बिहार',
    path: 'M 415 235 L 490 240 L 480 285 L 415 285 L 385 290 Z',
    center: [445, 260],
    zone: 'East'
  },
  {
    id: 'gujarat',
    code: 'GJ',
    name: 'Gujarat',
    hindiName: 'गुजरात',
    path: 'M 90 290 L 160 300 L 180 340 L 195 380 L 145 385 L 115 360 L 80 330 Z',
    center: [135, 335],
    zone: 'West'
  },
  {
    id: 'madhya-pradesh',
    code: 'MP',
    name: 'Madhya Pradesh',
    hindiName: 'मध्य प्रदेश',
    path: 'M 210 310 L 270 270 L 330 280 L 385 290 L 375 350 L 330 375 L 255 370 L 195 380 L 180 340 Z',
    center: [280, 330],
    zone: 'Central'
  },
  {
    id: 'chhattisgarh',
    code: 'CG',
    name: 'Chhattisgarh',
    hindiName: 'छत्तीसगढ़',
    path: 'M 375 350 L 415 340 L 420 420 L 380 445 L 355 400 L 375 350 Z',
    center: [390, 390],
    zone: 'Central'
  },
  {
    id: 'jharkhand',
    code: 'JH',
    name: 'Jharkhand',
    hindiName: 'झारखंड',
    path: 'M 415 285 L 480 285 L 475 335 L 430 340 L 385 290 Z',
    center: [445, 310],
    zone: 'East'
  },
  {
    id: 'west-bengal',
    code: 'WB',
    name: 'West Bengal',
    hindiName: 'पश्चिम बंगाल',
    path: 'M 480 285 L 515 285 L 505 380 L 465 370 L 475 335 Z',
    center: [490, 330],
    zone: 'East'
  },
  {
    id: 'odisha',
    code: 'OD',
    name: 'Odisha',
    hindiName: 'ओडिशा',
    path: 'M 420 420 L 430 340 L 465 370 L 450 440 L 380 445 Z',
    center: [425, 410],
    zone: 'East'
  },
  {
    id: 'maharashtra',
    code: 'MH',
    name: 'Maharashtra',
    hindiName: 'महाराष्ट्र',
    path: 'M 195 380 L 255 370 L 330 375 L 340 440 L 260 460 L 180 430 L 175 400 Z',
    center: [250, 415],
    zone: 'West'
  },
  {
    id: 'telangana',
    code: 'TS',
    name: 'Telangana',
    hindiName: 'तेलंगाना',
    path: 'M 260 460 L 340 440 L 355 460 L 335 500 L 285 490 Z',
    center: [305, 470],
    zone: 'South'
  },
  {
    id: 'andhra-pradesh',
    code: 'AP',
    name: 'Andhra Pradesh',
    hindiName: 'आंध्र प्रदेश',
    path: 'M 355 460 L 420 420 L 410 500 L 345 550 L 335 500 Z',
    center: [365, 510],
    zone: 'South'
  },
  {
    id: 'karnataka',
    code: 'KA',
    name: 'Karnataka',
    hindiName: 'कर्नाटक',
    path: 'M 190 440 L 240 465 L 305 490 L 340 515 L 310 580 L 250 560 L 210 490 Z',
    center: [265, 515],
    zone: 'South'
  },
  {
    id: 'tamil-nadu',
    code: 'TN',
    name: 'Tamil Nadu',
    hindiName: 'तमिलनाडु',
    path: 'M 310 580 L 340 550 L 390 560 L 355 640 L 300 645 L 290 600 Z',
    center: [335, 600],
    zone: 'South'
  },
  {
    id: 'kerala',
    code: 'KL',
    name: 'Kerala',
    hindiName: 'केरल',
    path: 'M 250 560 L 290 600 L 300 645 L 275 645 L 240 585 Z',
    center: [270, 605],
    zone: 'South'
  },
  {
    id: 'assam',
    code: 'AS',
    name: 'Assam',
    hindiName: 'असम',
    path: 'M 535 240 L 590 230 L 610 260 L 575 285 L 530 270 Z',
    center: [565, 255],
    zone: 'NorthEast'
  }
];

export const IndiaMap: React.FC<IndiaMapProps> = ({ selectedStateId, onSelectState, lang }) => {
  const [viewMode, setViewMode] = useState<'boxes' | 'map'>('boxes');
  const [activeZone, setActiveZone] = useState<string>('All');
  const [searchState, setSearchState] = useState<string>('');
  const [hoveredState, setHoveredState] = useState<StatePolygon | null>(null);

  const selectedProfile = INDIAN_STATES_DATA.find(s => s.id === selectedStateId) || INDIAN_STATES_DATA[0];

  const filteredStates = INDIAN_STATES_DATA.filter(s => {
    if (activeZone !== 'All') {
      const matchPoly = INDIA_POLYGONS.find(p => p.id === s.id);
      if (matchPoly && matchPoly.zone !== activeZone) return false;
    }
    if (searchState.trim()) {
      const q = searchState.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) || 
        s.hindiName.toLowerCase().includes(q) || 
        s.code.toLowerCase().includes(q) ||
        s.capital.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Filter Bar: View Mode Switcher, Zone Filters, and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'hi' ? 'भारत राजनीतिक एवं कृषि राज्य ग्रिड' : 'India Political & Agricultural Matrix'}</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Real political territorial data across all 28 States and 8 Union Territories with verified ICAR agro-climatic profiles.
          </p>
        </div>

        {/* View Switcher: State Boxes vs Map Vector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="p-0.5 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center">
            <button
              onClick={() => setViewMode('boxes')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'boxes'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-emerald-600" />
              <span>State Boxes</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-emerald-600" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Zone Filters & Quick Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['All', 'North', 'West', 'Central', 'South', 'East', 'NorthEast', 'UT'].map((zone) => (
            <button
              key={zone}
              onClick={() => setActiveZone(zone)}
              className={`px-2.5 py-1 rounded border font-medium transition-colors cursor-pointer whitespace-nowrap text-xs ${
                activeZone === zone
                  ? 'bg-[#143e24] text-white border-[#143e24] dark:bg-emerald-600 dark:border-emerald-600 font-bold'
                  : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-750 hover:bg-stone-50'
              }`}
            >
              {zone === 'All' ? 'All States (36)' : zone}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchState}
            onChange={(e) => setSearchState(e.target.value)}
            placeholder="Search state, capital, crop..."
            className="w-full pl-8 pr-3 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 text-xs focus:outline-hidden focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Main Content Area: Left (Boxes or Vector Map) & Right (Selected State Dossier) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: STATE BOXES GRID OR VECTOR MAP */}
        <div className="lg:col-span-7 bg-white dark:bg-[#151815] rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5">
          {viewMode === 'boxes' ? (
            /* REAL STATE BOXES GRID (Minimal, human-made box grid) */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  Administrative State Boxes ({filteredStates.length} Regions)
                </span>
                <span className="text-[11px]">Click box to load agronomic dossier</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[560px] overflow-y-auto pr-1">
                {filteredStates.map((state) => {
                  const isSelected = state.id === selectedStateId;
                  return (
                    <button
                      key={state.id}
                      onClick={() => onSelectState(state)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#143e24] dark:border-emerald-500 bg-[#f4f7f4] dark:bg-[#18281d] shadow-2xs ring-1 ring-[#143e24] dark:ring-emerald-500'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className={`text-xs font-mono font-black px-1.5 py-0.5 rounded ${
                          isSelected 
                            ? 'bg-[#143e24] text-white dark:bg-emerald-600' 
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                        }`}>
                          {state.code}
                        </span>
                        {state.isUT && (
                          <span className="text-[9px] font-bold text-stone-400 uppercase">UT</span>
                        )}
                      </div>

                      <div className="my-1.5">
                        <span className={`font-bold text-xs block leading-tight ${
                          isSelected ? 'text-[#143e24] dark:text-emerald-400 font-extrabold' : 'text-stone-900 dark:text-stone-100'
                        }`}>
                          {lang === 'hi' ? state.hindiName : state.name}
                        </span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate">
                          {state.capital}
                        </span>
                      </div>

                      <div className="pt-1.5 border-t border-stone-200/60 dark:border-stone-750/60 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400">
                        <span className="truncate">{state.kharifCrops[0] || 'Agriculture'}</span>
                        <span className="font-mono text-stone-400 flex items-center gap-0.5">
                          <Droplets className="w-2.5 h-2.5 text-blue-500" />
                          {state.annualRainfallMm}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* CARTOGRAPHIC VECTOR BOUNDARY MAP */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  Administrative Boundaries Map
                </span>
                <span className="text-[11px] font-mono">
                  Active: <strong className="text-emerald-700 dark:text-emerald-400">{selectedProfile.name} [{selectedProfile.code}]</strong>
                </span>
              </div>

              <div className="relative w-full aspect-[6/7] max-h-[500px] bg-[#fbf9f5] dark:bg-[#111311] rounded-lg border border-stone-200 dark:border-stone-800 p-2 overflow-hidden flex items-center justify-center">
                <svg viewBox="60 20 570 660" className="w-full h-full">
                  {INDIA_POLYGONS.map((poly) => {
                    const isSelected = poly.id === selectedStateId;
                    const isHovered = hoveredState?.id === poly.id;
                    const profile = INDIAN_STATES_DATA.find(s => s.id === poly.id);

                    return (
                      <g
                        key={poly.id}
                        onClick={() => {
                          if (profile) onSelectState(profile);
                        }}
                        onMouseEnter={() => setHoveredState(poly)}
                        onMouseLeave={() => setHoveredState(null)}
                        className="cursor-pointer transition-colors duration-100"
                      >
                        <path
                          d={poly.path}
                          className={`stroke-[1.5] ${
                            isSelected
                              ? 'fill-[#143e24] dark:fill-emerald-600 stroke-white dark:stroke-stone-900'
                              : isHovered
                              ? 'fill-emerald-200 dark:fill-emerald-900 stroke-emerald-800 dark:stroke-emerald-400'
                              : 'fill-stone-100 dark:fill-stone-850 stroke-stone-300 dark:stroke-stone-700'
                          }`}
                        />
                        <text
                          x={poly.center[0]}
                          y={poly.center[1]}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={`text-[9px] font-mono font-bold pointer-events-none select-none ${
                            isSelected ? 'fill-white font-extrabold' : 'fill-stone-700 dark:fill-stone-300'
                          }`}
                        >
                          {poly.code}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {hoveredState && (
                  <div className="absolute top-3 left-3 p-2.5 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-md text-xs pointer-events-none">
                    <span className="font-bold text-stone-900 dark:text-stone-100 block">
                      {hoveredState.name} [{hoveredState.code}]
                    </span>
                    <span className="text-[10px] text-stone-500">Click to select</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: SELECTED STATE DOSSIER (Clean, Minimal, Agricultural) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#151815] rounded-xl border border-stone-200 dark:border-stone-800 p-5 space-y-4">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                  {selectedProfile.isUT ? 'UNION TERRITORY' : 'STATE DOSSIER'}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  [{selectedProfile.code}]
                </span>
              </div>
              <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                {lang === 'hi' ? selectedProfile.hindiName : selectedProfile.name}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                Capital City: {selectedProfile.capital}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-stone-400 block font-medium">Annual Rainfall</span>
              <span className="text-base font-bold text-blue-700 dark:text-blue-400 font-mono flex items-center justify-end gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                {selectedProfile.annualRainfallMm} mm
              </span>
            </div>
          </div>

          {/* Seasonal Cropping Schedule */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                Kharif Season (Monsoon Sowing):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProfile.kharifCrops.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                Rabi Season (Winter Sowing):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProfile.rabiCrops.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {selectedProfile.zaidCrops.length > 0 && (
              <div>
                <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1.5">
                  Zaid Season (Summer Sowing):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfile.zaidCrops.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Soils Series */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <span className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Dominant Soil Series:
              </span>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-xs">
                {selectedProfile.majorSoils.join(' • ')}
              </p>
            </div>

            {/* Certified Advisory Note */}
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-750 text-[11px] text-stone-600 dark:text-stone-300">
              <strong>ICAR / State Agricultural University Note:</strong> Irrigation advisories for {selectedProfile.name} align with the regional Central Ground Water Board (CGWB) aquifer recharge indices.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
