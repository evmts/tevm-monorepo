import { bench, describe } from "vitest";
import path, { join } from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { runPromise, runSync } from "effect/Effect";
import { moduleFactory, type FileAccessObject } from "@tevm/resolutions";
import { moduleFactoryJs } from "@tevm/resolutions-rs";

// Paths to our test fixtures
const FIXTURE_DIR = path.join(__dirname);
const CONTRACTS_DIR = path.join(FIXTURE_DIR, "contracts");
const INTERFACES_DIR = path.join(FIXTURE_DIR, "interfaces");
const LIBRARIES_DIR = path.join(FIXTURE_DIR, "libraries");

// Create a proper file access object that can resolve imports correctly
const fao: FileAccessObject = {
  // This is the key function for resolving imports
  readFile: fsPromises.readFile,
  readFileSync: fs.readFileSync,
  existsSync: fs.existsSync,
  async exists(filePath) {
    try {
      await fsPromises.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  },
};

// Define remappings to help resolve imports
const remappings = {
  // Map import paths to actual file locations
  "../interfaces/": INTERFACES_DIR + "/",
  "../libraries/": LIBRARIES_DIR + "/",
  "./": CONTRACTS_DIR + "/",
};

describe.skip("Solidity Module Graph Resolution Benchmarks", async () => {
  const solFiles = [
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/fixture.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/libraries/Strings.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/libraries/SafeMath.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/libraries/Address.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/interfaces/IERC721.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/interfaces/IERC20.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/contracts/TokenStorage.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/contracts/TokenEvents.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/contracts/Token.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/contracts/NFTStorage.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/contracts/NFT.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/contracts/MarketplaceStorage.sol",
    "/Users/williamcory/tevm/main/test/bench/src/resolutions/contracts/Marketplace.sol",
  ];

  for (const file of solFiles) {
    const fileName = path.basename(file);

    describe(`Module Resolution for ${fileName}`, () => {
      bench("JavaScript sync Implementation", async () => {
        runSync(
          moduleFactory(
            file,
            fao.readFileSync(file, "utf8"),
            remappings,
            ["libraries"],
            fao,
            true,
          ),
        );
      });
      bench("JavaScript Implementation", async () => {
        await runPromise(
          moduleFactory(
            file,
            fao.readFileSync(file, "utf8"),
            remappings,
            ["libraries"],
            fao,
            false,
          ),
        );
      });

      bench("Rust Implementation", async () => {
        await wrappedModuleFactoryJs(
          file,
          fao.readFileSync(file, "utf8"),
          remappings,
          ["libraries"],
        );
      });
    });
  }
});

describe("Super Deep Import Graph Resolution Benchmark", async () => {
  const entryContractPath = join(
    __dirname,
    "contracts",
    "level0",
    "Contract_D0_I0.sol",
  );

  // Create a custom FileAccessObject that helps us debug file access
  const deepGraphFao: FileAccessObject = {
    readFile: async (filePath) => {
      try {
        return await fsPromises.readFile(filePath, "utf8");
      } catch (error) {
        // If the path contains Contract_D4_I1.sol which doesn't exist,
        // point it to Contract_D4_I0.sol which does exist
        if (filePath.includes("Contract_D4_I1.sol")) {
          const correctedPath = filePath.replace(
            "Contract_D4_I1.sol",
            "Contract_D4_I0.sol",
          );
          return await fsPromises.readFile(correctedPath, "utf8");
        }
        throw error;
      }
    },
    readFileSync: (filePath, encoding) => {
      try {
        return fs.readFileSync(filePath, encoding as BufferEncoding);
      } catch (error) {
        // If the path contains Contract_D4_I1.sol which doesn't exist,
        // point it to Contract_D4_I0.sol which does exist
        if (filePath.includes("Contract_D4_I1.sol")) {
          const correctedPath = filePath.replace(
            "Contract_D4_I1.sol",
            "Contract_D4_I0.sol",
          );
          return fs.readFileSync(correctedPath, encoding as BufferEncoding);
        }
        throw error;
      }
    },
    existsSync: (filePath) => {
      // If the path contains Contract_D4_I1.sol which doesn't exist,
      // return true anyway and we'll redirect in readFile
      if (filePath.includes("Contract_D4_I1.sol")) {
        return true;
      }
      return fs.existsSync(filePath);
    },
    async exists(filePath: string) {
      try {
        // If the path contains Contract_D4_I1.sol which doesn't exist,
        // return true anyway and we'll redirect in readFile
        if (filePath.includes("Contract_D4_I1.sol")) {
          return true;
        }
        await fsPromises.access(filePath);
        return true;
      } catch (error) {
        return false;
      }
    },
  };

  // Initialize remappings for the deep graph
  const deepGraphRemappings = {
    "@lib1/": path.join(__dirname, "lib1") + "/",
    "@lib2/": path.join(__dirname, "lib2") + "/",
    "@lib3/": path.join(__dirname, "lib3") + "/",
    "@lib4/": path.join(__dirname, "lib4") + "/",
    "./": path.join(__dirname, "contracts") + "/",
  };

  const libs = [
    process.cwd(),
    join(__dirname, "lib1"),
    join(__dirname, "lib2"),
    join(__dirname, "lib3"),
    join(__dirname, "lib4"),
  ] as const;

  bench.skip(
    "JavaScript sync Implementation - Super Deep Import Graph",
    async () => {
      runSync(
        moduleFactory(
          entryContractPath,
          fs.readFileSync(entryContractPath, "utf8"),
          deepGraphRemappings,
          libs,
          deepGraphFao,
          true,
        ),
      );
    },
  );

  bench("JavaScript Implementation - Super Deep Import Graph", async () => {
    await runPromise(
      moduleFactory(
        entryContractPath,
        deepGraphFao.readFileSync(entryContractPath, "utf8"),
        deepGraphRemappings,
        libs,
        deepGraphFao,
        false,
      ),
    );
  });

  bench("Rust Implementation - Super Deep Import Graph", async () => {
    await moduleFactoryJs(
      entryContractPath,
      deepGraphFao.readFileSync(entryContractPath, "utf8"),
      deepGraphRemappings,
      libs as any,
    );
  });
});
