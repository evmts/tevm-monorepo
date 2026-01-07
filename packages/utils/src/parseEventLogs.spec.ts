import { describe, it, expect } from 'vitest'
import { parseEventLogs } from './parseEventLogs.js'
import { erc20Abi } from './erc20Abi.js'

// Test ABI with multiple events
const testAbi = [
	{
		type: 'event',
		name: 'Transfer',
		inputs: [
			{ indexed: true, name: 'from', type: 'address' },
			{ indexed: true, name: 'to', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
	},
	{
		type: 'event',
		name: 'Approval',
		inputs: [
			{ indexed: true, name: 'owner', type: 'address' },
			{ indexed: true, name: 'spender', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
		],
	},
	{
		type: 'event',
		name: 'Mint',
		inputs: [
			{ indexed: true, name: 'to', type: 'address' },
			{ indexed: false, name: 'amount', type: 'uint256' },
		],
	},
] as const

// Transfer event topic (keccak256 of 'Transfer(address,address,uint256)')
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

// Approval event topic (keccak256 of 'Approval(address,address,uint256)')
const APPROVAL_TOPIC = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'

// Sample addresses (padded to 32 bytes for topics)
const ADDRESS1_PADDED = '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266'
const ADDRESS2_PADDED = '0x00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8'

// Sample addresses (20 bytes)
const ADDRESS1 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const ADDRESS2 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

// Sample value encoded (100 as uint256)
const VALUE_100 = '0x0000000000000000000000000000000000000000000000000000000000000064'

describe('parseEventLogs', () => {
	describe('basic parsing', () => {
		it('should parse a single Transfer event log', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockHash: '0x0000000000000000000000000000000000000000000000000000000000000001' as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					transactionHash: '0x0000000000000000000000000000000000000000000000000000000000000002' as `0x${string}`,
					transactionIndex: 0,
					removed: false,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				logs,
			})

			expect(result).toHaveLength(1)
			expect(result[0]?.eventName).toBe('Transfer')
			expect(result[0]?.args.from?.toString().toLowerCase()).toBe(ADDRESS1.toLowerCase())
			expect(result[0]?.args.to?.toString().toLowerCase()).toBe(ADDRESS2.toLowerCase())
			expect(result[0]?.args.value).toBe(100n)
		})

		it('should parse multiple event logs', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 1,
					topics: [APPROVAL_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				logs,
			})

			expect(result).toHaveLength(2)
			expect(result[0]?.eventName).toBe('Transfer')
			expect(result[1]?.eventName).toBe('Approval')
		})

		it('should return empty array for empty logs', () => {
			const result = parseEventLogs({
				abi: testAbi,
				logs: [],
			})

			expect(result).toEqual([])
		})
	})

	describe('eventName filtering', () => {
		it('should filter logs by eventName', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 1,
					topics: [APPROVAL_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				eventName: 'Transfer',
				logs,
			})

			expect(result).toHaveLength(1)
			expect(result[0]?.eventName).toBe('Transfer')
		})

		it('should return empty array when no logs match eventName', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				eventName: 'Approval',
				logs,
			})

			expect(result).toHaveLength(0)
		})
	})

	describe('args filtering', () => {
		it('should filter logs by single arg value', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 1,
					topics: [TRANSFER_TOPIC, ADDRESS2_PADDED, ADDRESS1_PADDED] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				eventName: 'Transfer',
				args: {
					from: ADDRESS1,
				},
				logs,
			})

			expect(result).toHaveLength(1)
			expect(result[0]?.args.from?.toString().toLowerCase()).toBe(ADDRESS1.toLowerCase())
		})

		it('should filter logs by array of arg values', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 1,
					topics: [TRANSFER_TOPIC, ADDRESS2_PADDED, ADDRESS1_PADDED] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				eventName: 'Transfer',
				args: {
					from: [ADDRESS1, ADDRESS2],
				},
				logs,
			})

			expect(result).toHaveLength(2)
		})

		it('should be case-insensitive for address args', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				eventName: 'Transfer',
				args: {
					from: ADDRESS1.toLowerCase(),
				},
				logs,
			})

			expect(result).toHaveLength(1)
		})
	})

	describe('strict mode', () => {
		it('should skip invalid logs in non-strict mode', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
				{
					// Log with unknown topic signature
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 1,
					topics: ['0x0000000000000000000000000000000000000000000000000000000000000000'] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				logs,
				strict: false,
			})

			expect(result).toHaveLength(1)
			expect(result[0]?.eventName).toBe('Transfer')
		})
	})

	describe('edge cases', () => {
		it('should skip logs without topics', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				logs,
			})

			expect(result).toHaveLength(0)
		})

		it('should skip logs without data', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					logIndex: 0,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				logs,
			})

			expect(result).toHaveLength(0)
		})

		it('should handle logs with null/undefined topic values', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED, null, undefined] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				logs,
			})

			expect(result).toHaveLength(1)
			expect(result[0]?.eventName).toBe('Transfer')
		})

		it('should preserve log metadata in result', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockHash: '0x1234567890123456789012345678901234567890123456789012345678901234' as `0x${string}`,
					blockNumber: 12345n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 42,
					transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' as `0x${string}`,
					transactionIndex: 5,
					removed: false,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				logs,
			})

			expect(result).toHaveLength(1)
			expect(result[0]?.address).toBe(ADDRESS1)
			expect(result[0]?.blockHash).toBe('0x1234567890123456789012345678901234567890123456789012345678901234')
			expect(result[0]?.blockNumber).toBe(12345n)
			expect(result[0]?.logIndex).toBe(42)
			expect(result[0]?.transactionHash).toBe('0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890')
			expect(result[0]?.transactionIndex).toBe(5)
			expect(result[0]?.removed).toBe(false)
		})

		it('should handle removed field defaulting to false', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
					// removed field not provided
				},
			]

			const result = parseEventLogs({
				abi: testAbi,
				logs,
			})

			expect(result).toHaveLength(1)
			expect(result[0]?.removed).toBe(false)
		})
	})

	describe('with erc20Abi', () => {
		it('should parse Transfer events from erc20Abi', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [TRANSFER_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
			]

			const result = parseEventLogs({
				abi: erc20Abi,
				logs,
			})

			expect(result).toHaveLength(1)
			expect(result[0]?.eventName).toBe('Transfer')
		})

		it('should parse Approval events from erc20Abi', () => {
			const logs = [
				{
					address: ADDRESS1 as `0x${string}`,
					blockNumber: 1n,
					data: VALUE_100 as `0x${string}`,
					logIndex: 0,
					topics: [APPROVAL_TOPIC, ADDRESS1_PADDED, ADDRESS2_PADDED] as const,
				},
			]

			const result = parseEventLogs({
				abi: erc20Abi,
				logs,
			})

			expect(result).toHaveLength(1)
			expect(result[0]?.eventName).toBe('Approval')
		})
	})
})
