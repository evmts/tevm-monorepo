import { InvalidBlockError } from '@tevm/errors'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { parseBlockParam } from './parseBlockParam.js'

describe('parseBlockParam', () => {
	let mockBlockchain: any

	beforeEach(() => {
		mockBlockchain = {
			getBlock: vi.fn(),
			blocksByTag: new Map(),
			logger: {
				error: vi.fn(),
			},
		}
	})

	it('should handle number input', async () => {
		const result = await parseBlockParam(mockBlockchain, 123 as any)
		expect(result).toBe(123n)
	})

	it('should handle bigint input', async () => {
		const result = await parseBlockParam(mockBlockchain, 456n)
		expect(result).toBe(456n)
	})

	it('should handle hex block number', async () => {
		mockBlockchain.getBlock.mockResolvedValue({ header: { number: 789 } })
		const hash = `0x${'12'.repeat(32)}` as const
		const result = await parseBlockParam(mockBlockchain, hash)
		expect(result).toBe(789n)
	})

	it('should handle hex string block number input', async () => {
		mockBlockchain.getBlock.mockResolvedValue({ header: { number: 789 } })
		const result = await parseBlockParam(mockBlockchain, '0x123')
		expect(result).toBe(291n)
	})

	it('should handle "safe" tag', async () => {
		mockBlockchain.blocksByTag.set('safe', { header: { number: 101n } })
		const result = await parseBlockParam(mockBlockchain, 'safe')
		expect(result).toBe(101n)
	})

	it('should throw error for unsupported "safe" tag', async () => {
		await expect(parseBlockParam(mockBlockchain, 'safe')).rejects.toThrow(InvalidBlockError)
	})

	it('should handle "latest" tag', async () => {
		mockBlockchain.blocksByTag.set('latest', { header: { number: 202n } })
		const result = await parseBlockParam(mockBlockchain, 'latest')
		expect(result).toBe(202n)
	})

	it('should handle undefined as "latest"', async () => {
		mockBlockchain.blocksByTag.set('latest', { header: { number: 303n } })
		const result = await parseBlockParam(mockBlockchain, undefined as any)
		expect(result).toBe(303n)
	})

	it('should throw error for missing "latest" block', async () => {
		await expect(parseBlockParam(mockBlockchain, 'latest')).rejects.toThrow(InvalidBlockError)
	})

	it('should throw error for "pending" tag', async () => {
		await expect(parseBlockParam(mockBlockchain, 'pending')).rejects.toThrow(InvalidBlockError)
	})

	it('should handle "earliest" tag', async () => {
		const result = await parseBlockParam(mockBlockchain, 'earliest')
		expect(result).toBe(1n)
	})

	it('should throw error for "finalized" tag', async () => {
		await expect(parseBlockParam(mockBlockchain, 'finalized')).rejects.toThrow(InvalidBlockError)
	})

	it('should throw error for unknown block param', async () => {
		await expect(parseBlockParam(mockBlockchain, 'unknown' as any)).rejects.toThrow(InvalidBlockError)
		expect(mockBlockchain.logger.error).toHaveBeenCalled()
	})
})
