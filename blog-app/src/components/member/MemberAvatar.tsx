import { getMemberColors } from "@/lib/getMemberColors";
import { Avatar, AvatarProps } from "@/components/ui/Avatar";

interface MemberAvatarProps extends Omit<AvatarProps, "fallback"> {
  memberId: string;
  displayName?: string;
}

export function MemberAvatar({
  memberId,
  displayName,
  size = "md",
  className = "",
  ...props
}: MemberAvatarProps) {
  const colors = getMemberColors(memberId);
  const name = displayName || memberId;
  return (
    <Avatar
      fallback={name}
      size={size}
      className={`${colors.base} text-white ${className}`}
      title={name}
      {...props}
    />
  );
}
