import { describe, expect, it, vi } from 'vitest'
import { readCache } from './readCache.js'

const mockCache = {
	readArtifacts: vi.fn(),
} as any

const mockLogger = {
	error: vi.fn(),
} as any

describe('readCache', () => {
	it('should return undefined if cache.readArtifacts returns nothing', async () => {
		mockCache.readArtifacts.mockResolvedValueOnce(undefined)

		const result = await readCache(mockLogger, mockCache, 'test/path', false, false)

		expect(result).toBeUndefined()
		expect(mockCache.readArtifacts).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should return cached artifacts if they exist and no AST or bytecode is required', async () => {
		const mockArtifacts = { artifacts: {} }
		mockCache.readArtifacts.mockResolvedValueOnce(mockArtifacts)

		const result = await readCache(mockLogger, mockCache, 'test/path', false, false)

		expect(result).toBe(mockArtifacts)
		expect(mockCache.readArtifacts).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should return undefined if AST is required but not cached', async () => {
		const mockArtifacts = { artifacts: {}, asts: {} }
		mockCache.readArtifacts.mockResolvedValueOnce(mockArtifacts)

		const result = await readCache(mockLogger, mockCache, 'test/path', true, false)

		expect(result).toBeUndefined()
		expect(mockCache.readArtifacts).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should return cached artifacts if AST is required and available', async () => {
		const mockArtifacts = { artifacts: {}, asts: { 'test.sol': {} } }
		mockCache.readArtifacts.mockResolvedValueOnce(mockArtifacts)

		const result = await readCache(mockLogger, mockCache, 'test/path', true, false)

		expect(result).toBe(mockArtifacts)
		expect(mockCache.readArtifacts).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should return undefined if bytecode is required but not cached', async () => {
		const mockArtifacts = {
			artifacts: {
				Contract1: { evm: { deployedBytecode: '' } },
			},
		}
		mockCache.readArtifacts.mockResolvedValueOnce(mockArtifacts)

		const result = await readCache(mockLogger, mockCache, 'test/path', false, true)

		expect(result).toBeUndefined()
		expect(mockCache.readArtifacts).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should return cached artifacts if bytecode is required and available', async () => {
		const mockArtifacts = {
			artifacts: {
				Contract1: { evm: { deployedBytecode: '0x1234' } },
			},
		}
		mockCache.readArtifacts.mockResolvedValueOnce(mockArtifacts)

		const result = await readCache(mockLogger, mockCache, 'test/path', false, true)

		expect(result).toBe(mockArtifacts)
		expect(mockCache.readArtifacts).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should handle case where artifacts is undefined when checking bytecode', async () => {
		const mockArtifacts = { asts: { 'test.sol': {} } }
		mockCache.readArtifacts.mockResolvedValueOnce(mockArtifacts)

		const result = await readCache(mockLogger, mockCache, 'test/path', false, true)

		expect(result).toBeUndefined()
		expect(mockCache.readArtifacts).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should log an error and return undefined if there is an error reading from cache', async () => {
		mockCache.readArtifacts.mockRejectedValueOnce(new Error('Test error'))

		const result = await readCache(mockLogger, mockCache, 'test/path', false, false)

		expect(result).toBeUndefined()
		expect(mockCache.readArtifacts).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).toHaveBeenCalledTimes(2)
	})

	it('should handle checking bytecode in multiple contracts', async () => {
		const mockArtifacts = {
			artifacts: {
				Contract1: { evm: { deployedBytecode: { object: '0x1234' } } },
				Contract2: { evm: { deployedBytecode: { object: '' } } },  // Empty bytecode
				Contract3: { evm: { deployedBytecode: { object: '0x5678' } } },
				Contract4: {}, // No evm field at all
			},
		}
		mockCache.readArtifacts.mockResolvedValueOnce(mockArtifacts)

		const result = await readCache(mockLogger, mockCache, 'test/path', false, true)

		// Should return undefined because not all contracts have bytecode
		expect(result).toBeUndefined()
		expect(mockCache.readArtifacts).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should handle case with nested deployedBytecode structure', async () => {
		const mockArtifacts = {
			artifacts: {
				Contract1: { 
					evm: { 
						deployedBytecode: { 
							object: '0x1234',
							sourceMap: '0:100:0',
							linkReferences: {},
						} 
					} 
				},
			},
		}
		mockCache.readArtifacts.mockResolvedValueOnce(mockArtifacts)

		const result = await readCache(mockLogger, mockCache, 'test/path', false, true)

		// Should successfully recognize the nested structure
		expect(result).toBe(mockArtifacts)
		expect(mockCache.readArtifacts).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})
})
