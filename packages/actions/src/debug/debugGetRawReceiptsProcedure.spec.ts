import { Common, createCommon, optimism } from '@tevm/common'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import { debugGetRawReceiptsJsonRpcProcedure } from './debugGetRawReceiptsProcedure.js'

let node: TevmNode
let common: Common

beforeEach(async () => {
	common = createCommon({ ...optimism, hardfork: 'cancun' })
	node = await createTevmNode({ common })
})

describe('debugGetRawReceiptsJsonRpcProcedure', () => {
	it('should return receipts array for latest block', async () => {
		const procedure = debugGetRawReceiptsJsonRpcProcedure(node)

		const response = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawReceipts',
			params: ['latest'],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawReceipts',
		})

		expect(response.result).toBeDefined()
		expect(Array.isArray(response.result)).toBe(true)
		// Genesis block has no transactions, so no receipts
		expect(response.result).toEqual([])
	})

	it('should return receipts array by block number', async () => {
		const procedure = debugGetRawReceiptsJsonRpcProcedure(node)

		const response = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawReceipts',
			params: ['0x0'],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawReceipts',
		})

		expect(response.result).toBeDefined()
		expect(Array.isArray(response.result)).toBe(true)
	})

	it('should return error for invalid block', async () => {
		const procedure = debugGetRawReceiptsJsonRpcProcedure(node)

		const response = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawReceipts',
			params: ['0x999999'],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawReceipts',
		})

		expect(response.error).toBeDefined()
		expect(response.error.code).toBe(-32603)
	})

	it('should use default latest when no params provided', async () => {
		const procedure = debugGetRawReceiptsJsonRpcProcedure(node)

		const response = await procedure({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawReceipts',
			params: [],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			method: 'debug_getRawReceipts',
		})

		expect(response.result).toBeDefined()
		expect(Array.isArray(response.result)).toBe(true)
	})

	it('should omit id when request has no id', async () => {
		const procedure = debugGetRawReceiptsJsonRpcProcedure(node)

		const response = await procedure({
			jsonrpc: '2.0',
			method: 'debug_getRawReceipts',
			params: ['latest'],
		})

		expect(response).toMatchObject({
			jsonrpc: '2.0',
			method: 'debug_getRawReceipts',
		})
		expect(response.id).toBeUndefined()
		expect(response.result).toBeDefined()
	})
})
