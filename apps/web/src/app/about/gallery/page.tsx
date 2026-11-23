'use client';

import React, { useMemo, useState } from 'react';
import { useApiJson } from '../../../lib/api-store';
import { useLanguage } from '../../../lib/LanguageContext';
import { ZoomIn } from 'lucide-react';
import { ImageViewer } from '../../../components/ImageViewer';

export default function GalereyaPage() {
  const { t, tr } = useLanguage();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const { data } = useApiJson<{ albums: any[] }>('/api/gallery');
  const [albumIdx, setAlbumIdx] = useState(0);

  const photoAlbums = useMemo(() => (data?.albums || [])
    .filter((a: any) => a.media?.length || a.cover_image)
    .map((a: any) => ({
      id: a.id as number,
      title: a.title as string,
      caption: (a.description || '') as string,
      count: `${a.media.length} ta rasm`,
      coverUrl: (a.cover_image || a.media[0]?.url || '') as string,
      photos: (a.media || []) as { url: string }[],
    })), [data]);

  const viewerImages = (photoAlbums[albumIdx]?.photos || []).map((m) => ({
    url: m.url,
    title: photoAlbums[albumIdx].title,
    caption: photoAlbums[albumIdx].caption,
  }));

  const openViewer = (index: number) => {
    if (!photoAlbums[index]?.photos.length) return;
    setAlbumIdx(index);
    setViewerIndex(0);
    setViewerOpen(true);
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.nav.gallery}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            {tr("Maktabimiz hayoti, öquv jarayonlari va yutuqlarimizdan fotolavhalar.")}
          </p>
        </div>

        {/* Fotolar qismi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {photoAlbums.length === 0 && (
            <p className="col-span-full text-center text-slate-500 py-10">{tr("Hozirça fotoalbomlar qöşilmagan.")}</p>
          )}
          {photoAlbums.map((album, idx) => (
            <div 
              key={album.id} 
              onClick={() => openViewer(idx)}
              className="card-bento overflow-hidden group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img loading="lazy" decoding="async"
                  src={album.coverUrl}
                  alt={tr(album.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
                  {album.count}
                </div>

                {/* Markazda Kattalashtirish Ikonkasi */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {tr(album.title)}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                  {tr(album.caption)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rasm ko'rish modali (ImageViewer Lightbox) */}
      <ImageViewer
        isOpen={viewerOpen}
        images={viewerImages}
        currentIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
        onIndexChange={setViewerIndex}
      />
    </div>
  );
}
