import type { Abi } from '@tevm/utils'

/**
 * Example ABI used for testing the contract functionality.
 * Contains a mix of write/read functions with different signatures and an event.
 * @example
 * ```typescript
 * import { dummyAbi } from '@tevm/contract/test'
 *
 * // Use in tests to create a contract instance
 * const contract = createContract({
 *   abi: dummyAbi,
 *   address: '0x1234567890123456789012345678901234567890'
 * })
 * ```
 */
export const dummyAbi = [
	{
		type: 'function',
		name: 'exampleWrite',
		inputs: [
			{ type: 'string', name: 'str' },
			{ type: 'uint256', name: 'num' },
		],
		outputs: [{ type: 'string', name: '' }],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'overloadedWrite',
		inputs: [{ type: 'string', name: 'str' }],
		outputs: [{ type: 'string', name: '' }],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'overloadedWrite',
		inputs: [],
		outputs: [{ type: 'string', name: '' }],
		stateMutability: 'payable',
	},
	{
		type: 'function',
		name: 'exampleRead',
		inputs: [
			{ type: 'string', name: 'str' },
			{ type: 'uint256', name: 'num' },
		],
		outputs: [{ type: 'string', name: '' }],
		stateMutability: 'pure',
	},
	{
		type: 'function',
		name: 'exampleReadNoArgs',
		inputs: [],
		outputs: [{ type: 'string', name: '' }],
		stateMutability: 'pure',
	},
	{
		type: 'function',
		name: 'overloadedRead',
		inputs: [{ type: 'string', name: 'str' }],
		outputs: [{ type: 'string', name: '' }],
		stateMutability: 'pure',
	},
	{
		type: 'function',
		name: 'overloadedRead',
		inputs: [],
		outputs: [{ type: 'string', name: '' }],
		stateMutability: 'pure',
	},
	{
		type: 'event',
		name: 'exampleEvent',
		inputs: [{ type: 'string', name: 'data', indexed: false }],
	},
] as const satisfies Abi
