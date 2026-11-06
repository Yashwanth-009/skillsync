import React from 'react';

export const Skeleton = ({ className = '', circle = false, count = 1 }) => {
  const base = 'shimmer-effect rounded-2xl bg-slate-200/70 dark:bg-slate-700/60';

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className={`${base} ${circle ? 'rounded-full' : ''} ${className}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${base} ${circle ? 'rounded-full' : ''} ${className}`} />
  );
};
