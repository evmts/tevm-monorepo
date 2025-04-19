import { bench, describe, expect } from "vitest";
import path from "path";
import { promises as fsPromises } from "fs";
import { runPromise } from "effect/Effect";
import { resolveImports as jsResolveImports } from "@tevm/resolutions";
import { resolveImports as rustResolveImports } from "@tevm/resolutions-rs";

// Paths to our test fixtures
const FIXTURE_DIR = path.join(__dirname);
const MAIN_CONTRACT = path.join(FIXTURE_DIR, "fixture.sol");

// Cache the file content to avoid disk I/O during benchmarks
let mainContractCode = "";

// Load file content before benchmarks
async function setup() {
  mainContractCode = await fsPromises.readFile(MAIN_CONTRACT, "utf-8");
  
  // Verify both implementations work correctly
  const code = mainContractCode;
  
  // Execute both implementations
  const jsResults = await runPromise(jsResolveImports(MAIN_CONTRACT, code, {}, [], false));
  const rustResults = await rustResolveImports(MAIN_CONTRACT, code, {}, []);
  
  // Verify results match
  expect(jsResults.length).toBe(rustResults.length);
  
  // Log results to verify correct operation
  console.log("JavaScript Imports:", jsResults.length);
  console.log("Rust Imports:", rustResults.length);
}

describe("Solidity Single File Import Resolution Benchmark", async () => {
  // Initialize before running benchmarks
  await setup();
  
  // JavaScript implementation benchmark - directly call the imported function
  bench("JavaScript - Single File Import Resolution", async () => {
    await runPromise(jsResolveImports(MAIN_CONTRACT, mainContractCode, {}, [], false));
  });
  
  // Rust implementation benchmark - directly call the imported function
  bench("Rust - Single File Import Resolution", async () => {
    await rustResolveImports(MAIN_CONTRACT, mainContractCode, {}, []);
  });
});