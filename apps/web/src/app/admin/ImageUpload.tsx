'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from '../../lib/ToastContext';
import { compressImage } from '../../lib/compress-image';

export function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', await compressImage(file));
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Yuklab bölmadi');
      onChange(data.url);
      toast.success('Rasm yuklandi');
    } catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="sm:col-span-2">
      <div className="text-xs font-bold text-slate-700">{label}</div>
      <div className="mt-1.5 flex items-center gap-3">
        <div className="w-16 h-16 rounded-xl border border-dashed border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center flex-shrink-0">
          {value ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={value} alt="" className="w-full h-full object-cover" /> : <Upload className="w-5 h-5 text-slate-400" />}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={pick} className="hidden" />
            <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="px-3.5 py-2 rounded-xl bg-[#052659] hover:bg-[#031A3F] text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-2">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}{busy ? 'Yuklanmoqda...' : 'Fayl tanlaş'}
            </button>
            {value && <button type="button" onClick={() => onChange('')} className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50" title="Olib taşlaş"><X className="w-4 h-4" /></button>}
          </div>
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="yoki rasm havolasi (https://...)" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 outline-none focus:border-[#052659]" />
          <div className="text-[10px] text-slate-400">JPG, PNG, WebP, GIF · eng köpi bilan 2 MB</div>
        </div>
      </div>
    </div>
  );
}
