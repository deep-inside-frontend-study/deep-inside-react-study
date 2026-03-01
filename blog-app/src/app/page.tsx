import Link from "next/link";
import { getAllWeeks, WeekData } from "@/lib/getStudyData";

const MEMBER_COLOR_MAP = new Map<string, string>([
  ["hyunwoo", "#6378ff"],
  ["jisoo", "#a78bfa"],
  ["joohyung", "#38bdf8"],
  ["seungho", "#34d399"],
  ["hsy", "#fb7185"],
]);

function WeekCard({ week, index }: { week: WeekData; index: number }) {
  return (
    <Link href={`/week/${week.slug}`} className="no-underline h-full">
      <div
        className="glass-card fade-in-up flex flex-col gap-4 p-6 h-full cursor-pointer"
        style={{ animationDelay: `${index * 0.04}s` }}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="badge badge-part2">{week.week}주차</span>
            <span
              className="text-5xl font-black leading-none tabular-nums"
              style={{ color: "rgba(99,120,255,0.2)" }}
            >
              {String(week.week).padStart(2, "0")}
            </span>
          </div>

          {/* Member avatars */}
          {week.members.length > 0 ? (
            <div className="flex items-center">
              {week.members.map((m, i) => (
                <div
                  key={m.member}
                  title={m.member}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[#0a0e1a]"
                  style={{
                    background: MEMBER_COLOR_MAP.get(m.member) ?? "#94a3b8",
                    marginLeft: i > 0 ? -8 : 0,
                    zIndex: week.members.length - i,
                  }}
                >
                  {m.member.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Chapter title (what this week covered) */}
        <p className="text-[0.9rem] font-semibold text-slate-300 leading-relaxed">
          {week.chapterTitle}
        </p>

        {/* Footer */}
        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs text-slate-600">
            {week.members.length}명 참여
          </span>
          <span className="text-xs text-[#6378ff]">보기 →</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const weeks = getAllWeeks();
  const totalContributions = weeks.reduce(
    (acc, w) => acc + w.members.length,
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
              { value: weeks.length, label: "주차", color: "#6378ff" },
              { value: totalContributions, label: "기록", color: "#a78bfa" },
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

      {/* Week Cards */}
      <div className="max-w-5xl mx-auto px-6 py-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {weeks.map((week, i) => (
            <WeekCard key={week.slug} week={week} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
