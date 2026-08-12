import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook, ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay } },
});

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submission:", form);
    setStatus("success");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  if (status === "success") {
    return (
      <div className="border border-black/10 p-8 text-center" data-testid="contact-success">
        <p className="font-display font-black uppercase text-xl text-gray-900 mb-2">Message Sent</p>
        <p className="text-sm text-gray-500">We'll get back to you within one business day. Thank you.</p>
        <button
          onClick={() => setStatus(null)}
          className="mt-6 text-xs font-bold tracking-widest uppercase text-rc-red hover:text-gray-900 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            data-testid="contact-name"
            className="w-full border border-black/12 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rc-red transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            data-testid="contact-email"
            className="w-full border border-black/12 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rc-red transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Subject</label>
        <input
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          required
          placeholder="What's this about?"
          data-testid="contact-subject"
          className="w-full border border-black/12 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rc-red transition-colors"
        />
      </div>
      <div>
        <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-2">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder="How can we help you?"
          data-testid="contact-message"
          className="w-full border border-black/12 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rc-red transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        data-testid="contact-submit"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rc-red text-white px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-900 transition-colors duration-200"
      >
        Send Message <ArrowRight size={13} />
      </button>
    </form>
  );
}

export default function Contact() {
  useSEO({
    title: "Contact Us | Redcat® Eyewear",
    description: "Get in touch with Redcat® Eyewear customer support. Email, phone, or social media — we respond within one business day.",
    keywords: "redcat eyewear contact, customer support, sport sunglasses help",
    path: "/contact",
  });

  return (
    <div className="bg-white overflow-x-hidden" data-testid="contact-page">

      {/* Hero */}
      <section className="pt-[calc(var(--navbar-h)+5rem)] pb-16 px-6 border-b border-black/5">
        <div className="max-w-screen-xl mx-auto">
          <motion.div variants={fadeUp()} initial="hidden" animate="visible">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-rc-red">Support</span>
            <h1
              className="font-display font-black uppercase leading-[0.9] text-gray-900 mt-2"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              Get in Touch
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUp(0.15)}
            initial="hidden"
            animate="visible"
            className="text-gray-500 text-sm mt-4 max-w-lg leading-relaxed"
          >
            We respond to all inquiries within one business day. For urgent matters, call or text us directly.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Contact Info */}
            <motion.div variants={fadeUp()} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="font-display font-black uppercase text-2xl text-gray-900 mb-8">Contact Information</h2>

              <div className="space-y-6">
                <a
                  href="mailto:support@redcateyewear.com"
                  className="flex items-start gap-4 group"
                  data-testid="contact-email-link"
                >
                  <div className="w-10 h-10 bg-[#F5F0E8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail size={16} className="text-rc-red" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Email</p>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-rc-red transition-colors">support@redcateyewear.com</p>
                  </div>
                </a>

                <a
                  href="tel:+16782088232"
                  className="flex items-start gap-4 group"
                  data-testid="contact-phone-link"
                >
                  <div className="w-10 h-10 bg-[#F5F0E8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone size={16} className="text-rc-red" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Phone</p>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-rc-red transition-colors">(678) 208-8232</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5F0E8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={16} className="text-rc-red" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Address</p>
                    <p className="text-sm text-gray-900">Redcat Eyewear LLC</p>
                    <p className="text-sm text-gray-500">890 Fox Meadow Ln</p>
                    <p className="text-sm text-gray-500">Lawrenceville, GA 30043</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="mt-10 pt-8 border-t border-black/8">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-5">Follow Us</p>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/redcateyewear/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="instagram-link"
                    className="flex items-center gap-2.5 border border-black/10 px-5 py-2.5 text-xs font-bold tracking-widest uppercase text-gray-700 hover:border-rc-red hover:text-rc-red transition-colors"
                  >
                    <Instagram size={14} /> Instagram
                  </a>
                  <a
                    href="https://www.facebook.com/redcateyewear/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="facebook-link"
                    className="flex items-center gap-2.5 border border-black/10 px-5 py-2.5 text-xs font-bold tracking-widest uppercase text-gray-700 hover:border-rc-red hover:text-rc-red transition-colors"
                  >
                    <Facebook size={14} /> Facebook
                  </a>
                </div>
              </div>

              {/* Response time note */}
              <div className="mt-10 bg-[#F5F0E8] px-6 py-5">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-1">Response Time</p>
                <p className="text-sm text-gray-500">We typically respond within one business day, Monday through Friday. For faster support, call or text during business hours (EST).</p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeUp(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="font-display font-black uppercase text-2xl text-gray-900 mb-8">Send a Message</h2>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
