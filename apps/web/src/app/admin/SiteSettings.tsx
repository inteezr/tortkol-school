'use client';

import React, { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '../../lib/ToastContext';
import { ImageUpload } from './ImageUpload';
import { card, inputCls, btnPrimary } from './ui';

type S = { students: number; teachers: number; classes: number; photo: string };

/** Sozlamalar server tomonidan tayyor keladi: ochilganda yuklanish kutilmaydi. */
export function SiteSettings({ initial, onSaved }: { initial: S; onSaved: (s: S) => void }) {
  const toast = useToast();
  const [form, setForm] = useState({ students: String(initial.students), teachers: String(initial.teachers), classes: String(initial.classes), photo: initial.photo || '' });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/site-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Saqlab bölmadi');
      onSaved({ students: data.students, teachers: data.teachers, classes: data.classes, photo: data.photo });
      toast.success('Saqlandi. Saytda darhol yangilandi');
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  const field = (key: 'students' | 'teachers' | 'classes', label: string) => (
    <label className="block text-xs font-semibold text-slate-700">{label}
      <input type="number" min={0} required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={`${inputCls} mt-1.5`} />
    </label>
  );

  return (
    <form onSubmit={save} className={`${card} p-6 max-w-2xl space-y-5 adm-fade`}>
      <div>
        <h2 className="font-semibold text-slate-900 text-lg">Sayt: maktab rasmi va statistika</h2>
        <p className="text-xs text-slate-500 mt-1">Statistika boş sahifada çiqadi. Maktab rasmi boş sahifada va «Maktab haqida» sahifasida çiqadi.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {field('students', 'Öquvçilar soni')}
        {field('teachers', 'Öqituvçilar soni')}
        {field('classes', 'Sinflar soni')}
      </div>
      <div className="grid grid-cols-1"><ImageUpload label="Maktab rasmi (boş sahifa va «Maktab haqida»)" value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} /></div>
      <button disabled={saving} className={btnPrimary}>{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Saqlaş</button>
    </form>
  );
}
