import { loadStateHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmLoadState` action for viem.
 * Loads the state into TEVM from a plain JavaScript object.
 *
 * This action is useful for restoring the state that was previously dumped using the `tevmDumpState` action.
 *
 * @param {import from "./MemoryClient.js"').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').LoadStateParams} params - The state to load into TEVM.
 * @returns {Promise<import('@tevm/actions').LoadStateResult>} The result of loading the state.
 *
 * @example
 * ```typescript
 * import { tevmLoadState } from 'tevm/actions'
 * import { createClient, http } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 * import fs from 'fs'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   const state = JSON.parse(fs.readFileSync('state.json', 'utf8'))
 *   const result = await tevmLoadState(client, state)
 *   console.log('State loaded:', result)
 * }
 *
 * example()
 * ```
 *
 * @see [LoadStateParams](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateparams/) for options reference.
 * @see [LoadStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/loadstateresult/) for return values reference.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 * @see [tevmDumpState](https://tevm.sh/reference/tevm/actions/functions/tevmDumpState/) for dumping the state.
 */
export const tevmLoadState = async (client, params) => {
	return loadStateHandler(client.transport.tevm)(params)
}
