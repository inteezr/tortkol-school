'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/LanguageContext';
import { 
  ArrowUpRight, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  AlertCircle, 
  BookOpen, 
  UserCheck 
} from 'lucide-react';

export default function QabulPage() {
  const { t, tr } = useLanguage();

  const steps = [
    {
      step: '01',
      title: 'Onlayn ariza topshirish',
      desc: "Agentlikning rasmiy ariza.piima.uz yoki my.gov.uz portali orqali ro'yxatdan o'tiladi.",
    },
    {
      step: '02',
      title: 'Hujjatlarni taqdim etish',
      desc: "Belgilangan muddatda o'quvchi va ota-onaning shaxsiy hujjatlari elektron shaklda yuklanadi.",
    },
    {
      step: '03',
      title: 'Saralash imtihonlari',
      desc: "Yo'nalish bo'yicha chuqurlashtirilgan fanlardan (matematika, fizika yoki kimyo, biologiya) test sinovlari.",
    },
    {
      step: '04',
      title: 'Natijalar va qabul',
      desc: "Mandat natijalari e'lon qilinadi va eng yuqori ball to'plagan o'quvchilar maktab safiga qabul qilinadi.",
    },
  ];

  const documents = [
    "O'quvchining tug'ilganlik haqida guvohnomasi (metrika) nusxasi",
    "Oxirgi 2 oy davomida tushirilgan 3x4 o'lchamdagi 2 dona sifatli fotosurat",
    "Ota-onasi (qonuniy vakili)ning fuqarolik pasporti yoki ID-kartasi ma'lumotlari",
    "Maktab baholar tabeli va o'quvchi ma'lumotnomasi",
    "Bog'lanish uchun ota-onaning faol telefon raqamlari",
  ];

  const faqs = [
    {
      q: "Ixtisoslashtirilgan maktabga qabul qachon boshlanadi?",
      a: "Qabul har yili Prezident ta'lim muassasalari agentligi tomonidan belgilangan muddatda (odatda may-iyun oylarida) onlayn tarzda o'tkaziladi.",
    },
    {
      q: "Maktabda o'qish bepulmi?",
      a: "Ha, To'rtko'l tuman ixtisoslashtirilgan maktabi to'liq davlat byudjeti hisobidan moliyalashtiriladi va ta'lim mutlaqo bepul.",
    },
    {
      q: "Imtihonlar qaysi fanlardan o'tkaziladi?",
      a: "Aniq fanlar yo'nalishi uchun: Matematika va Fizika, shuningdek mantiqiy fikrlash testlari. Tabiiy fanlar yo'nalishi uchun: Kimyo, Biologiya va mantiqiy testlar.",
    },
    {
      q: "Sayt orqali to'g'ridan-to'g'ri ariza topshirsa bo'ladimi?",
      a: "Yo'q, maktab sayti axborot beruvchi rasmiy platformadir. Ariza topshirish faqat Agentlikning markazlashgan ariza.piima.uz portali orqali amalga oshiriladi.",
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {tr("Ixtisoslashtirilgan maktabga qabul tartibi")}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {tr("Iqtidorli o'quvchilarni saralab olish, chuqurlashtirilgan ta'lim bosqichlariga qabul qilish bo'yicha to'liq qo'llanma va talablar.")}
          </p>

          <div className="mt-8">
            <a
              href="https://ariza.piima.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-white font-extrabold text-base shadow-xl shadow-sky-500/25 active:scale-95 transition-all"
            >
              <span>{tr("ariza.piima.uz orqali ariza topshirish")}</span>
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* 4 Bosqich Bento Grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {tr("4 qadamda qabul jarayoni")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="card-bento p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-black text-blue-600/30 mb-4">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">
                    {tr(s.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {tr(s.desc)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Ustun: Hujjatlar va Imtihon fanlari */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Kerakli hujjatlar */}
          <div className="card-bento p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {tr("Kerakli hujjatlar ro'yxati")}
                </h3>
                <p className="text-xs text-slate-500">
                  {tr("Onlayn ariza topshirishda yuklanadigan ma'lumotlar")}
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              {documents.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{tr(doc)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Imtihon fanlari */}
          <div className="card-bento p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {tr("Imtihon fanlari va yo'nalishlar")}
                </h3>
                <p className="text-xs text-slate-500">
                  {tr("Sinov testlari o'tkaziladigan asosiy bloklar")}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  {tr("1. Aniq fanlar yo'nalishi")}
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  {tr("Chuqurlashtirilgan matematika, fizika masalalari hamda mantiqiy fikrlash testlari.")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-800">{tr("Matematika (40 ta savol)")}</span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-800">{tr("Fizika (20 ta savol)")}</span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-800">{tr("Mantiq (10 ta savol)")}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  {tr("2. Tabiiy fanlar yo'nalishi")}
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  {tr("Kimyo va biologiya fanlari bo'yicha fundamental bilimlar va mantiqiy savollar.")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-800">{tr("Biologiya (35 ta savol)")}</span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-800">{tr("Kimyo (25 ta savol)")}</span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-800">{tr("Mantiq (10 ta savol)")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Bo'limi */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="badge-pill mb-3">{tr("Savol-javoblar")}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {tr("Ko'p beriladigan savollar (FAQ)")}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card-bento p-6">
                <h4 className="font-bold text-slate-900 text-base mb-2">
                  {tr(faq.q)}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tr(faq.a)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
