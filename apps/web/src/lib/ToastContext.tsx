'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error';
type Ctx = {
  success: (message: string) => void;
  error: (message: string) => void;
  confirm: (message: string) => Promise<boolean>;
};

const ToastCtx = createContext<Ctx | null>(null);

export function useToast() {
  const c = useContext(ToastCtx);
  if (!c) throw new Error('useToast ToastProvider ichida ishlatilishi kerak');
  return c;
}

/** Butun platforma uchun yagona xabar (toast) tizimi: o'ng pastda, kichik, o'zi yo'qoladi. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ id: number; type: ToastType; message: string } | null>(null);
  const [ask, setAsk] = useState<{ message: string; resolve: (v: boolean) => void } | null>(null);
  const seq = useRef(0);

  const show = useCallback((type: ToastType, message: string) => setToast({ id: ++seq.current, type, message }), []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.type === 'error' ? 4500 : 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const confirm = useCallback((message: string) => new Promise<boolean>((resolve) => setAsk({ message, resolve })), []);
  const answer = (v: boolean) => { ask?.resolve(v); setAsk(null); };

  const value = React.useMemo<Ctx>(
    () => ({ success: (m) => show('success', m), error: (m) => show('error', m), confirm }),
    [show, confirm]
  );

  return (
    <ToastCtx.Provider value={value}>
      {children}

      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className={`toast-in fixed bottom-5 right-5 z-[100] max-w-[340px] flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg border ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
        </div>
      )}

      {ask && (
        <div className="fixed inset-0 z-[110] bg-slate-900/40 flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && answer(false)}>
          <div className="toast-in bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" role="alertdialog" aria-modal="true">
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">{ask.message}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => answer(false)} className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700">Bekor qilish</button>
              <button autoFocus onClick={() => answer(true)} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold">Ha, davom etish</button>
            </div>
          </div>
        </div>
      )}
    </ToastCtx.Provider>
  );
}
