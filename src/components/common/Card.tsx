import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#141b16] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-emerald-500/40 hover:shadow-sm' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  icon: Icon,
  iconColor = 'text-emerald-600 dark:text-emerald-400',
  iconBg = 'bg-emerald-50 dark:bg-emerald-950/60',
  title,
  subtitle,
  badge,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-3 pb-3 mb-3 border-b border-stone-100 dark:border-stone-800/80 ${className}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
              {title}
            </h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actionText && (
        <button
          onClick={onAction}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors flex-shrink-0"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
