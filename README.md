# To'rtko'l tuman ixtisoslashtirilgan maktabi Veb-Platformasi

Qoraqalpog'iston Respublikasi, To'rtko'l tuman ixtisoslashtirilgan maktabining zamonaviy, tezkor va ko'p tilli rasmiy veb-platformasi.

## 🚀 Texnologiyalar

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend / API**: Next.js Server Actions & Route Handlers, Drizzle ORM
- **Database & Storage**: Supabase (Cloud PostgreSQL) & Supabase Storage
- **Monorepo**: pnpm workspaces (`apps/web`, `db`, `packages/shared`)
- **Tillar**: O'zbekcha (asosiy), Qoraqalpoqcha, Ruscha, Inglizcha (fonda avtomatik tarjima qilinuvchi tizim)

## 📌 Asosiy Sahifalar va Bo'limlar

- **Asosiy sahifa (`/`)**: Redsun uslubidagi horizon glow, Hero interaktiv maktab fotosuratlari slayderi, Bento Grid statistika, Yo'nalishlar, So'nggi yangiliklar, Qabul banneri va Galereya.
- **Biz haqimizda**:
  - `/about/school` — Maktab tarixi, maqsad va qadriyatlari.
  - `/about/leaders` — Rahbariyat jamoasi, qabul kunlari va aloqa rekvizitlari.
  - `/about/teachers` — Oliy toifali ustozlar katalogi va fanlar filtri.
  - `/about/gallery` — Fotoalbomlar va to'liq ekranli **Lightbox / Image Viewer** (zoom, karusel navigatsiya bilan).
- **Qabul jarayoni (`/admission`)**: 4 bosqichli qabul yo'riqnomasi, kvotalar, kerakli hujjatlar va `ariza.piima.uz` ga to'g'ridan-to'g'ri o'tish.
- **Maktab hayoti**:
  - `/news` — Yangiliklar arxivi va alohida ulashiladigan maqola sahifalari (`[slug]`).
  - `/education` — Ta'lim metodikasi va zamonaviy laboratoriyalar.
- **Yo'nalishlar**:
  - `/programs/exact` — Matematika, Fizika, IT o'quv dasturi.
  - `/programs/natural` — Kimyo, Biologiya laboratoriyalari va tibbiyotga yo'naltirilgan dastur.
- **Bog'lanish (`/contact`)**: Rasmiy manzil, xarita koordinatasi va real vaqtda bazaga yoziluvchi onlayn murojaat formasi.
- **Admin panel (`/admin`)**: Yagona admin boshqaruvi. Yangilik va postlar faqat o'zbek tilida kiritiladi, qolgan 3 ta tilga fonda avtomatik tarjima qilinadi.

## 🛠️ O'rnatish va Ishga Tushirish

1. **Repozitoriyani yuklab olish va paketlarni o'rnatish**:
   ```bash
   pnpm install
   ```

2. **Muhit o'zgaruvchilarini sozlash**:
   `.env.example` faylidan nusxa olib `apps/web/.env.local` yarating va Supabase kalitlarini kiriting:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
   ```

3. **Baza jadvallarini yaratish**:
   `supabase_schema.sql` faylini Supabase SQL Editor bo'limida ishga tushiring.

4. **Loyiha serverini yoqish**:
   ```bash
   pnpm --filter @school/web dev
   ```
   Brauzerda: `http://localhost:3000`
