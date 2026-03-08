import { getStudyWeeks, getReadmeContent } from "@/lib/getStudyData";
import { getStudyStats } from "./_lib/getStudyStats";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { StudyWeekCard } from "@/components/StudyWeekCard";
import { MetricCard } from "@/components/ui/MetricCard";
import { REPO_URL } from "@/constants/config";
import { GitHubIcon } from "@/assets/icons/GitHubIcon";
import { MemberGithubChip } from "@/components/member/MemberGithubChip";
import { PwaQuickActions } from "@/components/pwa/PwaQuickActions";

export default function HomePage() {
  const studyWeeks = getStudyWeeks();
  const readmeContent = getReadmeContent();
  const { totalWeeks, totalChapters, totalContributions } =
    getStudyStats(studyWeeks);

  const stats = [
    { value: totalWeeks, label: "주차", textClass: "text-[#6378ff]" },
    { value: totalChapters, label: "챕터", textClass: "text-[#a78bfa]" },
    { value: totalContributions, label: "기록", textClass: "text-[#38bdf8]" },
  ];

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
            {stats.map(({ value, label, textClass }) => (
              <MetricCard
                key={label}
                value={<span className={textClass}>{value}</span>}
                label={label}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {["hyunwoo", "jisoo", "joohyung", "seungho", "hsy"].map(
              (memberId) => (
                <MemberGithubChip key={memberId} memberId={memberId} />
              ),
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 pb-16">
        <PwaQuickActions />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {studyWeeks.map((week, i) => (
            <StudyWeekCard key={week.weekNum} week={week} index={i} />
          ))}
        </div>

        {/* README Section */}
        <div className="mt-16 fade-in-up delay-500">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold">About Study</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[rgba(99,120,255,0.2)] to-transparent" />
          </div>
          <div className="glass-card p-8 sm:p-12 overflow-hidden">
            <MarkdownRenderer content={readmeContent} />
          </div>
        </div>
      </div>
    </main>
  );
}
