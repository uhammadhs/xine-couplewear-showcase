import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import journalImage from "@/assets/journal-bts.jpg";

type JournalContent = {
  title: string;
  subtitle: string;
  description: string;
  description_2: string;
  image_url: string;
  extra_data: {
    button: string;
  };
};

const Journal = () => {
  const [content, setContent] = useState<JournalContent | null>(null);
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
        .eq("section", "journal")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      if (data) {
        setContent({
          title: data.title || "",
          subtitle: data.subtitle || "",
          description: data.description || "",
          description_2: data.description_2 || "",
          image_url: data.image_url || "",
          extra_data: data.extra_data as { button: string },
        });
      }
    } catch (error) {
      console.error("Error fetching journal content:", error);
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
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6 text-center">Memuat...</div>
      </section>
    );
  }

  return (
    <section id="journal" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative fade-in order-2 md:order-1">
            <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-elegant">
              {!imageLoaded && <Skeleton className="w-full h-full" />}
              <img
                src={content?.image_url?.startsWith('http') ? content.image_url : journalImage}
                alt="Behind the Design - Xine Journal"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
            {/* Decorative Frame */}
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-accent/30 rounded-lg -z-10"></div>
          </div>

          {/* Text Content */}
          <div className="space-y-6 slide-up order-1 md:order-2">
            <div className="inline-block px-4 py-2 bg-accent/20 rounded-full">
              <span className="text-sm font-medium text-primary uppercase tracking-wide">
                {content?.subtitle || "Behind the Design"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
              {content?.title || "Proses Kreatif di Balik Setiap Detail"}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {content?.description || ""}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {content?.description_2 || ""}
            </p>

            <div className="pt-4">
              <Button
                variant="hero"
                size="lg"
                onClick={() => scrollToSection("collections")}
              >
                {content?.extra_data?.button || "Lihat Koleksi Lengkap"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journal;
