'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../lib/LanguageContext';
import { MapPin, Phone, Mail, Clock, School, ArrowUpRight, Send, Instagram, Facebook, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, tr } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-[#0A2240] via-[#071930] to-[#030D1B] text-slate-200 pt-16 pb-10 font-poppins border-t border-sky-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* 1. Aloqa markazi & Maktab haqida */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20 border border-white/20">
                <School className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-white text-base leading-tight">
                  To‘rtko‘l TIM
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
              {tr("Ixtisoslashtirilgan ta'lim muassasalari agentligi tizimidagi To‘rtko‘l tuman ixtisoslashtirilgan maktabi — fundamental va zamonaviy davlat ta'lim maskani.")}
            </p>

            {/* Ijtimoiy tarmoqlar */}
            <div className="flex items-center gap-2.5">
              <a 
                href="https://t.me" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#38BDF8] hover:text-[#0A2240] flex items-center justify-center text-xs font-bold transition-all"
                title={tr("Telegram")}
              >
                <Send className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#38BDF8] hover:text-[#0A2240] flex items-center justify-center text-xs font-bold transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#38BDF8] hover:text-[#0A2240] flex items-center justify-center text-xs font-bold transition-all"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#38BDF8] hover:text-[#0A2240] flex items-center justify-center text-xs font-bold transition-all"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2. Biz haqimizda */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5 border-l-2 border-[#38BDF8] pl-2.5">
              {tr("Biz haqimizda")}
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li>
                <Link href="/about/school" className="hover:text-[#38BDF8] transition-colors">
                  {tr("Maktab haqida umumiy ma'lumot")}
                </Link>
              </li>
              <li>
                <Link href="/about/leaders" className="hover:text-[#38BDF8] transition-colors">
                  {tr("Maktab rahbariyati")}
                </Link>
              </li>
              <li>
                <Link href="/about/teachers" className="hover:text-[#38BDF8] transition-colors">
                  {tr("O'qituvchilar tarkibi")}
                </Link>
              </li>
              <li>
                <Link href="/about/gallery" className="hover:text-[#38BDF8] transition-colors">
                  {tr("Fotogalereya va media")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Ta'lim va Yo'nalishlar */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5 border-l-2 border-[#38BDF8] pl-2.5">
              {tr("Ta'lim va Qabul")}
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li>
                <Link href="/programs/exact" className="hover:text-[#38BDF8] transition-colors">
                  {tr("Aniq fanlar yo'nalishi")}
                </Link>
              </li>
              <li>
                <Link href="/programs/natural" className="hover:text-[#38BDF8] transition-colors">
                  {tr("Tabiiy fanlar yo'nalishi")}
                </Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-[#38BDF8] transition-colors">
                  {tr("O'quv dasturlari va metodika")}
                </Link>
              </li>
              <li>
                <Link href="/admission" className="hover:text-[#38BDF8] transition-colors">
                  {tr("Qabul talablari va bosqichlari")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#38BDF8] transition-colors">
                  {tr("So'nggi yangiliklar va e'lonlar")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Bog'lanish va Rekvizitlar */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-5 border-l-2 border-[#38BDF8] pl-2.5">
              {tr("Aloqa rekvizitlari")}
            </h4>
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                <span>{tr("Qoraqalpog'iston Resp., To'rtko'l tumani, Beruniy ko'chasi, 1-uy")}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                <span>+998 (61) 512-24-40</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                <span>tortkol@piima.uz</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
                <span>{tr("Dushanba - Shanba: 08:00 - 17:00")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mualliflik va Foydali portallar havolasi */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} To‘rtko‘l tuman ixtisoslashtirilgan maktabi. Barcha huquqlar himoyalangan.
          </div>

          <div className="flex items-center gap-6">
            <a href="https://piima.uz" target="_blank" rel="noreferrer" className="hover:text-[#38BDF8] transition-colors flex items-center gap-1 font-semibold">
              <span>piima.uz</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="https://ariza.piima.uz" target="_blank" rel="noreferrer" className="hover:text-[#38BDF8] transition-colors flex items-center gap-1 font-semibold">
              <span>ariza.piima.uz</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a href="https://my.gov.uz" target="_blank" rel="noreferrer" className="hover:text-[#38BDF8] transition-colors flex items-center gap-1 font-semibold">
              <span>my.gov.uz</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
