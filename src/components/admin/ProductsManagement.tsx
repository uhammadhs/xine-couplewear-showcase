import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import ImageUpload from "@/components/admin/ImageUpload";

const productSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi").max(200, "Judul maksimal 200 karakter"),
  category: z.enum(["casual", "classic", "limited"], { required_error: "Kategori wajib dipilih" }),
  description: z.string().trim().max(500, "Deskripsi maksimal 500 karakter").optional(),
  for_him: z.string().trim().max(200, "Maksimal 200 karakter").optional(),
  for_her: z.string().trim().max(200, "Maksimal 200 karakter").optional(),
  image_url: z.string().trim().url("URL gambar tidak valid").optional().or(z.literal("")),
});

type Product = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  for_him: string | null;
  for_her: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
};

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    for_him: "",
    for_her: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = productSchema.parse(formData);

      const dataToSave = {
        title: validatedData.title,
        category: validatedData.category,
        description: validatedData.description || null,
        for_him: validatedData.for_him || null,
        for_her: validatedData.for_her || null,
        image_url: validatedData.image_url || null,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(dataToSave)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast.success("Produk berhasil diupdate");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([dataToSave]);

        if (error) throw error;
        toast.success("Produk berhasil ditambahkan");
      }

      setOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      description: product.description || "",
      for_him: product.for_him || "",
      for_her: product.for_her || "",
      image_url: product.image_url || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Produk berhasil dihapus");
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success(currentStatus ? "Produk dinonaktifkan" : "Produk diaktifkan");
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      for_him: "",
      for_her: "",
      image_url: "",
    });
    setEditingProduct(null);
  };

  if (loading) {
    return <div className="text-center py-8">Memuat...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Manajemen Produk</h2>
        <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetForm(); }}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="mr-2" size={18} />
              Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul Produk *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Casual Harmony"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kategori *</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Gaya santai yang tetap serasi"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">For Him</label>
                  <Input
                    value={formData.for_him}
                    onChange={(e) => setFormData({ ...formData, for_him: e.target.value })}
                    placeholder="Relaxed Fit Shirt"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">For Her</label>
                  <Input
                    value={formData.for_her}
                    onChange={(e) => setFormData({ ...formData, for_her: e.target.value })}
                    placeholder="Comfort Blouse"
                  />
                </div>
              </div>

              <ImageUpload
                currentImageUrl={formData.image_url}
                onImageUrlChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="products"
                label="Gambar Produk"
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
                  {editingProduct ? "Update" : "Tambah"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-background p-6 rounded-lg shadow-sm border border-border"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-primary">
                    {product.title}
                  </h3>
                  <span className="text-xs px-3 py-1 bg-secondary rounded-full">
                    {product.category}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      product.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {product.description}
                  </p>
                )}
                <div className="flex gap-4 text-sm">
                  {product.for_him && (
                    <span className="text-muted-foreground">
                      <strong>Him:</strong> {product.for_him}
                    </span>
                  )}
                  {product.for_her && (
                    <span className="text-muted-foreground">
                      <strong>Her:</strong> {product.for_her}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleActive(product.id, product.is_active)}
                >
                  {product.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(product)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Belum ada produk. Tambahkan produk pertama Anda!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsManagement;
