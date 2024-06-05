import { createRequire } from 'node:module';
import { try as _try, map, logDebug, flatMap, promise, tap, all, logError, async, fail, succeed } from 'effect/Effect';
import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { parse } from 'jsonc-parser';
import resolve from 'resolve';

// src/createRequireEffect.js
var CreateRequireError = class extends Error {
  /**
   * @type {'CreateRequireError'}
   */
  _tag = "CreateRequireError";
  /**
   * @param {string} url
   * @param {object} [cause]
   * @param {unknown} [cause.cause]
   * @internal
   */
  constructor(url, options = {}) {
    super(`Failed to create require for ${url}`, options);
  }
};
var RequireError = class extends Error {
  _tag = "RequireError";
  /**
   * @param {string} url
   * @param {object} [cause]
   * @param {unknown} [cause.cause]
   * @internal
   */
  constructor(url, options = {}) {
    super(`Failed to require ${url}`, options);
  }
};
var createRequireEffect = (url) => {
  return _try({
    try: () => createRequire(url),
    catch: (cause) => new CreateRequireError(url, { cause })
  }).pipe(
    map((createdRequire) => {
      const requireAsEffect = (id) => {
        return _try({
          try: () => createdRequire(id),
          catch: (cause) => new RequireError(id, { cause })
        });
      };
      return requireAsEffect;
    })
  );
};
var fileExists = (path) => {
  return logDebug(`fileExists: Checking if file exists at path: ${path}`).pipe(
    flatMap(
      () => promise(
        () => access(path, constants.F_OK).then(() => true).catch(() => false)
      )
    ),
    tap((exists) => logDebug(`fileExists: ${path}: ${exists}`))
  );
};
var logAllErrors = (e) => {
  const errors = [e];
  let nextError = (
    /** @type {Error} */
    e
  );
  while (nextError.cause) {
    errors.unshift(nextError.cause);
    nextError = /** @type {Error} */
    nextError.cause;
  }
  return all(errors.map((e2) => logError(e2)));
};
var ParseJsonError = class extends Error {
  /**
   * @type {'ParseJsonError'}
   */
  _tag = "ParseJsonError";
  /**
   * @param {object} [options]
   * @param {unknown} [options.cause]
   */
  constructor(options = {}) {
    super("Failed to parse tsconfig.json", options);
  }
};
var parseJson = (jsonStr) => {
  return _try({
    try: () => {
      const errors = (
        /** @type {import("jsonc-parser").ParseError[]}*/
        []
      );
      const res = parse(jsonStr, errors, {
        disallowComments: false,
        allowTrailingComma: true,
        allowEmptyContent: false
      });
      if (errors.length > 0) {
        throw new AggregateError(errors);
      }
      return res;
    },
    catch: (cause) => new ParseJsonError({ cause })
  }).pipe(tap((res) => logDebug(`Parsed tsconfig.json: ${JSON.stringify(res)}`)));
};
var CouldNotResolveImportError = class extends Error {
  /**
   * @type {'CouldNotResolveImportError'}
   */
  _tag = "CouldNotResolveImportError";
  /**
   * @type {'CouldNotResolveImportError'}
   * @override
   */
  name = "CouldNotResolveImportError";
  /**
   * @param {string} importPath
   * @param {string} absolutePath
   * @param {Error} cause
   */
  constructor(importPath, absolutePath, cause) {
    super(`Could not resolve import ${importPath} from ${absolutePath}. Please check your remappings and libraries.`, {
      cause
    });
  }
};
var resolveSync = (importPath, options) => {
  return _try({
    try: () => resolve.sync(importPath, options),
    catch: (e) => new CouldNotResolveImportError(
      importPath,
      options.basedir ?? __dirname,
      /** @type {Error} */
      e
    )
  });
};
var resolveAsync = (importPath, options) => {
  return async((resume) => {
    resolve(importPath, options, (err, resolvedPath) => {
      if (err) {
        console.error(err);
        resume(fail(new CouldNotResolveImportError(importPath, options.basedir ?? "", err)));
      } else {
        resume(succeed(
          /** @type {string} */
          resolvedPath
        ));
      }
    });
  });
};

export { CouldNotResolveImportError, CreateRequireError, ParseJsonError, RequireError, createRequireEffect, fileExists, logAllErrors, parseJson, resolveAsync, resolveSync };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map