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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(fileName);

      onImageUrlChange(publicUrl);

      toast({
        title: "Berhasil",
        description: "Gambar berhasil diupload",
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
