import { MemberAvatar } from "./MemberAvatar";
import { MEMBER_COLORS, DEFAULT_COLOR, MemberId } from "@/constants";

interface MemberSelectChipProps {
  memberId: string;
  isActive: boolean;
  onClick: () => void;
}

export function MemberSelectChip({
  memberId,
  isActive,
  onClick,
}: MemberSelectChipProps) {
  const colors = MEMBER_COLORS[memberId as MemberId] ?? DEFAULT_COLOR;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 cursor-pointer border-[1.5px] ${
        isActive
          ? `${colors.activeBg} ${colors.activeBorder} ${colors.activeText} font-bold`
          : "bg-transparent border-[rgba(99,120,255,0.15)] text-slate-400 font-normal"
      }`}
    >
      <MemberAvatar memberId={memberId} size="md" />
      {memberId}
    </button>
  );
}
