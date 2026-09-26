import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Lightbulb, 
  AlertTriangle, 
  Home, 
  Globe, 
  Camera, 
  BarChart3, 
  PhoneCall, 
  Droplets,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  Mic,
  MessageSquare,
  Sparkle
} from 'lucide-react';
import { Language } from '../../types';
import { ASSETS } from '../../assets/assetMap';
import { FarmerAiHelplineModal } from '../common/FarmerAiHelplineModal';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  lang: Language;
  alertCount?: number;
  recommendationCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeCrop?: string;
  activeStage?: string;
  activePlotName?: string;
}

const AI_THOUGHT_HINTS = [
  '🌾 Ask: Wheat leaf yellow spots spray?',
  '🎙️ बोलकर पूछें (Voice Assistant active)',
  '💧 Motor pump auto-cutoff troubleshooting',
  '📡 ESP32 & LoRa 865MHz gateway pairing',
  '🧪 NPK & soil pH fertilizer calculator',
  '🏛️ PM-KUSUM 60% solar subsidy process',
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  lang,
  alertCount = 3,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [autoStartVoice, setAutoStartVoice] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  // Rotate thought bubble prompts smoothly every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setHintIndex(prev => (prev + 1) % AI_THOUGHT_HINTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const openHelpline = (startWithVoice: boolean = false) => {
    setAutoStartVoice(startWithVoice);
    setIsHelplineOpen(true);
  };

  const primaryNavItems = [
    { 
      id: 'command-center', 
      labelEn: 'Command Center', 
      labelHi: 'कमांड सेंटर', 
      icon: LayoutDashboard,
    },
    { 
      id: 'live-monitoring', 
      labelEn: 'Live Monitoring', 
      labelHi: 'लाइव टेलीमेट्री', 
      icon: Activity 
    },
    { 
      id: 'recommendations', 
      labelEn: 'Recommendations', 
      labelHi: 'सलाह व सुझाव', 
      icon: Lightbulb 
    },
    { 
      id: 'alerts', 
      labelEn: 'Alerts', 
      labelHi: 'अलर्ट केंद्र', 
      icon: AlertTriangle,
      badge: alertCount > 0 ? `${alertCount}` : undefined,
      badgeColor: 'bg-[#ef4444] text-white'
    },
    { 
      id: 'farm-info', 
      labelEn: 'Farm Information', 
      labelHi: 'खेत की जानकारी', 
      icon: Home 
    },
    { 
      id: 'agri-intelligence', 
      labelEn: 'Agriculture Intelligence', 
      labelHi: 'कृषि इंटेलिजेंस', 
      icon: Globe 
    },
    { 
      id: 'crop-analyzer', 
      labelEn: 'Crop Analyzer', 
      labelHi: 'क्रॉप विश्लेषक', 
      icon: Camera 
    },
    { 
      id: 'history', 
      labelEn: 'History / Analytics', 
      labelHi: 'इतिहास व विश्लेषण', 
      icon: BarChart3 
    },
    { 
      id: 'customer-support', 
      labelEn: 'Customer Support', 
      labelHi: 'किसान सहायता', 
      icon: PhoneCall 
    },
  ];

  // Secondary/advanced views
  const secondaryNavItems = [
    { id: 'smart-irrigation', labelEn: 'Smart Irrigation', labelHi: 'स्मार्ट सिंचाई', icon: Droplets },
    { id: 'risk-monitor', labelEn: 'Risk Monitor', labelHi: 'जोखिम मॉनिटर', icon: ShieldAlert },
    { id: 'edge-ai', labelEn: 'Edge AI Pipeline', labelHi: 'एज एआई', icon: Cpu },
    { id: 'technical-info', labelEn: 'Architecture', labelHi: 'आर्किटेक्चर', icon: Layers },
    { id: 'overview', labelEn: 'Product Overview', labelHi: 'अवलोकन', icon: Sparkles },
  ];

  return (
    <>
      <aside 
        className={`bg-[#f4f7f5]/90 dark:bg-[#0b100d]/95 text-stone-800 dark:text-stone-100 flex flex-col justify-between flex-shrink-0 select-none z-30 h-screen sticky top-0 border-r border-stone-200/80 dark:border-stone-800/80 shadow-2xl backdrop-blur-2xl transition-[width] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative overflow-hidden ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* ============================================================== */}
        {/* WHOLE LEFT BAR FARMER IMAGE (TOP TO BOTTOM)                    */}
        {/* Harmoniously blends into the website's light and dark palette  */}
        {/* ============================================================== */}
        {!isCollapsed && (
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
            {/* Full-bleed Indian Farmer image spanning entire left bar up to down */}
            <img
              src={ASSETS.farmerBackground}
              alt="Indian Farmer in Field"
              className="w-full h-full object-cover object-[center_20%] opacity-15 dark:opacity-20 mix-blend-multiply dark:mix-blend-luminosity filter contrast-125"
            />
            {/* Organic light/dark gradient overlays matching the exact website surface */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f4f7f5]/95 via-[#f4f7f5]/85 to-[#e9eee9]/95 dark:from-[#0b100d]/95 dark:via-[#0e1a12]/85 dark:to-[#07130b]/98" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f4f7f5]/95 via-transparent to-[#f4f7f5]/85 dark:from-[#0b100d]/95 dark:via-transparent dark:to-[#0b100d]/80" />
            <div className="absolute inset-0 backdrop-blur-[0.5px]" />
          </div>
        )}

        {/* ============================================================== */}
        {/* Top Branding Section + Collapse Toggle Button (z-10)          */}
        {/* ============================================================== */}
        <div className={`p-4 border-b border-stone-200/80 dark:border-stone-800/80 flex items-center relative z-10 transition-colors ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          <button 
            onClick={() => onNavigate('command-center')}
            className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none min-w-0"
            title="Go to Command Center"
          >
            {/* Official AGRO-IoT Circular Logo */}
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md flex-shrink-0 group-hover:scale-105 transition-transform overflow-hidden ring-2 ring-[#0fa958]/50">
              <img 
                src={ASSETS.officialLogo} 
                alt="AGRO-IoT Official Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <div className={`flex flex-col min-w-0 transition-all duration-200 ${
              isCollapsed ? 'opacity-0 w-0 -translate-x-3 pointer-events-none' : 'opacity-100 w-auto translate-x-0'
            }`}>
              <span className="text-lg font-black tracking-tight text-stone-900 dark:text-white leading-tight font-sans truncate">
                AGRO-IOT
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#0fa958] dark:text-[#86efac] truncate">
                SMART FARMING
              </span>
            </div>
          </button>

          {/* Collapsible Toggle Button with spring rotation */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className={`p-1.5 rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-white/10 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer flex-shrink-0 ${
                isCollapsed ? 'mt-2' : ''
              }`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-[#0fa958] dark:text-[#86efac]" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* ============================================================== */}
        {/* Navigation Items: Command Center on Top (z-10)                 */}
        {/* ============================================================== */}
        <div className="px-2.5 py-3 flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-800 relative z-10">
          <nav className="space-y-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const label = lang === 'hi' ? item.labelHi : item.labelEn;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={isCollapsed ? label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left relative group ${
                    isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#0fa958] text-white shadow-md font-bold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-white/[0.08]'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-stone-500 dark:text-stone-400 group-hover:text-[#0fa958]'
                  }`} />

                  <span className={`truncate font-sans whitespace-nowrap transition-all duration-200 ${
                    isCollapsed ? 'opacity-0 w-0 -translate-x-2 pointer-events-none' : 'opacity-100 w-auto translate-x-0 flex-1'
                  }`}>
                    {label}
                  </span>

                  {/* Badge (e.g. Alerts 3) */}
                  {item.badge && (
                    isCollapsed ? (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0b100d]" />
                    ) : (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </nav>

          {/* Secondary section for field tools */}
          <div className={`pt-3 pb-1 border-t border-stone-200/80 dark:border-stone-800/80 mt-2 ${isCollapsed ? 'hidden' : 'block'}`}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 px-3.5 pb-1">
              {lang === 'hi' ? 'विशेष टूल्स' : 'Field Tools'}
            </div>
            <div className="space-y-0.5">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                const label = lang === 'hi' ? item.labelHi : item.labelEn;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#0fa958] text-white font-bold'
                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-80" />
                    <span className="truncate flex-1">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Bottom Section: ANIMATED AI CHATBOT (Replaces Handwritten Text) */}
        {/* Living, breathing interactive Kisan AI assistant presence     */}
        {/* ============================================================== */}
        <div className="relative z-10 mt-auto select-none w-full border-t border-stone-200/80 dark:border-stone-800/80 p-3 bg-stone-100/70 dark:bg-[#080d0a]/90 backdrop-blur-md">
          {!isCollapsed ? (
            <div className="space-y-2.5">
              {/* Dynamic Animated Thought / Speech Bubble */}
              <div 
                onClick={() => openHelpline(false)}
                className="relative px-3 py-2 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-500/30 dark:border-emerald-500/40 shadow-sm cursor-pointer hover:border-emerald-500 transition-all group"
                title="Click to ask AI Assistant"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  <p className="text-[11px] text-stone-700 dark:text-stone-200 font-semibold truncate leading-tight transition-opacity duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {AI_THOUGHT_HINTS[hintIndex]}
                  </p>
                </div>
                {/* Speech Bubble Arrow pointing to the bot below */}
                <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white dark:bg-stone-900 border-b border-r border-emerald-500/30 dark:border-emerald-500/40 transform rotate-45" />
              </div>

              {/* Animated Kisan AI Chatbot Hub Card */}
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-950/20 dark:from-emerald-950/70 dark:to-[#0a2013] border border-emerald-500/30 dark:border-emerald-500/40 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* Animated Bot Avatar with floating pulse */}
                    <div className="relative">
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-white flex items-center justify-center shadow-md animate-bounce" style={{ animationDuration: '3s' }}>
                        <Bot className="w-5 h-5" />
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-stone-900 animate-ping" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-stone-900" />
                    </div>

                    <div>
                      <div className="text-xs font-black text-stone-900 dark:text-white flex items-center gap-1.5">
                        <span>{lang === 'hi' ? 'किसान एआई चैटबॉट' : 'Kisan AI Chatbot'}</span>
                        <Sparkle className="w-3 h-3 text-emerald-500 animate-spin" style={{ animationDuration: '8s' }} />
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <span>Live Voice & Chat Assistant</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two Action Buttons: Speak (Voice) or Chat */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => openHelpline(true)}
                    className="py-1.5 px-2.5 rounded-xl bg-[#0fa958] hover:bg-[#13b963] active:scale-95 text-white font-bold text-[11px] shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Speak with Voice Assistant"
                  >
                    <Mic className="w-3.5 h-3.5 animate-pulse" />
                    <span>{lang === 'hi' ? 'बोलें (Voice)' : 'Speak'}</span>
                  </button>

                  <button
                    onClick={() => openHelpline(false)}
                    className="py-1.5 px-2.5 rounded-xl bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 active:scale-95 text-stone-800 dark:text-stone-200 font-bold text-[11px] border border-stone-200 dark:border-stone-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Open AI Chat Assistant"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{lang === 'hi' ? 'चैट (Chat)' : 'Ask Chat'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed Mode: Animated AI Chatbot Icon in Bottom-Left Corner */
            <div className="py-1 flex flex-col items-center justify-center relative group">
              <button
                onClick={() => openHelpline(false)}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 hover:from-emerald-400 hover:to-green-600 text-white flex flex-col items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer relative ring-2 ring-emerald-400/50 animate-pulse"
                style={{ animationDuration: '4s' }}
                title="Kisan AI Chatbot (Voice & Chat) | किसान एआई चैटबॉट"
                aria-label="Kisan AI Chatbot"
              >
                <Bot className="w-6 h-6 text-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 absolute -top-1 -right-1 ring-2 ring-white dark:ring-[#0b100d] animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1 ring-2 ring-white dark:ring-[#0b100d]" />
              </button>

              {/* Flyout Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-stone-900 text-white text-[11px] font-bold rounded-xl whitespace-nowrap shadow-2xl border border-emerald-500/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                🎙️ Kisan AI Chatbot (Voice & Chat)
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Global Farmer AI Helpline Modal with Voice Assistant & Chat */}
      <FarmerAiHelplineModal
        isOpen={isHelplineOpen}
        onClose={() => setIsHelplineOpen(false)}
        lang={lang}
        autoStartVoice={autoStartVoice}
      />
    </>
  );
};
