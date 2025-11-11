import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Upload, Loader2, X } from "lucide-react";

type ImageUploadProps = {
  currentImageUrl: string | null;
  onImageUrlChange: (url: string) => void;
  folder: string;
  label?: string;
};

const ImageUpload = ({
  currentImageUrl,
  onImageUrlChange,
  folder,
  label = "Image",
}: ImageUploadProps) => {
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
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Cannot get canvas context"));
            return;
          }

          // Calculate new dimensions (max 1920px)
          let width = img.width;
          let height = img.height;
          const maxSize = 1920;

          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Fill white background for JPG, transparent for PNG
          const isPng = file.type === "image/png" || file.name.toLowerCase().endsWith('.png');
          
          if (!isPng) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
          }

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Use PNG for transparent images, JPEG for others
          const outputFormat = isPng ? "image/png" : "image/jpeg";
          const quality = isPng ? 0.95 : 0.85;
          const ext = isPng ? "png" : "jpg";

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ blob, ext });
              } else {
                reject(new Error("Compression failed"));
              }
            },
            outputFormat,
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "File harus berupa gambar",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Compress and optimize image
      const { blob: compressedBlob, ext: fileExt } = await compressImage(file);
      
      // Check compressed size (max 2MB after compression)
      if (compressedBlob.size > 2 * 1024 * 1024) {
        toast({
          title: "Warning",
          description: "Gambar terlalu besar, mencoba compress lebih lanjut...",
        });
      }

      const fileName = `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      const contentType = fileExt === "png" ? "image/png" : "image/jpeg";

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, compressedBlob, {
          contentType,
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(fileName);

      onImageUrlChange(publicUrl);

      toast({
        title: "Berhasil",
        description: "Gambar berhasil dioptimasi dan diupload",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Gagal mengupload gambar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onImageUrlChange("");
    toast({
      title: "Info",
      description: "URL gambar dihapus",
    });
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          value={currentImageUrl || ""}
          onChange={(e) => onImageUrlChange(e.target.value)}
          placeholder="Atau masukkan URL gambar"
        />
        {currentImageUrl && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRemoveImage}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      <div className="relative">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="cursor-pointer"
          id={`file-${folder}`}
        />
        <Label
          htmlFor={`file-${folder}`}
          className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-md cursor-pointer hover:bg-muted transition-colors"
        >
          {uploading ? (
            <Loader2 className="animate-spin mr-2" size={16} />
          ) : (
            <Upload className="mr-2" size={16} />
          )}
          {uploading ? "Mengupload..." : "Upload Gambar"}
        </Label>
      </div>

      {currentImageUrl && (
        <div className="mt-2">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md border"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
