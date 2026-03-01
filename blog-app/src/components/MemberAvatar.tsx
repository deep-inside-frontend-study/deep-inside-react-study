import { MEMBER_COLORS, DEFAULT_COLOR, MemberId } from "@/constants";
import { Avatar } from "@/components/ui/Avatar";

interface MemberAvatarProps {
  memberId: string;
  displayName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

export function MemberAvatar({
  memberId,
  displayName,
  size = "md",
  className = "",
  style,
}: MemberAvatarProps) {
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
