'use client';

import React, { useRef, useState } from 'react';
import { Plus, Trash2, Upload, Loader2, ArrowLeft, ImageIcon } from 'lucide-react';
import { useToast } from '../../lib/ToastContext';
import { compressImage } from '../../lib/compress-image';
import { card, inputCls, btnPrimary, btnGhost, Empty } from './ui';

type Album = { id: number; title: string; description?: string | null; cover_image?: string | null; media: { id: number; url: string }[] };

/** Albomlar server tomonidan tayyor keladi; har bir amal javobi bilan lokal holat yangilanadi (qayta yuklash yo'q). */
export function GalleryManager({ albums, setAlbums }: { albums: Album[]; setAlbums: React.Dispatch<React.SetStateAction<any[]>> }) {
  const toast = useToast();
  const [openId, setOpenId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const album = albums.find((a) => a.id === openId) || null;
  const patch = (id: number, fn: (a: Album) => Album) => setAlbums((l) => l.map((a) => (a.id === id ? fn(a) : a)));

  const createAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      toast.success('Albom yaratildi');
      setAlbums((l) => [{ ...d.album, media: [] }, ...l]);
      setForm({ title: '', description: '' }); setCreating(false);
      setOpenId(d.album.id);
    } catch (err: any) { toast.error(err.message || 'Xatolik'); } finally { setBusy(false); }
  };

  const deleteAlbum = async (a: Album) => {
    if (!(await toast.confirm(`“${a.title}” albomi va undagi barça rasmlar öçirilsinmi?`))) return;
    const r = await fetch(`/api/gallery?id=${a.id}`, { method: 'DELETE' });
    if (r.ok) { toast.success('Albom öçirildi'); setOpenId(null); setAlbums((l) => l.filter((x) => x.id !== a.id)); } else toast.error('Öçirib bölmadi');
  };

  const deletePhoto = async (a: Album, m: { id: number; url: string }) => {
    patch(a.id, (x) => ({ ...x, media: x.media.filter((y) => y.id !== m.id) })); // darhol ko'rsatamiz
    const r = await fetch(`/api/gallery?media=${m.id}`, { method: 'DELETE' });
    if (!r.ok) { toast.error('Öçirib bölmadi'); patch(a.id, (x) => ({ ...x, media: [...x.media, m].sort((p, q) => p.id - q.id) })); }
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length || !album) return;
    setBusy(true);
    const urls: string[] = [];
    try {
      let done = 0, next = 0;
      const worker = async () => {
        while (next < files.length) {
          const f = files[next++];
          const fd = new FormData();
          fd.append('file', await compressImage(f));
          const r = await fetch('/api/upload', { method: 'POST', body: fd });
          const d = await r.json().catch(() => ({}));
          if (!r.ok) toast.error(`${f.name}: ${d.error || 'Yuklab bölmadi'}`); else urls.push(d.url);
          setProgress(`${++done} / ${files.length}`);
        }
      };
      setProgress(`0 / ${files.length}`);
      await Promise.all(Array.from({ length: Math.min(4, files.length) }, worker));
      if (urls.length) {
        const r = await fetch(`/api/gallery?album=${album.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ urls }) });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        patch(album.id, (x) => ({ ...x, cover_image: x.cover_image || urls[0], media: [...x.media, ...d.media] }));
        toast.success(`${urls.length} ta rasm qöşildi`);
      }
    } catch (err: any) { toast.error(err.message || 'Xatolik'); } finally { setBusy(false); setProgress(''); }
  };

  const setCover = async (a: Album, url: string) => {
    const r = await fetch(`/api/gallery?id=${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: a.title, description: a.description, cover_image: url }) });
    if (r.ok) { toast.success('Muqova özgartirildi'); patch(a.id, (x) => ({ ...x, cover_image: url })); } else toast.error('Xatolik');
  };

  // ---- Bitta albom ichi ----
  if (album) {
    return (
      <div className="space-y-4 adm-fade">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => setOpenId(null)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"><ArrowLeft className="w-4 h-4" />Albomlarga qaytiş</button>
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={upload} className="hidden" />
            <button onClick={() => fileRef.current?.click()} disabled={busy} className={btnPrimary}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}{busy ? `Yuklanmoqda ${progress}` : 'Rasmlar qöşiş'}
            </button>
            <button onClick={() => deleteAlbum(album)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-semibold hover:bg-rose-50 transition-colors"><Trash2 className="w-4 h-4" />Albomni öçiriş</button>
          </div>
        </div>
        <div className={`${card} p-5`}>
          <h2 className="text-xl font-semibold text-slate-900">{album.title}</h2>
          {album.description && <p className="text-sm text-slate-500 mt-1">{album.description}</p>}
          <p className="text-xs text-slate-400 mt-2">Bir vaqtda bir neçta rasm tanlaş mumkin (JPG, PNG, WebP, GIF · har biri ≤ 2 MB). Rasmlar avtomatik kiçraytiriladi.</p>
        </div>
        {album.media.length === 0 ? (
          <div className={`${card} border-dashed`}><Empty>Albomda hali rasm yöq. “Rasmlar qöşiş” tugmasini bosing.</Empty></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3">
            {album.media.map((m) => (
              <div key={m.id} className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200/70">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                {album.cover_image === m.url && <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#052659] text-white px-2 py-0.5 rounded-md">Muqova</span>}
                <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setCover(album, m.url)} className="text-[11px] font-semibold text-white bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md">Muqova</button>
                  <button onClick={() => deletePhoto(album, m)} title="Öçiriş" className="text-white bg-rose-500/90 hover:bg-rose-600 p-1.5 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---- Albomlar ro'yxati ----
  return (
    <div className="space-y-4 adm-fade">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">{albums.length} ta albom</div>
        <button onClick={() => setCreating((v) => !v)} className={btnPrimary}><Plus className="w-4 h-4" />Yangi albom</button>
      </div>
      {creating && (
        <form onSubmit={createAlbum} className={`${card} p-5 grid sm:grid-cols-2 gap-4`}>
          <label className="text-xs font-semibold text-slate-700">Albom nomi *
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`${inputCls} mt-1.5`} placeholder="Masalan: Bilimlar kuni 2026" />
          </label>
          <label className="text-xs font-semibold text-slate-700">Qisqa izoh
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <div className="sm:col-span-2 flex gap-2 justify-end">
            <button type="button" onClick={() => setCreating(false)} className={btnGhost}>Bekor qiliş</button>
            <button disabled={busy} className={btnPrimary}>Yaratiş</button>
          </div>
        </form>
      )}
      {albums.length === 0 ? (
        <div className={`${card} border-dashed`}><Empty>Hali albom yöq. “Yangi albom” tugmasi bilan boşlang.</Empty></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {albums.map((a) => (
            <button key={a.id} onClick={() => setOpenId(a.id)} className={`${card} text-left overflow-hidden hover:border-[#052659]/40 hover:shadow-md transition-all`}>
              <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center">
                {a.cover_image /* eslint-disable-next-line @next/next/no-img-element */ ? <img src={a.cover_image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-slate-300" />}
              </div>
              <div className="p-4">
                <div className="font-semibold text-slate-900 truncate">{a.title}</div>
                <div className="text-xs text-slate-500 mt-1">{a.media.length} ta rasm</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
