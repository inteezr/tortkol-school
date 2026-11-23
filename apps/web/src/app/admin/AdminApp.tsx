'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, Users, Mail, Settings, Image as ImageIcon, Search, Bell, RefreshCw,
  LogOut, Sun, Moon, Menu, X, Plus, School, ChevronDown, Calendar, Loader2,
} from 'lucide-react';
import { useToast } from '../../lib/ToastContext';
import type { AdminData } from '../../lib/admin-data';
import { StaffList, StaffModal, type StaffEditor, type StaffScope } from './StaffManager';
import { ProfileModal } from './ProfileModal';
import Overview from './Overview';
import { TabSkeleton } from './AdminSkeleton';
import { btnPrimary, fmtToday } from './ui';

// Qolgan bo'limlar kerak bo'lganda yuklanadi (boshlang'ich JS kichik), bo'sh vaqtda esa oldindan olib qo'yiladi.
const load = {
  posts: () => import('./PostsTab'),
  messages: () => import('./MessagesTab'),
  gallery: () => import('./GalleryManager'),
  settings: () => import('./SiteSettings'),
};
const PostsTab = dynamic(load.posts, { loading: () => <TabSkeleton /> });
const MessagesTab = dynamic(load.messages, { loading: () => <TabSkeleton /> });
const GalleryManager = dynamic(() => load.gallery().then((m) => m.GalleryManager), { loading: () => <TabSkeleton /> });
const SiteSettings = dynamic(() => load.settings().then((m) => m.SiteSettings), { loading: () => <TabSkeleton /> });

type Tab = 'overview' | 'posts' | 'staff' | 'gallery' | 'messages' | 'settings';
const TABS: Tab[] = ['overview', 'posts', 'staff', 'gallery', 'messages', 'settings'];

const TITLES: Record<Tab, string> = {
  overview: 'Boşqaruv paneli',
  posts: 'Postlar boşqaruvi',
  staff: 'Xodimlar',
  gallery: 'Galereya',
  messages: 'Murojaatlar',
  settings: 'Sayt sozlamalari',
};
const SUBTITLES: Record<Tab, string> = {
  overview: 'Maktab saytining joriy holati bir qaraşda',
  posts: 'Yangiliklar va ta’lim materiallarini boşqaring',
  staff: 'Rahbariyat va öqituvçilar röyxati',
  gallery: 'Fotoalbomlar va rasmlar',
  messages: 'Saytdan kelgan murojaatlar',
  settings: 'Statistika va maktab rasmi',
};

export default function AdminApp({ initial, username: initialUser }: { initial: AdminData; username: string }) {
  const router = useRouter();
  const toast = useToast();

  const [tab, setTabState] = useState<Tab>('overview');
  const [username, setUsername] = useState(initialUser);
  const [posts, setPosts] = useState<any[]>(initial.posts);
  const [teachers, setTeachers] = useState<any[]>(initial.teachers);
  const [leaders, setLeaders] = useState<any[]>(initial.leaders);
  const [messages, setMessages] = useState<any[]>(initial.messages);
  const [albums, setAlbums] = useState<any[]>(initial.albums);
  const [settings, setSettings] = useState(initial.settings);

  const [refreshing, setRefreshing] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    try { setDark(localStorage.getItem('admin-theme') === 'dark'); } catch {}
  }, []);
  const toggleTheme = () => setDark((d) => {
    try { localStorage.setItem('admin-theme', d ? 'light' : 'dark'); } catch {}
    return !d;
  });
  const [showProfile, setShowProfile] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [postSearch, setPostSearch] = useState('');
  const [staffTab, setStaffTab] = useState<StaffScope>('leaders');
  const [staffEditor, setStaffEditor] = useState<StaffEditor>(null);
  const [today, setToday] = useState('');

  // URL hash bilan bo'lim saqlanadi (sahifani yangilaganda joyida qoladi)
  const setTab = useCallback((t: Tab) => {
    setTabState(t);
    setNavOpen(false);
    try { history.replaceState(null, '', t === 'overview' ? location.pathname : `#${t}`); } catch {}
  }, []);
  useEffect(() => {
    const h = location.hash.slice(1) as Tab;
    if (TABS.includes(h)) setTabState(h);
    setToday(fmtToday());
    // Bo'sh vaqtda boshqa bo'limlarni oldindan yuklab qo'yamiz: o'tishda kutish bo'lmaydi
    const w = window as any;
    const prefetch = () => Object.values(load).forEach((f) => f().catch(() => {}));
    const id = w.requestIdleCallback ? w.requestIdleCallback(prefetch, { timeout: 2500 }) : setTimeout(prefetch, 1200);
    return () => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  const unread = useMemo(() => messages.filter((m) => m.status === 'new').length, [messages]);

  // ---------- Amallar ----------
  const refresh = async () => {
    setRefreshing(true);
    try {
      const r = await fetch('/api/admin/data', { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setPosts(d.posts); setTeachers(d.teachers); setLeaders(d.leaders); setMessages(d.messages); setAlbums(d.albums); setSettings(d.settings);
      toast.success('Ma’lumotlar yangilandi');
    } catch (e: any) { toast.error(e.message || 'Yangilab bölmadi'); } finally { setRefreshing(false); }
  };

  const logout = async () => {
    if (!(await toast.confirm('Admin tizimidan çiqmoqçimisiz?'))) return;
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  /** true — o'chirildi; false — bekor qilindi yoki xato */
  const deletePost = async (id: number, title: string): Promise<boolean> => {
    if (!(await toast.confirm(`“${title}” sarlavhali postni öçirişni tasdiqlaysizmi?`))) return false;
    const prev = posts;
    setPosts((l) => l.filter((p) => p.id !== id)); // darhol
    try {
      const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Öçirişda xatolik');
      toast.success('Post öçirildi');
      return true;
    } catch (e: any) { setPosts(prev); toast.error(e.message); return false; }
  };

  const deleteStaff = async (scope: StaffScope, item: any) => {
    if (!(await toast.confirm(`“${item.full_name}” ni öçirmoqçimisiz?`))) return;
    const set = scope === 'leaders' ? setLeaders : setTeachers;
    const prev = scope === 'leaders' ? leaders : teachers;
    set((l) => l.filter((x) => x.id !== item.id));
    try {
      const res = await fetch(`/api/teachers?scope=${scope}&id=${item.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Öçirib bölmadi');
      toast.success('Öçirildi');
    } catch (e: any) { set(prev); toast.error(e.message); }
  };

  const readMessage = async (id: number) => {
    setMessages((l) => l.map((m) => (m.id === id ? { ...m, status: 'read' } : m)));
    try {
      const r = await fetch('/api/contact', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'read' }) });
      if (!r.ok) throw new Error();
    } catch {
      setMessages((l) => l.map((m) => (m.id === id ? { ...m, status: 'new' } : m)));
      toast.error('Statusni yangilab bölmadi');
    }
  };

  const deleteMessage = async (id: number) => {
    const m = messages.find((x) => x.id === id);
    if (!(await toast.confirm(`“${m?.full_name || 'Murojaat'}” murojaatini öçirmoqçimisiz?`))) return;
    const prev = messages;
    setMessages((l) => l.filter((x) => x.id !== id)); // darhol
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Öçirib bölmadi');
      toast.success('Murojaat öçirildi');
    } catch (e: any) { setMessages(prev); toast.error(e.message); }
  };

  const openNewPost = () => { setTab('posts'); setPostModal(true); };

  // ---------- Qidiruv (Ctrl/⌘ + K) ----------
  const [q, setQ] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === 'Escape') { setSearchOpen(false); searchRef.current?.blur(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return [];
    const has = (v?: string) => !!v && v.toLowerCase().includes(s);
    return [
      ...posts.filter((p) => has(p.title)).slice(0, 4).map((p) => ({ k: `p${p.id}`, label: p.title, hint: 'Post', go: () => { setPostSearch(p.title); setTab('posts'); } })),
      ...leaders.filter((x) => has(x.full_name) || has(x.role)).slice(0, 3).map((x) => ({ k: `l${x.id}`, label: x.full_name, hint: x.role || 'Rahbar', go: () => { setStaffTab('leaders'); setTab('staff'); } })),
      ...teachers.filter((x) => has(x.full_name) || has(x.subject)).slice(0, 3).map((x) => ({ k: `t${x.id}`, label: x.full_name, hint: x.subject || 'Öqituvçi', go: () => { setStaffTab('teachers'); setTab('staff'); } })),
      ...messages.filter((m) => has(m.full_name) || has(m.subject)).slice(0, 3).map((m) => ({ k: `m${m.id}`, label: m.full_name, hint: `Murojaat · ${m.subject}`, go: () => setTab('messages') })),
    ];
  }, [q, posts, leaders, teachers, messages, setTab]);

  // ---------- Navigatsiya ----------
  const nav: { title: string; items: { id: Tab; label: string; icon: React.ElementType; badge?: number; alert?: boolean }[] }[] = [
    { title: 'Asosiy menyu', items: [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'posts', label: 'Postlar', icon: FileText, badge: posts.length },
      { id: 'messages', label: 'Murojaatlar', icon: Mail, badge: unread, alert: true },
    ] },
    { title: 'Kontent', items: [
      { id: 'staff', label: 'Xodimlar', icon: Users },
      { id: 'gallery', label: 'Galereya', icon: ImageIcon },
    ] },
    { title: 'Umumiy', items: [{ id: 'settings', label: 'Sayt sozlamalari', icon: Settings }] },
  ];

  const sidebar = (
    <div className="h-full flex flex-col bg-white lg:rounded-2xl lg:border lg:border-slate-200/70 p-3">
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#052659] to-[#5483B3] flex items-center justify-center text-white shrink-0"><School className="w-5 h-5" /></div>
          <div className="leading-tight min-w-0">
            <div className="font-bold text-[15px] text-slate-900 font-display truncate">Törtköl IM</div>
            <div className="text-[11px] text-slate-500">Boşqaruv paneli</div>
          </div>
        </div>
        <button onClick={() => setNavOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Yopiş"><X className="w-5 h-5" /></button>
      </div>

      <nav className="mt-3 flex-1 overflow-y-auto space-y-4">
        {nav.map((g) => (
          <div key={g.title}>
            <div className="px-3 mb-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-slate-400">{g.title}</div>
            <div className="space-y-0.5">
              {g.items.map((n) => {
                const Icon = n.icon;
                const active = tab === n.id;
                return (
                  <button key={n.id} onClick={() => setTab(n.id)} onMouseEnter={() => (n.id in load) && load[n.id as keyof typeof load]().catch(() => {})}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${active ? 'bg-[#E6F0FB] text-[#052659]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    <span className="flex-1">{n.label}</span>
                    {!!n.badge && n.badge > 0 && (
                      <span className={`text-[10px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center font-bold ${n.alert ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>{n.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <button onClick={toggleTheme} className="mt-3 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors" aria-label="Rejimni almaştiriş">
        {dark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        <span className="flex-1 text-left">{dark ? 'Kunduzgi rejim' : 'Tungi rejim'}</span>
        <span className={`relative w-9 h-5 rounded-full transition-colors ${dark ? 'bg-[#5483B3]' : 'bg-slate-300'}`}>
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${dark ? 'translate-x-4' : ''}`} />
        </span>
      </button>
      <button onClick={logout} className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors">
        <LogOut className="w-[18px] h-[18px]" />Çiqiş
      </button>
    </div>
  );

  return (
    <div className={`${dark ? 'admin-dark ' : ''}min-h-screen bg-[#E9EEF5] text-slate-800 antialiased lg:p-4 lg:flex lg:gap-4`}>
      {/* Chap panel (katta ekran) */}
      <aside className="hidden lg:block w-[260px] shrink-0 sticky top-4 h-[calc(100vh-2rem)]">{sidebar}</aside>
      {/* Mobil panel */}
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-72 max-w-[85vw] h-full shadow-2xl">{sidebar}</div>
          <div className="flex-1 bg-slate-900/50" onClick={() => setNavOpen(false)} />
        </div>
      )}

      <div className="flex-1 min-w-0 bg-[#F6F8FB] lg:rounded-2xl lg:border lg:border-slate-200/70 flex flex-col min-h-screen lg:min-h-[calc(100vh-2rem)]">
        {/* Yuqori panel */}
        <header className="flex items-center gap-3 px-4 sm:px-6 pt-4">
          <button onClick={() => setNavOpen(true)} className="lg:hidden p-2.5 rounded-xl bg-white border border-slate-200/70" aria-label="Menyu"><Menu className="w-5 h-5" /></button>

          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchRef} value={q}
              onChange={(e) => { setQ(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              placeholder="Qidiriş…"
              className="w-full pl-10 pr-14 py-2.5 rounded-full bg-white border border-slate-200/70 text-sm outline-none focus:border-[#052659] focus:ring-4 focus:ring-[#052659]/10 transition placeholder:text-slate-400"
            />
            <kbd className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-500">Ctrl K</kbd>
            {searchOpen && q.trim().length >= 2 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-30 overflow-hidden">
                {results.length === 0 ? <div className="px-4 py-3 text-sm text-slate-400">Heç narsa topilmadi</div> : results.map((r) => (
                  <button key={r.k} onMouseDown={(e) => { e.preventDefault(); r.go(); setQ(''); setSearchOpen(false); }} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-800 truncate">{r.label}</span>
                    <span className="text-[11px] text-slate-400 truncate shrink-0 max-w-[45%]">{r.hint}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={refresh} disabled={refreshing} title="Yangilaş" className="p-2.5 rounded-full bg-white border border-slate-200/70 hover:bg-slate-50 text-slate-600 disabled:opacity-60">
              {refreshing ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <RefreshCw className="w-[18px] h-[18px]" />}
            </button>
            <button onClick={() => setTab('messages')} title="Murojaatlar" className="relative p-2.5 rounded-full bg-white border border-slate-200/70 hover:bg-slate-50 text-slate-600">
              <Bell className="w-[18px] h-[18px]" />
              {unread > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{unread}</span>}
            </button>
            <button onClick={() => setShowProfile(true)} title="Login va parolni özgartiriş" className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-full bg-white border border-slate-200/70 hover:bg-slate-50">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#052659] to-[#5483B3] text-white flex items-center justify-center font-bold text-sm">{username?.[0]?.toUpperCase() || 'A'}</span>
              <span className="hidden sm:block text-sm font-semibold text-slate-800 max-w-[110px] truncate">{username}</span>
              <ChevronDown className="hidden sm:block w-4 h-4 text-slate-400" />
            </button>
          </div>
        </header>

        {/* Sarlavha */}
        <div className="px-4 sm:px-6 pt-6 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">
              {tab === 'overview' ? <>Xuş kelibsiz, <span className="capitalize">{username}</span></> : TITLES[tab]}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{SUBTITLES[tab]}</p>
          </div>
          <div className="flex items-center gap-2">
            {today && <span className="hidden md:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/70 text-sm text-slate-700 font-medium"><Calendar className="w-4 h-4 text-slate-400" />{today}</span>}
            {(tab === 'overview' || tab === 'posts') && <button onClick={openNewPost} className={btnPrimary}><Plus className="w-4 h-4" />Yangi post</button>}
            {tab === 'staff' && <button onClick={() => setStaffEditor({ scope: staffTab, item: null })} className={btnPrimary}><Plus className="w-4 h-4" />{staffTab === 'leaders' ? 'Rahbar qöşiş' : 'Öqituvçi qöşiş'}</button>}
          </div>
        </div>

        {/* Kontent */}
        <main className="flex-1 px-4 sm:px-6 pb-8">
          {tab === 'overview' && <Overview posts={posts} teachers={teachers} leaders={leaders} messages={messages} onGo={setTab} onDeletePost={deletePost} onReadMessage={readMessage} />}
          {tab === 'posts' && <PostsTab posts={posts} modalOpen={postModal} initialSearch={postSearch} onModal={setPostModal} onCreated={(p) => setPosts((l) => [p, ...l])} onUpdated={(p) => setPosts((l) => l.map((x) => (x.id === p.id ? p : x)))} onDelete={deletePost} />}
          {tab === 'staff' && (
            <div className="space-y-4 adm-fade">
              <div className="inline-flex gap-1 p-1.5 rounded-2xl bg-white border border-slate-200/70">
                {(['leaders', 'teachers'] as StaffScope[]).map((s) => (
                  <button key={s} onClick={() => setStaffTab(s)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${staffTab === s ? 'bg-[#052659] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                    {s === 'leaders' ? `Rahbariyat (${leaders.length})` : `Öqituvçilar (${teachers.length})`}
                  </button>
                ))}
              </div>
              <StaffList subTab={staffTab} leaders={leaders} teachers={teachers} onEdit={(scope, item) => setStaffEditor({ scope, item })} onDelete={deleteStaff} />
            </div>
          )}
          {tab === 'gallery' && <GalleryManager albums={albums} setAlbums={setAlbums} />}
          {tab === 'messages' && <MessagesTab messages={messages} onRead={readMessage} onDelete={deleteMessage} />}
          {tab === 'settings' && <SiteSettings initial={settings} onSaved={setSettings} />}
        </main>
      </div>

      {showProfile && <ProfileModal username={username} onClose={() => setShowProfile(false)} onSaved={(u) => setUsername(u)} />}
      <StaffModal
        editor={staffEditor}
        onClose={() => setStaffEditor(null)}
        onSaved={(msg, scope, row) => {
          setStaffEditor(null); toast.success(msg);
          (scope === 'leaders' ? setLeaders : setTeachers)((l) => (l.some((x) => x.id === row.id) ? l.map((x) => (x.id === row.id ? row : x)) : [...l, row]));
        }}
      />
      {/* Popup oynalar shu yerga chiziladi (Modal.tsx) */}
      <div id="admin-portal" />
    </div>
  );
}
