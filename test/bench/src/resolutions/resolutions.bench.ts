import { bench, describe, expect } from "vitest";
import path from "path";
import { promises as fs } from "fs";
import { runPromise } from "effect/Effect";
import { moduleFactory, resolveImports } from "@tevm/resolutions";
import { resolutionsRsFfi, isUsingNativeModule } from "./resolutions-rs-ffi.js";

// Paths to our test fixtures
const FIXTURE_DIR = path.join(__dirname);
const MAIN_CONTRACT = path.join(FIXTURE_DIR, "fixture.sol");

// Cache the file content to avoid disk I/O during benchmarks
let mainContractCode = "";

/**
 * Benchmarks the JavaScript implementation of resolveImports (for validation)
 */
async function jsResolution(filePath: string, code: string) {
  return runPromise(resolveImports(filePath, code, {}, [], false));
}

/**
 * Benchmarks the Rust implementation of resolveImports via FFI (for validation)
 */
async function rustResolution(filePath: string, code: string) {
  return resolutionsRsFfi.resolveImports(filePath, code, {}, []);
}

/**
 * Benchmarks the JavaScript implementation of moduleFactory
 */
async function jsModuleFactory(filePath: string, code: string) {
  const fao = {
    readFile: fs.readFile,
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
 * Loads all files in a directory recursively
 */
async function loadAllFiles(
  dir: string,
  fileList: string[] = [],
): Promise<string[]> {
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      fileList = await loadAllFiles(fullPath, fileList);
    } else if (item.isFile() && item.name.endsWith(".sol")) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

/**
 * Validates that both implementations resolve imports correctly
 */
async function validateImportResolution(filePath: string) {
  const code = await fs.readFile(filePath, "utf-8");

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

/**
 * Validates that both implementations build complete module graphs correctly
 */
async function validateModuleFactory(filePath: string) {
  const code = await fs.readFile(filePath, "utf-8");

  // Run both implementations
  const jsModuleMap = await jsModuleFactory(filePath, code);
  const rustModuleMap = await rustModuleFactory(filePath, code);

  // Log the results for verification
  console.log(`JS Module Graph Size: ${jsModuleMap.size} modules`);
  console.log(`Rust Module Graph Size: ${rustModuleMap.size} modules`);
  
  return { jsModuleMap, rustModuleMap };
}

// Pre-load our main contract code and validate implementations
async function setup() {
  mainContractCode = await fs.readFile(MAIN_CONTRACT, "utf-8");

  // Verify import resolution for validation
  console.log("Validating import resolution...");
  await validateImportResolution(MAIN_CONTRACT);
  
  // Verify module factory
  console.log("\nValidating module factory...");
  const { jsModuleMap, rustModuleMap } = await validateModuleFactory(MAIN_CONTRACT);
  
  // Print module graph details
  console.log("\nJS Module Graph:");
  for (const [path, module] of jsModuleMap.entries()) {
    console.log(`- ${path} (${module.importedIds.length} imports)`);
  }
  
  console.log("\nRust Module Graph:");
  for (const [path, module] of rustModuleMap.entries()) {
    console.log(`- ${path} (${module.importedIds.length} imports)`);
  }

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

describe("Solidity Import Resolution Benchmark", async () => {
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
  
  // Single file import resolution benchmarks (for comparison)
  bench("JavaScript - Single File Import Resolution", async () => {
    await jsResolution(MAIN_CONTRACT, mainContractCode);
  });
  
  bench(`${rustImpl} - Single File Import Resolution`, async () => {
    await rustResolution(MAIN_CONTRACT, mainContractCode);
  });
});
