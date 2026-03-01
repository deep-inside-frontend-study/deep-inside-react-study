import { cache } from "react";
import fs from "fs";
import path from "path";
import {
  FILE_TYPES,
  type MemberPost,
  type WeekData,
  type StudyWeek,
} from "./types";
import { CHAPTER_MAP, PART_MAP } from "@/constants";

export function getPart(week: number): string {
  return PART_MAP[week as keyof typeof PART_MAP] ?? "";
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
        chapterTitle: CHAPTER_MAP[c as keyof typeof CHAPTER_MAP] ?? `${c}장`,
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
