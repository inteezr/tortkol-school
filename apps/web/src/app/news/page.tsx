'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/LanguageContext';
import { loadJson } from '../../lib/api-store';
import { ArrowUpRight, Calendar, Search } from 'lucide-react';
import { POST_CATEGORIES, postCategory, isCategorySlug } from '../../lib/post-categories';

export default function YangiliklarPage() {
  const { t, tr } = useLanguage();
  // 'all' yoki turkum slug'i. URL'dagi ?tag=... bilan bog'langan (havolani ulashish mumkin)
  const [selectedTag, setSelectedTagState] = useState<string>('all');
  React.useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get('tag');
    if (isCategorySlug(tag)) setSelectedTagState(tag);
  }, []);
  const setSelectedTag = (tag: string) => {
    setSelectedTagState(tag);
    const url = tag === 'all' ? '/news' : `/news?tag=${tag}`;
    window.history.replaceState(window.history.state, '', url);
  };
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
            category: postCategory(p),
            imageUrl: p.cover_image || '',
          })));
        }
      }, () => setLoading(false));
  }, []);

  const tags: { slug: string; label: string }[] = [{ slug: 'all', label: 'Barçasi' }, ...POST_CATEGORIES.map((c) => ({ slug: c.slug, label: c.label }))];

  const filteredArticles = selectedTag === 'all'
    ? articles
    : articles.filter((a) => a.category?.slug === selectedTag);

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.nav.news}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            {tr("Maktabimizdagi sönggi yangiliklar, yutuqlar va e'lonlar arxivi.")}
          </p>
        </div>

        {/* Filtr tablari */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tags.map(({ slug, label }) => (
              <button
                key={slug}
                onClick={() => setSelectedTag(slug)}
                aria-pressed={selectedTag === slug}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedTag === slug
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tr(label)}
              </button>
            ))}
          </div>
        </div>

        {/* Yangiliklar Gridi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && filteredArticles.length === 0 && (
            <p className="col-span-full text-center text-slate-500 py-10">{selectedTag === 'all' ? tr("Hozirça yangiliklar yöq.") : tr("Bu turkumda hozirça post yöq.")}</p>
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
                  {item.category && (
                    <button
                      type="button"
                      title={tr('Şu turkumdagi postlar')}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedTag(item.category.slug); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-blue-700 shadow-sm hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      {tr(item.category.label)}
                    </button>
                  )}
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
                  {tr("Batafsil öqiş →")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
