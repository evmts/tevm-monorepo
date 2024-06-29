import { InternalError } from '@tevm/errors'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { validateLoadStateParams } from './validateLoadStateParams.js'

/**
 * @internal
 * Creates a handler for loading a previously dumped state into the VM.
 *
 * @param {import("@tevm/base-client").BaseClient} client - The base client instance.
 * @param {object} [options] - Optional configuration.
 * @param {boolean} [options.throwOnFail] - Whether to throw an error when a failure occurs.
 * @returns {import('./LoadStateHandlerType.js').LoadStateHandler} - The handler function.
 *
 * @example
 * ```typescript
 * import { createClient } from 'tevm'
 * import { loadStateHandler } from 'tevm/actions'
 * import fs from 'fs'
 *
 * const client = createClient()
 * const loadState = loadStateHandler(client)
 *
 * const state = JSON.parse(fs.readFileSync('state.json'))
 * const result = await loadState({ state })
 * if (result.errors) {
 *   console.error('Failed to load state:', result.errors)
 * }
 * ```
 *
 * @see {@link LoadStateParams}
 * @see {@link LoadStateResult}
 * @see {@link TevmLoadStateError}
 */
export const loadStateHandler =
	(client, options = {}) =>
	async ({ throwOnFail = options.throwOnFail ?? true, ...params }) => {
		const errors = validateLoadStateParams(params)
		if (errors.length > 0) {
			return maybeThrowOnFail(throwOnFail, { errors })
		}
		try {
			const vm = await client.getVm()
			if ('generateCanonicalGenesis' in vm.stateManager) {
				await vm.stateManager.generateCanonicalGenesis(params.state)
			} else {
				throw new Error(
					'Unsupported state manager. Must use a Tevm state manager from `@tevm/state` package. This may indicate a bug in tevm internal code.',
				)
			}
			return {}
		} catch (e) {
			return maybeThrowOnFail(throwOnFail, {
				errors: [new InternalError('UnexpectedError', { cause: e })],
			})
		}
	}
