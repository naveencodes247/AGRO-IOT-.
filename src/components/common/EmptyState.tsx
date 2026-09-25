import React from 'react';
import { LucideIcon, WifiOff, Sprout, BellOff, FileSearch, ShieldAlert, Cpu, Activity, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  badge?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Sprout,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  badge,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-xl border border-dashed border-stone-300 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/40 backdrop-blur-xs ${className}`}>
      {badge && (
        <span className="mb-4 inline-block px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase rounded-md bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
          {badge}
        </span>
      )}
      
      <div className="w-14 h-14 rounded-xl bg-stone-200/80 dark:bg-stone-800/80 flex items-center justify-center mb-4 text-stone-600 dark:text-stone-300">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
        {title}
      </h3>

      <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              {actionLabel}
            </button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
