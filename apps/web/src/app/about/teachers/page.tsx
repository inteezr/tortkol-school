'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { loadJson } from '../../../lib/api-store';
import { Search, X, Award, BookOpen } from 'lucide-react';
import { StaffCard } from '../../../components/StaffCard';

const ACCENTS = ["from-blue-600 to-indigo-600", "from-purple-600 to-indigo-600", "from-emerald-600 to-teal-600", "from-rose-600 to-orange-600"];

export default function OqituvchilarPage() {
  const { t, tr, locale } = useLanguage();
  const expText = (e: string) => {
    const m = /^(\d+)\s*(?:yil|yillik|yil\.)?$/i.exec((e || '').trim());
    if (!m) return tr(e);
    const n = Number(m[1]);
    if (locale === 'qq') return `${n} jıl`;
    if (locale === 'en') return `${n} year${n === 1 ? '' : 's'}`;
    if (locale === 'ru') return `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'год' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'года' : 'лет'}`;
    return `${n} yil`;
  };
  const subjectOf = (s: string) => locale === 'qq' ? `${tr(s)} páni oqıtıwshısı` : locale === 'ru' ? `Учитель: ${tr(s)}` : locale === 'en' ? `${tr(s)} teacher` : `${s} fani o‘qituvchisi`;
  const [selectedSubject, setSelectedSubject] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    loadJson('/api/teachers?scope=teachers', (data) => {
        if (data.teachers && data.teachers.length > 0) {
          setTeachers(data.teachers.map((teach: any, idx: number) => ({
            id: teach.id || idx + 1,
            fullName: teach.full_name || teach.fullName,
            subject: teach.subject || '',
            category: teach.category,
            experience: teach.experience || '',
            bio: teach.bio,
            education: teach.education || '',
            achievements: teach.achievements || '',
            initials: (teach.full_name || teach.fullName).split(' ').slice(0, 2).map((w: string) => w[0]).join(''),
            accentColor: ACCENTS[idx % ACCENTS.length],
            imageUrl: (teach.photo_url?.startsWith('http') || teach.photo_url?.startsWith('/api/files/')) ? teach.photo_url : null,
          })));
        }
      }, () => setLoading(false));
  }, []);

  const subjects = ['Barchasi', ...Array.from(new Set(teachers.map((x) => x.subject).filter(Boolean)))];

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSubject = selectedSubject === 'Barchasi' || teacher.subject === selectedSubject;
    const matchesSearch = teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.nav.teachers}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            {tr("Maktabimizda o'quvchilarga ta'lim beruvchi oliy toifali pedagoglar va xalqaro darajadagi mutaxassislar.")}
          </p>
        </div>

        {/* Filtr va Qidiruv */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Fanlar bo'yicha tablar */}
          <div className="flex flex-wrap gap-2">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedSubject === sub
                    ? 'bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white shadow-md shadow-sky-500/25'
                    : 'bg-white border border-sky-100 text-slate-700 hover:bg-sky-50'
                }`}
              >
                {tr(sub)}
              </button>
            ))}
          </div>

          {/* Qidiruv input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={tr("Ustozni qidirish...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        {!loading && filteredTeachers.length === 0 && (
          <p className="text-center text-slate-500 py-16">{tr("Hozircha ma'lumot kiritilmagan.")}</p>
        )}

        {/* Ustozlar: to'liq kenglikda 4 ta ustun */}
        {filteredTeachers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredTeachers.map((teacher, i) => (
              <StaffCard
                key={teacher.id}
                index={i}
                name={teacher.fullName}
                chip={tr(teacher.subject)}
                text={[tr(teacher.category), teacher.experience && `${expText(teacher.experience)} ${tr('tajriba')}`].filter(Boolean).join(' · ')}
                photoUrl={teacher.imageUrl}
                onClick={() => setSelected(teacher)}
              />
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
                    <div className={`w-full h-full bg-gradient-to-br ${selected.accentColor} flex items-center justify-center text-white font-bold text-7xl`}>{selected.initials}</div>
                  )}
            </div>
            <div className="p-6 sm:p-10 md:overflow-y-auto md:max-h-[92vh]">
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 shadow hover:bg-slate-100" aria-label={tr("Yopish")}><X className="w-5 h-5" /></button>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">{selected.fullName}</h2>
                  <div className="text-base font-bold text-blue-600 mt-1">{subjectOf(selected.subject)}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selected.category && <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">{tr(selected.category)}</span>}
                    {selected.experience && <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">{expText(selected.experience)} {tr('tajriba')}</span>}
                  </div>
                </div>
            <div className="mt-6 space-y-5 text-base text-slate-600 leading-relaxed">
              {selected.bio && <p>{tr(selected.bio)}</p>}
              {selected.education && (
                <div><div className="flex items-center gap-2 font-bold text-slate-900 mb-1"><BookOpen className="w-4 h-4 text-blue-600" />{tr("Ma'lumoti")}</div><p className="whitespace-pre-line">{tr(selected.education)}</p></div>
              )}
              {selected.achievements && (
                <div><div className="flex items-center gap-2 font-bold text-slate-900 mb-1"><Award className="w-4 h-4 text-blue-600" />{tr("Yutuqlari")}</div><p className="whitespace-pre-line">{tr(selected.achievements)}</p></div>
              )}
              {!selected.bio && !selected.education && !selected.achievements && <p className="text-slate-400">{tr("Qo'shimcha ma'lumot kiritilmagan.")}</p>}
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
