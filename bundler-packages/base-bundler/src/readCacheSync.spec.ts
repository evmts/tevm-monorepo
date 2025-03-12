import { describe, expect, it, vi } from 'vitest'
import { readCacheSync } from './readCacheSync.js'

const mockCache = {
	readArtifactsSync: vi.fn(),
} as any

const mockLogger = {
	error: vi.fn(),
} as any

describe('readCacheSync', () => {
	it('should return undefined if cache.readArtifactsSync returns nothing', () => {
		mockCache.readArtifactsSync.mockReturnValueOnce(undefined)

		const result = readCacheSync(mockLogger, mockCache, 'test/path', false, false)

		expect(result).toBeUndefined()
		expect(mockCache.readArtifactsSync).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should return cached artifacts if they exist and no AST or bytecode is required', () => {
		const mockArtifacts = { artifacts: {} }
		mockCache.readArtifactsSync.mockReturnValueOnce(mockArtifacts)

		const result = readCacheSync(mockLogger, mockCache, 'test/path', false, false)

		expect(result).toBe(mockArtifacts)
		expect(mockCache.readArtifactsSync).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should return undefined if AST is required but not cached', () => {
		const mockArtifacts = { artifacts: {}, asts: {} }
		mockCache.readArtifactsSync.mockReturnValueOnce(mockArtifacts)

		const result = readCacheSync(mockLogger, mockCache, 'test/path', true, false)

		expect(result).toBeUndefined()
		expect(mockCache.readArtifactsSync).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should return cached artifacts if AST is required and available', () => {
		const mockArtifacts = { artifacts: {}, asts: { 'test.sol': {} } }
		mockCache.readArtifactsSync.mockReturnValueOnce(mockArtifacts)

		const result = readCacheSync(mockLogger, mockCache, 'test/path', true, false)

		expect(result).toBe(mockArtifacts)
		expect(mockCache.readArtifactsSync).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should return undefined if bytecode is required but not cached', () => {
		const mockArtifacts = {
			artifacts: {
				Contract1: { evm: { deployedBytecode: '' } },
			},
		}
		mockCache.readArtifactsSync.mockReturnValueOnce(mockArtifacts)

		const result = readCacheSync(mockLogger, mockCache, 'test/path', false, true)

		expect(result).toBeUndefined()
		expect(mockCache.readArtifactsSync).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should return cached artifacts if bytecode is required and available', () => {
		const mockArtifacts = {
			artifacts: {
				Contract1: { evm: { deployedBytecode: '0x1234' } },
			},
		}
		mockCache.readArtifactsSync.mockReturnValueOnce(mockArtifacts)

		const result = readCacheSync(mockLogger, mockCache, 'test/path', false, true)

		expect(result).toBe(mockArtifacts)
		expect(mockCache.readArtifactsSync).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should handle case where artifacts is undefined when checking bytecode', () => {
		const mockArtifacts = { asts: { 'test.sol': {} } }
		mockCache.readArtifactsSync.mockReturnValueOnce(mockArtifacts)

		const result = readCacheSync(mockLogger, mockCache, 'test/path', false, true)

		expect(result).toBeUndefined()
		expect(mockCache.readArtifactsSync).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).not.toHaveBeenCalled()
	})

	it('should log an error and return undefined if there is an error reading from cache', () => {
		mockCache.readArtifactsSync.mockImplementationOnce(() => {
			throw new Error('Test error')
		})

		const result = readCacheSync(mockLogger, mockCache, 'test/path', false, false)

		expect(result).toBeUndefined()
		expect(mockCache.readArtifactsSync).toHaveBeenCalledWith('test/path')
		expect(mockLogger.error).toHaveBeenCalledTimes(2)
	})
})
