"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/i18n";

export default function Footer() {
  const t = useTranslation();

  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/branding/logo.png"
              alt="Megarama"
              width={120}
              height={32}
              style={{ width: "auto", height: "32px" }}
            />
            <p className="text-xs text-white/30 mt-2 tracking-wider">
              {t.footer.location}
            </p>
          </motion.div>

          <div className="flex items-center gap-8">
            <a href="#" className="text-xs text-white/40 hover:text-mega-red transition-colors tracking-wider">
              {t.footer.privacy}
            </a>
            <a href="#" className="text-xs text-white/40 hover:text-mega-red transition-colors tracking-wider">
              {t.footer.terms}
            </a>
            <a href="#" className="text-xs text-white/40 hover:text-mega-red transition-colors tracking-wider">
              {t.footer.careers}
            </a>
          </div>

          <p className="text-xs text-white/20 tracking-wider">
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
