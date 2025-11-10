import { useState } from "react";
import casualImage from "@/assets/collection-casual.jpg";
import classicImage from "@/assets/collection-classic.jpg";

const Collections = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const collections = [
    {
      id: 1,
      title: "Casual Harmony",
      category: "casual",
      image: casualImage,
      description: "Gaya santai yang tetap serasi",
      forHim: "Relaxed Fit Shirt",
      forHer: "Comfort Blouse",
    },
    {
      id: 2,
      title: "Classic Elegance",
      category: "classic",
      image: classicImage,
      description: "Elegan untuk momen istimewa",
      forHim: "Tailored Blazer",
      forHer: "Structured Coat",
    },
    {
      id: 3,
      title: "Minimal Chic",
      category: "casual",
      image: casualImage,
      description: "Kesederhanaan yang memesona",
      forHim: "Basic Tee Premium",
      forHer: "Essential Top",
    },
    {
      id: 4,
      title: "Evening Grace",
      category: "classic",
      image: classicImage,
      description: "Kemewahan yang terjaga",
      forHim: "Formal Shirt",
      forHer: "Evening Dress",
    },
  ];

  const filters = [
    { label: "Semua", value: "all" },
    { label: "Casual", value: "casual" },
    { label: "Classic", value: "classic" },
  ];

  const filteredCollections =
    activeFilter === "all"
      ? collections
      : collections.filter((item) => item.category === activeFilter);

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
                  src={collection.image}
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
                  <span>For Him: {collection.forHim}</span>
                  <span>For Her: {collection.forHer}</span>
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
