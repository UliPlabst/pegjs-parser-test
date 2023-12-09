import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";

export function parseTestFile(file: string, parser, colorizer: (node: any) => string)
{
  let test = fs.readFileSync(file).toString();
  let cnt = 0;
  try 
  {
    // console.time();
    let result = parser.parse(test);
    console.log(JSON.stringify(result, null, 3));
    // console.timeEnd();
    // if(diagnostics.length != 0)
    //   console.log("Diagnostics:\n"+JSON.stringify(diagnostics, null, 3))
  }
  catch(error)
  {
    console.log("Parsing Error: "+error+"\nStack: "+error.stack);
  }
  finally
  {
    cnt += 1;
    console.log("---------------------------------------------------------------"+cnt);
  }
}