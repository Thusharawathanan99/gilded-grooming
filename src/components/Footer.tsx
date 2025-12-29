import { Scissors, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-gold/10 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center">
                <Scissors className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-foreground leading-tight">
                  Old Thai
                </span>
                <span className="text-gold text-sm font-body tracking-widest uppercase">
                  Barber
                </span>
              </div>
            </div>
            <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-sm mb-6">
              Premium men's grooming since 1985. Where tradition meets modern style. 
              Experience the art of barbering with our master craftsmen.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-gold hover:text-primary-foreground transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Home", "Services", "About", "Gallery", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-muted-foreground hover:text-gold font-body text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-bold text-foreground mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {["Hair Cut", "Beard Styling", "Hair Wash", "Premium Grooming", "Hot Towel Shave"].map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-muted-foreground hover:text-gold font-body text-sm transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground font-body text-sm">
            © 2024 Old Thai Barber. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-gold font-body text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-gold font-body text-sm transition-colors">
              Terms of Service
            </a>
            <Link to="/auth" className="text-muted-foreground hover:text-gold font-body text-sm transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
