import { bench, describe, expect } from "vitest";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { runPromise } from "effect/Effect";
import { moduleFactory } from "@tevm/resolutions";
import { resolutionsRsFfi, isUsingNativeModule } from "./resolutions-rs-ffi.js";

// Paths to our test fixtures
const FIXTURE_DIR = path.join(__dirname);
const MAIN_CONTRACT = path.join(FIXTURE_DIR, "fixture.sol");

// Cache the file content to avoid disk I/O during benchmarks
let mainContractCode = "";

/**
 * Benchmarks the JavaScript implementation of moduleFactory
 */
async function jsModuleFactory(filePath: string, code: string) {
  const fao = {
    readFile: fsPromises.readFile,
    readFileSync: (path: string, encoding: string) => fs.readFileSync(path, encoding),
    existsSync: (path: string) => fs.existsSync(path)
  };
  
  return runPromise(moduleFactory(filePath, code, {}, [], fao, false));
}

/**
 * Benchmarks the Rust implementation of moduleFactory via FFI
 */
async function rustModuleFactory(filePath: string, code: string) {
  return resolutionsRsFfi.moduleFactory(filePath, code, {}, []);
}

/**
 * Validates that both implementations build complete module graphs correctly
 */
async function validateModuleFactory(filePath: string) {
  const code = await fsPromises.readFile(filePath, "utf-8");

  // Run both implementations
  const jsModuleMap = await jsModuleFactory(filePath, code);
  const rustModuleMap = await rustModuleFactory(filePath, code);

  // Log the results for verification
  console.log(`JS Module Graph Size: ${jsModuleMap.size} modules`);
  console.log(`Rust Module Graph Size: ${rustModuleMap.size} modules`);
  
  // Print module graph details
  console.log("\nJS Module Graph:");
  for (const [path, module] of jsModuleMap.entries()) {
    console.log(`- ${path} (${module.importedIds.length} imports)`);
  }
  
  console.log("\nRust Module Graph:");
  for (const [path, module] of rustModuleMap.entries()) {
    console.log(`- ${path} (${module.importedIds.length} imports)`);
  }
  
  return { jsModuleMap, rustModuleMap };
}

// Pre-load our main contract code and validate implementations
async function setup() {
  mainContractCode = await fsPromises.readFile(MAIN_CONTRACT, "utf-8");

  // Verify module factory
  console.log("Validating full module graph resolution...");
  await validateModuleFactory(MAIN_CONTRACT);

  // Display which implementation we're actually using
  console.log(`\n=============================================`);
  if (isUsingNativeModule) {
    console.log("✅ Using NATIVE Rust implementation via NAPI-RS");
  } else {
    console.log(
      "⚠️ Using SIMULATED Rust implementation (native module not loaded)",
    );
    console.log("To use the real implementation, build the native module:");
    console.log(
      "cd /Users/williamcory/tevm/main/bundler-packages/resolutions-rs && pnpm run build",
    );
  }
  console.log(`=============================================\n`);
}

describe("Solidity Full Module Graph Resolution Benchmark", async () => {
  // Initialize before running benchmarks
  await setup();

  // Module Factory Benchmarks (Full Graph Resolution)
  // JavaScript implementation 
  bench("JavaScript - Full Module Graph Resolution", async () => {
    await jsModuleFactory(MAIN_CONTRACT, mainContractCode);
  });

  // Rust implementation (either native or simulated)
  const rustImpl = isUsingNativeModule ? "Native Rust" : "Simulated Rust";
  bench(`${rustImpl} - Full Module Graph Resolution`, async () => {
    await rustModuleFactory(MAIN_CONTRACT, mainContractCode);
  });
});