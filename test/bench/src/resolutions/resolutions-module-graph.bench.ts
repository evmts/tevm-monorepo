import { bench, describe, afterAll } from "vitest";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";
import { runPromise, runSync } from "effect/Effect";
import { moduleFactory, type FileAccessObject } from "@tevm/resolutions";
import { moduleFactoryJs } from "@tevm/resolutions-rs";
import os from "os";
import crypto from "crypto";

/**
 * Benchmark that generates a deep module graph with 1000+ Solidity files
 * and benchmarks different module resolution implementations.
 * 
 * This benchmark:
 * 1. Creates a temporary directory with a generated deep module graph
 * 2. Each module has a realistic number of imports
 * 3. Tests JavaScript sync, JavaScript async, and Rust implementations
 * 4. Cleans up the temporary files after the benchmark
 */

// Constants for the benchmark
const NUM_MODULES = 100; // Target number of modules to generate
const IMPORTS_PER_MODULE_MIN = 1;
const IMPORTS_PER_MODULE_MAX = 3;
const MODULE_DEPTH_MAX = 10; // Maximum directory depth
const MAX_MODULES_PER_DIR = 50;

/**
 * Generate a realistic Solidity contract template
 */
function generateSolidityContract(contractName: string, imports: string[]) {
  const importStatements = imports.map(imp => `import "${imp}";`).join("\n");
  
  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

${importStatements}

/**
 * @title ${contractName}
 * @dev This is an auto-generated contract for benchmarking
 */
contract ${contractName} {
    // State variables
    uint256 private _value;
    address private _owner;
    mapping(address => uint256) private _balances;
    
    // Events
    event ValueChanged(uint256 newValue);
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    // Constructor
    constructor() {
        _owner = msg.sender;
        _value = 100;
    }
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == _owner, "Not owner");
        _;
    }
    
    // External functions
    function setValue(uint256 newValue) external onlyOwner {
        _value = newValue;
        emit ValueChanged(newValue);
    }
    
    function getValue() external view returns (uint256) {
        return _value;
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    // Internal functions
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "Mint to zero address");
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}`;
}

/**
 * Create a temporary directory structure with specified module count and depth
 */
async function createModuleGraph() {
  // Create a unique temporary directory
  const tempDir = path.join(
    os.tmpdir(),
    `tevm-benchmark-${crypto.randomBytes(8).toString("hex")}`
  );
  
  console.log(`Creating module graph in: ${tempDir}`);
  await fsPromises.mkdir(tempDir, { recursive: true });
  
  // Setup directory structure
  const directories: string[] = [];
  const moduleFiles: {
    path: string;
    relativePath: string;
    name: string;
    imports: string[];
  }[] = [];
  
  // Create directories for different depths
  for (let depth = 0; depth <= MODULE_DEPTH_MAX; depth++) {
    for (let dirIdx = 0; dirIdx < Math.min(5, depth + 1); dirIdx++) {
      const dirPath = path.join(tempDir, `depth${depth}_dir${dirIdx}`);
      directories.push(dirPath);
      await fsPromises.mkdir(dirPath, { recursive: true });
    }
  }
  
  // Create modules with proper directory distribution
  for (let moduleIdx = 0; moduleIdx < NUM_MODULES; moduleIdx++) {
    const dirIndex = Math.floor(Math.random() * directories.length);
    const dirPath = directories[dirIndex];
    
    // Ensure we don't put too many modules in one directory
    const filesInDir = moduleFiles.filter(
      (f) => path.dirname(f.path) === dirPath
    ).length;
    
    if (filesInDir >= MAX_MODULES_PER_DIR) {
      // Skip this directory and try with different one next time
      moduleIdx--;
      continue;
    }
    
    const contractName = `Contract_${moduleIdx}`;
    const fileName = `${contractName}.sol`;
    const filePath = path.join(dirPath, fileName);
    const relativeFilePath = path.relative(tempDir, filePath);
    
    moduleFiles.push({
      path: filePath,
      relativePath: relativeFilePath.replace(/\\/g, "/"), // Normalize for cross-platform
      name: contractName,
      imports: [], // We'll populate this later
    });
  }
  
  // Set up the imports (needs to be done after creating all files to prevent circular issues)
  for (let moduleIdx = 0; moduleIdx < moduleFiles.length; moduleIdx++) {
    const module = moduleFiles[moduleIdx];
    
    // Determine number of imports for this module
    const numImports = Math.floor(
      Math.random() * 
      (IMPORTS_PER_MODULE_MAX - IMPORTS_PER_MODULE_MIN + 1) + 
      IMPORTS_PER_MODULE_MIN
    );
    
    // Avoid importing itself
    const availableModules = moduleFiles.filter(
      (m) => m.path !== module.path
    );
    
    // Randomly select modules to import
    for (let importIdx = 0; importIdx < numImports; importIdx++) {
      if (availableModules.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableModules.length);
      const importModule = availableModules[randomIndex];
      
      // Calculate relative import path
      let relativePath = path.relative(
        path.dirname(module.path),
        path.dirname(importModule.path)
      );
      
      // Handle same directory case (turn empty string into current dir)
      if (relativePath === "") {
        relativePath = ".";
      }
      
      const importPath = `${relativePath}/${path.basename(importModule.path)}`.replace(/\\/g, "/");
      module.imports.push(importPath);
      
      // Remove from available modules to prevent duplicate imports
      availableModules.splice(randomIndex, 1);
    }
  }
  
  // Actually write the files
  console.log(`Writing ${moduleFiles.length} Solidity contract files...`);
  
  for (const module of moduleFiles) {
    const code = generateSolidityContract(module.name, module.imports);
    await fsPromises.writeFile(module.path, code);
  }
  
  // Create an entry point file that imports a subset of modules
  const entryPointFile = path.join(tempDir, "EntryPoint.sol");
  const rootImports = moduleFiles
    .slice(0, Math.min(5, moduleFiles.length))
    .map((m) => `./${m.relativePath}`);
  
  await fsPromises.writeFile(
    entryPointFile,
    generateSolidityContract("EntryPoint", rootImports)
  );
  
  return {
    tempDir,
    entryPointFile,
    moduleCount: moduleFiles.length,
  };
}

/**
 * Create a file access object for the benchmark
 */
function createFileAccessObject(): FileAccessObject {
  return {
    readFile: async (filePath) => {
      try {
        return await fsPromises.readFile(filePath, "utf8");
      } catch (error) {
        console.error(`Error reading file: ${filePath}`, error);
        throw error;
      }
    },
    readFileSync: (filePath, encoding) => {
      try {
        return fs.readFileSync(filePath, encoding as BufferEncoding);
      } catch (error) {
        console.error(`Error reading file sync: ${filePath}`, error);
        throw error;
      }
    },
    existsSync: (filePath) => {
      return fs.existsSync(filePath);
    },
    async exists(filePath) {
      try {
        await fsPromises.access(filePath);
        return true;
      } catch {
        return false;
      }
    },
  };
}


describe("Solidity Module Graph Resolution Benchmarks", async () => {
  // Generate the module graph before running the benchmark
  const { tempDir, entryPointFile, moduleCount } = await createModuleGraph();
  console.log(`Created module graph with ${moduleCount} modules`);
  console.log(`Entry point: ${entryPointFile}`);
  
  // Create the file access object
  const fao = createFileAccessObject();
  
  // Read the entry point file content
  const entryPointContent = await fsPromises.readFile(entryPointFile, "utf8");
  
  // We don't need remappings for this benchmark as all imports are relative
  const remappings = {};
  const libs: string[] = [];
  
  // Set up cleanup after all tests
  afterAll(async () => {
    try {
      await fsPromises.rm(tempDir, { recursive: true, force: true });
      console.log(`Cleaned up temporary directory: ${tempDir}`);
    } catch (error) {
      console.error(`Error cleaning up temporary directory: ${tempDir}`, error);
    }
  });
  
  // Run the benchmarks
  bench("JavaScript sync Implementation", async () => {
    runSync(
      moduleFactory(
        entryPointFile,
        entryPointContent,
        remappings,
        libs,
        fao,
        true, // true = sync mode
      ),
    );
  });
  
  bench("JavaScript async Implementation", async () => {
    await runPromise(
      moduleFactory(
        entryPointFile,
        entryPointContent,
        remappings,
        libs,
        fao,
        false, // false = async mode
      ),
    );
  });
  
  bench("Rust Implementation", async () => {
    // Save original console.warn
    const originalWarn = console.warn;
    
    // Silence warnings during the benchmark
    console.warn = () => {}; 
    
    try {
      await moduleFactoryJs(
        entryPointFile,
        entryPointContent,
        Object.entries(remappings),
        libs.map(lib => String(lib))
      );
    } finally {
      // Restore original console.warn
      console.warn = originalWarn;
    }
  });
});