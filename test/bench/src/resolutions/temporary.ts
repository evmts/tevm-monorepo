import path, { join } from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { runPromise } from "effect/Effect";
import { moduleFactory, type FileAccessObject } from "@tevm/resolutions";
import { moduleFactoryJs } from "@tevm/resolutions-rs";

// Create a proper file access object that can resolve imports correctly
const fao: FileAccessObject = {
  // This is the key function for resolving imports
  readFile: async (filePath) => {
    try {
      console.log(`Reading file: ${filePath}`);
      return await fsPromises.readFile(filePath, "utf8");
    } catch (error) {
      console.error(`Error reading file: ${filePath}`, error);
      throw error;
    }
  },
  readFileSync: (filePath, encoding) => {
    try {
      console.log(`Reading file sync: ${filePath}`);
      return fs.readFileSync(filePath, encoding as BufferEncoding);
    } catch (error) {
      console.error(`Error reading file sync: ${filePath}`, error);
      throw error;
    }
  },
  existsSync: (filePath) => {
    const exists = fs.existsSync(filePath);
    console.log(`Checking exists sync: ${filePath} => ${exists}`);
    return exists;
  },
  async exists(filePath) {
    try {
      await fsPromises.access(filePath);
      console.log(`File exists: ${filePath}`);
      return true;
    } catch (error) {
      console.log(`File does not exist: ${filePath}`);
      return false;
    }
  },
};

// Define the entry contract path
const entryContractPath = join(
  __dirname,
  "contracts",
  "level0",
  "Contract_D0_I0.sol",
);

// Verify key paths
console.log("Checking if key paths exist:");
[
  entryContractPath,
  join(__dirname, "lib1/level1/Lib1_D1_I0.sol"),
  join(__dirname, "lib4/level1/Lib4_D1_I1.sol"),
  join(__dirname, "contracts/level1/Contract_D1_I2.sol"),
  join(__dirname, "contracts/level1/Contract_D1_I3.sol"),
].forEach((p) => {
  console.log(`${p} exists: ${fs.existsSync(p)}`);
});

// Initialize remappings for the deep graph
const deepGraphRemappings = {
  "@lib1/": path.join(__dirname, "lib1") + "/",
  "@lib2/": path.join(__dirname, "lib2") + "/",
  "@lib3/": path.join(__dirname, "lib3") + "/",
  "@lib4/": path.join(__dirname, "lib4") + "/",
  "./": path.join(__dirname, "contracts") + "/",
};

console.log("Remappings:");
Object.entries(deepGraphRemappings).forEach(([key, value]) => {
  console.log(`  ${key} => ${value}`);
  console.log(`  Directory exists: ${fs.existsSync(value)}`);
});

const libs = [
  process.cwd(),
  join(__dirname, "lib1"),
  join(__dirname, "lib2"),
  join(__dirname, "lib3"),
  join(__dirname, "lib4"),
] as const;

console.log("Library paths:");
libs.forEach((lib) => {
  console.log(`  ${lib} exists: ${fs.existsSync(lib)}`);
});

// Run the JS async implementation
console.log("\nTesting JavaScript async implementation");
runPromise(
  moduleFactory(
    entryContractPath,
    fao.readFileSync(entryContractPath, "utf8"),
    deepGraphRemappings,
    libs,
    fao,
    false, // false = async mode
  ),
)
  .then((result) => {
    console.log("JavaScript async implementation successful");
    console.log("Module graph contains", result.size, "modules");
  })
  .catch((error) => {
    console.error("JavaScript async implementation failed:");
    console.error(error);
    process.exit(1);
  });

await moduleFactoryJs(
  entryContractPath,
  fao.readFileSync(entryContractPath, "utf8"),
  deepGraphRemappings,
  [...libs],
)
  .then((result) => {
    console.log("Rust async implementation successful");
    console.log("Module graph contains", Object.keys(result).length, "modules");
  })
  .catch((error) => {
    console.error("Rust async implementation failed:");
    console.error(error);
    process.exit(1);
  });
