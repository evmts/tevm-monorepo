import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilIncreaseTimeJsonRpcProcedure } from './anvilIncreaseTimeProcedure.js'

describe('anvilIncreaseTimeJsonRpcProcedure', () => {
	it('should increase time and return seconds increased', async () => {
		const node = createTevmNode()
		await node.ready()
		const procedure = anvilIncreaseTimeJsonRpcProcedure(node)

		// Get current block timestamp
		const vm = await node.getVm()
		const latestBlock = await vm.blockchain.getCanonicalHeadBlock()
		const currentTimestamp = latestBlock.header.timestamp

		const secondsToIncrease = 3600n // 1 hour

		const result = await procedure({
			method: 'anvil_increaseTime',
			params: [`0x${secondsToIncrease.toString(16)}`],
			jsonrpc: '2.0',
		})

		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_increaseTime')
		expect(result.result).toBe(`0x${secondsToIncrease.toString(16)}`)
		expect(node.getNextBlockTimestamp()).toBe(currentTimestamp + secondsToIncrease)
	})

	it('should handle decimal string params', async () => {
		const node = createTevmNode()
		await node.ready()
		const procedure = anvilIncreaseTimeJsonRpcProcedure(node)

		const vm = await node.getVm()
		const latestBlock = await vm.blockchain.getCanonicalHeadBlock()
		const currentTimestamp = latestBlock.header.timestamp

		const secondsToIncrease = 60n

		const result = await procedure({
			method: 'anvil_increaseTime',
			params: [secondsToIncrease.toString()],
			jsonrpc: '2.0',
		})

		expect(result.result).toBe(`0x${secondsToIncrease.toString(16)}`)
		expect(node.getNextBlockTimestamp()).toBe(currentTimestamp + secondsToIncrease)
	})

	it('should handle requests with id', async () => {
		const node = createTevmNode()
		await node.ready()
		const procedure = anvilIncreaseTimeJsonRpcProcedure(node)

		const result = await procedure({
			method: 'anvil_increaseTime',
			params: ['0x3c'], // 60 seconds
			jsonrpc: '2.0',
			id: 1,
		})

		expect(result.id).toBe(1)
	})
})
