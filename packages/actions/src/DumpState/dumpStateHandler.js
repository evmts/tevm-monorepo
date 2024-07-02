import { InternalError } from '@tevm/errors'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'

/**
 * Creates a handler for dumping the TEVM state.
 *
 * @param {import("@tevm/base-client").BaseClient} client - The TEVM client instance.
 * @param {object} [options] - Optional settings.
 * @param {boolean} [options.throwOnFail] - Whether to throw an error if the state dump fails.
 * @returns {import('../DumpState/DumpStateHandlerType.js').DumpStateHandler} - The state dump handler function.
 *
 * @example
 * ```typescript
 * import { createBaseClient } from 'tevm/base-client'
 * import { dumpStateHandler } from 'tevm/actions'
 *
 * const client = createBaseClient()
 *
 * const dumpState = dumpStateHandler(client)
 *
 * const { state, errors } = await dumpState()
 * if (errors) {
 *   console.error(errors)
 * } else {
 *   console.log(state)
 * }
 * ```
 */
export const dumpStateHandler =
	(client, options = {}) =>
	async ({ throwOnFail = options.throwOnFail } = {}) => {
		try {
			const vm = await client.getVm()
			if ('dumpCanonicalGenesis' in vm.stateManager) {
				return { state: await vm.stateManager.dumpCanonicalGenesis() }
			}
			throw new InternalError(
				'Unsupported state manager. Must use a TEVM state manager from `@tevm/state` package. This may indicate a bug in TEVM internal code.',
			)
		} catch (e) {
			return maybeThrowOnFail(throwOnFail ?? true, {
				state: {},
				errors: [e instanceof InternalError ? e : new InternalError('Unexpected error', { cause: e })],
			})
		}
	}
