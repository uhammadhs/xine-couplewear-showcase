-- Create site_settings table for dynamic content management
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL UNIQUE,
  title text,
  subtitle text,
  description text,
  description_2 text,
  description_3 text,
  image_url text,
  button_text text,
  button_link text,
  extra_data jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can view active settings
CREATE POLICY "Everyone can view active settings"
ON public.site_settings
FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage settings
CREATE POLICY "Admins can manage settings"
ON public.site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.site_settings (section, title, subtitle, description, image_url, extra_data) VALUES
('hero', 'Together in Style', 'Xine Couplewear', 'Kami percaya cinta tak perlu diucap — cukup dikenakan.', '/src/assets/hero-couple.jpg', '{"button1": "Lihat Koleksi", "button2": "Kenali Xine"}'),
('about', 'Tentang Xine', null, 'Xine lahir dari ide sederhana — bahwa cinta bisa ditunjukkan melalui gaya berpakaian yang serasi dan saling melengkapi.', '/src/assets/about-studio.jpg', null),
('journal', 'Proses Kreatif di Balik Setiap Detail', 'Behind the Design', 'Setiap koleksi Xine lahir dari proses yang penuh perhatian. Kami tidak hanya mendesain pakaian — kami menciptakan pengalaman berpakaian yang bermakna.', '/src/assets/journal-bts.jpg', '{"button": "Lihat Koleksi Lengkap"}'),
('footer', 'XINE', null, 'Gaya yang menyatukan dua hati. Elegan tanpa harus seragam. Xine — tempat cinta bertemu desain.', null, '{"instagram": "https://instagram.com/xineclothing", "email": "hello@xineclothing.com", "whatsapp": "https://wa.me/6281234567890"}');

-- Add additional descriptions for about section
UPDATE public.site_settings 
SET 
  description_2 = 'Kami menciptakan koleksi couplewear yang tidak hanya indah dipandang, tetapi juga nyaman dikenakan. Setiap desain kami dirancang dengan detail yang teliti, memadukan estetika minimalis dengan sentuhan romantis yang elegan.',
  description_3 = 'Xine bukan sekadar pakaian — ini adalah cara untuk merayakan kebersamaan, mengekspresikan keharmonisan, dan menunjukkan bahwa cinta bisa terlihat dalam setiap detail.'
WHERE section = 'about';

-- Add additional description for journal section  
UPDATE public.site_settings
SET description_2 = 'Dari pemilihan bahan berkualitas tinggi hingga detail penjahitan yang teliti, setiap langkah kami lakukan dengan dedikasi penuh. Kami percaya bahwa pakaian yang baik adalah investasi untuk kenangan yang indah.'
WHERE section = 'journal';