// Simple WASM inspector to check exports and imports
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const wasmPath = process.argv[2] || resolve(__dirname, '../dist/zigevm.wasm');

async function inspectWasm(path) {
  try {
    console.log(`Inspecting WASM file: ${path}`);
    const wasmBuffer = fs.readFileSync(path);
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    
    // Get exports
    const exports = WebAssembly.Module.exports(wasmModule);
    console.log("\nExports:");
    exports.forEach(exp => {
      console.log(`  ${exp.name}: ${exp.kind}`);
    });
    
    // Get imports
    const imports = WebAssembly.Module.imports(wasmModule);
    console.log("\nImports:");
    imports.forEach(imp => {
      console.log(`  ${imp.module}.${imp.name}: ${imp.kind}`);
    });
    
    // Try to instantiate
    console.log("\nAttempting to instantiate...");
    const memory = new WebAssembly.Memory({ initial: 16, maximum: 1024 });
    const importObject = {
      env: {
        memory
      }
    };
    
    try {
      const instance = await WebAssembly.instantiate(wasmModule, importObject);
      console.log("Instantiation successful!");
      
      // List available exports
      console.log("\nAvailable functions:");
      for (const key in instance.exports) {
        const type = typeof instance.exports[key];
        console.log(`  ${key}: ${type}`);
      }
      
      // Try to call exported test function
      if (instance.exports.zig_add) {
        console.log("\nTesting zig_add(3, 4):", instance.exports.zig_add(3, 4));
      }
      
      // Check if memory allocator is available
      if (instance.exports.malloc) {
        console.log("malloc is available");
      } else {
        console.log("malloc is NOT available");
      }
    } catch (error) {
      console.log("Instantiation failed:", error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

inspectWasm(wasmPath);