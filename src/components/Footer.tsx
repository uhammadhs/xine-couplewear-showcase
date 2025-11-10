import { useState, useEffect } from "react";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type FooterContent = {
  title: string;
  description: string;
  extra_data: {
    instagram: string;
    email: string;
    whatsapp: string;
  };
};

const Footer = () => {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("section", "footer")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      if (data) {
        setContent({
          title: data.title || "",
          description: data.description || "",
          extra_data: data.extra_data as { instagram: string; email: string; whatsapp: string },
        });
      }
    } catch (error) {
      console.error("Error fetching footer content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{content?.title || "XINE"}</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              {content?.description || "Gaya yang menyatukan dua hati."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Jelajahi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#about"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Tentang Kami
                </a>
              </li>
              <li>
                <a
                  href="#collections"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Koleksi
                </a>
              </li>
              <li>
                <a
                  href="#stories"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Cerita Pasangan
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Terhubung</h4>
            <div className="flex gap-4">
              <a
                href={content?.extra_data?.instagram || "https://instagram.com/xineclothing"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={`mailto:${content?.extra_data?.email || "hello@xineclothing.com"}`}
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href={content?.extra_data?.whatsapp || "https://wa.me/6281234567890"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>
            © {currentYear} Xine Clothing. All rights reserved. Made with love
            for couples.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
