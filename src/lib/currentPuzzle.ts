// schedule.jsonはschedule:updateの生成物。駅データの正本を編集し、JSONは手編集しない。
import config from '../constants/schedule.json';
import { readSchedule } from './scheduleValidation';
import { createPuzzleSnapshot } from './puzzleSnapshot';

// ページ読込時に一度だけ確定する。日付が変わっても問題と駅データをまとめて維持する。
export const currentPuzzle = createPuzzleSnapshot(readSchedule(config), new Date());
