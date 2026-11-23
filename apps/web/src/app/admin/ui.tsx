import React from 'react';

/** Admin panel uchun umumiy dizayn elementlari (yumaloq kartalar, yengil soyalar). */
export const card = 'bg-white rounded-2xl border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)]';
export const inputCls = 'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-[#052659] focus:ring-4 focus:ring-[#052659]/10';
export const btnPrimary = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#052659] hover:bg-[#0a3578] text-white text-sm font-semibold transition-colors disabled:opacity-60 active:scale-[0.98]';
export const btnGhost = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors';

const tones = {
  blue: 'bg-[#E6F0FB] text-[#052659]',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  rose: 'bg-rose-50 text-rose-600',
  violet: 'bg-violet-50 text-violet-700',
  slate: 'bg-slate-100 text-slate-600',
} as const;
export type Tone = keyof typeof tones;

export function Pill({ tone = 'slate', dot, children }: { tone?: Tone; dot?: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${tones[tone]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function IconTile({ tone = 'blue', children }: { tone?: Tone; children: React.ReactNode }) {
  return <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>{children}</div>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="py-14 text-center text-sm text-slate-400">{children}</div>;
}

// Server va brauzer bir xil natija chiqarishi uchun sana qo'lda, Toshkent vaqti (UTC+5) bilan formatlanadi
// (toLocaleDateString ICU/vaqt zonasiga qarab farq qiladi va hydration xatosiga olib keladi).
export const MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];
export const dateParts = (v: string | number | Date) => {
  const d = new Date(new Date(v).getTime() + 5 * 3600e3);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes() };
};
const p2 = (n: number) => String(n).padStart(2, '0');
export const fmtDate = (v?: string | null) => { if (!v) return '—'; const t = dateParts(v); return `${p2(t.d)}.${p2(t.m + 1)}.${t.y}`; };
export const fmtDateTime = (v?: string | null) => { if (!v) return 'Yaqinda'; const t = dateParts(v); return `${p2(t.d)}.${p2(t.m + 1)}.${t.y} ${p2(t.h)}:${p2(t.mi)}`; };

const MONTHS_FULL = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
const DAYS = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'];
export const fmtToday = () => {
  const t = dateParts(Date.now());
  const wd = new Date(Date.UTC(t.y, t.m, t.d)).getUTCDay();
  return `${t.d} ${MONTHS_FULL[t.m]} ${t.y}, ${DAYS[wd]}`;
};
