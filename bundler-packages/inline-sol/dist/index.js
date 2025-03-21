'use strict';

var url = require('url');
var compilerModule = require('@tevm/compiler');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var compilerModule__namespace = /*#__PURE__*/_interopNamespace(compilerModule);

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
  const config = {
    remappings: {},
    libs: [],
    debug: false,
    jsonAsConst: [],
    foundryProject: false,
    cacheDir: `${process.cwd()}/.tevm`
  };
  try {
    const fakeFs = {
      /**
       * @param {string} file - File path
       * @param {BufferEncoding} encoding - File encoding
       * @returns {string}
       */
      readFileSync: (file, encoding) => {
        if (file === solFileName) return source;
        throw new Error(`File not found: ${file}`);
      },
      /**
       * @param {string} file - File path
       * @param {BufferEncoding} encoding - File encoding
       * @returns {Promise<string>}
       */
      readFile: (file, encoding) => {
        if (file === solFileName) return Promise.resolve(source);
        return Promise.reject(new Error(`File not found: ${file}`));
      },
      /**
       * @param {string} file - File path
       * @returns {boolean}
       */
      existsSync: (file) => file === solFileName,
      /**
       * @param {string} file - File path
       * @returns {Promise<boolean>}
       */
      exists: (file) => Promise.resolve(file === solFileName)
    };
    const result = compilerModule__namespace.compiler.compileContractSync(
      solFileName,
      // filePath
      process.cwd(),
      // basedir
      /** @type {any} */
      config,
      // config
      false,
      // includeAst
      true,
      // includeBytecode
      fakeFs,
      // fao
      console,
      // logger
      void 0
      // solc - use default
    );
    return result.contract;
  } catch (error2) {
    console.error("Error compiling inline Solidity:", error2);
    throw error2;
  }
};

exports.sol = sol;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map