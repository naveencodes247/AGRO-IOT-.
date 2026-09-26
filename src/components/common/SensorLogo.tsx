import React from 'react';

export type SensorLogoType =
  | 'soil_moisture'
  | 'soil_temp'
  | 'soil_ph'
  | 'soil_ec'
  | 'nitrogen'
  | 'phosphorus'
  | 'potassium'
  | 'air_temp'
  | 'humidity'
  | 'light_intensity'
  | 'rainfall'
  | 'wind_speed'
  | 'water_tank_sensor'
  | 'water_flow_sensor'
  | 'crop_canopy_temp'
  | 'leaf_wetness'
  | 'battery'
  | 'mesh_nodes'
  | 'default';

interface SensorLogoProps {
  type: SensorLogoType | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SensorLogo: React.FC<SensorLogoProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  }[size];

  switch (type) {
    // 1. Soil Moisture Logo: Multi-tier soil strata with penetrating capacitive electrodes & water droplet
    case 'soil_moisture':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 p-1 ${sizeClasses} ${className}`} title="Soil Moisture Capacitive Sensor">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-emerald-600 dark:text-emerald-400">
            {/* Soil Strata Layers */}
            <path d="M4 22H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <path d="M4 26H28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            {/* Capacitive Probes penetrating soil */}
            <path d="M11 13V25" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
            <path d="M21 13V25" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
            {/* Water Droplet at center */}
            <path d="M16 6C16 6 12 11 12 14.5C12 16.9853 13.7909 19 16 19C18.2091 19 20 16.9853 20 14.5C20 11 16 6 16 6Z" fill="#0fa958" />
            <circle cx="15" cy="14" r="1.2" fill="white" opacity="0.8" />
          </svg>
        </div>
      );

    // 2. Soil Temperature Logo: Subsoil probe with thermal heat gradients
    case 'soil_temp':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/10 border border-rose-500/30 p-1 ${sizeClasses} ${className}`} title="Subsoil Temperature Probe (DS18B20)">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Subsoil Horizon */}
            <line x1="4" y1="18" x2="28" y2="18" stroke="#78350f" strokeWidth="2" strokeDasharray="3 2" opacity="0.5" />
            {/* Thermometer Stem */}
            <rect x="14" y="5" width="4" height="15" rx="2" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="1.5" />
            {/* Mercury Bulb in soil */}
            <circle cx="16" cy="22" r="5" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
            <circle cx="16" cy="22" r="2.5" fill="#ffffff" />
            {/* Thermal waves */}
            <path d="M23 10C24 12 24 14 23 16" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M9 10C8 12 8 14 9 16" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 3. Soil pH Logo: Chemistry flask & pH litmus gradient scale
    case 'soil_ph':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-purple-500/30 p-1 ${sizeClasses} ${className}`} title="Soil pH Electrochemical Sensor">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Chemistry Beaker */}
            <path d="M12 5H20M14 5V11L8 23C7.2 24.5 8.2 26 10 26H22C23.8 26 24.8 24.5 24 23L18 11V5" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            {/* pH Solution level */}
            <path d="M10 20C12 18.5 15 21 18 19.5C20 18.5 22 20 22 20L22.8 23H9.2L10 20Z" fill="#a855f7" />
            {/* Text pH */}
            <text x="16" y="16" textAnchor="middle" fill="#7c3aed" fontSize="6" fontWeight="bold" fontFamily="monospace">pH</text>
          </svg>
        </div>
      );

    // 4. Soil EC (Salinity) Logo: Dual electrode with electric ion pulse
    case 'soil_ec':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 p-1 ${sizeClasses} ${className}`} title="Electrical Conductivity (EC) Salinity Sensor">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Electrode pins */}
            <rect x="9" y="6" width="3" height="15" rx="1.5" fill="#0284c7" />
            <rect x="20" y="6" width="3" height="15" rx="1.5" fill="#0284c7" />
            {/* Lightning bolt between electrodes */}
            <path d="M17 11L14 16H18L15 22" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Ion rings */}
            <circle cx="16" cy="16" r="10" stroke="#0891b2" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
          </svg>
        </div>
      );

    // 5. Nitrogen Logo: Nitrogen atom badge with green leaf
    case 'nitrogen':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600/20 to-green-500/10 border border-emerald-600/30 p-1 ${sizeClasses} ${className}`} title="Available Nitrogen (N) Sensor">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Hexagon Nitrogen Molecule */}
            <polygon points="16,4 27,10 27,22 16,28 5,22 5,10" stroke="#16a34a" strokeWidth="1.8" fill="#16a34a" fillOpacity="0.1" />
            {/* Bold N letter */}
            <text x="16" y="20" textAnchor="middle" fill="#15803d" fontSize="12" fontWeight="900" fontFamily="sans-serif">N</text>
            <circle cx="27" cy="10" r="2" fill="#22c55e" />
            <circle cx="5" cy="22" r="2" fill="#22c55e" />
          </svg>
        </div>
      );

    // 6. Phosphorus Logo: Hexagonal crystal lattice with root stimulant symbol
    case 'phosphorus':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 p-1 ${sizeClasses} ${className}`} title="Available Phosphorus (P) Sensor">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <polygon points="16,4 27,10 27,22 16,28 5,22 5,10" stroke="#d97706" strokeWidth="1.8" fill="#d97706" fillOpacity="0.1" />
            <text x="16" y="20" textAnchor="middle" fill="#b45309" fontSize="12" fontWeight="900" fontFamily="sans-serif">P</text>
            <circle cx="16" cy="4" r="2" fill="#f59e0b" />
            <circle cx="16" cy="28" r="2" fill="#f59e0b" />
          </svg>
        </div>
      );

    // 7. Potassium Logo: Shield lattice with stomatal potassium ion symbol
    case 'potassium':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/30 p-1 ${sizeClasses} ${className}`} title="Available Potassium (K) Sensor">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            <polygon points="16,4 27,10 27,22 16,28 5,22 5,10" stroke="#7c3aed" strokeWidth="1.8" fill="#7c3aed" fillOpacity="0.1" />
            <text x="16" y="20" textAnchor="middle" fill="#6d28d9" fontSize="12" fontWeight="900" fontFamily="sans-serif">K</text>
            <circle cx="27" cy="22" r="2" fill="#8b5cf6" />
            <circle cx="5" cy="10" r="2" fill="#8b5cf6" />
          </svg>
        </div>
      );

    // 8. Air Temperature Logo: High precision ambient thermometer in solar louver
    case 'air_temp':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30 p-1 ${sizeClasses} ${className}`} title="Ambient Air Temperature Sensor (SHT31)">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Louver Radiation Shield */}
            <path d="M6 8H26M8 12H24M10 16H22" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
            {/* Thermometer */}
            <path d="M16 6V20" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="24" r="4.5" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
            <circle cx="15" cy="23" r="1.5" fill="white" opacity="0.8" />
          </svg>
        </div>
      );

    // 9. Humidity Logo: Relative humidity hygrometer vapor droplet
    case 'humidity':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-500/10 border border-sky-500/30 p-1 ${sizeClasses} ${className}`} title="Relative Humidity Sensor (SHT31)">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Dual Moisture Droplets */}
            <path d="M14 6C14 6 8 13 8 17.5C8 20.8 10.7 23.5 14 23.5C17.3 23.5 20 20.8 20 17.5C20 13 14 6 14 6Z" fill="#0284c7" opacity="0.85" />
            <path d="M21 14C21 14 17 19 17 22C17 24.2 18.8 26 21 26C23.2 26 25 24.2 25 22C25 19 21 14 21 14Z" fill="#38bdf8" />
            <circle cx="12" cy="17" r="1.5" fill="white" opacity="0.8" />
          </svg>
        </div>
      );

    // 10. Light Intensity (Lux) Logo: Solar radiation photodiode
    case 'light_intensity':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-amber-500/30 p-1 ${sizeClasses} ${className}`} title="Solar Radiation & Luxmeter (BH1750)">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Center Solar Core */}
            <circle cx="16" cy="16" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
            {/* Radiant Rays */}
            <path d="M16 4V7M16 25V28M4 16H7M25 16H28M7.5 7.5L9.6 9.6M22.4 22.4L24.5 24.5M7.5 24.5L9.6 22.4M22.4 9.6L24.5 7.5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <circle cx="15" cy="14" r="1.8" fill="white" opacity="0.8" />
          </svg>
        </div>
      );

    // 11. Rainfall Logo: Tipping bucket rain gauge with precision droplets
    case 'rainfall':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/30 p-1 ${sizeClasses} ${className}`} title="Tipping-Bucket Rain Gauge">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Rain Cloud */}
            <path d="M9 13C9 10.8 10.8 9 13 9C13.6 7.2 15.2 6 17.2 6C19.8 6 22 8.2 22 10.8C23.7 11.2 25 12.7 25 14.5C25 16.7 23.2 18.5 21 18.5H9.5C7.6 18.5 6 16.9 6 15C6 13.3 7.3 12 9 12" fill="#60a5fa" opacity="0.6" stroke="#2563eb" strokeWidth="1.5" />
            {/* Rain Streaks */}
            <line x1="10" y1="21" x2="8" y2="27" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="21" x2="14" y2="27" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
            <line x1="22" y1="21" x2="20" y2="27" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 12. Wind Speed Logo: 3-cup optical anemometer
    case 'wind_speed':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-sky-500/10 border border-teal-500/30 p-1 ${sizeClasses} ${className}`} title="Optical Cup Anemometer">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Center Pivot Axis */}
            <circle cx="16" cy="16" r="3" fill="#0d9488" />
            <line x1="16" y1="16" x2="16" y2="28" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
            {/* 3 Cups revolving */}
            <line x1="16" y1="16" x2="25" y2="12" stroke="#0f766e" strokeWidth="1.8" />
            <path d="M25 8C27 10 27 14 25 16" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="16" x2="7" y2="12" stroke="#0f766e" strokeWidth="1.8" />
            <path d="M7 8C5 10 5 14 7 16" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="16" x2="16" y2="6" stroke="#0f766e" strokeWidth="1.8" />
            <path d="M12 6C14 4 18 4 20 6" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    // 13. Water Tank Reservoir Logo: Cylindrical tank with level graduation
    case 'water_tank_sensor':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-sky-500/10 border border-blue-500/30 p-1 ${sizeClasses} ${className}`} title="Reservoir Hydrostatic Level Transducer">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Tank Shell */}
            <rect x="7" y="6" width="18" height="20" rx="3" stroke="#0284c7" strokeWidth="1.8" fill="#f0f9ff" className="dark:fill-stone-900" />
            {/* Water Fill Level (72%) */}
            <rect x="8" y="12" width="16" height="13" rx="1.5" fill="#38bdf8" opacity="0.8" />
            {/* Graduation Markings */}
            <line x1="10" y1="11" x2="14" y2="11" stroke="#0369a1" strokeWidth="1.5" />
            <line x1="10" y1="16" x2="13" y2="16" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="10" y1="21" x2="14" y2="21" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>
      );

    // 14. Water Flow Rate Logo: Inline Hall turbine rotor
    case 'water_flow_sensor':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 p-1 ${sizeClasses} ${className}`} title="Hall Effect Turbine Flow Sensor">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Pipe Segment */}
            <rect x="4" y="11" width="24" height="10" rx="2" stroke="#059669" strokeWidth="1.8" fill="#ecfdf5" className="dark:fill-stone-900" />
            {/* Spinning Rotor Blades */}
            <circle cx="16" cy="16" r="3" fill="#047857" />
            <line x1="16" y1="12" x2="16" y2="20" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="16" x2="20" y2="16" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
            {/* Directional Flow Arrow */}
            <path d="M22 14L25 16L22 18" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    // 15. Canopy Temp Logo: Infrared thermal foliage sensor
    case 'crop_canopy_temp':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/10 border border-amber-500/30 p-1 ${sizeClasses} ${className}`} title="Infrared Canopy Thermal Sensor">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Leaf */}
            <path d="M7 25C7 25 9 14 19 10C24 8 26 7 26 7C26 7 24 16 17 21C12 25 7 25 7 25Z" fill="#15803d" opacity="0.6" />
            {/* Infrared thermal sensor head */}
            <circle cx="21" cy="9" r="4.5" stroke="#f43f5e" strokeWidth="1.8" fill="#ffe4e6" className="dark:fill-stone-900" />
            <circle cx="21" cy="9" r="2" fill="#e11d48" />
            {/* IR Ray Cone */}
            <path d="M19 12L13 20M22 13L18 22" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        </div>
      );

    // 16. Leaf Wetness Logo: Grid leaf with dew sensor
    case 'leaf_wetness':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-teal-500/10 border border-green-500/30 p-1 ${sizeClasses} ${className}`} title="Leaf Wetness Duration Sensor">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Leaf Outline */}
            <path d="M6 26C6 26 8 11 20 7C25 5 27 5 27 5C27 5 25 15 18 21C12 26 6 26 6 26Z" stroke="#16a34a" strokeWidth="1.8" fill="#dcfce7" className="dark:fill-stone-900" />
            {/* Interdigitated Grid lines */}
            <path d="M11 19L16 14M14 22L20 16" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
            {/* Water Dewdrop */}
            <circle cx="20" cy="11" r="2.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
          </svg>
        </div>
      );

    // 17. Battery / Power Logo: Solar + Battery combo
    case 'battery':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-lime-500/10 border border-emerald-500/30 p-1 ${sizeClasses} ${className}`} title="Node Solar Battery System">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Battery Body */}
            <rect x="6" y="10" width="18" height="12" rx="2" stroke="#16a34a" strokeWidth="1.8" fill="#f0fdf4" className="dark:fill-stone-900" />
            <path d="M25 14V18" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
            {/* Green Charge Bars */}
            <rect x="8" y="12" width="4" height="8" rx="1" fill="#22c55e" />
            <rect x="13" y="12" width="4" height="8" rx="1" fill="#22c55e" />
            <rect x="18" y="12" width="3" height="8" rx="1" fill="#22c55e" />
          </svg>
        </div>
      );

    // 18. Mesh Nodes / LoRa Logo: Broadcast radio waves
    case 'mesh_nodes':
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/30 p-1 ${sizeClasses} ${className}`} title="LoRa 865MHz Gateway & Sensor Mesh">
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
            {/* Antenna Mast */}
            <line x1="16" y1="12" x2="16" y2="27" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="11" r="3" fill="#6366f1" />
            {/* RF Broadcast Waves */}
            <path d="M10 8C7 11 7 15 10 18" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M22 8C25 11 25 15 22 18" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M6 5C2 10 2 18 6 22" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            <path d="M26 5C30 10 30 18 26 22" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`relative flex items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-1 ${sizeClasses} ${className}`}>
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-emerald-600">
            <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M16 11V16L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
  }
};
