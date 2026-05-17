"use client";

import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-mega-dark" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-mega-red/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-mega-red" />
            <span className="text-xs tracking-[0.3em] text-mega-red uppercase">
              Find Us
            </span>
            <div className="w-12 h-[1px] bg-mega-red" />
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
            VISIT <span className="text-mega-red">US</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square lg:aspect-auto lg:h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0">
              <img
                src="https://marrakech.megarama.ma/cine-themes/megarama/269/img/cinema-megarama.jpg?=20251221"
                alt="Megarama Marrakech Cinema"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-bold mb-2">Megarama Marrakech</p>
                  <p className="text-sm text-white/60">
                    Avenue Mohammed VI, Marrakech
                  </p>
                  <a
                    href="https://maps.google.com/?q=Megarama+Marrakech+Morocco"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-6 py-2 border border-mega-red/50 text-mega-red text-xs tracking-widest uppercase rounded-full hover:bg-mega-red hover:text-white transition-all duration-300"
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
            </div>
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* Info cards */}
            <div className="glass-card p-6">
              <h3 className="text-xs tracking-[0.3em] text-mega-red uppercase mb-4">
                Opening Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Monday – Thursday</span>
                  <span className="text-white font-medium">10:00 – 00:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Friday – Saturday</span>
                  <span className="text-white font-medium">10:00 – 01:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Sunday</span>
                  <span className="text-white font-medium">10:00 – 23:00</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xs tracking-[0.3em] text-mega-red uppercase mb-4">
                Contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📞</span>
                  <span className="text-white/80">+212 5 24 43 59 72</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">✉️</span>
                  <span className="text-white/80">marrakech@megarama.ma</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🌐</span>
                  <span className="text-white/80">marrakech.megarama.ma</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xs tracking-[0.3em] text-mega-red uppercase mb-4">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {["Instagram", "Facebook", "Twitter", "YouTube"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="px-4 py-2 bg-white/5 rounded-lg text-xs text-white/60 hover:bg-mega-red/20 hover:text-mega-red border border-white/10 hover:border-mega-red/30 transition-all duration-300"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="glass-card p-6">
              <h3 className="text-xs tracking-[0.3em] text-mega-red uppercase mb-2">
                Stay Updated
              </h3>
              <p className="text-sm text-white/40 mb-4">
                Get notified about new releases and exclusive offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-mega-red/50 transition-colors"
                />
                <button className="px-6 py-3 bg-mega-red text-white text-xs tracking-widest uppercase rounded-lg hover:bg-mega-red-dark transition-all duration-300">
                  Join
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
