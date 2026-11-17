'use client';

import { useEffect, useState } from 'react';

// Oddiy "stale-while-revalidate" kesh: ma'lumot xotirada va localStorage'da saqlanadi,
// sahifa ochilishi bilan darhol ko'rsatiladi, orqa fonda yangilanadi.
const mem = new Map<string, any>();
const inflight = new Map<string, Promise<any>>();
const LS = 'school_api_v1:';

const readLS = (url: string) => {
  try { const v = localStorage.getItem(LS + url); return v ? JSON.parse(v) : null; } catch { return null; }
};
const writeLS = (url: string, data: any) => {
  try { localStorage.setItem(LS + url, JSON.stringify(data)); } catch {}
};

export function fetchJson(url: string): Promise<any> {
  const running = inflight.get(url);
  if (running) return running;
  const p = fetch(url)
    .then((r) => r.json())
    .then((d) => {
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
  API_URLS.forEach((u) => { fetchJson(u).catch(() => {}); });
}

export function useApiJson<T = any>(url: string | null): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(() => (url ? mem.get(url) ?? null : null));
  const [loading, setLoading] = useState(() => !(url && mem.has(url)));

  useEffect(() => {
    if (!url) return;
    let alive = true;
    const cached = mem.get(url) ?? readLS(url);
    if (cached) { mem.set(url, cached); setData(cached); setLoading(false); }
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
  fetchJson(url).then((d) => { cb(d); done?.(); }).catch(() => done?.());
}

export const peekJson = (url: string) => mem.get(url) ?? readLS(url);
