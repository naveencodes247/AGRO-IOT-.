import React, { useState } from 'react';
import { 
  X, 
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
  Bot,
  Mic,
  MessageSquare
} from 'lucide-react';
import { Language, UserRole } from '../../types';
import { HELPLINE_NUMBER, HELPLINE_TEL_HREF } from '../../services/supportService';
import { ASSETS } from '../../assets/assetMap';
import { FarmerAiHelplineModal } from '../common/FarmerAiHelplineModal';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onNavigate: (tab: string) => void;
  lang: Language;
  userRole: UserRole;
  alertCount: number;
  recommendationCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentTab,
  onNavigate,
  lang,
  alertCount,
}) => {
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [autoStartVoice, setAutoStartVoice] = useState(false);

  if (!isOpen) return null;

  const openHelpline = (startWithVoice: boolean = false) => {
    setAutoStartVoice(startWithVoice);
    setIsHelplineOpen(true);
  };

  const primaryNavItems = [
    { id: 'command-center', labelEn: 'Command Center', labelHi: 'कमांड सेंटर', icon: LayoutDashboard },
    { id: 'live-monitoring', labelEn: 'Live Monitoring', labelHi: 'लाइव टेलीमेट्री', icon: Activity },
    { id: 'recommendations', labelEn: 'Recommendations', labelHi: 'सलाह व सुझाव', icon: Lightbulb },
    { id: 'alerts', labelEn: 'Alerts', labelHi: 'अलर्ट केंद्र', icon: AlertTriangle, badge: alertCount > 0 ? `${alertCount}` : undefined },
    { id: 'farm-info', labelEn: 'Farm Information', labelHi: 'खेत की जानकारी', icon: Home },
    { id: 'agri-intelligence', labelEn: 'Agriculture Intelligence', labelHi: 'कृषि इंटेलिजेंस', icon: Globe },
    { id: 'crop-analyzer', labelEn: 'Crop Analyzer', labelHi: 'क्रॉप विश्लेषक', icon: Camera },
    { id: 'history', labelEn: 'History / Analytics', labelHi: 'इतिहास व विश्लेषण', icon: BarChart3 },
    { id: 'customer-support', labelEn: 'Customer Support', labelHi: 'किसान सहायता', icon: PhoneCall },
  ];

  const secondaryNavItems = [
    { id: 'smart-irrigation', labelEn: 'Smart Irrigation', labelHi: 'स्मार्ट सिंचाई', icon: Droplets },
    { id: 'risk-monitor', labelEn: 'Risk Monitor', labelHi: 'जोखिम मॉनिटर', icon: ShieldAlert },
    { id: 'edge-ai', labelEn: 'Edge AI Pipeline', labelHi: 'एज एआई', icon: Cpu },
    { id: 'technical-info', labelEn: 'Architecture', labelHi: 'सिस्टम आर्किटेक्चर', icon: Layers },
    { id: 'overview', labelEn: 'Product Overview', labelHi: 'उत्पाद परिचय', icon: Sparkles },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 md:hidden flex">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" 
          onClick={onClose} 
        />

        {/* Drawer Container (Obsidian Slate with Full-Bleed Farmer Background) */}
        <div className="relative w-72 max-w-[85vw] bg-[#0f141c] text-slate-100 h-full p-4 flex flex-col justify-between shadow-2xl border-r border-slate-800/80 z-10 animate-in slide-in-from-left duration-200 overflow-hidden">
          {/* Full-bleed Farmer Background image */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
            <img
              src={ASSETS.farmerBackground}
              alt=""
              className="w-full h-full object-cover object-[center_20%] opacity-20 mix-blend-luminosity filter contrast-125 saturate-0"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f141c]/95 via-[#0f141c]/85 to-[#090d14]/98" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f141c]/95 via-transparent to-[#0f141c]/80" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center flex-shrink-0 overflow-hidden ring-1 ring-emerald-500">
                  <img src={ASSETS.officialLogo} alt="Logo" className="w-full h-full object-contain rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-tight text-white leading-tight">
                    AGRO-IOT
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-400">
                    SMART FARMING
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{lang === 'hi' ? item.labelHi : item.labelEn}</span>
                    </div>
                    {item.badge ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[#ef4444] text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}

              <div className="pt-2 pb-1 border-t border-slate-800/80 mt-2">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1">
                  {lang === 'hi' ? 'विशेष टूल्स' : 'Field Tools'}
                </div>
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-80" />
                      <span>{lang === 'hi' ? item.labelHi : item.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom AI Helpline & Call Buttons */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2 relative z-10">
            {/* AI Helpline Voice/Chat Trigger */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-white">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'hi' ? 'किसान एआई हेल्पलाइन' : 'Kisan AI Helpline'}</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">Live</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => openHelpline(true)}
                  className="py-1 px-2 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center gap-1"
                >
                  <Mic className="w-3 h-3" />
                  <span>{lang === 'hi' ? 'बोलें' : 'Speak'}</span>
                </button>
                <button
                  onClick={() => openHelpline(false)}
                  className="py-1 px-2 rounded-lg bg-slate-800 text-slate-200 font-bold text-[10px] flex items-center justify-center gap-1 border border-slate-700"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'hi' ? 'चैट' : 'Chat'}</span>
                </button>
              </div>
            </div>

            <a
              href={HELPLINE_TEL_HREF}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call Helpline: {HELPLINE_NUMBER}</span>
            </a>
          </div>
        </div>
      </div>

      <FarmerAiHelplineModal
        isOpen={isHelplineOpen}
        onClose={() => setIsHelplineOpen(false)}
        lang={lang}
        autoStartVoice={autoStartVoice}
      />
    </>
  );
};
