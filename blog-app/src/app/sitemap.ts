import type { MetadataRoute } from "next";
import { getStudyWeeks } from "@/lib/getStudyData";
import { BASE_URL } from "@/constants/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const studyWeeks = getStudyWeeks();

  const weekPages = studyWeeks.map((w) => ({
    url: `${BASE_URL}/weeks/${w.weekNum}/`,
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
