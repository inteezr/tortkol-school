'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Reveal } from './Reveal';
import { useLanguage } from '../lib/LanguageContext';
import { loadJson } from '../lib/api-store';
import { ArrowRight, Calendar, ArrowUpRight } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { t, tr } = useLanguage();
  const [newsItems, setNewsItems] = useState<any[]>([]);

  useEffect(() => {
    loadJson('/api/posts', (data) => {
        if (data.posts && data.posts.length > 0) {
          setNewsItems(data.posts.slice(0, 3).map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            date: p.published_at ? p.published_at.slice(0, 10) : '',
            category: p.categories?.name || p.category || '',
            imageUrl: p.cover_image || '',
          })));
        }
      });
  }, []);

  return (
    <section className="py-20 bg-white font-poppins border-b border-sky-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha va barcha yangiliklar tugmasi */}
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="kicker mb-2">
              {tr("MAKTAB HAYOTI")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {t.news.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
              {tr("Maktabimizda bo'lib o'tayotgan eng so'nggi tadbirlar, g'alabalar va e'lonlar.")}
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-sky-200 bg-sky-50 hover:bg-[#0284C7] hover:text-white text-xs font-bold text-[#0284C7] shadow-xs active:scale-95 transition-all self-start md:self-auto"
          >
            <span>{tr("Barcha yangiliklar")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        {/* 3 ta Yangilik kartasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.length === 0 && (
            <p className="col-span-full text-center text-slate-500 py-10">{tr("Hozircha yangiliklar yo'q.")}</p>
          )}
          {newsItems.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.1}>
            <Link
              href={`/news/${item.slug}`}
              className="bg-white rounded-[32px] overflow-hidden shadow-xs hover:shadow-card-hover hover:border-sky-300 lift border border-sky-100 flex flex-col group cursor-pointer h-full"
            >
              {/* Surat va suzuvchi sana nishoni */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                {item.imageUrl && (<img loading="lazy" decoding="async"
                  src={item.imageUrl}
                  alt={tr(item.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.95]"
                />)}

                {/* Sana nishoni */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0284C7] shadow-md flex items-center gap-1.5 border border-sky-100">
                  <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>{item.date}</span>
                </div>
              </div>

              {/* Matn bloki */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-sky-50 border border-sky-100 px-3 py-1 rounded-xl inline-block mb-3">
                    {tr(item.category)}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors line-clamp-2 leading-snug">
                    {tr(item.title)}
                  </h3>

                  <p className="mt-3 text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed font-normal">
                    {tr(item.excerpt)}
                  </p>
                </div>

                {/* Read more havolasi */}
                <div className="mt-6 pt-4 border-t border-sky-100 flex items-center text-xs font-extrabold text-[#0284C7] uppercase tracking-wider group-hover:gap-2 transition-all">
                  <span>{tr("BATAFSIL O'QISH")}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-[#0284C7]" />
                </div>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
