import { MEMBER_COLORS, DEFAULT_COLOR, MemberId } from "@/constants";

export function getMemberColors(memberId: string) {
  return MEMBER_COLORS[memberId as MemberId] ?? DEFAULT_COLOR;
}
