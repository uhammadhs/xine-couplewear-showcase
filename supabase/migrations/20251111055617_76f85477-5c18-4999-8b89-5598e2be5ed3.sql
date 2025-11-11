-- Add logo setting to site_settings table
INSERT INTO public.site_settings (section, title, image_url, is_active)
VALUES ('logo', 'XINE', '', true)
ON CONFLICT (section) DO NOTHING;