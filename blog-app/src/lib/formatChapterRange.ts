export function formatChapterRange(chapterNums: number[]): string {
  return chapterNums.length > 1
    ? `${chapterNums[0]}~${chapterNums[chapterNums.length - 1]}장`
    : `${chapterNums[0]}장`;
}
