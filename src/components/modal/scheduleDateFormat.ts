/** 表示用の整形。出題計算ではISO日付を維持する。 */
export const formatShuffleDate = (date: string): string => date.replace(/-/g, '/');
export const formatReferenceDate = (date: string): string => {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}年${month}月${day}日`;
};
