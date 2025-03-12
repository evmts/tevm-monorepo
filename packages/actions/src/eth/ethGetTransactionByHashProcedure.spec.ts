// @ts-nocheck - Disabling TypeScript checks for test file to simplify mocking
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ethGetTransactionByHashJsonRpcProcedure } from './ethGetTransactionByHashProcedure.js'

// Mock dependencies
vi.mock('@tevm/jsonrpc', () => ({
	createJsonRpcFetcher: vi.fn(() => ({
		request: vi.fn(),
	})),
}))

vi.mock('@tevm/utils', () => ({
	hexToBytes: vi.fn((hex) => new Uint8Array([1, 2, 3, 4])),
}))

vi.mock('../utils/txToJsonRpcTx.js', () => ({
	txToJsonRpcTx: vi.fn((tx, block, index) => ({
		hash: '0x1234',
		blockHash: '0x5678',
		blockNumber: '0x1',
		transactionIndex: `0x${index.toString(16)}`,
	})),
}))

import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToBytes } from '@tevm/utils'
import { txToJsonRpcTx } from '../utils/txToJsonRpcTx.js'

describe('ethGetTransactionByHashJsonRpcProcedure', () => {
	const mockTx = { hash: () => new Uint8Array([1, 2, 3, 4]) }
	const mockBlock = { transactions: [mockTx] }
	const mockTxHash = '0x1234abcd'

	let mockClient: any
	let mockFetcher: any
	let mockVm: any
	let mockBlockchain: any
	let mockReceiptsManager: any

	beforeEach(() => {
		mockBlockchain = {
			getBlock: vi.fn().mockResolvedValue(mockBlock),
		}

		mockVm = {
			blockchain: mockBlockchain,
		}

		mockReceiptsManager = {
			getReceiptByTxHash: vi.fn(),
		}

		mockClient = {
			getVm: vi.fn().mockResolvedValue(mockVm),
			getReceiptsManager: vi.fn().mockResolvedValue(mockReceiptsManager),
		}

		mockFetcher = { request: vi.fn() }
		vi.mocked(createJsonRpcFetcher).mockReturnValue(mockFetcher)
	})

	it('should return transaction details when found locally', async () => {
		// Setup - transaction found locally
		mockReceiptsManager.getReceiptByTxHash.mockResolvedValue([{}, '0xblockHash', 0])

		const request = {
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			params: [mockTxHash],
			id: 1,
		}

		const procedure = ethGetTransactionByHashJsonRpcProcedure(mockClient)
		const response = await procedure(request)

		// Verify the procedure calls
		expect(mockClient.getVm).toHaveBeenCalled()
		expect(mockClient.getReceiptsManager).toHaveBeenCalled()
		expect(mockReceiptsManager.getReceiptByTxHash).toHaveBeenCalledWith(expect.any(Uint8Array))
		expect(mockBlockchain.getBlock).toHaveBeenCalledWith('0xblockHash')

		// Verify response
		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			result: {
				hash: '0x1234',
				blockHash: '0x5678',
				blockNumber: '0x1',
				transactionIndex: '0x0',
			},
			id: 1,
		})
	})

	it('should handle when transaction not found locally and no fork transport', async () => {
		// Setup - transaction not found locally
		mockReceiptsManager.getReceiptByTxHash.mockResolvedValue(null)

		const request = {
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			params: [mockTxHash],
			id: 1,
		}

		const procedure = ethGetTransactionByHashJsonRpcProcedure(mockClient)
		const response = await procedure(request)

		// Verify response is an error
		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			id: 1,
			error: {
				code: -32602,
				message: 'Transaction not found',
			},
		})
	})

	it('should fetch from fork when transaction not found locally', async () => {
		// Setup - transaction not found locally but fork transport exists
		mockReceiptsManager.getReceiptByTxHash.mockResolvedValue(null)
		mockClient.forkTransport = {}

		const mockForkedTx = {
			hash: '0x1234',
			blockHash: '0x5678',
			blockNumber: '0x1a',
			transactionIndex: '0x2',
		}

		mockFetcher.request.mockResolvedValue({
			jsonrpc: '2.0',
			id: 1,
			result: mockForkedTx,
		})

		const request = {
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			params: [mockTxHash],
			id: 1,
		}

		const procedure = ethGetTransactionByHashJsonRpcProcedure(mockClient)
		const response = await procedure(request)

		// Verify fork fetcher was used
		expect(createJsonRpcFetcher).toHaveBeenCalledWith(mockClient.forkTransport)
		expect(mockFetcher.request).toHaveBeenCalledWith({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getTransactionByHash',
			params: [mockTxHash],
		})

		// Verify response
		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			result: mockForkedTx,
			id: 1,
		})
	})

	it('should handle errors from fork transport', async () => {
		// Setup - transaction not found locally and fork transport returns error
		mockReceiptsManager.getReceiptByTxHash.mockResolvedValue(null)
		mockClient.forkTransport = {}

		mockFetcher.request.mockResolvedValue({
			jsonrpc: '2.0',
			id: 1,
			error: {
				code: -32000,
				message: 'Fork error',
			},
		})

		const request = {
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			params: [mockTxHash],
			id: 1,
		}

		const procedure = ethGetTransactionByHashJsonRpcProcedure(mockClient)
		const response = await procedure(request)

		// Verify response contains the error from fork
		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			id: 1,
			error: {
				code: -32000,
				message: 'Fork error',
			},
		})
	})

	it('should handle when receipt found but tx not in block', async () => {
		// Setup - receipt found but tx not in block
		mockReceiptsManager.getReceiptByTxHash.mockResolvedValue([{}, '0xblockHash', 1])
		mockBlock.transactions = [mockTx] // Only has index 0, not index 1

		const request = {
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			params: [mockTxHash],
			id: 1,
		}

		const procedure = ethGetTransactionByHashJsonRpcProcedure(mockClient)
		const response = await procedure(request)

		// Verify response is an error
		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			id: 1,
			error: {
				code: -32602,
				message: 'Transaction not found',
			},
		})
	})

	it('should handle requests without ID', async () => {
		// Setup - transaction found locally
		mockReceiptsManager.getReceiptByTxHash.mockResolvedValue([{}, '0xblockHash', 0])

		const request = {
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			params: [mockTxHash],
		}

		const procedure = ethGetTransactionByHashJsonRpcProcedure(mockClient)
		const response = await procedure(request)

		// Verify response doesn't have id
		expect(response).toEqual({
			jsonrpc: '2.0',
			method: 'eth_getTransactionByHash',
			result: {
				hash: '0x1234',
				blockHash: '0x5678',
				blockNumber: '0x1',
				transactionIndex: '0x0',
			},
		})
		expect(response).not.toHaveProperty('id')
	})
})
