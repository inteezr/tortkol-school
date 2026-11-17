'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { useToast } from '../../lib/ToastContext';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function BoglanishPage() {
  const { t, tr } = useLanguage();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          subject: formData.email ? `Murojaat (${formData.email})` : 'Umumiy murojaat',
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Xatolik yuz berdi');
      }

      toast.success('Murojaatingiz qabul qilindi. Tez orada bog‘lanamiz!');
      setFormData({ fullName: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      toast.error(err.message || 'Murojaat yuborishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {tr("Biz bilan bog'lanish")}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            {tr("Maktab ma'muriyati bilan aloqa o'rnatish, qabul yoki ta'lim bo'yicha savollaringizni yuborishingiz mumkin.")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Chap ustun: Rekvizitlar */}
          <div className="space-y-6">
            <div className="card-bento p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                {tr("Aloqa ma'lumotlari")}
              </h3>

              <div className="space-y-6 text-sm text-slate-600">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{tr("Manzilimiz:")}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{tr("Qoraqalpog'iston Respublikasi, To'rtko'l tumani, Mustaqillik ko'chasi")}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{tr("Telefon raqamlar:")}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{tr("+998 (61) 720-00-00, Call-markaz: 1206")}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{tr("Elektron pochta:")}</div>
                    <div className="mt-0.5 text-xs text-slate-500">info@tortkol-maktab.uz</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{tr("Ish vaqti:")}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{tr("Dushanba - Shanba: 08:00 - 17:00 (Yakshanba dam olish kuni)")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Xarita kartasi */}
            <div className="card-bento p-6 aspect-[16/9] bg-slate-100 flex items-center justify-center text-center text-slate-400 text-xs">
              <div>
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-slate-700">{tr("To'rtko'l tuman ixtisoslashtirilgan maktabi lokatsiyasi")}</div>
                <div>{tr("Xarita koordinatasi: 41.5542° N, 60.9984° E")}</div>
              </div>
            </div>
          </div>

          {/* O'ng ustun: Murojaat formasi */}
          <div className="card-bento p-8 sm:p-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {tr("Onlayn murojaat yuborish")}
            </h3>
            <p className="text-xs text-slate-500 mb-8">
              {tr("Savol, taklif yoki fikr-mulohazangizni yozib qoldiring. Ma'muriyat qisqa fursatda javob beradi.")}
            </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {tr("Ism-sharifingiz")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={tr("Masalan: Karim Aliyev")}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {tr("Telefon raqamingiz")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+998 90 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 text-sm focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {tr("Email manzilingiz")}
                    </label>
                    <input
                      type="email"
                      placeholder="example@mail.uz"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {tr("Xabaringiz matni")} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={tr("Savolingiz yoki murojaatingizni batafsil yozing...")}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 text-sm focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-sky-500/25 active:scale-95 transition-all"
                >
                  <span>{loading ? 'Yuborilmoqda...' : 'Murojaatni yuborish'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}
