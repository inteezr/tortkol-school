'use client';

import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

// teachers.png dizayni: pastel fon, rasm ustida yorliq, pastda oq matn bloki
export const PASTELS = ['bg-[#E0F0F2]', 'bg-[#FBE5DC]', 'bg-[#E1E6F2]'];
export const pastel = (i: number) => PASTELS[i % PASTELS.length];

export const getInitials = (n?: string) =>
  (n || '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

export function StaffPhoto({
  url, name, index, className = '', textSize = 'text-6xl',
}: { url?: string | null; name: string; index: number; className?: string; textSize?: string }) {
  return (
    <div className={`${pastel(index)} relative overflow-hidden ${className}`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img loading="lazy" decoding="async" src={url} alt={name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center font-extrabold text-slate-400/70 ${textSize}`}>{getInitials(name)}</div>
      )}
    </div>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] truncate px-3 py-1.5 rounded-lg bg-white text-xs font-medium text-slate-800 shadow-sm">
      {children}
    </span>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight inline-block relative">
      {children}
      <span className="absolute left-0 right-0 -bottom-1.5 h-[3px] rounded-full bg-gradient-to-r from-[#0284C7] to-[#7DD3FC]" />
    </h2>
  );
}

type CardProps = {
  index: number;
  name: string;
  chip?: string;
  text?: string;
  photoUrl?: string | null;
  meta?: React.ReactNode;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function StaffCard({ index, name, chip, text, photoUrl, meta, onClick, onEdit, onDelete }: CardProps) {
  const interactive = !!onClick;
  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onClick!()) : undefined}
      className={`group relative bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col text-left transition-all ${interactive ? 'cursor-pointer hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1' : ''}`}
    >
      <div className="relative">
        <StaffPhoto url={photoUrl} name={name} index={index} className="aspect-[4/4.4] w-full" />
        {chip && <Chip>{chip}</Chip>}
        {(onEdit || onDelete) && (
          <div className="absolute top-3 right-3 flex gap-1" onClick={(e) => e.stopPropagation()}>
            {onEdit && <button onClick={onEdit} title="Tahrirlash" className="p-2 rounded-lg bg-white/95 text-slate-600 hover:text-[#0047AB] shadow-sm"><Pencil className="w-4 h-4" /></button>}
            {onDelete && <button onClick={onDelete} title="O‘chirish" className="p-2 rounded-lg bg-white/95 text-slate-600 hover:text-rose-600 shadow-sm"><Trash2 className="w-4 h-4" /></button>}
          </div>
        )}
      </div>
      <div className="p-5 flex-1">
        <h3 className="text-base font-bold text-slate-900 leading-snug">{name}</h3>
        {text && <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">{text}</p>}
        {meta && <div className="mt-2">{meta}</div>}
      </div>
    </div>
  );
}
