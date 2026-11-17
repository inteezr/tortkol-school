'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/LanguageContext';
import { loadJson } from '../../lib/api-store';
import { ArrowUpRight, Calendar, Search } from 'lucide-react';

export default function YangiliklarPage() {
  const { t, tr } = useLanguage();
  const [selectedTag, setSelectedTag] = useState('Barchasi');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadJson('/api/posts', (data) => {
        if (data.posts && data.posts.length > 0) {
          setArticles(data.posts.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            date: p.published_at ? p.published_at.slice(0, 10) : '',
            category: p.categories?.name || p.category || '',
            imageUrl: p.cover_image || '',
          })));
        }
      }, () => setLoading(false));
  }, []);

  const tags = ['Barchasi', 'Olimpiada', "Ta'lim", 'Tadbirlar', 'E’lonlar'];

  const filteredArticles = selectedTag === 'Barchasi'
    ? articles
    : articles.filter(a => a.category === selectedTag);

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.nav.news}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            {tr("Maktabimizdagi so'nggi yangiliklar, yutuqlar va e'lonlar arxivi.")}
          </p>
        </div>

        {/* Filtr tablari */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tr(tag)}
              </button>
            ))}
          </div>
        </div>

        {/* Yangiliklar Gridi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && filteredArticles.length === 0 && (
            <p className="col-span-full text-center text-slate-500 py-10">{tr("Hozircha yangiliklar yo'q.")}</p>
          )}
          {filteredArticles.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="card-bento flex flex-col justify-between overflow-hidden group cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-100">
                  {item.imageUrl && (<img loading="lazy" decoding="async"
                    src={item.imageUrl}
                    alt={tr(item.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />)}
                  <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-white/80 shadow-md flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-blue-700 shadow-sm">
                    {tr(item.category)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-2.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {tr(item.title)}
                  </h3>

                  <p className="mt-2.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {tr(item.excerpt)}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <span className="text-xs font-semibold text-blue-600">
                  {tr("Batafsil o'qish →")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
