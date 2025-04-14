import { dirname, resolve as pathResolve } from "node:path";
import {
  async as effectAsync,
  fail,
  succeed,
  try as trySync,
} from "effect/Effect";
import resolve from "resolve";
import { formatPath } from "./formatPath.js";
import { isImportLocal } from "./isImportLocal.js";

export class CouldNotResolveImportError extends Error {
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
    super(
      `Could not resolve import ${importPath} from ${absolutePath}. Please check your remappings and libraries.`,
      {
        cause,
      },
    );
  }
}

/**
 * Resolve import statement to absolute file path
 *
 * @param {string} importPath import statement in *.sol contract
 * @param {string} absolutePath absolute path to the contract
 * @param {Record<string, string>} remappings remappings from the config
 * @param {ReadonlyArray<string>} libs libs from the config
 * @param {boolean} sync Whether to run this synchronously or not
 * @returns {import("effect/Effect").Effect<string, CouldNotResolveImportError,never>} absolute path to the imported file
 * @example
 * ```ts
 * const pathToSolidity = path.join(__dirname, '../Contract.sol')
 * ```
 */
export const resolveImportPath = (
  absolutePath,
  importPath,
  remappings,
  libs,
  sync,
) => {
  for (const [key, value] of Object.entries(remappings)) {
    if (importPath.startsWith(key)) {
      return succeed(formatPath(pathResolve(importPath.replace(key, value))));
    }
  }
  if (isImportLocal(importPath)) {
    return succeed(formatPath(pathResolve(dirname(absolutePath), importPath)));
  }
  if (sync) {
    return trySync({
      try: () =>
        resolve.sync(importPath, {
          basedir: dirname(absolutePath),
          paths: libs,
        }),
      catch: (e) =>
        new CouldNotResolveImportError(
          importPath,
          absolutePath,
          /** @type {Error}*/ (e),
        ),
    });
  }
  return effectAsync((resume) => {
    resolve(
      importPath,
      {
        basedir: dirname(absolutePath),
        paths: libs,
      },
      (err, resolvedPath) => {
        if (err) {
          resume(
            fail(new CouldNotResolveImportError(importPath, absolutePath, err)),
          );
        } else {
          resume(succeed(formatPath(/** @type {string} */ (resolvedPath))));
        }
      },
    );
  });
};
