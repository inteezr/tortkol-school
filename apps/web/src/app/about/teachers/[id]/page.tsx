'use client';

import React from 'react';
import { Award, BookOpen } from 'lucide-react';
import { useLanguage } from '../../../../lib/LanguageContext';
import { useApiJson } from '../../../../lib/api-store';
import { mapTeacher, expText, subjectOf } from '../../../../lib/staff';
import { StaffDetail, StaffNotFound } from '../../../../components/StaffDetail';

export default function OqituvchiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { t, tr, locale } = useLanguage();
  // Ro'yxat sahifa bilan birga keladi (server) — alohida so'rov yo'q
  const { data, loading } = useApiJson<{ teachers: any[] }>('/api/teachers?scope=teachers');
  const teacher = (data?.teachers || []).map(mapTeacher).find((x) => String(x.id) === id);
  const back = { backHref: '/about/teachers', backLabel: t.nav.teachers };

  if (!teacher) return loading ? <div className="py-24" /> : <StaffNotFound {...back} text={tr("Öqituvçi topilmadi.")} />;

  return (
    <StaffDetail {...back} name={teacher.fullName} imageUrl={teacher.imageUrl} initials={teacher.initials} accentColor={teacher.accentColor}>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">{teacher.fullName}</h1>
      {teacher.subject && <div className="text-base font-bold text-blue-600 mt-1">{subjectOf(teacher.subject, tr, locale)}</div>}
      <div className="flex flex-wrap gap-2 mt-2">
        {teacher.category && <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">{tr(teacher.category)}</span>}
        {teacher.experience && <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">{expText(teacher.experience, tr, locale)} {tr('tajriba')}</span>}
      </div>
      <div className="mt-6 space-y-5 text-base text-slate-600 leading-relaxed">
        {teacher.bio && <p className="whitespace-pre-line">{tr(teacher.bio)}</p>}
        {teacher.education && (
          <div><div className="flex items-center gap-2 font-bold text-slate-900 mb-1"><BookOpen className="w-4 h-4 text-blue-600" />{tr("Ma'lumoti")}</div><p className="whitespace-pre-line">{tr(teacher.education)}</p></div>
        )}
        {teacher.achievements && (
          <div><div className="flex items-center gap-2 font-bold text-slate-900 mb-1"><Award className="w-4 h-4 text-blue-600" />{tr('Yutuqlari')}</div><p className="whitespace-pre-line">{tr(teacher.achievements)}</p></div>
        )}
        {!teacher.bio && !teacher.education && !teacher.achievements && <p className="text-slate-400">{tr("Qöşimça ma'lumot kiritilmagan.")}</p>}
      </div>
    </StaffDetail>
  );
}
