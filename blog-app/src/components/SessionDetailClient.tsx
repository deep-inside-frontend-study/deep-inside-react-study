"use client";

import { useState } from "react";
import { StudySession, WeekData, FileType } from "@/lib/getStudyData";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const FILE_META: Record<
  FileType,
  { icon: string; label: string; color: string; activeBg: string }
> = {
  summary: {
    icon: "📝",
    label: "Summary",
    color: "#6378ff",
    activeBg: "rgba(99,120,255,0.12)",
  },
  questions: {
    icon: "❓",
    label: "Questions",
    color: "#fbbf24",
    activeBg: "rgba(251,191,36,0.12)",
  },
  insights: {
    icon: "💡",
    label: "Insights",
    color: "#34d399",
    activeBg: "rgba(52,211,153,0.12)",
  },
};

// js-index-maps: Map으로 O(1) 조회
const MEMBER_COLOR_MAP = new Map<string, string>([
  ["hyunwoo", "#6378ff"],
  ["jisoo", "#a78bfa"],
  ["joohyung", "#38bdf8"],
  ["seungho", "#34d399"],
  ["hsy", "#fb7185"],
]);

const FILE_TYPES: FileType[] = ["summary", "questions", "insights"];

export default function SessionDetailClient({
  session,
}: {
  session: StudySession;
}) {
  const [activeWeek, setActiveWeek] = useState<WeekData>(session.weeks[0]);
  const [activeMember, setActiveMember] = useState(
    session.weeks[0]?.members[0]?.member ?? "",
  );
  const [activeFileType, setActiveFileType] = useState<FileType>("summary");

  // 챕터 변경 시 해당 챕터의 첫 멤버로 리셋
  function handleWeekChange(week: WeekData) {
    setActiveWeek(week);
    setActiveMember(week.members[0]?.member ?? "");
    setActiveFileType("summary");
  }

  // js-index-maps: member → files Map (O(1) 콘텐츠 조회)
  const memberFileMap = new Map(
    activeWeek.members.map((m) => [
      m.member,
      new Map(m.files.map((f) => [f.type, f.content])),
    ]),
  );
  const currentContent =
    memberFileMap.get(activeMember)?.get(activeFileType) ?? "";
  const currentMemberData = activeWeek.members.find(
    (m) => m.member === activeMember,
  );

  return (
    <div>
      {/* 챕터 탭 */}
      <div className="flex gap-2 flex-wrap mb-5">
        {session.weeks.map((w) => {
          const isActive = w.slug === activeWeek.slug;
          return (
            <button
              key={w.slug}
              onClick={() => handleWeekChange(w)}
              className="px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer"
              style={{
                border: `1.5px solid ${isActive ? "#6378ff" : "rgba(99,120,255,0.15)"}`,
                background: isActive ? "rgba(99,120,255,0.12)" : "transparent",
                color: isActive ? "#818cf8" : "#94a3b8",
                fontWeight: isActive ? 700 : 400,
                fontFamily: "inherit",
              }}
            >
              {w.week}장
            </button>
          );
        })}
      </div>

      {/* 챕터 제목 */}
      <p className="text-slate-400 text-sm mb-5 pl-1">
        {activeWeek.chapterTitle}
      </p>

      {/* 멤버 탭 */}
      <div className="flex gap-2 flex-wrap mb-5">
        {activeWeek.members.length > 0 ? (
          activeWeek.members.map((m) => {
            const isActive = m.member === activeMember;
            const color = MEMBER_COLOR_MAP.get(m.member) ?? "#94a3b8";
            return (
              <button
                key={m.member}
                onClick={() => setActiveMember(m.member)}
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
                  {m.member.charAt(0).toUpperCase()}
                </div>
                {m.member}
              </button>
            );
          })
        ) : (
          <p className="text-slate-600 text-sm pl-1">기록이 없습니다.</p>
        )}
      </div>

      {/* 파일 타입 탭 */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl border border-[rgba(99,120,255,0.15)] w-fit"
        style={{ background: "rgba(5,10,25,0.5)" }}
      >
        {FILE_TYPES.map((type) => {
          const meta = FILE_META[type];
          const isActive = type === activeFileType;
          const hasContent = currentMemberData?.files.some(
            (f) => f.type === type && f.content.trim(),
          );
          return (
            <button
              key={type}
              onClick={() => setActiveFileType(type)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[9px] text-sm transition-all duration-200 cursor-pointer"
              style={{
                border: "none",
                background: isActive ? meta.activeBg : "transparent",
                color: isActive ? meta.color : "#4a5568",
                fontWeight: isActive ? 700 : 400,
                opacity: hasContent ? 1 : 0.45,
                boxShadow: isActive ? `0 0 0 1px ${meta.color}40` : "none",
                fontFamily: "inherit",
              }}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* 콘텐츠 */}
      <div className="glass-card p-8 min-h-[300px]">
        <MarkdownRenderer content={currentContent} />
      </div>
    </div>
  );
}
