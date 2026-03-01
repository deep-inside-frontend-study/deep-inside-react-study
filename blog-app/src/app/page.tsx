import Link from "next/link";
import { getAllWeeks, getPart, WeekData } from "@/lib/getStudyData";

const PART_COLORS: Record<string, string> = {
  "PART 1": "badge-part1",
  "PART 2": "badge-part2",
  "PART 3": "badge-part3",
  "PART 4": "badge-part4",
};

const MEMBER_COLORS: Record<string, string> = {
  hyunwoo: "#6378ff",
  jisoo: "#a78bfa",
  joohyung: "#38bdf8",
  seungho: "#34d399",
  hsy: "#fb7185",
};

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}
function getMemberColor(name: string) {
  return MEMBER_COLORS[name] ?? "#94a3b8";
}

function WeekCard({ week, index }: { week: WeekData; index: number }) {
  const part = getPart(week.week);
  const partClass = PART_COLORS[part] ?? "badge-part1";

  return (
    <Link href={`/week/${week.slug}`} className="no-underline h-full">
      <div
        className="glass-card fade-in-up flex flex-col gap-4 p-6 h-full cursor-pointer"
        style={{ animationDelay: `${index * 0.03}s` }}
      >
        {/* Header row */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col gap-1">
            <span className={`badge ${partClass}`}>{part}</span>
            <span
              className="text-5xl font-black leading-none tabular-nums"
              style={{ color: "rgba(99,120,255,0.25)" }}
            >
              {String(week.week).padStart(2, "0")}
            </span>
          </div>

          {/* Member avatars */}
          {week.members.length > 0 && (
            <div className="flex items-center">
              {week.members.map((m, i) => (
                <div
                  key={m.member}
                  title={m.member}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[#0a0e1a] relative"
                  style={{
                    background: getMemberColor(m.member),
                    marginLeft: i > 0 ? -8 : 0,
                    zIndex: week.members.length - i,
                  }}
                >
                  {getInitial(m.member)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chapter title */}
        <p className="text-[0.95rem] font-semibold text-slate-200 leading-relaxed">
          {week.week}장 {week.chapterTitle}
        </p>

        {/* Footer */}
        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs text-slate-600">
            {week.members.length}명 참여
          </span>
          <span className="text-xs text-[#6378ff]">읽기 →</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const weeks = getAllWeeks();

  const partGroups: Record<string, WeekData[]> = {};
  weeks.forEach((w) => {
    const part = getPart(w.week);
    if (!partGroups[part]) partGroups[part] = [];
    partGroups[part].push(w);
  });

  const parts = ["PART 1", "PART 2", "PART 3", "PART 4"];
  const partTitles: Record<string, string> = {
    "PART 1": "프론트엔드 개발 돌아보기",
    "PART 2": "리액트 핵심 요소 깊게 돌아보기",
    "PART 3": "리액트 훅 사용법 깊게 돌아보기",
    "PART 4": "리액트를 둘러싸는 기술과 미래",
  };

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
              { value: 4, label: "파트", color: "#38bdf8" },
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

      {/* Week Cards grouped by Part */}
      <div className="max-w-5xl mx-auto px-6 py-10 pb-16">
        {parts
          .filter((part) => partGroups[part]?.length)
          .map((part) => (
            <section key={part} className="mb-12">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-5">
                <span className={`badge ${PART_COLORS[part]}`}>{part}</span>
                <h2 className="text-sm font-semibold text-slate-400">
                  {partTitles[part]}
                </h2>
                <div className="flex-1 h-px bg-[rgba(99,120,255,0.15)]" />
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {partGroups[part].map((week, i) => (
                  <WeekCard key={week.slug} week={week} index={i} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </main>
  );
}
