'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { SupportedLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@school/shared';
import { translations, TranslationDictionary } from './translations';
import { lookupPhrase, normPhrase } from './phrases';
import { prefetchAll } from './api-store';
import { toNewAlphabet, toOldAlphabet, deepToNew, fixSchoolName } from './alphabet';

const UZ_NEW = deepToNew(translations.uz);

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: TranslationDictionary;
  /** O'zbekcha matnni tanlangan tilga o'tkazadi: lug'at -> bo'lmasa avtomatik tarjima (keshlanadi). */
  tr: (text: string | null | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: UZ_NEW,
  tr: (s) => toNewAlphabet(s ?? ''),
});

const STORE = 'school_tr_cache_v1';
const cache = new Map<string, string>(); // `${locale}|${norm}` -> tarjima
let loaded = false;
const loadStore = () => {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try { Object.entries(JSON.parse(localStorage.getItem(STORE) || '{}')).forEach(([k, v]) => cache.set(k, v as string)); } catch {}
};
const saveStore = () => {
  try {
    const entries = Array.from(cache.entries()).slice(-600);
    localStorage.setItem(STORE, JSON.stringify(Object.fromEntries(entries)));
  } catch {}
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [, setVersion] = useState(0);
  const pending = useRef(new Set<string>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failed = useRef(new Set<string>());

  useEffect(() => {
    loadStore();
    const saved = localStorage.getItem('school_lang') as SupportedLocale;
    if (saved && SUPPORTED_LOCALES.includes(saved)) setLocaleState(saved);
  }, []);

  useEffect(() => {
    const w = window as any;
    if (window.location.pathname.startsWith('/admin')) return; // admin panelda ommaviy sayt ma'lumotlari kerak emas
    const run = () => prefetchAll();
    if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 1500 }); else setTimeout(run, 300);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'qq' ? 'kaa' : locale;
  }, [locale]);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('school_lang', newLocale);
  };

  const flush = useCallback((loc: SupportedLocale) => {
    const batch = Array.from(pending.current);
    pending.current.clear();
    for (let i = 0; i < batch.length; i += 20) {
      const part = batch.slice(i, i + 20);
      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: loc, texts: part }),
      })
        .then((r) => r.json())
        .then((d) => {
          let changed = false;
          (d.translations || []).forEach((tr: string | null, k: number) => {
            if (tr) { cache.set(`${loc}|${part[k]}`, tr); changed = true; } else failed.current.add(`${loc}|${part[k]}`);
          });
          if (changed) { saveStore(); setVersion((v) => v + 1); }
        })
        .catch(() => part.forEach((p) => failed.current.add(`${loc}|${p}`)));
    }
  }, []);

  const tr = useCallback(
    (text: string | null | undefined): string => {
      if (!text) return text ?? '';
      // O'zbek tili — yangi alifboda ko'rsatiladi (bazadagi eski yozuvlar ham)
      if (locale === 'uz') return toNewAlphabet(text);
      if (!/\p{L}/u.test(text) || /^\s*(https?:\/\/|[\w.+-]+@[\w-]+\.)\S*\s*$/.test(text)) return text;
      // Lug'at va tarjima xizmatlari eski yozuvdagi matnni kutadi
      text = toOldAlphabet(text);
      const key = normPhrase(text);
      const known = lookupPhrase(key, locale);
      if (known) return fixSchoolName(known);
      const ck = `${locale}|${text.trim()}`;
      const hit = cache.get(ck);
      if (hit) return fixSchoolName(hit);
      if (typeof window !== 'undefined' && !failed.current.has(ck) && !pending.current.has(text.trim())) {
        pending.current.add(text.trim());
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => flush(locale), 60);
      }
      return text;
    },
    [locale, flush]
  );

  // Birinchi renderdan keyin keshni ochish
  useEffect(() => { loadStore(); setVersion((v) => v + 1); }, [locale]);

  const t = locale === 'uz' ? UZ_NEW : (translations[locale] || UZ_NEW);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const dateLocale = (l: SupportedLocale) => ({ uz: 'uz-UZ', qq: 'ru-RU', ru: 'ru-RU', en: 'en-GB' } as const)[l];

export const useLanguage = () => useContext(LanguageContext);
