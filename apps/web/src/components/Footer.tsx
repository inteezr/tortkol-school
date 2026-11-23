'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';
import { TelegramLogo, InstagramLogo, FacebookLogo, YouTubeLogo } from './SocialLogos';
import { MapPin, Phone, Mail, Clock, School } from 'lucide-react';

// FioZeN havolasi: manzil hozircha yo'q, bosilganda hech qayerga o'tmaydi. Manzilni shu yerga yozing.
const DESIGNER_URL = '';

export const Footer: React.FC = () => {
  const { t, tr } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-[#031A3F] via-[#02183A] to-[#021024] text-slate-200 pt-16 pb-10 font-poppins border-t border-sky-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* 1. Aloqa markazi & Maktab haqida */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#031A3F] via-[#052659] to-[#5483B3] flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20 border border-white/20">
                <School className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-white text-base leading-tight">
                  Törtköl IM
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              {tr("Ixtisoslaştirilgan ta'lim muassasalari agentligi tizimidagi Törtköl tuman ixtisoslaştirilgan maktabi.")}
            </p>

            {/* Ijtimoiy tarmoqlar */}
            <div className="flex items-center gap-2.5">
              <a 
                href="https://t.me" 
                target="_blank" 
                rel="noreferrer" 
                className="group w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                title={tr("Telegram")}
              >
                <TelegramLogo className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="group w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                title="Instagram"
              >
                <InstagramLogo className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="group w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                title="Facebook"
              >
                <FacebookLogo className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="group w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                title="YouTube"
              >
                <YouTubeLogo className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2. Biz haqimizda */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5 border-l-2 border-[#7DA0CA] pl-2.5">
              {tr("Biz haqimizda")}
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li>
                <Link href="/about/school" className="hover:text-[#7DA0CA] transition-colors">
                  {tr("Maktab haqida umumiy ma'lumot")}
                </Link>
              </li>
              <li>
                <Link href="/about/leaders" className="hover:text-[#7DA0CA] transition-colors">
                  {tr("Maktab rahbariyati")}
                </Link>
              </li>
              <li>
                <Link href="/about/teachers" className="hover:text-[#7DA0CA] transition-colors">
                  {tr("Öqituvçilar tarkibi")}
                </Link>
              </li>
              <li>
                <Link href="/about/gallery" className="hover:text-[#7DA0CA] transition-colors">
                  {tr("Fotogalereya va media")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Ta'lim va Yo'nalishlar */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5 border-l-2 border-[#7DA0CA] pl-2.5">
              {tr("Ta'lim va Qabul")}
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li>
                <Link href="/programs/exact" className="hover:text-[#7DA0CA] transition-colors">
                  {tr("Aniq fanlar yönalişi")}
                </Link>
              </li>
              <li>
                <Link href="/programs/natural" className="hover:text-[#7DA0CA] transition-colors">
                  {tr("Tabiiy fanlar yönalişi")}
                </Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-[#7DA0CA] transition-colors">
                  {tr("Öquv dasturlari va metodika")}
                </Link>
              </li>
              <li>
                <Link href="/admission" className="hover:text-[#7DA0CA] transition-colors">
                  {tr("Qabul talablari va bosqiçlari")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#7DA0CA] transition-colors">
                  {tr("Sönggi yangiliklar va e'lonlar")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Bog'lanish va Rekvizitlar */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5 border-l-2 border-[#7DA0CA] pl-2.5">
              {tr("Aloqa rekvizitlari")}
            </h4>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#7DA0CA] flex-shrink-0 mt-0.5" />
                <span>{tr("Qoraqalpoğiston Resp., Törtköl tumani, Beruniy köçasi, 1-uy")}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#7DA0CA] flex-shrink-0" />
                <span>+998 (61) 512-24-40</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#7DA0CA] flex-shrink-0" />
                <span>tortkol@piima.uz</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#7DA0CA] flex-shrink-0" />
                <span>{tr("Duşanba - Şanba: 08:00 - 17:00")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mualliflik va Foydali portallar havolasi */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} Törtköl tuman ixtisoslaştirilgan maktabi. Barça huquqlar himoyalangan.
          </div>

          <div className="flex items-center gap-1.5">
            <span>Designed by</span>
            <a
              href={DESIGNER_URL || '#'}
              {...(DESIGNER_URL ? { target: '_blank', rel: 'noreferrer' } : { onClick: (e: React.MouseEvent) => e.preventDefault() })}
              className="font-semibold text-slate-200 hover:text-[#7DA0CA] transition-colors"
            >
              FioZeN
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
