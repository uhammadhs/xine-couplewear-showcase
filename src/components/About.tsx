import aboutImage from "@/assets/about-studio.jpg";

const About = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6 slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-primary">
              Tentang Xine
            </h2>
            <div className="w-20 h-1 bg-accent"></div>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Xine lahir dari ide sederhana — bahwa cinta bisa ditunjukkan
              melalui gaya berpakaian yang serasi dan saling melengkapi.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Kami menciptakan koleksi couplewear yang tidak hanya indah
              dipandang, tetapi juga nyaman dikenakan. Setiap desain kami
              dirancang dengan detail yang teliti, memadukan estetika minimalis
              dengan sentuhan romantis yang elegan.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Xine bukan sekadar pakaian — ini adalah cara untuk merayakan
              kebersamaan, mengekspresikan keharmonisan, dan menunjukkan bahwa
              cinta bisa terlihat dalam setiap detail.
            </p>
          </div>

          {/* Image */}
          <div className="relative fade-in">
            <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-elegant">
              <img
                src={aboutImage}
                alt="Xine Studio - Where Love Meets Design"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
