import { bench, describe, expect } from "vitest";
import path from "path";
import { promises as fsPromises } from "fs";
import { runPromise } from "effect/Effect";
import { resolveImports } from "@tevm/resolutions";
import { resolutionsRsFfi, isUsingNativeModule } from "./resolutions-rs-ffi.js";

// Paths to our test fixtures
const FIXTURE_DIR = path.join(__dirname);
const MAIN_CONTRACT = path.join(FIXTURE_DIR, "fixture.sol");

// Cache the file content to avoid disk I/O during benchmarks
let mainContractCode = "";

/**
 * Benchmarks the JavaScript implementation of resolveImports
 */
async function jsResolution(filePath: string, code: string) {
  return runPromise(resolveImports(filePath, code, {}, [], false));
}

/**
 * Benchmarks the Rust implementation of resolveImports via FFI
 */
async function rustResolution(filePath: string, code: string) {
  return resolutionsRsFfi.resolveImports(filePath, code, {}, []);
}

/**
 * Validates that both implementations resolve imports correctly
 */
async function validateImportResolution(filePath: string) {
  const code = await fsPromises.readFile(filePath, "utf-8");

  // Run both implementations
  const jsResults = await jsResolution(filePath, code);
  const rustResults = await rustResolution(filePath, code);

  // Check that both implementations return the same number of imports
  expect(jsResults.length).toBe(rustResults.length);

  // Log the results for verification
  console.log("JS Results:", jsResults.map((i) => i.original).sort());
  console.log("Rust Results:", rustResults.map((i) => i.original).sort());
  
  return { jsResults, rustResults };
}

// Pre-load our main contract code and validate implementations
async function setup() {
  mainContractCode = await fsPromises.readFile(MAIN_CONTRACT, "utf-8");

  // Verify import resolution for validation
  console.log("Validating single file import resolution...");
  await validateImportResolution(MAIN_CONTRACT);

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

describe("Solidity Single File Import Resolution Benchmark", async () => {
  // Initialize before running benchmarks
  await setup();
  
  // Single file import resolution benchmarks
  bench("JavaScript - Single File Import Resolution", async () => {
    await jsResolution(MAIN_CONTRACT, mainContractCode);
  });
  
  // Rust implementation (either native or simulated)
  const rustImpl = isUsingNativeModule ? "Native Rust" : "Simulated Rust";
  bench(`${rustImpl} - Single File Import Resolution`, async () => {
    await rustResolution(MAIN_CONTRACT, mainContractCode);
  });
});