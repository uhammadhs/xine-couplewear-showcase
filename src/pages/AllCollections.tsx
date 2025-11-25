
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingBag } from "lucide-react";

// TYPES
type ImageItem = { url: string; is_primary?: boolean };
type Product = {
  id: string;
  title: string;
  category: string;
  price: number | null;
  images: ImageItem[];
};

// HELPERS
const formatPrice = (price: number | null) => {
  if (price === null || isNaN(price)) return "";
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

// SUB-COMPONENTS (Copied from Collections.tsx)
const ProductCard = ({ product, onDetailClick }: { product: Product; onDetailClick: () => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const displayImage = primaryImage?.url;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Product ${product.id} added to cart (simulation)`);
  }

  return (
    <div className="group text-left fade-in-up">
      <div 
        onClick={onDetailClick} 
        className="relative w-full cursor-pointer overflow-hidden bg-muted rounded-md aspect-[3/4]"
      >
        {!isLoaded && <Skeleton className="absolute inset-0" />}
        {displayImage && (
            <img
            src={displayImage}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 ${isLoaded ? "scale-100" : "scale-110"}`}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
            />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
        <div className="absolute bottom-4 left-4 right-4 flex justify-center items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <Button variant="outline" size="sm" className="w-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 hover:text-gray-950 text-xs font-semibold" onClick={onDetailClick}>
                <Eye size={14} className="mr-2"/>
                Lihat Detail
            </Button>
            <Button variant="outline" size="icon" className="w-10 bg-white/90 backdrop-blur-sm hover:bg-white flex-shrink-0" onClick={handleAddToCart}>
                <ShoppingBag size={16} className="text-gray-800"/>
            </Button>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
        <h3 className="text-base font-semibold text-foreground truncate mt-1">{product.title}</h3>
        <p className="text-lg font-bold text-foreground mt-1">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
    {[...Array(8)].map((_, i) => (
      <div key={i}>
        <Skeleton className="w-full aspect-[3/4] rounded-md" />
        <Skeleton className="w-3/4 h-5 mt-4" />
        <Skeleton className="w-1/2 h-4 mt-2" />
        <Skeleton className="w-1/3 h-5 mt-2" />
      </div>
    ))}
  </div>
);

// MAIN PAGE COMPONENT
const AllCollectionsPage = () => {
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, category, price, images")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({ ...item, images: (item.images as any) || [] }));
    },
    staleTime: 1000 * 60 * 5
  });

  const handleDetailClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pb-20">
        <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                All Collections
            </h1>
            <p className="mt-4 text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                Discover every piece from our collections. Find the perfect match that tells your story.
            </p>
        </div>
        
        {isLoading ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map(product => (
              <ProductCard key={product.id} product={product} onDetailClick={() => handleDetailClick(product)} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AllCollectionsPage;
