import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSessions, getSessionData } from "@/lib/getStudyData";
import SessionDetailClient from "@/components/SessionDetailClient";

export async function generateStaticParams() {
  const sessions = getAllSessions();
  return sessions.map((s) => ({ num: String(s.sessionNum) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  const session = getSessionData(Number(num));
  if (!session) return { title: "Not Found" };

  const chapterNums = session.weeks.map((w) => w.week);
  const range =
    chapterNums.length > 1
      ? `${chapterNums[0]}~${chapterNums[chapterNums.length - 1]}장`
      : `${chapterNums[0]}장`;

  return {
    title: `${num}주차 스터디 (${range})`,
    description: `인사이드 리액트 ${range} 스터디 기록. ${session.weeks.map((w) => w.chapterTitle).join(", ")}`,
  };
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ num: string }>;
}) {
  const { num } = await params;
  const session = getSessionData(Number(num));
  if (!session) notFound();

  const sessions = getAllSessions();
  const currentIdx = sessions.findIndex(
    (s) => s.sessionNum === session.sessionNum,
  );
  const prevSession = currentIdx > 0 ? sessions[currentIdx - 1] : null;
  const nextSession =
    currentIdx < sessions.length - 1 ? sessions[currentIdx + 1] : null;

  const chapterNums = session.weeks.map((w) => w.week);
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
          <span className="badge badge-part2">{session.sessionNum}주차</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pt-10 pb-8 text-center bg-gradient-to-b from-[rgba(99,120,255,0.05)] to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="text-8xl font-black leading-none mb-2 tabular-nums select-none text-[rgba(99,120,255,0.12)]">
            {String(session.sessionNum).padStart(2, "0")}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-2">
            {session.sessionNum}주차 스터디
          </h1>
          <p className="text-slate-500 text-sm">
            {chapterRange} · {session.weeks.length}개 챕터
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <SessionDetailClient session={session} />

        {/* Prev / Next */}
        <div className="flex gap-4 mt-10">
          {prevSession ? (
            <Link
              href={`/session/${prevSession.sessionNum}`}
              className="flex-1 no-underline"
            >
              <div className="glass-card p-4 flex items-center gap-3">
                <span className="text-slate-500">←</span>
                <div>
                  <div className="text-[0.7rem] text-slate-600 mb-0.5">
                    이전 주차
                  </div>
                  <div className="text-sm text-slate-200 font-medium">
                    {prevSession.sessionNum}주차
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextSession ? (
            <Link
              href={`/session/${nextSession.sessionNum}`}
              className="flex-1 no-underline"
            >
              <div className="glass-card p-4 flex items-center justify-end gap-3">
                <div className="text-right">
                  <div className="text-[0.7rem] text-slate-600 mb-0.5">
                    다음 주차
                  </div>
                  <div className="text-sm text-slate-200 font-medium">
                    {nextSession.sessionNum}주차
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
