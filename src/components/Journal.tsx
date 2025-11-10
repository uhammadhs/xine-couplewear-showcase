import { Button } from "@/components/ui/button";
import journalImage from "@/assets/journal-bts.jpg";

const Journal = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
              <img
                src={journalImage}
                alt="Behind the Design - Xine Journal"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative Frame */}
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-accent/30 rounded-lg -z-10"></div>
          </div>

          {/* Text Content */}
          <div className="space-y-6 slide-up order-1 md:order-2">
            <div className="inline-block px-4 py-2 bg-accent/20 rounded-full">
              <span className="text-sm font-medium text-primary uppercase tracking-wide">
                Behind the Design
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
              Proses Kreatif <br />
              di Balik Setiap Detail
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Setiap koleksi Xine lahir dari proses yang penuh perhatian.
              Kami tidak hanya mendesain pakaian — kami menciptakan pengalaman
              berpakaian yang bermakna.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Dari pemilihan bahan berkualitas tinggi hingga detail penjahitan
              yang teliti, setiap langkah kami lakukan dengan dedikasi penuh.
              Kami percaya bahwa pakaian yang baik adalah investasi untuk
              kenangan yang indah.
            </p>

            <div className="pt-4">
              <Button
                variant="hero"
                size="lg"
                onClick={() => scrollToSection("collections")}
              >
                Lihat Koleksi Lengkap
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journal;
