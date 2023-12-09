import * as fs from "fs";
import * as ts from "typescript";
import * as peg from "pegjs";
import * as path from "path";
import * as chalk from "chalk";

function unloadModule(moduleName) 
{
  let solvedName = require.resolve(moduleName);
  let nodeModule = require.cache[solvedName];
  if (nodeModule) 
  {
    for (let n of nodeModule.children)
    {
      unloadModule(n.filename);
    }
    delete require.cache[solvedName];
  }
}

function reloadModule(moduleName)
{
  unloadModule(moduleName);
  return require(moduleName);
}

export function debounced(fn: (...args: any[]) => void, time: number)
{
  let timeout = null;
  return (...args: any[]) => {
    if(timeout)
      clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, time);
  }
}

export function buildTsFile(file: string, destination: string)
{
  try
  {
    var content = fs.readFileSync(file).toString();
    var transpiled = ts.transpile(content, {
      allowJs: true,
      module: ts.ModuleKind.CommonJS
    });
    fs.writeFileSync(destination, transpiled);
  }
  catch(error)
  {
    console.log("TsBuild Error: "+error.message+"\nStack: "+error.stack);
  }
}

export function generateParser(grammarFile: string, outFile)
{
  try
  {
    var grammar = fs.readFileSync(grammarFile).toString()
    
    console.log("Generating parser code...");
    let code = peg.generate(grammar, {
      format: "commonjs",
      trace: false,
      optimize: "speed",
      output: "source"
    });
    
    fs.writeFileSync(outFile, code);
    let module = path.relative(__dirname, outFile);
    let parser = reloadModule(module);
    return parser;
  }
  catch(error)
  {
    let m = "Build error: "+error;
    if(error.location)
    {
      m += "\nErrorLocation:\n"
        + grammar.substring(error.location.start.offset - 20, error.locations.start.offset)
        + chalk.red(grammar.substring(error.location.start.offset, error.location.end.offset))
        + grammar.substring(error.location.end.offset, error.location.end.offset + 20)
    }
    console.log(m);
    return null;
  }
}
