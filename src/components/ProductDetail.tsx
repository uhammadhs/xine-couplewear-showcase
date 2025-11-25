import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart, X } from "lucide-react";

// TYPES
interface ImageItem { url: string; is_primary?: boolean; }
interface Product { 
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: number | null;
  materials: string | null;
  sizing: string | null;
  care_instructions: string | null;
  for_him: string | null;
  for_her: string | null;
  images: ImageItem[];
  purchase_link: string | null;
}
interface ProductDetailProps { product: Product | null; open: boolean; onOpenChange: (open: boolean) => void; }

// HELPER
const formatPrice = (price: number | null) => {
  if (price === null || isNaN(price)) return "Harga tidak tersedia";
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

// MAIN COMPONENT
const ProductDetail = ({ product, open, onOpenChange }: ProductDetailProps) => {
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (open && product?.images && product.images.length > 0) {
      const primary = product.images.find(img => img.is_primary) || product.images[0];
      setActiveImage(primary.url);
      setIsImageLoading(true);
    } else if (open && product?.image_url) {
      setActiveImage(product.image_url);
    }
  }, [product, open]);

  if (!product) return null;

  const { images, title, category, description, price, materials, sizing, care_instructions, purchase_link } = product;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 gap-0 grid grid-cols-1 md:grid-cols-2 max-h-[90vh]">
        {/* --- Close Button --- */}
        <button onClick={() => onOpenChange(false)} className="absolute top-3 right-3 z-50 p-2 rounded-full text-gray-500 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors">
          <X size={20}/>
        </button>

        {/* --- Image Gallery --- */}
        <div className="col-span-1 bg-gray-50 flex flex-col items-center justify-center p-6 border-r border-gray-200">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-4">
              {isImageLoading && <Skeleton className="absolute inset-0" />}
              <img
                key={activeImage} 
                src={activeImage}
                alt={title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsImageLoading(false)}
              />
            </div>
            <div className="flex gap-2 justify-center">
              {images && images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => { setIsImageLoading(true); setActiveImage(image.url); }}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${activeImage === image.url ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={image.url} alt={`${title} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
        </div>

        {/* --- Product Info (Scrollable) --- */}
        <div className="col-span-1 flex flex-col bg-white">
          <div className="flex-grow p-8 overflow-y-auto space-y-5">
            <header>
              <Badge variant="outline" className="mb-2 font-normal">{category}</Badge>
              <h1 className="text-3xl font-serif text-gray-900">{title}</h1>
            </header>

            <p className="text-3xl font-sans font-bold text-gray-800">{formatPrice(price)}</p>

            {description && (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line border-t pt-4">{description}</p>
            )}
            
            <Accordion type="single" collapsible className="w-full">
              {materials && (
                <AccordionItem value="materials">
                  <AccordionTrigger>Bahan & Material</AccordionTrigger>
                  <AccordionContent className="whitespace-pre-line text-sm text-gray-600">{materials}</AccordionContent>
                </AccordionItem>
              )}
              {sizing && (
                <AccordionItem value="sizing">
                  <AccordionTrigger>Ukuran & Fit</AccordionTrigger>
                  <AccordionContent className="whitespace-pre-line text-sm text-gray-600">{sizing}</AccordionContent>
                </AccordionItem>
              )}
              {care_instructions && (
                <AccordionItem value="care">
                  <AccordionTrigger>Instruksi Perawatan</AccordionTrigger>
                  <AccordionContent className="whitespace-pre-line text-sm text-gray-600">{care_instructions}</AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

          </div>

          <div className="p-6 border-t bg-white mt-auto flex-shrink-0">
            {purchase_link ? (
              <Button size="lg" className="w-full text-base" onClick={() => window.open(purchase_link, '_blank')}>
                <ShoppingCart className="mr-2 h-5 w-5" /> Beli Sekarang
              </Button>
            ) : (
              <p className="text-center text-sm text-gray-500">Segera Hadir</p>
            )}
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail;
