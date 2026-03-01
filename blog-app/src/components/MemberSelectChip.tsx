import { MemberChip } from "./MemberChip";
import { Chip } from "@/components/ui/Chip";
import { MEMBER_COLORS, DEFAULT_COLOR, MemberId } from "@/lib/constants";

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
    <Chip
      as="button"
      onClick={onClick}
      className={`border-[1.5px] cursor-pointer px-4 py-2 text-sm ${
        isActive
          ? `${colors.activeBg} ${colors.activeBorder} ${colors.activeText} font-bold`
          : "bg-transparent border-[rgba(99,120,255,0.15)] text-slate-400 font-normal"
      }`}
      startContent={<MemberChip memberId={memberId} size="md" />}
    >
      {memberId}
    </Chip>
  );
}
