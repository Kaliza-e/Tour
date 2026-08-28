import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/workspace/", "/submit/", "/join/writer/", "/api/", "/login", "/join"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}