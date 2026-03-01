export const FILE_TYPES = ["summary", "questions", "insights"] as const;
export type FileType = (typeof FILE_TYPES)[number];

export interface MemberPost {
  member: string;
  files: {
    type: FileType;
    content: string;
  }[];
}

export interface WeekData {
  week: number;
  slug: string;
  chapterTitle: string;
  members: MemberPost[];
}

export interface StudyWeek {
  weekNum: number;
  chapters: WeekData[];
}
