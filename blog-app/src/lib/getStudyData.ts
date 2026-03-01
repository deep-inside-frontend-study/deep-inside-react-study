import { cache } from "react";
import fs from "fs";
import path from "path";

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

/** 3개 챕터씩 묶은 주차 단위 스터디 (ex: 1주차 = 1~3장) */
export interface StudyWeek {
  weekNum: number; // 1-based (1주차, 2주차...)
  chapters: WeekData[]; // 1~3개의 챕터 데이터
}

/** 3개 챕터씩 묶은 주차 단위 스터디 세션 */
export interface StudySession {
  sessionNum: number; // 1-based (1주차, 2주차...)
  weeks: WeekData[]; // 1~3개
}

// LIST.md에서 챕터 제목 파싱
const CHAPTER_MAP: Record<number, string> = {
  1: "프론트엔드 구성 요소와 발전 과정 돌아보기",
  2: "싱글 페이지 애플리케이션 돌아보기",
  3: "UI 컴포넌트의 위상 돌아보기",
  4: "상태와 반응성 돌아보기",
  5: "프론트엔드 구성 요소와 발전 과정 돌아보기",
  6: "JSX 구성 요소 돌아보기",
  7: "JSX 핵심 문법과 자바스크립트 변환 돌아보기",
  8: "리액트 재조정과 키 프롭스 돌아보기",
  9: "리액트 렌더링 규칙 돌아보기",
  10: "리액트의 프롭스와 컴포넌트 패턴 돌아보기",
  11: "리액트의 상태와 배칭 돌아보기",
  12: "리액트를 구성하는 뿌리, 파이버 돌아보기",
  13: "리액트 훅의 사용 규칙 돌아보기",
  14: "리액트 필수 훅 돌아보기",
  15: "리액트 메모이제이션 돌아보기",
  16: "리액트 컨텍스트와 에러 바운더리, 그리고 서스펜스 돌아보기",
  17: "리액트 동시성 기능과 심화 훅 돌아보기",
  18: "리액트 렌더링 패턴 돌아보기",
  19: "Next.js 앱 라우터와 서버 액션, 그리고 새로운 리액트 훅 돌아보기",
};

const PART_MAP: Record<number, string> = {
  1: "PART 1",
  2: "PART 1",
  3: "PART 1",
  4: "PART 1",
  5: "PART 1",
  6: "PART 2",
  7: "PART 2",
  8: "PART 2",
  9: "PART 2",
  10: "PART 2",
  11: "PART 2",
  12: "PART 2",
  13: "PART 3",
  14: "PART 3",
  15: "PART 3",
  16: "PART 3",
  17: "PART 3",
  18: "PART 4",
  19: "PART 4",
};

export function getPart(week: number): string {
  return PART_MAP[week] ?? "";
}

const WEEKS_DIR = path.join(process.cwd(), "..", "weeks");

function readFileSafe(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

// server-cache-react: React.cache()로 per-request 중복 파일 I/O 제거
export const getAllWeeks = cache(function getAllWeeksImpl(): WeekData[] {
  const weeksDir = WEEKS_DIR;
  const weekFolders = fs
    .readdirSync(weeksDir)
    .filter((name) => name.startsWith("week"))
    .sort();

  return weekFolders.map((folder) => {
    const weekNum = parseInt(folder.replace("week", ""), 10);
    const weekPath = path.join(weeksDir, folder);

    const entries = fs.readdirSync(weekPath);
    const memberFolders = entries.filter((entry) => {
      const stat = fs.statSync(path.join(weekPath, entry));
      return stat.isDirectory();
    });

    const members: MemberPost[] = memberFolders.map((member) => {
      const memberPath = path.join(weekPath, member);
      const files = FILE_TYPES.map((type) => ({
        type,
        content: readFileSafe(path.join(memberPath, `${type}.md`)),
      })).filter((f) => f.content.length > 0);
      return { member, files };
    });

    return {
      week: weekNum,
      slug: folder,
      chapterTitle: CHAPTER_MAP[weekNum] ?? `Week ${weekNum}`,
      members,
    };
  });
});

// server-cache-react: slug lookup도 cache로 감쌈
export const getWeekData = cache(function getWeekDataImpl(
  slug: string,
): WeekData | null {
  const weeks = getAllWeeks();
  return weeks.find((w) => w.slug === slug) ?? null;
});

export function getWeekSlugs(): string[] {
  const weeksDir = WEEKS_DIR;
  return fs
    .readdirSync(weeksDir)
    .filter((name) => name.startsWith("week"))
    .sort();
}

/**
 * 챕터(week 모듈)를 3개씩 묶어 주차별 스터디(StudyWeek)로 반환
 * e.g. [챕터1, 챕터2, 챕터3] → 1주차, [챕터4,...] → 2주차
 */
export const getStudyWeeks = cache(function getStudyWeeksImpl(): StudyWeek[] {
  const chapters = getAllWeeks();
  const studyWeeks: StudyWeek[] = [];
  const CHAPTERS_PER_WEEK = 3;

  for (let i = 0; i < chapters.length; i += CHAPTERS_PER_WEEK) {
    studyWeeks.push({
      weekNum: Math.floor(i / CHAPTERS_PER_WEEK) + 1,
      chapters: chapters.slice(i, i + CHAPTERS_PER_WEEK),
    });
  }
  return studyWeeks;
});

export const getStudyWeekData = cache(function getStudyWeekDataImpl(
  weekNum: number,
): StudyWeek | null {
  return getStudyWeeks().find((s) => s.weekNum === weekNum) ?? null;
});
