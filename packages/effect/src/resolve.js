import {
	async as effectAsync,
	fail,
	succeed,
	try as trySync,
} from 'effect/Effect'
import resolve from 'resolve'

/**
 * @typedef {(importPath: string, options: import('resolve').SyncOpts & import('resolve').AsyncOpts) => import('effect/Effect').Effect<never, CouldNotResolveImportError, string>} ResolveSafe
 */

/**
 * Error thrown when 'node:resolve' throws
 */
export class CouldNotResolveImportError extends Error {
	/**
	 * @type {'CouldNotResolveImportError'}
	 */
	_tag = 'CouldNotResolveImportError'
	/**
	 * @type {'CouldNotResolveImportError'}
	 * @override
	 */
	name = 'CouldNotResolveImportError'
	/**
	 * @param {string} importPath
	 * @param {string} absolutePath
	 * @param {Error} cause
	 */
	constructor(importPath, absolutePath, cause) {
		super(
			`Could not resolve import ${importPath} from ${absolutePath}. Please check your remappings and libraries.`,
			{ cause },
		)
	}
}

/**
 * Effect wrapper around import('node:resolve').resolveSync
 * @type {ResolveSafe}
 * @example
 * ```ts
 * import {tap} from 'effect/Effect'
 * import {resolveSync} from '@evmts/effect'
 * resolveSync('react').pipe(
 *    tap(console.log)
 * )
 * ````
 * `
 */
export const resolveSync = (importPath, options) => {
	return trySync({
		try: () => resolve.sync(importPath, options),
		catch: (e) =>
			new CouldNotResolveImportError(
				importPath,
				options.basedir ?? __dirname,
				/** @type {Error} */ (e),
			),
	})
}

/**
 * Effect wrpper around import('node:resolve')
 * @type {ResolveSafe}
 * @example
 * ```ts
 * import {tap} from 'effect/Effect'
 * import {resolveAsync} from '@evmts/effect'
 * resolveAsync('react').pipe(
 *    tap(console.log)
 * )
 * ````
 */
export const resolveAsync = (importPath, options) => {
	return effectAsync((resume) => {
		resolve(importPath, options, (err, resolvedPath) => {
			if (err) {
				console.error(err)
				resume(
					fail(
						new CouldNotResolveImportError(
							importPath,
							options.basedir ?? '',
							err,
						),
					),
				)
			} else {
				resume(succeed(/** @type {string} */ (resolvedPath)))
			}
		})
	})
}
