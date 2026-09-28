const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');

// スクレイピング結果のexport形式を、そのままCommonJSの管理コマンドから読む。
// データファイルを書き換えず、Node.jsのES Modules対応状況にも依存しない。
const filename = path.join(__dirname, '../src/constants/station_names_5_katakana.js');
const source = fs.readFileSync(filename, 'utf8');
const compiled = ts.transpileModule(source, {
  fileName: filename,
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
}).outputText;
const stationModule = new Module(filename, module);
stationModule.filename = filename;
stationModule.paths = Module._nodeModulePaths(path.dirname(filename));
stationModule._compile(compiled, filename);
module.exports = stationModule.exports;
