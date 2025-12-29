import { motion } from "framer-motion";
import { Scissors, Award, Clock, Users } from "lucide-react";
import barberPortrait from "@/assets/barber-portrait.jpg";

const AboutSection = () => {
  const stats = [
    { icon: Scissors, value: "35+", label: "Years Experience" },
    { icon: Users, value: "10K+", label: "Happy Clients" },
    { icon: Award, value: "15+", label: "Awards Won" },
    { icon: Clock, value: "6", label: "Days A Week" },
  ];

  return (
    <section id="about" className="py-24 bg-card relative overflow-hidden">
      {/* Light Leaks Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/4 -left-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src={barberPortrait}
                alt="Master barber portrait"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
            </div>

            {/* Decorative Frame */}
            <div className="absolute -inset-4 border-2 border-gold/20 rounded-2xl -z-10" />
            <div className="absolute -inset-8 border border-gold/10 rounded-2xl -z-20" />

            {/* Experience Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 md:bottom-8 md:right-8 bg-gold text-primary-foreground p-6 rounded-2xl shadow-lg"
            >
              <div className="text-center">
                <div className="text-4xl font-display font-bold">35</div>
                <div className="text-sm font-body opacity-80">Years of Excellence</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-gold font-body text-sm tracking-widest uppercase mb-4">
              About Us
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Traditional Barbering
              <br />
              <span className="text-gradient-gold">With a Modern Touch</span>
            </h2>

            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">
              Since 1985, Old Thai Barber has been the cornerstone of premium men's grooming. 
              Our master barbers blend time-honored techniques with contemporary styles to deliver 
              an unparalleled experience.
            </p>

            <p className="text-muted-foreground font-body leading-relaxed mb-10">
              Every visit is more than a haircut—it's a ritual. From the moment you step through 
              our doors, you're treated to the finest service, premium products, and the kind of 
              attention to detail that has made us a legend in the craft.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <stat.icon className="w-6 h-6 text-gold mx-auto mb-2" />
                  <div className="text-3xl font-display font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-body text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
