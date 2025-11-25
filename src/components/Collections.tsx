import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye } from "lucide-react";

// TYPES
type ImageItem = { url: string; is_primary?: boolean };
type Product = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  for_him: string | null;
  for_her: string | null;
  image_url: string | null;
  images: ImageItem[];
  purchase_link: string | null;
};

// SUB-COMPONENTS
const ProductCard = ({ product, onDetailClick }: { product: Product; onDetailClick: () => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const displayImage = primaryImage?.url || product.image_url;

  return (
    <div className="group contents">
      <div onClick={onDetailClick} className="relative cursor-pointer text-left fade-in-up">
        <div className="relative w-full overflow-hidden bg-muted rounded-md aspect-[3/4]">
          {!isLoaded && <Skeleton className="absolute inset-0" />}
          {displayImage && (
            <img
              src={displayImage}
              alt={product.title}
              className={`w-full h-full object-cover transition-transform duration-500 ease-in-out ${isLoaded ? "scale-100" : "scale-110"}`}
              onLoad={() => setIsLoaded(true)}
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             <Button variant="outline" className="w-full bg-white/90 backdrop-blur-sm hover:bg-white">
                <Eye size={16} className="mr-2"/>
                Lihat Detail
             </Button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-base font-semibold text-foreground truncate">{product.title}</h3>
          <p className="text-sm text-muted-foreground">{product.category}</p>
        </div>
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
      </div>
    ))}
  </div>
);

// MAIN COMPONENT
const Collections = () => {
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, category, description, for_him, for_her, image_url, images, purchase_link")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data || []).map(item => ({ ...item, images: (item.images as any) || [] }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleDetailClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const renderProductGrid = (category: string | null) => {
    if (isLoading) return <ProductGridSkeleton />;
    const filtered = category ? products.filter(p => p.category.toLowerCase() === category.toLowerCase()) : products;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} onDetailClick={() => handleDetailClick(product)} />
        ))}
      </div>
    );
  };
  
  return (
    <section id="collections" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            Our Collections
          </h2>
          <p className="mt-4 text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our couplewear, designed for perfect harmony and effortless style.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-10">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="casual">Casual</TabsTrigger>
            <TabsTrigger value="classic">Classic</TabsTrigger>
          </TabsList>

          <TabsContent value="all">{renderProductGrid(null)}</TabsContent>
          <TabsContent value="casual">{renderProductGrid("casual")}</TabsContent>
          <TabsContent value="classic">{renderProductGrid("classic")}</TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Collections;
