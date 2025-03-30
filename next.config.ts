import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => [
    {
      source: "/",
      destination: "/chats",
      permanent: true, // Use `false` if you plan to change this in the future
    },
  ],
};

export default nextConfig;
