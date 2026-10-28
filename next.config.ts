import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
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
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://fonts.googleapis.com https://*.codesandbox.io https://*.csb.app; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://*.vercel.app https://github-readme-stats.vercel.app https://github-readme-stats-eight-theta.vercel.app https://avatars.githubusercontent.com https://*.githubusercontent.com https://*.codesandbox.io https://*.csb.app https://images.unsplash.com https://*.github.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.emailjs.com https://gql.hashnode.com https://*.codesandbox.io https://*.csb.app https://registry.npmjs.org https://cdn.jsdelivr.net wss://*.codesandbox.io wss://*.csb.app https://*.vercel.app; frame-src 'self' blob: data: https://www.youtube.com https://giscus.app https://*.codesandbox.io https://*.csb.app https://*.toolmate.co.in https://toolmate.co.in https://*.prahladinala.in https://prahladinala.in https://*.vercel.app; worker-src 'self' blob:;",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/#contact",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/privacy/:path*",
        destination: "/privacy-policy/:path*",
        permanent: true,
      },
      {
        source: "/privacy-policy/universal-ai-chat-pdf-exporter",
        destination: "/privacy-policy/universal-ai-chat-to-pdf-export",
        permanent: true,
      },
      {
        source: "/privacy-policy/universal-ai-chat-to-pdf-exporter",
        destination: "/privacy-policy/universal-ai-chat-to-pdf-export",
        permanent: true,
      },
      {
        source: "/admin/:path*",
        destination: "/keystatic/:path*",
        permanent: false,
      },
      {
        source: "/admin",
        destination: "/keystatic",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
