import { constants } from 'node:fs'
import { access } from 'node:fs/promises'
import { flatMap, logDebug, promise, tap } from 'effect/Effect'

/**
 * Checks if a file exists at the given path
 * @param {string} path - path to check
 * @returns {import("effect/Effect").Effect<never, never, boolean>} true if the file exists, false otherwise
 * @example
 * ```typescript
 * import { fileExists } from '@eth-optimism/config'
 * await fileExists('./someFile.txt')
 * ```
 * @internal
 */
export const fileExists = (path) => {
	return logDebug(`fileExists: Checking if file exists at path: ${path}`).pipe(
		flatMap(() =>
			promise(() =>
				access(path, constants.F_OK)
					.then(() => true)
					.catch(() => false),
			),
		),
		tap((exists) => logDebug(`fileExists: ${path}: ${exists}`)),
	)
}
