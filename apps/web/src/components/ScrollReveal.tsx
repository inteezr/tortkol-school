'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Scroll paytida bloklarni silliq chiqarish (AOS uslubida).
 *
 * <main> ichidagi kontent avtomatik bo'linadi:
 *  - grid elementlari ketma-ket (ustunlar bo'yicha kechikish bilan) pastdan chiqadi;
 *  - 2 ustunli grid: chap blok chapdan, o'ng blok o'ngdan kiradi;
 *  - qolgan bloklar pastdan "fade-up" bo'ladi.
 * Aniq effekt kerak bo'lsa: data-reveal="up|down|left|right|zoom" (+ data-reveal-delay="ms").
 * Avtomatik animatsiyadan chiqarish: data-no-reveal.
 */

type Kind = 'up' | 'down' | 'left' | 'right' | 'zoom';
const DURATION = 1000;
const isLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function ScrollReveal() {
  const pathname = usePathname();
  const firstScan = useRef(true);

  isLayoutEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const vh = () => window.innerHeight;
    const timers: number[] = [];

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        el.classList.add('rv-in');
        const delay = parseInt(el.style.getPropertyValue('--rv-d') || '0', 10) || 0;
        // Tugagach yordamchi klasslar olib tashlanadi — elementning o'z hover/transition effektlari qaytadi.
        timers.push(window.setTimeout(() => {
          el.classList.remove('rv', 'rv-in');
          el.style.removeProperty('--rv-d');
        }, DURATION + delay + 80));
      }
    }, { rootMargin: '0px 0px -120px 0px', threshold: 0 });

    const animate = (el: HTMLElement, kind: Kind, delay: number, skipInView: boolean) => {
      el.dataset.rv = kind;
      if (skipInView) {
        // Birinchi yuklanishda ekranda ko'rinib turgan kontent yashirilmaydi (miltillash bo'lmasin).
        const r = el.getBoundingClientRect();
        if (r.top < vh() && r.bottom > 0) return;
      }
      if (delay) el.style.setProperty('--rv-d', `${delay}ms`);
      el.classList.add('rv');
      io.observe(el);
    };

    const skip = (el: HTMLElement, cs: CSSStyleDeclaration) =>
      el.hasAttribute('data-no-reveal') ||
      cs.display === 'none' || cs.position === 'absolute' || cs.position === 'fixed' ||
      el.offsetHeight === 0 ||
      // framer-motion o'zi boshqarayotgan elementlar
      (el.style.opacity !== '' || el.style.transform !== '');

    const walk = (el: HTMLElement, depth: number, skipInView: boolean) => {
      if (el.dataset.rv) return; // allaqachon ishlangan
      const cs = getComputedStyle(el);
      if (skip(el, cs)) return;

      const explicit = el.dataset.reveal as Kind | undefined;
      if (explicit) {
        animate(el, explicit, parseInt(el.dataset.revealDelay || '0', 10) || 0, skipInView);
        return;
      }

      const kids = Array.from(el.children).filter((c): c is HTMLElement => c instanceof HTMLElement);

      if (depth > 0 && cs.display === 'grid' && kids.length >= 2) {
        const cols = Math.max(1, cs.gridTemplateColumns.split(' ').filter(Boolean).length);
        kids.forEach((k, i) => {
          if (k.dataset.rv || skip(k, getComputedStyle(k))) return;
          if (k.dataset.reveal) return walk(k, depth + 1, skipInView);
          const col = i % cols;
          const row = Math.floor(i / cols);
          let kind: Kind;
          if (cols === 1) kind = i % 2 ? 'left' : 'right';            // bitta ustun: navbatma-navbat ikki tomondan
          else if (col === 0) kind = 'right';                          // chap ustun chapdan kiradi
          else if (col === cols - 1) kind = 'left';                    // o'ng ustun o'ngdan kiradi
          else kind = row % 2 ? 'up' : 'zoom';                         // o'rtadagilar pastdan / zoom
          animate(k, kind, Math.min(col * 150, 600), skipInView); // staggerChildren .15
        });
        return;
      }

      // Katta o'ram (bo'lim / konteyner) — ichiga kiramiz; kichik blok — bitta bo'lib chiqadi.
      const cls = typeof el.className === 'string' ? el.className : '';
      const wrapper =
        depth === 0 || el.tagName === 'SECTION' ||
        /(^|\s)(max-w-|mx-auto|container|space-y-)/.test(cls) ||
        !!el.querySelector('.grid') ||
        (kids.length > 0 && el.offsetHeight > vh() * 0.85) ||
        (kids.length === 1 && depth < 3);
      if (wrapper && depth < 12) {
        kids.forEach((k) => walk(k, depth + 1, skipInView));
        return;
      }
      if (depth > 0) {
        // Yakka bloklar: sarlavhalar pastdan, qolganlari navbatma-navbat chap/o'ngdan
        const heading = /^H[1-3]$/.test(el.tagName) || !!el.querySelector(':scope > h1, :scope > h2');
        const kind: Kind = heading ? 'up' : (leafCount++ % 2 ? 'left' : 'right');
        animate(el, kind, 0, skipInView);
      }
    };
    let leafCount = 0;

    const scan = (skipInView: boolean) => walk(main as HTMLElement, 0, skipInView);

    scan(firstScan.current);
    firstScan.current = false;

    // Keyin yuklanadigan kontent (yangiliklar, rasmlar...) uchun qayta skanerlash
    let t = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(() => scan(false), 120);
    });
    mo.observe(main, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
      window.clearTimeout(t);
      timers.forEach(clearTimeout);
      main.querySelectorAll<HTMLElement>('.rv').forEach((el) => el.classList.remove('rv', 'rv-in'));
    };
  }, [pathname]);

  return null;
}
