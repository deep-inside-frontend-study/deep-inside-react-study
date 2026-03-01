"use client";

import { useState } from "react";
import { WeekData, FileType } from "@/lib/getStudyData";
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

const MEMBER_COLORS: Record<string, string> = {
  hyunwoo: "#6378ff",
  jisoo: "#a78bfa",
  joohyung: "#38bdf8",
  seungho: "#34d399",
  hsy: "#fb7185",
};

const FILE_TYPES: FileType[] = ["summary", "questions", "insights"];

function getMemberColor(name: string) {
  return MEMBER_COLORS[name] ?? "#94a3b8";
}

export default function WeekDetailClient({ week }: { week: WeekData }) {
  const [activeMember, setActiveMember] = useState(
    week.members[0]?.member ?? "",
  );
  const [activeFileType, setActiveFileType] = useState<FileType>("summary");

  const currentMemberData = week.members.find((m) => m.member === activeMember);
  const currentFile = currentMemberData?.files.find(
    (f) => f.type === activeFileType,
  );

  return (
    <div>
      {/* Member Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {week.members.map((m) => {
          const isActive = m.member === activeMember;
          const color = getMemberColor(m.member);
          return (
            <button
              key={m.member}
              onClick={() => setActiveMember(m.member)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                border: `1.5px solid ${isActive ? color : "rgba(99,120,255,0.15)"}`,
                background: isActive ? `${color}20` : "transparent",
                color: isActive ? color : "#94a3b8",
                fontWeight: isActive ? 700 : 400,
                fontFamily: "inherit",
              }}
            >
              {/* Avatar */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-bold text-white shrink-0"
                style={{ background: color }}
              >
                {m.member.charAt(0).toUpperCase()}
              </div>
              {m.member}
            </button>
          );
        })}
      </div>

      {/* File Type Tabs */}
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

      {/* Content */}
      <div className="glass-card p-8 min-h-[300px]">
        <MarkdownRenderer content={currentFile?.content ?? ""} />
      </div>
    </div>
  );
}
