/**
 * Native implementation of fetchFromProvider and getProvider utilities.
 * These provide JSON-RPC fetch functionality without depending on @ethereumjs/util.
 * @module provider
 */

/**
 * @typedef {Object} FetchParams
 * @property {string} method - The JSON-RPC method name
 * @property {unknown[]} [params] - The method parameters
 */

/**
 * @typedef {Object} JsonRpcResponse
 * @property {string} jsonrpc - JSON-RPC version
 * @property {number} id - Request ID
 * @property {unknown} [result] - The result on success
 * @property {Object} [error] - Error object on failure
 * @property {number} [error.code] - Error code
 * @property {string} [error.message] - Error message
 */

/**
 * Fetches from a JSON-RPC provider.
 * This is a native implementation replacing the @ethereumjs/util version.
 *
 * @param {string} url - The JSON-RPC endpoint URL
 * @param {FetchParams} params - The JSON-RPC request parameters
 * @returns {Promise<unknown>} The result from the JSON-RPC response
 * @throws {Error} If the request fails or returns an error
 *
 * @example
 * ```javascript
 * import { fetchFromProvider } from '@tevm/utils'
 *
 * const blockNumber = await fetchFromProvider('https://mainnet.infura.io/v3/YOUR_KEY', {
 *   method: 'eth_blockNumber',
 *   params: []
 * })
 * console.log(blockNumber) // '0x...'
 * ```
 */
export const fetchFromProvider = async (url, params) => {
	const data = JSON.stringify({
		method: params.method,
		params: params.params,
		jsonrpc: '2.0',
		id: 1,
	})

	const res = await fetch(url, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'POST',
		body: data,
	})

	if (!res.ok) {
		const errorText = await res.text().catch(() => 'Could not parse error message likely because of a network error')
		throw new Error(
			`JSONRPCError: ${JSON.stringify({
				method: params.method,
				status: res.status,
				message: errorText,
			})}`,
		)
	}

	const json = /** @type {JsonRpcResponse} */ (await res.json())

	if (json.error !== undefined) {
		throw new Error(
			`JSONRPCError: ${JSON.stringify({
				method: params.method,
				...json.error,
			})}`,
		)
	}

	return json.result
}

/**
 * @typedef {Object} Web3Provider
 * @property {() => { url: string }} _getConnection - Method to get the connection URL
 */

/**
 * Extracts the URL from a provider (string or Web3Provider object).
 * This is a native implementation replacing the @ethereumjs/util version.
 *
 * @param {string | Web3Provider} provider - The provider URL string or Web3Provider object
 * @returns {string} The provider URL
 * @throws {Error} If the provider is not a valid URL or Web3Provider
 *
 * @example
 * ```javascript
 * import { getProvider } from '@tevm/utils'
 *
 * // With a string URL
 * const url1 = getProvider('https://mainnet.infura.io/v3/YOUR_KEY')
 * console.log(url1) // 'https://mainnet.infura.io/v3/YOUR_KEY'
 *
 * // With a Web3Provider object
 * const provider = { _getConnection: () => ({ url: 'https://...' }) }
 * const url2 = getProvider(provider)
 * console.log(url2) // 'https://...'
 * ```
 */
export const getProvider = (provider) => {
	if (typeof provider === 'string') {
		return provider
	} else if (typeof provider === 'object' && provider !== null && provider._getConnection !== undefined) {
		return provider._getConnection().url
	} else {
		throw new Error('Must provide valid provider URL or Web3Provider')
	}
}
