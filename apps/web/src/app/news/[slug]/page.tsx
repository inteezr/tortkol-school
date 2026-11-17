'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2, Tag, CheckCircle2 } from 'lucide-react';
import { useLanguage, dateLocale } from '../../../lib/LanguageContext';
import { loadJson, peekJson } from '../../../lib/api-store';

export default function YangilikDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { tr, locale } = useLanguage();
  const unwrappedParams = React.use(params);
  const [copied, setCopied] = React.useState(false);
  const [post, setPost] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Ro'yxat keshda bo'lsa, maqola darhol ko'rinadi
    const known = peekJson('/api/posts')?.posts?.find((x: any) => x.slug === unwrappedParams.slug);
    if (known) { setPost(known); setLoading(false); }
    loadJson(`/api/posts?slug=${unwrappedParams.slug}`, (data) => {
        if (data.posts && data.posts.length > 0) {
          setPost(data.posts[0]);
        }
      }, () => setLoading(false));
  }, [unwrappedParams.slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const title = tr(post?.title || '');
  const excerpt = tr(post?.excerpt || '');
  const content = tr(post?.content || '');
  const coverImage = post?.cover_image || '';
  const dateFormatted = post?.published_at ? new Date(post.published_at).toLocaleDateString(dateLocale(locale)) : '';
  const category = tr(post?.categories?.name || post?.category || '');

  if (!loading && !post) {
    return (
      <div className="py-24 text-center">
        <p className="text-slate-500 mb-6">{tr("Yangilik topilmadi.")}</p>
        <Link href="/news" className="text-blue-600 font-semibold text-sm">{tr("Yangiliklar ro'yxatiga qaytish")}</Link>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Orqaga qaytish */}
        <div className="mb-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{tr("Yangiliklar ro'yxatiga qaytish")}</span>
          </Link>
        </div>

        {/* Maqola bosh qismi */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/50">
              {category}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateFormatted}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {excerpt}
          </p>
        </div>

        {/* Asosiy muqova rasmi */}
        {coverImage && (
          <div className="my-10 rounded-3xl overflow-hidden aspect-[16/9] bg-slate-100 shadow-md">
            <img fetchPriority="high" decoding="async" src={coverImage} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Maqola matni */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
          {content}
        </div>

        {/* Ulashish va orqaga qaytish paneli */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div />

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">{tr("Havola nusxalandi!")}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>{tr("Havolani ulashish")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
