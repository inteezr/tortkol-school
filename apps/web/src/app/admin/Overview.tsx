'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, Users, School, Mail, ArrowUpRight, ExternalLink, Trash2, Clock } from 'lucide-react';
import { card, Pill, IconTile, Empty, fmtDate, dateParts, MONTHS } from './ui';
import { postCategory } from '../../lib/post-categories';

type Props = {
  posts: any[]; teachers: any[]; leaders: any[]; messages: any[];
  onGo: (tab: 'posts' | 'staff' | 'messages') => void;
  onDeletePost: (id: number, title: string) => void;
  onReadMessage: (id: number) => void;
};

export default function Overview({ posts, teachers, leaders, messages, onGo, onDeletePost }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const unread = useMemo(() => messages.filter((m) => m.status === 'new').length, [messages]);
  const read = messages.length - unread;
  const pct = messages.length ? Math.round((read / messages.length) * 100) : 0;

  const { monthly, thisMonth } = useMemo(() => {
    const now = dateParts(Date.now());
    const months = Array.from({ length: 8 }, (_, i) => {
      const idx = now.y * 12 + now.m - (7 - i);
      const y = Math.floor(idx / 12), m = idx % 12;
      return { key: `${y}-${m}`, label: MONTHS[m], count: 0 };
    });
    posts.forEach((p) => {
      if (!p.published_at) return;
      const d = dateParts(p.published_at);
      const m = months.find((x) => x.key === `${d.y}-${d.m}`);
      if (m) m.count += 1;
    });
    return { monthly: months, thisMonth: months[months.length - 1].count };
  }, [posts]);
  const max = Math.max(3, ...monthly.map((m) => m.count));
  const ticks = [max, Math.round((max * 2) / 3), Math.round(max / 3), 0];

  const circ = 2 * Math.PI * 44;

  return (
    <div className="space-y-4 adm-fade">
      {/* KPI kartalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Kpi icon={<FileText className="w-5 h-5" />} tone="blue" label="Jami materiallar" value={posts.length}
          pill={<Pill tone="green">+{thisMonth} bu oy</Pill>} note="Yangilik va ta’lim maqolalari" onClick={() => onGo('posts')} />
        <Kpi icon={<Users className="w-5 h-5" />} tone="violet" label="Öqituvçilar" value={teachers.length}
          pill={<Pill tone="green" dot>faol</Pill>} note="Saytda ko‘rinadigan pedagoglar" onClick={() => onGo('staff')} />
        <Kpi icon={<School className="w-5 h-5" />} tone="amber" label="Ma’muriyat" value={leaders.length}
          pill={null} note="Direktor va o‘rinbosarlar" onClick={() => onGo('staff')} />
        <Kpi icon={<Mail className="w-5 h-5" />} tone="rose" label="Murojaatlar" value={messages.length}
          pill={unread > 0 ? <Pill tone="rose" dot>{unread} yangi</Pill> : <Pill tone="green">hammasi ko‘rilgan</Pill>}
          note={unread > 0 ? 'Javob kutayotgan murojaatlar bor' : 'Yangi murojaat yo‘q'} onClick={() => onGo('messages')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Grafik */}
        <div className={`${card} xl:col-span-2 p-5 sm:p-6`}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <IconTile><FileText className="w-5 h-5" /></IconTile>
              <h3 className="text-lg font-semibold text-slate-900">Naşrlar dinamikasi</h3>
            </div>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">Oxirgi 8 oy</span>
          </div>
          <div className="relative h-56 pl-8">
            {ticks.map((t, g) => (
              <div key={g} className="absolute left-0 right-0 border-t border-dashed border-slate-200" style={{ top: `${(g / 3) * 86}%` }}>
                <span className="absolute -top-2 left-0 bg-white pr-1 text-[10px] text-slate-400">{t}</span>
              </div>
            ))}
            <div className="absolute inset-0 pl-8 flex items-end gap-2 sm:gap-3">
              {monthly.map((m, i) => (
                <div key={m.key} className="relative flex-1 h-full flex flex-col justify-end items-center gap-2" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                  {hover === i && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full bg-slate-900 text-white rounded-lg px-3 py-1.5 text-xs whitespace-nowrap z-20 shadow-lg">
                      <span className="capitalize">{m.label}</span>: <b>{m.count}</b> ta
                    </div>
                  )}
                  <div className="w-full flex-1 flex items-end" style={{ maxHeight: '86%' }}>
                    <div
                      className={`adm-bar w-full rounded-lg transition-colors ${hover === i ? 'bg-gradient-to-t from-[#052659] to-[#5483B3]' : 'bg-gradient-to-t from-[#CFE0F5] to-[#E6F0FB]'}`}
                      style={{ height: `${Math.max(6, (m.count / max) * 100)}%`, animationDelay: `${i * 40}ms` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 capitalize h-4">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Murojaatlar halqasi */}
        <div className={`${card} p-5 sm:p-6 flex flex-col`}>
          <div className="flex items-center gap-3">
            <IconTile tone="rose"><Mail className="w-5 h-5" /></IconTile>
            <h3 className="text-lg font-semibold text-slate-900">Murojaatlar holati</h3>
          </div>
          <div className="relative mx-auto my-5 w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#E6F0FB" strokeWidth="9" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#052659" strokeWidth="9" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset .6s ease' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-semibold text-slate-900">{pct}%</div>
              <div className="text-[11px] text-slate-500">körib çiqilgan</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <div className="rounded-xl bg-slate-50 p-3.5"><div className="text-xs text-slate-500">Körilgan</div><div className="text-xl font-semibold mt-1">{read}</div></div>
            <div className="rounded-xl bg-slate-50 p-3.5"><div className="text-xs text-slate-500">Yangi</div><div className="text-xl font-semibold mt-1">{unread}</div></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* So'nggi materiallar */}
        <div className={`${card} xl:col-span-2 p-5 sm:p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Sönggi materiallar</h3>
            <button onClick={() => onGo('posts')} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors">
              Barçasi <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 text-xs bg-slate-50">
                  <th className="py-2.5 px-3 rounded-l-lg font-medium">Sarlavha</th>
                  <th className="py-2.5 px-3 font-medium">Turkum</th>
                  <th className="py-2.5 px-3 font-medium">Holati</th>
                  <th className="py-2.5 px-3 font-medium">Sana</th>
                  <th className="py-2.5 px-3 rounded-r-lg" />
                </tr>
              </thead>
              <tbody>
                {posts.slice(0, 5).map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-[16rem] truncate">{p.title}</td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs font-semibold text-[#052659]">{postCategory(p) ? postCategory(p)!.label : <span className="text-slate-400 font-normal">—</span>}</td>
                    <td className="py-3 px-3"><Pill tone={p.status === 'published' ? 'green' : 'amber'} dot>{p.status === 'published' ? 'Naşrda' : 'Qoralama'}</Pill></td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{fmtDate(p.published_at)}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <Link href={`/news/${p.slug}`} target="_blank" title="Saytda köriş" className="p-2 rounded-lg text-slate-400 hover:text-[#052659] hover:bg-[#E6F0FB]"><ExternalLink className="w-4 h-4" /></Link>
                        <button onClick={() => onDeletePost(p.id, p.title)} title="Öçiriş" className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && <Empty>Hozirça materiallar yöq.</Empty>}
          </div>
        </div>

        {/* So'nggi murojaatlar */}
        <div className={`${card} p-5 sm:p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Sönggi murojaatlar</h3>
            <button onClick={() => onGo('messages')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowUpRight className="w-4 h-4" /></button>
          </div>
          <div className="space-y-2.5">
            {messages.slice(0, 4).map((m) => (
              <button key={m.id} onClick={() => onGo('messages')} className="w-full text-left rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-slate-900 truncate">{m.full_name}</span>
                  {m.status === 'new' && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">{m.subject}</div>
                <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1"><Clock className="w-3 h-3" />{fmtDate(m.created_at)}</div>
              </button>
            ))}
            {messages.length === 0 && <Empty>Murojaatlar yöq</Empty>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon, tone, label, value, pill, note, onClick }: { icon: React.ReactNode; tone: any; label: string; value: number; pill: React.ReactNode; note: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`${card} text-left p-5 hover:border-[#052659]/30 hover:shadow-md transition-all`}>
      <div className="flex items-center gap-3">
        <IconTile tone={tone}>{icon}</IconTile>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <div className="mt-4 text-4xl font-semibold text-slate-900 tracking-tight">{value}</div>
      <div className="mt-2.5 min-h-[26px] flex items-center">{pill}</div>
      <div className="mt-1 text-xs text-slate-500 leading-snug">{note}</div>
    </button>
  );
}
