// @ts-check
/**
 * @fileoverview Native ABI formatting function using @tevm/voltaire
 * This replaces abitype's formatAbi function
 */

/**
 * Format a single ABI parameter to a human-readable string
 * @param {Object} param - The parameter object
 * @param {string} param.type - The parameter type
 * @param {string} [param.name] - The parameter name
 * @param {boolean} [param.indexed] - Whether the parameter is indexed (for events)
 * @returns {string} The formatted parameter string
 */
function formatParameter(param) {
	let result = param.type
	if (param.indexed) {
		result += ' indexed'
	}
	if (param.name) {
		result += ` ${param.name}`
	}
	return result
}

/**
 * Format a single ABI item to a human-readable string
 * @param {import('viem').AbiItem} item - The ABI item to format
 * @returns {string} The formatted string
 */
function formatAbiItem(item) {
	switch (item.type) {
		case 'function': {
			const inputs = item.inputs?.map(formatParameter).join(', ') ?? ''
			let result = `function ${item.name}(${inputs})`

			// Add state mutability if view, pure, or payable (not nonpayable which is default)
			if (item.stateMutability === 'view' || item.stateMutability === 'pure' || item.stateMutability === 'payable') {
				result += ` ${item.stateMutability}`
			}

			// Add returns if there are outputs
			if (item.outputs && item.outputs.length > 0) {
				const outputs = item.outputs.map(p => p.type).join(', ')
				result += ` returns (${outputs})`
			}

			return result
		}

		case 'event': {
			const inputs = item.inputs?.map(formatParameter).join(', ') ?? ''
			return `event ${item.name}(${inputs})`
		}

		case 'error': {
			const inputs = item.inputs?.map(formatParameter).join(', ') ?? ''
			return `error ${item.name}(${inputs})`
		}

		case 'constructor': {
			const inputs = item.inputs?.map(formatParameter).join(', ') ?? ''
			return `constructor(${inputs})`
		}

		case 'receive': {
			return 'receive() external payable'
		}

		case 'fallback': {
			return 'fallback() external'
		}

		default:
			// For any unknown types, just return the type
			return item.type
	}
}

/**
 * Format an ABI to an array of human-readable strings.
 * Native implementation that matches abitype's formatAbi API.
 *
 * @template {readonly import('viem').AbiItem[]} TAbi
 * @param {TAbi} abi - The ABI to format
 * @returns {string[]} Array of human-readable ABI strings
 * @example
 * ```javascript
 * import { formatAbi } from '@tevm/utils'
 *
 * const humanReadable = formatAbi([
 *   {
 *     type: 'function',
 *     name: 'transfer',
 *     inputs: [
 *       { type: 'address', name: 'to' },
 *       { type: 'uint256', name: 'amount' }
 *     ],
 *     outputs: [{ type: 'bool' }],
 *     stateMutability: 'nonpayable'
 *   },
 *   {
 *     type: 'event',
 *     name: 'Transfer',
 *     inputs: [
 *       { type: 'address', name: 'from', indexed: true },
 *       { type: 'address', name: 'to', indexed: true },
 *       { type: 'uint256', name: 'value' }
 *     ]
 *   }
 * ])
 * // Returns:
 * // [
 * //   'function transfer(address to, uint256 amount) returns (bool)',
 * //   'event Transfer(address indexed from, address indexed to, uint256 value)'
 * // ]
 * ```
 */
export function formatAbi(abi) {
	return abi.map(formatAbiItem)
}
