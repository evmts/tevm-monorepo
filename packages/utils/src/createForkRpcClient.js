/**
 * @module createForkRpcClient
 *
 * Creates a fork RPC client from an EIP-1193 request function.
 * This provides a viem-compatible API (getBytecode, getStorageAt, getProof)
 * without requiring viem as a dependency.
 */

/**
 * @typedef {import('./hex-types.js').Hex} Hex
 */

/**
 * @typedef {Object} ProofResult
 * @property {Hex} address - The address of the account
 * @property {bigint} balance - Account balance
 * @property {bigint} nonce - Account nonce
 * @property {Hex} codeHash - Hash of the account code
 * @property {Hex} storageHash - Root hash of the account's storage trie
 * @property {Hex[]} accountProof - Array of rlp-encoded MerkleTree-Nodes, starting with the stateRoot-Node
 * @property {Array<{key: Hex, value: Hex, proof: Hex[]}>} storageProof - Array of storage-entries as requested
 */

/**
 * @typedef {Object} ForkRpcClient
 * @property {(params: { address: Hex, blockNumber?: bigint, blockTag?: string }) => Promise<Hex | undefined>} getBytecode - Get contract bytecode
 * @property {(params: { address: Hex, slot: Hex, blockNumber?: bigint, blockTag?: string }) => Promise<Hex>} getStorageAt - Get storage value at slot
 * @property {(params: { address: Hex, storageKeys: Hex[], blockNumber?: bigint, blockTag?: string }) => Promise<ProofResult>} getProof - Get account proof
 */

/**
 * @typedef {Object} EIP1193RequestFn
 * @property {(args: { method: string, params?: unknown[] }) => Promise<unknown>} request
 */

/**
 * Format block number or tag for RPC params
 * @param {bigint | undefined} blockNumber
 * @param {string | undefined} blockTag
 * @returns {string}
 */
const formatBlockParam = (blockNumber, blockTag) => {
	if (blockNumber !== undefined) {
		return `0x${blockNumber.toString(16)}`
	}
	return blockTag || 'latest'
}

/**
 * Creates a fork RPC client from an EIP-1193 request function or transport factory.
 *
 * This provides viem-compatible methods (getBytecode, getStorageAt, getProof)
 * using standard JSON-RPC calls, without requiring viem as a dependency.
 *
 * Supports both direct transport objects and factory functions for lazy evaluation.
 * When a factory function is provided, the transport is created lazily on first use.
 *
 * @param {{request: (args: {method: string, params?: unknown[]}) => Promise<unknown>} | (() => {request: (args: {method: string, params?: unknown[]}) => Promise<unknown>})} transportOrFactory - EIP-1193 compliant request function or a factory that returns one
 * @returns {ForkRpcClient}
 *
 * @example
 * ```javascript
 * import { createForkRpcClient } from '@tevm/utils'
 *
 * // Using with a voltaire HttpProvider
 * import { HttpProvider } from '@tevm/voltaire/provider'
 *
 * const provider = new HttpProvider({ url: 'https://mainnet.infura.io/v3/...' })
 * const client = createForkRpcClient(provider)
 *
 * // Get contract code
 * const code = await client.getBytecode({
 *   address: '0x1234...',
 *   blockNumber: 12345678n
 * })
 *
 * // Get storage value
 * const value = await client.getStorageAt({
 *   address: '0x1234...',
 *   slot: '0x0',
 *   blockTag: 'latest'
 * })
 *
 * // Get account proof
 * const proof = await client.getProof({
 *   address: '0x1234...',
 *   storageKeys: ['0x0', '0x1'],
 *   blockNumber: 12345678n
 * })
 * ```
 */
export function createForkRpcClient(transportOrFactory) {
	/** @type {{request: (args: {method: string, params?: unknown[]}) => Promise<unknown>} | null} */
	let cachedTransport = null

	/**
	 * Get the transport, lazily initializing if needed
	 * @returns {{request: (args: {method: string, params?: unknown[]}) => Promise<unknown>}}
	 */
	const getTransport = () => {
		if (cachedTransport) {
			return cachedTransport
		}
		// Check if it's a factory function (no request property) or direct transport
		if (typeof transportOrFactory === 'function' && !('request' in transportOrFactory)) {
			cachedTransport = /** @type {() => {request: (args: {method: string, params?: unknown[]}) => Promise<unknown>}} */ (transportOrFactory)()
		} else {
			cachedTransport = /** @type {{request: (args: {method: string, params?: unknown[]}) => Promise<unknown>}} */ (transportOrFactory)
		}
		return cachedTransport
	}

	return {
		/**
		 * Get contract bytecode at an address
		 * @param {{ address: Hex, blockNumber?: bigint, blockTag?: string }} params
		 * @returns {Promise<Hex | undefined>}
		 */
		async getBytecode({ address, blockNumber, blockTag }) {
			const block = formatBlockParam(blockNumber, blockTag)
			const transport = getTransport()
			const code = /** @type {Hex} */ (await transport.request({
				method: 'eth_getCode',
				params: [address, block]
			}))
			// Return undefined for empty code (0x or null)
			if (!code || code === '0x') {
				return undefined
			}
			return code
		},

		/**
		 * Get storage value at a slot
		 * @param {{ address: Hex, slot: Hex, blockNumber?: bigint, blockTag?: string }} params
		 * @returns {Promise<Hex>}
		 */
		async getStorageAt({ address, slot, blockNumber, blockTag }) {
			const block = formatBlockParam(blockNumber, blockTag)
			const transport = getTransport()
			const value = /** @type {Hex} */ (await transport.request({
				method: 'eth_getStorageAt',
				params: [address, slot, block]
			}))
			return value || '0x0'
		},

		/**
		 * Get account proof including storage proofs
		 * @param {{ address: Hex, storageKeys: Hex[], blockNumber?: bigint, blockTag?: string }} params
		 * @returns {Promise<ProofResult>}
		 */
		async getProof({ address, storageKeys, blockNumber, blockTag }) {
			const block = formatBlockParam(blockNumber, blockTag)
			const transport = getTransport()
			const result = /** @type {any} */ (await transport.request({
				method: 'eth_getProof',
				params: [address, storageKeys, block]
			}))

			// Convert string values to expected types
			return {
				address: /** @type {Hex} */ (result.address),
				balance: BigInt(result.balance),
				nonce: BigInt(result.nonce),
				codeHash: /** @type {Hex} */ (result.codeHash),
				storageHash: /** @type {Hex} */ (result.storageHash),
				accountProof: /** @type {Hex[]} */ (result.accountProof),
				storageProof: result.storageProof.map((/** @type {any} */ sp) => ({
					key: /** @type {Hex} */ (sp.key),
					value: /** @type {Hex} */ (sp.value),
					proof: /** @type {Hex[]} */ (sp.proof)
				}))
			}
		}
	}
}
