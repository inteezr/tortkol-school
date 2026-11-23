'use client';

import React from 'react';
import Link from 'next/link';
import { Reveal } from './Reveal';
import { SchoolStatsCard } from './SchoolStatsCard';
import { useLanguage } from '../lib/LanguageContext';
import { ArrowRight, Users, Award, TrendingUp, Sparkles } from 'lucide-react';

export const BentoStats: React.FC = () => {
  const { t, tr } = useLanguage();

  return (
    <section className="py-20 bg-white font-poppins border-y border-sky-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-Ustunli "Biz haqimizda" Struktura: [Matn 40%] - [Foto 30%] - [Statistika 30%] */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Ustun 1: Maktab haqida kirish matni (5 ustun) */}
          <Reveal from="right" className="lg:col-span-7 space-y-5">
            <span className="kicker">
              {tr("BIZ HAQIMIZDA")}
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
              Törtköl tuman ixtisoslaştirilgan maktabi
            </h2>

            <p className="text-slate-600 text-[15px] leading-relaxed">
              {tr("Öquvçilarimizga fundamental fanlar böyiça çuqur bilim beriş, ularning intellektual salohiyatini röyobga çiqariş va respublikamizning yetakçi oliygohlari hamda nufuzli xalqaro universitetlariga tayyorlaş asosiy maqsadimizdir.")}
            </p>

            <p className="text-slate-600 text-[15px] leading-relaxed">
              {tr("Maktabimizda zamonaviy IT va tabiiy fanlar laboratoriyalari, interaktiv dars xonalari hamda boy kutubxona tarmoği faoliyat körsatmoqda.")}
            </p>

            <div className="pt-2">
              <Link
                href="/about/school"
                className="shine inline-flex items-center gap-2.5 bg-gradient-to-r from-[#031A3F] via-[#052659] to-[#5483B3] hover:from-[#021024] hover:to-[#031A3F] text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-sky-500/25 hover:shadow-lg transition-all active:scale-95 arrow-shift"
              >
                <span>{tr("Maktab haqida töliq ma'lumot")}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </Reveal>

          {/* O'ng tomon: maktab rasmi va ixcham statistika */}
          <div className="lg:col-span-5">
            <SchoolStatsCard />
          </div>
        </div>
      </div>
    </section>
  );
};
