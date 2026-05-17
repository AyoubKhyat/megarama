import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "three",
      "@react-three/drei",
      "@react-three/fiber",
      "@react-three/postprocessing",
    ],
  },
};

export default nextConfig;
