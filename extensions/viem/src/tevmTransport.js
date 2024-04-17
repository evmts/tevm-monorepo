import { createTransport } from 'viem'

/**
 * Creates a [viem transport](https://viem.sh/docs/glossary/types#transport) using [Tevm client](https://tevm.sh/reference/tevm/client-types/type-aliases/tevmclient) as an in memory ethereum backend.
 * The tevm transport supports most ethereum JSON-RPC methods alng with anvil_ hardhat_ and ganache_ methods.
 * It also supports unique tevm_ methods
 * @param {{request: import('@tevm/decorators').EIP1193RequestFn}} tevm - Any Tevm instance
 * @param {Pick<import('viem').TransportConfig, 'name' | 'key'>} [options] - Optional transport options
 * @returns {import('viem').Transport} A viem transport
 *
 * ## Why use viem?
 *
 * Viem is the recomended api for interacting with Tevm for most developers. Tevm can be used without
 * viem but using viem provides a more consistent experience across a code base and a standard for
 * plugging into third party tools that you may already be using.
 *
 * Tevm supports the following
 * - [publicClients](https://viem.sh/docs/clients/public.html)
 * - [testClient](https://viem.sh/docs/clients/test.html)
 *
 * Tevm does not support the following but will in future release.
 * - [walletClient](https://viem.sh/docs/clients/wallet.html)
 *
 * You can still send writes to tevm using the `client.request` method with the `eth_sendTransaction` method.
 *
 * @example
 * ```typescript
 * // Test client example
 * import { createMemoryClient } from 'tevm/memory-client'
 * import { tevmTransport } from 'tevm/viem'
 * import { createPublicClient } from 'viem'
 * import { optimism } from 'viem/chains'
 *
 * const tevm = createMemoryClient({
 *   fork: {
 *     url: 'https://mainnet.optimism.io'
 *   }
 * })
 *
 * const publicClient = createPublicClient({
 *  transport: tevmTransport(tevm),
 *  chain: optimism
 * })
 *
 * const blockNumber = await publicClient.getBlockNumber()
 * ```
 *
 * You can also use a viem test client which will allow you to modify the tevm state.
 * @example
 * ```typescript
 * import { createMemoryClient } from 'tevm/memory-client'
 * import { tevmTransport } from 'tevm/viem'
 * import { createTestClient, parseEther } from 'viem'
 * import { optimism } from 'viem/chains'
 *
 * const tevm = createMemoryClient({
 *   fork: {
 *     url: 'https://mainnet.optimism.io'
 *   }
 * })
 *
 * export const testClient = createTestClient({
 *   transport: tevmTransport(tevm),
 *   chain: optimism
 *   // tevm supports anvil ganache and hardhat modes
 *   mode: 'anvil'
 * })
 *
 * await testClient.setBalance(`0x${'42'.repeat(20)}`, parseEther('100')))
 * ```
 *
 * Tevm does not fully support wallet clients yet but you can use `sendTransaction` and `sendRawTransaction` to send transactions to tevm
 * as a workaround in meantime.
 *
 * ## viemTevmExtension
 *
 * Optionally use the `viemTevmExtension` to add additional actions to your viem client
 * such as `client.setAccount`, client.getAccount`, `client.script` `client.dumpState` and more.
 *
 * The Tevm client supports a special API built directly for tevm. For example, tevm.setAccount is a simple
 * api for modifying bytecode, balance, and storage of any account in one action call. tevm.script supports
 * running arbitrary solidity scripts.
 *
 * This API is not part of viem but can be added with the Tevm decorator.
 *
 * @example
 * ```typescript
 * import { createMemoryClient } from 'tevm/memory-client'
 * import { tevmTransport, tevmExtension } from 'tevm/viem'
 * import { createPublicClient } from 'viem'
 * import { optimism } from 'viem/chains'
 *
 * const tevm = createMemoryClient({
 *   fork: {
 *   url: 'https://mainnet.optimism.io'
 * }
 *
 * const publicClient = createPublicClient({
 *   transport: tevmTransport(tevm, {
 *   	 name: 'Tevm transport',
 *   	 key: 'tevm'
 *   }),
 * // extend the client with additional actions that will be added to the `tevm` namespace
 * }).extend(tevmExtension())
 *
 * // Now you can use entire tevm api
 * await publicClient.tevm.setAccount(`0x${'42'.repeat(20)}`, {
 *  balance: 100000000000000000000n,
 *  nonce: 0n,
 *  code: '0x',
 * })
 * ```
 */
export const tevmTransport = ({ request }, options) => {
	return () => {
		return createTransport({
			request: /** @type any*/ (request),
			type: 'tevm',
			name: options?.name ?? 'Tevm transport',
			key: options?.key ?? 'tevm',
		})
	}
}
