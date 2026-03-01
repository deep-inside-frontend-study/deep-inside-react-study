import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudyWeeks, getStudyWeekData } from "@/lib/getStudyData";
import WeekDetailClient from "@/components/WeekDetailClient";

export async function generateStaticParams() {
  const studyWeeks = getStudyWeeks();
  return studyWeeks.map((s) => ({ num: String(s.weekNum) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  const weekData = getStudyWeekData(Number(num));
  if (!weekData) return { title: "Not Found" };

  const chapterNums = weekData.chapters.map((w) => w.week);
  const range =
    chapterNums.length > 1
      ? `${chapterNums[0]}~${chapterNums[chapterNums.length - 1]}장`
      : `${chapterNums[0]}장`;

  return {
    title: `${num}주차 스터디 (${range})`,
    description: `인사이드 리액트 ${range} 스터디 기록. ${weekData.chapters.map((w) => w.chapterTitle).join(", ")}`,
  };
}

export default async function StudyWeekPage({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  const weekData = getStudyWeekData(Number(num));
  if (!weekData) notFound();

  const studyWeeks = getStudyWeeks();
  const currentIdx = studyWeeks.findIndex(
    (s) => s.weekNum === weekData.weekNum,
  );
  const prevWeek = currentIdx > 0 ? studyWeeks[currentIdx - 1] : null;
  const nextWeek =
    currentIdx < studyWeeks.length - 1 ? studyWeeks[currentIdx + 1] : null;

  const chapterNums = weekData.chapters.map((w) => w.week);
  const chapterRange =
    chapterNums.length > 1
      ? `${chapterNums[0]}~${chapterNums[chapterNums.length - 1]}장`
      : `${chapterNums[0]}장`;

  return (
    <main className="min-h-screen">
      {/* Sticky nav */}
      <div className="border-b border-[rgba(99,120,255,0.15)] sticky top-0 z-50 bg-[rgba(10,14,26,0.85)] backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link
            href="/"
            className="text-slate-500 no-underline text-sm hover:text-slate-300 transition-colors"
          >
            ← 목록으로
          </Link>
          <div className="flex-1 h-px bg-[rgba(99,120,255,0.15)]" />
          <span className="badge badge-part2">{weekData.weekNum}주차</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pt-10 pb-8 text-center bg-gradient-to-b from-[rgba(99,120,255,0.05)] to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="text-8xl font-black leading-none mb-2 tabular-nums select-none text-[rgba(99,120,255,0.12)]">
            {String(weekData.weekNum).padStart(2, "0")}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-2">
            {weekData.weekNum}주차 스터디
          </h1>
          <p className="text-slate-500 text-sm">
            {chapterRange} · {weekData.chapters.length}개 챕터
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <WeekDetailClient studyWeek={weekData} />

        {/* Prev / Next */}
        <div className="flex gap-4 mt-10">
          {prevWeek ? (
            <Link
              href={`/week/${prevWeek.weekNum}`}
              className="flex-1 no-underline"
            >
              <div className="glass-card p-4 flex items-center gap-3">
                <span className="text-slate-500">←</span>
                <div>
                  <div className="text-[0.7rem] text-slate-600 mb-0.5">
                    이전 주차
                  </div>
                  <div className="text-sm text-slate-200 font-medium">
                    {prevWeek.weekNum}주차
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextWeek ? (
            <Link
              href={`/week/${nextWeek.weekNum}`}
              className="flex-1 no-underline"
            >
              <div className="glass-card p-4 flex items-center justify-end gap-3">
                <div className="text-right">
                  <div className="text-[0.7rem] text-slate-600 mb-0.5">
                    다음 주차
                  </div>
                  <div className="text-sm text-slate-200 font-medium">
                    {nextWeek.weekNum}주차
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
