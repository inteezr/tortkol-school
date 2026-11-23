'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Reveal } from './Reveal';
import { useLanguage } from '../lib/LanguageContext';
import { ArrowRight, Camera, ZoomIn } from 'lucide-react';
import { ImageViewer } from './ImageViewer';
import { useApiJson } from '../lib/api-store';

// Server va brauzerda bir xil chiqishi uchun sana qo'lda formatlanadi (hydration xatosi bo'lmasin)
const fmtDate = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}/.test(v) ? `${v.slice(8, 10)}.${v.slice(5, 7)}.${v.slice(0, 4)}` : '');

export const GalleryPreview: React.FC = () => {
  const { t, tr } = useLanguage();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [albumIdx, setAlbumIdx] = useState(0);

  // Admin «Galereya» bo'limidagi albomlar (server sahifa bilan birga yuboradi)
  const { data } = useApiJson<{ albums: any[] }>('/api/gallery');
  const albums = useMemo(() => (data?.albums || [])
    .filter((a: any) => a.media?.length || a.cover_image)
    .slice(0, 4)
    .map((a: any) => ({
      title: (a.title || '') as string,
      caption: (a.description || '') as string,
      url: (a.cover_image || a.media?.[0]?.url || '') as string,
      date: fmtDate(a.created_at),
      count: (a.media?.length || 0) as number,
      photos: (a.media || []) as { url: string }[],
    })), [data]);

  // Kartani bosganda shu albomning rasmlari to'liq ekranda ochiladi
  const viewerImages = (albums[albumIdx]?.photos.length ? albums[albumIdx].photos : albums[albumIdx] ? [{ url: albums[albumIdx].url }] : [])
    .map((m) => ({ url: m.url, title: albums[albumIdx].title, caption: albums[albumIdx].caption }));

  const openViewer = (index: number) => {
    setAlbumIdx(index);
    setViewerIndex(0);
    setViewerOpen(true);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#F1F7FE] to-white font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sarlavha */}
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="kicker mb-2">
              {tr("FOTOGALEREYA")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {t.gallery.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
              {tr("Maktabimiz hayotidan yorqin lavhalar, dars jarayonlari va yutuqlar aks etgan fotoalbomlar.")}
            </p>
          </div>

          <Link
            href="/about/gallery"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-sky-200 bg-sky-50 hover:bg-[#052659] hover:text-white text-xs font-bold text-[#052659] shadow-xs active:scale-95 transition-all self-start md:self-auto"
          >
            <span>{t.gallery.allPhotosBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        {/* 4 ta Fotoalbom Kartasi (rounded-[32px]) */}
        {albums.length === 0 && (
          <p className="text-center text-slate-500 py-10">{tr("Hozirça fotoalbomlar qöşilmagan.")}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {albums.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => openViewer(idx)}
              className="rounded-[32px] overflow-hidden bg-white shadow-xs hover:shadow-card-hover hover:border-sky-300 lift cursor-pointer group border border-sky-100 flex flex-col"
            >
              {/* Surat bloki */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] m-2.5 bg-slate-900">
                <img loading="lazy" decoding="async"
                  src={photo.url}
                  alt={tr(photo.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.95]"
                />

                {/* Suratlar soni nishoni */}
                <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-900 flex items-center gap-1.5 shadow-sm border border-sky-100">
                  <Camera className="w-3.5 h-3.5 text-[#052659]" />
                  <span>{photo.count} ta</span>
                </div>

                {/* Kattalashtirish hover nishoni */}
                <div className="absolute inset-0 bg-[#052659]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Ma'lumot bloki */}
              <div className="px-5 py-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[#052659] uppercase tracking-wider mb-1">
                    {photo.date}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#052659] transition-colors line-clamp-2 leading-snug">
                    {tr(photo.title)}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / ImageViewer Modal */}
      <ImageViewer
        isOpen={viewerOpen}
        images={viewerImages}
        currentIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
        onIndexChange={(newIdx) => setViewerIndex(newIdx)}
      />
    </section>
  );
};
