import { MemberAvatar } from "./MemberAvatar";
import { GitHubIcon } from "@/assets/icons/GitHubIcon";
import { getMemberColors } from "@/lib/getMemberColors";
import { MEMBER_GITHUB, MemberId } from "@/constants";

interface MemberGithubChipProps {
  memberId: string;
}

export function MemberGithubChip({ memberId }: MemberGithubChipProps) {
  const colors = getMemberColors(memberId);
  const githubInfo = MEMBER_GITHUB[memberId as MemberId];

  if (!githubInfo) return null;
  const { displayName, github } = githubInfo;

  return (
    <a
      href={github}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${displayName}의 GitHub 프로필`}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full no-underline transition-all duration-200 hover:scale-105 border ${colors.bgSoft} ${colors.borderSoft}`}
    >
      <MemberAvatar memberId={memberId} displayName={displayName} size="sm" />
      <span className={`text-xs font-medium ${colors.text}`}>
        {displayName}
      </span>
      <GitHubIcon className={`opacity-40 ${colors.text}`} />
    </a>
  );
}
