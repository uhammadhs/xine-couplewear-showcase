import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

type LogoContent = {
  title: string;
  image_url: string;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logo, setLogo] = useState<LogoContent | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("title, image_url")
        .eq("section", "logo")
        .eq("is_active", true)
        .single();

      if (error) throw error;
      if (data) {
        setLogo({
          title: data.title || "XINE",
          image_url: data.image_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
      setLogo({ title: "XINE", image_url: "" });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: "Beranda", id: "hero" },
    { label: "Tentang", id: "about" },
    { label: "Koleksi", id: "collections" },
    { label: "Cerita", id: "stories" },
    { label: "Journal", id: "journal" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300"
          >
            {logo?.image_url?.startsWith("http") ? (
              <div className="relative h-10 w-auto">
                {!logoLoaded && <Skeleton className="h-10 w-24" />}
                <img
                  src={logo.image_url}
                  alt={logo.title || "Logo"}
                  className="h-10 w-auto object-contain"
                  loading="lazy"
                  onLoad={() => setLogoLoaded(true)}
                  style={{ display: logoLoaded ? "block" : "none" }}
                />
              </div>
            ) : (
              <span className="text-2xl font-bold tracking-wider text-primary">
                {logo?.title || "XINE"}
              </span>
            )}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-300"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              variant="outline"
              onClick={() => scrollToSection("contact")}
            >
              Hubungi Kami
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border fade-in">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left py-3 text-foreground hover:text-primary transition-colors duration-300"
              >
                {item.label}
              </button>
            ))}
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => scrollToSection("contact")}
            >
              Hubungi Kami
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
