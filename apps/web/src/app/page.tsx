'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Hero } from '../components/Hero';
import { BentoStats } from '../components/BentoStats';
const DirectionsSection = dynamic(() => import('../components/DirectionsSection').then((m) => m.DirectionsSection));
const NewsSection = dynamic(() => import('../components/NewsSection').then((m) => m.NewsSection));
const GalleryPreview = dynamic(() => import('../components/GalleryPreview').then((m) => m.GalleryPreview));
const AdmissionBanner = dynamic(() => import('../components/AdmissionBanner').then((m) => m.AdmissionBanner));

export default function HomePage() {
  return (
    <div>
      <Hero />
      <BentoStats />
      <DirectionsSection />
      <NewsSection />
      <GalleryPreview />
      <AdmissionBanner />
    </div>
  );
}
