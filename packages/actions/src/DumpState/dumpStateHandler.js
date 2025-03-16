import { BaseError, InternalError } from '@tevm/errors'
import { bytesToHex } from '@tevm/utils'
import { getPendingClient } from '../internal/getPendingClient.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'

/**
 * Creates a handler for dumping the TEVM state.
 *
 * @param {import("@tevm/node").TevmNode} client - The TEVM client instance.
 * @param {object} [options] - Optional settings.
 * @param {boolean} [options.throwOnFail] - Whether to throw an error if the state dump fails.
 * @returns {import('../DumpState/DumpStateHandlerType.js').DumpStateHandler} - The state dump handler function.
 *
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { dumpStateHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
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
							if ('errors' in mineResult && mineResult.errors) {
								throw mineResult.errors[0]
							}
							if ('pendingClient' in mineResult) {
								return mineResult.pendingClient.getVm()
							}
							throw new InternalError('Failed to get pending client')
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
			if (/** @type {BaseError}*/ (e)._tag) {
				return maybeThrowOnFail(throwOnFail ?? true, {
					state: {},
					// TODO we need to strongly type errors better here
					errors: [/**@type {any} */ (e)],
				})
			}
			return maybeThrowOnFail(throwOnFail ?? true, {
				state: {},
				errors: [e instanceof InternalError ? e : new InternalError('Unexpected error', { cause: e })],
			})
		}
	}
