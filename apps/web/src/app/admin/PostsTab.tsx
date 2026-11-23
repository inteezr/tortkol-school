'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Trash2, ArrowUpRight, Loader2, Search, FilePlus2, Send, PencilLine, Save } from 'lucide-react';
import { useToast } from '../../lib/ToastContext';
import { ImageUpload } from './ImageUpload';
import { Modal } from './Modal';
import { POST_CATEGORIES, postCategory } from '../../lib/post-categories';
import { card, inputCls, btnPrimary, btnGhost, Pill, Empty, fmtDate } from './ui';

const empty = { title: '', status: 'published', excerpt: '', content: '', coverImage: '', category: '' };

type Props = {
  posts: any[];
  modalOpen: boolean;
  initialSearch: string;
  onModal: (open: boolean) => void;
  onCreated: (post: any) => void;
  onUpdated: (post: any) => void;
  /** true — o'chirildi */
  onDelete: (id: number, title: string) => Promise<boolean>;
};

export default function PostsTab({ posts, modalOpen, initialSearch, onModal, onCreated, onUpdated, onDelete }: Props) {
  const toast = useToast();
  const [filter, setFilter] = useState<string>('all'); // 'all' yoki turkum slug'i
  const [q, setQ] = useState(initialSearch);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  // Tahrirlanayotgan post (null — yangi post yaratilmoqda)
  const [editing, setEditing] = useState<any | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const isDraft = editing?.status === 'draft';

  /** Ro'yxatdagi postni bosganda: to'liq matni bilan yuklab, formaga qo'yiladi */
  const openEdit = async (p: any) => {
    setEditing(p);
    setForm({ ...empty, title: p.title || '', excerpt: p.excerpt || '', coverImage: p.cover_image || '', category: postCategory(p)?.slug || '', status: p.status });
    setLoadingPost(true);
    onModal(true);
    try {
      const res = await fetch(`/api/posts?id=${p.id}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Postni yuklab bölmadi');
      const d = data.post;
      setForm({ title: d.title || '', excerpt: d.excerpt || '', content: d.content || '', coverImage: d.cover_image || '', category: d.category || '', status: d.status });
    } catch (err: any) { toast.error(err.message); closeModal(); } finally { setLoadingPost(false); }
  };

  const closeModal = () => {
    onModal(false);
    // Tahrirlash yopilsa forma tozalanadi (yangi post qoralamasi esa saqlanib qoladi)
    if (editing) { setEditing(null); setForm(empty); }
  };

  const removeFromModal = async () => {
    if (!editing) return;
    if (await onDelete(editing.id, form.title || editing.title)) { setEditing(null); setForm(empty); onModal(false); }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: posts.length };
    posts.forEach((p) => { const k = postCategory(p)?.slug; if (k) c[k] = (c[k] || 0) + 1; });
    return c;
  }, [posts]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return posts.filter((p) => (filter === 'all' || postCategory(p)?.slug === filter) && (!s || p.title.toLowerCase().includes(s) || (p.excerpt || '').toLowerCase().includes(s)));
  }, [posts, filter, q]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) { toast.error('Turkumni tanlang: Olimpiada, Ta’lim, Tadbirlar yoki E’lonlar'); return; }
    setBusy(true);
    try {
      if (editing) {
        // Tahrirlash: qoralama -> "Nashr qilish", nashrdagi post -> "Saqlash" (nashrda qoladi)
        const res = await fetch(`/api/posts?id=${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, status: 'published' }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Saqlaşda xatolik yuz berdi');
        toast.success(isDraft ? 'Qoralama naşr qilindi' : 'Özgarişlar saqlandi');
        if (data.post) onUpdated(data.post);
        setEditing(null);
        setForm(empty);
        onModal(false);
        return;
      }
      const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Post yaratişda xatolik yuz berdi');
      toast.success('Post muvaffaqiyatli saqlandi');
      setForm(empty);
      onModal(false);
      if (data.post) onCreated(data.post);
    } catch (err: any) { toast.error(err.message); } finally { setBusy(false); }
  };

  const tabs: [string, string][] = [['all', 'Barçasi'], ...POST_CATEGORIES.map((c) => [c.slug, c.label] as [string, string])];

  return (
    <div className="space-y-4 adm-fade">
      <div className={`${card} p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3`}>
        <div className="flex flex-wrap gap-1.5">
          {tabs.map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${filter === k ? 'bg-[#052659] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {label} <span className={filter === k ? 'text-white/70' : 'text-slate-400'}>{counts[k] || 0}</span>
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Materiallardan qidiriş…" className={`${inputCls} pl-10`} />
        </div>
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="py-3 px-5 font-medium">Material</th>
                <th className="py-3 px-4 font-medium">Turkum</th>
                <th className="py-3 px-4 font-medium">Holati</th>
                <th className="py-3 px-4 font-medium">Sana</th>
                <th className="py-3 px-5 text-right font-medium">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((p) => (
                <tr key={p.id} onClick={() => openEdit(p)} title="Tahrirlaş uçun bosing" className="hover:bg-slate-50/60 cursor-pointer">
                  <td className="py-3.5 px-5 max-w-md">
                    <div className="font-semibold text-slate-900 line-clamp-1">{p.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.excerpt}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs font-semibold text-[#052659]">{postCategory(p) ? postCategory(p)!.label : <span className="text-slate-400 font-normal">—</span>}</td>
                  <td className="py-3.5 px-4"><Pill tone={p.status === 'published' ? 'green' : 'amber'} dot>{p.status === 'published' ? 'Naşrda' : 'Qoralama'}</Pill></td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{fmtDate(p.published_at)}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {p.status === 'published' && <Link href={`/news/${p.slug}`} target="_blank" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E6F0FB] text-[#052659] hover:bg-[#d5e6f8] font-semibold text-xs transition-colors">Oçiş <ArrowUpRight className="w-3 h-3" /></Link>}
                      <button onClick={() => onDelete(p.id, p.title)} title="Öçiriş" className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <Empty>Mos keluvçi materiallar topilmadi</Empty>}
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        busy={busy}
        size="xl"
        icon={editing ? <PencilLine className="w-5 h-5" /> : <FilePlus2 className="w-5 h-5" />}
        title={editing ? (isDraft ? 'Qoralama' : 'Postni tahrirlaş') : 'Yangi material qöşiş'}
        footer={<>
          {editing && (
            <button type="button" onClick={removeFromModal} disabled={busy || loadingPost} className="mr-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors">
              <Trash2 className="w-4 h-4" /> O‘chirish
            </button>
          )}
          <button type="button" onClick={closeModal} disabled={busy} className={btnGhost}>Bekor qilish</button>
          <button type="submit" form="post-form" disabled={busy || loadingPost} className={btnPrimary}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : editing && !isDraft ? <Save className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {busy ? 'Saqlanmoqda…' : editing ? (isDraft ? 'Nashr qilish' : 'Saqlash') : form.status === 'draft' ? 'Qoralamani saqlash' : 'Nashr qilish'}
          </button>
        </>}
      >
        {loadingPost && (
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /> Yuklanmoqda…</div>
        )}
        <form id="post-form" onSubmit={submit} className={`grid lg:grid-cols-[1fr_280px] gap-6 transition-opacity ${loadingPost ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Chap: matn */}
          <div className="space-y-4 min-w-0">
            <label className="block text-xs font-semibold text-slate-700">Sarlavha <span className="text-rose-500">*</span>
              <input required autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Masalan: Fan olimpiadasi ğoliblari taqdirlandi" className={`${inputCls} mt-1.5 text-base font-semibold`} />
            </label>
            <div>
              <div className="text-xs font-semibold text-slate-700">Turkum <span className="text-rose-500">*</span>
                <span className="font-normal text-slate-400"> — saytdagi «Yangiliklar» bölimida şu turkum böyiça saralanadi</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Turkum">
                {POST_CATEGORIES.map((c) => {
                  const on = form.category === c.slug;
                  return (
                    <button key={c.slug} type="button" role="radio" aria-checked={on} onClick={() => setForm({ ...form, category: c.slug })}
                      className={`px-3.5 py-2 rounded-full text-sm font-semibold border transition-all ${on ? 'bg-[#052659] border-[#052659] text-white shadow-md shadow-[#052659]/20' : 'bg-white border-slate-200 text-slate-600 hover:border-[#5483B3] hover:text-[#052659]'}`}>
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="block text-xs font-semibold text-slate-700">Qisqa anons
              <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="1–2 jumlalik qisqaça mazmun (röyxatda körinadi)…" className={`${inputCls} mt-1.5 resize-none`} />
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              <span className="flex items-center justify-between">
                <span>Töliq matn <span className="text-rose-500">*</span></span>
                <span className="font-normal text-slate-400">{form.content.length} belgi</span>
              </span>
              <textarea rows={12} required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Maqola matni…" className={`${inputCls} mt-1.5 leading-relaxed min-h-[260px]`} />
            </label>
          </div>

          {/* O'ng: sozlamalar */}
          <aside className="space-y-4">
            {editing ? (
              // Tahrirlashda holat tugmalar orqali hal qilinadi
              <div className={`rounded-2xl border p-4 ${isDraft ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50'}`}>
                <Pill tone={isDraft ? 'amber' : 'green'} dot>{isDraft ? 'Qoralama' : 'Naşrda'}</Pill>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                  {isDraft ? 'Saytda körinmaydi. «Naşr qiliş» bosilsa, özgarişlar bilan birga saytda çiqadi.' : 'Özgarişlar «Saqlaş» bosilgan zahoti saytda yangilanadi.'}
                </p>
              </div>
            ) : (
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5">Holati</div>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white border border-slate-200/70">
                  {([['published', 'Naşr'], ['draft', 'Qoralama']] as const).map(([v, l]) => (
                    <button key={v} type="button" onClick={() => setForm({ ...form, status: v })}
                      className={`py-2 rounded-lg text-xs font-semibold transition-colors ${form.status === v ? 'bg-[#052659] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{l}</button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">{form.status === 'published' ? 'Saqlangan zahoti saytda çiqadi.' : 'Saytda körinmaydi, keyin naşr qiliş mumkin.'}</p>
              </div>
            </div>
            )}
            <div className="rounded-2xl border border-slate-200/70 p-4">
              <ImageUpload label="Muqova rasmi" value={form.coverImage} onChange={(u) => setForm({ ...form, coverImage: u })} />
            </div>
          </aside>
        </form>
      </Modal>
    </div>
  );
}
