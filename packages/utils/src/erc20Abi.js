/**
 * @module erc20Abi
 *
 * Standard ERC-20 token ABI constant.
 * This provides a viem-compatible erc20Abi without requiring viem as a dependency.
 */

/**
 * Standard ERC-20 token interface ABI.
 *
 * This is a native implementation compatible with viem's erc20Abi constant,
 * containing the standard ERC-20 interface including events, allowance,
 * approve, balanceOf, decimals, name, symbol, totalSupply, transfer,
 * and transferFrom functions.
 *
 * @example
 * ```javascript
 * import { erc20Abi } from '@tevm/utils'
 *
 * // Use with tevmContract to read token balances
 * const result = await client.tevmContract({
 *   to: tokenAddress,
 *   abi: erc20Abi,
 *   functionName: 'balanceOf',
 *   args: [walletAddress],
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Migration from viem
 * // Before:
 * import { erc20Abi } from 'viem'
 *
 * // After:
 * import { erc20Abi } from '@tevm/utils'
 * ```
 *
 * @type {readonly [
 *   {
 *     type: 'event',
 *     name: 'Approval',
 *     inputs: readonly [
 *       { indexed: true, name: 'owner', type: 'address' },
 *       { indexed: true, name: 'spender', type: 'address' },
 *       { indexed: false, name: 'value', type: 'uint256' }
 *     ]
 *   },
 *   {
 *     type: 'event',
 *     name: 'Transfer',
 *     inputs: readonly [
 *       { indexed: true, name: 'from', type: 'address' },
 *       { indexed: true, name: 'to', type: 'address' },
 *       { indexed: false, name: 'value', type: 'uint256' }
 *     ]
 *   },
 *   {
 *     type: 'function',
 *     name: 'allowance',
 *     stateMutability: 'view',
 *     inputs: readonly [
 *       { name: 'owner', type: 'address' },
 *       { name: 'spender', type: 'address' }
 *     ],
 *     outputs: readonly [{ type: 'uint256' }]
 *   },
 *   {
 *     type: 'function',
 *     name: 'approve',
 *     stateMutability: 'nonpayable',
 *     inputs: readonly [
 *       { name: 'spender', type: 'address' },
 *       { name: 'amount', type: 'uint256' }
 *     ],
 *     outputs: readonly [{ type: 'bool' }]
 *   },
 *   {
 *     type: 'function',
 *     name: 'balanceOf',
 *     stateMutability: 'view',
 *     inputs: readonly [{ name: 'account', type: 'address' }],
 *     outputs: readonly [{ type: 'uint256' }]
 *   },
 *   {
 *     type: 'function',
 *     name: 'decimals',
 *     stateMutability: 'view',
 *     inputs: readonly [],
 *     outputs: readonly [{ type: 'uint8' }]
 *   },
 *   {
 *     type: 'function',
 *     name: 'name',
 *     stateMutability: 'view',
 *     inputs: readonly [],
 *     outputs: readonly [{ type: 'string' }]
 *   },
 *   {
 *     type: 'function',
 *     name: 'symbol',
 *     stateMutability: 'view',
 *     inputs: readonly [],
 *     outputs: readonly [{ type: 'string' }]
 *   },
 *   {
 *     type: 'function',
 *     name: 'totalSupply',
 *     stateMutability: 'view',
 *     inputs: readonly [],
 *     outputs: readonly [{ type: 'uint256' }]
 *   },
 *   {
 *     type: 'function',
 *     name: 'transfer',
 *     stateMutability: 'nonpayable',
 *     inputs: readonly [
 *       { name: 'recipient', type: 'address' },
 *       { name: 'amount', type: 'uint256' }
 *     ],
 *     outputs: readonly [{ type: 'bool' }]
 *   },
 *   {
 *     type: 'function',
 *     name: 'transferFrom',
 *     stateMutability: 'nonpayable',
 *     inputs: readonly [
 *       { name: 'sender', type: 'address' },
 *       { name: 'recipient', type: 'address' },
 *       { name: 'amount', type: 'uint256' }
 *     ],
 *     outputs: readonly [{ type: 'bool' }]
 *   }
 * ]}
 */
export const erc20Abi = /** @type {const} */ ([
	{
		type: 'event',
		name: 'Approval',
		inputs: [
			{
				indexed: true,
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				name: 'value',
				type: 'uint256',
			},
		],
	},
	{
		type: 'event',
		name: 'Transfer',
		inputs: [
			{
				indexed: true,
				name: 'from',
				type: 'address',
			},
			{
				indexed: true,
				name: 'to',
				type: 'address',
			},
			{
				indexed: false,
				name: 'value',
				type: 'uint256',
			},
		],
	},
	{
		type: 'function',
		name: 'allowance',
		stateMutability: 'view',
		inputs: [
			{
				name: 'owner',
				type: 'address',
			},
			{
				name: 'spender',
				type: 'address',
			},
		],
		outputs: [
			{
				type: 'uint256',
			},
		],
	},
	{
		type: 'function',
		name: 'approve',
		stateMutability: 'nonpayable',
		inputs: [
			{
				name: 'spender',
				type: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
			},
		],
		outputs: [
			{
				type: 'bool',
			},
		],
	},
	{
		type: 'function',
		name: 'balanceOf',
		stateMutability: 'view',
		inputs: [
			{
				name: 'account',
				type: 'address',
			},
		],
		outputs: [
			{
				type: 'uint256',
			},
		],
	},
	{
		type: 'function',
		name: 'decimals',
		stateMutability: 'view',
		inputs: [],
		outputs: [
			{
				type: 'uint8',
			},
		],
	},
	{
		type: 'function',
		name: 'name',
		stateMutability: 'view',
		inputs: [],
		outputs: [
			{
				type: 'string',
			},
		],
	},
	{
		type: 'function',
		name: 'symbol',
		stateMutability: 'view',
		inputs: [],
		outputs: [
			{
				type: 'string',
			},
		],
	},
	{
		type: 'function',
		name: 'totalSupply',
		stateMutability: 'view',
		inputs: [],
		outputs: [
			{
				type: 'uint256',
			},
		],
	},
	{
		type: 'function',
		name: 'transfer',
		stateMutability: 'nonpayable',
		inputs: [
			{
				name: 'recipient',
				type: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
			},
		],
		outputs: [
			{
				type: 'bool',
			},
		],
	},
	{
		type: 'function',
		name: 'transferFrom',
		stateMutability: 'nonpayable',
		inputs: [
			{
				name: 'sender',
				type: 'address',
			},
			{
				name: 'recipient',
				type: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
			},
		],
		outputs: [
			{
				type: 'bool',
			},
		],
	},
])
