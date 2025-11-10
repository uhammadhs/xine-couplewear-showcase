import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import aboutImage from "@/assets/about-studio.jpg";

type AboutContent = {
  title: string;
  description: string;
  description_2: string;
  description_3: string;
  image_url: string;
};

const About = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("section", "about")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      if (data) {
        setContent({
          title: data.title || "",
          description: data.description || "",
          description_2: data.description_2 || "",
          description_3: data.description_3 || "",
          image_url: data.image_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching about content:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container mx-auto px-6 text-center">Memuat...</div>
      </section>
    );
  }

  return (
    <section id="about" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              {content?.title || "Tentang Xine"}
            </h2>
            <div className="w-20 h-1 bg-accent"></div>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {content?.description || ""}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {content?.description_2 || ""}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {content?.description_3 || ""}
            </p>
          </div>

          {/* Image */}
          <div className="relative fade-in">
            <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-elegant">
              <img
                src={content?.image_url || aboutImage}
                alt="Xine Studio - Where Love Meets Design"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
