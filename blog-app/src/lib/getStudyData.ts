import { cache } from "react";
import fs from "fs";
import path from "path";
import {
  FILE_TYPES,
  type MemberPost,
  type WeekData,
  type StudyWeek,
} from "@/types";
import { CHAPTER_MAP, STUDY_WEEK_CHAPTERS } from "@/constants/study";

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
 * 주차별 챕터 수가 항상 동일하지 않으므로
 * 명시적으로 정의한 매핑을 기준으로 챕터를 연결합니다.
 * 내용이 있는 주차만 반환합니다.
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

    const chapterNums =
      STUDY_WEEK_CHAPTERS[weekNum as keyof typeof STUDY_WEEK_CHAPTERS];
    if (!chapterNums) continue;

    const chapters: WeekData[] = chapterNums.map((chapterNum) => ({
      week: chapterNum,
      chapterTitle:
        CHAPTER_MAP[chapterNum as keyof typeof CHAPTER_MAP] ??
        `${chapterNum}장`,
      members, // 전체 멤버를 동일하게 넣어줌
    }));

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
