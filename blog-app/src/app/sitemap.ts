import type { MetadataRoute } from "next";
import { getAllWeeks } from "@/lib/getStudyData";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const weeks = getAllWeeks();

  const weekPages = weeks.map((w) => ({
    url: `${BASE_URL}/week/${w.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...weekPages,
  ];
}
