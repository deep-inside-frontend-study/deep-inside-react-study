import Link from "next/link";
import { StudyWeek } from "@/types";
import { MemberAvatar } from "@/components/member/MemberAvatar";
import { formatChapterRange } from "@/lib/formatChapterRange";

function deriveCardData(week: StudyWeek) {
  const members = [
    ...new Set(week.chapters.flatMap((w) => w.members.map((m) => m.member))),
  ];
  const chapNums = week.chapters.map((w) => w.week);
  const chapterRange = formatChapterRange(chapNums);
  return { members, chapNums, chapterRange };
}

// --- Sub-components ---

const MAX_VISIBLE_AVATARS = 4;

function Header({ weekNum, members }: { weekNum: number; members: string[] }) {
  const visible = members.slice(0, MAX_VISIBLE_AVATARS);
  const overflow = members.length - MAX_VISIBLE_AVATARS;

  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <span className="badge badge-part2">{weekNum}주차</span>
        <span className="text-5xl font-black leading-none tabular-nums text-[rgba(99,120,255,0.2)]">
          {String(weekNum).padStart(2, "0")}
        </span>
      </div>

      {members.length > 0 && (
        <div className="flex items-center">
          {visible.map((name, i) => (
            <MemberAvatar
              key={name}
              memberId={name}
              size="lg"
              style={{ zIndex: 10 - i }}
              className={`border-2 border-[#0a0e1a] ${i > 0 ? "-ml-2" : ""}`}
            />
          ))}
          {overflow > 0 && (
            <div className="w-8 h-8 -ml-2 rounded-full bg-[rgba(99,120,255,0.15)] border-2 border-[#0a0e1a] flex items-center justify-center text-[0.6rem] font-bold text-[#6378ff] z-0">
              +{overflow}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Body({ chapters }: { chapters: StudyWeek["chapters"] }) {
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

function Footer({
  chapterRange,
  memberCount,
}: {
  chapterRange: string;
  memberCount: number;
}) {
  return (
    <div className="mt-auto flex justify-between items-center">
      <span className="text-xs text-slate-600">
        {chapterRange} · {memberCount}명
      </span>
      <span className="text-xs text-[#6378ff]">보기 →</span>
    </div>
  );
}

// --- Root component ---

export interface StudyWeekCardProps {
  week: StudyWeek;
  index?: number;
}

export function StudyWeekCard({ week, index = 0 }: StudyWeekCardProps) {
  const { members, chapterRange } = deriveCardData(week);
  const chapters = week.chapters;

  return (
    <Link href={`/weeks/${week.weekNum}`} className="no-underline h-full">
      <div
        style={{ animationDelay: `${index * 60}ms` }}
        className="glass-card fade-in-up flex flex-col gap-4 p-6 h-full cursor-pointer hover:-translate-y-1 transition-transform duration-300"
      >
        <Header weekNum={week.weekNum} members={members} />
        <Body chapters={chapters} />
        <Footer chapterRange={chapterRange} memberCount={members.length} />
      </div>
    </Link>
  );
}
