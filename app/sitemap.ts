import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/about",
    "/research",
    "/questions",
    "/publications",
    "/community",
    "/team",
    "/contact",
    "/join",
    "/login",
    "/achievements",
    "/challenges",
    "/mentorship",
    "/get-started",
  ];

  const lastModified = new Date();

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}