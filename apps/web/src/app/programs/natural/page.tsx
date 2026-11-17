'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/LanguageContext';
import { Atom, CheckCircle2, ArrowUpRight, FlaskConical, Dna } from 'lucide-react';

export default function TabiiyFanlarPage() {
  const { t, tr } = useLanguage();

  const subjects = [
    {
      name: "Biologiya (Chuqurlashtirilgan)",
      hours: "Haftasiga 8 soat",
      topics: ["Sitologiya va genetika asoslari", "Anatomiya va fiziologiya", "Biotexnologiya va mikrobiologiya", "Xalqaro IBO olimpiadasi tayyorgarligi"],
    },
    {
      name: "Kimyo (Chuqurlashtirilgan)",
      hours: "Haftasiga 6 soat",
      topics: ["Umumiy va noorganik kimyo", "Organik kimyo va bioorganik birikmalar", "Kimyoviy hisoblashlar va laboratoriya tahlili", "Olimpiada masalalari yechish"],
    },
    {
      name: "Ingliz tili (Akademik)",
      hours: "Haftasiga 5 soat",
      topics: ["Tibbiy va biologik terminologiya", "Xalqaro ilmiy jurnallar tahlili", "IELTS va CEFR imtihonlariga tayyorgarlik", "Ilmiy prezentatsiyalar tayyorlash"],
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.directions.naturalTitle}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            {t.directions.naturalDesc}
          </p>
        </div>

        {/* Fanlar kartalari */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {subjects.map((sub, idx) => (
            <div key={idx} className="card-bento p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                  <Atom className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {tr(sub.name)}
                </h3>
                <div className="text-xs font-semibold text-emerald-600 mb-4">
                  {tr(sub.hours)}
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  {sub.topics.map((top, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{tr(top)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-emerald-50 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {tr("Tabiiy fanlar yo'nalishiga qabul")}
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              {tr("Tibbiyot, biotexnologiya va ekologiya sohalari uchun fundamental poydevor.")}
            </p>
          </div>
          <Link
            href="/admission"
            className="px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 whitespace-nowrap active:scale-95 transition-all"
          >
            {tr("Qabul tartibi bilan tanishish →")}
          </Link>
        </div>
      </div>
    </div>
  );
}
