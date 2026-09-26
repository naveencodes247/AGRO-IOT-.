import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  Clock, 
  PhoneCall,
  Check,
  Filter
} from 'lucide-react';
import { Alert, AlertCategory, Language } from '../types';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
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
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = alerts.filter(a => {
    if (categoryFilter !== 'All' && a.category !== categoryFilter.toLowerCase()) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="space-y-5 select-none font-sans pb-10">
      {/* Unified Page Header */}
      <PageHeader
        title={lang === 'hi' ? 'अलर्ट केंद्र' : 'Alerts'}
        subtitle={lang === 'hi'
          ? 'जल तनाव, कीट प्रकोप, फफूंद रोग जोखिम एवं उपकरण कनेक्टिविटी चेतावनियां'
          : 'Real-time threshold notifications triggered by field microclimate anomalies'}
        actions={
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-850 rounded-xl text-xs font-semibold">
            {['All', 'Critical', 'Warning', 'Information'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-stone-750 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        }
      />

      {/* Status Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-stone-400 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span>Status:</span>
        </span>
        {['All', 'Active', 'Acknowledged', 'Resolved'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`text-xs px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              statusFilter === st
                ? 'bg-[#0fa958] text-white shadow-2xs'
                : 'bg-white dark:bg-[#141b16] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No alerts found"
          description="All sensor parameters and microclimate conditions are currently normal with no triggered thresholds."
          actionLabel="Clear Filters"
          onAction={() => {
            setCategoryFilter('All');
            setStatusFilter('All');
          }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => {
            const isCritical = alert.category === 'critical';
            const isWarning = alert.category === 'warning';
            return (
              <Card key={alert.id} className="p-4 sm:p-5 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCritical
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                        : isWarning
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600'
                        : 'bg-sky-50 dark:bg-sky-950/60 text-sky-600'
                    }`}>
                      {isCritical ? (
                        <ShieldAlert className="w-5 h-5" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {alert.title}
                        </h3>
                        <StatusBadge
                          status={alert.category.toUpperCase()}
                          variant={isCritical ? 'critical' : isWarning ? 'medium' : 'low'}
                          size="xs"
                        />
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                          {alert.plotName}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                        {alert.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200/60 dark:border-stone-800/60 text-xs text-stone-700 dark:text-stone-300 mt-2">
                        <strong className="text-rose-700 dark:text-rose-400 mr-1.5 font-bold">Action Needed:</strong>
                        <span>{alert.suggestedAction}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Timestamp */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{alert.time}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {alert.status === 'active' && (
                        <button
                          onClick={() => onAcknowledge(alert.id)}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}

                      {alert.status !== 'resolved' ? (
                        <button
                          onClick={() => onResolve(alert.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#0fa958] hover:bg-[#13b963] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 py-1 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                          <Check className="w-3.5 h-3.5" />
                          <span>Resolved</span>
                        </span>
                      )}

                      {isCritical && (
                        <a
                          href={HELPLINE_TEL_HREF}
                          className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-300 dark:border-rose-800 hover:bg-rose-100 cursor-pointer"
                          title="Call Kisan Helpline"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
