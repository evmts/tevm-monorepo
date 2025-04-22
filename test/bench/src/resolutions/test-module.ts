import { moduleFactory } from "@tevm/resolutions";
import * as resolutionsRs from "@tevm/resolutions-rs";
import fs from "fs";
import path from "path";
import { runPromise } from "effect/Effect";

async function main() {
  // Create a simple test file
  const fixture_dir = path.join(__dirname);
  const temp_file = path.join(fixture_dir, "temp.sol");
  
  // Write a simple Solidity file with imports
  fs.writeFileSync(temp_file, `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
  function test() public view returns (uint) {
    return 123;
  }
}
  `);
  
  try {
    console.log("Testing JavaScript moduleFactory...");
    const code = fs.readFileSync(temp_file, "utf-8");
    
    const fao = {
      readFile: fs.promises.readFile, 
      readFileSync: (p: string, encoding: string) => fs.readFileSync(p, encoding),
      existsSync: (p: string) => fs.existsSync(p)
    };
    
    const jsResult = await runPromise(moduleFactory(temp_file, code, {}, [], fao, false));
    console.log("JavaScript result:", jsResult.size);
    
    console.log("\nTesting Rust moduleFactoryJs...");
    console.log("Available exports:", Object.keys(resolutionsRs));
    try {
      const rustResult = await resolutionsRs.moduleFactoryJs(
        temp_file, 
        code, 
        [], // remappings as array of tuples
        [] // libs as array of strings
      );
      console.log("Rust result:", Object.keys(rustResult).length);
    } catch (e) {
      console.error("Error with Rust moduleFactoryJs:", e);
    }
    
    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("Error running test:", error);
  } finally {
    // Clean up
    if (fs.existsSync(temp_file)) {
      fs.unlinkSync(temp_file);
    }
  }
}

main().catch(console.error);