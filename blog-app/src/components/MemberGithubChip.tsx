import { MemberChip } from "./MemberChip";
import { Chip } from "@/components/ui/Chip";
import { GitHubIcon } from "@/assets/icons/GitHubIcon";
import {
  MEMBER_COLORS,
  DEFAULT_COLOR,
  MEMBER_GITHUB,
  MemberId,
} from "@/lib/constants";

interface MemberGithubChipProps {
  memberId: string;
}

export function MemberGithubChip({ memberId }: MemberGithubChipProps) {
  const colors = MEMBER_COLORS[memberId as MemberId] ?? DEFAULT_COLOR;
  const githubInfo = MEMBER_GITHUB[memberId as MemberId];

  if (!githubInfo) return null;
  const { displayName, github } = githubInfo;

  return (
    <Chip
      as="a"
      href={github}
      target="_blank"
      rel="noopener noreferrer"
      className={`border no-underline hover:scale-105 ${colors.bgSoft} ${colors.borderSoft}`}
      startContent={
        <MemberChip memberId={memberId} displayName={displayName} size="sm" />
      }
      endContent={<GitHubIcon className={`opacity-40 ${colors.text}`} />}
    >
      <span className={`text-xs font-medium ${colors.text}`}>
        {displayName}
      </span>
    </Chip>
  );
}
