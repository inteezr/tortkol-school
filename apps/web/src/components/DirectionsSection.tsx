'use client';

import React from 'react';
import Link from 'next/link';
import { Reveal } from './Reveal';
import { useLanguage } from '../lib/LanguageContext';
import { Calculator, Atom, ArrowRight, Check, Sparkles } from 'lucide-react';

export const DirectionsSection: React.FC = () => {
  const { t, tr } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-[#F0F8FF] via-[#F8FBFF] to-white font-poppins overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha */}
        <Reveal className="text-center max-w-3xl mx-auto mb-14">
          <span className="kicker mb-3">
            {tr("MAXSUS TA'LIM DASTURLARI")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {tr("Ixtisoslashtirilgan Yo'nalishlar")}
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            {tr("Maktabimizda o'quvchilar salohiyati va qiziqishlariga ko'ra ikki asosiy chuqurlashtirilgan yo'nalishda fundamental ta'lim beriladi.")}
          </p>
        </Reveal>

        {/* 2 ta Katta Karta (Image + Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Yo'nalish 1: Aniq fanlar */}
          <div className="flex flex-col sm:flex-row items-stretch rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl bg-white group lift border border-sky-100 hover:border-sky-300">
            {/* Chap surat */}
            <div className="sm:w-1/2 relative overflow-hidden min-h-[260px] bg-slate-900">
              <img loading="lazy" decoding="async"
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=70&fm=webp"
                alt={tr("Aniq fanlar yo'nalishi")}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.95]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0369A1]/85 via-transparent to-transparent sm:hidden" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white shadow-md">
                <Calculator className="w-3.5 h-3.5 text-sky-200" />
                <span>{tr("Aniq fanlar")}</span>
              </div>
            </div>

            {/* O'ng ma'lumot */}
            <div className="sm:w-1/2 p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                  {t.directions.exactTitle}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {tr("Matematika, Fizika va Informatika fanlariga chuqurlashtirilgan o'quv dasturi. IT, robototexnika va muhandislik sohalariga tayyorlaydi.")}
                </p>

                {/* Fanlar nishonlari */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {t.directions.exactSubjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-bold bg-sky-50 text-[#0284C7] border border-sky-200"
                    >
                      <Check className="w-3 h-3 text-[#0284C7]" />
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-sky-100">
                <Link
                  href="/programs/exact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-sky-500/20 transition-all"
                >
                  <span>{tr("Batafsil o'rganish")}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          </div>

          {/* Yo'nalish 2: Tabiiy fanlar */}
          <div className="flex flex-col sm:flex-row items-stretch rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl bg-white group lift border border-sky-100 hover:border-sky-300">
            {/* Chap surat */}
            <div className="sm:w-1/2 relative overflow-hidden min-h-[260px] bg-slate-900">
              <img loading="lazy" decoding="async"
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=70&fm=webp"
                alt={tr("Tabiiy fanlar yo'nalishi")}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.95]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/85 via-transparent to-transparent sm:hidden" />
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md">
                <Atom className="w-3.5 h-3.5 text-emerald-200" />
                <span>{tr("Tabiiy fanlar")}</span>
              </div>
            </div>

            {/* O'ng ma'lumot */}
            <div className="sm:w-1/2 p-7 sm:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t.directions.naturalTitle}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {tr("Kimyo va Biologiya fanlariga ixtisoslashgan ta'lim dasturi. Tibbiyot, biotexnologiya va ekologiya yo'nalishlari uchun fundamental bilim beradi.")}
                </p>

                {/* Fanlar nishonlari */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {t.directions.naturalSubjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-sky-100">
                <Link
                  href="/programs/natural"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-emerald-600 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                >
                  <span>{tr("Batafsil o'rganish")}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
