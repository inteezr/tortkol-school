'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useToast } from '../../lib/ToastContext';

const input = 'mt-1.5 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-normal text-slate-900 outline-none transition focus:bg-white focus:border-[#052659] focus:ring-4 focus:ring-[#052659]/10';

export function ProfileModal({ username, onClose, onSaved }: { username: string; onClose: () => void; onSaved: (username: string) => void }) {
  const [form, setForm] = useState({ currentPassword: '', newUsername: '', newPassword: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirm) return toast.error('Yangi parollar mos kelmadi');
    setBusy(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newUsername: form.newUsername || undefined, newPassword: form.newPassword || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Xatolik');
      setForm({ currentPassword: '', newUsername: '', newPassword: '', confirm: '' });
      toast.success('Login/parol yangilandi');
      onSaved(data.user.username);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Admin login va paroli</h3>
            <p className="text-xs text-slate-500 mt-1">Joriy login: <b className="text-slate-800">{username}</b>. Özgartiriş uçun joriy parol kerak.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100" aria-label="Yopiş"><X className="w-4 h-4" /></button>
        </div>
        <label className="block text-xs font-bold text-slate-700">Joriy parol *
          <input type="password" required value={form.currentPassword} onChange={set('currentPassword')} autoComplete="current-password" className={input} />
        </label>
        <label className="block text-xs font-bold text-slate-700">Yangi login
          <input value={form.newUsername} onChange={set('newUsername')} placeholder={username} autoComplete="username" className={input} />
        </label>
        <label className="block text-xs font-bold text-slate-700">Yangi parol (kamida 8 belgi)
          <input type="password" value={form.newPassword} onChange={set('newPassword')} autoComplete="new-password" className={input} />
        </label>
        <label className="block text-xs font-bold text-slate-700">Yangi parolni takrorlang
          <input type="password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" className={input} />
        </label>
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700">Yopiş</button>
          <button type="submit" disabled={busy} className="px-5 py-2.5 rounded-xl bg-[#052659] hover:bg-[#031A3F] text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-2">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}Saqlaş
          </button>
        </div>
      </form>
    </div>
  );
}
