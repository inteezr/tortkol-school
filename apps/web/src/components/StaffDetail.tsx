'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/** Rahbar / o'qituvchi alohida sahifasi: chapda rasm ramkasi, o'ngda ma'lumotlar. */
export function StaffDetail({
  backHref, backLabel, name, imageUrl, initials, accentColor, children,
}: {
  backHref: string;
  backLabel: string;
  name: string;
  imageUrl: string | null;
  initials: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-semibold text-[#052659] hover:gap-3 transition-all mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>{backLabel}</span>
        </Link>

        <article className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(2,16,36,0.08)] overflow-hidden md:grid md:grid-cols-[2fr_3fr]">
          {/* Rasm ramkani to'liq egallaydi */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[540px] bg-slate-100 overflow-hidden">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img decoding="async" src={imageUrl} alt={name} className="absolute inset-0 w-full h-full object-cover object-top" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} flex items-center justify-center text-white font-extrabold text-7xl`}>{initials}</div>
            )}
          </div>
          <div className="p-6 sm:p-10">{children}</div>
        </article>
      </div>
    </div>
  );
}

export function StaffNotFound({ backHref, backLabel, text }: { backHref: string; backLabel: string; text: string }) {
  return (
    <div className="py-24 text-center px-4">
      <p className="text-slate-500 mb-6">{text}</p>
      <Link href={backHref} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#052659] text-white text-sm font-semibold hover:bg-[#031A3F]">
        <ArrowLeft className="w-4 h-4" />{backLabel}
      </Link>
    </div>
  );
}
