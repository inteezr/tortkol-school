'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Microscope, Award, TrendingUp, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { AnimatedBackground } from './AnimatedBackground';

const features = [
  { icon: ShieldCheck, title: 'PIIMA Standarti', sub: 'Ixtisoslashtirilgan tizim' },
  { icon: Microscope, title: 'STEM Laboratoriyalar', sub: 'Amaliy ilmiy tadqiqot' },
  { icon: Award, title: 'Xalqaro Olimpiadalar', sub: 'G‘oliblar va sovrindorlar' },
  { icon: TrendingUp, title: 'OTMga tayyorlov', sub: 'Chuqurlashtirilgan dastur' },
];

export const Hero: React.FC = () => {
  const { t, tr } = useLanguage();
  const reduce = useReducedMotion();
  const item = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#F0F8FF] via-[#F6FAFF] to-white pt-16 pb-20 lg:pt-28 lg:pb-28">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <motion.div {...item(0)} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-[#0284C7] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0EA5E9] animate-pulse" />
            <span>{tr("PIIMA Agentligi Tizimidagi Ixtisoslashtirilgan Maktab")}</span>
          </motion.div>

          <motion.h1 {...item(1)} className="text-5xl sm:text-6xl lg:text-8xl font-bold text-slate-900 leading-[0.98] tracking-tight">
            To‘rtko‘l tuman ixtisoslashtirilgan{' '}
            <span className="text-shimmer bg-gradient-to-r from-[#0369A1] via-[#38BDF8] to-[#0369A1] bg-clip-text text-transparent">
              maktabi
            </span>
          </motion.h1>

          <motion.p {...item(2)} className="mt-7 text-slate-600 text-lg sm:text-xl leading-relaxed max-w-2xl">
            {tr("Aniq va tabiiy fanlarga ixtisoslashtirilgan, xalqaro ta'lim standartlari hamda ilg'or zamonaviy laboratoriyalarga ega nufuzli davlat ta'lim maskani.")}
          </motion.p>

          <motion.div {...item(3)} className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/about/school"
              className="shine arrow-shift bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white px-8 py-4 rounded-full font-bold text-base shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>{t.hero.learnMoreBtn}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/admission"
              className="px-8 py-4 rounded-full border border-sky-200 bg-white/60 backdrop-blur text-[#0284C7] font-bold text-base hover:bg-white hover:border-sky-400 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              {tr("Qabul")}
            </Link>
          </motion.div>
        </div>

        <motion.div
          {...item(4)}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16"
        >
          {features.map(({ icon: Icon, title, sub }, i) => (
            <div key={title} className={`glass-stat lift flex items-center gap-3 p-4 rounded-2xl hover:shadow-card-hover hover:border-sky-300 ${i % 2 ? 'float-y' : ''}`} style={{ animationDelay: `${i * -1.3}s` }}>
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">{title}</div>
                <div className="text-xs text-slate-500">{sub}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
