import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Splash = ({ onComplete }) => {
  useEffect(() => {
    onComplete();
  }, [onComplete]);
  return null;
};
