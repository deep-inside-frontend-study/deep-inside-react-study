import Link from "next/link";
import { notFound } from "next/navigation";
import { getWeekData, getWeekSlugs, getPart } from "@/lib/getStudyData";
import WeekDetailClient from "@/components/WeekDetailClient";

const BASE_URL = "https://[YOUR_GITHUB_ID].github.io/deep-inside-react-study";

const PART_COLORS: Record<string, string> = {
  "PART 1": "badge-part1",
  "PART 2": "badge-part2",
  "PART 3": "badge-part3",
  "PART 4": "badge-part4",
};

export async function generateStaticParams() {
  return getWeekSlugs().map((slug) => ({ id: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const week = getWeekData(id);
  if (!week) return { title: "Not Found" };

  const title = `Week ${week.week} — ${week.chapterTitle}`;
  const description = `인사이드 리액트 ${week.week}장 '${week.chapterTitle}' 스터디 기록. ${week.members.length}명이 Summary · Questions · Insights를 작성했습니다.`;
  const url = `${BASE_URL}/week/${id}/`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Inside React Study",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const week = getWeekData(id);
  if (!week) notFound();

  const part = getPart(week.week);
  const partClass = PART_COLORS[part] ?? "badge-part1";

  const slugs = getWeekSlugs();
  const currentIdx = slugs.indexOf(id);
  const prevSlug = currentIdx > 0 ? slugs[currentIdx - 1] : null;
  const nextSlug = currentIdx < slugs.length - 1 ? slugs[currentIdx + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Week ${week.week} — ${week.chapterTitle}`,
    description: `인사이드 리액트 ${week.week}장 스터디 기록`,
    url: `${BASE_URL}/week/${id}/`,
    author: week.members.map((m) => ({
      "@type": "Person",
      name: m.member,
    })),
    isPartOf: {
      "@type": "WebSite",
      name: "Inside React Study",
      url: BASE_URL,
    },
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Sticky nav */}
      <div
        className="border-b border-[rgba(99,120,255,0.15)] sticky top-0 z-50"
        style={{
          background: "rgba(10,14,26,0.85)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link
            href="/"
            className="text-slate-500 no-underline text-sm flex items-center gap-1 hover:text-slate-300 transition-colors"
          >
            ← 목록으로
          </Link>
          <div className="flex-1 h-px bg-[rgba(99,120,255,0.15)]" />
          <span className={`badge ${partClass}`}>{part}</span>
        </div>
      </div>

      {/* Header */}
      <div
        className="px-6 pt-10 pb-8 text-center"
        style={{
          background:
            "linear-gradient(180deg, rgba(99,120,255,0.05) 0%, transparent 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="text-8xl font-black leading-none mb-2 tabular-nums select-none"
            style={{ color: "rgba(99,120,255,0.12)" }}
          >
            {String(week.week).padStart(2, "0")}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-3">
            {week.week}장 {week.chapterTitle}
          </h1>
          <p className="text-slate-500 text-sm">
            {week.members.length}명의 스터디 멤버가 기록했습니다
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        {week.members.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-600">
            <p className="text-4xl mb-3">🏜️</p>
            <p>아직 기록이 없습니다.</p>
          </div>
        ) : (
          <WeekDetailClient week={week} />
        )}

        {/* Prev / Next Navigation */}
        <div className="flex gap-4 mt-10">
          {prevSlug ? (
            <Link href={`/week/${prevSlug}`} className="flex-1 no-underline">
              <div className="glass-card p-4 flex items-center gap-3">
                <span className="text-slate-500">←</span>
                <div>
                  <div className="text-[0.7rem] text-slate-600 mb-0.5">
                    이전 주차
                  </div>
                  <div className="text-sm text-slate-200 font-medium">
                    Week {parseInt(prevSlug.replace("week", ""))}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextSlug ? (
            <Link href={`/week/${nextSlug}`} className="flex-1 no-underline">
              <div className="glass-card p-4 flex items-center justify-end gap-3">
                <div className="text-right">
                  <div className="text-[0.7rem] text-slate-600 mb-0.5">
                    다음 주차
                  </div>
                  <div className="text-sm text-slate-200 font-medium">
                    Week {parseInt(nextSlug.replace("week", ""))}
                  </div>
                </div>
                <span className="text-slate-500">→</span>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>
    </main>
  );
}
