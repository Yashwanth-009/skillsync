import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No Data Available',
  description = 'There are no items to display at this moment.',
  actionLabel = null,
  onAction = null,
  className = ''
}) => {
  return (
    <div className={`p-8 text-center bg-surface dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/80 shadow-card space-y-3 flex flex-col items-center justify-center ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-primary flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-xs">
        <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
