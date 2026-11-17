-- ========================================================
-- To'rtko'l tuman ixtisoslashtirilgan maktabi - Supabase Database Schema
-- Ushbu faylni Supabase -> SQL Editor bo'limiga nusxalab "Run" tugmasini bosing
-- ========================================================

-- 1. Tiplar va Enumlarni yaratish
DO $$ BEGIN
    CREATE TYPE contact_status AS ENUM('new', 'read', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM('pending', 'processing', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE locale AS ENUM('qq', 'ru', 'en');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE media_type AS ENUM('image', 'video');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE post_status AS ENUM('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE post_type AS ENUM('news', 'education');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Jadvallarni yaratish

-- Admin hisobi
CREATE TABLE IF NOT EXISTS admin_account (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Kategoriyalar
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(120) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Postlar (Yangiliklar va Ta'lim)
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    type post_type DEFAULT 'news' NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image VARCHAR(500),
    status post_status DEFAULT 'published' NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Rahbariyat
CREATE TABLE IF NOT EXISTS leaders (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    bio TEXT,
    reception_days VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(100),
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Fanlar
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50)
);

-- O'qituvchilar
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    bio TEXT,
    subject VARCHAR(150),
    experience VARCHAR(50),
    education TEXT,
    achievements TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- O'qituvchi - Fan bog'lanishi
CREATE TABLE IF NOT EXISTS teacher_subjects (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT teacher_subject_unique UNIQUE(teacher_id, subject_id)
);

-- Yo'nalishlar
CREATE TABLE IF NOT EXISTS directions (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0 NOT NULL
);

-- Fotoalbomlar
CREATE TABLE IF NOT EXISTS albums (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cover_image VARCHAR(500),
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Media (Rasmlar va Videolar)
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
    type media_type DEFAULT 'image' NOT NULL,
    url VARCHAR(500) NOT NULL,
    title VARCHAR(200),
    sort_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Aloqa xabarlari (Murojaatlar)
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status contact_status DEFAULT 'new' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tarjimalar
CREATE TABLE IF NOT EXISTS translations (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    locale locale NOT NULL,
    translated_text TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT entity_field_locale_unique UNIQUE(entity_type, entity_id, field_name, locale)
);

-- Tarjima navbati
CREATE TABLE IF NOT EXISTS translation_jobs (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    source_text TEXT NOT NULL,
    source_locale VARCHAR(10) DEFAULT 'uz' NOT NULL,
    status job_status DEFAULT 'pending' NOT NULL,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Sayt sozlamalari
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ========================================================
-- 3. ASOSIY MA'LUMOTLAR (qolganini admin panel orqali kiriting)
-- ========================================================

-- Fanlar
INSERT INTO subjects (name, icon)
VALUES 
('Matematika', 'Calculator'),
('Fizika', 'Atom'),
('Informatika va IT', 'Laptop'),
('Kimyo', 'FlaskConical'),
('Biologiya', 'Dna'),
('Ingliz tili', 'Languages'),
('Ona tili va adabiyot', 'BookOpen')
ON CONFLICT (name) DO NOTHING;

-- Kategoriyalar
INSERT INTO categories (slug, name, sort_order)
VALUES 
('yutuqlar', 'O‘quvchilar yutuqlari', 1),
('tadbir', 'Tadbirlar va Seminarlar', 2),
('talim', 'Ta’lim jarayoni', 3),
('elonlar', 'Rasmiy e’lonlar', 4)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- Sayt sozlamalari
INSERT INTO site_settings (key, value, description)
VALUES 
('admission_url', 'https://ariza.piima.uz', 'Qabul portali')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ========================================================
-- 4. ROW LEVEL SECURITY (RLS) siyosatlari
-- Anon kalit bilan: ochiq kontentni o'qish va murojaat yuborish mumkin.
-- ========================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['categories','leaders','subjects','teachers','teacher_subjects',
                           'directions','albums','media','translations','site_settings']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "public read" ON %I', t);
    EXECUTE format('CREATE POLICY "public read" ON %I FOR SELECT TO anon, authenticated USING (true)', t);
  END LOOP;
END $$;

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read published" ON posts;
CREATE POLICY "public read published" ON posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public insert" ON contact_messages;
CREATE POLICY "public insert" ON contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'new');

-- 5. O'qituvchilar jadvaliga qo'shimcha ustunlar (mavjud bazalar uchun)
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS subject VARCHAR(150);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS experience VARCHAR(50);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS achievements TEXT;

-- 6. Yuklangan rasmlar (admin paneldan fayl sifatida yuklanadi, /api/files/<id> orqali beriladi)
CREATE TABLE IF NOT EXISTS uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL,
    size INTEGER NOT NULL,
    data BYTEA NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY; -- anon kalit uchun yopiq, faqat server orqali
