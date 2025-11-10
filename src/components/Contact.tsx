import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Instagram, MessageCircle } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Nama tidak boleh kosong").max(100, "Nama maksimal 100 karakter"),
  email: z.string().trim().email("Email tidak valid").max(255, "Email maksimal 255 karakter"),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(1000, "Pesan maksimal 1000 karakter"),
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = contactSchema.parse(formData);

      const dataToSave = {
        name: validatedData.name,
        email: validatedData.email,
        message: validatedData.message,
      };

      const { error } = await supabase
        .from("contact_messages")
        .insert([dataToSave]);

      if (error) throw error;

      toast.success("Terima kasih! Pesan Anda sudah kami terima.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Gagal mengirim pesan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Mari Berkolaborasi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ingin tahu lebih banyak tentang Xine? Atau tertarik untuk
              berkolaborasi dengan kami? Hubungi kami sekarang.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="fade-in">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama Anda"
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="nama@email.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Pesan
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Ceritakan tentang kebutuhan atau pertanyaan Anda..."
                    className="w-full min-h-[150px]"
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Mengirim..." : "Kirim Pesan"}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8 fade-in">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">
                  Terhubung dengan Kami
                </h3>
                <p className="text-muted-foreground mb-8">
                  Kami selalu terbuka untuk berbicara tentang kolaborasi baru,
                  ide kreatif, atau sekadar menyapa.
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-4">
                <a
                  href="mailto:hello@xineclothing.com"
                  className="flex items-center gap-4 p-4 bg-background rounded-lg hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">
                      hello@xineclothing.com
                    </p>
                  </div>
                </a>

                <a
                  href="https://instagram.com/xineclothing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-background rounded-lg hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Instagram className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Instagram</p>
                    <p className="text-sm text-muted-foreground">
                      @xineclothing
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-background rounded-lg hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">
                      +62 812-3456-7890
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
