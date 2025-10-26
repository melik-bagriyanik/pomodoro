import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable telemetry to prevent Vercel authentication prompts
  telemetry: false,
  
  // Disable experimental features that might require authentication
  experimental: {
    // Disable any features that might trigger auth
  },
  
  // Ensure no external services are being used
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
};

export default nextConfig;
