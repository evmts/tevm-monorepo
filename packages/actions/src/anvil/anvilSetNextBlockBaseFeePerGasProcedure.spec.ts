import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetNextBlockBaseFeePerGasJsonRpcProcedure } from './anvilSetNextBlockBaseFeePerGasProcedure.js'

describe('anvilSetNextBlockBaseFeePerGasJsonRpcProcedure', () => {
	it('should set base fee for the next block only', async () => {
		const client = createTevmNode()
		const procedure = anvilSetNextBlockBaseFeePerGasJsonRpcProcedure(client)

		// Set a custom base fee (1 gwei)
		const newBaseFee = 1000000000n
		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setNextBlockBaseFeePerGas',
			params: [`0x${newBaseFee.toString(16)}`],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setNextBlockBaseFeePerGas',
			result: null,
			id: 1,
		})

		// Verify the base fee is set
		expect(client.getNextBlockBaseFeePerGas()).toBe(newBaseFee)
	})

	it('should clear after being used (mimicking mineHandler behavior)', async () => {
		const client = createTevmNode()
		const procedure = anvilSetNextBlockBaseFeePerGasJsonRpcProcedure(client)

		const newBaseFee = 2000000000n // 2 gwei
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setNextBlockBaseFeePerGas',
			params: [`0x${newBaseFee.toString(16)}`],
			id: 1,
		})

		expect(client.getNextBlockBaseFeePerGas()).toBe(newBaseFee)

		// After "using" it (which mineHandler does), it should be cleared
		client.setNextBlockBaseFeePerGas(undefined)
		expect(client.getNextBlockBaseFeePerGas()).toBeUndefined()
	})

	it('should handle request without id', async () => {
		const client = createTevmNode()
		const procedure = anvilSetNextBlockBaseFeePerGasJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setNextBlockBaseFeePerGas',
			params: ['0x3B9ACA00'], // 1 gwei in hex
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setNextBlockBaseFeePerGas',
			result: null,
		})
		expect(result).not.toHaveProperty('id')
	})

	it('should handle very low base fees', async () => {
		const client = createTevmNode()
		const procedure = anvilSetNextBlockBaseFeePerGasJsonRpcProcedure(client)

		const lowBaseFee = 1n // 1 wei
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setNextBlockBaseFeePerGas',
			params: [`0x${lowBaseFee.toString(16)}`],
			id: 1,
		})

		expect(client.getNextBlockBaseFeePerGas()).toBe(lowBaseFee)
	})

	it('should handle high base fees', async () => {
		const client = createTevmNode()
		const procedure = anvilSetNextBlockBaseFeePerGasJsonRpcProcedure(client)

		const highBaseFee = 100000000000n // 100 gwei
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setNextBlockBaseFeePerGas',
			params: [`0x${highBaseFee.toString(16)}`],
			id: 1,
		})

		expect(client.getNextBlockBaseFeePerGas()).toBe(highBaseFee)
	})

	it('should allow setting base fee to zero', async () => {
		const client = createTevmNode()
		const procedure = anvilSetNextBlockBaseFeePerGasJsonRpcProcedure(client)

		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setNextBlockBaseFeePerGas',
			params: ['0x0'],
			id: 1,
		})

		expect(client.getNextBlockBaseFeePerGas()).toBe(0n)
	})
})
