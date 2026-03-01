import { StudyWeek } from "@/types";

export function getStudyStats(studyWeeks: StudyWeek[]) {
  const totalChapters = studyWeeks.reduce(
    (acc, s) => acc + s.chapters.length,
    0,
  );

  const totalContributions = studyWeeks.reduce(
    (acc, s) => acc + s.chapters.reduce((a, w) => a + w.members.length, 0),
    0,
  );

  return {
    totalWeeks: studyWeeks.length,
    totalChapters,
    totalContributions,
  };
}
