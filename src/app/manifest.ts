import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Heirloom CRM",
    short_name: "Heirloom",
    description: "Keep track of the people who matter.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf3e9",
    theme_color: "#a3443d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
