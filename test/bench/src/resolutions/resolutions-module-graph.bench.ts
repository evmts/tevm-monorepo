import { bench, describe } from "vitest";
import { moduleFactory as rustModuleFactory } from "@tevm/resolutions-rs";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { runPromise } from "effect/Effect";
import { moduleFactory as jsModuleFactory } from "@tevm/resolutions";

// Paths to our test fixtures
const FIXTURE_DIR = path.join(__dirname);
const MAIN_CONTRACT = path.join(FIXTURE_DIR, "fixture.sol");

// Cache the file content to avoid disk I/O during benchmarks
let mainContractCode = "";

// File access object for JS implementation
const fao = {
  readFile: fsPromises.readFile,
  readFileSync: (path: string, encoding: string) => fs.readFileSync(path, encoding),
  existsSync: (path: string) => fs.existsSync(path)
};

// Load file content before benchmarks
async function setup() {
  mainContractCode = await fsPromises.readFile(MAIN_CONTRACT, "utf-8");
  
  // Run validation to verify both implementations work correctly
  const code = mainContractCode;
  
  // Execute both implementations
  const jsModuleMap = await runPromise(jsModuleFactory(MAIN_CONTRACT, code, {}, [], fao, false));
  const rustModuleMap = await rustModuleFactory(MAIN_CONTRACT, code, {}, []);
  
  // Log results to verify correct operation
  console.log(`JavaScript Module Graph: ${jsModuleMap.size} modules`);
  console.log(`Rust Module Graph: ${rustModuleMap.size} modules`);
}

describe("Solidity Full Module Graph Resolution Benchmark", async () => {
  // Initialize before running benchmarks
  await setup();

  // JavaScript implementation benchmark
  bench("JavaScript - Full Module Graph Resolution", async () => {
    await runPromise(jsModuleFactory(MAIN_CONTRACT, mainContractCode, {}, [], fao, false));
  });

  // Rust implementation benchmark - directly using the imported function
  bench("Rust - Full Module Graph Resolution", async () => {
    await rustModuleFactory(MAIN_CONTRACT, mainContractCode, {}, []);
  });
});
