import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  typescript: {
    // Allows production builds to complete successfully 
    // even if your project has TypeScript compilation bugs
    ignoreBuildErrors: true,
  },
  
  
};

export default nextConfig;
