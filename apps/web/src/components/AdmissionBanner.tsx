'use client';

import React from 'react';
import Link from 'next/link';
import { Reveal } from './Reveal';
import { useLanguage } from '../lib/LanguageContext';
import { ArrowUpRight, HelpCircle, Sparkles } from 'lucide-react';

export const AdmissionBanner: React.FC = () => {
  const { t, tr } = useLanguage();

  return (
    <section className="py-20 bg-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal from="zoom"><div className="relative rounded-[36px] p-8 sm:p-14 lg:p-16 bg-gradient-to-r from-[#031A3F] via-[#052659] to-[#5483B3] text-white shadow-2xl shadow-sky-500/20 overflow-hidden">
          {/* Geometrik yaltiroq effektlar */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/15 rounded-full blur-3xl pointer-events-none float-y" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-sky-200/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-100" />
              <span>{tr("Qabul 2026/2027 öquv yili")}</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {tr("Törtköl tuman ixtisoslaştirilgan maktabiga Qabul")}
            </h2>

            <p className="mt-4 text-base sm:text-lg text-sky-50 max-w-2xl leading-relaxed font-normal">
              {tr("Respublika ixtisoslaştirilgan ta'lim muassasalari agentligi portali orqali 5, 6, 7 va 8-sinflarga onlayn ariza topşirişingiz mumkin.")}
            </p>

            {/* 4 bosqichli jarayon */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                "1. Ariza topşiriş",
                "2. Hujjatlar tahlili",
                "3. Kiriş imtihonlari",
                "4. Natijalar & Qabul"
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="lift px-3.5 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold text-white text-center shadow-xs"
                >
                  {step}
                </div>
              ))}
            </div>

            {/* Tugmalar */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="https://ariza.piima.uz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#052659] font-extrabold text-sm hover:bg-sky-50 active:scale-95 shadow-xl shadow-sky-950/15 transition-all"
              >
                <span>{tr("Ariza topşiriş (ariza.piima.uz)")}</span>
                <ArrowUpRight className="w-4 h-4 text-[#052659]" />
              </a>

              <Link
                href="/admission"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/30 active:scale-95 transition-all"
              >
                <span>{tr("Qabul talablari va kvotalar")}</span>
              </Link>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
};
