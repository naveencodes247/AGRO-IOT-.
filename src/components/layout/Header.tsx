import React, { useState } from 'react';
import { 
  Sprout, 
  Globe, 
  Sun, 
  Moon, 
  Laptop, 
  PhoneCall, 
  UserCheck, 
  ChevronDown, 
  Menu,
  Wifi,
  Cpu,
  Radio,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Bell,
  User,
  Shield,
  Building2
} from 'lucide-react';
import { AgroIotLogo } from '../common/AgroIotLogo';
import { Language, SimulationScenario, ThemeMode, UserRole } from '../../types';
import { HELPLINE_NUMBER, HELPLINE_TEL_HREF } from '../../services/supportService';
import { LoginModal, USER_PROFILES } from '../common/LoginModal';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
  theme: ThemeMode;
  onToggleTheme: (theme: ThemeMode) => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  isLiveMode: boolean;
  onToggleLiveMode: () => void;
  scenario: SimulationScenario;
  onSelectScenario: (sc: SimulationScenario) => void;
  alertCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  userRole,
  onSelectRole,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  onToggleMobileMenu,
  isLiveMode,
  onToggleLiveMode,
  scenario,
  onSelectScenario,
  alertCount = 0,
}) => {
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const scenarioLabels: Record<SimulationScenario, { en: string; hi: string }> = {
    normal: { en: 'Normal Conditions', hi: 'सामान्य स्थिति' },
    water_stress: { en: 'Water Stress', hi: 'जल संकट / सूखा' },
    pest_risk: { en: 'Pest Outbreak', hi: 'कीट प्रकोप' },
    heatwave: { en: 'Canopy Heatwave', hi: 'तीव्र लू / तापमान' },
    disease_risk: { en: 'Fungal Disease Risk', hi: 'फफूंद रोग जोखिम' },
  };

  const currentProfile = USER_PROFILES[userRole] || USER_PROFILES.farmer;

  return (
    <>
      <header className="sticky top-0 z-40 w-full font-sans border-b border-stone-200 dark:border-stone-800 bg-[#fbf9f5] dark:bg-[#111311] transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-3">
          {/* ============================================================ */}
          {/* Left: 3-line Hamburger + Brand Logo                         */}
          {/* ============================================================ */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="p-1.5 rounded-md text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Toggle Navigation Menu"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button 
              onClick={() => onNavigate('command-center')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <AgroIotLogo size="sm" showText={true} />
            </button>
          </div>

          {/* ============================================================ */}
          {/* Center: Real Hardware & Engine Status Pills (From Screenshot) */}
          {/* ============================================================ */}
          <div className="hidden xl:flex items-center gap-2 text-[11px]">
            {/* API: ONLINE */}
            <div className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-[#161a17] border border-stone-200 dark:border-stone-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-bold text-stone-700 dark:text-stone-300">API: ONLINE</span>
            </div>

            {/* HARDWARE: CONNECTED (WiFi • 32ms) */}
            <div className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-[#161a17] border border-stone-200 dark:border-stone-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-stone-700 dark:text-stone-300">HARDWARE: CONNECTED</span>
              <span className="font-mono text-[10px] text-stone-500 px-1 py-0.2 rounded bg-stone-200 dark:bg-stone-800">
                WiFi • 32ms
              </span>
            </div>

            {/* Edge AI: ACTIVE (Local On-Device • 84ms) */}
            <div className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-[#161a17] border border-stone-200 dark:border-stone-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="font-bold text-stone-700 dark:text-stone-300">Edge AI: ACTIVE</span>
              <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400 px-1 py-0.2 rounded bg-cyan-500/10">
                Local On-Device • 84ms
              </span>
            </div>

            {/* Decision Engine: Synchronized */}
            <div className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-[#161a17] border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
              <RefreshCw className="w-3 h-3 text-emerald-500" />
              <span>Decision Engine: Synchronized</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Right: SINGLE LOGIN BUTTON, SCENARIOS, DEMO/LIVE, THEME, LANG */}
          {/* ============================================================ */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* REQUIREMENT 1: SINGLE LOGIN BUTTON FOR FARMER, COORDINATOR, ADMIN */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-[#161a17] hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-750 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-stone-800 dark:text-stone-200 shadow-2xs group transition-all"
              title="Farmer, Coordinator & Admin Login Portal"
            >
              <div className={`w-2 h-2 rounded-full ${
                userRole === 'farmer' ? 'bg-emerald-500' : userRole === 'coordinator' ? 'bg-blue-500' : 'bg-purple-500'
              } animate-pulse`} />
              
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs">
                  {lang === 'hi' 
                    ? (userRole === 'farmer' ? 'रामेश्वर (किसान)' : userRole === 'coordinator' ? 'डॉ. सुनीता (समन्वयक)' : 'एडमिन (प्रशासक)')
                    : (userRole === 'farmer' ? 'Rameshwar (Farmer)' : userRole === 'coordinator' ? 'Dr. Sunita (Coord)' : 'ICAR Admin')}
                </span>
                <span className={`hidden sm:inline-block px-1 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                  userRole === 'farmer'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : userRole === 'coordinator'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                }`}>
                  {userRole}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
            </button>

            {/* SCENARIO DROPDOWN (Matches Screenshot) */}
            <div className="relative">
              <button
                onClick={() => setScenarioDropdownOpen(!scenarioDropdownOpen)}
                className="px-2.5 py-1 rounded-md bg-stone-100 dark:bg-[#161a17] hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-750 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-stone-800 dark:text-stone-200 shadow-2xs"
                title="Test Agricultural Field Scenarios"
              >
                <Sliders className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[11px] text-stone-400 font-mono hidden md:inline">SCENARIO:</span>
                <span className="font-bold text-xs truncate max-w-[100px] sm:max-w-none">
                  {scenarioLabels[scenario][lang]}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {scenarioDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-56 py-1 bg-white dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-750 z-50 text-xs"
                  onMouseLeave={() => setScenarioDropdownOpen(false)}
                >
                  <div className="px-3 py-1 font-mono text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 dark:border-stone-800">
                    Select Simulation Scenario
                  </div>
                  {(Object.keys(scenarioLabels) as SimulationScenario[]).map((scKey) => (
                    <button
                      key={scKey}
                      onClick={() => {
                        onSelectScenario(scKey);
                        setScenarioDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer ${
                        scenario === scKey
                          ? 'font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span>{scenarioLabels[scKey][lang]}</span>
                      {scenario === scKey && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PROMINENT LIVE / DEMO TOGGLE BUTTON (From Screenshot) */}
            <div className="flex items-center p-0.5 rounded-md bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => {
                  if (isLiveMode) onToggleLiveMode();
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                  !isLiveMode
                    ? 'bg-amber-500 text-stone-950 shadow-2xs font-black'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                DEMO
              </button>
              <button
                onClick={() => {
                  if (!isLiveMode) onToggleLiveMode();
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                  isLiveMode
                    ? 'bg-emerald-600 text-white shadow-2xs font-black'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isLiveMode ? 'bg-white animate-pulse' : 'bg-stone-400'}`} />
                <span>LIVE</span>
              </button>
            </div>

            {/* Alert Bell Icon with Count */}
            <button
              onClick={() => onNavigate('alerts')}
              className="p-1.5 rounded-md text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 relative cursor-pointer"
              title="Alert Center"
            >
              <Bell className="w-4 h-4" />
              {alertCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => onToggleLang(lang === 'en' ? 'hi' : 'en')}
              className="px-2 py-1 rounded-md text-[10px] font-bold bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 cursor-pointer flex items-center gap-1"
              title="Switch Language"
            >
              <Globe className="w-3 h-3 text-emerald-600" />
              <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
            </button>

            {/* Functional Theme Mode Button */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-1.5 rounded-md bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 cursor-pointer"
                title={`Theme: ${theme.toUpperCase()}`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-amber-400" />
                ) : theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Laptop className="w-4 h-4 text-emerald-600" />
                )}
              </button>

              {themeMenuOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-32 py-1 bg-white dark:bg-stone-900 rounded-md shadow-xl border border-stone-200 dark:border-stone-750 z-50 text-xs"
                  onMouseLeave={() => setThemeMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      onToggleTheme('light');
                      setThemeMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => {
                      onToggleTheme('dark');
                      setThemeMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => {
                      onToggleTheme('system');
                      setThemeMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <Laptop className="w-3.5 h-3.5 text-stone-400" />
                    <span>System</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Login Modal for Farmer, Coordinator & Admin */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={userRole}
        onSelectRole={onSelectRole}
        lang={lang}
      />
    </>
  );
};
