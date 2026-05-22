/**
 * Tree-shakeable `tevmReady` action. Resolves when the TEVM client (and any fork) is initialized.
 *
 * All TEVM actions implicitly await readiness, so this is only needed when you want to surface
 * initialization timing or errors explicitly (e.g. UI loading state, benchmarks, fork-connect timeout).
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @returns {Promise<true>} Resolves to `true` when ready, rejects if initialization fails.
 * @throws {Error} If initialization fails.
 *
 * @example
 * ```typescript
 * import { createMemoryClient, http } from 'tevm'
 * import { optimism } from 'tevm/common'
 *
 * const client = createMemoryClient({
 *   fork: { transport: http('https://mainnet.optimism.io')({}) },
 *   common: optimism,
 * })
 * await client.tevmReady()
 * ```
 *
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmReady = async (client) => {
	return client.transport.tevm.ready()
}
