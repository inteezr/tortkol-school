'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * Admin panel uchun popup oyna.
 * - Admin ildiziga (#admin-portal) chiziladi: ota elementlarning transform/overflow'i uni kesmaydi,
 *   tungi rejim klassi esa saqlanadi.
 * - Orqa fon xiralashtiriladi, Esc yoki tashqariga bosish yopadi, sahifa orqada aylanmaydi.
 */
export function Modal({
  open, onClose, title, subtitle, icon, footer, children, size = 'lg', busy = false,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
  /** Saqlanayotganda tasodifan yopilib ketmasin */
  busy?: boolean;
}) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => { setTarget(document.getElementById('admin-portal') || document.body); }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !busy) onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, busy, onClose]);

  if (!open || !target) return null;
  const width = { md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[size];

  return createPortal(
    <div
      className="adm-modal-backdrop fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-950/55 backdrop-blur-[3px] p-0 sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className={`adm-modal-panel w-full ${width} max-h-[94vh] sm:max-h-[88vh] flex flex-col bg-white rounded-t-3xl sm:rounded-3xl shadow-[0_30px_80px_-20px_rgba(2,16,36,0.45)] border border-slate-200/70 overflow-hidden`}>
        <div className="flex items-start gap-3 px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-slate-100">
          {icon && <div className="w-10 h-10 rounded-xl bg-[#E6F0FB] text-[#052659] flex items-center justify-center shrink-0">{icon}</div>}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Yopiş" className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5">{children}</div>
        {footer && <div className="px-5 sm:px-7 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    target
  );
}
