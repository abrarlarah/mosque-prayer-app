-- ============================================================================
-- SALAH TIMES: COMPLETE DATABASE SETUP SCRIPT FOR SUPABASE
-- Run this entire script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'mosque_admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE mosque_status AS ENUM ('active', 'inactive');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE schedule_status AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE prayer_name_enum AS ENUM ('Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE announcement_type AS ENUM ('general', 'ramadan', 'eid', 'timing_change', 'event', 'emergency');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE announcement_priority AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE announcement_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE time_format_type AS ENUM ('12h', '24h');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'mosque_admin',
    avatar_url TEXT,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Mosques Table
CREATE TABLE IF NOT EXISTS public.mosques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    town TEXT,
    city TEXT NOT NULL,
    district TEXT NOT NULL DEFAULT 'Baramulla',
    state TEXT NOT NULL DEFAULT 'Jammu & Kashmir',
    country TEXT NOT NULL DEFAULT 'India',
    is_default BOOLEAN NOT NULL DEFAULT false,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    contact_number TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    description TEXT,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    status mosque_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Mosque Admin Assignments
CREATE TABLE IF NOT EXISTS public.mosque_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'primary',
    assigned_by UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_mosque_user UNIQUE (mosque_id, user_id)
);

-- 6. Default Prayer Schedules (Layer 3 Baseline)
CREATE TABLE IF NOT EXISTS public.default_prayer_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    prayer_name prayer_name_enum NOT NULL,
    adhan_time TIME,
    jamaat_time TIME NOT NULL,
    note TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_mosque_default_prayer UNIQUE (mosque_id, prayer_name)
);

-- 7. Monthly Schedules (Layer 2)
CREATE TABLE IF NOT EXISTS public.monthly_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    year SMALLINT NOT NULL CHECK (year >= 2020 AND year <= 2100),
    month SMALLINT NOT NULL CHECK (month >= 1 AND month <= 12),
    status schedule_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    published_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_mosque_year_month UNIQUE (mosque_id, year, month)
);

-- 8. Monthly Schedule Entries
CREATE TABLE IF NOT EXISTS public.monthly_schedule_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID NOT NULL REFERENCES public.monthly_schedules(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    fajr_adhan TIME,
    fajr_jamaat TIME,
    sunrise TIME,
    dhuhr_adhan TIME,
    dhuhr_jamaat TIME,
    asr_adhan TIME,
    asr_jamaat TIME,
    maghrib_adhan TIME,
    maghrib_jamaat TIME,
    isha_adhan TIME,
    isha_jamaat TIME,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_schedule_date UNIQUE (schedule_id, date)
);

-- 9. Prayer Overrides (Layer 1 - Highest Priority)
CREATE TABLE IF NOT EXISTS public.prayer_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    override_date DATE NOT NULL,
    prayer_name prayer_name_enum NOT NULL,
    adhan_time TIME,
    jamaat_time TIME NOT NULL,
    reason TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_mosque_override UNIQUE (mosque_id, override_date, prayer_name)
);

-- 10. Jummah Schedules
CREATE TABLE IF NOT EXISTS public.jummah_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    session_number SMALLINT NOT NULL DEFAULT 1 CHECK (session_number >= 1 AND session_number <= 4),
    khutbah_time TIME NOT NULL,
    jamaat_time TIME NOT NULL,
    khateeb_name TEXT,
    language TEXT NOT NULL DEFAULT 'Urdu / Kashmiri',
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_mosque_jummah_session UNIQUE (mosque_id, session_number)
);

-- 11. Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type announcement_type NOT NULL DEFAULT 'general',
    priority announcement_priority NOT NULL DEFAULT 'normal',
    status announcement_status NOT NULL DEFAULT 'draft',
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    author_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Mosque Settings
CREATE TABLE IF NOT EXISTS public.mosque_settings (
    mosque_id UUID PRIMARY KEY REFERENCES public.mosques(id) ON DELETE CASCADE,
    show_adhan_times BOOLEAN NOT NULL DEFAULT true,
    show_jamaat_times BOOLEAN NOT NULL DEFAULT true,
    time_format time_format_type NOT NULL DEFAULT '12h',
    show_hijri_date BOOLEAN NOT NULL DEFAULT true,
    display_mode_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mosques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mosque_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.default_prayer_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_schedule_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jummah_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mosque_settings ENABLE ROW LEVEL SECURITY;

-- 14. Helper Security Functions
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'super_admin' AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_mosque_admin(user_id UUID, m_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.is_super_admin(user_id) OR EXISTS (
        SELECT 1 FROM public.mosque_admins
        WHERE user_id = user_id AND mosque_id = m_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Standard RLS Policies (Public Read, Admin Write)
CREATE POLICY "Public can view active mosques"
    ON public.mosques FOR SELECT TO anon, authenticated
    USING (status = 'active');

CREATE POLICY "Public can view default prayer schedules"
    ON public.default_prayer_schedules FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Public can view jummah schedules"
    ON public.jummah_schedules FOR SELECT TO anon, authenticated
    USING (is_enabled = true);

CREATE POLICY "Public can view published announcements"
    ON public.announcements FOR SELECT TO anon, authenticated
    USING (status = 'published');

CREATE POLICY "Public can view mosque settings"
    ON public.mosque_settings FOR SELECT TO anon, authenticated
    USING (true);

-- Allow authenticated users to manage their assigned mosques
CREATE POLICY "Super admins can manage all mosques"
    ON public.mosques FOR ALL TO authenticated
    USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Admins can update default prayer schedules"
    ON public.default_prayer_schedules FOR ALL TO authenticated
    USING (public.is_mosque_admin(auth.uid(), mosque_id));

-- ============================================================================
-- 16. SEED DATA: 8 MOSQUES (DEFAULT: JAMIA BILAL MASJID, KHAWAJABAGH)
-- ============================================================================

INSERT INTO public.mosques (id, name, slug, address, town, city, district, state, country, is_default, contact_number, email, description, timezone, status)
VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Jamia Bilal Masjid',
    'jamia-bilal-masjid',
    'Sherwani Colony, Khawajabagh',
    'Khawajabagh',
    'Baramulla',
    'Baramulla',
    'Jammu & Kashmir',
    'India',
    true,
    '+91 1952 235111',
    'jamiabilal.khawajabagh@gmail.com',
    'Jamia Bilal Masjid located at Sherwani Colony, Khawajabagh, Baramulla. The central congregational mosque serving Khawajabagh community.',
    'Asia/Kolkata',
    'active'
),
(
    '00000000-0000-0000-0000-000000000002',
    'Jamia Masjid Baramulla (Old Town)',
    'jamia-masjid-baramulla',
    'Old Town, Near Jhelum River',
    'Old Town',
    'Baramulla',
    'Baramulla',
    'Jammu & Kashmir',
    'India',
    false,
    '+91 1952 234567',
    'info@jamiamasjidbaramulla.org',
    'The historic Jamia Masjid of Baramulla Old Town, serving the community with daily prayers and Islamic education programs.',
    'Asia/Kolkata',
    'active'
),
(
    '00000000-0000-0000-0000-000000000003',
    'Masjid Noor (College Road)',
    'masjid-noor-sopore',
    'College Road, Sopore',
    'Sopore',
    'Sopore',
    'Baramulla',
    'Jammu & Kashmir',
    'India',
    false,
    '+91 1954 222333',
    'contact@masjidnoorsopore.org',
    'Masjid Noor in Sopore serving students and local residents.',
    'Asia/Kolkata',
    'active'
),
(
    '00000000-0000-0000-0000-000000000004',
    'Jamia Masjid Pattan',
    'jamia-masjid-pattan',
    'National Highway 1A, Main Market',
    'Pattan',
    'Pattan',
    'Baramulla',
    'Jammu & Kashmir',
    'India',
    false,
    '+91 1954 244111',
    NULL,
    'Central Friday mosque in Pattan market.',
    'Asia/Kolkata',
    'active'
),
(
    '00000000-0000-0000-0000-000000000005',
    'Jamia Masjid Tangmarg',
    'jamia-masjid-tangmarg',
    'Gulmarg Road, Main Chowk',
    'Tangmarg',
    'Tangmarg',
    'Baramulla',
    'Jammu & Kashmir',
    'India',
    false,
    '+91 1954 255222',
    NULL,
    'Prominent congregational mosque in Tangmarg foothills.',
    'Asia/Kolkata',
    'active'
),
(
    '00000000-0000-0000-0000-000000000006',
    'Jamia Masjid Srinagar',
    'jamia-masjid-srinagar',
    'Nowhatta, Downtown',
    'Nowhatta',
    'Srinagar',
    'Srinagar',
    'Jammu & Kashmir',
    'India',
    false,
    '+91 194 2456789',
    'info@jamiamasjidsrinagar.org',
    'Historic 14th century grand congregational mosque of Kashmir Valley.',
    'Asia/Kolkata',
    'active'
),
(
    '00000000-0000-0000-0000-000000000007',
    'Dargah Hazratbal Shrine',
    'dargah-hazratbal',
    'Hazratbal, Dal Lake',
    'Hazratbal',
    'Srinagar',
    'Srinagar',
    'Jammu & Kashmir',
    'India',
    false,
    '+91 194 2422211',
    'contact@hazratbal.org',
    'Famous white marble shrine on the northern bank of Dal Lake.',
    'Asia/Kolkata',
    'active'
),
(
    '00000000-0000-0000-0000-000000000008',
    'Jamia Masjid Hanfia Anantnag',
    'jamia-masjid-anantnag',
    'Reshi Bazar, Main Town',
    'Reshi Bazar',
    'Anantnag',
    'Anantnag',
    'Jammu & Kashmir',
    'India',
    false,
    '+91 1932 222111',
    NULL,
    'Central historic congregational mosque of South Kashmir.',
    'Asia/Kolkata',
    'active'
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    town = EXCLUDED.town,
    district = EXCLUDED.district,
    is_default = EXCLUDED.is_default;

-- 17. Seed Prayer Times for Jamia Bilal Masjid (Default Mosque)
INSERT INTO public.default_prayer_schedules (mosque_id, prayer_name, adhan_time, jamaat_time, is_enabled)
VALUES
('00000000-0000-0000-0000-000000000001', 'Fajr', '05:15:00', '05:45:00', true),
('00000000-0000-0000-0000-000000000001', 'Dhuhr', '12:30:00', '13:00:00', true),
('00000000-0000-0000-0000-000000000001', 'Asr', '15:45:00', '16:15:00', true),
('00000000-0000-0000-0000-000000000001', 'Maghrib', '17:30:00', '17:35:00', true),
('00000000-0000-0000-0000-000000000001', 'Isha', '19:15:00', '19:45:00', true)
ON CONFLICT (mosque_id, prayer_name) DO UPDATE SET
    adhan_time = EXCLUDED.adhan_time,
    jamaat_time = EXCLUDED.jamaat_time;

-- 18. Seed Jummah for Jamia Bilal Masjid
INSERT INTO public.jummah_schedules (mosque_id, session_number, khutbah_time, jamaat_time, language, is_enabled)
VALUES
('00000000-0000-0000-0000-000000000001', 1, '12:45:00', '13:15:00', 'Urdu / Kashmiri', true)
ON CONFLICT (mosque_id, session_number) DO UPDATE SET
    khutbah_time = EXCLUDED.khutbah_time,
    jamaat_time = EXCLUDED.jamaat_time;

-- 19. Seed Mosque Settings for all
INSERT INTO public.mosque_settings (mosque_id, show_adhan_times, show_jamaat_times, time_format, show_hijri_date, display_mode_enabled)
VALUES
('00000000-0000-0000-0000-000000000001', true, true, '12h', true, true),
('00000000-0000-0000-0000-000000000002', true, true, '12h', true, true),
('00000000-0000-0000-0000-000000000003', true, true, '12h', true, true),
('00000000-0000-0000-0000-000000000004', true, true, '12h', true, true),
('00000000-0000-0000-0000-000000000005', true, true, '12h', true, true),
('00000000-0000-0000-0000-000000000006', true, true, '12h', true, true),
('00000000-0000-0000-0000-000000000007', true, true, '12h', true, true),
-- 20. Grant Schema and Table permissions to Supabase roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

