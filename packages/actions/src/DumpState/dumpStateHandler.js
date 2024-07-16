import { InternalError } from '@tevm/errors'
import { bytesToHex } from '@tevm/utils'
import { getPendingClient } from '../internal/getPendingClient.js'
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
	async ({ throwOnFail = options.throwOnFail, blockTag = 'latest' } = {}) => {
		try {
			const vm =
				blockTag === 'pending'
					? await getPendingClient(client).then((mineResult) => {
							if (mineResult.errors) {
								throw mineResult.errors[0]
							}
							return mineResult.pendingClient.getVm()
						})
					: await client.getVm()
			if ('dumpCanonicalGenesis' in vm.stateManager) {
				if (blockTag === 'latest' || blockTag === 'pending') {
					return { state: await vm.stateManager.dumpCanonicalGenesis() }
				}
				const block = await vm.blockchain.getBlockByTag(blockTag)
				if (await vm.stateManager.hasStateRoot(block.header.stateRoot)) {
					return { state: vm.stateManager._baseState.stateRoots.get(bytesToHex(block.header.stateRoot)) ?? {} }
				}
				client.logger.warn(`State root does not exist for block ${blockTag}. Returning empty state`)
				return { state: {} }
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
