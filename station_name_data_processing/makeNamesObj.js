import * as fs from "fs";
import { NAMES } from "./names.js";

function findLongWord(s) {
  return Math.max(...s.map((s) => s.length));
}
function findShortWord(s) {
  return Math.min(...s.map((s) => s.length));
}

var min = findShortWord(NAMES);
var max = findLongWord(NAMES);

//文字数ごとに分ける
let names_classed = Object();
for (let i = min; i < max + 1; i++) {
  let word_list = NAMES.filter((item) => item.length === i);
  names_classed[i] = word_list;
}

// // データ数を確認
// let counter = 0;
// for (let i = min; i < max + 1; i++) {
//   counter += names_classed[i].length;
// }

let jsonData = JSON.stringify(names_classed);
fs.writeFile("names_classed.json", jsonData, (err) => {
  if (err) throw err;
  console.log("正常に書き込みが完了しました");
});
