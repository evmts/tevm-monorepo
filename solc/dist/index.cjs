"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var src_exports = {};
__export(src_exports, {
  bundler: () => bundler,
  createCache: () => createCache,
  esbuildPluginEvmts: () => esbuildPluginEvmts,
  resolveArtifacts: () => resolveArtifacts,
  resolveArtifactsSync: () => resolveArtifactsSync,
  rollupPluginEvmts: () => rollupPluginEvmts,
  rspackPluginEvmts: () => rspackPluginEvmts,
  vitePluginEvmts: () => vitePluginEvmts,
  webpackPluginEvmts: () => webpackPluginEvmts
});
module.exports = __toCommonJS(src_exports);

// src/runtime/generateEvmtsBodyDts.js
var import_abitype = require("abitype");
var generateDtsBody = (artifacts) => {
  return Object.entries(artifacts).flatMap(([contractName, { abi, userdoc = {} }]) => {
    const contract = {
      name: contractName,
      humanReadableAbi: (0, import_abitype.formatAbi)(abi)
    };
    const natspec = Object.entries(userdoc.methods ?? {}).map(
      ([method, { notice }]) => ` * @property ${method} ${notice}`
    );
    if (userdoc.notice) {
      natspec.unshift(` * @notice ${userdoc.notice}`);
    }
    return [
      `const _abi${contractName} = ${JSON.stringify(
        contract.humanReadableAbi
      )} as const;`,
      `const _name${contractName} = ${JSON.stringify(
        contractName
      )} as const;`,
      "/**",
      ` * ${contractName} EvmtsContract`,
      ...natspec,
      " */",
      `export const ${contractName}: EvmtsContract<typeof _name${contractName}, typeof _abi${contractName}>;`
    ].filter(Boolean);
  }).join("\n");
};

// src/runtime/generateEvmtsBody.js
var import_abitype2 = require("abitype");
var generateEvmtsBody = (artifacts, moduleType) => {
  if (moduleType === "dts") {
    return generateDtsBody(artifacts);
  }
  return Object.entries(artifacts).flatMap(([contractName, { abi, userdoc = {} }]) => {
    const contract = JSON.stringify({
      name: contractName,
      humanReadableAbi: (0, import_abitype2.formatAbi)(abi)
    });
    const natspec = Object.entries(userdoc.methods ?? {}).map(
      ([method, { notice }]) => ` * @property ${method} ${notice}`
    );
    if (userdoc.notice) {
      natspec.unshift(` * ${userdoc.notice}`);
    }
    if (natspec.length) {
      natspec.unshift("/**");
      natspec.push(" */");
    }
    if (moduleType === "cjs") {
      return [
        `const _${contractName} = ${contract}`,
        ...natspec,
        `module.exports.${contractName} = evmtsContractFactory(_${contractName})`
      ];
    }
    if (moduleType === "ts") {
      return [
        `const _${contractName} = ${contract} as const`,
        ...natspec,
        `export const ${contractName} = evmtsContractFactory(_${contractName})`
      ];
    }
    return [
      `const _${contractName} = ${contract}`,
      ...natspec,
      `export const ${contractName} = evmtsContractFactory(_${contractName})`
    ];
  }).join("\n");
};

// src/runtime/generateRuntime.js
var generateRuntime = async (artifacts, moduleType, logger) => {
  if (artifacts) {
    const evmtsImports = moduleType !== "cjs" ? `import { evmtsContractFactory } from '@evmts/core'` : `const { evmtsContractFactory } = require('@evmts/core')`;
    const evmtsBody = generateEvmtsBody(artifacts, moduleType);
    return [evmtsImports, evmtsBody].join("\n");
  }
  logger.warn("No artifacts found, skipping runtime generation");
  return "";
};

// src/runtime/generateRuntimeSync.js
var generateRuntimeSync = (artifacts, moduleType, logger) => {
  if (!artifacts || Object.keys(artifacts).length === 0) {
    logger.warn("No artifacts found, skipping runtime generation");
    return "";
  }
  let evmtsImports;
  if (moduleType === "cjs") {
    evmtsImports = `const { evmtsContractFactory } = require('@evmts/core')`;
  } else if (moduleType === "dts") {
    evmtsImports = `import { EvmtsContract } from '@evmts/core'`;
  } else if (moduleType === "ts" || moduleType === "mjs") {
    evmtsImports = `import { evmtsContractFactory } from '@evmts/core'`;
  } else {
    throw new Error(`Unknown module type: ${moduleType}`);
  }
  const evmtsBody = generateEvmtsBody(artifacts, moduleType);
  return [evmtsImports, evmtsBody].join("\n");
};

// src/utils/isImportLocal.js
var isImportLocal = (importPath) => {
  return importPath.startsWith(".");
};

// src/utils/formatPath.js
var formatPath = (contractPath) => {
  return contractPath.replace(/\\/g, "/");
};

// src/utils/invariant.js
function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// src/utils/resolvePromise.js
var import_effect = require("effect");
var import_resolve = __toESM(require("resolve"), 1);
var resolveEffect = (filePath, basedir, fao, logger) => {
  return import_effect.Effect.async((resume) => {
    (0, import_resolve.default)(
      filePath,
      {
        basedir,
        readFile: (file, cb) => {
          fao.readFile(file, "utf8").then((fileContent) => {
            cb(null, fileContent);
          }).catch((e) => {
            logger.error(e);
            logger.error("Error reading file");
            cb(e);
          });
        },
        isFile: (file, cb) => {
          try {
            cb(null, fao.existsSync(file));
          } catch (e) {
            cb(
              /** @type Error */
              e
            );
            logger.error(
              /** @type any */
              e
            );
            logger.error(`Error checking if isFile ${file}`);
            resume(import_effect.Effect.fail(
              /** @type Error */
              e
            ));
            return;
          }
        }
      },
      (err, res) => {
        if (err) {
          logger.error(
            /** @type any */
            err
          );
          logger.error(`There was an error resolving ${filePath}`);
          resume(import_effect.Effect.fail(err));
        } else {
          resume(import_effect.Effect.succeed(
            /** @type string */
            res
          ));
        }
      }
    );
  });
};

// src/solc/resolveImportPath.js
var path = __toESM(require("path"), 1);
var import_resolve2 = __toESM(require("resolve"), 1);
var resolveImportPath = (absolutePath, importPath, remappings, libs) => {
  for (const [key, value] of Object.entries(remappings)) {
    if (importPath.startsWith(key)) {
      return formatPath(path.resolve(importPath.replace(key, value)));
    }
  }
  if (isImportLocal(importPath)) {
    return formatPath(path.resolve(path.dirname(absolutePath), importPath));
  }
  try {
    return import_resolve2.default.sync(importPath, {
      basedir: path.dirname(absolutePath),
      paths: libs
    });
  } catch (e) {
    console.error(
      `Could not resolve import ${importPath} from ${absolutePath}`,
      e
    );
    return importPath;
  }
};

// src/solc/resolveImports.js
var path2 = __toESM(require("path"), 1);
var resolveImports = (absolutePath, code) => {
  const imports = (
    /** @type Array<string> */
    []
  );
  const importRegEx = /^\s?import\s+[^'"]*['"](.*)['"]\s*/gm;
  let foundImport = importRegEx.exec(code);
  while (foundImport != null) {
    const importPath = foundImport[1];
    if (!importPath) {
      throw new Error("expected import path to exist");
    }
    if (isImportLocal(importPath)) {
      const importFullPath = formatPath(
        path2.resolve(path2.dirname(absolutePath), importPath)
      );
      imports.push(importFullPath);
    } else {
      imports.push(importPath);
    }
    foundImport = importRegEx.exec(code);
  }
  return imports;
};

// src/solc/moduleFactory.js
var moduleFactory = async (absolutePath, rawCode, remappings, libs, fao) => {
  const stack = [{ absolutePath, rawCode }];
  const modules = (
    /** @type{Map<string, import("../types.js").ModuleInfo>} */
    /* @__PURE__ */ new Map()
  );
  while (stack.length) {
    const nextItem = stack.pop();
    invariant(nextItem, "Module should exist");
    const { absolutePath: absolutePath2, rawCode: rawCode2 } = nextItem;
    if (modules.has(absolutePath2))
      continue;
    const importedIds = resolveImports(absolutePath2, rawCode2).map(
      (paths) => resolveImportPath(absolutePath2, paths, remappings, libs)
    );
    const importRegEx = /(^\s?import\s+[^'"]*['"])(.*)(['"]\s*)/gm;
    const code = importedIds.reduce((code2, importedId) => {
      console.log({ importedId });
      const depImportAbsolutePath = resolveImportPath(
        absolutePath2,
        importedId,
        remappings,
        libs
      );
      return code2.replace(importRegEx, (match, p1, p2, p3) => {
        const resolvedPath = resolveImportPath(
          absolutePath2,
          p2,
          remappings,
          libs
        );
        if (resolvedPath === importedId) {
          return `${p1}${depImportAbsolutePath}${p3}`;
        } else {
          return match;
        }
      });
    }, rawCode2);
    modules.set(absolutePath2, {
      id: absolutePath2,
      rawCode: rawCode2,
      code,
      importedIds,
      resolutions: []
    });
    for (const importedId of importedIds) {
      const depImportAbsolutePath = resolveImportPath(
        absolutePath2,
        importedId,
        remappings,
        libs
      );
      const depRawCode = await fao.readFile(depImportAbsolutePath, "utf8");
      stack.push({ absolutePath: depImportAbsolutePath, rawCode: depRawCode });
    }
  }
  for (const [_, m] of modules.entries()) {
    const { importedIds } = m;
    m.resolutions = [];
    importedIds.forEach((importedId) => {
      const resolution = modules.get(importedId);
      invariant(resolution, `resolution for ${importedId} not found`);
      m.resolutions.push(resolution);
    });
  }
  const out = modules.get(absolutePath);
  if (!out) {
    throw new Error("No module found");
  }
  return out;
};

// src/solc/solc.js
var import_solc = __toESM(require("solc"), 1);
var solcCompile = (input) => {
  return JSON.parse(import_solc.default.compile(JSON.stringify(input)));
};

// src/solc/compileContracts.js
var import_effect2 = require("effect");
var compileContract = async (filePath, basedir, config, includeAst, fao, logger, cache) => {
  const entryModule = await moduleFactory(
    filePath,
    await fao.readFile(
      await import_effect2.Effect.runPromise(resolveEffect(filePath, basedir, fao, logger)),
      "utf8"
    ).then((code) => {
      return code;
    }),
    config.remappings,
    config.libs,
    fao
  );
  const modules = {};
  const stack = [entryModule];
  while (stack.length !== 0) {
    const m = stack.pop();
    invariant(m, "Module should exist");
    if (m.id in modules) {
      continue;
    }
    modules[m.id] = m;
    for (const dep of m.resolutions) {
      stack.push(dep);
    }
  }
  const sources = Object.fromEntries(
    Object.entries(modules).map(([id, module2]) => {
      return [
        id,
        {
          content: (
            /** @type {string} */
            module2.code
          )
        }
      ];
    })
  );
  const emptyString = "";
  const input = {
    language: "Solidity",
    sources,
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "userdoc"],
          ...includeAst ? { [emptyString]: ["ast"] } : {}
        }
      }
    }
  };
  const output = cache?.isCached(entryModule.id, sources) ? cache.read(entryModule.id) : solcCompile(input);
  cache?.write(entryModule.id, output);
  const warnings = output?.errors?.filter(({ type }) => type === "Warning");
  const isErrors = (output?.errors?.length ?? 0) > (warnings?.length ?? 0);
  if (isErrors) {
    logger.error("Compilation errors:");
    logger.error(
      /** @type {any} */
      output?.errors
    );
    throw new Error("Compilation failed");
  }
  if (warnings?.length) {
    logger.warn(
      /** @type {any} */
      warnings
    );
    logger.warn("Compilation warnings:");
  }
  if (includeAst) {
    const asts = Object.fromEntries(
      Object.entries(output.sources).map(([id, source]) => {
        return [id, source.ast];
      })
    );
    return {
      artifacts: output.contracts[entryModule.id],
      modules: (
        /** @type {any} */
        modules
      ),
      asts: (
        /** @type {any} */
        asts
      ),
      solcInput: input,
      solcOutput: output
    };
  }
  return {
    artifacts: output.contracts[entryModule.id],
    modules: (
      /** @type {any} */
      modules
    ),
    asts: (
      /** @type {any} */
      void 0
    ),
    solcInput: input,
    solcOutput: output
  };
};

// src/solc/resolveArtifacts.js
var resolveArtifacts = async (solFile, basedir, logger, config, includeAst, fao, cache) => {
  if (!solFile.endsWith(".sol")) {
    throw new Error("Not a solidity file");
  }
  const { artifacts, modules, asts, solcInput, solcOutput } = await compileContract(
    solFile,
    basedir,
    config,
    includeAst,
    fao,
    logger,
    cache
  );
  if (!artifacts) {
    logger.error(`Compilation failed for ${solFile}`);
    throw new Error("Compilation failed");
  }
  return {
    artifacts: Object.fromEntries(
      Object.entries(artifacts).map(([contractName, contract]) => {
        return [
          contractName,
          { contractName, abi: contract.abi, userdoc: contract.userdoc }
        ];
      })
    ),
    modules,
    asts,
    solcInput,
    solcOutput
  };
};

// src/solc/moduleFactorySync.js
var moduleFactorySync = (absolutePath, rawCode, remappings, libs, fao) => {
  const stack = [{ absolutePath, rawCode }];
  const modules = (
    /** @type {Map<string, import("../types.js").ModuleInfo>} */
    /* @__PURE__ */ new Map()
  );
  while (stack.length) {
    const nextItem = stack.pop();
    invariant(nextItem, "Module should exist");
    const { absolutePath: absolutePath2, rawCode: rawCode2 } = nextItem;
    if (modules.has(absolutePath2))
      continue;
    const importedIds = resolveImports(absolutePath2, rawCode2).map(
      (paths) => resolveImportPath(absolutePath2, paths, remappings, libs)
    );
    const importRegEx = /(^\s?import\s+[^'"]*['"])(.*)(['"]\s*)/gm;
    const code = importedIds.reduce((code2, importedId) => {
      const depImportAbsolutePath = resolveImportPath(
        absolutePath2,
        importedId,
        remappings,
        libs
      );
      return code2.replace(importRegEx, (match, p1, p2, p3) => {
        const resolvedPath = resolveImportPath(
          absolutePath2,
          p2,
          remappings,
          libs
        );
        if (resolvedPath === importedId) {
          return `${p1}${depImportAbsolutePath}${p3}`;
        } else {
          return match;
        }
      });
    }, rawCode2);
    modules.set(absolutePath2, {
      id: absolutePath2,
      rawCode: rawCode2,
      code,
      importedIds,
      resolutions: []
    });
    importedIds.forEach((importedId) => {
      const depImportAbsolutePath = resolveImportPath(
        absolutePath2,
        importedId,
        remappings,
        libs
      );
      const depRawCode = fao.readFileSync(depImportAbsolutePath, "utf8");
      stack.push({ absolutePath: depImportAbsolutePath, rawCode: depRawCode });
    });
  }
  for (const [_, m] of modules.entries()) {
    const { importedIds } = m;
    m.resolutions = [];
    importedIds.forEach((importedId) => {
      const resolution = modules.get(importedId);
      invariant(resolution, `resolution for ${importedId} not found`);
      m.resolutions.push(resolution);
    });
  }
  return (
    /** @type import("../types.js").ModuleInfo */
    modules.get(absolutePath)
  );
};

// src/solc/compileContractsSync.js
var import_resolve3 = __toESM(require("resolve"), 1);
function compileContractSync(filePath, basedir, config, includeAst, fao, logger, cache) {
  const entryModule = moduleFactorySync(
    filePath,
    fao.readFileSync(
      import_resolve3.default.sync(filePath, {
        basedir,
        readFileSync: (file) => fao.readFileSync(file, "utf8"),
        isFile: fao.existsSync
      }),
      "utf8"
    ),
    config.remappings,
    config.libs,
    fao
  );
  const modules = {};
  const stack = [entryModule];
  while (stack.length !== 0) {
    const m = stack.pop();
    invariant(m, "Module should exist");
    if (m.id in modules) {
      continue;
    }
    modules[m.id] = m;
    for (const dep of m.resolutions) {
      stack.push(dep);
    }
  }
  const sources = Object.fromEntries(
    Object.entries(modules).map(([id, module2]) => {
      const code = (
        /** @type {string} */
        module2.code
      );
      return [id, { content: code }];
    })
  );
  const solcInput = {
    language: "Solidity",
    sources,
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "userdoc"],
          ...includeAst ? { "": ["ast"] } : {}
        }
      }
    }
  };
  const solcOutput = cache?.isCached(entryModule.id, sources) ? cache.read(entryModule.id) : solcCompile(solcInput);
  cache?.write(entryModule.id, solcOutput);
  const warnings = solcOutput?.errors?.filter(({ type }) => type === "Warning");
  const isErrors = (solcOutput?.errors?.length ?? 0) > (warnings?.length ?? 0);
  if (isErrors) {
    logger.error(
      "Compilation errors:",
      /** @type {any}*/
      solcOutput?.errors
    );
    throw new Error("Compilation failed");
  }
  if (warnings?.length) {
    logger.warn(
      "Compilation warnings:",
      /** @type {any}*/
      solcOutput?.errors
    );
  }
  if (includeAst) {
    const asts = Object.fromEntries(
      Object.entries(solcOutput.sources).map(([id, source]) => {
        return [id, source.ast];
      })
    );
    return {
      artifacts: solcOutput.contracts[entryModule.id],
      modules,
      asts,
      solcInput,
      solcOutput
    };
  }
  return {
    artifacts: solcOutput.contracts[entryModule.id],
    modules,
    asts: void 0,
    solcInput,
    solcOutput
  };
}

// src/solc/resolveArtifactsSync.js
var resolveArtifactsSync = (solFile, basedir, logger, config, includeAst, fao, cache) => {
  if (!solFile.endsWith(".sol")) {
    throw new Error("Not a solidity file");
  }
  const { artifacts, modules, asts, solcInput, solcOutput } = compileContractSync(
    solFile,
    basedir,
    config,
    includeAst,
    fao,
    logger,
    cache
  );
  if (!artifacts) {
    logger.error(`Compilation failed for ${solFile}`);
    throw new Error("Compilation failed");
  }
  return {
    artifacts: Object.fromEntries(
      Object.entries(artifacts).map(([contractName, contract]) => {
        return [
          contractName,
          { contractName, abi: contract.abi, userdoc: contract.userdoc }
        ];
      })
    ),
    modules,
    asts,
    solcInput,
    solcOutput
  };
};

// src/bundler.js
var import_solc4 = __toESM(require("solc"), 1);
var bundler = (config, logger, fao, cache) => {
  return {
    name: bundler.name,
    config,
    resolveDts: async (modulePath, basedir, includeAst) => {
      try {
        const { solcInput, solcOutput, artifacts, modules, asts } = await resolveArtifacts(
          modulePath,
          basedir,
          logger,
          config,
          includeAst,
          fao,
          cache
        );
        if (artifacts) {
          const evmtsImports = `import { EvmtsContract } from '@evmts/core'`;
          const evmtsBody = generateDtsBody(artifacts);
          return {
            solcInput,
            solcOutput,
            asts,
            code: [evmtsImports, evmtsBody].join("\n"),
            modules
          };
        }
        return { solcInput, solcOutput, code: "", modules, asts };
      } catch (e) {
        logger.error(
          /** @type {any} */
          e
        );
        logger.error("there was an error in evmts plugin generating .dts");
        throw e;
      }
    },
    resolveDtsSync: (modulePath, basedir, includeAst) => {
      try {
        const { artifacts, modules, asts, solcInput, solcOutput } = resolveArtifactsSync(
          modulePath,
          basedir,
          logger,
          config,
          includeAst,
          fao,
          cache
        );
        if (artifacts) {
          const evmtsImports = `import { EvmtsContract } from '@evmts/core'`;
          const evmtsBody = generateDtsBody(artifacts);
          return {
            solcInput,
            solcOutput,
            asts,
            modules,
            code: [evmtsImports, evmtsBody].join("\n")
          };
        }
        return { modules, code: "", asts, solcInput, solcOutput };
      } catch (e) {
        logger.error(
          /** @type {any} */
          e
        );
        logger.error("there was an error in evmts plugin resolving .dts");
        throw e;
      }
    },
    resolveTsModuleSync: (modulePath, basedir, includeAst) => {
      try {
        const { solcInput, solcOutput, asts, artifacts, modules } = resolveArtifactsSync(
          modulePath,
          basedir,
          logger,
          config,
          includeAst,
          fao,
          cache
        );
        const code = generateRuntimeSync(artifacts, "ts", logger);
        return { code, modules, solcInput, solcOutput, asts };
      } catch (e) {
        logger.error(
          /** @type {any} */
          e
        );
        logger.error("there was an error in evmts plugin resolving .ts");
        throw e;
      }
    },
    resolveTsModule: async (modulePath, basedir, includeAst) => {
      try {
        const { solcInput, solcOutput, asts, artifacts, modules } = await resolveArtifacts(
          modulePath,
          basedir,
          logger,
          config,
          includeAst,
          fao,
          cache
        );
        const code = await generateRuntime(artifacts, "ts", logger);
        return { code, modules, solcInput, solcOutput, asts };
      } catch (e) {
        logger.error(
          /** @type {any} */
          e
        );
        logger.error("there was an error in evmts plugin resolving .ts");
        throw e;
      }
    },
    resolveCjsModuleSync: (modulePath, basedir, includeAst) => {
      try {
        const { solcInput, solcOutput, asts, artifacts, modules } = resolveArtifactsSync(
          modulePath,
          basedir,
          logger,
          config,
          includeAst,
          fao,
          cache
        );
        const code = generateRuntimeSync(artifacts, "cjs", logger);
        return { code, modules, solcInput, solcOutput, asts };
      } catch (e) {
        logger.error(
          /** @type {any} */
          e
        );
        logger.error("there was an error in evmts plugin resolving .cjs");
        throw e;
      }
    },
    resolveCjsModule: async (modulePath, basedir, includeAst) => {
      try {
        const { solcInput, solcOutput, asts, artifacts, modules } = await resolveArtifacts(
          modulePath,
          basedir,
          logger,
          config,
          includeAst,
          fao,
          cache
        );
        const code = await generateRuntime(artifacts, "cjs", logger);
        return { code, modules, solcInput, solcOutput, asts };
      } catch (e) {
        logger.error(
          /** @type {any} */
          e
        );
        logger.error("there was an error in evmts plugin resolving .cjs");
        throw e;
      }
    },
    resolveEsmModuleSync: (modulePath, basedir, includeAst) => {
      try {
        const { solcInput, solcOutput, asts, artifacts, modules } = resolveArtifactsSync(
          modulePath,
          basedir,
          logger,
          config,
          includeAst,
          fao,
          cache
        );
        const code = generateRuntimeSync(artifacts, "mjs", logger);
        return { code, modules, solcInput, solcOutput, asts };
      } catch (e) {
        logger.error("there was an error in evmts plugin resolving .mjs");
        logger.error(
          /** @type {any} */
          e
        );
        throw e;
      }
    },
    resolveEsmModule: async (modulePath, basedir, includeAst) => {
      try {
        const { solcInput, solcOutput, asts, artifacts, modules } = await resolveArtifacts(
          modulePath,
          basedir,
          logger,
          config,
          includeAst,
          fao,
          cache
        );
        const code = await generateRuntime(artifacts, "mjs", logger);
        return { code, modules, solcInput, solcOutput, asts };
      } catch (e) {
        logger.error(
          /** @type {any} */
          e
        );
        logger.error("there was an error in evmts plugin resolving .mjs");
        throw e;
      }
    }
  };
};

// src/createCache.js
var createCache = (logger) => {
  const cache = {};
  return {
    write: (entryModuleId, compiledContracts) => {
      cache[entryModuleId] = compiledContracts;
    },
    read: (entryModuleId) => {
      const out = cache[entryModuleId];
      if (!out) {
        throw new Error(
          `Cache miss for ${entryModuleId}. Try calling isCached first`
        );
      }
      return out;
    },
    isCached: (entryModuleId, sources) => {
      const previousCachedItem = cache[entryModuleId];
      if (!previousCachedItem) {
        return false;
      }
      const { sources: previousSources } = previousCachedItem;
      if (Object.keys(sources).length !== Object.keys(previousSources).length) {
        return false;
      }
      for (const [key, newSource] of Object.entries(sources)) {
        const oldSource = previousSources[key];
        if (!oldSource) {
          return false;
        }
        if (!("content" in oldSource) || !("content" in newSource)) {
          logger.error(
            "Unexpected error: Unable to use cache because content is undefined. Continuing without cache."
          );
          return false;
        }
        if (oldSource.content !== newSource.content) {
          return false;
        }
      }
      return true;
    }
  };
};

// src/unplugin.js
var import_config = require("@evmts/config");
var import_Effect = require("effect/Effect");
var import_fs = require("fs");
var import_promises = require("fs/promises");
var import_module = require("module");
var import_unplugin = require("unplugin");
var import_zod = require("zod");
var compilerOptionValidator = import_zod.z.enum(["solc", "foundry"]).default("solc").describe("compiler to use.  Defaults to solc");
var bundlers = {
  solc: bundler
};
var unpluginFn = (options = {}) => {
  let config;
  const parsedCompilerOption = compilerOptionValidator.safeParse(
    options.compiler
  );
  if (!parsedCompilerOption.success) {
    throw new Error(
      `Invalid compiler option: ${options.compiler}.  Valid options are 'solc' and 'foundry'`
    );
  }
  const compilerOption = parsedCompilerOption.data;
  if (compilerOption === "foundry") {
    throw new Error(
      "We have abandoned the foundry option despite supporting it in the past. Please use solc instead. Foundry will be added back as a compiler at a later time."
    );
  }
  const bundler2 = bundlers[compilerOption];
  let moduleResolver;
  const fao = {
    existsSync: import_fs.existsSync,
    readFile: import_promises.readFile,
    readFileSync: import_fs.readFileSync
  };
  const solcCache = createCache(console);
  return {
    name: "@evmts/rollup-plugin",
    async buildStart() {
      config = (0, import_Effect.runSync)((0, import_config.loadConfig)(process.cwd()));
      moduleResolver = bundler2(config, console, fao, solcCache);
      this.addWatchFile("./tsconfig.json");
    },
    async resolveId(id, importer, options2) {
      if (id.startsWith("@evmts/core") && !importer?.startsWith(process.cwd()) && !importer?.includes("node_modules")) {
        console.log({ id, importer, options: options2 });
        return (0, import_module.createRequire)(`${process.cwd()}/`).resolve("@evmts/core");
      }
      return null;
    },
    async load(id) {
      if (!id.endsWith(".sol")) {
        return;
      }
      if ((0, import_fs.existsSync)(`${id}.ts`)) {
        return;
      }
      if ((0, import_fs.existsSync)(`${id}.d.ts`)) {
        return;
      }
      const { code, modules } = await moduleResolver.resolveEsmModule(
        id,
        process.cwd(),
        false
      );
      Object.values(modules).forEach((module2) => {
        if (module2.id.includes("node_modules")) {
          return;
        }
        this.addWatchFile(module2.id);
      });
      return code;
    },
    ...{ version: "0.11.2" }
  };
};
var evmtsUnplugin = (0, import_unplugin.createUnplugin)(unpluginFn);
var vitePluginEvmts = (
  /** @type {typeof evmtsUnplugin.rollup} */
  /** @type {any} */
  evmtsUnplugin.vite
);
var rollupPluginEvmts = evmtsUnplugin.rollup;
var esbuildPluginEvmts = evmtsUnplugin.esbuild;
var webpackPluginEvmts = (
  /** @type {typeof evmtsUnplugin.rspack} */
  evmtsUnplugin.webpack
);
var rspackPluginEvmts = evmtsUnplugin.rspack;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bundler,
  createCache,
  esbuildPluginEvmts,
  resolveArtifacts,
  resolveArtifactsSync,
  rollupPluginEvmts,
  rspackPluginEvmts,
  vitePluginEvmts,
  webpackPluginEvmts
});
//# sourceMappingURL=index.cjs.map