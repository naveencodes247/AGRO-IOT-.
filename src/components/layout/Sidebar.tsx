import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Camera, 
  Cpu, 
  Droplets, 
  ShieldAlert, 
  BarChart3, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  MapPin, 
  Compass, 
  PhoneCall, 
  ChevronRight, 
  ChevronLeft,
  Menu,
  X,
  Radio,
  Sprout
} from 'lucide-react';
import { Language } from '../../types';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  lang: Language;
  alertCount?: number;
  recommendationCount?: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeCrop?: string;
  activeStage?: string;
  activePlotName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  lang,
  alertCount = 0,
  recommendationCount = 0,
  isCollapsed,
  onToggleCollapse,
  activeCrop = 'Tomato',
  activeStage = 'Flowering',
  activePlotName = 'Plot Alpha',
}) => {
  const [liveSeconds, setLiveSeconds] = useState<number>(2);

  // Real-time second counter simulation for the 3-line crop status bar
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSeconds((prev) => (prev >= 15 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { 
      id: 'command-center', 
      labelEn: 'Farm Command Center', 
      labelHi: 'कमांड सेंटर', 
      icon: LayoutDashboard,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500 text-stone-950 font-black'
    },
    { 
      id: 'live-monitoring', 
      labelEn: 'Live Monitoring', 
      labelHi: 'लाइव टेलीमेट्री', 
      icon: Activity 
    },
    { 
      id: 'crop-analyzer', 
      labelEn: 'Crop Scan', 
      labelHi: 'क्रॉप स्कैन', 
      icon: Camera,
      hasDot: true
    },
    { 
      id: 'edge-ai', 
      labelEn: 'Edge AI Pipeline', 
      labelHi: 'एज एआई पाइपलाइन', 
      icon: Cpu 
    },
    { 
      id: 'smart-irrigation', 
      labelEn: 'Smart Irrigation', 
      labelHi: 'स्मार्ट सिंचाई', 
      icon: Droplets 
    },
    { 
      id: 'risk-monitor', 
      labelEn: 'Risk Monitor', 
      labelHi: 'जोखिम मॉनिटर', 
      icon: ShieldAlert 
    },
    { 
      id: 'history', 
      labelEn: 'Analytics', 
      labelHi: 'एनालिटिक्स', 
      icon: BarChart3 
    },
    { 
      id: 'alerts', 
      labelEn: 'Alert Center', 
      labelHi: 'अलर्ट केंद्र', 
      icon: AlertTriangle,
      badge: alertCount > 0 ? `${alertCount}` : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { 
      id: 'technical-info', 
      labelEn: 'System Architecture', 
      labelHi: 'सिस्टम आर्किटेक्चर', 
      icon: Layers 
    },
    { 
      id: 'agri-intelligence', 
      labelEn: 'India Map / Crops', 
      labelHi: 'भारत नक्शा / फसलें', 
      icon: Compass 
    },
    { 
      id: 'overview', 
      labelEn: 'Overview / Landing', 
      labelHi: 'ओवरव्यू / लैंडिंग', 
      icon: Sparkles 
    },
    { 
      id: 'customer-support', 
      labelEn: 'Kisan Helpline', 
      labelHi: 'किसान सहायता', 
      icon: PhoneCall 
    },
  ];

  return (
    <aside 
      className={`hidden lg:flex flex-col justify-between border-r border-stone-200 dark:border-stone-800 bg-[#fbf9f5] dark:bg-[#111311] transition-all duration-200 select-none z-30 sticky top-16 h-[calc(100vh-4rem)] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header Section inside Sidebar */}
      <div className="p-3.5 flex flex-col flex-1 overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200/80 dark:border-stone-800/80">
          {!isCollapsed && (
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-stone-500 dark:text-stone-400">
              FIELD INTELLIGENCE
            </span>
          )}

          {/* 3-LINE COLLAPSE/EXPAND TOGGLE BUTTON */}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer ml-auto transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left relative ${
                  isActive
                    ? 'bg-[#143e24] dark:bg-[#174328] text-white shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-850 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title={isCollapsed ? (lang === 'hi' ? item.labelHi : item.labelEn) : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-emerald-300 dark:text-emerald-400' : 'text-stone-400'
                }`} />

                {!isCollapsed && (
                  <span className="truncate flex-1">
                    {lang === 'hi' ? item.labelHi : item.labelEn}
                  </span>
                )}

                {/* Badge indicator */}
                {!isCollapsed && item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}

                {/* Unread dot */}
                {!isCollapsed && item.hasDot && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-auto" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ============================================================== */}
      {/* 3-LINE REAL-TIME CROP UPDATE WIDGET AT BOTTOM OF SIDEBAR       */}
      {/* ============================================================== */}
      <div className="p-3 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/50">
        {isCollapsed ? (
          <div className="text-center py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          </div>
        ) : (
          <div className="p-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#151916] space-y-1.5 shadow-2xs">
            {/* Line 1: Header + Active Plot Badge */}
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                ACTIVE FIELD
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[9px]">
                {activePlotName.toUpperCase()}
              </span>
            </div>

            {/* Line 2: Farm Name & Subtitle */}
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
              Kisan Shanti Krishi Farm — {activePlotName}
            </div>

            {/* Line 3: Crop Type + Phenological Stage + Real-Time Telemetry Pulse */}
            <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800 text-[11px]">
              <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                <Sprout className="w-3 h-3 text-emerald-600" />
                <span>Crop: <strong>{activeCrop}</strong></span>
                <span className="px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[9px] font-semibold">
                  {activeStage}
                </span>
              </div>
            </div>

            {/* Live Sensor Ping heartbeat */}
            <div className="flex items-center gap-1.5 text-[10px] text-stone-400 pt-0.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Telemetry ping: {liveSeconds}s ago</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
