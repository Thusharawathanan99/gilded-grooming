import { motion } from "framer-motion";
import { useState } from "react";
import serviceHaircut from "@/assets/service-haircut.jpg";
import serviceBeard from "@/assets/service-beard.jpg";
import serviceWash from "@/assets/service-wash.jpg";
import serviceGrooming from "@/assets/service-grooming.jpg";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  index: number;
}

const ServiceCard = ({ title, description, price, image, index }: ServiceCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="perspective-1000"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePosition({ x: 0, y: 0 });
        }}
        animate={{
          rotateX: isHovered ? -mousePosition.y : 0,
          rotateY: isHovered ? mousePosition.x : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative group h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card */}
        <div className="relative h-full overflow-hidden rounded-xl glass-card border border-gold/10 hover:border-gold/30 transition-all duration-500">
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            
            {/* Price Badge */}
            <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gold text-primary-foreground font-bold text-lg shadow-lg">
              {price}
            </div>
          </div>

          {/* Content */}
          <div className="p-6" style={{ transform: "translateZ(20px)" }}>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2 group-hover:text-gold transition-colors duration-300">
              {title}
            </h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(43, 74%, 52%, 0.15) 0%, transparent 60%)",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      title: "Hair Cut",
      description: "Precision haircuts tailored to your style. From classic fades to modern textures, our expert barbers deliver perfection every time.",
      price: "$35",
      image: serviceHaircut,
    },
    {
      title: "Beard Styling",
      description: "Master beard grooming with hot towel treatments, precise shaping, and conditioning for the distinguished gentleman.",
      price: "$25",
      image: serviceBeard,
    },
    {
      title: "Hair Wash",
      description: "Relaxing hair wash experience with premium products and scalp massage. Pure rejuvenation for your hair and mind.",
      price: "$15",
      image: serviceWash,
    },
    {
      title: "Premium Grooming",
      description: "Complete luxury experience including haircut, beard styling, hot towel treatment, and facial grooming. The ultimate package.",
      price: "$75",
      image: serviceGrooming,
    },
  ];

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden grain-overlay">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
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
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Crafted For The
            <span className="text-gradient-gold"> Modern Man</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Experience premium grooming services delivered with precision and care by our master barbers.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} {...service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
