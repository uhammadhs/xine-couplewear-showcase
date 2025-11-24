import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Award, Images, Trophy } from "lucide-react";
import { useState } from "react";

interface ImageItem {
  url: string;
  isPrimary?: boolean;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  for_him: string | null;
  for_her: string | null;
  images: ImageItem[];
  purchase_link: string | null;
  points_value: number | null;
}

interface ProductDetailProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetail = ({ product, open, onOpenChange }: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const images = product.images || [];
  const primaryImage = images.find(img => img.isPrimary) || images[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-hidden p-0 gap-0">
        {/* Mobile-optimized header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-3 md:px-6 md:py-4">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-3xl font-serif pr-8">{product.title}</DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-60px)] md:max-h-[calc(90vh-80px)]">
          <div className="grid md:grid-cols-2 gap-0 md:gap-6 md:p-6">
            {/* Image Gallery - Full width on mobile */}
            <div className="space-y-2 md:space-y-4">
              {images.length > 0 ? (
                <>
                  <div className="aspect-square md:rounded-lg overflow-hidden bg-muted relative group">
                    <img
                      src={images[selectedImage]?.url || primaryImage?.url}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Mobile swipe indicators */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 md:hidden">
                        {images.map((_, index) => (
                          <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              selectedImage === index 
                                ? 'w-6 bg-white' 
                                : 'w-1.5 bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Desktop thumbnail grid */}
                  {images.length > 1 && (
                    <div className="hidden md:grid grid-cols-4 gap-2">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-95 ${
                            selectedImage === index 
                              ? 'border-primary scale-95' 
                              : 'border-transparent hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Mobile horizontal scroll thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto px-4 pb-2 md:hidden snap-x snap-mandatory scrollbar-hide">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all snap-start ${
                            selectedImage === index 
                              ? 'border-primary scale-95' 
                              : 'border-transparent'
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={`${product.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square md:rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-4xl md:text-6xl font-serif text-primary/40">{product.title.charAt(0)}</span>
                </div>
              )}
            </div>

          {/* Product Details - Padded on mobile */}
          <div className="space-y-4 md:space-y-6 px-4 pb-20 md:pb-4 md:px-0">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-3 text-xs md:text-sm">
                {product.category}
              </Badge>
              
              {product.description && (
                <div className="prose prose-sm md:prose-base max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* For Him & Her */}
            {(product.for_him || product.for_her) && (
              <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-secondary/20 rounded-lg animate-fade-in">
                {product.for_him && (
                  <div>
                    <p className="text-xs md:text-sm font-semibold mb-1 text-foreground/90">For Him</p>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{product.for_him}</p>
                  </div>
                )}
                {product.for_her && (
                  <div>
                    <p className="text-xs md:text-sm font-semibold mb-1 text-foreground/90">For Her</p>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{product.for_her}</p>
                  </div>
                )}
              </div>
            )}

            {/* Points Info */}
            {product.points_value && (
              <div className="flex items-center gap-3 p-3 md:p-4 bg-primary/10 rounded-lg border border-primary/20 animate-fade-in">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-foreground/90">Points Value</p>
                  <p className="text-base md:text-lg font-bold text-primary">{product.points_value} points</p>
                </div>
              </div>
            )}

            {/* Purchase Button - Fixed on mobile */}
            {product.purchase_link && (
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t md:relative md:p-0 md:bg-transparent md:border-0 z-20">
                <Button
                  size="lg"
                  className="w-full shadow-lg md:shadow-none"
                  onClick={() => window.open(product.purchase_link!, '_blank')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Beli Sekarang
                </Button>
              </div>
            )}
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail;