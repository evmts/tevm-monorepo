import { createAddress } from '@tevm/address'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { parseEther } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { callHandler } from '../Call/callHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { debugTraceChainJsonRpcProcedure } from './debugTraceChainProcedure.js'

describe('debugTraceChainProcedure', () => {
	let client: TevmNode

	beforeEach(() => {
		client = createTevmNode()
	})

	it('should trace all transactions in a block range', async () => {
		const procedure = debugTraceChainJsonRpcProcedure(client)

		const from = createAddress('0x1000000000000000000000000000000000000000').toString()
		const to1 = createAddress('0x2000000000000000000000000000000000000000').toString()
		const to2 = createAddress('0x3000000000000000000000000000000000000000').toString()

		await setAccountHandler(client)({
			address: from,
			balance: parseEther('10'),
		})

		// Create first block with one transaction
		await callHandler(client)({
			from,
			to: to1,
			value: parseEther('1'),
			createTransaction: true,
		})
		await mineHandler(client)({})

		const vm = await client.getVm()
		const firstBlock = await vm.blockchain.getCanonicalHeadBlock()
		const startBlockNumber = Number(firstBlock.header.number)

		// Create second block with one transaction
		await callHandler(client)({
			from,
			to: to2,
			value: parseEther('1'),
			createTransaction: true,
		})
		await mineHandler(client)({})

		const lastBlock = await vm.blockchain.getCanonicalHeadBlock()
		const endBlockNumber = Number(lastBlock.header.number)

		// Call debug_traceChain
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
			params: [startBlockNumber, endBlockNumber, { tracer: 'callTracer' }],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
		})

		expect(response.result).toBeDefined()
		expect(Array.isArray(response.result)).toBe(true)
		expect(response.result.length).toBe(2) // Two blocks

		// Check first block
		expect(response.result[0]).toMatchObject({
			blockNumber: startBlockNumber,
		})
		expect(response.result[0].blockHash).toMatch(/^0x[0-9a-f]+$/i)
		expect(response.result[0].txTraces).toBeDefined()
		expect(Array.isArray(response.result[0].txTraces)).toBe(true)
		expect(response.result[0].txTraces.length).toBe(1)

		// Check transaction trace
		const txTrace = response.result[0].txTraces[0]
		expect(txTrace).toMatchObject({
			txIndex: 0,
		})
		expect(txTrace.txHash).toMatch(/^0x[0-9a-f]+$/i)
		expect(txTrace.result).toBeDefined()

		// Check second block
		expect(response.result[1]).toMatchObject({
			blockNumber: endBlockNumber,
		})
		expect(response.result[1].txTraces.length).toBe(1)
	})

	it('should handle single block range', async () => {
		const procedure = debugTraceChainJsonRpcProcedure(client)

		const from = createAddress('0x1000000000000000000000000000000000000000').toString()
		const to = createAddress('0x2000000000000000000000000000000000000000').toString()

		await setAccountHandler(client)({
			address: from,
			balance: parseEther('10'),
		})

		await callHandler(client)({
			from,
			to,
			value: parseEther('1'),
			createTransaction: true,
		})
		await mineHandler(client)({})

		const vm = await client.getVm()
		const block = await vm.blockchain.getCanonicalHeadBlock()
		const blockNumber = Number(block.header.number)

		// Call debug_traceChain with same start and end block
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
			params: [blockNumber, blockNumber, {}],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
		})

		expect(response.result).toBeDefined()
		expect(response.result.length).toBe(1)
	})

	it('should include empty blocks with no transactions', async () => {
		const procedure = debugTraceChainJsonRpcProcedure(client)

		// Mine empty block
		await mineHandler(client)({})
		const vm = await client.getVm()
		const block1 = await vm.blockchain.getCanonicalHeadBlock()
		const startBlockNumber = Number(block1.header.number)

		// Mine another empty block
		await mineHandler(client)({})
		const block2 = await vm.blockchain.getCanonicalHeadBlock()
		const endBlockNumber = Number(block2.header.number)

		// Call debug_traceChain
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
			params: [startBlockNumber, endBlockNumber, {}],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
		})

		expect(response.result).toBeDefined()
		expect(response.result.length).toBe(2)

		// Both blocks should have empty transaction traces
		expect(response.result[0].txTraces.length).toBe(0)
		expect(response.result[1].txTraces.length).toBe(0)
	})

	it('should return error for invalid block range (start > end)', async () => {
		const procedure = debugTraceChainJsonRpcProcedure(client)
		await mineHandler(client)({})
		await mineHandler(client)({})
		const vm = await client.getVm()
		const latestBlock = await vm.blockchain.getCanonicalHeadBlock()
		const startBlockNumber = Number(latestBlock.header.number)
		const endBlockNumber = startBlockNumber - 1

		// Call debug_traceChain with invalid range
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
			params: [startBlockNumber, endBlockNumber, {}],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
		})

		expect(response.error).toBeDefined()
		expect(response.error.code).toBe('-32602')
		expect(response.error.message).toContain('Invalid block range')
	})

	it('should work with different tracers', async () => {
		const procedure = debugTraceChainJsonRpcProcedure(client)

		const from = createAddress('0x1000000000000000000000000000000000000000').toString()
		const to = createAddress('0x2000000000000000000000000000000000000000').toString()

		await setAccountHandler(client)({
			address: from,
			balance: parseEther('10'),
		})

		await callHandler(client)({
			from,
			to,
			value: parseEther('1'),
			createTransaction: true,
		})
		await mineHandler(client)({})

		const vm = await client.getVm()
		const block = await vm.blockchain.getCanonicalHeadBlock()
		const blockNumber = Number(block.header.number)

		// Test with prestateTracer
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
			params: [blockNumber, blockNumber, { tracer: 'prestateTracer' }],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
		})

		expect(response.result).toBeDefined()
		expect(response.result.length).toBe(1)
		expect(response.result[0].txTraces[0].result).toBeDefined()
	})

	it('should handle block tags', async () => {
		const procedure = debugTraceChainJsonRpcProcedure(client)

		// Mine some blocks
		await mineHandler(client)({})
		await mineHandler(client)({})

		// Call debug_traceChain with 'latest' tag
		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
			params: ['latest', 'latest', {}],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_traceChain',
			id: 1,
		})

		expect(response.result).toBeDefined()
		expect(response.result.length).toBe(1)
	})
})
