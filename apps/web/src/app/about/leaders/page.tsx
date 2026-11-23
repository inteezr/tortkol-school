'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/LanguageContext';
import { loadJson } from '../../../lib/api-store';
import { mapLeader, leaderHref, type Leader } from '../../../lib/staff';

export default function RahbariyatPage() {
  const { t, tr } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    loadJson('/api/teachers?scope=leaders', (data) => {
        if (data.leaders && data.leaders.length > 0) {
          setLeaders(data.leaders.map(mapLeader));
        }
      }, () => setLoading(false));
  }, []);

  // Direktor markazda: lavozimida "direktor" bor, lekin "o'rinbosar" yo'q rahbar
  const isDirector = (r: string = '') => /direktor|director|директор/i.test(r) && !/o['‘’`ʻ]?rinbosar|zam|заместитель|deputy/i.test(r);
  const mainIdx = Math.max(0, leaders.findIndex((l) => isDirector(l.role)));
  const main = leaders[mainIdx];
  const others = leaders.filter((_, i) => i !== mainIdx);
  const leftSide = others.filter((_, i) => i % 2 === 0);
  const rightSide = others.filter((_, i) => i % 2 === 1);

  return (
    <div className="relative py-12 sm:py-20 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha qismi */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.nav.leadership}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            {tr("Törtköl tuman ixtisoslaştirilgan maktabining ma'muriy va ilmiy boşqaruv jamoasi.")}
          </p>
        </div>

        {/* Rahbariyat kartalari Bento Grid */}
        {!loading && leaders.length === 0 && (
          <p className="text-center text-slate-500 py-16">{tr("Hozirça ma'lumot kiritilmagan.")}</p>
        )}
        {leaders.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_1fr] gap-6 items-start">
            {/* Markaziy karta */}
            <Link
              href={leaderHref(main.id)}
              className="block lg:col-start-2 lg:row-start-1 group bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(2,16,36,0.08)] hover:shadow-xl transition-all text-center"
            >
              <div className="aspect-[4/3.2] overflow-hidden bg-slate-100">
                {main.imageUrl ? (
                  <img decoding="async" src={main.imageUrl} alt={main.fullName} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${main.accentColor} flex items-center justify-center text-white font-extrabold text-6xl`}>{main.initials}</div>
                )}
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">{main.fullName}</h3>
                <div className="w-14 h-[3px] bg-[#5483B3] rounded-full mx-auto my-3" />
                <p className="text-slate-500 text-sm sm:text-base">{tr(main.role)}</p>
              </div>
            </Link>

            {/* Yon kartalar */}
            {[{ list: leftSide, col: 'lg:col-start-1' }, { list: rightSide, col: 'lg:col-start-3' }].map(({ list, col }, k) => (
              <div key={k} className={`${col} lg:row-start-1 space-y-6 contents lg:block`}>
                {list.map((leader) => (
                  <Link
                    key={leader.id}
                    href={leaderHref(leader.id)}
                    className="group w-full flex bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(2,16,36,0.07)] hover:shadow-xl hover:-translate-y-0.5 transition-all text-left mb-6 min-h-[208px]"
                  >
                    <div className="w-[42%] flex-shrink-0 bg-slate-100 overflow-hidden">
                      {leader.imageUrl ? (
                        <img loading="lazy" decoding="async" src={leader.imageUrl} alt={leader.fullName} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${leader.accentColor} flex items-center justify-center text-white font-extrabold text-4xl`}>{leader.initials}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 p-5 flex flex-col justify-center">
                      <h3 className="text-base font-semibold text-slate-900 leading-snug">{leader.fullName}</h3>
                      <div className="w-10 h-[2px] bg-[#5483B3] my-2.5" />
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-5">{tr(leader.role)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
