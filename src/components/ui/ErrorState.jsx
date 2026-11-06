import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'Failed to load requested data. Please try again.',
  onRetry = null,
  className = ''
}) => {
  return (
    <div className={`p-6 bg-rose-50/70 dark:bg-rose-950/40 rounded-3xl border border-rose-200 dark:border-rose-900/60 text-center space-y-3 flex flex-col items-center justify-center ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1 max-w-xs">
        <h4 className="font-heading font-bold text-xs text-rose-900 dark:text-rose-200">
          {title}
        </h4>
        <p className="text-[11px] text-rose-700 dark:text-rose-300">
          {description}
        </p>
      </div>

      {onRetry && (
        <Button onClick={onRetry} variant="danger" size="sm" icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
};
