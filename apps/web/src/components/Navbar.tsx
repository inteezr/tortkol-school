'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';
import { SupportedLocale } from '@school/shared';
import { 
  ChevronDown, 
  Instagram,
  Facebook,
  Youtube,
  Globe, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  ArrowUpRight,
  School,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { locale, setLocale, t, tr } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [lifeOpen, setLifeOpen] = useState(false);
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const languages: { code: SupportedLocale; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbekcha", flag: "🇺🇿" },
    { code: 'qq', label: 'Qaraqalpaqsha', flag: "🇺🇿" },
    { code: 'ru', label: 'Русский', flag: "🇷🇺" },
    { code: 'en', label: 'English', flag: "🇬🇧" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full font-poppins transition-all">
      {/* 1. Yuqori ma'lumotlar paneli (Top Bar) - Zamonaviy Moviy (Light Sky) Gradiyent */}
      <div className="bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#0EA5E9] text-white text-xs border-b border-sky-400/20 hidden md:block shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
          {/* Chap tomon: Aloqa ma'lumotlari */}
          <div className="flex items-center gap-6 text-sky-50">
            <a href="tel:+998615122440" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-200" />
              <span>+998 (61) 512-24-40</span>
            </a>
            <a href="mailto:tortkol@piima.uz" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-sky-200" />
              <span>tortkol@piima.uz</span>
            </a>
            <div className="flex items-center gap-2 text-sky-100 hidden lg:flex">
              <Clock className="w-3.5 h-3.5 text-sky-200" />
              <span>{tr("Dush - Shan: 08:00 - 17:00")}</span>
            </div>
          </div>

          {/* O'ng tomon: Ijtimoiy tarmoqlar va Til tanlash */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <a 
                href="https://t.me" 
                target="_blank" 
                rel="noreferrer" 
                className="w-6 h-6 rounded-full border border-white/30 hover:border-white hover:bg-white/20 flex items-center justify-center text-[10px] text-white font-bold transition-all"
                title={tr("Telegram")}
              >
                <Send className="w-3 h-3" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-6 h-6 rounded-full border border-white/30 hover:border-white hover:bg-white/20 flex items-center justify-center text-[10px] text-white font-bold transition-all"
                title="Instagram"
              >
                <Instagram className="w-3 h-3" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-6 h-6 rounded-full border border-white/30 hover:border-white hover:bg-white/20 flex items-center justify-center text-[10px] text-white font-bold transition-all"
                title="Facebook"
              >
                <Facebook className="w-3 h-3" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-6 h-6 rounded-full border border-white/30 hover:border-white hover:bg-white/20 flex items-center justify-center text-[10px] text-white font-bold transition-all"
                title="YouTube"
              >
                <Youtube className="w-3 h-3" />
              </a>
            </div>

            <div className="h-4 w-px bg-white/25" />

            {/* Zero-reload Til switcheri */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/15 text-white font-semibold transition-colors text-xs"
              >
                <Globe className="w-3.5 h-3.5 text-sky-200" />
                <span className="uppercase">{locale}</span>
                <ChevronDown className="w-3 h-3 text-sky-200" />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-2xl border border-sky-100 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-1">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLocale(item.code);
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-xs font-semibold hover:bg-sky-50 transition-colors ${
                        locale === item.code ? 'text-[#0284C7] bg-sky-50 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </span>
                      {locale === item.code && <span className="w-2 h-2 rounded-full bg-[#0284C7]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Asosiy Navbar - Glassmorphism va Yorug' Moviy Uslub */}
      <div className="bg-white/80 backdrop-blur-xl saturate-150 shadow-xs border-b border-sky-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Maktab logosi va rasmiy nomi */}
          <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
              <School className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight tracking-tight group-hover:text-[#0284C7] transition-colors">
                To‘rtko‘l TIM
              </div>
            </div>
          </Link>

          {/* Desktop Navigatsiya */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-8 whitespace-nowrap">
            {/* Biz haqimizda (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => setAboutOpen(true)}
              onMouseLeave={() => setAboutOpen(false)}
            >
              <button className="flex items-center gap-1 py-2 text-sm xl:text-[15px] font-semibold text-slate-800 hover:text-[#0284C7] transition-colors">
                <span>{t.nav.about}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${aboutOpen ? 'rotate-180 text-[#0284C7]' : ''}`} />
              </button>
              {aboutOpen && (
                <div className="absolute top-full left-0 mt-1 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 w-60 bg-white rounded-2xl shadow-xl shadow-sky-900/10 border border-sky-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link href="/about/school" className="block px-4 py-2.5 text-xs font-semibold text-[#0284C7] hover:bg-sky-50 transition-colors rounded-xl mx-1.5">
                    {t.nav.aboutSchool}
                  </Link>
                  <Link href="/about/leaders" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 transition-colors rounded-xl mx-1.5">
                    {t.nav.leadership}
                  </Link>
                  <Link href="/about/teachers" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 transition-colors rounded-xl mx-1.5">
                    {t.nav.teachers}
                  </Link>
                  <Link href="/about/gallery" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 transition-colors rounded-xl mx-1.5">
                    {t.nav.gallery}
                  </Link>
                </div>
              )}
            </div>

            {/* Qabul */}
            <Link 
              href="/admission" 
              className="text-sm xl:text-[15px] font-semibold text-slate-800 hover:text-[#0284C7] transition-colors py-2"
            >
              {t.nav.admission}
            </Link>

            {/* Maktab hayoti (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => setLifeOpen(true)}
              onMouseLeave={() => setLifeOpen(false)}
            >
              <button className="flex items-center gap-1 py-2 text-sm xl:text-[15px] font-semibold text-slate-800 hover:text-[#0284C7] transition-colors">
                <span>{t.nav.schoolLife}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${lifeOpen ? 'rotate-180 text-[#0284C7]' : ''}`} />
              </button>
              {lifeOpen && (
                <div className="absolute top-full left-0 mt-1 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 w-56 bg-white rounded-2xl shadow-xl shadow-sky-900/10 border border-sky-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link href="/news" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 transition-colors rounded-xl mx-1.5">
                    {t.nav.news}
                  </Link>
                  <Link href="/education" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 transition-colors rounded-xl mx-1.5">
                    {t.nav.education}
                  </Link>
                </div>
              )}
            </div>

            {/* Yo'nalishlar (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => setDirectionsOpen(true)}
              onMouseLeave={() => setDirectionsOpen(false)}
            >
              <button className="flex items-center gap-1 py-2 text-sm xl:text-[15px] font-semibold text-slate-800 hover:text-[#0284C7] transition-colors">
                <span>{t.nav.directions}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${directionsOpen ? 'rotate-180 text-[#0284C7]' : ''}`} />
              </button>
              {directionsOpen && (
                <div className="absolute top-full left-0 mt-1 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 w-60 bg-white rounded-2xl shadow-xl shadow-sky-900/10 border border-sky-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link href="/programs/exact" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 transition-colors rounded-xl mx-1.5">
                    {t.nav.exactSciences}
                  </Link>
                  <Link href="/programs/natural" className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 transition-colors rounded-xl mx-1.5">
                    {t.nav.naturalSciences}
                  </Link>
                </div>
              )}
            </div>

            {/* Bog'lanish */}
            <Link 
              href="/contact" 
              className="text-sm xl:text-[15px] font-semibold text-slate-800 hover:text-[#0284C7] transition-colors py-2"
            >
              {t.nav.contact}
            </Link>
          </nav>

          {/* O'ng tomon: Ariza topshirish CTA tugmasi (Light Blue Gradient) */}
          <div className="hidden sm:flex items-center gap-4 flex-shrink-0 whitespace-nowrap">
            <a
              href="https://ariza.piima.uz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-bold text-xs px-6 py-3 rounded-full shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all active:scale-95"
            >
              <span>{t.hero.applyBtn}</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </a>
          </div>

          {/* Mobil Gamburger tugmasi */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl border border-sky-100 text-slate-700 hover:bg-sky-50 transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6 text-[#0284C7]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menyu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-sky-100 px-6 py-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            <Link 
              href="/about/school" 
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-semibold text-[#0284C7]"
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
            <div className="flex gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLocale(l.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    locale === l.code ? 'bg-[#0284C7] text-white shadow-sm' : 'bg-sky-50 text-slate-700'
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>
          </div>

          <a
            href="https://ariza.piima.uz"
            target="_blank"
            rel="noreferrer"
            className="block text-center w-full py-3 rounded-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white font-bold text-sm shadow-md shadow-sky-500/25"
          >
            {t.hero.applyBtn} ↗
          </a>
        </div>
      )}
    </header>
  );
};
