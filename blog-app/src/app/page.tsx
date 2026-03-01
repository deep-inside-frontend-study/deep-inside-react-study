import Link from "next/link";
import { getAllSessions, StudySession } from "@/lib/getStudyData";

// js-index-maps: Map으로 O(1) 조회
const MEMBER_COLOR_MAP = new Map<string, string>([
  ["hyunwoo", "#6378ff"],
  ["jisoo", "#a78bfa"],
  ["joohyung", "#38bdf8"],
  ["seungho", "#34d399"],
  ["hsy", "#fb7185"],
]);

function SessionCard({ session }: { session: StudySession }) {
  const { sessionNum, weeks } = session;

  // 이 세션에 참여한 유니크 멤버 목록
  const allMembers = [
    ...new Set(weeks.flatMap((w) => w.members.map((m) => m.member))),
  ];

  const chapterNums = weeks.map((w) => w.week);
  const chapterLabel =
    chapterNums.length > 1
      ? `${chapterNums[0]}~${chapterNums[chapterNums.length - 1]}장`
      : `${chapterNums[0]}장`;

  return (
    <Link href={`/session/${sessionNum}`} className="no-underline h-full">
      <div className="glass-card fade-in-up flex flex-col gap-4 p-6 h-full cursor-pointer">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="badge badge-part2">{sessionNum}주차</span>
            <span
              className="text-5xl font-black leading-none tabular-nums"
              style={{ color: "rgba(99,120,255,0.2)" }}
            >
              {String(sessionNum).padStart(2, "0")}
            </span>
          </div>

          {/* Member avatars */}
          {allMembers.length > 0 ? (
            <div className="flex items-center">
              {allMembers.map((name, i) => (
                <div
                  key={name}
                  title={name}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[#0a0e1a]"
                  style={{
                    background: MEMBER_COLOR_MAP.get(name) ?? "#94a3b8",
                    marginLeft: i > 0 ? -8 : 0,
                    zIndex: allMembers.length - i,
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Chapter list */}
        <div className="flex flex-col gap-1.5">
          {weeks.map((w) => (
            <div
              key={w.slug}
              className="flex items-center gap-2 text-xs text-slate-400"
            >
              <span className="text-[#6378ff] font-mono shrink-0">
                {w.week}장
              </span>
              <span className="truncate">{w.chapterTitle}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs text-slate-600">
            {chapterLabel} · {allMembers.length}명
          </span>
          <span className="text-xs text-[#6378ff]">보기 →</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const sessions = getAllSessions();
  const totalChapters = sessions.reduce((acc, s) => acc + s.weeks.length, 0);
  const totalContributions = sessions.reduce(
    (acc, s) => acc + s.weeks.reduce((a, w) => a + w.members.length, 0),
    0,
  );

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div
        className="border-b border-[rgba(99,120,255,0.15)] px-6 pt-16 pb-12 text-center"
        style={{
          background:
            "linear-gradient(180deg, rgba(99,120,255,0.06) 0%, transparent 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="badge badge-part2 mb-5 inline-flex">📚 북스터디</div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            <span className="gradient-text">Inside React</span>
            <br />
            스터디 아카이브
          </h1>

          <p className="text-slate-400 text-base leading-relaxed">
            다시 깊게 익히는 인사이드 리액트 — React의 내부 동작 원리를 구조
            중심으로 이해하는 스터디의 주차별 요약, 질문, 그리고 인사이트
            모음입니다.
          </p>

          {/* Stats */}
          <div className="flex gap-4 justify-center mt-7 flex-wrap">
            {[
              { value: sessions.length, label: "주차", color: "#6378ff" },
              { value: totalChapters, label: "챕터", color: "#a78bfa" },
              { value: totalContributions, label: "기록", color: "#38bdf8" },
            ].map(({ value, label, color }) => (
              <div
                key={label}
                className="rounded-xl px-5 py-3 text-center border border-[rgba(99,120,255,0.15)]"
                style={{ background: "rgba(99,120,255,0.08)" }}
              >
                <div className="text-2xl font-black" style={{ color }}>
                  {value}
                </div>
                <div className="text-xs text-slate-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Cards */}
      <div className="max-w-5xl mx-auto px-6 py-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <SessionCard key={session.sessionNum} session={session} />
          ))}
        </div>
      </div>
    </main>
  );
}
