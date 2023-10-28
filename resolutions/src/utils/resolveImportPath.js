import { try as trySync, succeed, async as effectAsync, fail } from 'effect/Effect'
import { formatPath } from './formatPath.js'
import { isImportLocal } from './isImportLocal.js'
import * as path from 'path'
import resolve from 'resolve'

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
			{ cause }
		)
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
 * @returns {import("effect/Effect").Effect<never, CouldNotResolveImportError,string>} absolute path to the imported file
 */
export const resolveImportPath = (
	absolutePath,
	importPath,
	remappings,
	libs,
	sync
) => {
	// Remappings
	for (const [key, value] of Object.entries(remappings)) {
		if (importPath.startsWith(key)) {
			return succeed(formatPath(path.resolve(importPath.replace(key, value))))
		}
	}
	// Local import "./LocalContract.sol"
	if (isImportLocal(importPath)) {
		return succeed(formatPath(path.resolve(path.dirname(absolutePath), importPath)))
	}
	// try resolving with node resolution
	if (sync) {
		return trySync({
			try: () => resolve.sync(importPath, {
				basedir: path.dirname(absolutePath),
				paths: libs,
			}),
			catch: (e) => new CouldNotResolveImportError(importPath, absolutePath, /** @type {Error}*/(e)),
		})
	} else {
		return effectAsync(resume => {
			resolve(importPath, {
				basedir: path.dirname(absolutePath),
				paths: libs,
			}, (err, resolvedPath) => {
				if (err) {
					resume(fail(new CouldNotResolveImportError(importPath, absolutePath, err)))
				} else if (resolvedPath === undefined) {
					resume(fail(new CouldNotResolveImportError(importPath, absolutePath, new Error('Could not resolve import'))))
				} else {
					resume(succeed(formatPath(resolvedPath)))
				}
			})
		})
	}
}
