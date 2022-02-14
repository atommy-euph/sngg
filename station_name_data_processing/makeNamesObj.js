import * as fs from "fs";
import { NAMES } from "./names.js";

function findLongWord(s) {
  return Math.max(...s.map((s) => s.length));
}
function findShortWord(s) {
  return Math.min(...s.map((s) => s.length));
}
const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

var min = findShortWord(NAMES);
var max = findLongWord(NAMES);

//文字数ごとに分ける
let names_classed = Object();
for (let i = min; i < max + 1; i++) {
  let word_list = NAMES.filter((item) => item.length === i);
  names_classed[i] = shuffle(word_list);
}

// データ数を確認
let counter = 0;
for (let i = min; i < max + 1; i++) {
  counter += names_classed[i].length;
}
console.log(counter);

let jsonData = JSON.stringify(names_classed);
fs.writeFile("station_names.json", jsonData, (err) => {
  if (err) throw err;
  console.log("正常に書き込みが完了しました");
});
// let jsonData = JSON.stringify(names_classed);
// fs.writeFile("names_classed.json", jsonData, (err) => {
//   if (err) throw err;
//   console.log("正常に書き込みが完了しました");
// });
