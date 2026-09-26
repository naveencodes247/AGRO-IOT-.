import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  badge,
  className = '',
}) => {
  return (
    <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6 ${className}`}>
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {actions}
        </div>
      )}
    </div>
  );
};
