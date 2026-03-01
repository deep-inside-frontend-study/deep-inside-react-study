import React, { ReactNode } from "react";
import Link from "next/link";
import { MemberAvatar } from "./MemberAvatar";

// --- Compound Components ---

export interface StudyWeekCardRootProps {
  weekNum: number;
  index?: number;
  children: ReactNode;
}

function StudyWeekCardRoot({
  weekNum,
  index = 0,
  children,
}: StudyWeekCardRootProps) {
  return (
    <Link href={`/weeks/${weekNum}`} className="no-underline h-full">
      <div
        className="glass-card fade-in-up flex flex-col gap-4 p-6 h-full cursor-pointer"
        style={{ animationDelay: `${index * 0.06}s` }}
      >
        {children}
      </div>
    </Link>
  );
}

export interface StudyWeekCardHeaderProps {
  weekNum: number;
  members: string[];
}

function StudyWeekCardHeader({ weekNum, members }: StudyWeekCardHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <span className="badge badge-part2">{weekNum}주차</span>
        <span className="text-5xl font-black leading-none tabular-nums text-[rgba(99,120,255,0.2)]">
          {String(weekNum).padStart(2, "0")}
        </span>
      </div>

      {members.length > 0 ? (
        <div className="flex items-center">
          {members.slice(0, 5).map((name, i) => (
            <MemberAvatar
              key={name}
              memberId={name}
              size="lg"
              className="border-2 border-[#0a0e1a]"
              style={{
                marginLeft: i > 0 ? -8 : 0,
                zIndex: 10 - i,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export interface StudyWeekCardBodyProps {
  chapters: { week: number; chapterTitle: string }[];
}

function StudyWeekCardBody({ chapters }: StudyWeekCardBodyProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {chapters.map((w) => (
        <div
          key={w.week}
          className="flex items-start gap-2 text-xs text-slate-400"
        >
          <span className="text-[#6378ff] font-mono shrink-0 mt-0.5">
            {w.week}장
          </span>
          <span className="leading-relaxed">{w.chapterTitle}</span>
        </div>
      ))}
    </div>
  );
}

export interface StudyWeekCardFooterProps {
  chapterRange: string;
  memberCount: number;
}

function StudyWeekCardFooter({
  chapterRange,
  memberCount,
}: StudyWeekCardFooterProps) {
  return (
    <div className="mt-auto flex justify-between items-center">
      <span className="text-xs text-slate-600">
        {chapterRange} · {memberCount}명
      </span>
      <span className="text-xs text-[#6378ff]">보기 →</span>
    </div>
  );
}

export const StudyWeekCard = Object.assign(StudyWeekCardRoot, {
  Header: StudyWeekCardHeader,
  Body: StudyWeekCardBody,
  Footer: StudyWeekCardFooter,
});
