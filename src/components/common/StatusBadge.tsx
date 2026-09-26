import React from 'react';

export type StatusVariant = 
  | 'healthy' 
  | 'attention' 
  | 'critical' 
  | 'high' 
  | 'medium' 
  | 'low' 
  | 'info' 
  | 'success' 
  | 'neutral';

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  size = 'xs',
  dot = false,
  className = '',
}) => {
  // Infer variant from status string if not specified
  const resolvedVariant: StatusVariant = variant || (() => {
    const s = status.toLowerCase();
    if (s.includes('health') || s.includes('optimal') || s.includes('good') || s.includes('normal') || s.includes('success')) return 'healthy';
    if (s.includes('attention') || s.includes('medium') || s.includes('warn') || s.includes('moderate')) return 'attention';
    if (s.includes('critical') || s.includes('high') || s.includes('alert') || s.includes('severe') || s.includes('deficit')) return 'critical';
    if (s.includes('low') || s.includes('info') || s.includes('standby')) return 'low';
    return 'neutral';
  })();

  const variantStyles: Record<StatusVariant, { bg: string; text: string; dotBg: string }> = {
    healthy: {
      bg: 'bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      dotBg: 'bg-emerald-500',
    },
    success: {
      bg: 'bg-emerald-500/15 dark:bg-emerald-500/20 border border-emerald-500/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      dotBg: 'bg-emerald-500',
    },
    attention: {
      bg: 'bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30',
      text: 'text-amber-700 dark:text-amber-400',
      dotBg: 'bg-amber-500',
    },
    medium: {
      bg: 'bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30',
      text: 'text-amber-700 dark:text-amber-400',
      dotBg: 'bg-amber-500',
    },
    critical: {
      bg: 'bg-rose-500/15 dark:bg-rose-500/20 border border-rose-500/30',
      text: 'text-rose-700 dark:text-rose-400',
      dotBg: 'bg-rose-500',
    },
    high: {
      bg: 'bg-rose-500/15 dark:bg-rose-500/20 border border-rose-500/30',
      text: 'text-rose-700 dark:text-rose-400',
      dotBg: 'bg-rose-500',
    },
    low: {
      bg: 'bg-sky-500/15 dark:bg-sky-500/20 border border-sky-500/30',
      text: 'text-sky-700 dark:text-sky-400',
      dotBg: 'bg-sky-500',
    },
    info: {
      bg: 'bg-blue-500/15 dark:bg-blue-500/20 border border-blue-500/30',
      text: 'text-blue-700 dark:text-blue-400',
      dotBg: 'bg-blue-400',
    },
    neutral: {
      bg: 'bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700',
      text: 'text-stone-700 dark:text-stone-300',
      dotBg: 'bg-stone-400',
    },
  };

  const currentVariant = variantStyles[resolvedVariant];

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 rounded-full font-semibold',
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-semibold',
    md: 'text-xs px-3 py-1 rounded-full font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 leading-none font-sans ${currentVariant.bg} ${currentVariant.text} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${currentVariant.dotBg}`} />}
      <span>{status}</span>
    </span>
  );
};
