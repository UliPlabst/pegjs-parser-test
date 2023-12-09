import * as fs from "fs";
import * as path from "path";
import { parseTestFile } from "./test";
import { debounced, generateParser } from "./util";

let outDir           = "./parser";
let grammar          = "./markdown.grammar.pegjs";
let testFile         = "./markdown.test.md";
let parserOutputFile = path.join(outDir, "parser.js");

if(!fs.existsSync(outDir))
  fs.mkdirSync(outDir);

var parser      = generateParser(grammar, parserOutputFile);
parseTestFile(testFile, parser, () => "");
// if(process.argv.indexOf("-s") < 0 && noPrint == false)
//   parseTestFile();

// var timeout = null;
// var cnt     = 0;

// fs.watch(nodesFile, (ev, fn) => {
//   if(timeout)
//     clearTimeout(timeout);
//   timeout = setTimeout(() => {
//     util.buildNodes();
//     util.generateParser();
//     parseTestFile();
//   }, 0);
// });
  
fs.watch(grammar, debounced(() => {
  parser = generateParser(grammar, parserOutputFile);
  parseTestFile(testFile, parser, () => "");
}, 300));
//   (ev, fn) => {
//     util.generateParser();
//     parseTestFile();
// });

fs.watch(testFile,debounced(() => {
  parseTestFile(testFile, parser, () => "");
}, 300));
