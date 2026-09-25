import React from 'react';
import { AlertCircle, CheckCircle2, Radio, Sparkles } from 'lucide-react';

interface DemoBadgeProps {
  mode: 'demo' | 'waiting' | 'not_connected' | 'ready';
  onToggleMode?: () => void;
  className?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ mode, onToggleMode, className = '' }) => {
  if (mode === 'waiting') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-amber-600/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 ${className}`}>
        <Radio className="w-3.5 h-3.5 animate-pulse text-amber-600 dark:text-amber-400" />
        <span>WAITING FOR FARM CONNECTION</span>
        {onToggleMode && (
          <button 
            onClick={onToggleMode}
            className="ml-1 text-[11px] underline hover:text-amber-900 dark:hover:text-amber-200 transition-colors"
          >
            (Load Demo)
          </button>
        )}
      </div>
    );
  }

  if (mode === 'not_connected') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-rose-600/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
        <span>NOT CONNECTED</span>
      </div>
    );
  }

  if (mode === 'ready') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>READY FOR INTEGRATION</span>
      </div>
    );
  }

  // default demo data
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-md border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 ${className}`}>
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span>DEMO DATA</span>
      {onToggleMode && (
        <button 
          onClick={onToggleMode}
          title="Switch to Empty State to see waiting for connection view"
          className="text-[11px] text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 underline transition-colors"
        >
          (View Empty State)
        </button>
      )}
    </div>
  );
};
