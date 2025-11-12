import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Collections from "@/components/Collections";
import CoupleGoals from "@/components/CoupleGoals";
import Testimonials from "@/components/Testimonials";
import Journal from "@/components/Journal";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Collections />
      <CoupleGoals />
      <Testimonials />
      <Journal />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
