import { resolveArtifacts, resolveArtifactsSync } from '@tevm/compiler';
import { generateRuntime } from '@tevm/runtime';
import { runPromise, runSync } from 'effect/Effect';

// src/readCache.js
var readCache = async (logger, cache, modulePath, includeAst, includeBytecode) => {
  try {
    const cachedArtifacts = await cache.readArtifacts(modulePath);
    const isCachedAsts = () => (cachedArtifacts == null ? void 0 : cachedArtifacts.asts) && Object.keys(cachedArtifacts.asts).length > 0;
    const isCachedBytecode = () => Object.values((cachedArtifacts == null ? void 0 : cachedArtifacts.artifacts) ?? {}).some(
      (artifact) => artifact.evm.deployedBytecode
    );
    if (!cachedArtifacts) {
      return void 0;
    }
    if (includeAst && !isCachedAsts()) {
      return void 0;
    }
    if (includeBytecode && !isCachedBytecode()) {
      return void 0;
    }
    return cachedArtifacts;
  } catch (e) {
    logger.error(
      `there was an error in tevm plugin reading cache for ${modulePath}. Continuing without cache. This may hurt performance`
    );
    logger.error(
      /** @type any */
      e
    );
    return void 0;
  }
};

// src/writeCache.js
var writeCache = async (logger, cache, artifacts, code, modulePath, moduleType, writeArtifacts) => {
  const promises = [];
  if (writeArtifacts) {
    promises.push(cache.writeArtifacts(modulePath, artifacts));
  }
  if (moduleType === "dts") {
    promises.push(cache.writeDts(modulePath, code));
  } else if (moduleType === "mjs") {
    promises.push(cache.writeMjs(modulePath, code));
  } else {
    logger.warn(`No caching for module type ${moduleType}} implemented yet`);
  }
  await Promise.all(promises);
};
var resolveModuleAsync = async (logger, config, fao, solc, modulePath, basedir, includeAst, includeBytecode, moduleType, cache) => {
  const cachedResult = await readCache(
    logger,
    cache,
    modulePath,
    includeAst,
    includeBytecode
  );
  try {
    const { solcInput, solcOutput, asts, artifacts, modules } = cachedResult ?? await resolveArtifacts(
      modulePath,
      basedir,
      logger,
      config,
      includeAst,
      includeBytecode,
      fao,
      solc
    );
    let code = "";
    const artifactsExist = artifacts && Object.keys(artifacts).length > 0;
    if (artifactsExist) {
      code = await runPromise(
        generateRuntime(artifacts, moduleType, includeBytecode)
      );
    } else {
      const message = `there were no artifacts for ${modulePath}. This is likely a bug in tevm`;
      code = `// ${message}`;
      logger.warn(message);
    }
    writeCache(
      logger,
      cache,
      { solcInput, solcOutput, asts, artifacts, modules },
      code,
      modulePath,
      moduleType,
      // This is kinda quick and dirty but works for now
      // We are skipping writing artifacts if there is an error
      // But still write dts and mjs files since they always
      // fall back to generating an empty file with error messages
      artifactsExist
    ).catch((e) => {
      logger.error(e);
      logger.error(
        "there was an error writing to the cache. This may cause peformance issues"
      );
    });
    return { solcInput, solcOutput, asts, modules, code };
  } catch (e) {
    logger.error(`there was an error in tevm plugin resolving .${moduleType}`);
    logger.error(
      /** @type any */
      e
    );
    throw e;
  }
};

// src/readCacheSync.js
var readCacheSync = (logger, cache, modulePath, includeAst, includeBytecode) => {
  try {
    const cachedArtifacts = cache.readArtifactsSync(modulePath);
    const isCachedAsts = () => (cachedArtifacts == null ? void 0 : cachedArtifacts.asts) && Object.keys(cachedArtifacts.asts).length > 0;
    const isCachedBytecode = () => Object.values((cachedArtifacts == null ? void 0 : cachedArtifacts.artifacts) ?? {}).some(
      (artifact) => artifact.evm.deployedBytecode
    );
    if (!cachedArtifacts) {
      return void 0;
    }
    if (includeAst && !isCachedAsts()) {
      return void 0;
    }
    if (includeBytecode && !isCachedBytecode()) {
      return void 0;
    }
    return cachedArtifacts;
  } catch (e) {
    logger.error(
      `there was an error in tevm plugin reading cache for ${modulePath}. Continuing without cache. This may hurt performance`
    );
    logger.error(
      /** @type any */
      e
    );
    return void 0;
  }
};

// src/writeCacheSync.js
var writeCacheSync = (logger, cache, artifacts, code, modulePath, moduleType, writeArtifacts) => {
  if (writeArtifacts) {
    cache.writeArtifactsSync(modulePath, artifacts);
  }
  if (moduleType === "dts") {
    cache.writeDts(modulePath, code);
  } else if (moduleType === "mjs") {
    cache.writeMjs(modulePath, code);
  } else {
    logger.warn(`No caching for module type ${moduleType}} implemented yet`);
  }
};
var resolveModuleSync = (logger, config, fao, solc, modulePath, basedir, includeAst, includeBytecode, moduleType, cache) => {
  const cachedResult = readCacheSync(
    logger,
    cache,
    modulePath,
    includeAst,
    includeBytecode
  );
  try {
    const { solcInput, solcOutput, asts, artifacts, modules } = cachedResult ?? resolveArtifactsSync(
      modulePath,
      basedir,
      logger,
      config,
      includeAst,
      includeBytecode,
      fao,
      solc
    );
    let code = "";
    const artifactsExist = artifacts && Object.keys(artifacts).length > 0;
    if (artifactsExist) {
      code = runSync(generateRuntime(artifacts, moduleType, includeBytecode));
    } else {
      const message = `there were no artifacts for ${modulePath}. This is likely a bug in tevm`;
      code = `// ${message}`;
      logger.warn(message);
    }
    writeCacheSync(
      logger,
      cache,
      { solcInput, solcOutput, asts, artifacts, modules },
      code,
      modulePath,
      moduleType,
      // This is kinda quick and dirty but works for now
      // We are skipping writing artifacts if there is an error
      // But still write dts and mjs files since they always
      // fall back to generating an empty file with error messages
      artifactsExist
    );
    return { solcInput, solcOutput, asts, modules, code };
  } catch (e) {
    logger.error(`there was an error in tevm plugin resolving .${moduleType}`);
    logger.error(
      /** @type any */
      e
    );
    throw e;
  }
};

// src/bundler.js
var bundler = (config, logger, fao, solc, cache) => {
  return {
    name: bundler.name,
    config,
    resolveDts: (modulePath, basedir, includeAst, includeBytecode) => resolveModuleAsync(
      logger,
      config,
      fao,
      solc,
      modulePath,
      basedir,
      includeAst,
      includeBytecode,
      "dts",
      cache
    ),
    resolveDtsSync: (modulePath, basedir, includeAst, includeBytecode) => resolveModuleSync(
      logger,
      config,
      fao,
      solc,
      modulePath,
      basedir,
      includeAst,
      includeBytecode,
      "dts",
      cache
    ),
    resolveTsModuleSync: (modulePath, basedir, includeAst, includeBytecode) => resolveModuleSync(
      logger,
      config,
      fao,
      solc,
      modulePath,
      basedir,
      includeAst,
      includeBytecode,
      "ts",
      cache
    ),
    resolveTsModule: (modulePath, basedir, includeAst, includeBytecode) => resolveModuleAsync(
      logger,
      config,
      fao,
      solc,
      modulePath,
      basedir,
      includeAst,
      includeBytecode,
      "ts",
      cache
    ),
    resolveCjsModuleSync: (modulePath, basedir, includeAst, includeBytecode) => resolveModuleSync(
      logger,
      config,
      fao,
      solc,
      modulePath,
      basedir,
      includeAst,
      includeBytecode,
      "cjs",
      cache
    ),
    resolveCjsModule: (modulePath, basedir, includeAst, includeBytecode) => resolveModuleAsync(
      logger,
      config,
      fao,
      solc,
      modulePath,
      basedir,
      includeAst,
      includeBytecode,
      "cjs",
      cache
    ),
    resolveEsmModuleSync: (modulePath, basedir, includeAst, includeBytecode) => resolveModuleSync(
      logger,
      config,
      fao,
      solc,
      modulePath,
      basedir,
      includeAst,
      includeBytecode,
      "mjs",
      cache
    ),
    resolveEsmModule: (modulePath, basedir, includeAst, includeBytecode) => resolveModuleAsync(
      logger,
      config,
      fao,
      solc,
      modulePath,
      basedir,
      includeAst,
      includeBytecode,
      "mjs",
      cache
    )
  };
};

export { bundler };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map