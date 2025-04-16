import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the native module - dynamically to handle ESM
let nativeBinding;

/**
 * Ensures the Rust library is built with napi-rs
 */
function ensureRustLibraryBuilt() {
  // Check if the library should be built
  const cargoTomlPath = path.join(__dirname, '..', 'Cargo.toml');
  const indexPath = path.join(__dirname, '..', 'index.js');
  
  // Check if Cargo.toml exists
  if (!fs.existsSync(cargoTomlPath)) {
    throw new Error(`Cargo.toml not found at ${cargoTomlPath}`);
  }
  
  // Check if the library needs to be built
  if (!fs.existsSync(indexPath)) {
    console.log("Building Rust FFI library with napi-rs...");
    try {
      execSync('npm run build', {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit'
      });
      console.log("Rust FFI library built successfully.");
    } catch (error) {
      console.error("Failed to build Rust FFI library:", error);
      throw error;
    }
  }
  
  // Dynamically import the native binding
  try {
    // First try to load using the path directly
    const indexJsPath = path.join(__dirname, '..', 'index.js');
    
    if (fs.existsSync(indexJsPath)) {
      const module = await import(indexJsPath);
      nativeBinding = module;
      console.log("Loaded native binding from index.js");
    } else {
      console.error("Cannot find the napi-rs binding at:", indexJsPath);
      throw new Error(`Native binding not found at ${indexJsPath}`);
    }
  } catch (err) {
    console.error("Failed to load native binding:", err);
    throw err;
  }
}

/**
 * Runs the Rust module_factory function with the given parameters
 * 
 * @param {string} absolutePath - The absolute path to the module
 * @param {string} rawCode - The raw content of the module
 * @param {Object} remappings - A map of remappings for import resolution
 * @param {string[]} libs - A list of library paths
 * @returns {Object} The module info or an error
 */
export async function run(
  absolutePath,
  rawCode, 
  remappings,
  libs
) {
  try {
    // Ensure the library is built
    await ensureRustLibraryBuilt();
    
    // Call the native function directly
    const result = nativeBinding.module_factory_ffi(
      absolutePath,
      rawCode,
      remappings || {},
      libs || []
    );
    
    // Convert result to the same format as the JSON approach for backwards compatibility
    const formattedResult = {};
    for (const [path, moduleInfo] of Object.entries(result)) {
      formattedResult[path] = {
        code: moduleInfo.code,
        path: moduleInfo.path || path
      };
    }
    
    return formattedResult;
  } catch (error) {
    console.error('Error running Rust module_factory:', error);
    return {
      path: absolutePath,
      imports: [],
      error: error.toString()
    };
  }
}

/**
 * Exports a synchronous function to match the JavaScript API
 */
export default run;