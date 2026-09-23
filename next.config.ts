import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes except keystatic and api
        source: "/((?!keystatic|api/keystatic).*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://github-readme-stats.vercel.app https://avatars.githubusercontent.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.emailjs.com https://gql.hashnode.com; frame-src 'self' https://www.youtube.com;",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/admin/:path*",
        destination: "/keystatic/:path*",
        permanent: false,
      },
      {
        source: "/admin",
        destination: "/keystatic",
        permanent: false,
      }
    ];
  },
};

export default nextConfig;
