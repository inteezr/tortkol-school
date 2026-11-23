'use client';

import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { StaffCard } from '../../components/StaffCard';
import { ImageUpload } from './ImageUpload';
import { useToast } from '../../lib/ToastContext';

export type StaffScope = 'teachers' | 'leaders';
export type StaffEditor = { scope: StaffScope; item: any | null } | null;

const input = 'mt-1.5 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-normal text-slate-900 outline-none transition focus:bg-white focus:border-[#052659] focus:ring-4 focus:ring-[#052659]/10';

export function StaffList({
  subTab, leaders, teachers, onEdit, onDelete,
}: {
  subTab: StaffScope;
  leaders: any[];
  teachers: any[];
  onEdit: (scope: StaffScope, item: any) => void;
  onDelete: (scope: StaffScope, item: any) => void;
}) {
  const isL = subTab === 'leaders';
  const items = isL ? leaders : teachers;
  if (!items.length) {
    return <p className="text-sm text-slate-500 py-10 text-center">{isL ? 'Hali rahbar qöşilmagan. Yuqoridagi “Rahbar qöşiş” tugmasini bosing.' : 'Hali öqituvçi qöşilmagan. Yuqoridagi “Öqituvçi qöşiş” tugmasini bosing.'}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((x, i) => (
        <StaffCard
          key={x.id}
          index={i}
          name={x.full_name}
          chip={(isL ? x.role : x.subject) || '—'}
          text={x.bio}
          photoUrl={x.photo_url}
          meta={isL
            ? <div className="text-[11px] text-slate-500">Qabul: <b className="text-slate-800">{x.reception_days}</b>{x.phone && <> · Tel: <b className="text-slate-800">{x.phone}</b></>}</div>
            : <div className="text-[11px] text-slate-500">{x.experience ? `${x.experience} tajriba` : 'Tajriba kiritilmagan'}{!(x.education || x.achievements) && <span className="ml-2 text-amber-600">· Batafsil ma’lumot yo‘q</span>}</div>}
          onEdit={() => onEdit(subTab, x)}
          onDelete={() => onDelete(subTab, x)}
        />
      ))}
    </div>
  );
}

const empty = (scope: StaffScope) =>
  scope === 'teachers'
    ? { full_name: '', subject: '', category: '', experience: '', bio: '', education: '', achievements: '', photo_url: '' }
    : { full_name: '', role: '', reception_days: '', phone: '', email: '', bio: '', photo_url: '' };

export function StaffModal({ editor, onClose, onSaved }: { editor: StaffEditor; onClose: () => void; onSaved: (msg: string, scope: StaffScope, row: any) => void }) {
  const [form, setForm] = useState<any>({});
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (editor) { setForm(editor.item ? { ...empty(editor.scope), ...editor.item } : empty(editor.scope)); }
  }, [editor]);

  if (!editor) return null;
  const { scope, item } = editor;
  const isT = scope === 'teachers';
  const set = (k: string) => (e: React.ChangeEvent<any>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`/api/teachers?scope=${scope}${item ? `&id=${item.id}` : ''}`, {
        method: item ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Saqlab bölmadi');
      onSaved(item ? 'Maʼlumotlar yangilandi' : isT ? 'Öqituvçi qöşildi' : 'Rahbar qöşildi', scope, data.item);
    } catch (err: any) { toast.error(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">{item ? 'Tahrirlaş' : isT ? 'Öqituvçi qöşiş' : 'Rahbar qöşiş'}</h3>
            <p className="text-xs text-slate-500 mt-1">{isT ? 'Ism, fan va tajriba kartada körinadi. Qolgan maʼlumotlar karta bosilganda çiqadi.' : 'Rahbariyat sahifasida körinadigan maʼlumotlar.'}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100"><X className="w-4 h-4" /></button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block text-xs font-bold text-slate-700 sm:col-span-2">Ism-familiya *<input required value={form.full_name || ''} onChange={set('full_name')} className={input} /></label>
          {isT ? (
            <>
              <label className="block text-xs font-bold text-slate-700">Fani *<input required value={form.subject || ''} onChange={set('subject')} placeholder="Matematika" className={input} /></label>
              <label className="block text-xs font-bold text-slate-700">Tajribasi<input value={form.experience || ''} onChange={set('experience')} placeholder="12 yil" className={input} /></label>
              <label className="block text-xs font-bold text-slate-700">Toifasi<input value={form.category || ''} onChange={set('category')} placeholder="Oliy toifa" className={input} /></label>
              <ImageUpload label="Rasm" value={form.photo_url || ''} onChange={(u) => setForm({ ...form, photo_url: u })} />
              <label className="block text-xs font-bold text-slate-700 sm:col-span-2">Qisqaça tavsif<textarea rows={2} value={form.bio || ''} onChange={set('bio')} className={input} /></label>
              <label className="block text-xs font-bold text-slate-700 sm:col-span-2">Ma’lumoti (batafsil)<textarea rows={3} value={form.education || ''} onChange={set('education')} placeholder="Oliy ta’lim, universitet, yil..." className={input} /></label>
              <label className="block text-xs font-bold text-slate-700 sm:col-span-2">Yutuqlari (batafsil)<textarea rows={3} value={form.achievements || ''} onChange={set('achievements')} placeholder="Mukofotlar, öquvçilar natijalari..." className={input} /></label>
            </>
          ) : (
            <>
              <label className="block text-xs font-bold text-slate-700">Lavozimi *<input required value={form.role || ''} onChange={set('role')} placeholder="Maktab direktori" className={input} /></label>
              <label className="block text-xs font-bold text-slate-700">Qabul kunlari *<input required value={form.reception_days || ''} onChange={set('reception_days')} placeholder="Duşanba, Çorşanba 10:00–12:00" className={input} /></label>
              <label className="block text-xs font-bold text-slate-700">Telefon<input value={form.phone || ''} onChange={set('phone')} className={input} /></label>
              <label className="block text-xs font-bold text-slate-700">Email<input type="email" value={form.email || ''} onChange={set('email')} className={input} /></label>
              <ImageUpload label="Rasm" value={form.photo_url || ''} onChange={(u) => setForm({ ...form, photo_url: u })} />
              <label className="block text-xs font-bold text-slate-700 sm:col-span-2">Biografiya<textarea rows={4} value={form.bio || ''} onChange={set('bio')} className={input} /></label>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700">Bekor qiliş</button>
          <button type="submit" disabled={busy} className="px-5 py-2.5 rounded-xl bg-[#052659] hover:bg-[#031A3F] text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}{item ? 'Saqlaş' : 'Qöşiş'}
          </button>
        </div>
      </form>
    </div>
  );
}
