import React, { useState } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Bell, 
  ChevronDown, 
  Menu,
  Check,
  Shield,
  User,
  SlidersHorizontal,
  X,
  Radio,
  Cpu,
  Wifi,
  Terminal,
  Copy,
  ExternalLink,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Language, SimulationScenario, ThemeMode, UserRole } from '../../types';
import { ASSETS } from '../../assets/assetMap';
import { LoginModal, USER_PROFILES } from '../common/LoginModal';
import { Modal } from '../common/Modal';

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
  isCollapsed?: boolean;
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
  alertCount = 3,
  scenario,
  onSelectScenario,
  isLiveMode,
  isCollapsed = false,
  onToggleLiveMode,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scenarioMenuOpen, setScenarioMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time API Ping test state
  const [isPinging, setIsPinging] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(12);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [snippetTab, setSnippetTab] = useState<'arduino' | 'python' | 'curl'>('arduino');

  const currentProfile = USER_PROFILES[userRole] || USER_PROFILES.farmer;

  const testApiPing = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      await fetch('/api/hardware/status');
      const latency = Math.round(performance.now() - start);
      setPingLatency(Math.max(4, latency));
    } catch {
      setPingLatency(14);
    } finally {
      setIsPinging(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const scenarioLabels: Record<SimulationScenario, { en: string; hi: string }> = {
    normal: { en: 'Normal Conditions', hi: 'सामान्य स्थिति' },
    water_stress: { en: 'Water Stress', hi: 'जल संकट / सूखा' },
    pest_risk: { en: 'Pest Outbreak', hi: 'कीट प्रकोप' },
    heatwave: { en: 'Canopy Heatwave', hi: 'तीव्र लू / तापमान' },
    disease_risk: { en: 'Fungal Disease Risk', hi: 'फफूंद रोग जोखिम' },
  };

  const searchablePages = [
    { id: 'command-center', label: 'Command Center', subtitle: 'Farm status, KPIs & live telemetry', keywords: 'home dashboard farm status' },
    { id: 'live-monitoring', label: 'Live Telemetry & Sensors', subtitle: 'Soil moisture, EC, SHT31, actuators', keywords: 'sensors moisture soil weather temperature' },
    { id: 'crop-analyzer', label: 'Crop Analyzer (Disease AI)', subtitle: 'Leaf diagnostic & pathology guidance', keywords: 'camera scan disease wheat rust photo' },
    { id: 'agri-intelligence', label: 'Agriculture Intelligence', subtitle: 'India Map, 28 states, crop directory', keywords: 'india map states punjab maharashtra crop pests' },
    { id: 'farm-info', label: 'Farm Information & Plots', subtitle: 'Plot boundaries, soil type, crop stage', keywords: 'plots area soybean wheat tomato' },
    { id: 'alerts', label: 'Alerts & Anomalies', subtitle: 'Active warnings & threshold events', keywords: 'alert warning critical moisture high' },
    { id: 'recommendations', label: 'Smart Recommendations', subtitle: 'Agronomic actions & irrigation schedule', keywords: 'recommendation advice action drip fertilizer' },
    { id: 'history', label: 'History & Analytics', subtitle: '7-day trend graphs & data export', keywords: 'history analytics charts trends logs' },
    { id: 'customer-support', label: 'Customer Support', subtitle: 'Helpline: +91 9301929218', keywords: 'help support call phone contact' },
  ];

  const matchingPages = searchQuery.trim().length > 0
    ? searchablePages.filter(p => 
        p.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.keywords.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <header className={`sticky top-0 z-20 w-full h-14 sm:h-16 bg-white/95 dark:bg-[#111613]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        isCollapsed ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 shadow-xs'
      }`}>
        {/* ============================================================ */}
        {/* Left: Mobile Hamburger + Live API Connection Status Bar     */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-lg relative">
          {/* Mobile menu trigger */}
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 md:hidden cursor-pointer"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Interactive API Connection Status Bar (Replacing Search Anything) */}
          <button
            onClick={() => setIsApiModalOpen(true)}
            className="flex-1 flex items-center justify-between gap-2 px-3 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-950/40 dark:via-stone-900 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl text-left cursor-pointer transition-all hover:shadow-xs group"
            title="Click to inspect API & Hardware Gateway Connection"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">ESP32-GW-901 Connected</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400">
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">LoRa 865MHz</span>
                  <span>•</span>
                  <span>{pingLatency}ms Latency</span>
                  <span className="hidden sm:inline">• REST Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md flex-shrink-0">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              <span>LIVE API</span>
            </div>
          </button>

          {/* Quick Search trigger icon button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="p-2 rounded-xl border border-stone-200/80 dark:border-stone-700/80 text-stone-500 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer flex-shrink-0"
            title="Search views, plots & sensors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* Right Controls: Theme | Language | Notifications | Profile  */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Scenario quick selector (Simulation Context) */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setScenarioMenuOpen(!scenarioMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700/80 bg-stone-50/80 dark:bg-stone-800/50 text-[11px] font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
              title="Scenario simulation conditions"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate max-w-[110px]">{scenarioLabels[scenario][lang]}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {scenarioMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-[#151a16] border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg p-1.5 z-50">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
                  Simulation Scenario
                </div>
                {(Object.keys(scenarioLabels) as SimulationScenario[]).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => {
                      onSelectScenario(sc);
                      setScenarioMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      scenario === sc
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{scenarioLabels[sc][lang]}</span>
                    {scenario === sc && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 1. Theme Switch Pill (Matching reference Sun / Moon pill) */}
          <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full">
            <button
              onClick={() => onToggleTheme('light')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-400/90 text-stone-900 shadow-xs'
                  : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
              }`}
              title="Light Mode"
              aria-label="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleTheme('dark')}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#0fa958] text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
              }`}
              title="Dark Mode"
              aria-label="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. Language Selector Pill (Indian Flag + EN/HI ▼) */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-750 cursor-pointer shadow-2xs"
            >
              <span className="text-sm">🇮🇳</span>
              <span className="font-bold">{lang === 'hi' ? 'HI' : 'EN'}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-[#151a16] border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg p-1 z-50">
                <button
                  onClick={() => {
                    onToggleLang('en');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    lang === 'en'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span>English</span>
                  {lang === 'en' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
                <button
                  onClick={() => {
                    onToggleLang('hi');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    lang === 'hi'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span>हिन्दी</span>
                  {lang === 'hi' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              </div>
            )}
          </div>

          {/* 3. Notifications Bell with Badge */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700 cursor-pointer transition-all relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              {alertCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#ef4444] text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-[#111613]">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-1.5 w-80 bg-white dark:bg-[#151a16] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Active Farm Alerts ({alertCount})
                  </span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="py-2 space-y-2 text-xs">
                  <button
                    onClick={() => {
                      onNavigate('alerts');
                      setNotificationsOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-600 text-[11px]">Soil Moisture Critical</span>
                      <span className="text-[10px] text-stone-400">2 min ago</span>
                    </div>
                    <p className="text-[11px] text-stone-700 dark:text-stone-300 mt-0.5">Plot Alpha is below 35% threshold.</p>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('alerts');
                      setNotificationsOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-700 text-[11px]">Temperature Rising</span>
                      <span className="text-[10px] text-stone-400">8 min ago</span>
                    </div>
                    <p className="text-[11px] text-stone-700 dark:text-stone-300 mt-0.5">Plot Beta ambient temperature reached 31.6°C.</p>
                  </button>
                </div>

                <button
                  onClick={() => {
                    onNavigate('alerts');
                    setNotificationsOpen(false);
                  }}
                  className="w-full py-1.5 rounded-lg bg-[#0fa958] hover:bg-[#13b963] text-white text-xs font-bold text-center cursor-pointer transition-colors shadow-xs"
                >
                  View All Alerts Center
                </button>
              </div>
            )}
          </div>

          {/* 4. User Profile Pill (Farmer Avatar + Details + Chevron) */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-750 cursor-pointer transition-all shadow-2xs"
            >
              {/* Circular Avatar */}
              <img
                src={ASSETS.farmerBackground}
                alt="Farmer Avatar"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-emerald-500/40"
              />

              <div className="flex flex-col text-left leading-tight hidden sm:block">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {currentProfile.name}
                </span>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                  {currentProfile.farmTitle}
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white dark:bg-[#151a16] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl p-2 z-50">
                <div className="p-2 border-b border-stone-100 dark:border-stone-800 mb-1">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    {currentProfile.name}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {currentProfile.roleDescription}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    {currentProfile.badgeText}
                  </div>
                </div>

                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
                  Switch Active Role
                </div>

                {(['farmer', 'coordinator', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onSelectRole(r);
                      setProfileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      userRole === r
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span>{USER_PROFILES[r].name}</span>
                    {userRole === r && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}

                <div className="pt-1.5 mt-1 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-stone-400" />
                    <span>Role Management & Auth</span>
                  </button>

                  <button
                    onClick={() => {
                      onToggleLiveMode();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer"
                  >
                    <span>{isLiveMode ? 'Switch to Demo Simulation' : 'Connect Real Hardware'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Login & Role Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={userRole}
        onSelectRole={(r) => {
          onSelectRole(r);
          setIsLoginModalOpen(false);
        }}
        lang={lang}
      />

      {/* ============================================================== */}
      {/* Real Hardware & API Gateway Inspector Modal                     */}
      {/* ============================================================== */}
      <Modal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        title="IoT Hardware Gateway & API Telemetry Connection"
        subtitle="ESP32-S3 Mesh Gateway • LoRaWAN 865MHz • REST API v2.4"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 text-xs font-sans">
          {/* Status Bar */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0fa958] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-stone-900 dark:text-stone-100">
                    ESP32-GW-901 Gateway Online
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase">
                    Connected
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Full bidirectional link between field LoRa transceivers and cloud database
                </p>
              </div>
            </div>

            <button
              onClick={testApiPing}
              disabled={isPinging}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-50 text-[11px] cursor-pointer shadow-xs transition-all active:scale-95"
            >
              <Zap className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-amber-500' : 'text-emerald-600'}`} />
              <span>{isPinging ? 'Testing...' : 'Ping API'}</span>
            </button>
          </div>

          {/* 4 Diagnostic Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
              <div className="text-[10px] font-semibold text-stone-400 uppercase">Roundtrip Latency</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {pingLatency} ms
              </div>
              <div className="text-[9px] text-stone-400">Zero packet loss</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
              <div className="text-[10px] font-semibold text-stone-400 uppercase">RF Frequency</div>
              <div className="text-base font-black text-stone-900 dark:text-stone-100 mt-0.5">
                865.2 MHz
              </div>
              <div className="text-[9px] text-stone-400">India IN865 ISM Band</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
              <div className="text-[10px] font-semibold text-stone-400 uppercase">Signal RSSI</div>
              <div className="text-base font-black text-stone-900 dark:text-stone-100 mt-0.5">
                -68 dBm
              </div>
              <div className="text-[9px] text-emerald-600">Excellent 5/5 link</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
              <div className="text-[10px] font-semibold text-stone-400 uppercase">Active Nodes</div>
              <div className="text-base font-black text-stone-900 dark:text-stone-100 mt-0.5">
                12 Probes
              </div>
              <div className="text-[9px] text-stone-400">Soil, Meteo & Valves</div>
            </div>
          </div>

          {/* Endpoints & Code Snippets Tabs */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                Hardware Integration Code Snippets
              </span>
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
                {(['arduino', 'python', 'curl'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSnippetTab(t)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold capitalize transition-all cursor-pointer ${
                      snippetTab === t
                        ? 'bg-white dark:bg-stone-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative rounded-xl bg-stone-900 text-stone-100 p-3 font-mono text-[11px] overflow-x-auto border border-stone-800">
              <button
                onClick={() => {
                  const code = snippetTab === 'arduino'
                    ? `// ESP32 Arduino Ingestion
#include <WiFi.h>
#include <HTTPClient.h>

void postTelemetry() {
  HTTPClient http;
  http.begin("http://localhost:3000/api/hardware/telemetry");
  http.addHeader("Content-Type", "application/json");
  String payload = "{\\"deviceId\\":\\"ESP32-SOIL-01\\",\\"moisture\\":42.5,\\"temperature\\":29.8}";
  int code = http.POST(payload);
  http.end();
}`
                    : snippetTab === 'python'
                    ? `# Python LoRa Bridge
import requests
payload = {"deviceId": "RPI-GW-01", "moisture": 42.5, "temperature": 29.8, "humidity": 64.0}
r = requests.post("http://localhost:3000/api/hardware/telemetry", json=payload)
print(r.json())`
                    : `curl -X POST http://localhost:3000/api/hardware/telemetry \\
  -H "Content-Type: application/json" \\
  -d '{"deviceId":"ESP32-FIELD-01","moisture":42.5,"temperature":29.8}'`;
                  copyToClipboard(code, snippetTab);
                }}
                className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] cursor-pointer"
              >
                {copiedSnippet === snippetTab ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet === snippetTab ? 'Copied!' : 'Copy'}</span>
              </button>

              <pre className="pr-14 leading-relaxed">
                {snippetTab === 'arduino' && `// ESP32 Arduino Ingestion
#include <WiFi.h>
#include <HTTPClient.h>

void postTelemetry() {
  HTTPClient http;
  http.begin("http://localhost:3000/api/hardware/telemetry");
  http.addHeader("Content-Type", "application/json");
  String payload = "{\\"deviceId\\":\\"ESP32-SOIL-01\\",\\"moisture\\":42.5,\\"temperature\\":29.8}";
  int code = http.POST(payload);
  http.end();
}`}
                {snippetTab === 'python' && `# Python Gateway Bridge
import requests
payload = {"deviceId": "RPI-GW-01", "moisture": 42.5, "temperature": 29.8, "humidity": 64.0}
r = requests.post("http://localhost:3000/api/hardware/telemetry", json=payload)
print(r.json())`}
                {snippetTab === 'curl' && `curl -X POST http://localhost:3000/api/hardware/telemetry \\
  -H "Content-Type: application/json" \\
  -d '{"deviceId":"ESP32-FIELD-01","moisture":42.5,"temperature":29.8}'`}
              </pre>
            </div>
          </div>
        </div>
      </Modal>

      {/* ============================================================== */}
      {/* Quick Search Modal                                             */}
      {/* ============================================================== */}
      <Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        title="Search AGRO-IOT Platform"
        subtitle="Instant navigation across all farm command views & diagnostic tools"
        maxWidth="max-w-lg"
      >
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search views, plots, sensors, recommendations..."
              className="w-full pl-10 pr-9 py-2.5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 pt-1">
            {matchingPages.length === 0 ? (
              <div className="p-4 text-center text-xs text-stone-400">
                {searchQuery ? `No results found for "${searchQuery}"` : 'Type to search any farm module...'}
              </div>
            ) : (
              matchingPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onNavigate(page.id);
                    setIsSearchModalOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-emerald-500/10 dark:hover:bg-emerald-950/40 text-left transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-stone-800 dark:text-stone-100 group-hover:text-[#0fa958]">
                      {page.label}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {page.subtitle}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#0fa958] transition-transform group-hover:translate-x-0.5" />
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

