/**
 * Utilities for handling different client types in the CLI
 */

/**
 * List of action names that are recognized as Viem actions
 * @type {string[]}
 */
const viemActionNames = [
	'readContract',
	'estimateGas',
	'getBalance',
	'getBlock',
	'getBlockNumber',
	'getChainId',
	'getGasPrice',
	'getTransaction',
	'getTransactionCount',
	'getTransactionReceipt',
	'sendTransaction',
]

/**
 * Determines if the given action name is a Viem action
 * @param {string} actionName - The name of the action
 * @returns {boolean} - True if it's a Viem action, false otherwise
 */
export function isViemAction(actionName) {
	return viemActionNames.includes(actionName)
}

/**
 * Loads a Viem client with the specified RPC URL
 * Uses dynamic import with safety checks to avoid bundling issues
 *
 * @param {string} rpcUrl - The RPC endpoint URL
 * @returns {Promise<Object|null>} - A Viem client or null if loading fails
 */
export const loadViemClient = async (rpcUrl) => {
	try {
		return await new Promise(async (resolve) => {
			try {
				// Using dynamic import with safety checks
				const module = await Function('return import("viem")')()
				const client = module.createPublicClient({
					transport: module.http(rpcUrl),
				})
				resolve(client)
			} catch (e) {
				console.error('Failed to load viem:', e)
				resolve(null)
			}
		})
	} catch (e) {
		console.error('Could not load viem client:', e)
		return null
	}
}
