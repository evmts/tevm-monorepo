import path, { join } from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { moduleFactoryJs } from "@tevm/resolutions-rs";

// Define the entry contract path - using a file we know exists
const entryContractPath = join(
  __dirname,
  "contracts",
  "level0",
  "Contract_D0_I0.sol",
);

// Basic file check
console.log(`Entry contract path: ${entryContractPath}`);
console.log(`Entry contract exists: ${fs.existsSync(entryContractPath)}`);

// Initialize remappings for the graph
const remappings = {
  "@lib1/": path.join(__dirname, "lib1") + "/",
  "@lib4/": path.join(__dirname, "lib4") + "/",
  "./": path.join(__dirname, "contracts") + "/",
};

console.log("Remappings:");
Object.entries(remappings).forEach(([key, value]) => {
  console.log(`  ${key} => ${value}`);
  console.log(`  Directory exists: ${fs.existsSync(value)}`);
});

const libs = [
  process.cwd(),
  join(__dirname, "lib1"),
  join(__dirname, "lib4"),
];

console.log("Library paths:");
libs.forEach((lib) => {
  console.log(`  ${lib} exists: ${fs.existsSync(lib)}`);
});

// Read the source code
const code = fs.readFileSync(entryContractPath, "utf8");
console.log(`Read source code (${code.length} bytes)`);

// Convert remappings and libs for the Rust API
const remappingsArray = Object.entries(remappings);
const libsArray = libs.map(p => String(p));

console.log("\nTesting Rust implementation...");
console.log("Using remappingsArray:", JSON.stringify(remappingsArray));
console.log("Using libsArray:", JSON.stringify(libsArray));

// Using a simpler try/catch for easier debugging
try {
  const result = await moduleFactoryJs(
    entryContractPath,
    code,
    remappingsArray,
    libsArray
  );
  
  console.log("\nRust implementation successful!");
  console.log(`Module graph contains ${Object.keys(result).length} modules`);
  
  // Print the keys in the result for debugging
  console.log("\nModules in graph:");
  Object.keys(result).forEach(key => {
    console.log(`  ${key}`);
  });
} catch (error) {
  console.error("\nRust implementation failed:");
  console.error(error);
}