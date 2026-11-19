-- ============================================================================
-- 00001_initial_schema.sql
-- Multi-Mosque Prayer Timing Management Platform
-- Full Normalized Schema, Enums, Indexes, Functions, and RLS Policies
-- ============================================================================

-- 1. Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('super_admin', 'mosque_admin');
CREATE TYPE mosque_status AS ENUM ('active', 'inactive');
CREATE TYPE schedule_status AS ENUM ('draft', 'published');
CREATE TYPE prayer_name_enum AS ENUM ('Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha');
CREATE TYPE announcement_type AS ENUM ('general', 'ramadan', 'eid', 'timing_change', 'event', 'emergency');
CREATE TYPE announcement_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE announcement_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE time_format_type AS ENUM ('12h', '24h');

-- 3. PROFILES TABLE (Mirrors Supabase Auth Users)
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

-- 4. MOSQUES TABLE
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

-- 5. MOSQUE ADMIN ASSIGNMENTS (Many-to-Many: profiles <-> mosques)
CREATE TABLE IF NOT EXISTS public.mosque_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'primary', -- primary | secondary
    assigned_by UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_mosque_user UNIQUE (mosque_id, user_id)
);

-- 6. DEFAULT PRAYER SCHEDULES (Fallback Layer 3)
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

-- 7. MONTHLY SCHEDULES (Header Layer 2)
CREATE TABLE IF NOT EXISTS public.monthly_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    year INTEGER NOT NULL CHECK (year >= 2024 AND year <= 2100),
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    status schedule_status NOT NULL DEFAULT 'draft',
    published_by UUID REFERENCES public.profiles(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_mosque_month_year UNIQUE (mosque_id, year, month)
);

-- 8. MONTHLY SCHEDULE ENTRIES (Detail Layer 2)
CREATE TABLE IF NOT EXISTS public.monthly_schedule_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_id UUID NOT NULL REFERENCES public.monthly_schedules(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    prayer_name prayer_name_enum NOT NULL,
    adhan_time TIME,
    jamaat_time TIME NOT NULL,
    note TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_schedule_date_prayer UNIQUE (schedule_id, date, prayer_name)
);

-- 9. PRAYER TIME OVERRIDES (Highest Precedence Layer 1)
CREATE TABLE IF NOT EXISTS public.prayer_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    prayer_name prayer_name_enum NOT NULL,
    adhan_time TIME,
    jamaat_time TIME NOT NULL,
    note TEXT,
    reason TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_mosque_date_prayer_override UNIQUE (mosque_id, date, prayer_name)
);

-- 10. JUMMAH SCHEDULES
CREATE TABLE IF NOT EXISTS public.jummah_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL DEFAULT 1 CHECK (session_number >= 1),
    khutbah_time TIME,
    jamaat_time TIME NOT NULL,
    note TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    effective_from DATE,
    effective_until DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type announcement_type NOT NULL DEFAULT 'general',
    priority announcement_priority NOT NULL DEFAULT 'normal',
    status announcement_status NOT NULL DEFAULT 'published',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_announcement_dates CHECK (end_date >= start_date)
);

-- 12. MOSQUE SETTINGS
CREATE TABLE IF NOT EXISTS public.mosque_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID NOT NULL UNIQUE REFERENCES public.mosques(id) ON DELETE CASCADE,
    show_adhan_times BOOLEAN NOT NULL DEFAULT true,
    show_jamaat_times BOOLEAN NOT NULL DEFAULT true,
    time_format time_format_type NOT NULL DEFAULT '12h',
    show_hijri_date BOOLEAN NOT NULL DEFAULT true,
    display_mode_enabled BOOLEAN NOT NULL DEFAULT true,
    custom_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mosque_id UUID REFERENCES public.mosques(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    previous_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_mosques_slug ON public.mosques(slug);
CREATE INDEX IF NOT EXISTS idx_mosques_city ON public.mosques(city);
CREATE INDEX IF NOT EXISTS idx_mosques_status ON public.mosques(status);
CREATE INDEX IF NOT EXISTS idx_mosque_admins_user ON public.mosque_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_mosque_admins_mosque ON public.mosque_admins(mosque_id);
CREATE INDEX IF NOT EXISTS idx_default_schedules_mosque ON public.default_prayer_schedules(mosque_id);
CREATE INDEX IF NOT EXISTS idx_monthly_schedules_mosque_period ON public.monthly_schedules(mosque_id, year, month);
CREATE INDEX IF NOT EXISTS idx_monthly_entries_schedule_date ON public.monthly_schedule_entries(schedule_id, date);
CREATE INDEX IF NOT EXISTS idx_prayer_overrides_mosque_date ON public.prayer_overrides(mosque_id, date);
CREATE INDEX IF NOT EXISTS idx_jummah_mosque ON public.jummah_schedules(mosque_id);
CREATE INDEX IF NOT EXISTS idx_announcements_mosque_dates ON public.announcements(mosque_id, start_date, end_date, status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_mosque ON public.activity_logs(mosque_id, created_at DESC);

-- ============================================================================
-- POSTGRESQL FUNCTION: 3-LAYER PRAYER TIMING RESOLUTION
-- Priority: 1. Override -> 2. Monthly Schedule -> 3. Default Schedule
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_resolved_prayer_times(
    p_mosque_id UUID,
    p_date DATE
)
RETURNS TABLE (
    prayer_name prayer_name_enum,
    adhan_time TIME,
    jamaat_time TIME,
    note TEXT,
    is_enabled BOOLEAN,
    source TEXT
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_year INT := EXTRACT(YEAR FROM p_date);
    v_month INT := EXTRACT(MONTH FROM p_date);
    v_monthly_schedule_id UUID;
    v_prayer prayer_name_enum;
BEGIN
    -- Check if a published monthly schedule exists for this mosque/month
    SELECT id INTO v_monthly_schedule_id
    FROM public.monthly_schedules
    WHERE mosque_id = p_mosque_id
      AND year = v_year
      AND month = v_month
      AND status = 'published'
    LIMIT 1;

    -- Iterate through all 5 prayers in canonical order
    FOR v_prayer IN SELECT unnest(ARRAY['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']::prayer_name_enum[])
    LOOP
        -- Layer 1: Check Override
        SELECT o.prayer_name, o.adhan_time, o.jamaat_time, o.note, o.is_enabled, 'override'::TEXT
        INTO prayer_name, adhan_time, jamaat_time, note, is_enabled, source
        FROM public.prayer_overrides o
        WHERE o.mosque_id = p_mosque_id
          AND o.date = p_date
          AND o.prayer_name = v_prayer;

        IF FOUND THEN
            RETURN NEXT;
            CONTINUE;
        END IF;

        -- Layer 2: Check Monthly Schedule Entry
        IF v_monthly_schedule_id IS NOT NULL THEN
            SELECT me.prayer_name, me.adhan_time, me.jamaat_time, me.note, me.is_enabled, 'monthly'::TEXT
            INTO prayer_name, adhan_time, jamaat_time, note, is_enabled, source
            FROM public.monthly_schedule_entries me
            WHERE me.schedule_id = v_monthly_schedule_id
              AND me.date = p_date
              AND me.prayer_name = v_prayer;

            IF FOUND THEN
                RETURN NEXT;
                CONTINUE;
            END IF;
        END IF;

        -- Layer 3: Check Default Mosque Schedule
        SELECT d.prayer_name, d.adhan_time, d.jamaat_time, d.note, d.is_enabled, 'default'::TEXT
        INTO prayer_name, adhan_time, jamaat_time, note, is_enabled, source
        FROM public.default_prayer_schedules d
        WHERE d.mosque_id = p_mosque_id
          AND d.prayer_name = v_prayer;

        IF FOUND THEN
            RETURN NEXT;
            CONTINUE;
        END IF;

        -- Fallback: Prayer not configured at all
        prayer_name := v_prayer;
        adhan_time := NULL;
        jamaat_time := NULL;
        note := 'Not configured';
        is_enabled := false;
        source := 'none';
        RETURN NEXT;
    END LOOP;
END;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'super_admin' AND is_active = true
    );
$$;

CREATE OR REPLACE FUNCTION public.is_mosque_admin(user_id UUID, check_mosque_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.mosque_admins
        WHERE user_id = user_id AND mosque_id = check_mosque_id
    ) OR public.is_super_admin(user_id);
$$;

-- Enable RLS on all tables
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
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles are readable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())); -- Prevent self role escalation

CREATE POLICY "Super admins can manage all profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.is_super_admin(auth.uid()));

-- 2. MOSQUES POLICIES
CREATE POLICY "Public can view active mosques"
    ON public.mosques FOR SELECT
    TO anon, authenticated
    USING (status = 'active' OR public.is_super_admin(auth.uid()) OR EXISTS (
        SELECT 1 FROM public.mosque_admins WHERE mosque_id = mosques.id AND user_id = auth.uid()
    ));

CREATE POLICY "Super admins can manage all mosques"
    ON public.mosques FOR ALL
    TO authenticated
    USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Mosque admins can update their assigned mosque"
    ON public.mosques FOR UPDATE
    TO authenticated
    USING (public.is_mosque_admin(auth.uid(), id));

-- 3. MOSQUE ADMINS POLICIES
CREATE POLICY "Admins can view mosque admin assignments"
    ON public.mosque_admins FOR SELECT
    TO authenticated
    USING (public.is_super_admin(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Super admins can manage mosque admin assignments"
    ON public.mosque_admins FOR ALL
    TO authenticated
    USING (public.is_super_admin(auth.uid()));

-- 4. PRAYER SCHEDULES (DEFAULT) POLICIES
CREATE POLICY "Public can view default prayer schedules"
    ON public.default_prayer_schedules FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Mosque admins and super admins can manage default schedules"
    ON public.default_prayer_schedules FOR ALL
    TO authenticated
    USING (public.is_mosque_admin(auth.uid(), mosque_id));

-- 5. MONTHLY SCHEDULES POLICIES
CREATE POLICY "Public can view published monthly schedules"
    ON public.monthly_schedules FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_mosque_admin(auth.uid(), mosque_id));

CREATE POLICY "Mosque admins and super admins can manage monthly schedules"
    ON public.monthly_schedules FOR ALL
    TO authenticated
    USING (public.is_mosque_admin(auth.uid(), mosque_id));

-- 6. MONTHLY SCHEDULE ENTRIES POLICIES
CREATE POLICY "Public can view entries of published schedules"
    ON public.monthly_schedule_entries FOR SELECT
    TO anon, authenticated
    USING (EXISTS (
        SELECT 1 FROM public.monthly_schedules ms
        WHERE ms.id = monthly_schedule_entries.schedule_id
          AND (ms.status = 'published' OR public.is_mosque_admin(auth.uid(), ms.mosque_id))
    ));

CREATE POLICY "Mosque admins and super admins can manage monthly schedule entries"
    ON public.monthly_schedule_entries FOR ALL
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.monthly_schedules ms
        WHERE ms.id = monthly_schedule_entries.schedule_id
          AND public.is_mosque_admin(auth.uid(), ms.mosque_id)
    ));

-- 7. PRAYER OVERRIDES POLICIES
CREATE POLICY "Public can view active prayer overrides"
    ON public.prayer_overrides FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Mosque admins and super admins can manage prayer overrides"
    ON public.prayer_overrides FOR ALL
    TO authenticated
    USING (public.is_mosque_admin(auth.uid(), mosque_id));

-- 8. JUMMAH SCHEDULES POLICIES
CREATE POLICY "Public can view enabled jummah schedules"
    ON public.jummah_schedules FOR SELECT
    TO anon, authenticated
    USING (is_enabled = true OR public.is_mosque_admin(auth.uid(), mosque_id));

CREATE POLICY "Mosque admins and super admins can manage jummah schedules"
    ON public.jummah_schedules FOR ALL
    TO authenticated
    USING (public.is_mosque_admin(auth.uid(), mosque_id));

-- 9. ANNOUNCEMENTS POLICIES
CREATE POLICY "Public can view published announcements"
    ON public.announcements FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_mosque_admin(auth.uid(), mosque_id));

CREATE POLICY "Mosque admins and super admins can manage announcements"
    ON public.announcements FOR ALL
    TO authenticated
    USING (public.is_mosque_admin(auth.uid(), mosque_id));

-- 10. MOSQUE SETTINGS POLICIES
CREATE POLICY "Public can view mosque settings"
    ON public.mosque_settings FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Mosque admins and super admins can update mosque settings"
    ON public.mosque_settings FOR ALL
    TO authenticated
    USING (public.is_mosque_admin(auth.uid(), mosque_id));

-- 11. ACTIVITY LOGS POLICIES
CREATE POLICY "Mosque admins can view their mosque activity logs"
    ON public.activity_logs FOR SELECT
    TO authenticated
    USING (public.is_mosque_admin(auth.uid(), mosque_id));

CREATE POLICY "Authenticated users can insert activity logs"
    ON public.activity_logs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
