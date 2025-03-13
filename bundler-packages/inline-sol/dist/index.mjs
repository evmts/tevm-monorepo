import { fileURLToPath } from 'node:url';
import { compiler } from '@tevm/compiler';

// src/index.js
var inlineCounter = 0;
var sol = (strings, ...values) => {
  const source = strings.reduce((result, string, i) => {
    return result + string + (values[i] ?? "");
  }, "");
  const error = new Error();
  const stack = error.stack || "";
  const callerLine = stack.split("\n")[2] || "";
  const match = callerLine.match(/at (.+) \((.+):(\d+):(\d+)\)/) || [];
  const callerFile = match[2] || "unknown";
  const normalizedPath = callerFile.startsWith("file://") ? fileURLToPath(callerFile) : callerFile;
  const index = inlineCounter++;
  const baseName = normalizedPath.split("/").pop() || "inline";
  const solFileName = `${baseName}_${index}.sol`;
  const config = {
    remappings: {},
    libs: [],
    debug: false
  };
  try {
    const result = compiler.compileContractSync(
      source,
      solFileName,
      process.cwd(),
      config,
      false,
      // includeAst
      true,
      // includeBytecode
      {
        // Simple in-memory file system for the compiler
        readFileSync: (file) => {
          if (file === solFileName) return source;
          throw new Error(`File not found: ${file}`);
        },
        existsSync: (file) => file === solFileName,
        writeFileSync: () => {
        }
      },
      console
      // logger
    );
    return result.contract;
  } catch (error2) {
    console.error("Error compiling inline Solidity:", error2);
    throw error2;
  }
};

export { sol };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map