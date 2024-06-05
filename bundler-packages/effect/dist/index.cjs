'use strict';

var module$1 = require('module');
var Effect = require('effect/Effect');
var fs = require('fs');
var promises = require('fs/promises');
var jsoncParser = require('jsonc-parser');
var resolve = require('resolve');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var resolve__default = /*#__PURE__*/_interopDefault(resolve);

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
  return Effect.try({
    try: () => module$1.createRequire(url),
    catch: (cause) => new CreateRequireError(url, { cause })
  }).pipe(
    Effect.map((createdRequire) => {
      const requireAsEffect = (id) => {
        return Effect.try({
          try: () => createdRequire(id),
          catch: (cause) => new RequireError(id, { cause })
        });
      };
      return requireAsEffect;
    })
  );
};
var fileExists = (path) => {
  return Effect.logDebug(`fileExists: Checking if file exists at path: ${path}`).pipe(
    Effect.flatMap(
      () => Effect.promise(
        () => promises.access(path, fs.constants.F_OK).then(() => true).catch(() => false)
      )
    ),
    Effect.tap((exists) => Effect.logDebug(`fileExists: ${path}: ${exists}`))
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
  return Effect.all(errors.map((e2) => Effect.logError(e2)));
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
  return Effect.try({
    try: () => {
      const errors = (
        /** @type {import("jsonc-parser").ParseError[]}*/
        []
      );
      const res = jsoncParser.parse(jsonStr, errors, {
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
  }).pipe(Effect.tap((res) => Effect.logDebug(`Parsed tsconfig.json: ${JSON.stringify(res)}`)));
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
  return Effect.try({
    try: () => resolve__default.default.sync(importPath, options),
    catch: (e) => new CouldNotResolveImportError(
      importPath,
      options.basedir ?? __dirname,
      /** @type {Error} */
      e
    )
  });
};
var resolveAsync = (importPath, options) => {
  return Effect.async((resume) => {
    resolve__default.default(importPath, options, (err, resolvedPath) => {
      if (err) {
        console.error(err);
        resume(Effect.fail(new CouldNotResolveImportError(importPath, options.basedir ?? "", err)));
      } else {
        resume(Effect.succeed(
          /** @type {string} */
          resolvedPath
        ));
      }
    });
  });
};

exports.CouldNotResolveImportError = CouldNotResolveImportError;
exports.CreateRequireError = CreateRequireError;
exports.ParseJsonError = ParseJsonError;
exports.RequireError = RequireError;
exports.createRequireEffect = createRequireEffect;
exports.fileExists = fileExists;
exports.logAllErrors = logAllErrors;
exports.parseJson = parseJson;
exports.resolveAsync = resolveAsync;
exports.resolveSync = resolveSync;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map