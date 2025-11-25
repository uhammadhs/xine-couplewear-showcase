import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShoppingCart, ArrowLeft } from "lucide-react";

// TYPES
interface ImageItem { url: string; is_primary?: boolean; }
interface Product { 
  id: string; title: string; description: string | null; category: string; price: number | null;
  materials: string | null; sizing: string | null; care_instructions: string | null;
  images: ImageItem[]; purchase_link: string | null;
}

// HELPER
const formatPrice = (price: number | null) => {
  if (price === null || isNaN(price)) return "Harga tidak tersedia";
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
}

// PAGE COMPONENT
const ProductPage = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, images(url, is_primary)')
        .eq('id', id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      const primary = product.images.find(img => img.is_primary) || product.images[0];
      setActiveImage(primary.url);
      setIsImageLoading(true);
    }
  }, [product]);

  const renderContent = () => {
    if (isLoading) return <ProductSkeleton />;
    if (error || !product) return <NotFound />; 

    const { images, title, category, description, price, materials, sizing, care_instructions, purchase_link } = product;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col items-start">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-4 border">
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

        {/* Product Info */}
        <div className="py-4">
            <Badge variant="outline" className="mb-3 font-normal">{category}</Badge>
            <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-4">{title}</h1>
            <p className="text-4xl font-sans font-bold text-gray-800 mb-6">{formatPrice(price)}</p>
            
            {description && <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-8">{description}</p>}

            <Accordion type="single" collapsible defaultValue="materials" className="w-full mb-8">
                {materials && <AccordionItem value="materials"><AccordionTrigger>Bahan & Material</AccordionTrigger><AccordionContent className="whitespace-pre-line text-gray-600">{materials}</AccordionContent></AccordionItem>}
                {sizing && <AccordionItem value="sizing"><AccordionTrigger>Ukuran & Fit</AccordionTrigger><AccordionContent className="whitespace-pre-line text-gray-600">{sizing}</AccordionContent></AccordionItem>}
                {care_instructions && <AccordionItem value="care"><AccordionTrigger>Instruksi Perawatan</AccordionTrigger><AccordionContent className="whitespace-pre-line text-gray-600">{care_instructions}</AccordionContent></AccordionItem>}
            </Accordion>

            {purchase_link ? (
                <Button size="lg" className="w-full text-base" onClick={() => window.open(purchase_link, '_blank')}><ShoppingCart className="mr-2 h-5 w-5" /> Beli Sekarang</Button>
            ) : (
                <p className="text-center text-gray-500">Segera Hadir</p>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="mb-8">
            <Button variant="outline" asChild>
                <Link to="/"><ArrowLeft size={16} className="mr-2"/> Kembali ke Koleksi</Link>
            </Button>
        </div>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

// SUB-COMPONENTS for loading and error states
const ProductSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div>
            <Skeleton className="w-full aspect-square rounded-lg"/>
            <div className="flex gap-2 mt-4">
                <Skeleton className="w-16 h-16 rounded-md"/>
                <Skeleton className="w-16 h-16 rounded-md"/>
                <Skeleton className="w-16 h-16 rounded-md"/>
            </div>
        </div>
        <div className="py-4 space-y-6">
            <Skeleton className="w-1/4 h-6"/>
            <Skeleton className="w-3/4 h-12"/>
            <Skeleton className="w-1/2 h-10"/>
            <Skeleton className="w-full h-24"/>
            <Skeleton className="w-full h-12"/>
        </div>
    </div>
);

const NotFound = () => (
    <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-800">Produk Tidak Ditemukan</h2>
        <p className="text-gray-600 mt-2">Maaf, kami tidak dapat menemukan produk yang Anda cari.</p>
    </div>
)

export default ProductPage;
