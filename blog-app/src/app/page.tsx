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

        <details className="study-intro-disclosure fade-in-up mb-10">
          <summary className="study-intro-summary">
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="badge badge-part2">About Study</span>
                <span className="text-xs text-slate-500">
                  스터디 방식, 정리 기준, 저장소 구조
                </span>
              </div>
              <div className="mt-3">
                <h2 className="text-xl sm:text-2xl font-bold">
                  스터디 소개 펼쳐보기
                </h2>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  README 전체 내용을 접어두고, 필요할 때만 열어보는 형태로
                  정리했습니다.
                </p>
              </div>
            </div>

            <div className="study-intro-toggle">
              <span className="study-intro-toggle-label study-intro-toggle-label-closed">
                열기
              </span>
              <span className="study-intro-toggle-label study-intro-toggle-label-open">
                닫기
              </span>
              <span className="study-intro-toggle-icon" aria-hidden="true">
                +
              </span>
            </div>
          </summary>

          <div className="study-intro-body">
            <MarkdownRenderer content={readmeContent} />
          </div>
        </details>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {studyWeeks.map((week, i) => (
            <StudyWeekCard key={week.weekNum} week={week} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
