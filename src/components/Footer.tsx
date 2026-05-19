"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/i18n";
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/SocialIcons";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/megarama_marrakech",
    icon: InstagramIcon,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/MegaramaMarrakech",
    icon: FacebookIcon,
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@megaramamarrakech",
    icon: TikTokIcon,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@megarama",
    icon: YouTubeIcon,
  },
];

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
            <a href="/privacy" className="text-xs text-white/40 hover:text-mega-red transition-colors tracking-wider">
              {t.footer.privacy}
            </a>
            <a href="/terms" className="text-xs text-white/40 hover:text-mega-red transition-colors tracking-wider">
              {t.footer.terms}
            </a>
            <a href="/careers" className="text-xs text-white/40 hover:text-mega-red transition-colors tracking-wider">
              {t.footer.careers}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30 tracking-wider">
              {t.footer.followUs}
            </span>
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-mega-red transition-colors"
                whileHover={{ scale: 1.2 }}
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          <p className="text-xs text-white/20 tracking-wider">
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
