import { Instagram, Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">XINE</h3>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Gaya yang menyatukan dua hati. <br />
              Elegan tanpa harus seragam. <br />
              Xine — tempat cinta bertemu desain.
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
                href="https://instagram.com/xineclothing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:hello@xineclothing.com"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://wa.me/6281234567890"
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
