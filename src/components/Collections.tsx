import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type Product = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  for_him: string | null;
  for_her: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
};

const Collections = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };


  const filters = [
    { label: "Semua", value: "all" },
    { label: "Casual", value: "casual" },
    { label: "Classic", value: "classic" },
  ];

  const filteredCollections =
    activeFilter === "all"
      ? products
      : products.filter((item) => item.category === activeFilter);

  if (loading) {
    return (
      <section id="collections" className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center py-12">Memuat koleksi...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="collections" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Koleksi Kami
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Eksplorasi koleksi couplewear yang dirancang untuk pasangan yang
            ingin tampil serasi tanpa harus seragam
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12 fade-in">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className="group relative overflow-hidden rounded-lg shadow-soft hover:shadow-elegant transition-all duration-500 fade-in"
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={collection.image_url || ""}
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-elegant-dark/90 via-elegant-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-background mb-2">
                  {collection.title}
                </h3>
                <p className="text-background/90 mb-4">
                  {collection.description}
                </p>
                <div className="flex justify-between text-sm text-background/80">
                  <span>For Him: {collection.for_him}</span>
                  <span>For Her: {collection.for_her}</span>
                </div>
              </div>

              {/* Label */}
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                  {collection.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
