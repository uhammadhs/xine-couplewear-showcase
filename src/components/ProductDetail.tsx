import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Award, Images } from "lucide-react";
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{product.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Image Gallery */}
          <div className="space-y-4">
            {images.length > 0 ? (
              <>
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={images[selectedImage]?.url || primaryImage?.url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index ? 'border-primary' : 'border-transparent'
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
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                <Images className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-4">
                {product.category}
              </Badge>
              
              {product.description && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* For Him & Her */}
            {(product.for_him || product.for_her) && (
              <div className="space-y-3 border-t pt-4">
                {product.for_him && (
                  <div>
                    <h4 className="font-semibold mb-1">For Him:</h4>
                    <p className="text-sm text-muted-foreground">{product.for_him}</p>
                  </div>
                )}
                {product.for_her && (
                  <div>
                    <h4 className="font-semibold mb-1">For Her:</h4>
                    <p className="text-sm text-muted-foreground">{product.for_her}</p>
                  </div>
                )}
              </div>
            )}

            {/* Points Info */}
            {product.points_value && (
              <div className="flex items-center gap-2 bg-primary/10 p-3 rounded-lg">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  Earn {product.points_value} points with this purchase!
                </span>
              </div>
            )}

            {/* Purchase Button */}
            {product.purchase_link && (
              <Button
                size="lg"
                className="w-full"
                onClick={() => window.open(product.purchase_link!, '_blank')}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Beli Sekarang
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail;