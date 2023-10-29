import type { Abi } from 'abitype'

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
