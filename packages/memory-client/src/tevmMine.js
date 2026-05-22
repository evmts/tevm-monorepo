import { mineHandler } from '@tevm/actions'

/**
 * Tree-shakeable `tevmMine` action. Mines pending transactions into new blocks, advancing canonical state.
 *
 * In manual mining mode (the default), state changes from transactions only take effect once mined.
 * Auto- and interval-mining modes are configured via `createMemoryClient({ miningConfig })`.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').MineParams} [params] - Optional parameters (blockCount, interval).
 * @returns {Promise<import('@tevm/actions').MineResult>} Mining result including an array of block hashes.
 *
 * @example
 * ```typescript
 * import { tevmMine } from 'tevm/actions'
 * import { createClient } from 'viem'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({ transport: createTevmTransport() })
 * const { blockHashes } = await tevmMine(client, { blockCount: 5, interval: 10 })
 * ```
 *
 * @see [MineParams](https://tevm.sh/reference/tevm/actions/type-aliases/mineparams/) for options reference.
 * @see [MineResult](https://tevm.sh/reference/tevm/actions/type-aliases/mineresult/) for return values reference.
 */
export const tevmMine = async (client, params) => {
	return mineHandler(client.transport.tevm)(params)
}
