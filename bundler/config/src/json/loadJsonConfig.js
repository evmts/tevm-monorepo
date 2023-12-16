import { parseJson } from '@tevm/effect'
import {
  catchTag,
  die,
  fail,
  flatMap,
  logDebug,
  tap,
  try as tryEffect,
} from 'effect/Effect'
import { readFileSync } from 'fs'
import * as path from 'path'
import { validateUserConfig } from '../config/validateUserConfig.js'

export class FailedToReadConfigError extends Error {
  /**
   * @type {'FailedToReadConfigError'}
   */
  _tag = 'FailedToReadConfigError'
  /**
   * @param {string} configFilePath
   * @param {object} [options]
   * @param {unknown} [options.cause]
   */
  constructor(configFilePath, options) {
    super(`Failed to find ${configFilePath}/tsconfig.json`, options)
  }
}

/**
 * TypeError thrown when the user provided config factory is incorrectly typed
 * @internal
 */
export class InvalidJsonConfigError extends TypeError {
  /**
   * @type {'InvalidConfigError'}
   */
  _tag = 'InvalidConfigError'
  /**
   * @param {object} [options]
   * @param {unknown} [options.cause]
   */
  constructor(options) {
    super('Invalid tsconfig.json detected', options)
  }
}

/**
 * @typedef {import("@tevm/effect").ParseJsonError | FailedToReadConfigError | InvalidJsonConfigError} LoadJsonConfigError
 * @internal
 */

/**
 * Asyncronously loads an Tevm config from the given path
 * @param {string} configFilePath
 * @returns {import("effect/Effect").Effect<never, LoadJsonConfigError, import('../types.js').CompilerConfig>} the contents of the tsconfig.json file
 * @internal
 */
export const loadJsonConfig = (configFilePath) => {
  const tevmConfigPath = path.join(configFilePath, 'tevm.json')
  return tryEffect({
    try: () =>
      readFileSync(tevmConfigPath, 'utf8'),
    catch: (cause) => new FailedToReadConfigError(configFilePath, { cause }),
  }).pipe(
    flatMap(parseJson),
    catchTag('ParseJsonError', (cause) =>
      fail(new InvalidJsonConfigError({ cause })),
    ),
    flatMap(cfg => validateUserConfig(() => /** @type {import('../types.js').CompilerConfig}*/(cfg))),
    // it can't throw. Could clean this up via making validateUserConfig take a config instead of a factory
    catchTag('ConfigFnThrowError', (e) => die(e)),
    tap((tsConfig) =>
      logDebug(
        `loading tsconfig from ${configFilePath}: ${JSON.stringify(tsConfig)}`,
      ),
    ),
  )
}
