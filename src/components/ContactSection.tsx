import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  phone: z.string().trim().optional(),
  service: z.string().min(1, "Please select a service"),
  datetime: z.string().min(1, "Please choose a date & time"),
});

type BookingFormState = z.infer<typeof bookingSchema>;

type FieldErrors = Partial<Record<keyof BookingFormState, string>>;

const ContactSection = () => {
  const { toast } = useToast();

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

  const serviceLabel = useMemo(
    () => ({
      haircut: "Hair Cut",
      beard: "Beard Styling",
      wash: "Hair Wash",
      premium: "Premium Grooming",
    }),
    []
  );

  const [form, setForm] = useState<BookingFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    datetime: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (key: keyof BookingFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = bookingSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BookingFormState;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      toast({
        title: "Please check your details",
        description: "Fix the highlighted fields and try again.",
        variant: "destructive",
      });
      return;
    }

    const [appointment_date, timePartRaw] = parsed.data.datetime.split("T");
    const hhmm = (timePartRaw ?? "").slice(0, 5);
    const appointment_time = hhmm ? `${hhmm}:00` : null;

    if (!appointment_date || !appointment_time) {
      toast({
        title: "Invalid date/time",
        description: "Please select a valid date and time.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const customer_name = `${parsed.data.firstName} ${parsed.data.lastName}`.trim();
      const service_name =
        (serviceLabel as Record<string, string>)[parsed.data.service] ?? parsed.data.service;

      const { error } = await supabase.from("appointments").insert({
        customer_name,
        customer_phone: parsed.data.phone?.trim() || null,
        customer_email: parsed.data.email,
        service_name,
        appointment_date,
        appointment_time,
      });

      if (error) throw error;

      toast({
        title: "Appointment request sent",
        description: "Thanks! We'll confirm your appointment shortly.",
      });

      setForm({ firstName: "", lastName: "", email: "", phone: "", service: "", datetime: "" });
      setFieldErrors({});
    } catch (err: any) {
      toast({
        title: "Could not send appointment",
        description: err?.message ?? "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body text-muted-foreground mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      aria-invalid={!!fieldErrors.firstName}
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-gold/10 text-foreground font-body focus:outline-none focus:border-gold transition-colors"
                      placeholder="John"
                    />
                    {fieldErrors.firstName && (
                      <p className="mt-1 text-xs font-body text-destructive">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-body text-muted-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      aria-invalid={!!fieldErrors.lastName}
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-gold/10 text-foreground font-body focus:outline-none focus:border-gold transition-colors"
                      placeholder="Doe"
                    />
                    {fieldErrors.lastName && (
                      <p className="mt-1 text-xs font-body text-destructive">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    aria-invalid={!!fieldErrors.email}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-gold/10 text-foreground font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="john@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs font-body text-destructive">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-gold/10 text-foreground font-body focus:outline-none focus:border-gold transition-colors"
                    placeholder="+66 81 234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">
                    Service
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setField("service", e.target.value)}
                    aria-invalid={!!fieldErrors.service}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-gold/10 text-foreground font-body focus:outline-none focus:border-gold transition-colors"
                  >
                    <option value="">Select a service</option>
                    <option value="haircut">Hair Cut - $35</option>
                    <option value="beard">Beard Styling - $25</option>
                    <option value="wash">Hair Wash - $15</option>
                    <option value="premium">Premium Grooming - $75</option>
                  </select>
                  {fieldErrors.service && (
                    <p className="mt-1 text-xs font-body text-destructive">{fieldErrors.service}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-body text-muted-foreground mb-2">
                    Preferred Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={form.datetime}
                    onChange={(e) => setField("datetime", e.target.value)}
                    aria-invalid={!!fieldErrors.datetime}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-gold/10 text-foreground font-body focus:outline-none focus:border-gold transition-colors"
                  />
                  {fieldErrors.datetime && (
                    <p className="mt-1 text-xs font-body text-destructive">{fieldErrors.datetime}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full mt-4"
                  disabled={submitting}
                >
                  <span>{submitting ? "Booking..." : "Book Now"}</span>
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

