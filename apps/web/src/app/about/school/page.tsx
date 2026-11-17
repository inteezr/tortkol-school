'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/LanguageContext';
import { 
  Building2, 
  Target, 
  Compass, 
  Award, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  FlaskConical, 
  BookOpen 
} from 'lucide-react';

export default function MaktabHaqidaPage() {
  const { t, tr } = useLanguage();

  const features = [
    {
      title: "Ixtisoslashtirilgan chuqur ta'lim",
      desc: "Aniq fanlar (matematika, fizika) va tabiiy fanlar (kimyo, biologiya) bo'yicha chuqurlashtirilgan o'quv dasturlari.",
      icon: FlaskConical,
      color: "blue",
    },
    {
      title: "Yuqori malakali pedagogik jamoa",
      desc: "Oliy toifali ustozlar, fan olimpiadasi murabbiylari va xalqaro sertifikatga ega tajribali mutaxassislar.",
      icon: Users,
      color: "emerald",
    },
    {
      title: "Zamonaviy ilmiy laboratoriyalar",
      desc: "Xalqaro standartlarga javob beradigan asbob-uskunalar bilan jihozlangan kimyo, fizika va IT xonalari.",
      icon: Compass,
      color: "purple",
    },
    {
      title: "Xalqaro darajadagi til ko'nikmalari",
      desc: "Ingliz tili chuqur o'rgatiladi va o'quvchilar IELTS hamda CEFR sertifikatlarini olishga tayyorlanadi.",
      icon: Award,
      color: "amber",
    },
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha qismi */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {tr("To'rtko'l tuman ixtisoslashtirilgan maktabi haqida")}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {tr("Qoraqalpog'iston Respublikasi To'rtko'l tuman ixtisoslashtirilgan maktabi — kelajak yetakchilari, olimlar va iqtidorli yoshlarni voyaga yetkazuvchi nufuzli davlat ta'lim maskanidir.")}
          </p>
        </div>

        {/* Katta Bento Taqdimot Bloki */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
          {/* Asosiy Rasm (7 ustun) */}
          <div className="lg:col-span-7 card-bento overflow-hidden relative min-h-[380px] p-0 group">
            <img loading="lazy" decoding="async"
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=70&fm=webp"
              alt={tr("Maktab binosi")}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                {tr("Rasmiy ta'lim maskani")}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                {tr("To'rtko'l tuman ixtisoslashtirilgan maktabi kampusi")}
              </h3>
              <p className="text-xs text-slate-200 mt-1">
                {tr("Yorug' sinfxonalar, yashil hudud va zamonaviy o'quv sharoitlari.")}
              </p>
            </div>
          </div>

          {/* Maqsad va Vazifalar (5 ustun) */}
          <div className="lg:col-span-5 card-bento p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-white via-white to-blue-50/40">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-700 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {tr("Maktabimiz missiyasi")}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {tr("Maktabimizning asosiy vazifasi — har bir o'quvchining ichki salohiyatini kashf etish, mantiqiy va ijodiy fikrlash ko'nikmalarini shakllantirish hamda ularni nufuzli milliy va xalqaro oliy o'quv yurtlariga muvaffaqiyatli tayyorlashdir.")}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{tr("Kuchli nazariy va amaliy fundamental bilimlar")}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{tr("Xalqaro olimpiada va tanlovlarda faol ishtirok")}</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{tr("Vatanparvarlik, odob-axloq va ma'naviy yetuklik")}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                href="/admission"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>{tr("Qabul tartibi bilan tanishish")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Maktab Afzalliklari (4 ta Bento Karta) */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {tr("Nima uchun aynan bizning maktab?")}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {tr("Biz o'quvchilarga har tomonlama rivojlanish uchun keng imkoniyatlar yaratamiz.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="card-bento p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2">
                      {tr(item.title)}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {tr(item.desc)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ichki Bo'limlarga Tezkor Yo'naltirish */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/about/leaders"
            className="card-bento p-6 group hover:border-blue-300 transition-all"
          >
            <div className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
              {tr("Maktab rahbariyati →")}
            </div>
            <p className="text-xs text-slate-500">
              {tr("Direktor va o'rinbosarlar, ularning qabul kunlari va ma'lumotlari.")}
            </p>
          </Link>

          <Link
            href="/about/teachers"
            className="card-bento p-6 group hover:border-blue-300 transition-all"
          >
            <div className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
              {tr("O'qituvchilar tarkibi →")}
            </div>
            <p className="text-xs text-slate-500">
              {tr("Oliy toifali fan o'qituvchilari va ularning yutuqlari bilan tanishing.")}
            </p>
          </Link>

          <Link
            href="/about/gallery"
            className="card-bento p-6 group hover:border-blue-300 transition-all"
          >
            <div className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
              {tr("Fotogalereya →")}
            </div>
            <p className="text-xs text-slate-500">
              {tr("Dars mashg'ulotlari va maktab hayotidan sara fotolavhalar.")}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
