'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/LanguageContext';
import { Calculator, CheckCircle2, ArrowUpRight, Award, Compass, BookOpen } from 'lucide-react';

export default function AniqFanlarPage() {
  const { t, tr } = useLanguage();

  const subjects = [
    {
      name: "Matematika (Chuqurlashtirilgan)",
      hours: "Haftasiga 8 soat",
      topics: ["Algebra va matematik analiz asoslari", "Planimetriya va stereometriya", "Kombinatorika va ehtimollar nazariyasi", "Olimpiada masalalari yechish metodikasi"],
    },
    {
      name: "Fizika (Chuqurlashtirilgan)",
      hours: "Haftasiga 6 soat",
      topics: ["Mexanika va kinematika", "Molekulyar fizika va termodinamika", "Elektrodinamika va optika", "Laboratoriya tajribalari va fizik o'lchovlar"],
    },
    {
      name: "Ingliz tili (Akademik)",
      hours: "Haftasiga 5 soat",
      topics: ["Akademik yozish va nutq", "Grammatika va matn tahlili", "IELTS imtihoniga tayyorgarlik", "Ilmiy maqolalar bilan ishlash"],
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.directions.exactTitle}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            {t.directions.exactDesc}
          </p>
        </div>

        {/* Fanlar kartalari */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {subjects.map((sub, idx) => (
            <div key={idx} className="card-bento p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {tr(sub.name)}
                </h3>
                <div className="text-xs font-semibold text-blue-600 mb-4">
                  {tr(sub.hours)}
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  {sub.topics.map((top, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{tr(top)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {tr("Aniq fanlar yo'nalishiga qabul")}
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              {tr("Imtihonlar matematika va fizika fanlaridan saralash testlari asosida amalga oshiriladi.")}
            </p>
          </div>
          <Link
            href="/admission"
            className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 whitespace-nowrap active:scale-95 transition-all"
          >
            {tr("Qabul tartibi bilan tanishish →")}
          </Link>
        </div>
      </div>
    </div>
  );
}
