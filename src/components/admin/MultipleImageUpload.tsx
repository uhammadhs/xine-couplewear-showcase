import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Star } from "lucide-react";

type ImageItem = {
  url: string;
  is_primary?: boolean;
};

type MultipleImageUploadProps = {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  folder: string;
  label?: string;
};

const MultipleImageUpload = ({
  images,
  onImagesChange,
  folder,
  label = "Gambar Produk",
}: MultipleImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const compressImage = async (file: File): Promise<{ blob: Blob; ext: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1920;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          const isPNG = file.type === "image/png";
          
          if (!isPNG) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ 
                  blob, 
                  ext: isPNG ? "png" : "jpg" 
                });
              } else {
                reject(new Error("Failed to compress image"));
              }
            },
            isPNG ? "image/png" : "image/jpeg",
            0.85
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    setUploading(true);

    try {
      const { blob, ext } = await compressImage(file);
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, blob, {
          contentType: `image/${ext}`,
          cacheControl: "31536000",
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(data.path);

      const newImage: ImageItem = {
        url: publicUrl,
        is_primary: images.length === 0,
      };

      onImagesChange([...images, newImage]);
      toast.success("Gambar berhasil diupload");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengupload gambar");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    
    if (images[index].is_primary && newImages.length > 0) {
      newImages[0].is_primary = true;
    }
    
    onImagesChange(newImages);
  };

  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onImagesChange(newImages);
  };

  return (
    <div>
      <Label className="text-sm font-medium mb-2">{label}</Label>
      
      <div className="space-y-4">
        {/* Upload Button */}
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="multiple-image-upload"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("multiple-image-upload")?.click()}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="mr-2" size={18} />
            {uploading ? "Mengupload..." : "Tambah Gambar"}
          </Button>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden border border-border group"
              >
                <img
                  src={image.url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={image.is_primary ? "default" : "secondary"}
                    onClick={() => handleSetPrimary(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Star
                      size={16}
                      fill={image.is_primary ? "currentColor" : "none"}
                    />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveImage(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X size={16} />
                  </Button>
                </div>

                {/* Primary Badge */}
                {image.is_primary && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    Utama
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-8 border border-dashed border-border rounded-lg text-muted-foreground text-sm">
            Belum ada gambar. Klik tombol di atas untuk upload gambar.
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleImageUpload;