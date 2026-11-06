import React, { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const PullToRefresh = ({ onRefresh, children, className = '' }) => {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullHeight, setPullHeight] = useState(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current > 0 && !refreshing) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY.current;
      if (diff > 0 && diff < 120) {
        setPullHeight(diff);
        setPulling(true);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullHeight > 60 && !refreshing && onRefresh) {
      setRefreshing(true);
      setPullHeight(50);
      try {
        await onRefresh();
      } catch (e) {
        console.error(e);
      } finally {
        setRefreshing(false);
      }
    }
    setPulling(false);
    setPullHeight(0);
    touchStartY.current = 0;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative min-h-full ${className}`}
    >
      {(pulling || refreshing) && (
        <motion.div
          animate={{ height: pullHeight }}
          className="flex items-center justify-center overflow-hidden transition-all text-primary"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullHeight * 3}deg)` }} />
        </motion.div>
      )}
      {children}
    </div>
  );
};
