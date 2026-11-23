'use client';

import { useEffect, useState } from 'react';

// Oddiy "stale-while-revalidate" kesh: ma'lumot xotirada va localStorage'da saqlanadi,
// sahifa ochilishi bilan darhol ko'rsatiladi, orqa fonda yangilanadi.
const mem = new Map<string, any>();
const inflight = new Map<string, Promise<any>>();
// Server sahifa bilan birga yuborgan (yangi) ma'lumot: bular uchun tarmoqqa so'rov yuborilmaydi.
const seeded = new Set<string>();

/** Serverdan kelgan ma'lumotni keshga qo'yadi (localStorage'dagi eski nusxadan ustun). */
export function seedJson(entries: Record<string, any>) {
  for (const [url, data] of Object.entries(entries)) {
    if (data == null || !validShape(url, data)) continue;
    mem.set(url, data);
    seeded.add(url);
  }
}
const LS = 'school_api_v2:'; // v2: eski (buzilgan) keshni tozalaydi

const readLS = (url: string) => {
  try { const v = localStorage.getItem(LS + url); return v ? JSON.parse(v) : null; } catch { return null; }
};
const writeLS = (url: string, data: any) => {
  try { localStorage.setItem(LS + url, JSON.stringify(data)); } catch {}
};

/** Javob URL'ga mos kutilgan shaklda ekanini tekshiradi (masalan ?scope=leaders -> { leaders: [...] }). */
function validShape(url: string, d: any) {
  if (!d || typeof d !== 'object' || d.error) return false;
  const scope = new URL(url, 'http://x').searchParams.get('scope');
  if (scope) return Array.isArray(d[scope]);
  if (url.startsWith('/api/posts')) return Array.isArray(d.posts);
  if (url.startsWith('/api/gallery')) return Array.isArray(d.albums);
  return true;
}

export function fetchJson(url: string): Promise<any> {
  const running = inflight.get(url);
  if (running) return running;
  const p = fetch(url)
    .then(async (r) => {
      const d = await r.json().catch(() => null);
      // Xato yoki noto'g'ri javob keshdagi yaxshi ma'lumotni ustidan yozmasligi kerak
      if (!r.ok || !validShape(url, d)) throw new Error('Notöğri javob');
      mem.set(url, d);
      writeLS(url, d);
      return d;
    })
    .finally(() => inflight.delete(url));
  inflight.set(url, p);
  return p;
}

export const API_URLS = ['/api/posts', '/api/teachers?scope=leaders', '/api/teachers?scope=teachers'];

/** Asosiy ma'lumotlarni oldindan yuklab qo'yadi (bo'sh vaqtda). */
export function prefetchAll() {
  API_URLS.forEach((u) => { if (!seeded.has(u)) fetchJson(u).catch(() => {}); });
}

export function useApiJson<T = any>(url: string | null): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(() => (url ? mem.get(url) ?? null : null));
  const [loading, setLoading] = useState(() => !(url && mem.has(url)));

  useEffect(() => {
    if (!url) return;
    let alive = true;
    const cached = mem.get(url) ?? readLS(url);
    if (cached) { mem.set(url, cached); setData(cached); setLoading(false); }
    if (seeded.has(url)) return;
    fetchJson(url)
      .then((d) => { if (alive) { setData(d); setLoading(false); } })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [url]);

  return { data, loading };
}

/** Keshdagi ma'lumotni darhol beradi, so'ng yangisini olib yana beradi. */
export function loadJson(url: string, cb: (data: any) => void, done?: () => void) {
  const cached = mem.get(url) ?? readLS(url);
  if (cached) { mem.set(url, cached); cb(cached); done?.(); }
  if (seeded.has(url)) return;
  fetchJson(url).then((d) => { cb(d); done?.(); }).catch(() => done?.());
}

export const peekJson = (url: string) => mem.get(url) ?? readLS(url);
