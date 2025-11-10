import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-couple.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Xine Couplewear - Together in Style"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center fade-in">
        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
          Together in Style
        </h1>
        <p className="text-xl md:text-2xl text-foreground/90 mb-4 font-light">
          Xine Couplewear
        </p>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          Kami percaya cinta tak perlu diucap — cukup dikenakan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="hero"
            size="lg"
            onClick={() => scrollToSection("collections")}
            className="min-w-[200px]"
          >
            Lihat Koleksi
          </Button>
          <Button
            variant="elegant"
            size="lg"
            onClick={() => scrollToSection("about")}
            className="min-w-[200px]"
          >
            Kenali Xine
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
