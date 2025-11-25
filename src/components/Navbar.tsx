import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Define navigation item types
type NavItem = {
  label: string;
  type: "scroll" | "navigate";
  path: string; // URL for navigate, or ID for scroll
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Logo data
  const logo = {
    title: "XINE",
    image_url: "https://raw.githubusercontent.com/digitalninjanv/hosting_image/refs/heads/main/xine/Logo%20Warna%20Hitam.png",
  };

  // Nav items with types
  const navItems: NavItem[] = [
    { label: "Beranda", type: "scroll", path: "hero" },
    { label: "Tentang", type: "scroll", path: "about" },
    { label: "Koleksi", type: "navigate", path: "/collections" },
    { label: "Cerita", type: "scroll", path: "stories" },
    { label: "Journal", type: "scroll", path: "journal" },
  ];

  // Effect for scroll-based styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Effect to handle scrolling on hash change (when navigating from other pages)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100); // Timeout to allow page to render
    }
  }, [location.hash]);

  const handleNavClick = (item: NavItem) => {
    setIsMobileMenuOpen(false);

    if (item.type === "navigate") {
      navigate(item.path);
    } else { // type === "scroll"
      if (location.pathname === "/") {
        const element = document.getElementById(item.path);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        navigate(`/#${item.path}`);
      }
    }
  };
  
  const handleContactClick = () => {
      setIsMobileMenuOpen(false);
      if (location.pathname === "/") {
          const element = document.getElementById("contact");
          if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
      } else {
          navigate("/#contact");
      }
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    if (location.pathname === "/") {
        // If on home page, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // If on other pages, navigate to home
        navigate("/");
    }
  };


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled || isMobileMenuOpen
          ? "bg-background/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300"
          >
            {logo.image_url.startsWith("http") ? (
              <div className="relative h-10 w-auto">
                {!logoLoaded && <Skeleton className="h-10 w-24" />}
                <img
                  src={logo.image_url}
                  alt={logo.title || "Logo"}
                  className="h-10 w-auto object-contain"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  onLoad={() => setLogoLoaded(true)}
                  style={{ display: logoLoaded ? "block" : "none" }}
                />
              </div>
            ) : (
              <span className="text-2xl font-bold tracking-wider text-primary">
                {logo.title || "XINE"}
              </span>
            )}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
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
              onClick={handleContactClick}
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
          <div className="md:hidden mt-4 py-4 border-t border-border fade-in bg-background/95 backdrop-blur-lg rounded-lg">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="block w-full text-left py-3 px-4 text-foreground hover:text-primary hover:bg-muted/50 transition-all duration-300 font-medium"
              >
                {item.label}
              </button>
            ))}
            <div className="px-4">
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleContactClick}
              >
                Hubungi Kami
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
