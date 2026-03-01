import type { MetadataRoute } from "next";
import { getAllWeeks } from "@/lib/getStudyData";

export const dynamic = "force-static";

const BASE_URL = "https://[YOUR_GITHUB_ID].github.io/deep-inside-react-study";

export default function sitemap(): MetadataRoute.Sitemap {
  const weeks = getAllWeeks();

  const weekPages = weeks.map((week) => ({
    url: `${BASE_URL}/week/${week.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...weekPages,
  ];
}
