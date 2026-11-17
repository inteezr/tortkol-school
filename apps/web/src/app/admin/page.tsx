'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Mail, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  LogOut,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Search,
  School,
  Sparkles,
  Database,
  Calendar,
  Phone,
  Eye,
  Check,
  ArrowUpRight,
  Clock,
  Layers,
  BookOpen,
  Filter,
  X,
  MessageSquare
} from 'lucide-react';
import { useToast } from '../../lib/ToastContext';
import { ImageUpload } from './ImageUpload';
import { ProfileModal } from './ProfileModal';
import { StaffList, StaffModal, type StaffEditor, type StaffScope } from './StaffManager';

export default function AdminPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'teachers' | 'messages'>('overview');
  const [showProfile, setShowProfile] = useState(false);
  
  // Ma'lumotlar state'lari
  const [postsList, setPostsList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [leadersList, setLeadersList] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const setFeedback = (f: { type: 'success' | 'error'; message: string } | null) => { if (f) toast[f.type](f.message); };

  // Qidiruv va filtrlar
  const [searchQuery, setSearchQuery] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState<'all' | 'news' | 'education'>('all');
  const [staffEditor, setStaffEditor] = useState<StaffEditor>(null);
  const [teacherSubTab, setTeacherSubTab] = useState<'leaders' | 'teachers'>('leaders');
  const [messageFilter, setMessageFilter] = useState<'all' | 'new' | 'read'>('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // Yangi post formasi
  const [newPost, setNewPost] = useState({
    title: '',
    type: 'news',
    status: 'published',
    excerpt: '',
    content: '',
    coverImage: '',
  });

  // 1. Auth tekshiruvi
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch('/api/admin/me');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/admin/login');
          return;
        }
        setAdminUser(data.user);
      } catch {
        router.replace('/admin/login');
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAuth();
  }, [router]);

  // 2. Barcha ma'lumotlarni yuklash
  const loadData = async () => {
    try {
      setLoadingData(true);
      const [resPosts, resTeachers, resLeaders, resMessages] = await Promise.all([
        fetch(`/api/posts?_=${Date.now()}`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ posts: [] })),
        fetch(`/api/teachers?scope=teachers&_=${Date.now()}`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ teachers: [] })),
        fetch(`/api/teachers?scope=leaders&_=${Date.now()}`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ leaders: [] })),
        fetch('/api/contact').then(r => r.json()).catch(() => ({ messages: [] })),
      ]);

      if (resPosts.posts) setPostsList(resPosts.posts);
      if (resTeachers.teachers) setTeachersList(resTeachers.teachers);
      if (resLeaders.leaders) setLeadersList(resLeaders.leaders);
      if (resMessages.messages) setMessagesList(resMessages.messages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!checkingAuth) {
      loadData();
    }
  }, [checkingAuth]);

  const handleStaffDelete = async (scope: StaffScope, item: any) => {
    if (!(await toast.confirm(`“${item.full_name}” ni o‘chirmoqchimisiz?`))) return;
    try {
      const res = await fetch(`/api/teachers?scope=${scope}&id=${item.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'O‘chirib bo‘lmadi');
      setFeedback({ type: 'success', message: 'O‘chirildi' });
      loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // Chiqish (Logout)
  const handleLogout = async () => {
    if (await toast.confirm('Admin tizimidan chiqmoqchimisiz?')) {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.replace('/admin/login');
    }
  };

  // Yangi post yaratish
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Post yaratishda xatolik yuz berdi');

      setFeedback({
        type: 'success',
        message: data.message || "Post muvaffaqiyatli saqlandi va fonda tarjima navbatiga qo'shildi!",
      });

      setNewPost({
        title: '',
        type: 'news',
        status: 'published',
        excerpt: '',
        content: '',
        coverImage: '',
      });

      setShowNewPostModal(false);
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Postni o'chirish
  const handleDeletePost = async (id: number | string, title: string) => {
    if (!(await toast.confirm(`"${title}" sarlavhali postni o'chirishni tasdiqlaysizmi?`))) return;

    try {
      const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "O'chirishda xatolik");

      setFeedback({ type: 'success', message: "Post muvaffaqiyatli o'chirildi" });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // Murojaat statusini yangilash
  const handleUpdateMessageStatus = async (id: number | string, status: string) => {
    try {
      await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setMessagesList(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } catch (e) {
      console.error(e);
    }
  };

  // Filtrlangan postlar
  const filteredPosts = useMemo(() => {
    return postsList.filter((p) => {
      const matchesSearch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = postTypeFilter === 'all' || p.type === postTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [postsList, searchQuery, postTypeFilter]);

  // Filtrlangan murojaatlar
  const filteredMessages = useMemo(() => {
    return messagesList.filter((m) => {
      if (messageFilter === 'new') return m.status === 'new';
      if (messageFilter === 'read') return m.status === 'read';
      return true;
    });
  }, [messagesList, messageFilter]);

  const unreadMessagesCount = useMemo(() => {
    return messagesList.filter(m => m.status === 'new').length;
  }, [messagesList]);

  const navItems: { id: typeof activeTab; label: string; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'posts', label: 'Postlar', badge: postsList.length },
    { id: 'teachers', label: 'Xodimlar' },
    { id: 'messages', label: 'Murojaatlar', badge: unreadMessagesCount },
  ];
  const pageTitle: Record<string, string> = {
    overview: 'Boshqaruv paneli',
    posts: 'Postlar boshqaruvi',
    teachers: 'Xodimlar: rahbariyat va o‘qituvchilar',
    messages: 'Kelgan murojaatlar',
  };

  // Oylar bo'yicha postlar (grafik uchun, oxirgi 8 oy)
  const monthly = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (7 - i), 1);
      return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('uz-UZ', { month: 'short' }), count: 0 };
    });
    postsList.forEach((p) => {
      if (!p.published_at) return;
      const d = new Date(p.published_at);
      const m = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (m) m.count += 1;
    });
    return months;
  }, [postsList]);
  const maxMonthly = Math.max(1, ...monthly.map((m) => m.count));
  const [hoverBar, setHoverBar] = useState<number | null>(null);
  const readCount = messagesList.length - unreadMessagesCount;
  const answeredPct = messagesList.length ? Math.round((readCount / messagesList.length) * 100) : 0;

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-lg border border-slate-200/80 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#0047AB]" />
        </div>
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Admin sessiyasi tekshirilmoqda...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9ECF4] text-slate-800 antialiased selection:bg-sky-100 selection:text-sky-900">
      <div className="max-w-[1400px] mx-auto w-full p-3 sm:p-6 flex flex-col gap-6">
        {/* ===================== YUQORI SUZUVCHI PANEL ===================== */}
        <header className="sticky top-3 z-20 bg-white/90 backdrop-blur-xl rounded-[28px] px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-sky-500/30">
              <School className="w-5 h-5" />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-bold text-sm text-slate-900 font-display">To‘rtko‘l tuman ixtisoslashtirilgan maktabi</div>
              <div className="text-[11px] text-slate-500">Boshqaruv paneli</div>
            </div>
          </div>

          <nav className="order-3 lg:order-none w-full lg:w-auto flex items-center gap-1 bg-slate-100/80 rounded-full p-1 overflow-x-auto">
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => setActiveTab(n.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === n.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {n.label}
                {!!n.badge && n.badge > 0 && (
                  <span className={`text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold ${
                    n.id === 'messages' ? 'bg-rose-500 text-white' : activeTab === n.id ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                  }`}>{n.badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loadingData}
              title="Ma'lumotlarni yangilash"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#0284C7] flex items-center justify-center transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/" target="_blank" title="Saytni ko‘rish" className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#0284C7] flex items-center justify-center transition-all">
              <ExternalLink className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5 pl-2">
              <button
                onClick={() => setShowProfile(true)}
                title="Login va parolni o‘zgartirish"
                className="flex items-center gap-2.5 rounded-full pr-2 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0284C7] to-[#38BDF8] text-white flex items-center justify-center font-bold text-sm">
                  {adminUser?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="hidden md:block leading-tight">
                  <div className="text-sm font-semibold text-slate-900">{adminUser?.username || 'admin'}</div>
                  <div className="text-[11px] text-slate-500">Bosh administrator</div>
                </div>
              </button>
              <button onClick={handleLogout} title="Tizimdan chiqish" className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Sarlavha va amallar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 font-display">{pageTitle[activeTab]}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })} · maktab saytining joriy holati
            </p>
          </div>
          {activeTab === 'posts' && (
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Materiallardan qidirish..."
                className="pl-10 pr-4 py-3 text-sm bg-white rounded-full outline-none w-64 focus:ring-2 focus:ring-sky-200 transition-all placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={() => { setActiveTab('posts'); setShowNewPostModal(true); }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi post</span>
            </button>
          </div>
          )}
          {activeTab === 'teachers' && (
            <button
              onClick={() => setStaffEditor({ scope: teacherSubTab, item: null })}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-sky-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{teacherSubTab === 'leaders' ? 'Rahbar qo‘shish' : 'O‘qituvchi qo‘shish'}</span>
            </button>
          )}
        </div>

        {/* Kontent Konteyneri */}
        <main className="flex-1">
          {/* ==================== TAB 1: OVERVIEW (DASHBOARD) ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-5 admin-stagger">
              {/* KPI kartalar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="adm-card relative overflow-hidden rounded-[28px] p-6 bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] text-white shadow-xl shadow-sky-500/25">
                  <div className="absolute -right-8 -bottom-10 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-white/85">Jami materiallar</span>
                    <div className="w-12 h-12 rounded-full bg-white text-[#0284C7] flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-5xl font-semibold font-display">{postsList.length}</span>
                    <span className="mb-2 text-[11px] px-2 py-0.5 rounded-full bg-white/20">nashrda</span>
                  </div>
                  <div className="mt-3 text-xs text-white/80">Yangilik va ta'lim maqolalari</div>
                </div>

                <div className="adm-card rounded-[28px] p-6 bg-white">
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-slate-500">Pedagoglar</span>
                    <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center"><Users className="w-5 h-5" /></div>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-5xl font-semibold font-display text-slate-900">{teachersList.length}</span>
                    <span className="mb-2 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">faol</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">Oliy va 1-toifali ustozlar</div>
                </div>

                <div className="adm-card rounded-[28px] p-6 bg-white">
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-slate-500">Ma'muriyat</span>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0284C7] to-[#38BDF8] text-white flex items-center justify-center"><School className="w-5 h-5" /></div>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-5xl font-semibold font-display text-slate-900">{leadersList.length}</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">Direktor va o‘rinbosarlar</div>
                </div>

                <div className="adm-card rounded-[28px] p-6 bg-white">
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-slate-500">Murojaatlar</span>
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><Mail className="w-5 h-5" /></div>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-5xl font-semibold font-display text-slate-900">{messagesList.length}</span>
                    {unreadMessagesCount > 0 && <span className="mb-2 text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-semibold">{unreadMessagesCount} yangi</span>}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">{unreadMessagesCount > 0 ? "O'qilmagan murojaatlar bor" : "Barchasi ko'rilgan"}</div>
                </div>
              </div>

              {/* Grafik + yarim doira ko'rsatkich */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="adm-card lg:col-span-2 bg-white rounded-[28px] p-6 sm:p-7">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold font-display text-slate-900">Nashrlar dinamikasi</h3>
                    <span className="px-4 py-2 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">Oxirgi 8 oy</span>
                  </div>
                  <div className="relative h-64 flex items-end gap-2 sm:gap-4 pl-8">
                    {[0, 1, 2, 3].map((g) => (
                      <div key={g} className="absolute left-0 right-0 border-t border-dashed border-slate-200 text-[10px] text-slate-400" style={{ bottom: `${(g / 3) * 100 * 0.88 + 12}%` }}>
                        <span className="absolute -top-2 left-0 bg-white pr-1">{Math.round((maxMonthly * g) / 3)}</span>
                      </div>
                    ))}
                    {monthly.map((m, i) => {
                      const h = Math.max(8, (m.count / maxMonthly) * 88);
                      const active = hoverBar === i;
                      return (
                        <div key={m.key} className="relative flex-1 h-full flex flex-col justify-end items-center gap-2 z-10" onMouseEnter={() => setHoverBar(i)} onMouseLeave={() => setHoverBar(null)}>
                          {active && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-white rounded-2xl shadow-xl px-4 py-2.5 text-xs whitespace-nowrap z-20 border border-slate-100">
                              <div className="font-semibold text-slate-900 capitalize">{m.label}</div>
                              <div className="text-slate-500 mt-0.5">Nashrlar: <b className="text-slate-900">{m.count}</b></div>
                            </div>
                          )}
                          <div
                            className={`adm-bar w-full rounded-2xl transition-colors duration-300 ${active ? 'bg-gradient-to-t from-[#0284C7] to-[#38BDF8]' : 'bg-slate-100'}`}
                            style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
                          />
                          <span className="text-xs text-slate-500 capitalize h-4">{m.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="adm-card bg-white rounded-[28px] p-6 sm:p-7 flex flex-col">
                  <h3 className="text-xl font-semibold font-display text-slate-900">Murojaatlarga javob</h3>
                  <div className="relative mt-4 mx-auto w-full max-w-[280px]">
                    <svg viewBox="0 0 200 110" className="w-full">
                      {Array.from({ length: 13 }).map((_, i) => {
                        const a = Math.PI - (i / 12) * Math.PI;
                        const cx = 100 + Math.cos(a) * 78;
                        const cy = 100 - Math.sin(a) * 78;
                        const on = (i / 12) * 100 < answeredPct;
                        return (
                          <rect
                            key={i}
                            x={cx - 5.5} y={cy - 12} width="11" height="24" rx="4"
                            transform={`rotate(${90 - (a * 180) / Math.PI} ${cx} ${cy})`}
                            className="adm-seg"
                            style={{ fill: on ? '#0284C7' : '#EEF1F6', opacity: on ? 1 - (i / 12) * 0.45 : 1, animationDelay: `${i * 60}ms` }}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-x-0 bottom-0 text-center">
                      <div className="text-4xl font-semibold font-display text-slate-900">{answeredPct}%</div>
                      <div className="text-[11px] text-slate-500">Ko‘rib chiqilgan</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-500">Ko‘rilgan</div>
                      <div className="text-2xl font-semibold font-display mt-2">{readCount}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs text-slate-500">Yangi</div>
                      <div className="text-2xl font-semibold font-display mt-2">{unreadMessagesCount}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* So'nggi materiallar jadvali */}
              <div className="adm-card bg-white rounded-[28px] p-6 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <h3 className="text-xl font-semibold font-display text-slate-900">So‘nggi materiallar</h3>
                  <button onClick={() => setActiveTab('posts')} className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 self-start">
                    Barchasi <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs">
                        <th className="py-3 px-4 rounded-l-2xl font-medium">Sarlavha</th>
                        <th className="py-3 px-4 font-medium">Turi</th>
                        <th className="py-3 px-4 font-medium">Holati</th>
                        <th className="py-3 px-4 font-medium">Sana</th>
                        <th className="py-3 px-4 rounded-r-2xl text-right font-medium">Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {postsList.slice(0, 5).map((p) => (
                        <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-4 font-semibold text-slate-900 max-w-xs truncate">{p.title}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.type === 'education' ? 'bg-violet-50 text-violet-700' : 'bg-sky-50 text-[#0284C7]'}`}>
                              {p.type === 'education' ? "Ta'lim" : 'Yangilik'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {p.status === 'published' ? 'Nashr qilingan' : 'Qoralama'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-500">{p.published_at ? new Date(p.published_at).toLocaleDateString('uz-UZ') : 'Bugun'}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/news/${p.slug}`} target="_blank" title="Saytda ko‘rish" className="p-2 rounded-full text-slate-400 hover:text-[#0284C7] hover:bg-sky-50 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button onClick={() => handleDeletePost(p.id, p.title)} title="O‘chirish" className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {postsList.length === 0 && (
                        <tr><td colSpan={5} className="py-10 text-center text-slate-400">Hozircha materiallar yo‘q.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: POSTS ==================== */}
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {/* Harakatlar paneli */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setPostTypeFilter('all')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      postTypeFilter === 'all'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Barcha materiallar ({postsList.length})
                  </button>
                  <button
                    onClick={() => setPostTypeFilter('news')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      postTypeFilter === 'news'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Yangiliklar ({postsList.filter(p => p.type === 'news').length})
                  </button>
                  <button
                    onClick={() => setPostTypeFilter('education')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      postTypeFilter === 'education'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Ta'lim materiallari ({postsList.filter(p => p.type === 'education').length})
                  </button>
                </div>

                <button
                  onClick={() => setShowNewPostModal(!showNewPostModal)}
                  className="px-5 py-2.5 rounded-xl bg-[#0047AB] hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
                >
                  {showNewPostModal ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{showNewPostModal ? 'Formani yopish' : 'Yangi material yaratish'}</span>
                </button>
              </div>

              {/* Yangi post yaratish formasi (Expandable Card) */}
              {showNewPostModal && (
                <div className="bg-white border border-blue-200 rounded-3xl p-6 sm:p-8 shadow-lg shadow-blue-900/5 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">Yangi material qo‘shish (O‘zbekcha)</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Siz ma'lumotni o‘zbek tilida kiritasiz. Tizim fonda QQ, RU va EN tillariga avtomatik tarjima topshiriqlarini yaratadi.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowNewPostModal(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreatePost} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Maqola sarlavhasi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        placeholder="Masalan: Respublika fan olimpiadasida 1-o'rin sohiblari taqdirlandi"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0047AB] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Post turi</label>
                        <select 
                          value={newPost.type}
                          onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-[#0047AB]"
                        >
                          <option value="news">Yangilik (Maktab hayoti)</option>
                          <option value="education">Ta'lim materiali (Darslik / Metodika)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Nashr holati</label>
                        <select 
                          value={newPost.status}
                          onChange={(e) => setNewPost({ ...newPost, status: e.target.value })}
                          className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-[#0047AB]"
                        >
                          <option value="published">Darhol saytda nashr qilish</option>
                          <option value="draft">Qoralamada saqlash</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid">
                      <ImageUpload label="Muqova rasmi" value={newPost.coverImage} onChange={(u) => setNewPost({ ...newPost, coverImage: u })} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Qisqa anons (Excerpt)</label>
                      <textarea
                        rows={2}
                        value={newPost.excerpt}
                        onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                        placeholder="Xabarning 1-2 jumlalik qisqacha mazmuni..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0047AB] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        To‘liq maqola matni <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        placeholder="Maqola matnini bu yerga to‘liq yozing..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0047AB] outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNewPostModal(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 rounded-xl bg-[#0047AB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{submitting ? 'Saqlanmoqda...' : 'Nashr qilish (Fonda avto-tarjima bilan)'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Postlar ro'yxati jadvali */}
              <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/90 text-slate-500 border-b border-slate-200/80 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-6">Material</th>
                        <th className="py-3.5 px-4">Turi</th>
                        <th className="py-3.5 px-4">Holati</th>
                        <th className="py-3.5 px-4">Sana</th>
                        <th className="py-3.5 px-6 text-right">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPosts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                            Mos keluvchi materiallar topilmadi
                          </td>
                        </tr>
                      ) : (
                        filteredPosts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-4 px-6 max-w-md">
                              <div className="font-bold text-slate-900 text-xs line-clamp-1">{p.title}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{p.excerpt || p.content?.slice(0, 80)}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                p.type === 'education'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-blue-50 text-[#0047AB] border border-blue-200'
                              }`}>
                                {p.type === 'education' ? "Ta'lim" : 'Yangilik'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                p.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {p.status === 'published' ? 'Nashr qilingan' : 'Qoralama'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-500 font-medium">
                              {p.published_at ? new Date(p.published_at).toLocaleDateString('uz-UZ') : 'Bugun'}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/news/${p.slug}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-[#0047AB] hover:bg-blue-100 font-bold text-[11px] transition-colors"
                                >
                                  <span>Ochish</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </Link>
                                <button
                                  onClick={() => handleDeletePost(p.id, p.title)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="O‘chirish"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 3: TEACHERS & LEADERSHIP ==================== */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              {/* Ichki sub-tablar */}
              <div className="flex items-center gap-3 bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs max-w-md">
                <button
                  onClick={() => setTeacherSubTab('leaders')}
                  className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                    teacherSubTab === 'leaders'
                      ? 'bg-[#0047AB] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Rahbariyat ({leadersList.length})
                </button>
                <button
                  onClick={() => setTeacherSubTab('teachers')}
                  className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                    teacherSubTab === 'teachers'
                      ? 'bg-[#0047AB] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  O‘qituvchilar ({teachersList.length})
                </button>
              </div>

              <StaffList
                subTab={teacherSubTab}
                leaders={leadersList}
                teachers={teachersList}
                onEdit={(scope, item) => setStaffEditor({ scope, item })}
                onDelete={handleStaffDelete}
              />
            </div>
          )}

          {/* ==================== TAB 4: MESSAGES ==================== */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              {/* Filtrlar */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMessageFilter('all')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      messageFilter === 'all'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Barcha murojaatlar ({messagesList.length})
                  </button>
                  <button
                    onClick={() => setMessageFilter('new')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      messageFilter === 'new'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Yangi (O‘qilmagan) ({messagesList.filter(m => m.status === 'new').length})
                  </button>
                  <button
                    onClick={() => setMessageFilter('read')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      messageFilter === 'read'
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    Ko‘rilgan ({messagesList.filter(m => m.status === 'read').length})
                  </button>
                </div>
              </div>

              {/* Murojaatlar ro'yxati */}
              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center text-slate-400 font-medium">
                    Hozircha hech qanday murojaat yo‘q
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <div key={msg.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047AB] flex items-center justify-center font-bold text-sm">
                            {msg.full_name?.[0] || 'M'}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                              <span>{msg.full_name}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                msg.status === 'new'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {msg.status === 'new' ? 'Yangi murojaat' : 'Ko‘rilgan'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Telefon: <a href={`tel:${msg.phone}`} className="text-[#0047AB] font-semibold hover:underline">{msg.phone}</a>
                              {' • '}
                              Mavzu: <span className="font-semibold text-slate-700">{msg.subject}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {msg.status === 'new' ? (
                            <button
                              onClick={() => handleUpdateMessageStatus(msg.id, 'read')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Ko‘rildi deb belgilash</span>
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Ko‘rib chiqilgan
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed italic">
                        "{msg.message}"
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Yuborilgan vaqti: {msg.created_at ? new Date(msg.created_at).toLocaleString('uz-UZ') : 'Yaqinda'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
      {showProfile && (
        <ProfileModal
          username={adminUser?.username || 'admin'}
          onClose={() => setShowProfile(false)}
          onSaved={(u) => setAdminUser((x: any) => ({ ...x, username: u }))}
        />
      )}
      <StaffModal
        editor={staffEditor}
        onClose={() => setStaffEditor(null)}
        onSaved={(msg) => { setStaffEditor(null); setFeedback({ type: 'success', message: msg }); loadData(); }}
      />
    </div>
  );
}
