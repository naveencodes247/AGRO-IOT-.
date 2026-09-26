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
  Database,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';
import { analyticsService, HistoricalPoint } from '../services/analyticsService';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';

interface HistoryAnalyticsViewProps {
  lang: Language;
}

export const HistoryAnalyticsView: React.FC<HistoryAnalyticsViewProps> = ({ lang }) => {
  const [dataMode, setDataMode] = useState<'empty' | 'demo'>('demo');
  const [metricTab, setMetricTab] = useState<'moisture' | 'temp' | 'humidity' | 'irrigation'>('moisture');

  const historyRecords: HistoricalPoint[] = analyticsService.getHistoricalData(dataMode);

  return (
    <div className="space-y-5 select-none font-sans pb-10">
      {/* Unified Page Header */}
      <PageHeader
        title={lang === 'hi' ? 'इतिहास व विश्लेषण' : 'History / Analytics'}
        subtitle={lang === 'hi'
          ? 'मृदा नमी, तापमान, आर्द्रता, सिंचाई चक्र और फसल स्वास्थ्य का बहु-दिवसीय विश्लेषण'
          : 'Multi-day sensor records, temporal moisture depletion, and irrigation runtimes'}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDataMode(dataMode === 'empty' ? 'demo' : 'empty')}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#141b16] text-xs font-semibold text-stone-700 dark:text-stone-300 shadow-2xs hover:bg-stone-50 cursor-pointer"
            >
              {dataMode === 'empty' ? 'Load Dataset' : 'Test Empty State'}
            </button>
          </div>
        }
      />

      {dataMode === 'empty' ? (
        <EmptyState
          icon={BarChart3}
          badge="WAITING FOR TELEMETRY"
          title="No Historical Farm Data Available Yet"
          description="Once your field sensor nodes operate continuously, 24-hour diurnal curves and water depletion rates will record here."
          actionLabel="Load Demo Analytics Dataset"
          onAction={() => setDataMode('demo')}
        />
      ) : (
        <div className="space-y-4">
          {/* Metric Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'moisture', label: 'Soil Moisture Curve (15cm vs 30cm)' },
              { id: 'temp', label: 'Diurnal Temperature' },
              { id: 'humidity', label: 'Relative Humidity' },
              { id: 'irrigation', label: 'Irrigation Runtime Hours' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMetricTab(tab.id as any)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  metricTab === tab.id
                    ? 'bg-[#0fa958] text-white shadow-2xs'
                    : 'bg-white dark:bg-[#141b16] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Historical Trend Chart Card */}
          <Card className="p-4 sm:p-5">
            <CardHeader
              icon={BarChart3}
              title={
                metricTab === 'moisture' ? 'Soil Moisture Depletion & Infiltration Trajectory (% VWC)' :
                metricTab === 'temp' ? '7-Day Ambient vs Soil Temperature (°C)' :
                metricTab === 'humidity' ? 'Diurnal Relative Humidity Range (%)' :
                'Daily Pump Run Time & Water Consumption (Litres)'
              }
              subtitle="7-day sensor trend aggregated across field nodes"
              actionText="Export CSV"
              onAction={() => {}}
            />

            {/* Custom SVG Line / Bar Visualization */}
            <div className="h-64 sm:h-72 w-full pt-4">
              <svg className="w-full h-full" viewBox="0 0 700 240" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="40" y1="30" x2="680" y2="30" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="80" x2="680" y2="80" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="130" x2="680" y2="130" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="180" x2="680" y2="180" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeWidth="1" strokeDasharray="3 3" />

                {/* Y-axis Labels */}
                <text x="10" y="35" className="text-[10px] fill-stone-400 font-mono">50%</text>
                <text x="10" y="85" className="text-[10px] fill-stone-400 font-mono">40%</text>
                <text x="10" y="135" className="text-[10px] fill-stone-400 font-mono">30%</text>
                <text x="10" y="185" className="text-[10px] fill-stone-400 font-mono">20%</text>

                {/* Trend Polyline (Green Primary Trend) */}
                <polyline
                  fill="none"
                  stroke="#0fa958"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="60,70 150,85 240,65 330,110 420,50 510,75 600,60"
                />

                {/* Secondary Trend Polyline (Sky Blue Subsurface) */}
                <polyline
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="60,110 150,115 240,105 330,130 420,95 510,105 600,100"
                />

                {/* Data Points */}
                {[
                  { cx: 60, cy: 70 },
                  { cx: 150, cy: 85 },
                  { cx: 240, cy: 65 },
                  { cx: 330, cy: 110 },
                  { cx: 420, cy: 50 },
                  { cx: 510, cy: 75 },
                  { cx: 600, cy: 60 },
                ].map((pt, i) => (
                  <circle key={i} cx={pt.cx} cy={pt.cy} r="4" fill="#ffffff" stroke="#0fa958" strokeWidth="2.5" />
                ))}

                {/* X-axis Labels */}
                {['Mon (21 Apr)', 'Tue (22 Apr)', 'Wed (23 Apr)', 'Thu (24 Apr)', 'Fri (25 Apr)', 'Sat (26 Apr)', 'Sun (Today)'].map((day, i) => (
                  <text key={i} x={60 + i * 90} y="220" textAnchor="middle" className="text-[10px] fill-stone-400 font-mono">
                    {day}
                  </text>
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#0fa958] rounded-full" />
                  <span>15 cm Topsoil Moisture</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-sky-500 rounded-full" />
                  <span>30 cm Root Zone Moisture</span>
                </span>
              </div>
              <span>Target Range: 25 - 45% VWC</span>
            </div>
          </Card>

          {/* Historical Records Table */}
          <Card className="p-4 sm:p-5">
            <CardHeader
              icon={Calendar}
              title="7-Day Telemetry Logs"
              subtitle="Consolidated daily agricultural records"
            />

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] uppercase tracking-wider text-stone-400 border-b border-stone-100 dark:border-stone-800">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Avg Moisture</th>
                    <th className="py-2.5 px-3">Max Temp</th>
                    <th className="py-2.5 px-3">Min Humidity</th>
                    <th className="py-2.5 px-3">Irrigation</th>
                    <th className="py-2.5 px-3">Crop Health</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
                  {historyRecords.map((r, i) => (
                    <tr key={i} className="hover:bg-stone-50/50 dark:hover:bg-stone-850/40">
                      <td className="py-2.5 px-3 font-semibold text-stone-900 dark:text-stone-100">{r.date}</td>
                      <td className="py-2.5 px-3 font-mono text-sky-600 font-bold">{r.soilMoisture}%</td>
                      <td className="py-2.5 px-3 font-mono">{r.temperature}°C</td>
                      <td className="py-2.5 px-3 font-mono">{r.humidity}%</td>
                      <td className="py-2.5 px-3">{r.irrigationMinutes} min</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{r.cropHealthIndex}%</td>
                      <td className="py-2.5 px-3">
                        <StatusBadge
                          status={r.soilMoisture >= 25 ? 'Optimal' : 'Deficit'}
                          variant={r.soilMoisture >= 25 ? 'healthy' : 'attention'}
                          size="xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
