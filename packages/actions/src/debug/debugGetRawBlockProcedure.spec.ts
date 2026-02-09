import { Common, createCommon, optimism } from '@tevm/common'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import { debugGetRawBlockJsonRpcProcedure } from './debugGetRawBlockProcedure.js'

let node: TevmNode
let common: Common

beforeEach(async () => {
	common = createCommon({ ...optimism, hardfork: 'cancun' })
	node = await createTevmNode({ common })
})

describe('debugGetRawBlockJsonRpcProcedure', () => {
	it('should return RLP-encoded block for latest', async () => {
		const procedure = debugGetRawBlockJsonRpcProcedure(node)

		const response = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawBlock',
			params: ['latest'],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawBlock',
		})

		expect(response.result).toBeDefined()
		expect(typeof response.result).toBe('string')
		expect(response.result).toMatch(/^0x/)
	})

	it('should return RLP-encoded block by block number', async () => {
		// Get the genesis block
		const vm = await node.getVm()
		const _genesisBlock = await vm.blockchain.getBlock(0n)

		const procedure = debugGetRawBlockJsonRpcProcedure(node)

		const response = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawBlock',
			params: ['0x0'],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawBlock',
		})

		expect(response.result).toBeDefined()
		expect(typeof response.result).toBe('string')
		expect(response.result).toMatch(/^0x/)

		// Verify the result is a valid hex string of reasonable length
		const hexData = response.result.slice(2)
		expect(hexData.length).toBeGreaterThan(0)
		expect(/^[0-9a-f]+$/i.test(hexData)).toBe(true)
	})

	it('should return error for invalid block', async () => {
		const procedure = debugGetRawBlockJsonRpcProcedure(node)

		const response = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawBlock',
			params: ['0x999999'],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawBlock',
		})

		expect(response.error).toBeDefined()
		expect(response.error.code).toBe('-32603')
	})

	it('should use default latest when no params provided', async () => {
		const procedure = debugGetRawBlockJsonRpcProcedure(node)

		const response = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawBlock',
			params: [],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawBlock',
		})

		expect(response.result).toBeDefined()
		expect(typeof response.result).toBe('string')
		expect(response.result).toMatch(/^0x/)
	})
})
