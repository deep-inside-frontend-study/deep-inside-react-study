import { cache } from "react";
import fs from "fs";
import path from "path";
import {
  FILE_TYPES,
  type MemberPost,
  type WeekData,
  type StudyWeek,
} from "./types";

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

/**
 * weeks 폴더 구조를 그대로 따르되,
 * 1주차 = week01 폴더 = 1~3장
 * 2주차 = week02 폴더 = 4~6장
 * ...
 * 와 같이 매핑합니다. 내용이 있는 주차만 반환합니다.
 */
export const getStudyWeeks = cache(function getStudyWeeksImpl(): StudyWeek[] {
  const weeksDir = WEEKS_DIR;
  // 존재하는 week 폴더들 찾기
  const weekFolders = fs
    .readdirSync(weeksDir)
    .filter((name) => name.startsWith("week"))
    .sort();

  const studyWeeks: StudyWeek[] = [];

  for (const folder of weekFolders) {
    const weekNum = parseInt(folder.replace("week", ""), 10);
    const weekPath = path.join(weeksDir, folder);

    // 해당 폴더의 멤버 파싱
    let members: MemberPost[] = [];
    if (fs.existsSync(weekPath)) {
      const entries = fs.readdirSync(weekPath);
      const memberFolders = entries.filter((entry) => {
        const stat = fs.statSync(path.join(weekPath, entry));
        return stat.isDirectory();
      });

      members = memberFolders
        .map((member) => {
          const memberPath = path.join(weekPath, member);
          const files = FILE_TYPES.map((type) => ({
            type,
            content: readFileSafe(path.join(memberPath, `${type}.md`)),
          })).filter((f) => f.content.length > 0);
          return { member, files };
        })
        .filter((m) => m.files.length > 0);
    }

    // 작성된 내용이 없는(멤버가 0명인) 템플릿 주차는 표기하지 않음
    if (members.length === 0) continue;

    const startChapter = (weekNum - 1) * 3 + 1;
    const endChapter = Math.min(weekNum * 3, 19);

    if (startChapter > 19) continue;

    const chapters: WeekData[] = [];
    for (let c = startChapter; c <= endChapter; c++) {
      chapters.push({
        week: c,
        slug: folder,
        chapterTitle: CHAPTER_MAP[c] ?? `${c}장`,
        members, // 전체 멤버를 동일하게 넣어줌
      });
    }

    studyWeeks.push({
      weekNum,
      chapters,
    });
  }

  return studyWeeks;
});

export const getStudyWeekData = cache(function getStudyWeekDataImpl(
  weekNum: number,
): StudyWeek | null {
  return getStudyWeeks().find((s) => s.weekNum === weekNum) ?? null;
});

export const getReadmeContent = cache(function getReadmeContentImpl(): string {
  const readmePath = path.join(process.cwd(), "..", "README.md");
  return readFileSafe(readmePath);
});
