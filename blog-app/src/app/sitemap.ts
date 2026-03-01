import type { MetadataRoute } from "next";
import { getAllSessions } from "@/lib/getStudyData";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const sessions = getAllSessions();

  const sessionPages = sessions.map((s) => ({
    url: `${BASE_URL}/session/${s.sessionNum}/`,
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
    ...sessionPages,
  ];
}
