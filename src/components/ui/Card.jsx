import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  variant = 'surface', // 'surface' | 'glass' | 'interactive' | 'flat'
  className = '',
  onClick = null,
  padding = 'p-4',
  ...props
}) => {
  const baseStyles = 'rounded-2xl border transition-all duration-200';

  const variants = {
    surface: 'bg-surface dark:bg-slate-800 border-slate-100 dark:border-slate-700/80 shadow-card text-slate-900 dark:text-white',
    glass: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-emerald-100/80 dark:border-emerald-900/40 shadow-card text-slate-900 dark:text-white',
    interactive: 'bg-surface dark:bg-slate-800 border-slate-100 dark:border-slate-700/80 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:border-emerald-300 dark:hover:border-emerald-700 cursor-pointer active:scale-[0.99] text-slate-900 dark:text-white',
    flat: 'bg-slate-50 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-white'
  };

  if (onClick || variant === 'interactive') {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`${baseStyles} ${variants[variant] || variants.surface} ${padding} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyles} ${variants[variant] || variants.surface} ${padding} ${className}`} {...props}>
      {children}
    </div>
  );
};
