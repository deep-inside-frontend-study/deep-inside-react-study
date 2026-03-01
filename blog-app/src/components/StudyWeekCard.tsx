import Link from "next/link";
import { StudyWeek } from "@/lib/types";
import { MemberAvatar } from "./MemberAvatar";

export function StudyWeekCard({
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
    <Link href={`/weeks/${weekNum}`} className="no-underline h-full">
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
