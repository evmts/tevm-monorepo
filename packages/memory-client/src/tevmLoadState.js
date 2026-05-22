import { loadStateHandler } from '@tevm/actions'

/**
 * Tree-shakeable `tevmLoadState` action. Replaces TEVM state with a previously dumped snapshot.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').LoadStateParams} params - State object previously produced by {@link tevmDumpState}.
 * @returns {Promise<import('@tevm/actions').LoadStateResult>} Result of the load operation.
 *
 * @example
 * ```typescript
 * import { tevmLoadState } from 'tevm/actions'
 * import { createClient } from 'viem'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({ transport: createTevmTransport() })
 * await tevmLoadState(client, savedState)
 * ```
 *
 * @see [LoadStateParams](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateparams/)
 * @see [LoadStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateresult/)
 *
 * @throws {Error} If the provided state is invalid or incompatible.
 */
export const tevmLoadState = async (client, params) => {
	return loadStateHandler(client.transport.tevm)(params)
}
