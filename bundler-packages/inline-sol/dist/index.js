'use strict';

var compiler = require('@tevm/compiler');
var url = require('url');

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
  const normalizedPath = callerFile.startsWith("file://") ? url.fileURLToPath(callerFile) : callerFile;
  const index = inlineCounter++;
  const baseName = normalizedPath.split("/").pop() || "inline";
  const solFileName = `${baseName}_${index}.sol`;
  try {
    const { abi, bytecode, contract } = compiler.compileContractSync(
      source,
      solFileName,
      process.cwd(),
      {
        remappings: {},
        libs: [],
        debug: false
      },
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
    return contract;
  } catch (error2) {
    console.error(`Error compiling inline Solidity:`, error2);
    throw error2;
  }
};

exports.sol = sol;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map