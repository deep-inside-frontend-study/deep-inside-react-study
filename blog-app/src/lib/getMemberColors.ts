import { MEMBER_COLORS, DEFAULT_COLOR, MemberId } from "@/constants/members";

export function getMemberColors(memberId: string) {
  return MEMBER_COLORS[memberId as MemberId] ?? DEFAULT_COLOR;
}
