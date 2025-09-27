import { InternalError } from '@tevm/errors'
import { hexToBigInt } from '@tevm/utils'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { validateLoadStateParams } from './validateLoadStateParams.js'

/**
 * Converts SerializableTevmState with Hex strings to TevmState with BigInt values
 * @param {import('@tevm/state').SerializableTevmState} serializedState - The serialized state to convert
 * @returns {import('@tevm/state').TevmState} The deserialized state
 */
const deserializeState = (serializedState) => {
	/** @type {import('@tevm/state').TevmState} */
	const state = {}

	for (const [address, account] of Object.entries(serializedState)) {
		/** @type {import('@tevm/utils').Address} */
		const addressKey = /** @type {import('@tevm/utils').Address} */ (address)
		state[addressKey] = {
			nonce: hexToBigInt(account.nonce),
			balance: hexToBigInt(account.balance),
			storageRoot: account.storageRoot,
			codeHash: account.codeHash,
			...(account.deployedBytecode && { deployedBytecode: account.deployedBytecode }),
			...(account.storage && {
				storage: {
					...Object.fromEntries(Object.entries(account.storage).map(([key, value]) => [key.replace(/^0x/, ''), value])),
				},
			}),
		}
	}

	return state
}

/**
 * @internal
 * Creates a handler for loading a previously dumped state into the VM.
 *
 * @param {import("@tevm/node").TevmNode} client - The base client instance.
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
				const deserializedState = deserializeState(params.state)
				await vm.stateManager.generateCanonicalGenesis(deserializedState)
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
