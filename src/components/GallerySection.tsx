import { motion } from "framer-motion";
import { useState } from "react";
import serviceHaircut from "@/assets/service-haircut.jpg";
import serviceBeard from "@/assets/service-beard.jpg";
import serviceWash from "@/assets/service-wash.jpg";
import serviceGrooming from "@/assets/service-grooming.jpg";

const GallerySection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const galleryItems = [
    { image: serviceHaircut, title: "Classic Fade", category: "Haircut" },
    { image: serviceBeard, title: "Beard Sculpting", category: "Grooming" },
    { image: serviceWash, title: "Relaxation", category: "Experience" },
    { image: serviceGrooming, title: "Premium Care", category: "Treatment" },
  ];

  return (
    <section id="gallery" className="py-24 bg-background relative overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold font-body text-sm tracking-widest uppercase mb-4">
            Our Work
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Craftsmanship
            <span className="text-gradient-gold"> Gallery</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Witness the artistry and precision that defines every cut at Old Thai Barber.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                animate={{
                  scale: hoveredIndex === index ? 1.15 : 1,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />

              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0.6,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Content */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-end p-6"
                animate={{
                  y: hoveredIndex === index ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-gold text-xs font-body uppercase tracking-widest mb-1">
                  {item.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {item.title}
                </h3>
              </motion.div>

              {/* Border Glow */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-gold/0 group-hover:border-gold/50 transition-all duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
