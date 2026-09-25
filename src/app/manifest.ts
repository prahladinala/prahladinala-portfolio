import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prahlad Inala Portfolio",
    short_name: "Prahlad",
    description: "Software Engineer & Frontend Developer specializing in React, Next.js, and Guidewire.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      }
    ],
  };
}
