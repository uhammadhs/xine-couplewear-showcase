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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="collections">
          <Collections />
        </section>
        <CoupleGoals />
        <section id="stories">
          <Testimonials />
        </section>
        <section id="journal">
          <Journal />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
