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
import MultipleImageUpload from "@/components/admin/MultipleImageUpload";

type ImageItem = { url: string; is_primary?: boolean; };

const productSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi").max(200, "Judul maksimal 200 karakter"),
  category: z.enum(["casual", "classic", "limited"], { required_error: "Kategori wajib dipilih" }),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({ invalid_type_error: "Harga harus berupa angka" }).positive("Harga harus lebih dari 0").optional()
  ),
  description: z.string().trim().optional(),
  materials: z.string().trim().optional(),
  sizing: z.string().trim().optional(),
  care_instructions: z.string().trim().optional(),
  for_him: z.string().trim().max(200, "Maksimal 200 karakter").optional(),
  for_her: z.string().trim().max(200, "Maksimal 200 karakter").optional(),
  purchase_link: z.string().trim().url("Link pembelian tidak valid").optional().or(z.literal("")),
});

type Product = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  price: number | null;
  materials: string | null;
  sizing: string | null;
  care_instructions: string | null;
  for_him: string | null;
  for_her: string | null;
  image_url: string | null;
  images: ImageItem[];
  purchase_link: string | null;
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
    price: "",
    description: "",
    materials: "",
    sizing: "",
    care_instructions: "",
    for_him: "",
    for_her: "",
    purchase_link: "",
    images: [] as ImageItem[],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("products").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      setProducts((data || []).map(item => ({ ...item, images: (item.images as any as ImageItem[]) || [] })));
    } catch (error: any) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = productSchema.parse(formData);
      const dataToSave = {
        ...validatedData,
        price: validatedData.price || null,
        images: formData.images,
      };

      if (editingProduct) {
        const { error } = await supabase.from("products").update(dataToSave).eq("id", editingProduct.id);
        if (error) throw error;
        toast.success("Produk berhasil diupdate");
      } else {
        const { error } = await supabase.from("products").insert([dataToSave]);
        if (error) throw error;
        toast.success("Produk berhasil ditambahkan");
      }
      setOpen(false); resetForm(); fetchProducts();
    } catch (error: any) {
      if (error instanceof z.ZodError) { toast.error(error.errors[0].message); }
      else { toast.error(error.message); }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      description: product.description || "",
      materials: product.materials || "",
      sizing: product.sizing || "",
      care_instructions: product.care_instructions || "",
      for_him: product.for_him || "",
      for_her: product.for_her || "",
      purchase_link: product.purchase_link || "",
      images: product.images || [],
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
    } catch (error: any) { toast.error(error.message); }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("products").update({ is_active: !currentStatus }).eq("id", id);
      if (error) throw error;
      toast.success(currentStatus ? "Produk dinonaktifkan" : "Produk diaktifkan");
      fetchProducts();
    } catch (error: any) { toast.error(error.message); }
  };

  const resetForm = () => {
    setFormData({ title: "", category: "", price: "", description: "", materials: "", sizing: "", care_instructions: "", for_him: "", for_her: "", purchase_link: "", images: [] });
    setEditingProduct(null);
  };
  
  if (loading) return <div className="text-center py-8">Memuat...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Produk</h2>
        <Dialog open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (!isOpen) resetForm(); }}>
          <DialogTrigger asChild><Button><Plus className="mr-2" size={18} />Tambah Produk</Button></DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingProduct ? "Edit Produk" : "Tambah Produk Baru"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Judul Produk *</label>
                  <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori *</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                    <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                    <SelectContent><SelectItem value="casual">Casual</SelectItem><SelectItem value="classic">Classic</SelectItem><SelectItem value="limited">Limited</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                  <label className="block text-sm font-medium mb-1">Harga (IDR)</label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Contoh: 250000"/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bahan & Material</label>
                <Textarea value={formData.materials} onChange={(e) => setFormData({ ...formData, materials: e.target.value })} rows={3} placeholder="Contoh: 100% Cotton Combed 24s, benang premium, sablon plastisol..." />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Ukuran & Fit</label>
                    <Textarea value={formData.sizing} onChange={(e) => setFormData({ ...formData, sizing: e.target.value })} rows={3} placeholder="Contoh: Regular fit. Tersedia S, M, L, XL. Lihat panduan ukuran..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Instruksi Perawatan</label>
                    <Textarea value={formData.care_instructions} onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })} rows={3} placeholder="Contoh: Cuci dengan mesin suhu dingin, jangan gunakan pemutih, setrika suhu rendah..." />
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi Singkat (Pria)</label>
                  <Input value={formData.for_him} onChange={(e) => setFormData({ ...formData, for_him: e.target.value })} placeholder="Kemeja Relaxed Fit" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi Singkat (Wanita)</label>
                  <Input value={formData.for_her} onChange={(e) => setFormData({ ...formData, for_her: e.target.value })} placeholder="Blus Nyaman" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link Pembelian</label>
                <Input value={formData.purchase_link} onChange={(e) => setFormData({ ...formData, purchase_link: e.target.value })} placeholder="https://wa.me/..." />
              </div>
              <MultipleImageUpload images={formData.images} onImagesChange={(images) => setFormData({ ...formData, images })} folder="products" label="Gambar Produk" />
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Batal</Button>
                <Button type="submit">{editingProduct ? "Update Produk" : "Tambah Produk"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-card p-4 rounded-lg border">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge variant={product.is_active ? "default" : "outline"}>{product.is_active ? "Aktif" : "Nonaktif"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Harga: {product.price ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price) : "-"}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" onClick={() => toggleActive(product.id, product.is_active)}><{product.is_active ? EyeOff : Eye} size={16} /></Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(product)}><Edit size={16} /></Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></Button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && <div className="text-center py-12 text-muted-foreground">Belum ada produk.</div>}
      </div>
    </div>
  );
};

export default ProductsManagement;
