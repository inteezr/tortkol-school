'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedBackground } from './AnimatedBackground';

export const Hero: React.FC = () => {
  const reduce = useReducedMotion();
  const item = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section data-no-reveal className="relative isolate overflow-hidden bg-gradient-to-b from-[#F1F7FE] via-[#E3EFFC] to-[#CFE3F8] min-h-[100svh] flex items-center pt-16 pb-[calc(4rem+5rem)] md:pb-[calc(4rem+8rem)] lg:pt-24 lg:pb-[calc(6rem+8rem)]">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <motion.h1 {...item(0)} className="text-[clamp(1.75rem,calc((100vw_-_2rem)/8.6),3rem)] sm:text-6xl lg:text-8xl break-normal font-bold text-slate-900 leading-[0.98] tracking-tight">
            Törtköl tuman ixtisoslaştirilgan{' '}
            <span className="text-shimmer bg-gradient-to-r from-[#031A3F] via-[#5483B3] to-[#031A3F] bg-clip-text text-transparent">
              maktabi
            </span>
          </motion.h1>

        </div>
      </div>
    </section>
  );
};
