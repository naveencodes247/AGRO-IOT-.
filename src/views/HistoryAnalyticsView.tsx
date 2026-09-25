import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Droplets, 
  Thermometer, 
  Wind, 
  Activity, 
  Clock, 
  Download, 
  ChevronRight,
  Database
} from 'lucide-react';
import { Language } from '../types';
import { analyticsService, HistoricalPoint } from '../services/analyticsService';
import { DemoBadge } from '../components/common/DemoBadge';
import { EmptyState } from '../components/common/EmptyState';

interface HistoryAnalyticsViewProps {
  lang: Language;
}

export const HistoryAnalyticsView: React.FC<HistoryAnalyticsViewProps> = ({ lang }) => {
  const [dataMode, setDataMode] = useState<'empty' | 'demo'>('empty');
  const [metricTab, setMetricTab] = useState<'moisture' | 'temp' | 'humidity' | 'irrigation'>('moisture');

  const historyRecords: HistoricalPoint[] = analyticsService.getHistoricalData(dataMode);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {lang === 'hi' ? 'खेत इतिहास एवं समय-शृंखला विश्लेषण' : 'Farm History & Temporal Analytics'}
            </h2>
            <DemoBadge 
              mode={dataMode === 'demo' ? 'demo' : 'waiting'} 
              onToggleMode={() => setDataMode(dataMode === 'demo' ? 'empty' : 'demo')}
            />
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {lang === 'hi'
              ? 'मृदा नमी, तापमान, आर्द्रता, सिंचाई चक्र और फसल स्वास्थ्य का बहु-दिवसीय विश्लेषण'
              : 'Multi-day sensor records, irrigation runtimes, and health index trajectories'}
          </p>
        </div>

        {/* Data Mode Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDataMode(dataMode === 'empty' ? 'demo' : 'empty')}
            className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-50 text-xs font-semibold cursor-pointer transition-colors"
          >
            {dataMode === 'empty' ? 'View Demo Telemetry Dataset' : 'Switch to Clean Empty State'}
          </button>
        </div>
      </div>

      {dataMode === 'empty' ? (
        <EmptyState
          icon={BarChart3}
          badge="WAITING FOR CONTINUOUS TELEMETRY"
          title={lang === 'hi' ? 'कोई ऐतिहासिक खेत डेटा उपलब्ध नहीं है' : 'No Historical Farm Data Available Yet'}
          description={lang === 'hi'
            ? 'सेंसर नोड्स कनेक्ट होने के बाद 24 घंटे के भीतर दैनिक औसत, सिंचाई लॉग और नमी वक्र यहां संचित होना शुरू हो जाएंगे।'
            : 'Once your field sensor nodes operate continuously, 24-hour diurnal curves, water depletion rates, and irrigation cycles will record here.'}
          actionLabel={lang === 'hi' ? 'डेमो चार्ट पूर्वावलोकन देखें' : 'Preview Demo Analytics Charts'}
          onAction={() => setDataMode('demo')}
        />
      ) : (
        <div className="space-y-6">
          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {[
              { id: 'moisture', label: 'Soil Moisture Curve (15cm vs 30cm)' },
              { id: 'temp', label: 'Diurnal Temperature' },
              { id: 'humidity', label: 'Relative Humidity' },
              { id: 'irrigation', label: 'Irrigation Runtime Hours' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMetricTab(tab.id as any)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  metricTab === tab.id
                    ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Visual Trend Chart Canvas */}
          <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  7-Day Trend Analysis ({metricTab.toUpperCase()})
                </h3>
                <span className="text-xs text-stone-400">Plot #1 (Wheat - North Block)</span>
              </div>
              <span className="text-xs font-mono text-stone-500">
                Sampling Interval: 15 mins (Averaged Hourly)
              </span>
            </div>

            {/* Bar/Line Visualizer */}
            <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-4 px-2">
              {historyRecords.map((pt, idx) => {
                let heightPct = 50;
                let displayVal = '';
                let barColor = 'bg-blue-600';

                if (metricTab === 'moisture') {
                  heightPct = (pt.soilMoisture15 / 50) * 100;
                  displayVal = `${pt.soilMoisture15}%`;
                  barColor = 'bg-blue-600 dark:bg-blue-500';
                } else if (metricTab === 'temp') {
                  heightPct = (pt.temperature / 40) * 100;
                  displayVal = `${pt.temperature}°C`;
                  barColor = 'bg-amber-500 dark:bg-amber-400';
                } else if (metricTab === 'humidity') {
                  heightPct = (pt.humidity / 100) * 100;
                  displayVal = `${pt.humidity}%`;
                  barColor = 'bg-teal-500 dark:bg-teal-400';
                } else if (metricTab === 'irrigation') {
                  heightPct = (pt.irrigationHours / 3) * 100;
                  displayVal = `${pt.irrigationHours}h`;
                  barColor = 'bg-emerald-600 dark:bg-emerald-500';
                }

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {displayVal}
                    </span>
                    <div 
                      className={`w-full max-w-[48px] rounded-t-md transition-all ${barColor} hover:brightness-110`}
                      style={{ height: `${Math.max(12, heightPct)}%` }}
                    />
                    <span className="text-xs font-bold text-stone-500 mt-1">
                      {pt.date}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Calibrated Field Capacity Band: 25 - 45% VWC</span>
              </span>
              <span>Export CSV Ready</span>
            </div>
          </div>

          {/* Historical Log Table */}
          <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-5 shadow-xs">
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3">
              Daily Consolidated Telemetry Records
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Day</th>
                    <th className="py-2.5 px-3">Soil Moisture (15cm)</th>
                    <th className="py-2.5 px-3">Soil Moisture (30cm)</th>
                    <th className="py-2.5 px-3">Air Temp (°C)</th>
                    <th className="py-2.5 px-3">Humidity (%)</th>
                    <th className="py-2.5 px-3">Irrigation</th>
                    <th className="py-2.5 px-3">Crop Health Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                  {historyRecords.map((row, i) => (
                    <tr key={i} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                      <td className="py-2.5 px-3 font-bold">{row.date}</td>
                      <td className="py-2.5 px-3 font-mono">{row.soilMoisture15}%</td>
                      <td className="py-2.5 px-3 font-mono">{row.soilMoisture30}%</td>
                      <td className="py-2.5 px-3 font-mono">{row.temperature}°C</td>
                      <td className="py-2.5 px-3 font-mono">{row.humidity}%</td>
                      <td className="py-2.5 px-3 font-mono">{row.irrigationHours > 0 ? `${row.irrigationHours} hrs (Drip)` : 'Nil'}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{row.cropHealthIndex}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
