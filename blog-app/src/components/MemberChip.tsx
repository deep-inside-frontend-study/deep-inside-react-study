import { MEMBER_COLORS, DEFAULT_COLOR, MemberId } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";

interface MemberChipProps {
  memberId: string;
  displayName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

export function MemberChip({
  memberId,
  displayName,
  size = "md",
  className = "",
  style,
}: MemberChipProps) {
  const colors = MEMBER_COLORS[memberId as MemberId] ?? DEFAULT_COLOR;
  const name = displayName || memberId;
  return (
    <Avatar
      fallback={name}
      size={size}
      className={`${colors.base} text-white ${className}`}
      title={name}
      style={style}
    />
  );
}
