/**
 * @module nativeDefineChain
 *
 * Native implementation of viem's defineChain function.
 * Creates a chain configuration object for use with TEVM and viem-compatible clients.
 *
 * This provides a drop-in replacement for viem's defineChain without requiring
 * viem as a dependency.
 */

/**
 * Define a custom EVM chain configuration.
 *
 * This is a native implementation of viem's defineChain that returns
 * a properly typed chain configuration object. The function is essentially
 * a type-safe identity function that validates and returns the chain configuration.
 *
 * @template {import('./chain-types.js').Chain} TChain
 * @param {TChain} chain - The chain configuration object
 * @returns {TChain} The same chain configuration with proper typing
 *
 * @example
 * ```javascript
 * import { nativeDefineChain } from '@tevm/utils'
 *
 * // Define a custom chain
 * const myChain = nativeDefineChain({
 *   id: 123456789,
 *   name: 'My Custom Chain',
 *   nativeCurrency: {
 *     name: 'MyCoin',
 *     symbol: 'MYC',
 *     decimals: 18,
 *   },
 *   rpcUrls: {
 *     default: {
 *       http: ['https://rpc.mychain.com'],
 *       webSocket: ['wss://ws.mychain.com'],
 *     },
 *   },
 *   blockExplorers: {
 *     default: {
 *       name: 'MyChain Explorer',
 *       url: 'https://explorer.mychain.com',
 *     },
 *   },
 * })
 *
 * // Use with TEVM memory client
 * import { createMemoryClient } from '@tevm/memory-client'
 * import { nativeHttp } from '@tevm/utils'
 *
 * const client = createMemoryClient({
 *   common: myChain,
 *   fork: {
 *     transport: nativeHttp(myChain.rpcUrls.default.http[0]),
 *   },
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Define Ethereum Mainnet
 * const mainnet = nativeDefineChain({
 *   id: 1,
 *   name: 'Ethereum',
 *   nativeCurrency: {
 *     name: 'Ether',
 *     symbol: 'ETH',
 *     decimals: 18,
 *   },
 *   rpcUrls: {
 *     default: {
 *       http: ['https://cloudflare-eth.com'],
 *     },
 *   },
 *   blockExplorers: {
 *     default: {
 *       name: 'Etherscan',
 *       url: 'https://etherscan.io',
 *       apiUrl: 'https://api.etherscan.io/api',
 *     },
 *   },
 *   contracts: {
 *     multicall3: {
 *       address: '0xcA11bde05977b3631167028862bE2a173976CA11',
 *       blockCreated: 14353601,
 *     },
 *   },
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Define an L2 chain with source chain reference
 * const optimism = nativeDefineChain({
 *   id: 10,
 *   name: 'OP Mainnet',
 *   nativeCurrency: {
 *     name: 'Ether',
 *     symbol: 'ETH',
 *     decimals: 18,
 *   },
 *   rpcUrls: {
 *     default: {
 *       http: ['https://mainnet.optimism.io'],
 *     },
 *   },
 *   blockExplorers: {
 *     default: {
 *       name: 'Optimism Explorer',
 *       url: 'https://optimistic.etherscan.io',
 *     },
 *   },
 *   sourceId: 1, // Ethereum mainnet is the L1
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Define a testnet
 * const sepolia = nativeDefineChain({
 *   id: 11155111,
 *   name: 'Sepolia',
 *   nativeCurrency: {
 *     name: 'Sepolia Ether',
 *     symbol: 'ETH',
 *     decimals: 18,
 *   },
 *   rpcUrls: {
 *     default: {
 *       http: ['https://rpc.sepolia.org'],
 *     },
 *   },
 *   blockExplorers: {
 *     default: {
 *       name: 'Sepolia Etherscan',
 *       url: 'https://sepolia.etherscan.io',
 *     },
 *   },
 *   testnet: true,
 * })
 * ```
 */
export function nativeDefineChain(chain) {
	return chain
}
