'use client';

import React from 'react';
import Link from 'next/link';
import { Reveal } from './Reveal';
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
          <Reveal className="lg:col-span-12 max-w-3xl space-y-5">
            <span className="kicker">
              {tr("BIZ HAQIMIZDA")}
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
              To‘rtko‘l tuman ixtisoslashtirilgan maktabi
            </h2>

            <p className="text-slate-600 text-[15px] leading-relaxed">
              {tr("O'quvchilarimizga fundamental fanlar bo'yicha chuqur bilim berish, ularning intellektual salohiyatini ro'yobga chiqarish va respublikamizning yetakchi oliygohlari hamda nufuzli xalqaro universitetlariga tayyorlash asosiy maqsadimizdir.")}
            </p>

            <p className="text-slate-600 text-[15px] leading-relaxed">
              {tr("Maktabimizda zamonaviy IT va tabiiy fanlar laboratoriyalari, interaktiv dars xonalari hamda boy kutubxona tarmog'i faoliyat ko'rsatmoqda.")}
            </p>

            <div className="pt-2">
              <Link
                href="/about/school"
                className="shine inline-flex items-center gap-2.5 bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-sky-500/25 hover:shadow-lg transition-all active:scale-95 arrow-shift"
              >
                <span>{tr("Maktab haqida to'liq ma'lumot")}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};
