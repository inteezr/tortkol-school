/**
 * Rahbariyat va o'qituvchilar: bazadagi qatorni sahifada ko'rsatiladigan shaklga keltirish.
 * Ro'yxat sahifalari va alohida sahifalar (/about/leaders/[id], /about/teachers/[id]) bir xil ishlatadi.
 */
import type { SupportedLocale } from '@school/shared';
import { toNewAlphabet } from './alphabet';

export const ACCENTS = ['from-[#031A3F] to-[#5483B3]', 'from-[#052659] to-[#4A6A94]', 'from-[#021024] to-[#052659]', 'from-[#5483B3] to-[#031A3F]'];

const initialsOf = (n: string) => (n || '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('');
const photoOf = (u?: string | null) => (u && (u.startsWith('http') || u.startsWith('/api/files/')) ? u : null);

export type Leader = {
  id: number; fullName: string; role: string; receptionDays: string; phone: string; email: string; bio: string;
  initials: string; accentColor: string; imageUrl: string | null;
};
export type Teacher = {
  id: number; fullName: string; subject: string; category: string; experience: string; bio: string;
  education: string; achievements: string; initials: string; accentColor: string; imageUrl: string | null;
};

export const mapLeader = (l: any, idx: number): Leader => {
  const fullName = toNewAlphabet(l.full_name || l.fullName || '');
  return {
    id: Number(l.id ?? idx + 1),
    fullName,
    role: l.role || '',
    receptionDays: l.reception_days || l.receptionDays || '',
    phone: l.phone || '',
    email: l.email || '',
    bio: l.bio || '',
    initials: initialsOf(fullName),
    accentColor: ACCENTS[idx % ACCENTS.length],
    imageUrl: photoOf(l.photo_url),
  };
};

export const mapTeacher = (t: any, idx: number): Teacher => {
  const fullName = toNewAlphabet(t.full_name || t.fullName || '');
  return {
    id: Number(t.id ?? idx + 1),
    fullName,
    subject: t.subject || '',
    category: t.category || '',
    experience: t.experience || '',
    bio: t.bio || '',
    education: t.education || '',
    achievements: t.achievements || '',
    initials: initialsOf(fullName),
    accentColor: ACCENTS[idx % ACCENTS.length],
    imageUrl: photoOf(t.photo_url),
  };
};

export const leaderHref = (id: number) => `/about/leaders/${id}`;
export const teacherHref = (id: number) => `/about/teachers/${id}`;

type Tr = (s: string) => string;

/** "5" / "5 yil" -> tanlangan tilda "5 yil" / "5 years" / "5 лет" ... */
export function expText(e: string, tr: Tr, locale: SupportedLocale) {
  const m = /^(\d+)\s*(?:yil|yillik|yil\.)?$/i.exec((e || '').trim());
  if (!m) return tr(e);
  const n = Number(m[1]);
  if (locale === 'qq') return `${n} jıl`;
  if (locale === 'en') return `${n} year${n === 1 ? '' : 's'}`;
  if (locale === 'ru') return `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'год' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'года' : 'лет'}`;
  return `${n} yil`;
}

export const subjectOf = (s: string, tr: Tr, locale: SupportedLocale) =>
  locale === 'qq' ? `${tr(s)} páni oqıtıwshısı` : locale === 'ru' ? `Учитель: ${tr(s)}` : locale === 'en' ? `${tr(s)} teacher` : `${s} fani öqituvçisi`;
