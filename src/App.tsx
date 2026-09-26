/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { FarmCommandCenterView } from './views/FarmCommandCenterView';
import { OverviewView } from './views/OverviewView';
import { LiveMonitoringView } from './views/LiveMonitoringView';
import { RecommendationsView } from './views/RecommendationsView';
import { AlertsView } from './views/AlertsView';
import { FarmInformationView } from './views/FarmInformationView';
import { AgricultureIntelligenceView } from './views/AgricultureIntelligenceView';
import { HistoryAnalyticsView } from './views/HistoryAnalyticsView';
import { CropAnalyzerView } from './views/CropAnalyzerView';
import { CustomerSupportView } from './views/CustomerSupportView';
import { ProjectTechnicalView } from './views/ProjectTechnicalView';
import { EdgeAiView } from './views/EdgeAiView';
import { SmartIrrigationView } from './views/SmartIrrigationView';
import { RiskMonitorView } from './views/RiskMonitorView';
import { farmService } from './services/farmService';
import { Language, SimulationScenario, ThemeMode, UserRole } from './types';
import { Modal } from './components/common/Modal';
import { Sprout } from 'lucide-react';
import { AgroIotLogo } from './components/common/AgroIotLogo';
import { HELPLINE_NUMBER, HELPLINE_TEL_HREF } from './services/supportService';

export default function App() {
  // Navigation State - Defaults to the Farm Command Center shown in the reference UI
  const [currentTab, setCurrentTab] = useState<string>('command-center');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Simulation Scenario State ('normal' | 'water_stress' | 'pest_risk' | 'heatwave' | 'disease_risk')
  const [scenario, setScenario] = useState<SimulationScenario>('normal');

  // User Role State ('farmer' | 'coordinator' | 'admin')
  const [userRole, setUserRole] = useState<UserRole>('farmer');

  // Language State ('en' | 'hi')
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('agro_iot_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  // Theme State ('system' | 'light' | 'dark') - Defaults to light mode to match reference screenshot
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('agro_iot_theme');
    return (saved === 'light' || saved === 'dark' || saved === 'system') ? saved : 'light';
  });

  // Farm Data Source Mode ('demo' vs 'empty'/'live')
  const [dataSourceMode, setDataSourceMode] = useState<'demo' | 'empty'>(() => farmService.getMode());

  // Farm data reactive states
  const [farm, setFarm] = useState(() => farmService.getFarm());
  const [readings, setReadings] = useState(() => farmService.getLiveReadings());
  const [recommendations, setRecommendations] = useState(() => farmService.getRecommendations());
  const [alerts, setAlerts] = useState(() => farmService.getAlerts());

  // Connect farm quick modal state
  const [isConnectFarmModalOpen, setIsConnectFarmModalOpen] = useState<boolean>(false);

  // Auto-collapsing header when scrolling down
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);
  const lastScrollTopRef = React.useRef<number>(0);

  const handleMainScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    if (currentScrollTop > lastScrollTopRef.current + 8 && currentScrollTop > 60) {
      // Scrolling down -> smoothly collapse header upward
      setIsHeaderCollapsed(true);
    } else if (currentScrollTop < lastScrollTopRef.current - 8 || currentScrollTop <= 20) {
      // Scrolling up or back near top -> expand header
      setIsHeaderCollapsed(false);
    }
    lastScrollTopRef.current = currentScrollTop;
  };

  // Theme effect - applies .dark and data-theme to documentElement
  useEffect(() => {
    const checkDark = () => {
      if (theme === 'dark') return true;
      if (theme === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const resolved = checkDark();
    if (resolved) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      if (theme === 'system') {
        const sysDark = media.matches;
        if (sysDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [theme]);

  const handleToggleTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('agro_iot_theme', newTheme);
  };

  const handleToggleLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('agro_iot_lang', newLang);
  };

  // Toggle between simulated demo telemetry and waiting for connection
  const handleToggleDemoMode = () => {
    const nextMode = dataSourceMode === 'demo' ? 'empty' : 'demo';
    farmService.setMode(nextMode);
    setDataSourceMode(nextMode);
    setFarm(farmService.getFarm());
    setReadings(farmService.getLiveReadings());
    setRecommendations(farmService.getRecommendations());
    setAlerts(farmService.getAlerts());
  };

  const refreshFarmData = () => {
    setFarm(farmService.getFarm());
    setReadings(farmService.getLiveReadings());
    setRecommendations(farmService.getRecommendations());
    setAlerts(farmService.getAlerts());
  };

  const handleApplyRecommendation = (id: string) => {
    farmService.applyRecommendation(id);
    refreshFarmData();
  };

  const handleAcknowledgeAlert = (id: string) => {
    farmService.acknowledgeAlert(id);
    refreshFarmData();
  };

  const handleResolveAlert = (id: string) => {
    farmService.resolveAlert(id);
    refreshFarmData();
  };

  const handleConnectFarm = (farmData: any) => {
    farmService.connectFarm(farmData);
    setDataSourceMode('demo');
    refreshFarmData();
  };

  const handleAddPlot = (farmId: string, plotData: any) => {
    farmService.addPlot(farmId, plotData);
    refreshFarmData();
  };

  const activeAlertCount = alerts.filter(a => a.status === 'active').length;
  const pendingRecCount = recommendations.filter(r => r.status === 'pending').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f7f5] dark:bg-[#0b100d] text-stone-900 dark:text-stone-100 font-sans selection:bg-[#0fa958] selection:text-white transition-colors duration-150">
      {/* Left Sidebar (Desktop/Tablet - Smoothly Collapsible) */}
      <div className="hidden md:flex flex-shrink-0 h-screen sticky top-0 transition-all duration-300">
        <Sidebar
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          lang={lang}
          alertCount={activeAlertCount}
          recommendationCount={pendingRecCount}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        lang={lang}
        userRole={userRole}
        alertCount={activeAlertCount}
        recommendationCount={pendingRecCount}
      />

      {/* Right: Main Application Area with Sticky Top Header + Scrollable Content */}
      <div 
        className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto scroll-smooth"
        onScroll={handleMainScroll}
      >
        {/* Top Compact Header (Auto-collapses on scroll down) */}
        <Header
          currentTab={currentTab}
          onNavigate={setCurrentTab}
          userRole={userRole}
          onSelectRole={setUserRole}
          lang={lang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
          isLiveMode={dataSourceMode !== 'demo'}
          onToggleLiveMode={handleToggleDemoMode}
          scenario={scenario}
          onSelectScenario={setScenario}
          alertCount={activeAlertCount}
          isCollapsed={isHeaderCollapsed}
        />

        {/* Central Content Area */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-[1600px] w-full mx-auto">
          {/* Tab 1: Farm Command Center (Matches Reference Screenshot) */}
          {currentTab === 'command-center' && (
            <FarmCommandCenterView
              scenario={scenario}
              onNavigate={setCurrentTab}
              lang={lang}
              isLiveMode={dataSourceMode !== 'demo'}
            />
          )}

          {/* Tab 2: Live Monitoring */}
          {currentTab === 'live-monitoring' && (
            <LiveMonitoringView
              farm={farm}
              readings={readings}
              onRefresh={refreshFarmData}
              lang={lang}
              isDemoMode={dataSourceMode === 'demo'}
              onToggleDemoMode={handleToggleDemoMode}
              onConnectFarmModal={() => setIsConnectFarmModalOpen(true)}
            />
          )}

          {/* Tab 3: Crop Scan / Analyzer */}
          {currentTab === 'crop-analyzer' && (
            <CropAnalyzerView lang={lang} />
          )}

          {/* Tab 4: Edge AI Pipeline */}
          {currentTab === 'edge-ai' && (
            <EdgeAiView lang={lang} onNavigate={setCurrentTab} />
          )}

          {/* Tab 5: Smart Irrigation */}
          {currentTab === 'smart-irrigation' && (
            <SmartIrrigationView lang={lang} />
          )}

          {/* Tab 6: Risk Monitor */}
          {currentTab === 'risk-monitor' && (
            <RiskMonitorView
              scenario={scenario}
              onNavigate={setCurrentTab}
              lang={lang}
            />
          )}

          {/* Tab 7: Advisory / Recommendations */}
          {currentTab === 'recommendations' && (
            <RecommendationsView
              recommendations={recommendations}
              onApplyRecommendation={handleApplyRecommendation}
              lang={lang}
              isDemoMode={dataSourceMode === 'demo'}
              onToggleDemoMode={handleToggleDemoMode}
            />
          )}

          {/* Tab 8: Alerts */}
          {currentTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onAcknowledge={handleAcknowledgeAlert}
              onResolve={handleResolveAlert}
              lang={lang}
              isDemoMode={dataSourceMode === 'demo'}
              onToggleDemoMode={handleToggleDemoMode}
            />
          )}

          {/* Tab 9: Farm Info */}
          {currentTab === 'farm-info' && (
            <FarmInformationView
              farm={farm}
              onConnectFarm={handleConnectFarm}
              onAddPlot={handleAddPlot}
              lang={lang}
              isDemoMode={dataSourceMode === 'demo'}
              onToggleDemoMode={handleToggleDemoMode}
            />
          )}

          {/* Tab 10: India Map & Crops */}
          {currentTab === 'agri-intelligence' && (
            <AgricultureIntelligenceView lang={lang} />
          )}

          {/* Tab 11: Analytics & History */}
          {currentTab === 'history' && (
            <HistoryAnalyticsView lang={lang} />
          )}

          {/* Tab 12: Technical Info */}
          {currentTab === 'technical-info' && (
            <ProjectTechnicalView lang={lang} />
          )}

          {/* Tab 13: Customer Support */}
          {currentTab === 'customer-support' && (
            <CustomerSupportView lang={lang} />
          )}

          {/* Tab 14: Overview / Landing */}
          {currentTab === 'overview' && (
            <OverviewView
              farm={farm}
              readings={readings}
              recommendations={recommendations}
              alerts={alerts}
              onNavigate={setCurrentTab}
              lang={lang}
              onToggleDemoMode={handleToggleDemoMode}
              isDemoMode={dataSourceMode === 'demo'}
            />
          )}
        </main>

        {/* Minimal Compact Footer */}
        <footer className="border-t border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#111613] py-3.5 text-xs text-stone-500 dark:text-stone-400 mt-auto">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <AgroIotLogo size="sm" showText={true} />
              <span className="hidden sm:inline text-stone-400">• Smart Farming Platform (India)</span>
            </div>
            <div className="flex items-center gap-4">
              <span>ESP32 + LoRaWAN Telemetry (865 MHz)</span>
              <span>•</span>
              <a href={HELPLINE_TEL_HREF} className="text-[#0fa958] font-bold hover:underline">
                Helpline: {HELPLINE_NUMBER}
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Farm Connect Modal */}
      <Modal
        isOpen={isConnectFarmModalOpen}
        onClose={() => setIsConnectFarmModalOpen(false)}
        title={lang === 'hi' ? 'खेत कनेक्शन विज़ार्ड' : 'Connect Farm Gateway & Device'}
        subtitle="Pair ESP32 / LoRaWAN agricultural field controller"
      >
        <div className="space-y-4 text-xs">
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
            AGRO-IOT detects local Wi-Fi / Bluetooth access points broadcast by ESP32 field gateways.
          </p>
          <div className="p-3.5 rounded-lg bg-stone-100 dark:bg-stone-850 space-y-1 font-mono text-[11px] border border-stone-200 dark:border-stone-700">
            <div>Gateway Identifier: <strong>ESP32-GW-901</strong></div>
            <div>Frequency: LoRa 865 MHz (India ISM Band)</div>
            <div>RSSI Signal: -78 dBm (Strong Connection)</div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsConnectFarmModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleToggleDemoMode();
                setIsConnectFarmModalOpen(false);
              }}
              className="px-4 py-2 rounded-lg bg-[#0fa958] hover:bg-[#13b963] text-white font-bold cursor-pointer"
            >
              Pair Gateway & Load Telemetry
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
