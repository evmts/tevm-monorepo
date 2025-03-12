// Using ts-expect-error instead of ts-nocheck to be more precise
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { MineJsonRpcRequest } from './MineJsonRpcRequest.js'
import { mineProcedure } from './mineProcedure.js'

// Mock the hexToNumber and mineHandler modules
vi.mock('@tevm/utils', () => ({
	hexToNumber: vi.fn((hex) => Number.parseInt(hex, 16)),
}))

vi.mock('./mineHandler.js', () => ({
	mineHandler: vi.fn(),
}))

import { mineHandler } from './mineHandler.js'

describe('mineProcedure', () => {
	// Create a mock client with required properties
	const mockClient = {
		logger: { error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
		getReceiptsManager: vi.fn(),
		miningConfig: {},
		mode: 'normal',
		getVm: vi.fn(),
		ready: vi.fn(),
		deepCopy: vi.fn(),
	} as any

	const mockMineHandlerFn = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(mineHandler).mockReturnValue(mockMineHandlerFn)
	})

	it('should handle successful mining with default parameters', async () => {
		const blockHashes = ['0x123', '0x456']
		mockMineHandlerFn.mockResolvedValue({ blockHashes })

		const request: MineJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_mine',
			params: [] as any,
			id: 1,
		}

		const result = await mineProcedure(mockClient)(request)

		expect(mineHandler).toHaveBeenCalledWith(mockClient)
		expect(mockMineHandlerFn).toHaveBeenCalledWith({
			throwOnFail: false,
			interval: 0,
			blockCount: 1,
		})
		expect(result).toEqual({
			jsonrpc: '2.0',
			result: {
				blockHashes,
			},
			method: 'tevm_mine',
			id: 1,
		})
	})

	it('should handle custom block count and interval', async () => {
		const blockHashes = ['0x123', '0x456', '0x789']
		mockMineHandlerFn.mockResolvedValue({ blockHashes })

		const request: MineJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_mine',
			params: ['0x3', '0x5'],
			id: 2,
		}

		const result = await mineProcedure(mockClient)(request)

		expect(mockMineHandlerFn).toHaveBeenCalledWith({
			throwOnFail: false,
			interval: 5,
			blockCount: 3,
		})
		expect(result).toEqual({
			jsonrpc: '2.0',
			result: {
				blockHashes,
			},
			method: 'tevm_mine',
			id: 2,
		})
	})

	it('should handle errors from mineHandler', async () => {
		const error = new Error('Mining failed') as Error & { code?: number }
		error.code = -32000
		mockMineHandlerFn.mockResolvedValue({
			errors: [error],
			blockHashes: [],
		})

		const request: MineJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_mine',
			params: [] as any,
			id: 3,
		}

		const result = await mineProcedure(mockClient)(request)

		expect(result).toEqual({
			jsonrpc: '2.0',
			error: {
				code: -32000,
				message: 'Mining failed',
				data: {
					errors: ['Mining failed'],
				},
			},
			method: 'tevm_mine',
			id: 3,
		})
	})

	it('should handle case when no blocks were mined', async () => {
		mockMineHandlerFn.mockResolvedValue({ blockHashes: [] })

		const request: MineJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_mine',
			params: [] as any,
			id: 4,
		}

		const result = await mineProcedure(mockClient)(request)

		// Match against the actual error format
		expect(result).toMatchObject({
			jsonrpc: '2.0',
			error: {
				code: -32603,
				message: expect.stringContaining('No blocks were mined'),
			},
			method: 'tevm_mine',
			id: 4,
		})
	})

	it('should handle requests without id', async () => {
		const blockHashes = ['0x123']
		mockMineHandlerFn.mockResolvedValue({ blockHashes })

		const request: MineJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_mine',
			params: [] as any,
		}

		const result = await mineProcedure(mockClient)(request)

		expect(result).toEqual({
			jsonrpc: '2.0',
			result: {
				blockHashes,
			},
			method: 'tevm_mine',
		})
	})

	it('should handle undefined blockHashes result', async () => {
		mockMineHandlerFn.mockResolvedValue({})

		const request: MineJsonRpcRequest = {
			jsonrpc: '2.0',
			method: 'tevm_mine',
			params: [] as any,
			id: 5,
		}

		const result = await mineProcedure(mockClient)(request)

		// Match against the actual error format
		expect(result).toMatchObject({
			jsonrpc: '2.0',
			error: {
				code: -32603,
				message: expect.stringContaining('No blocks were mined'),
			},
			method: 'tevm_mine',
			id: 5,
		})
	})
})
