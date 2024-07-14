import { InternalError } from '@tevm/errors'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { getPendingClient } from '../internal/getPendingClient.js'

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
	async ({ throwOnFail = options.throwOnFail, blockTag } = {}) => {
		try {
			const vm =
				blockTag === 'pending' ? await getPendingClient(client).then(({ getVm }) => getVm()) : await client.getVm()
			if ('dumpCanonicalGenesis' in vm.stateManager) {
				if (blockTag === 'latest' || blockTag === 'pending') {
					return { state: await vm.stateManager.dumpCanonicalGenesis() }
				}
				const block = await vm.blockchain.getBlock(blockTag)
				const stateManager = vm.stateManager.setStateRoot(blockTag)
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
