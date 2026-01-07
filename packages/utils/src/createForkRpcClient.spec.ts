import { describe, expect, it, vi } from 'vitest'
import { createForkRpcClient } from './createForkRpcClient.js'

describe('createForkRpcClient', () => {
	describe('getBytecode', () => {
		it('should call eth_getCode with correct params', async () => {
			const mockRequest = vi.fn().mockResolvedValue('0x608060405234801561001057600080fd5b')
			const client = createForkRpcClient({ request: mockRequest })

			const result = await client.getBytecode({
				address: '0x1234567890123456789012345678901234567890',
				blockNumber: 12345678n
			})

			expect(mockRequest).toHaveBeenCalledWith({
				method: 'eth_getCode',
				params: ['0x1234567890123456789012345678901234567890', '0xbc614e']
			})
			expect(result).toBe('0x608060405234801561001057600080fd5b')
		})

		it('should use blockTag when blockNumber not provided', async () => {
			const mockRequest = vi.fn().mockResolvedValue('0x6080')
			const client = createForkRpcClient({ request: mockRequest })

			await client.getBytecode({
				address: '0x1234567890123456789012345678901234567890',
				blockTag: 'pending'
			})

			expect(mockRequest).toHaveBeenCalledWith({
				method: 'eth_getCode',
				params: ['0x1234567890123456789012345678901234567890', 'pending']
			})
		})

		it('should default to latest when no block specified', async () => {
			const mockRequest = vi.fn().mockResolvedValue('0x6080')
			const client = createForkRpcClient({ request: mockRequest })

			await client.getBytecode({
				address: '0x1234567890123456789012345678901234567890'
			})

			expect(mockRequest).toHaveBeenCalledWith({
				method: 'eth_getCode',
				params: ['0x1234567890123456789012345678901234567890', 'latest']
			})
		})

		it('should return undefined for empty code', async () => {
			const mockRequest = vi.fn().mockResolvedValue('0x')
			const client = createForkRpcClient({ request: mockRequest })

			const result = await client.getBytecode({
				address: '0x1234567890123456789012345678901234567890'
			})

			expect(result).toBeUndefined()
		})

		it('should return undefined for null response', async () => {
			const mockRequest = vi.fn().mockResolvedValue(null)
			const client = createForkRpcClient({ request: mockRequest })

			const result = await client.getBytecode({
				address: '0x1234567890123456789012345678901234567890'
			})

			expect(result).toBeUndefined()
		})
	})

	describe('getStorageAt', () => {
		it('should call eth_getStorageAt with correct params', async () => {
			const mockRequest = vi.fn().mockResolvedValue('0x000000000000000000000000000000000000000000000000000000000000002a')
			const client = createForkRpcClient({ request: mockRequest })

			const result = await client.getStorageAt({
				address: '0x1234567890123456789012345678901234567890',
				slot: '0x0',
				blockNumber: 15000000n
			})

			expect(mockRequest).toHaveBeenCalledWith({
				method: 'eth_getStorageAt',
				params: ['0x1234567890123456789012345678901234567890', '0x0', '0xe4e1c0']
			})
			expect(result).toBe('0x000000000000000000000000000000000000000000000000000000000000002a')
		})

		it('should return 0x0 for null response', async () => {
			const mockRequest = vi.fn().mockResolvedValue(null)
			const client = createForkRpcClient({ request: mockRequest })

			const result = await client.getStorageAt({
				address: '0x1234567890123456789012345678901234567890',
				slot: '0x0'
			})

			expect(result).toBe('0x0')
		})
	})

	describe('getProof', () => {
		it('should call eth_getProof with correct params and format response', async () => {
			const mockResponse = {
				address: '0x1234567890123456789012345678901234567890',
				balance: '0x64',
				nonce: '0xa',
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				accountProof: ['0xf851', '0xf871'],
				storageProof: [
					{
						key: '0x0',
						value: '0x2a',
						proof: ['0xf843', '0xf871']
					}
				]
			}
			const mockRequest = vi.fn().mockResolvedValue(mockResponse)
			const client = createForkRpcClient({ request: mockRequest })

			const result = await client.getProof({
				address: '0x1234567890123456789012345678901234567890',
				storageKeys: ['0x0'],
				blockNumber: 12345678n
			})

			expect(mockRequest).toHaveBeenCalledWith({
				method: 'eth_getProof',
				params: ['0x1234567890123456789012345678901234567890', ['0x0'], '0xbc614e']
			})

			expect(result).toEqual({
				address: '0x1234567890123456789012345678901234567890',
				balance: 100n,
				nonce: 10n,
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				accountProof: ['0xf851', '0xf871'],
				storageProof: [
					{
						key: '0x0',
						value: '0x2a',
						proof: ['0xf843', '0xf871']
					}
				]
			})
		})

		it('should use blockTag when provided', async () => {
			const mockResponse = {
				address: '0x1234567890123456789012345678901234567890',
				balance: '0x0',
				nonce: '0x0',
				codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				storageHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
				accountProof: [],
				storageProof: []
			}
			const mockRequest = vi.fn().mockResolvedValue(mockResponse)
			const client = createForkRpcClient({ request: mockRequest })

			await client.getProof({
				address: '0x1234567890123456789012345678901234567890',
				storageKeys: [],
				blockTag: 'safe'
			})

			expect(mockRequest).toHaveBeenCalledWith({
				method: 'eth_getProof',
				params: ['0x1234567890123456789012345678901234567890', [], 'safe']
			})
		})
	})
})
