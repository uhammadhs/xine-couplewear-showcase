import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import testimonialImage from "@/assets/testimonial-1.jpg";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      image: testimonialImage,
      quote:
        "Kami suka Xine karena desainnya netral, elegan, dan nggak norak. Perfect untuk pasangan yang suka tampil serasi tapi tetap punya karakter masing-masing.",
      names: "Rina & Dimas",
      occasion: "Anniversary Photoshoot",
    },
    {
      id: 2,
      image: testimonialImage,
      quote:
        "Xine memberikan kami pilihan yang berbeda dari brand lain. Kualitas bahan luar biasa, dan desainnya timeless. Kami bisa pakai berulang kali tanpa bosan.",
      names: "Sarah & Andi",
      occasion: "Casual Weekend",
    },
    {
      id: 3,
      image: testimonialImage,
      quote:
        "Dari pertama lihat, langsung jatuh cinta sama konsep Xine. Simpel tapi berkelas. Cocok banget buat kami yang suka gaya minimalis.",
      names: "Maya & Rizki",
      occasion: "Daily Wear",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="stories" className="py-24 md:py-32 bg-accent/20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Cerita Pasangan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dengarkan pengalaman pasangan yang telah merasakan kualitas dan
            kenyamanan Xine
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl shadow-elegant">
            {/* Background Image */}
            <img
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].names}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-elegant-dark via-elegant-dark/60 to-transparent"></div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8 md:p-12 fade-in">
              <p className="text-lg md:text-2xl text-background font-light italic mb-6 leading-relaxed">
                "{testimonials[currentIndex].quote}"
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-background font-semibold text-lg">
                    {testimonials[currentIndex].names}
                  </p>
                  <p className="text-background/80 text-sm">
                    {testimonials[currentIndex].occasion}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-3 rounded-full hover:bg-background transition-all duration-300 shadow-md"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="text-primary" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-3 rounded-full hover:bg-background transition-all duration-300 shadow-md"
            aria-label="Next testimonial"
          >
            <ChevronRight className="text-primary" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
