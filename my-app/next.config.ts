import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",   // ✔ IMPORTANT for SSR runtime envs
  reactStrictMode: true,
};

export default nextConfig;
