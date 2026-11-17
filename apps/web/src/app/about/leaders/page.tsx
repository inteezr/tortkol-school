'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { loadJson } from '../../../lib/api-store';
import { Calendar, Phone, Mail, X } from 'lucide-react';

const ACCENTS = ["from-blue-600 to-indigo-700", "from-purple-600 to-indigo-700", "from-emerald-600 to-teal-700", "from-rose-600 to-orange-600"];

export default function RahbariyatPage() {
  const { t, tr } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    loadJson('/api/teachers?scope=leaders', (data) => {
        if (data.leaders && data.leaders.length > 0) {
          setLeaders(data.leaders.map((l: any, idx: number) => ({
            id: l.id || idx + 1,
            fullName: l.full_name || l.fullName,
            role: l.role,
            receptionDays: l.reception_days || l.receptionDays,
            phone: l.phone || "",
            email: l.email || "",
            bio: l.bio,
            initials: (l.full_name || l.fullName).split(' ').slice(0, 2).map((w: string) => w[0]).join(''),
            accentColor: ACCENTS[idx % ACCENTS.length],
            imageUrl: (l.photo_url?.startsWith('http') || l.photo_url?.startsWith('/api/files/')) ? l.photo_url : null,
          })));
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
      {/* Fon: matematik belgilar */}
      <div aria-hidden className="pointer-events-none select-none absolute inset-0 text-slate-300/70 font-medium text-2xl">
        {[['√a','6%','4%'],['a²','78%','2%'],['=','9%','30%'],['a²+b²=c²','90%','28%'],['+','1%','50%'],['%','92%','55%'],['S=V/t','2%','72%'],['=','86%','70%'],['+','94%','86%']].map(([t,l,tp],i)=>(
          <span key={i} className="absolute" style={{ left: l, top: tp }}>{t}</span>
        ))}
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha qismi */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.nav.leadership}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            {tr("To'rtko'l tuman ixtisoslashtirilgan maktabining ma'muriy va ilmiy boshqaruv jamoasi.")}
          </p>
        </div>

        {/* Rahbariyat kartalari Bento Grid */}
        {!loading && leaders.length === 0 && (
          <p className="text-center text-slate-500 py-16">{tr("Hozircha ma'lumot kiritilmagan.")}</p>
        )}
        {leaders.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_1fr] gap-6 items-start">
            {/* Markaziy karta */}
            <button
              type="button"
              onClick={() => setSelected(main)}
              className="lg:col-start-2 lg:row-start-1 group bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,23,42,0.08)] hover:shadow-xl transition-all text-center"
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
                <div className="w-14 h-[3px] bg-[#1d6fe0] rounded-full mx-auto my-3" />
                <p className="text-slate-500 text-sm sm:text-base">{tr(main.role)}</p>
              </div>
            </button>

            {/* Yon kartalar */}
            {[{ list: leftSide, col: 'lg:col-start-1' }, { list: rightSide, col: 'lg:col-start-3' }].map(({ list, col }, k) => (
              <div key={k} className={`${col} lg:row-start-1 space-y-6 contents lg:block`}>
                {list.map((leader) => (
                  <button
                    type="button"
                    key={leader.id}
                    onClick={() => setSelected(leader)}
                    className="group w-full flex bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(15,23,42,0.07)] hover:shadow-xl hover:-translate-y-0.5 transition-all text-left mb-6 min-h-[208px]"
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
                      <div className="w-10 h-[2px] bg-[#1d6fe0] my-2.5" />
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-5">{tr(leader.role)}</p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto md:overflow-hidden md:grid md:grid-cols-[2fr_3fr]">
            <div className="relative aspect-square md:aspect-auto md:min-h-[540px] bg-slate-100 overflow-hidden">
                  {selected.imageUrl ? (
                    <img decoding="async" src={selected.imageUrl} alt={selected.fullName} className="w-full h-full object-cover object-top absolute inset-0" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${selected.accentColor} flex items-center justify-center text-white font-extrabold text-7xl`}>{selected.initials}</div>
                  )}
            </div>
            <div className="p-6 sm:p-10 md:overflow-y-auto md:max-h-[92vh]">
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 shadow hover:bg-slate-100" aria-label={tr("Yopish")}><X className="w-5 h-5" /></button>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#0284C7] border border-sky-200/80 mb-3">{tr(selected.role)}</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">{selected.fullName}</h2>
            {selected.bio && <p className="mt-5 text-base text-slate-600 leading-relaxed whitespace-pre-line">{tr(selected.bio)}</p>}
            <div className="mt-6 pt-5 border-t border-sky-100/80 space-y-3 text-sm text-slate-600">
              {selected.receptionDays && (
                <div className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-[#0284C7] flex-shrink-0" /><span><strong className="text-slate-800">{tr("Qabul kunlari:")}</strong> {tr(selected.receptionDays)}</span></div>
              )}
              {selected.phone && (
                <div className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-[#0284C7] flex-shrink-0" /><a href={`tel:${selected.phone.replace(/[^+\d]/g, '')}`} className="hover:text-[#0284C7]"><strong className="text-slate-800">{tr("Telefon:")}</strong> {selected.phone}</a></div>
              )}
              {selected.email && (
                <div className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-[#0284C7] flex-shrink-0" /><a href={`mailto:${selected.email}`} className="hover:text-[#0284C7]"><strong className="text-slate-800">{tr("Email:")}</strong> {selected.email}</a></div>
              )}
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
