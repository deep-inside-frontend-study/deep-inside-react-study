"use client";

import { useState } from "react";
import { StudyWeek, FileType, FILE_TYPES } from "@/lib/getStudyData";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const FILE_META: Record<
  FileType,
  { icon: string; label: string; activeClass: string }
> = {
  summary: {
    icon: "📝",
    label: "Summary",
    activeClass:
      "bg-[rgba(99,120,255,0.12)] text-[#818cf8] shadow-[0_0_0_1px_rgba(99,120,255,0.25)]",
  },
  questions: {
    icon: "❓",
    label: "Questions",
    activeClass:
      "bg-[rgba(251,191,36,0.12)] text-[#fbbf24] shadow-[0_0_0_1px_rgba(251,191,36,0.25)]",
  },
  insights: {
    icon: "💡",
    label: "Insights",
    activeClass:
      "bg-[rgba(52,211,153,0.12)] text-[#34d399] shadow-[0_0_0_1px_rgba(52,211,153,0.25)]",
  },
};

const MEMBER_COLOR_MAP = new Map<string, string>([
  ["hyunwoo", "#6378ff"],
  ["jisoo", "#a78bfa"],
  ["joohyung", "#38bdf8"],
  ["seungho", "#34d399"],
  ["hsy", "#fb7185"],
]);

export default function WeekDetailClient({
  studyWeek,
}: {
  studyWeek: StudyWeek;
}) {
  const allMembers = Array.from(
    new Set(studyWeek.chapters.flatMap((w) => w.members.map((m) => m.member))),
  );

  const [activeMember, setActiveMember] = useState(allMembers[0] ?? "");
  const [activeFileType, setActiveFileType] = useState<FileType>("summary");

  // 3개 챕터 분량의 데이터를 하나로 합칩니다 (챕터 탭 없이 한 번에 표시하기 위함)
  const currentContent = studyWeek.chapters
    .map((chapter) => {
      const memberData = chapter.members.find((m) => m.member === activeMember);
      const fileContent = memberData?.files.find(
        (f) => f.type === activeFileType,
      )?.content;
      if (!fileContent) return null;

      return `## ${chapter.week}장: ${chapter.chapterTitle}\n\n${fileContent}`;
    })
    .filter(Boolean)
    .join("\n\n---\n\n");

  // 해당 멤버가 현재 파일 타입에 대해 쓴 내용이 존재하는지 확인 (모든 챕터 통합)
  const hasContentFn = (type: FileType) =>
    studyWeek.chapters.some((chapter) =>
      chapter.members
        .find((m) => m.member === activeMember)
        ?.files.some((f) => f.type === type && f.content.trim()),
    );

  return (
    <div>
      {/* ── 멤버 탭 ── */}
      <div className="flex gap-2 flex-wrap mb-5">
        {allMembers.length > 0 ? (
          allMembers.map((member) => {
            const isActive = member === activeMember;
            const color = MEMBER_COLOR_MAP.get(member) ?? "#94a3b8";
            return (
              <button
                key={member}
                onClick={() => setActiveMember(member)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer"
                style={{
                  border: `1.5px solid ${isActive ? color : "rgba(99,120,255,0.15)"}`,
                  background: isActive ? `${color}20` : "transparent",
                  color: isActive ? color : "#94a3b8",
                  fontWeight: isActive ? 700 : 400,
                  fontFamily: "inherit",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-bold text-white shrink-0"
                  style={{ background: color }}
                >
                  {member.charAt(0).toUpperCase()}
                </div>
                {member}
              </button>
            );
          })
        ) : (
          <p className="text-slate-600 text-sm pl-1">기록이 없습니다.</p>
        )}
      </div>

      {/* ── 파일 타입 탭 ── */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl border border-[rgba(99,120,255,0.15)] bg-[rgba(5,10,25,0.5)] w-fit">
        {FILE_TYPES.map((type) => {
          const meta = FILE_META[type];
          const isActive = type === activeFileType;
          const hasContent = hasContentFn(type);

          return (
            <button
              key={type}
              onClick={() => setActiveFileType(type)}
              className={[
                "flex items-center gap-1.5 px-4 py-2 rounded-[9px] text-sm transition-all duration-200 cursor-pointer border-0",
                isActive ? meta.activeClass : "bg-transparent text-slate-600",
                !hasContent ? "opacity-45" : "",
              ].join(" ")}
              style={{
                fontFamily: "inherit",
                fontWeight: isActive ? 700 : 400,
              }}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 콘텐츠 ── */}
      <div className="glass-card p-8 min-h-[300px]">
        {currentContent ? (
          <MarkdownRenderer content={currentContent} />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 py-12 gap-3 h-full">
            <span className="text-3xl">📝</span>
            <p className="text-sm">
              현재 선택된 항목에 작성된 내용이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
