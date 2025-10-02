import { createTevmNode, type TevmNode } from '@tevm/node'
import { beforeEach, describe, expect, it } from 'vitest'
import { ethBlobBaseFeeJsonRpcProcedure } from './ethBlobBaseFeeProcedure.js'

let client: TevmNode

beforeEach(() => {
	client = createTevmNode()
})

describe('ethBlobBaseFeeJsonRpcProcedure', () => {
	it('should return the blob base fee', async () => {
		const request: any = {
			jsonrpc: '2.0',
			method: 'eth_blobBaseFee',
			id: 1,
			params: [],
		}

		const response = await ethBlobBaseFeeJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_blobBaseFee' as any)
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})

	it('should handle requests without an id', async () => {
		const request: any = {
			jsonrpc: '2.0',
			method: 'eth_blobBaseFee',
			params: [],
		}

		const response = await ethBlobBaseFeeJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_blobBaseFee' as any)
		expect(response.id).toBeUndefined()
		expect(response.result).toMatchSnapshot()
	})

	it('should handle requests with additional parameters', async () => {
		const request: any = {
			jsonrpc: '2.0',
			method: 'eth_blobBaseFee',
			id: 1,
			params: ['0x1'], // Additional parameters should be ignored
		}

		const response = await ethBlobBaseFeeJsonRpcProcedure(client)(request)
		expect(response.error).toBeUndefined()
		expect(response.result).toBeDefined()
		expect(response.method).toBe('eth_blobBaseFee' as any)
		expect(response.id).toBe(request.id as any)
		expect(response.result).toMatchSnapshot()
	})
})
