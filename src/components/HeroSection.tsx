import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import heroImage from "@/assets/hero-barber.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Professional barber cutting hair in luxury barbershop"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Smoke Effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      {/* 3D Barber Pole */}
      <motion.div
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="relative w-8 h-48 rounded-full overflow-hidden border-2 border-gold/50 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-cream to-blue-600 animate-rotate-slow" style={{ backgroundSize: "100% 50%" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cream/30 to-transparent" />
        </div>
        <div className="w-10 h-4 bg-gold rounded-full mx-auto -mt-1 shadow-lg" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center lg:text-left lg:pl-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-gold/30 bg-card/50 backdrop-blur-sm"
          >
            <Scissors className="w-4 h-4 text-gold" />
            <span className="text-sm font-body tracking-wider text-gold">EST. 1985</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6"
          >
            <span className="text-foreground">Classic Cuts.</span>
            <br />
            <span className="text-gradient-gold">Modern Style.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground font-body mb-4 max-w-xl"
          >
            Premium Men's Barber Experience
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-base text-muted-foreground/80 font-body mb-10 max-w-xl"
          >
            Where tradition meets contemporary craftsmanship. Experience the art of grooming at Old Thai Barber.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button variant="hero" size="xl" className="group">
              <span>Book Appointment</span>
              <Scissors className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </Button>
            <Button variant="goldOutline" size="xl">
              View Services
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground font-body tracking-widest">SCROLL</span>
          <div className="w-6 h-10 rounded-full border-2 border-gold/50 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-gold rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
