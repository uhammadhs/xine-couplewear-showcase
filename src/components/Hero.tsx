import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-couple.jpg";

type HeroContent = {
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  extra_data: {
    button1: string;
    button2: string;
  };
};

const Hero = () => {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("section", "hero")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      if (data) {
        setContent({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          image_url: data.image_url || "",
          extra_data: data.extra_data as { button1: string; button2: string },
        });
      }
    } catch (error) {
      console.error("Error fetching hero content:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        <div>Memuat...</div>
      </section>
    );
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {!imageLoaded && (
          <Skeleton className="w-full h-full" />
        )}
        <img
          src={content?.image_url?.startsWith('http') ? content.image_url : heroImage}
          alt="Xine Couplewear - Together in Style"
          className="w-full h-full object-cover"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center fade-in">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {content?.title || "Together in Style"}
        </h1>
        <p className="text-xl md:text-2xl text-white mb-4 font-light drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          {content?.subtitle || "Xine Couplewear"}
        </p>
        <p className="text-base md:text-lg text-white/95 max-w-2xl mx-auto mb-12 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          {content?.description || "Kami percaya cinta tak perlu diucap — cukup dikenakan."}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="hero"
            size="lg"
            onClick={() => scrollToSection("collections")}
            className="min-w-[200px]"
          >
            {content?.extra_data?.button1 || "Lihat Koleksi"}
          </Button>
          <Button
            variant="elegant"
            size="lg"
            onClick={() => scrollToSection("about")}
            className="min-w-[200px]"
          >
            {content?.extra_data?.button2 || "Kenali Xine"}
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
