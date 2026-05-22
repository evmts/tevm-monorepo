import { InternalError } from '@tevm/errors'
import { bytesToHex, numberToHex } from '@tevm/utils'
import { getPendingClient } from '../internal/getPendingClient.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'

/**
 * Converts TevmState (bigint fields) into SerializableTevmState (hex-string fields).
 * @param {import('@tevm/state').TevmState} state
 * @returns {import('@tevm/state').SerializableTevmState}
 */
const serializeState = (state) => {
	/** @type {import('@tevm/state').SerializableTevmState} */
	const serializedState = {}

	for (const [address, account] of Object.entries(state).sort(([a], [b]) => a.localeCompare(b))) {
		const sortedStorage = account.storage
			? Object.fromEntries(
					Object.entries(account.storage)
						.sort(([a], [b]) => a.localeCompare(b))
						.map(([key, value]) => [`0x${key}`, value]),
				)
			: undefined
		serializedState[address] = {
			nonce: numberToHex(account.nonce),
			balance: numberToHex(account.balance),
			storageRoot: account.storageRoot,
			codeHash: account.codeHash,
			...(account.deployedBytecode && { deployedBytecode: account.deployedBytecode }),
			...(sortedStorage && { storage: sortedStorage }),
		}
	}

	return serializedState
}

/**
 * Creates a handler for dumping the TEVM state.
 *
 * @param {import("@tevm/node").TevmNode} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail]
 * @returns {import('../DumpState/DumpStateHandlerType.js').DumpStateHandler}
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
							if (mineResult.errors) {
								throw mineResult.errors[0]
							}
							return mineResult.pendingClient.getVm()
						})
					: await client.getVm()
			if ('dumpCanonicalGenesis' in vm.stateManager) {
				if (blockTag === 'latest' || blockTag === 'pending') {
					const rawState = await vm.stateManager.dumpCanonicalGenesis()
					return { state: serializeState(rawState) }
				}
				const block = await vm.blockchain.getBlockByTag(blockTag)
				if (await vm.stateManager.hasStateRoot(block.header.stateRoot)) {
					const rawState = vm.stateManager._baseState.stateRoots.get(bytesToHex(block.header.stateRoot)) ?? {}
					return { state: serializeState(rawState) }
				}
				client.logger.warn(`State root does not exist for block ${blockTag}. Returning empty state`)
				return { state: {} }
			}
			throw new InternalError(
				'Unsupported state manager. Must use a TEVM state manager from `@tevm/state` package. This may indicate a bug in TEVM internal code.',
			)
		} catch (e) {
			if (/** @type {import('@tevm/errors').BaseError}*/ (e)._tag) {
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
