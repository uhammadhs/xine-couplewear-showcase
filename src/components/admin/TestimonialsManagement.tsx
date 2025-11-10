import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import ImageUpload from "@/components/admin/ImageUpload";

const testimonialSchema = z.object({
  couple_names: z.string().trim().min(1, "Nama pasangan wajib diisi").max(200, "Maksimal 200 karakter"),
  quote: z.string().trim().min(10, "Quote minimal 10 karakter").max(1000, "Maksimal 1000 karakter"),
  occasion: z.string().trim().min(1, "Occasion wajib diisi").max(200, "Maksimal 200 karakter"),
  image_url: z.string().trim().url("URL gambar tidak valid").optional().or(z.literal("")),
});

type Testimonial = {
  id: string;
  couple_names: string;
  quote: string;
  occasion: string;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
};

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    couple_names: "",
    quote: "",
    occasion: "",
    image_url: "",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = testimonialSchema.parse(formData);
      
      const dataToSave = {
        couple_names: validatedData.couple_names,
        quote: validatedData.quote,
        occasion: validatedData.occasion,
        image_url: validatedData.image_url || null,
      };

      if (editingTestimonial) {
        const { error } = await supabase
          .from("testimonials")
          .update(dataToSave)
          .eq("id", editingTestimonial.id);

        if (error) throw error;
        toast.success("Testimonial berhasil diupdate");
      } else {
        const { error } = await supabase
          .from("testimonials")
          .insert([dataToSave]);

        if (error) throw error;
        toast.success("Testimonial berhasil ditambahkan");
      }

      setOpen(false);
      resetForm();
      fetchTestimonials();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      couple_names: testimonial.couple_names,
      quote: testimonial.quote,
      occasion: testimonial.occasion,
      image_url: testimonial.image_url || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus testimonial ini?")) return;

    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      toast.success("Testimonial berhasil dihapus");
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(currentStatus ? "Testimonial dinonaktifkan" : "Testimonial diaktifkan");
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      couple_names: "",
      quote: "",
      occasion: "",
      image_url: "",
    });
    setEditingTestimonial(null);
  };

  if (loading) {
    return <div className="text-center py-8">Memuat...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Manajemen Testimonial</h2>
        <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="mr-2" size={18} />
              Tambah Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? "Edit Testimonial" : "Tambah Testimonial Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama Pasangan *</label>
                <Input
                  value={formData.couple_names}
                  onChange={(e) => setFormData({ ...formData, couple_names: e.target.value })}
                  placeholder="Rina & Dimas"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quote *</label>
                <Textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Kami suka Xine karena..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Occasion *</label>
                <Input
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  placeholder="Anniversary Photoshoot"
                  required
                />
              </div>

              <ImageUpload
                currentImageUrl={formData.image_url}
                onImageUrlChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="testimonials"
                label="Gambar Testimonial"
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setOpen(false); resetForm(); }}
                >
                  Batal
                </Button>
                <Button type="submit" variant="hero">
                  {editingTestimonial ? "Update" : "Tambah"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-background p-6 rounded-lg shadow-sm border border-border"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-primary">
                    {testimonial.couple_names}
                  </h3>
                  <span className="text-xs px-3 py-1 bg-secondary rounded-full">
                    {testimonial.occasion}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      testimonial.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {testimonial.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                >
                  {testimonial.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(testimonial)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(testimonial.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Belum ada testimonial. Tambahkan testimonial pertama Anda!
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManagement;
