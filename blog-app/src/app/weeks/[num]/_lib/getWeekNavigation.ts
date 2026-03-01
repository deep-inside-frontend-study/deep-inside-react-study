import { StudyWeek } from "@/lib/types";

export function getWeekNavigation(
  studyWeeks: StudyWeek[],
  currentWeekNum: number,
) {
  const currentIdx = studyWeeks.findIndex((s) => s.weekNum === currentWeekNum);
  if (currentIdx === -1) return { prevWeek: null, nextWeek: null };

  const prevWeek = currentIdx > 0 ? studyWeeks[currentIdx - 1] : null;
  const nextWeek =
    currentIdx < studyWeeks.length - 1 ? studyWeeks[currentIdx + 1] : null;

  return { prevWeek, nextWeek };
}
