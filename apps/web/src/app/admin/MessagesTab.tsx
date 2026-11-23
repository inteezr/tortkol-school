'use client';

import React, { useMemo, useState } from 'react';
import { Check, CheckCircle2, Clock, Phone, Trash2 } from 'lucide-react';
import { card, Pill, Empty, fmtDateTime } from './ui';

export default function MessagesTab({ messages, onRead, onDelete }: { messages: any[]; onRead: (id: number) => void; onDelete: (id: number) => void }) {
  const [filter, setFilter] = useState<'all' | 'new' | 'read'>('all');
  const unread = useMemo(() => messages.filter((m) => m.status === 'new').length, [messages]);
  const list = useMemo(() => messages.filter((m) => filter === 'all' || (filter === 'new' ? m.status === 'new' : m.status !== 'new')), [messages, filter]);
  const tabs: [typeof filter, string, number][] = [['all', 'Barçasi', messages.length], ['new', 'Yangi', unread], ['read', 'Körilgan', messages.length - unread]];

  return (
    <div className="space-y-4 adm-fade">
      <div className={`${card} p-3 sm:p-4 flex flex-wrap gap-1.5`}>
        {tabs.map(([k, label, n]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${filter === k ? 'bg-[#052659] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {label} <span className={filter === k ? 'text-white/70' : 'text-slate-400'}>{n}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className={card}><Empty>Hozirça heç qanday murojaat yöq</Empty></div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {list.map((m) => (
            <div key={m.id} className={`${card} p-5 space-y-3.5`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F0FB] text-[#052659] flex items-center justify-center font-semibold shrink-0">{(m.full_name || 'M')[0]}</div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 truncate flex items-center gap-2">{m.full_name}{m.status === 'new' && <Pill tone="rose" dot>Yangi</Pill>}</div>
                    <a href={`tel:${m.phone}`} className="text-xs text-[#052659] font-medium hover:underline inline-flex items-center gap-1"><Phone className="w-3 h-3" />{m.phone}</a>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  {m.status === 'new' ? (
                    <button onClick={() => onRead(m.id)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"><Check className="w-3.5 h-3.5" />Körildi</button>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Körilgan</span>
                  )}
                  <button onClick={() => onDelete(m.id)} title="Öçiriş" className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-800">{m.subject}</div>
              <div className="rounded-xl bg-slate-50 p-3.5 text-sm text-slate-600 leading-relaxed whitespace-pre-line">{m.message}</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5"><Clock className="w-3 h-3" />{fmtDateTime(m.created_at)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
