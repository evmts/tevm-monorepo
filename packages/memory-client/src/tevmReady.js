/**
 * A tree-shakeable version of the `tevmReady` action for viem.
 * Checks if TEVM is ready.
 *
 * This function ensures that the TEVM is fully initialized and ready for operations.
 * It resolves to `true` if the TEVM is ready, and throws an error if the VM fails to initialize.
 *
 * Note: It is not necessary to explicitly call `tevmReady` because all actions implicitly wait for TEVM to be ready.
 * However, this can be useful if you want to isolate initialization from the action, for example, when running benchmark tests.
 *
 * @param {import from "./MemoryClient.js"').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @returns {Promise<true>} Resolves when ready, rejects if VM fails to initialize.
 * @throws {Error} If the VM fails to initialize.
 *
 * @example
 * ```typescript
 * import { tevmReady } from 'tevm/actions'
 * import { createClient, http } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   try {
 *     await tevmReady(client)
 *     console.log('TEVM is ready')
 *   } catch (error) {
 *     console.error('Failed to initialize TEVM:', error)
 *   }
 * }
 *
 * example()
 * ```
 *
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmReady = async (client) => {
	return client.transport.tevm.ready()
}
