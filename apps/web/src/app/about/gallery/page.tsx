'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../../lib/LanguageContext';
import { Image as ImageIcon, Video, Play, ZoomIn } from 'lucide-react';
import { ImageViewer } from '../../../components/ImageViewer';

export default function GalereyaPage() {
  const { t, tr } = useLanguage();
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const photoAlbums: { id: number; title: string; caption: string; count: string; coverUrl: string }[] = [];

  const viewerImages = photoAlbums.map(album => ({
    url: album.coverUrl,
    title: album.title,
    caption: album.caption,
  }));

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const videos: { id: number; title: string; duration: string; coverUrl: string; embedUrl: string }[] = [];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.nav.gallery}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            {tr("Maktabimiz hayoti, o'quv jarayonlari va yutuqlarimizdan fotolavhalar hamda videoroliklar.")}
          </p>

          {/* Tablar: Fotolar / Videolar */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'photos'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{tr("Fotoalbomlar")}</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'videos'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>{tr("Videolavhalar")}</span>
            </button>
          </div>
        </div>

        {/* Fotolar qismi */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {photoAlbums.length === 0 && (
              <p className="col-span-full text-center text-slate-500 py-10">{tr("Hozircha fotoalbomlar qo'shilmagan.")}</p>
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
        )}

        {/* Videolar qismi */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.length === 0 && (
              <p className="col-span-full text-center text-slate-500 py-10">{tr("Hozircha videolar qo'shilmagan.")}</p>
            )}
            {videos.map((vid) => (
              <div key={vid.id} className="card-bento overflow-hidden group cursor-pointer">
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                  <img loading="lazy" decoding="async"
                    src={vid.coverUrl}
                    alt={tr(vid.title)}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md text-white">
                    {vid.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                    {tr(vid.title)}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
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
