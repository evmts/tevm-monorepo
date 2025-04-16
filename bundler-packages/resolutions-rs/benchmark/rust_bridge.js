import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ensures the Rust library and binary are built in release mode
 */
function ensureRustLibraryBuilt() {
  const cargoTomlPath = path.join(__dirname, '..', 'Cargo.toml');
  
  // Check if Cargo.toml exists
  if (!fs.existsSync(cargoTomlPath)) {
    throw new Error(`Cargo.toml not found at ${cargoTomlPath}`);
  }
  
  // Build the Rust library in release mode
  try {
    console.log("Building Rust library in release mode...");
    execSync('cargo build --release', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    console.log("Rust library built successfully.");
  } catch (error) {
    console.error("Failed to build Rust library:", error);
    throw error;
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
export function run(
  absolutePath,
  rawCode, 
  remappings,
  libs
) {
  try {
    // Ensure the library is built
    ensureRustLibraryBuilt();
    
    // Create temporary input and output files
    const inputFile = path.join(__dirname, 'temp_input.json');
    const outputFile = path.join(__dirname, 'temp_output.json');
    
    // Create input JSON
    const input = {
      absolute_path: absolutePath,
      raw_code: rawCode,
      remappings: remappings || {},
      libs: libs || [],
    };
    
    // Write input to file
    fs.writeFileSync(inputFile, JSON.stringify(input, null, 2));
    
    // Run the benchmark helper binary
    // Check multiple possible locations for the binary
    const possiblePaths = [
      path.join(__dirname, '..', 'target', 'release', 'benchmark_helper'),
      path.join(__dirname, '..', '..', '..', 'dist', 'target', 'release', 'benchmark_helper'),
      path.join(__dirname, '..', '..', '..', 'target', 'release', 'benchmark_helper'),
    ];
    
    let binaryPath = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        binaryPath = p;
        console.log(`Found benchmark helper binary at: ${binaryPath}`);
        break;
      } else {
        console.log(`Benchmark helper binary not found at: ${p}`);
      }
    }
    
    if (!binaryPath) {
      // Let's try to find the binary using a more exhaustive search
      console.log("Searching for benchmark_helper binary...");
      try {
        // Try using 'find' to locate the binary
        const findOutput = execSync('find /Users/williamcory/tevm/main -name benchmark_helper -type f', { encoding: 'utf8' });
        const lines = findOutput.trim().split('\n');
        if (lines.length > 0 && lines[0]) {
          binaryPath = lines[0];
          console.log(`Found benchmark_helper using search: ${binaryPath}`);
        } else {
          binaryPath = path.join(__dirname, '..', '..', '..', 'dist', 'target', 'release', 'benchmark_helper');
          console.log(`No binary found with search, using default path: ${binaryPath}`);
        }
      } catch (e) {
        console.error("Failed to search for binary:", e);
        binaryPath = path.join(__dirname, '..', '..', '..', 'dist', 'target', 'release', 'benchmark_helper');
        console.log(`Using default binary path: ${binaryPath}`);
      }
    }
    
    if (!fs.existsSync(binaryPath)) {
      console.error(`Benchmark helper binary not found at ${binaryPath}`);
      throw new Error(`Binary not found: ${binaryPath}`);
    }
    
    try {
      execSync(`"${binaryPath}" "${inputFile}" "${outputFile}"`);
    } catch (error) {
      console.error(`Failed to execute benchmark helper: ${error.message}`);
      throw error;
    }
    
    // Read and parse the output
    const outputJson = fs.readFileSync(outputFile, 'utf8');
    const result = JSON.parse(outputJson);
    
    // Clean up temporary files
    try {
      fs.unlinkSync(inputFile);
      fs.unlinkSync(outputFile);
    } catch (e) {
      console.warn("Failed to clean up temporary files:", e);
    }
    
    return result;
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