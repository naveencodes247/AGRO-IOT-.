import React from 'react';
import { 
  X, 
  Activity, 
  Lightbulb, 
  AlertTriangle, 
  Layers, 
  BookOpen, 
  BarChart3, 
  Camera, 
  Headphones, 
  Cpu, 
  LayoutDashboard, 
  PhoneCall, 
  Droplets, 
  ShieldAlert, 
  Compass, 
  Sparkles,
  Sprout
} from 'lucide-react';
import { AgroIotLogo } from '../common/AgroIotLogo';
import { Language, UserRole } from '../../types';
import { HELPLINE_NUMBER, HELPLINE_TEL_HREF } from '../../services/supportService';

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
  recommendationCount,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { id: 'command-center', labelEn: 'Farm Command Center', labelHi: 'कमांड सेंटर', icon: LayoutDashboard, badge: 'LIVE' },
    { id: 'live-monitoring', labelEn: 'Live Monitoring', labelHi: 'लाइव टेलीमेट्री', icon: Activity },
    { id: 'crop-analyzer', labelEn: 'Crop Scan', labelHi: 'क्रॉप स्कैन', icon: Camera },
    { id: 'edge-ai', labelEn: 'Edge AI Pipeline', labelHi: 'एज एआई', icon: Cpu },
    { id: 'smart-irrigation', labelEn: 'Smart Irrigation', labelHi: 'स्मार्ट सिंचाई', icon: Droplets },
    { id: 'risk-monitor', labelEn: 'Risk Monitor', labelHi: 'जोखिम मॉनिटर', icon: ShieldAlert },
    { id: 'recommendations', labelEn: 'Advisory', labelHi: 'सलाह', icon: Lightbulb, badge: recommendationCount > 0 ? `${recommendationCount}` : undefined },
    { id: 'alerts', labelEn: 'Alert Center', labelHi: 'अलर्ट', icon: AlertTriangle, badge: alertCount > 0 ? `${alertCount}` : undefined },
    { id: 'history', labelEn: 'Analytics', labelHi: 'एनालिटिक्स', icon: BarChart3 },
    { id: 'agri-intelligence', labelEn: 'India Map / Crops', labelHi: 'भारत नक्शा / फसलें', icon: Compass },
    { id: 'technical-info', labelEn: 'System Architecture', labelHi: 'सिस्टम आर्किटेक्चर', icon: Layers },
    { id: 'overview', labelEn: 'Overview / Landing', labelHi: 'ओवरव्यू / लैंडिंग', icon: Sparkles },
    { id: 'customer-support', labelEn: 'Kisan Helpline', labelHi: 'सहायता केंद्र', icon: Headphones },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[85vw] bg-white dark:bg-[#121512] h-full p-4 flex flex-col justify-between shadow-2xl border-r border-stone-200 dark:border-stone-800 z-10 animate-in slide-in-from-left duration-200">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-3">
            <AgroIotLogo size="sm" showText={true} />
            <button
              onClick={onClose}
              className="p-1 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#143e24] dark:bg-[#174328] text-white font-bold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{lang === 'hi' ? item.labelHi : item.labelEn}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-stone-950">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Active Field Card & Helpline */}
        <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
          <div className="p-2 rounded bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-300">
            <div className="flex justify-between items-center text-[10px] text-emerald-600 font-bold mb-0.5">
              <span>ACTIVE FIELD: PLOT ALPHA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>Tomato [Flowering Stage]</div>
          </div>

          <a
            href={HELPLINE_TEL_HREF}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#143e24] dark:bg-emerald-600 text-white text-xs font-bold shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Kisan Helpline: {HELPLINE_NUMBER}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
