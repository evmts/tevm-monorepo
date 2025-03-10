import { dumpStateHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmDumpState` action for viem.
 * Dumps the state of TEVM into a plain JavaScript object that can later be used to restore state
 * using the `tevmLoadState` action.
 *
 * This action is useful for persisting and restoring the state between different sessions or processes.
 *
 * @param {import from "./MemoryClient.js"').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @returns {Promise<import('@tevm/actions').DumpStateResult>} The dump of the TEVM state.
 *
 * @example
 * ```typescript
 * import { tevmDumpState } from 'tevm/actions'
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
 *   const state = await tevmDumpState(client)
 *   fs.writeFileSync('state.json', JSON.stringify(state))
 *   console.log('State dumped to state.json')
 * }
 *
 * example()
 * ```
 *
 * @see [DumpStateResult](https://tevm.sh/reference/tevm/actions/type-aliases/dumpstateresult/) for return values reference.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 * @see [tevmLoadState](https://tevm.sh/reference/tevm/actions/functions/tevmLoadState/) for restoring the state.
 */
export const tevmDumpState = async (client) => {
	return dumpStateHandler(client.transport.tevm)()
}
