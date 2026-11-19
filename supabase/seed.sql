-- ============================================================================
-- seed.sql
-- Development / Initial Seed Data for Mosque Prayer App
-- ============================================================================

-- 1. Insert Initial Mosques
INSERT INTO public.mosques (id, name, slug, address, city, state, country, latitude, longitude, contact_number, email, website, description, timezone, status)
VALUES
(
    'a1b2c3d4-e5f6-4a1b-8c2d-111111111111',
    'Jamia Masjid Baramulla',
    'jamia-masjid-baramulla',
    'Main Town, Near Bus Stand',
    'Baramulla',
    'Jammu & Kashmir',
    'India',
    34.198000,
    74.364000,
    '+91 1952 234567',
    'info@jamiamasjidbaramulla.org',
    NULL,
    'The historic Jamia Masjid of Baramulla, serving the community with daily prayers, Friday sermons, and Islamic education programs.',
    'Asia/Kolkata',
    'active'
),
(
    'a1b2c3d4-e5f6-4a1b-8c2d-222222222222',
    'Masjid Noor',
    'masjid-noor',
    'College Road, Sopore',
    'Sopore',
    'Jammu & Kashmir',
    'India',
    34.288000,
    74.472000,
    '+91 1954 345678',
    NULL,
    NULL,
    'Masjid Noor serves the Sopore community with five daily prayers, weekly Jummah prayers, and community programs.',
    'Asia/Kolkata',
    'active'
),
(
    'a1b2c3d4-e5f6-4a1b-8c2d-333333333333',
    'Central Mosque Srinagar',
    'central-mosque-srinagar',
    'Lal Chowk, Downtown',
    'Srinagar',
    'Jammu & Kashmir',
    'India',
    34.083000,
    74.797000,
    '+91 194 2456789',
    'contact@centralmosquesrinagar.org',
    'https://centralmosquesrinagar.org',
    'Central Mosque Srinagar is one of the largest mosques in the Kashmir Valley, known for its beautiful architecture and scholarly traditions.',
    'Asia/Kolkata',
    'active'
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Mosque Settings
INSERT INTO public.mosque_settings (mosque_id, show_adhan_times, show_jamaat_times, time_format, show_hijri_date, display_mode_enabled)
VALUES
('a1b2c3d4-e5f6-4a1b-8c2d-111111111111', true, true, '12h', true, true),
('a1b2c3d4-e5f6-4a1b-8c2d-222222222222', true, true, '12h', true, false),
('a1b2c3d4-e5f6-4a1b-8c2d-333333333333', true, true, '12h', true, true)
ON CONFLICT (mosque_id) DO NOTHING;

-- 3. Insert Default Prayer Schedules for Mosque 1
INSERT INTO public.default_prayer_schedules (mosque_id, prayer_name, adhan_time, jamaat_time, note, is_enabled)
VALUES
('a1b2c3d4-e5f6-4a1b-8c2d-111111111111', 'Fajr', '05:15:00', '05:45:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-111111111111', 'Dhuhr', '12:30:00', '13:00:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-111111111111', 'Asr', '15:45:00', '16:15:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-111111111111', 'Maghrib', '17:30:00', '17:35:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-111111111111', 'Isha', '19:15:00', '19:45:00', NULL, true)
ON CONFLICT (mosque_id, prayer_name) DO NOTHING;

-- 4. Insert Default Prayer Schedules for Mosque 2
INSERT INTO public.default_prayer_schedules (mosque_id, prayer_name, adhan_time, jamaat_time, note, is_enabled)
VALUES
('a1b2c3d4-e5f6-4a1b-8c2d-222222222222', 'Fajr', '05:10:00', '05:40:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-222222222222', 'Dhuhr', '12:30:00', '13:00:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-222222222222', 'Asr', '15:45:00', '16:10:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-222222222222', 'Maghrib', '17:28:00', '17:33:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-222222222222', 'Isha', '19:10:00', '19:40:00', NULL, true)
ON CONFLICT (mosque_id, prayer_name) DO NOTHING;

-- 5. Insert Default Prayer Schedules for Mosque 3
INSERT INTO public.default_prayer_schedules (mosque_id, prayer_name, adhan_time, jamaat_time, note, is_enabled)
VALUES
('a1b2c3d4-e5f6-4a1b-8c2d-333333333333', 'Fajr', '05:20:00', '05:50:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-333333333333', 'Dhuhr', '12:35:00', '13:05:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-333333333333', 'Asr', '15:50:00', '16:20:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-333333333333', 'Maghrib', '17:32:00', '17:37:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-333333333333', 'Isha', '19:20:00', '19:50:00', NULL, true)
ON CONFLICT (mosque_id, prayer_name) DO NOTHING;

-- 6. Insert Jummah Sessions
INSERT INTO public.jummah_schedules (mosque_id, session_number, khutbah_time, jamaat_time, note, is_enabled)
VALUES
('a1b2c3d4-e5f6-4a1b-8c2d-111111111111', 1, '12:30:00', '13:00:00', 'Main Jummah prayer', true),
('a1b2c3d4-e5f6-4a1b-8c2d-111111111111', 2, '13:30:00', '14:00:00', 'Second Jummah prayer', true),
('a1b2c3d4-e5f6-4a1b-8c2d-222222222222', 1, '12:30:00', '13:00:00', NULL, true),
('a1b2c3d4-e5f6-4a1b-8c2d-333333333333', 1, '12:15:00', '12:45:00', 'First session', true),
('a1b2c3d4-e5f6-4a1b-8c2d-333333333333', 2, '13:15:00', '13:45:00', 'Second session', true);

-- 7. Insert Announcements
INSERT INTO public.announcements (mosque_id, title, message, type, priority, status, start_date, end_date)
VALUES
(
    'a1b2c3d4-e5f6-4a1b-8c2d-111111111111',
    'Winter Prayer Time Changes',
    'Due to shorter daylight hours, Asr and Isha prayer times have been adjusted starting this week. Please check the updated schedule.',
    'timing_change',
    'high',
    'published',
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '90 days'
),
(
    'a1b2c3d4-e5f6-4a1b-8c2d-111111111111',
    'Quran Classes for Children',
    'New Quran memorization classes starting from next Monday. Classes will be held after Fajr prayer. Registration is open at the office.',
    'general',
    'normal',
    'published',
    CURRENT_DATE - INTERVAL '2 days',
    CURRENT_DATE + INTERVAL '60 days'
),
(
    'a1b2c3d4-e5f6-4a1b-8c2d-333333333333',
    'Annual Community Fundraiser',
    'Join us for our annual fundraiser after Isha prayer. All community members and families are warmly welcome.',
    'event',
    'normal',
    'published',
    CURRENT_DATE - INTERVAL '1 day',
    CURRENT_DATE + INTERVAL '30 days'
);
