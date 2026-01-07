import { describe, expect, it } from 'vitest'
import { formatAbi } from './formatAbi.js'

describe('formatAbi', () => {
	it('should format function ABI items', () => {
		const abi = [
			{
				type: 'function' as const,
				name: 'transfer',
				inputs: [
					{ type: 'address', name: 'to' },
					{ type: 'uint256', name: 'amount' },
				],
				outputs: [{ type: 'bool' }],
				stateMutability: 'nonpayable' as const,
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['function transfer(address to, uint256 amount) returns (bool)'])
	})

	it('should format view functions with state mutability', () => {
		const abi = [
			{
				type: 'function' as const,
				name: 'balanceOf',
				inputs: [{ type: 'address', name: 'account' }],
				outputs: [{ type: 'uint256' }],
				stateMutability: 'view' as const,
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['function balanceOf(address account) view returns (uint256)'])
	})

	it('should format pure functions with state mutability', () => {
		const abi = [
			{
				type: 'function' as const,
				name: 'add',
				inputs: [
					{ type: 'uint256', name: 'a' },
					{ type: 'uint256', name: 'b' },
				],
				outputs: [{ type: 'uint256' }],
				stateMutability: 'pure' as const,
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['function add(uint256 a, uint256 b) pure returns (uint256)'])
	})

	it('should format payable functions with state mutability', () => {
		const abi = [
			{
				type: 'function' as const,
				name: 'deposit',
				inputs: [],
				outputs: [],
				stateMutability: 'payable' as const,
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['function deposit() payable'])
	})

	it('should not include nonpayable state mutability (default)', () => {
		const abi = [
			{
				type: 'function' as const,
				name: 'withdraw',
				inputs: [{ type: 'uint256', name: 'amount' }],
				outputs: [],
				stateMutability: 'nonpayable' as const,
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['function withdraw(uint256 amount)'])
	})

	it('should format event ABI items with indexed parameters', () => {
		const abi = [
			{
				type: 'event' as const,
				name: 'Transfer',
				inputs: [
					{ type: 'address', name: 'from', indexed: true },
					{ type: 'address', name: 'to', indexed: true },
					{ type: 'uint256', name: 'value', indexed: false },
				],
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['event Transfer(address indexed from, address indexed to, uint256 value)'])
	})

	it('should format error ABI items', () => {
		const abi = [
			{
				type: 'error' as const,
				name: 'InsufficientBalance',
				inputs: [
					{ type: 'uint256', name: 'available' },
					{ type: 'uint256', name: 'required' },
				],
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['error InsufficientBalance(uint256 available, uint256 required)'])
	})

	it('should format constructor ABI items', () => {
		const abi = [
			{
				type: 'constructor' as const,
				inputs: [{ type: 'string', name: 'name' }],
				stateMutability: 'nonpayable' as const,
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['constructor(string name)'])
	})

	it('should format receive ABI items', () => {
		const abi = [{ type: 'receive' as const, stateMutability: 'payable' as const }]
		const result = formatAbi(abi)
		expect(result).toEqual(['receive() external payable'])
	})

	it('should format fallback ABI items', () => {
		const abi = [{ type: 'fallback' as const, stateMutability: 'nonpayable' as const }]
		const result = formatAbi(abi)
		expect(result).toEqual(['fallback() external'])
	})

	it('should format a complete ABI', () => {
		const abi = [
			{
				type: 'constructor' as const,
				inputs: [{ type: 'string', name: 'name' }],
			},
			{
				type: 'function' as const,
				name: 'approve',
				inputs: [
					{ type: 'address', name: 'spender' },
					{ type: 'uint256', name: 'amount' },
				],
				outputs: [{ type: 'bool' }],
				stateMutability: 'nonpayable' as const,
			},
			{
				type: 'function' as const,
				name: 'balanceOf',
				inputs: [{ type: 'address', name: 'account' }],
				outputs: [{ type: 'uint256' }],
				stateMutability: 'view' as const,
			},
			{
				type: 'event' as const,
				name: 'Transfer',
				inputs: [
					{ type: 'address', name: 'from', indexed: true },
					{ type: 'address', name: 'to', indexed: true },
					{ type: 'uint256', name: 'value', indexed: false },
				],
			},
			{
				type: 'error' as const,
				name: 'InsufficientBalance',
				inputs: [
					{ type: 'uint256', name: 'available' },
					{ type: 'uint256', name: 'required' },
				],
			},
			{ type: 'receive' as const },
			{ type: 'fallback' as const },
		]
		const result = formatAbi(abi)
		expect(result).toEqual([
			'constructor(string name)',
			'function approve(address spender, uint256 amount) returns (bool)',
			'function balanceOf(address account) view returns (uint256)',
			'event Transfer(address indexed from, address indexed to, uint256 value)',
			'error InsufficientBalance(uint256 available, uint256 required)',
			'receive() external payable',
			'fallback() external',
		])
	})

	it('should handle functions with no inputs', () => {
		const abi = [
			{
				type: 'function' as const,
				name: 'owner',
				inputs: [],
				outputs: [{ type: 'address' }],
				stateMutability: 'view' as const,
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['function owner() view returns (address)'])
	})

	it('should handle functions with no outputs', () => {
		const abi = [
			{
				type: 'function' as const,
				name: 'pause',
				inputs: [],
				outputs: [],
				stateMutability: 'nonpayable' as const,
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['function pause()'])
	})

	it('should handle parameters without names', () => {
		const abi = [
			{
				type: 'function' as const,
				name: 'transfer',
				inputs: [{ type: 'address' }, { type: 'uint256' }],
				outputs: [{ type: 'bool' }],
				stateMutability: 'nonpayable' as const,
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['function transfer(address, uint256) returns (bool)'])
	})

	it('should handle unknown ABI item types by returning the type', () => {
		// Test with an unknown type that doesn't match any case
		const abi = [
			{
				type: 'unknownType' as any,
				name: 'something',
			},
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['unknownType'])
	})

	it('should handle function with undefined inputs', () => {
		const abi = [
			{
				type: 'function' as const,
				name: 'noInputs',
				outputs: [{ type: 'bool' }],
				stateMutability: 'view' as const,
			} as any,
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['function noInputs() view returns (bool)'])
	})

	it('should handle event with undefined inputs', () => {
		const abi = [
			{
				type: 'event' as const,
				name: 'SimpleEvent',
			} as any,
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['event SimpleEvent()'])
	})

	it('should handle error with undefined inputs', () => {
		const abi = [
			{
				type: 'error' as const,
				name: 'SimpleError',
			} as any,
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['error SimpleError()'])
	})

	it('should handle constructor with undefined inputs', () => {
		const abi = [
			{
				type: 'constructor' as const,
				stateMutability: 'nonpayable' as const,
			} as any,
		]
		const result = formatAbi(abi)
		expect(result).toEqual(['constructor()'])
	})
})
