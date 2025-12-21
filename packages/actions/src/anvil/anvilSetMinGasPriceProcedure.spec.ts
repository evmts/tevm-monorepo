import { createTevmNode } from '@tevm/node'
import { describe, expect, it } from 'vitest'
import { anvilSetMinGasPriceJsonRpcProcedure } from './anvilSetMinGasPriceProcedure.js'

describe('anvilSetMinGasPriceJsonRpcProcedure', () => {
	it('should set minimum gas price', async () => {
		const client = createTevmNode()
		const procedure = anvilSetMinGasPriceJsonRpcProcedure(client)

		// Set minimum gas price to 1 gwei
		const minGasPrice = 1000000000n
		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setMinGasPrice',
			params: [`0x${minGasPrice.toString(16)}`],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setMinGasPrice',
			result: null,
			id: 1,
		})

		// Verify the minimum gas price is set
		expect(client.getMinGasPrice()).toBe(minGasPrice)
	})

	it('should persist across operations', async () => {
		const client = createTevmNode()
		const procedure = anvilSetMinGasPriceJsonRpcProcedure(client)

		const minGasPrice = 2000000000n // 2 gwei
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setMinGasPrice',
			params: [`0x${minGasPrice.toString(16)}`],
			id: 1,
		})

		// The minimum gas price should persist
		expect(client.getMinGasPrice()).toBe(minGasPrice)

		// And remain set until explicitly changed
		expect(client.getMinGasPrice()).toBe(minGasPrice)
	})

	it('should handle request without id', async () => {
		const client = createTevmNode()
		const procedure = anvilSetMinGasPriceJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setMinGasPrice',
			params: ['0x3B9ACA00'], // 1 gwei in hex
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setMinGasPrice',
			result: null,
		})
		expect(result).not.toHaveProperty('id')
	})

	it('should handle very low minimum gas prices', async () => {
		const client = createTevmNode()
		const procedure = anvilSetMinGasPriceJsonRpcProcedure(client)

		const lowMinGasPrice = 1n // 1 wei
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setMinGasPrice',
			params: [`0x${lowMinGasPrice.toString(16)}`],
			id: 1,
		})

		expect(client.getMinGasPrice()).toBe(lowMinGasPrice)
	})

	it('should handle high minimum gas prices', async () => {
		const client = createTevmNode()
		const procedure = anvilSetMinGasPriceJsonRpcProcedure(client)

		const highMinGasPrice = 100000000000n // 100 gwei
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setMinGasPrice',
			params: [`0x${highMinGasPrice.toString(16)}`],
			id: 1,
		})

		expect(client.getMinGasPrice()).toBe(highMinGasPrice)
	})

	it('should allow setting minimum gas price to zero', async () => {
		const client = createTevmNode()
		const procedure = anvilSetMinGasPriceJsonRpcProcedure(client)

		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setMinGasPrice',
			params: ['0x0'],
			id: 1,
		})

		expect(client.getMinGasPrice()).toBe(0n)
	})

	it('should allow updating the minimum gas price', async () => {
		const client = createTevmNode()
		const procedure = anvilSetMinGasPriceJsonRpcProcedure(client)

		// Set initial minimum gas price
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setMinGasPrice',
			params: ['0x3B9ACA00'], // 1 gwei
			id: 1,
		})
		expect(client.getMinGasPrice()).toBe(1000000000n)

		// Update to a higher minimum gas price
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setMinGasPrice',
			params: ['0x77359400'], // 2 gwei
			id: 2,
		})
		expect(client.getMinGasPrice()).toBe(2000000000n)
	})

	it('should allow clearing minimum gas price by setting to undefined', async () => {
		const client = createTevmNode()
		const procedure = anvilSetMinGasPriceJsonRpcProcedure(client)

		// Set a minimum gas price
		await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setMinGasPrice',
			params: ['0x3B9ACA00'],
			id: 1,
		})
		expect(client.getMinGasPrice()).toBe(1000000000n)

		// Clear it
		client.setMinGasPrice(undefined)
		expect(client.getMinGasPrice()).toBeUndefined()
	})
})
