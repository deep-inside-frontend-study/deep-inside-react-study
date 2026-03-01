import Link from "next/link";
import { getStudyWeeks, StudyWeek } from "@/lib/getStudyData";

const MEMBER_COLOR_MAP = new Map<string, string>([
  ["hyunwoo", "#6378ff"],
  ["jisoo", "#a78bfa"],
  ["joohyung", "#38bdf8"],
  ["seungho", "#34d399"],
  ["hsy", "#fb7185"],
]);

const MEMBER_GITHUB: Record<string, { displayName: string; github: string }> = {
  hyunwoo: { displayName: "Hyunwoo", github: "https://github.com/gusdn3477" },
  jisoo: { displayName: "Jisoo", github: "https://github.com/kelly6226" },
  joohyung: { displayName: "Joohyung", github: "https://github.com/22JH" },
  seungho: { displayName: "Seungho", github: "https://github.com/NoelYoon96" },
  hsy: { displayName: "HSY", github: "https://github.com/dev-redo" },
};

const REPO_URL =
  "https://github.com/deep-inside-frontend-study/deep-inside-react-study";

const GitHubIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

function StudyWeekCard({
  studyWeek,
  index,
}: {
  studyWeek: StudyWeek;
  index: number;
}) {
  const { weekNum, chapters } = studyWeek;

  // 전체 챕터 합쳐서 참여한 유니크 멤버 목록
  const allMembers = [
    ...new Set(chapters.flatMap((w) => w.members.map((m) => m.member))),
  ];

  const chapNums = chapters.map((w) => w.week);
  const chapterRange =
    chapNums.length > 1
      ? `${chapNums[0]}~${chapNums[chapNums.length - 1]}장`
      : `${chapNums[0]}장`;

  return (
    <Link href={`/week/${weekNum}`} className="no-underline h-full">
      <div
        className="glass-card fade-in-up flex flex-col gap-4 p-6 h-full cursor-pointer"
        style={{ animationDelay: `${index * 0.06}s` }}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="badge badge-part2">{weekNum}주차</span>
            <span className="text-5xl font-black leading-none tabular-nums text-[rgba(99,120,255,0.2)]">
              {String(weekNum).padStart(2, "0")}
            </span>
          </div>

          {allMembers.length > 0 ? (
            <div className="flex items-center">
              {allMembers.slice(0, 5).map((name, i) => (
                <div
                  key={name}
                  title={name}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[#0a0e1a]"
                  style={{
                    background: MEMBER_COLOR_MAP.get(name) ?? "#94a3b8",
                    marginLeft: i > 0 ? -8 : 0,
                    zIndex: 10 - i,
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          {chapters.map((w) => (
            <div
              key={w.slug}
              className="flex items-start gap-2 text-xs text-slate-400"
            >
              <span className="text-[#6378ff] font-mono shrink-0 mt-0.5">
                {w.week}장
              </span>
              <span className="leading-relaxed">{w.chapterTitle}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs text-slate-600">
            {chapterRange} · {allMembers.length}명
          </span>
          <span className="text-xs text-[#6378ff]">보기 →</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const studyWeeks = getStudyWeeks();
  const totalChapters = studyWeeks.reduce(
    (acc, s) => acc + s.chapters.length,
    0,
  );
  const totalContributions = studyWeeks.reduce(
    (acc, s) => acc + s.chapters.reduce((a, w) => a + w.members.length, 0),
    0,
  );

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-[rgba(99,120,255,0.15)] bg-gradient-to-b from-[rgba(99,120,255,0.06)] to-transparent px-6 pt-16 pb-12 text-center">
        <div className="max-w-2xl mx-auto">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-5 no-underline"
          >
            <GitHubIcon />
            deep-inside-react-study
          </a>

          <div className="block badge badge-part2 mb-5">📚 북스터디</div>

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

          <div className="flex gap-4 justify-center mt-7 flex-wrap">
            {(
              [
                { value: studyWeeks.length, label: "주차", color: "#6378ff" },
                { value: totalChapters, label: "챕터", color: "#a78bfa" },
                { value: totalContributions, label: "기록", color: "#38bdf8" },
              ] as const
            ).map(({ value, label, color }) => (
              <div
                key={label}
                className="rounded-xl px-5 py-3 text-center border border-[rgba(99,120,255,0.15)] bg-[rgba(99,120,255,0.08)]"
              >
                <div className="text-2xl font-black" style={{ color }}>
                  {value}
                </div>
                <div className="text-xs text-slate-600">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {Object.entries(MEMBER_GITHUB).map(
              ([key, { displayName, github }]) => {
                const color = MEMBER_COLOR_MAP.get(key) ?? "#94a3b8";
                return (
                  <a
                    key={key}
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full no-underline transition-all duration-200 hover:scale-105"
                    style={{
                      background: `${color}18`,
                      border: `1px solid ${color}40`,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold text-white shrink-0"
                      style={{ background: color }}
                    >
                      {displayName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium" style={{ color }}>
                      {displayName}
                    </span>
                    <span className="opacity-40" style={{ color }}>
                      <GitHubIcon />
                    </span>
                  </a>
                );
              },
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {studyWeeks.map((week, i) => (
            <StudyWeekCard key={week.weekNum} studyWeek={week} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
