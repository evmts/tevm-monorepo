import { dumpStateHandler } from '@tevm/actions'

/**
 * Tree-shakeable `tevmDumpState` action. Exports the full TEVM blockchain state as a serializable object.
 *
 * Output includes account state, contract bytecode, receipts, and block history. Pair with
 * {@link tevmLoadState} to restore. BigInt values must be handled when serializing to JSON.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @returns {Promise<import('@tevm/actions').DumpStateResult>} Serializable snapshot of the blockchain state.
 *
 * @example
 * ```typescript
 * import { tevmDumpState } from 'tevm/actions'
 * import { createClient } from 'viem'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({ transport: createTevmTransport() })
 * const state = await tevmDumpState(client)
 * ```
 *
 * @see [DumpStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/dumpstateresult/)
 */
export const tevmDumpState = async (client) => {
	return dumpStateHandler(client.transport.tevm)()
}
