import React from 'react';
import { LucideIcon, Sprout } from 'lucide-react';

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
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 bg-white/60 dark:bg-[#141b16]/60 backdrop-blur-xs shadow-xs ${className}`}>
      {badge && (
        <span className="mb-3.5 inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
          {badge}
        </span>
      )}
      
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center mb-3.5 text-[#0fa958]">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mb-5 leading-relaxed font-medium">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#0fa958] hover:bg-[#13b963] active:bg-[#0d8f4a] text-white shadow-xs transition-all cursor-pointer"
            >
              {actionLabel}
            </button>
          )}

          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-200 transition-all cursor-pointer"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
