import { createAddress } from '@tevm/address'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { parseEther } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { debugIntermediateRootsJsonRpcProcedure } from './debugIntermediateRootsProcedure.js'

describe('debugIntermediateRootsProcedure', () => {
	let client: TevmNode

	beforeEach(async () => {
		client = createTevmNode({
			fork: {
				transport: transports.optimism,
			},
		})
		await client.ready()
	})

	it('should return intermediate roots for a block with transactions', async () => {
		const procedure = debugIntermediateRootsJsonRpcProcedure(client)

		// Mine a block with multiple transactions
		const from = createAddress('0x1000000000000000000000000000000000000000').toString()
		const to1 = createAddress('0x2000000000000000000000000000000000000000').toString()
		const to2 = createAddress('0x3000000000000000000000000000000000000000').toString()

		// Set balance and send transactions
		await client.setAccount({
			address: from,
			balance: parseEther('10'),
		})

		await client.tevmCall({
			from,
			to: to1,
			value: parseEther('1'),
			createTransaction: true,
		})

		await client.tevmCall({
			from,
			to: to2,
			value: parseEther('1'),
			createTransaction: true,
		})

		await client.tevmMine()

		// Get the latest block number
		const vm = await client.getVm()
		const latestBlock = await vm.blockchain.getCanonicalHeadBlock()

		// Call debug_intermediateRoots
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_intermediateRoots',
			id: 1,
			params: [Number(latestBlock.header.number)],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_intermediateRoots',
			id: 1,
		})

		expect(response.result).toBeDefined()
		expect(Array.isArray(response.result)).toBe(true)
		expect(response.result.length).toBe(2) // Two transactions

		// Each root should be a hex string
		for (const root of response.result) {
			expect(root).toMatch(/^0x[0-9a-f]+$/i)
		}

		// Roots should be different (state changes after each transaction)
		expect(response.result[0]).not.toBe(response.result[1])
	})

	it('should return empty array for block with no transactions', async () => {
		const procedure = debugIntermediateRootsJsonRpcProcedure(client)

		// Mine an empty block
		await client.tevmMine()

		// Get the latest block number
		const vm = await client.getVm()
		const latestBlock = await vm.blockchain.getCanonicalHeadBlock()

		// Call debug_intermediateRoots
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_intermediateRoots',
			id: 1,
			params: [Number(latestBlock.header.number)],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_intermediateRoots',
			id: 1,
			result: [],
		})
	})

	it('should handle block tag "latest"', async () => {
		const procedure = debugIntermediateRootsJsonRpcProcedure(client)

		// Mine a block with a transaction
		const from = createAddress('0x1000000000000000000000000000000000000000').toString()
		const to = createAddress('0x2000000000000000000000000000000000000000').toString()

		await client.setAccount({
			address: from,
			balance: parseEther('10'),
		})

		await client.tevmCall({
			from,
			to,
			value: parseEther('1'),
			createTransaction: true,
		})

		await client.tevmMine()

		// Call debug_intermediateRoots with 'latest' tag
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_intermediateRoots',
			id: 1,
			params: ['latest'],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_intermediateRoots',
			id: 1,
		})

		expect(response.result).toBeDefined()
		expect(Array.isArray(response.result)).toBe(true)
		expect(response.result.length).toBe(1)
	})

	it('should handle bigint block number', async () => {
		const procedure = debugIntermediateRootsJsonRpcProcedure(client)

		// Mine a block
		await client.tevmMine()

		// Get the latest block number
		const vm = await client.getVm()
		const latestBlock = await vm.blockchain.getCanonicalHeadBlock()

		// Call debug_intermediateRoots with bigint
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_intermediateRoots',
			id: 1,
			params: [latestBlock.header.number],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_intermediateRoots',
			id: 1,
		})

		expect(response.result).toBeDefined()
	})
})
