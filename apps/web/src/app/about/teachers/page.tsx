'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { loadJson } from '../../../lib/api-store';
import { Search } from 'lucide-react';
import { StaffCard } from '../../../components/StaffCard';
import { mapTeacher, teacherHref, expText as expTextOf, type Teacher } from '../../../lib/staff';

export default function OqituvchilarPage() {
  const { t, tr, locale } = useLanguage();
  const expText = (e: string) => expTextOf(e, tr, locale);
  const [selectedSubject, setSelectedSubject] = useState('Barçasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    loadJson('/api/teachers?scope=teachers', (data) => {
        if (data.teachers && data.teachers.length > 0) {
          setTeachers(data.teachers.map(mapTeacher));
        }
      }, () => setLoading(false));
  }, []);

  const subjects = ['Barçasi', ...Array.from(new Set(teachers.map((x) => x.subject).filter(Boolean)))];

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSubject = selectedSubject === 'Barçasi' || teacher.subject === selectedSubject;
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
            {tr("Maktabimizda öquvçilarga ta'lim beruvçi oliy toifali pedagoglar va xalqaro darajadagi mutaxassislar.")}
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
                    ? 'bg-gradient-to-r from-[#052659] to-[#5483B3] text-white shadow-md shadow-sky-500/25'
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
              placeholder={tr("Ustozni qidiriş...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>

        {!loading && filteredTeachers.length === 0 && (
          <p className="text-center text-slate-500 py-16">{tr("Hozirça ma'lumot kiritilmagan.")}</p>
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
                href={teacherHref(teacher.id)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
