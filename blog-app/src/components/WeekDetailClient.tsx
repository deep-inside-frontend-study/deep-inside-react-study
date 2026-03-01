"use client";

import { useState } from "react";
import { StudyWeek, FileType, FILE_TYPES } from "@/lib/types";
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

const MEMBER_COLORS: Record<
  string,
  { base: string; activeBg: string; activeBorder: string; activeText: string }
> = {
  hyunwoo: {
    base: "bg-[#6378ff]",
    activeBg: "bg-[#6378ff]/20",
    activeBorder: "border-[#6378ff]",
    activeText: "text-[#6378ff]",
  },
  jisoo: {
    base: "bg-[#a78bfa]",
    activeBg: "bg-[#a78bfa]/20",
    activeBorder: "border-[#a78bfa]",
    activeText: "text-[#a78bfa]",
  },
  joohyung: {
    base: "bg-[#38bdf8]",
    activeBg: "bg-[#38bdf8]/20",
    activeBorder: "border-[#38bdf8]",
    activeText: "text-[#38bdf8]",
  },
  seungho: {
    base: "bg-[#34d399]",
    activeBg: "bg-[#34d399]/20",
    activeBorder: "border-[#34d399]",
    activeText: "text-[#34d399]",
  },
  hsy: {
    base: "bg-[#fb7185]",
    activeBg: "bg-[#fb7185]/20",
    activeBorder: "border-[#fb7185]",
    activeText: "text-[#fb7185]",
  },
};
const DEFAULT_COLOR = {
  base: "bg-slate-400",
  activeBg: "bg-slate-400/20",
  activeBorder: "border-slate-400",
  activeText: "text-slate-400",
};

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

  // 동일한 주차 폴더의 파일 내용이 각 챕터에 중복으로 들어있으므로 Set을 이용해 제거
  const uniqueContents = new Set<string>();
  studyWeek.chapters.forEach((chapter) => {
    const memberData = chapter.members.find((m) => m.member === activeMember);
    const fileContent = memberData?.files.find(
      (f) => f.type === activeFileType,
    )?.content;
    if (fileContent) {
      uniqueContents.add(fileContent);
    }
  });

  const currentContent = Array.from(uniqueContents).join("\n\n---\n\n");

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
            const colors = MEMBER_COLORS[member] ?? DEFAULT_COLOR;
            return (
              <button
                key={member}
                onClick={() => setActiveMember(member)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer border-[1.5px] ${
                  isActive
                    ? `${colors.activeBg} ${colors.activeBorder} ${colors.activeText} font-bold`
                    : "bg-transparent border-[rgba(99,120,255,0.15)] text-slate-400 font-normal"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-bold text-white shrink-0 ${colors.base}`}
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
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[9px] text-sm transition-all duration-200 cursor-pointer border-0 ${
                isActive
                  ? `${meta.activeClass} font-bold`
                  : "bg-transparent text-slate-600 font-normal"
              } ${!hasContent ? "opacity-45" : ""}`}
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
