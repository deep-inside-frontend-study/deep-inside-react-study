export const MEMBER_COLORS = {
  hyunwoo: {
    base: "bg-[#6378ff]",
    bgSoft: "bg-[#6378ff]/10",
    borderSoft: "border-[#6378ff]/25",
    text: "text-[#6378ff]",
    activeBg: "bg-[#6378ff]/20",
    activeBorder: "border-[#6378ff]",
    activeText: "text-[#6378ff]",
  },
  jisoo: {
    base: "bg-[#a78bfa]",
    bgSoft: "bg-[#a78bfa]/10",
    borderSoft: "border-[#a78bfa]/25",
    text: "text-[#a78bfa]",
    activeBg: "bg-[#a78bfa]/20",
    activeBorder: "border-[#a78bfa]",
    activeText: "text-[#a78bfa]",
  },
  joohyung: {
    base: "bg-[#38bdf8]",
    bgSoft: "bg-[#38bdf8]/10",
    borderSoft: "border-[#38bdf8]/25",
    text: "text-[#38bdf8]",
    activeBg: "bg-[#38bdf8]/20",
    activeBorder: "border-[#38bdf8]",
    activeText: "text-[#38bdf8]",
  },
  seungho: {
    base: "bg-[#34d399]",
    bgSoft: "bg-[#34d399]/10",
    borderSoft: "border-[#34d399]/25",
    text: "text-[#34d399]",
    activeBg: "bg-[#34d399]/20",
    activeBorder: "border-[#34d399]",
    activeText: "text-[#34d399]",
  },
  hsy: {
    base: "bg-[#fb7185]",
    bgSoft: "bg-[#fb7185]/10",
    borderSoft: "border-[#fb7185]/25",
    text: "text-[#fb7185]",
    activeBg: "bg-[#fb7185]/20",
    activeBorder: "border-[#fb7185]",
    activeText: "text-[#fb7185]",
  },
} as const;

export type MemberId = keyof typeof MEMBER_COLORS;

export const DEFAULT_COLOR = {
  base: "bg-slate-400",
  bgSoft: "bg-slate-400/10",
  borderSoft: "border-slate-400/25",
  text: "text-slate-400",
  activeBg: "bg-slate-400/20",
  activeBorder: "border-slate-400",
  activeText: "text-slate-400",
};

export const MEMBER_GITHUB = {
  hyunwoo: { displayName: "Hyunwoo", github: "https://github.com/gusdn3477" },
  jisoo: { displayName: "Jisoo", github: "https://github.com/kelly6226" },
  joohyung: { displayName: "Joohyung", github: "https://github.com/22JH" },
  seungho: { displayName: "Seungho", github: "https://github.com/NoelYoon96" },
  hsy: { displayName: "HSY", github: "https://github.com/dev-redo" },
} as const;

export const REPO_URL =
  "https://github.com/deep-inside-frontend-study/deep-inside-react-study";
