// TODO unused move this to @evmts/createRequire package
import { try as tryEffect } from 'effect/Effect'
import { map } from 'effect/Effect'
import { createRequire } from 'module'

export class CreateRequireError extends Error {
	/**
	 * @type {'CreateRequireError'}
	 */
	_tag = 'CreateRequireError'
	/**
	 * @param {string} url
	 * @param {object} [cause]
	 * @param {unknown} [cause.cause]
	 * @internal
	 */
	constructor(url, options = {}) {
		super(`Failed to create require for ${url}`, options)
	}
}

export class RequireError extends Error {
	_tag = 'RequireError'
	/**
	 * @param {string} url
	 * @param {object} [cause]
	 * @param {unknown} [cause.cause]
	 * @internal
	 */
	constructor(url, options = {}) {
		super(`Failed to require ${url}`, options)
	}
}

/**
 * An {@link https://www.effect.website/docs/introduction Effect} wrapper around createRequire
 * createRequire is used to use the node.js `require` function in esm modules and cjs modules
 * in a way that is compatible with both. It also wraps them weith Effect for better error handling
 * @param {string} url - url to create require from
 * @returns {import("effect/Effect").Effect<never, CreateRequireError, (id: string) => import("effect/Effect").Effect<never, RequireError, ReturnType<NodeRequire>>>} require function
 * @example
 * ```typescript
 * import { createRequireEffect } from '@eth-optimism/config'
 * const requireEffect = createRequireEffect(import.meta.url)
 * const solcEffect = requireEffect('solc')
 * ```
 * @see https://nodejs.org/api/modules.html#modules_module_createrequire_filename
 * @internal
 */
export const createRequireEffect = (url) => {
	return tryEffect({
		try: () => createRequire(url),
		catch: (cause) => new CreateRequireError(url, { cause }),
	}).pipe(
		map((createdRequire) => {
			/**
			 * Same as require but returns a module as an Effect
			 * @param {string} id
			 * @returns {import("effect/Effect").Effect<never, RequireError, ReturnType<NodeRequire>>}
			 */
			const requireAsEffect = (id) => {
				return tryEffect({
					try: () => createdRequire(id),
					catch: (cause) => new RequireError(id, { cause }),
				})
			}
			return requireAsEffect
		}),
	)
}
