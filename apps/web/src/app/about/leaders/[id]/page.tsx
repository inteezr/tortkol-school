'use client';

import React from 'react';
import { Calendar, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../../../../lib/LanguageContext';
import { useApiJson } from '../../../../lib/api-store';
import { mapLeader } from '../../../../lib/staff';
import { StaffDetail, StaffNotFound } from '../../../../components/StaffDetail';

export default function RahbarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { t, tr } = useLanguage();
  // Ro'yxat sahifa bilan birga keladi (server) — alohida so'rov yo'q
  const { data, loading } = useApiJson<{ leaders: any[] }>('/api/teachers?scope=leaders');
  const leader = (data?.leaders || []).map(mapLeader).find((l) => String(l.id) === id);
  const back = { backHref: '/about/leaders', backLabel: t.nav.leadership };

  if (!leader) return loading ? <div className="py-24" /> : <StaffNotFound {...back} text={tr('Rahbar topilmadi.')} />;

  return (
    <StaffDetail {...back} name={leader.fullName} imageUrl={leader.imageUrl} initials={leader.initials} accentColor={leader.accentColor}>
      <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#052659] border border-sky-200/80 mb-3">{tr(leader.role)}</div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">{leader.fullName}</h1>
      {leader.bio && <p className="mt-5 text-base text-slate-600 leading-relaxed whitespace-pre-line">{tr(leader.bio)}</p>}
      <div className="mt-6 pt-5 border-t border-sky-100/80 space-y-3 text-sm text-slate-600">
        {leader.receptionDays && (
          <div className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-[#052659] flex-shrink-0" /><span><strong className="text-slate-800">{tr('Qabul kunlari:')}</strong> {tr(leader.receptionDays)}</span></div>
        )}
        {leader.phone && (
          <div className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-[#052659] flex-shrink-0" /><a href={`tel:${leader.phone.replace(/[^+\d]/g, '')}`} className="hover:text-[#052659]"><strong className="text-slate-800">{tr('Telefon:')}</strong> {leader.phone}</a></div>
        )}
        {leader.email && (
          <div className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-[#052659] flex-shrink-0" /><a href={`mailto:${leader.email}`} className="hover:text-[#052659]"><strong className="text-slate-800">{tr('Email:')}</strong> {leader.email}</a></div>
        )}
      </div>
    </StaffDetail>
  );
}
