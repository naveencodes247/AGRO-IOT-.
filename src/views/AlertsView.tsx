import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  Droplets, 
  Bug, 
  Thermometer, 
  WifiOff, 
  Clock, 
  PhoneCall,
  Check
} from 'lucide-react';
import { Alert, AlertCategory, Language } from '../types';
import { DemoBadge } from '../components/common/DemoBadge';
import { EmptyState } from '../components/common/EmptyState';
import { HELPLINE_NUMBER, HELPLINE_TEL_HREF } from '../services/supportService';

interface AlertsViewProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  lang: Language;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onAcknowledge,
  onResolve,
  lang,
  isDemoMode,
  onToggleDemoMode,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = alerts.filter(a => {
    if (categoryFilter !== 'All' && a.category !== categoryFilter.toLowerCase()) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter.toLowerCase()) return false;
    return true;
  });

  const getAlertIcon = (type: string, category: AlertCategory) => {
    if (category === 'critical') return <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
    if (category === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {lang === 'hi' ? 'खेत अलर्ट एवं सुरक्षा केंद्र' : 'Farm Safety & Alert Center'}
            </h2>
            <DemoBadge mode={isDemoMode ? 'demo' : 'waiting'} onToggleMode={onToggleDemoMode} />
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {lang === 'hi'
              ? 'जल तनाव, कीट प्रकोप, फफूंद रोग जोखिम एवं उपकरण कनेक्टिविटी चेतावनियां'
              : 'Real-time threshold notifications triggered by field microclimate anomalies'}
          </p>
        </div>

        {/* Filter Category */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs font-semibold">
            {['All', 'Critical', 'Warning', 'Information'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Quick Filter (Active vs Resolved) */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
          {lang === 'hi' ? 'स्थिति फ़िल्टर:' : 'Filter Status:'}
        </span>
        {['All', 'Active', 'Acknowledged', 'Resolved'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
              statusFilter === st
                ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-750 hover:bg-stone-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Alert List or Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title={lang === 'hi' ? 'कोई सक्रिय अलर्ट नहीं है' : 'No Alerts Present'}
          description={lang === 'hi'
            ? 'आपके खेत में सभी पैरामीटर सुरक्षित सीमा में हैं। कोई जल तनाव या गंभीर रोग खतरा दर्ज नहीं हुआ है।'
            : 'All field parameters are operating within established safe thresholds. No anomalous sensor events detected.'}
          actionLabel={lang === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Alert Filters'}
          onAction={() => { setCategoryFilter('All'); setStatusFilter('All'); }}
          secondaryActionLabel={!isDemoMode ? (lang === 'hi' ? 'डेमो अलर्ट दिखाएं' : 'Load Demo Alerts') : undefined}
          onSecondaryAction={!isDemoMode ? onToggleDemoMode : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((alert) => {
            const isResolved = alert.status === 'resolved';
            const isAck = alert.status === 'acknowledged';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-xs transition-all ${
                  alert.category === 'critical' ? 'border-rose-200 dark:border-rose-900/60' :
                  alert.category === 'warning' ? 'border-amber-200 dark:border-amber-900/60' :
                  'border-stone-200 dark:border-stone-800'
                } ${isResolved ? 'opacity-70' : ''}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-lg flex-shrink-0 ${
                      alert.category === 'critical' ? 'bg-rose-100 dark:bg-rose-950/70' :
                      alert.category === 'warning' ? 'bg-amber-100 dark:bg-amber-950/70' :
                      'bg-blue-100 dark:bg-blue-950/70'
                    }`}>
                      {getAlertIcon(alert.type, alert.category)}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                          alert.category === 'critical' ? 'bg-rose-600 text-white' :
                          alert.category === 'warning' ? 'bg-amber-500 text-white' :
                          'bg-blue-600 text-white'
                        }`}>
                          {alert.category}
                        </span>

                        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                          {alert.plotName}
                        </span>

                        <span className="text-xs text-stone-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {alert.timestamp}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                        {alert.title}
                      </h3>

                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl">
                        {alert.message}
                      </p>

                      <div className="pt-2">
                        <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-950/60 border border-stone-200/80 dark:border-stone-800 text-xs">
                          <strong className="font-bold text-emerald-800 dark:text-emerald-400">
                            {lang === 'hi' ? 'अनुशंसित निवारक कार्रवाई: ' : 'Recommended Action: '}
                          </strong>
                          <span className="text-stone-800 dark:text-stone-200">
                            {alert.recommendedAction}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 self-end sm:self-auto flex-shrink-0">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                      alert.status === 'active' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                      alert.status === 'acknowledged' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {alert.status}
                    </span>

                    {!isResolved && (
                      <div className="flex items-center gap-1.5 mt-2">
                        {!isAck && (
                          <button
                            onClick={() => onAcknowledge(alert.id)}
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => onResolve(alert.id)}
                          className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                        >
                          Resolve
                        </button>
                      </div>
                    )}

                    <a
                      href={HELPLINE_TEL_HREF}
                      className="mt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{HELPLINE_NUMBER}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
