'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';
import { SupportedLocale } from '@school/shared';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ArrowUpRight,
  School,
  Sparkles
} from 'lucide-react';

const LangSelect: React.FC = () => {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const languages: { code: SupportedLocale; label: string }[] = [
    { code: 'uz', label: 'Uz' },
    { code: 'qq', label: 'Qq' },
    { code: 'ru', label: 'Ru' },
    { code: 'en', label: 'En' },
  ];
  const current = languages.find((l) => l.code === locale)?.label ?? 'Uz';

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Til"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-3 py-2 rounded-none border border-gray-300 hover:border-gray-400 text-sm font-semibold text-slate-800 hover:bg-sky-50 outline-none transition-colors duration-300"
      >
        <span>{current}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`absolute right-0 top-full mt-1 min-w-full w-20 bg-white rounded-none shadow-xl shadow-sky-900/10 border border-sky-100 py-1 z-50 origin-top transition-all duration-300 ease-out ${open ? 'opacity-100 translate-y-0 scale-100 visible' : 'opacity-0 -translate-y-2 scale-95 invisible pointer-events-none'}`}>
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => { setLocale(l.code); setOpen(false); }}
            className={`w-full text-left px-4 py-2 text-sm font-semibold rounded-none transition-colors duration-200 hover:bg-sky-50 ${locale === l.code ? 'text-[#052659] bg-sky-50' : 'text-slate-700'}`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { t, tr } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Joy egallovchi: header fixed bo'lgani uchun kontent sakramasligi uchun */}
      <div aria-hidden className="h-20" />

    <header className="fixed inset-x-0 top-0 z-50 w-full font-poppins">
      {/* Asosiy Navbar - Glassmorphism va Yorug' Moviy Uslub */}
      <div className={`backdrop-blur-md border-b border-sky-100 transition-[background-color,box-shadow] duration-300 ease-out ${scrolled ? 'bg-white/95 shadow-lg shadow-sky-900/10' : 'bg-white/80 shadow-xs'}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between`}>
          {/* Maktab logosi va rasmiy nomi */}
          <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#031A3F] via-[#052659] to-[#5483B3] text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
              <School className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight tracking-tight group-hover:text-[#052659] transition-colors">
                Törtköl IM
              </div>
            </div>
          </Link>

          {/* Desktop Navigatsiya */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 ml-auto">
          <nav className="flex items-center gap-4 xl:gap-8 whitespace-nowrap">
            {/* Biz haqimizda (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button className="flex items-center gap-1 py-2 text-sm xl:text-[15px] font-semibold text-slate-800 hover:text-[#052659] transition-colors">
                <span>{t.nav.about}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${aboutOpen ? 'rotate-180 text-[#052659]' : ''}`} />
              </button>
              {(
                <div className={`absolute top-full left-0 mt-1 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 w-60 bg-white rounded-none shadow-xl shadow-sky-900/10 border border-sky-100 py-2.5 z-50 origin-top transition-all duration-300 ease-out ${aboutOpen ? 'opacity-100 translate-y-0 scale-100 visible' : 'opacity-0 -translate-y-2 scale-95 invisible pointer-events-none'}`}>
                  <Link href="/about/school" className="block px-4 py-2.5 text-xs font-semibold text-[#052659] hover:bg-sky-50 hover:pl-5 transition-all duration-200 rounded-none">
                    {t.nav.aboutSchool}
                  </Link>
                  <Link href="/about/leaders" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#052659] hover:bg-sky-50 hover:pl-5 transition-all duration-200 rounded-none">
                    {t.nav.leadership}
                  </Link>
                  <Link href="/about/teachers" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#052659] hover:bg-sky-50 hover:pl-5 transition-all duration-200 rounded-none">
                    {t.nav.teachers}
                  </Link>
                  <Link href="/about/gallery" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#052659] hover:bg-sky-50 hover:pl-5 transition-all duration-200 rounded-none">
                    {t.nav.gallery}
                  </Link>
                  <Link href="/news" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#052659] hover:bg-sky-50 hover:pl-5 transition-all duration-200 rounded-none">
                    {t.nav.news}
                  </Link>
                </div>
              )}
            </div>

            {/* Qabul */}
            <Link 
              href="/admission" 
              className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-[#052659] after:rounded-full after:transition-all after:duration-300 hover:after:w-full text-sm xl:text-[15px] font-semibold text-slate-800 hover:text-[#052659] transition-colors duration-300 py-2"
            >
              {t.nav.admission}
            </Link>

            {/* Ta'lim */}
            <Link
              href="/education"
              className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-[#052659] after:rounded-full after:transition-all after:duration-300 hover:after:w-full text-sm xl:text-[15px] font-semibold text-slate-800 hover:text-[#052659] transition-colors duration-300 py-2"
            >
              {t.nav.education}
            </Link>

            {/* Yo'nalishlar (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => setDirectionsOpen(true)}
              onMouseLeave={() => setDirectionsOpen(false)}
            >
              <button className="flex items-center gap-1 py-2 text-sm xl:text-[15px] font-semibold text-slate-800 hover:text-[#052659] transition-colors">
                <span>{t.nav.directions}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${directionsOpen ? 'rotate-180 text-[#052659]' : ''}`} />
              </button>
              {(
                <div className={`absolute top-full left-0 mt-1 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 w-60 bg-white rounded-none shadow-xl shadow-sky-900/10 border border-sky-100 py-2.5 z-50 origin-top transition-all duration-300 ease-out ${directionsOpen ? 'opacity-100 translate-y-0 scale-100 visible' : 'opacity-0 -translate-y-2 scale-95 invisible pointer-events-none'}`}>
                  <Link href="/programs/exact" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#052659] hover:bg-sky-50 hover:pl-5 transition-all duration-200 rounded-none">
                    {t.nav.exactSciences}
                  </Link>
                  <Link href="/programs/natural" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#052659] hover:bg-sky-50 hover:pl-5 transition-all duration-200 rounded-none">
                    {t.nav.naturalSciences}
                  </Link>
                </div>
              )}
            </div>

            {/* Bog'lanish */}
            <Link 
              href="/contact" 
              className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-[#052659] after:rounded-full after:transition-all after:duration-300 hover:after:w-full text-sm xl:text-[15px] font-semibold text-slate-800 hover:text-[#052659] transition-colors duration-300 py-2"
            >
              {t.nav.contact}
            </Link>
          </nav>

          {/* Til tanlash: nav yonida, eng oxirida */}
          <div className="flex-shrink-0">
            <LangSelect />
          </div>
          </div>

          {/* Mobil Gamburger tugmasi */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl border border-sky-100 text-slate-700 hover:bg-sky-50 transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6 text-[#052659]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menyu */}
      {(
        <div className={`lg:hidden grid transition-all duration-500 ease-in-out ${mobileOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
        <div className="overflow-hidden">
        <div className="bg-white border-b border-sky-100 px-6 py-6 space-y-4 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="space-y-1">
            <Link 
              href="/about/school" 
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-semibold text-[#052659]"
            >
              {t.nav.aboutSchool}
            </Link>
            <Link 
              href="/about/leaders" 
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              {t.nav.leadership}
            </Link>
            <Link 
              href="/about/teachers" 
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              {t.nav.teachers}
            </Link>
            <Link 
              href="/about/gallery" 
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              {t.nav.gallery}
            </Link>
            <Link 
              href="/admission" 
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              {t.nav.admission}
            </Link>
            <Link 
              href="/news" 
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              {t.nav.news}
            </Link>
            <Link 
              href="/programs/exact" 
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              {t.nav.exactSciences}
            </Link>
            <Link 
              href="/programs/natural" 
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              {t.nav.naturalSciences}
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              {t.nav.contact}
            </Link>
          </div>

          <div className="pt-4 border-t border-sky-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{tr("Tilni tanlang:")}</span>
            <LangSelect />
          </div>
        </div>
        </div>
        </div>
      )}
    </header>
    </>
  );
};
