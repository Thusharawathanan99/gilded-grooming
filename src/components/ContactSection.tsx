import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: ["123 Golden Street", "Bangkok, Thailand 10110"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+66 2 123 4567", "+66 81 234 5678"],
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon - Sat: 9:00 AM - 8:00 PM", "Sunday: Closed"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["book@oldthaibarber.com", "info@oldthaibarber.com"],
    },
  ];

  return (
    <section id="contact" className="py-24 bg-card relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
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
            Book Now
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Ready For Your
            <span className="text-gradient-gold"> Transformation?</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Visit us or book your appointment online. Experience the Old Thai Barber difference.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="glass-card rounded-xl p-6 border border-gold/10 hover:border-gold/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <info.icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {info.title}
                    </h3>
                  </div>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-muted-foreground font-body text-sm">
                      {detail}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card rounded-2xl p-8 border border-gold/10">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                Book Your Appointment
              </h3>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body text-muted-foreground mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-gold/10 text-foreground font-body focus:outline-none focus:border-gold transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body text-muted-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-gold/10 text-foreground font-body focus:outline-none focus:border-gold transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-gold/10 text-foreground font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="+66 81 234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">
                    Service
                  </label>
                  <select className="w-full px-4 py-3 rounded-lg bg-muted border border-gold/10 text-foreground font-body focus:outline-none focus:border-gold transition-colors">
                    <option value="">Select a service</option>
                    <option value="haircut">Hair Cut - $35</option>
                    <option value="beard">Beard Styling - $25</option>
                    <option value="wash">Hair Wash - $15</option>
                    <option value="premium">Premium Grooming - $75</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">
                    Preferred Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-gold/10 text-foreground font-body focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <Button variant="gold" size="lg" className="w-full mt-4">
                  <span>Book Now</span>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
