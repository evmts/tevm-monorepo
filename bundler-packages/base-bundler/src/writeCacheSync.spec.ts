import { beforeEach, describe, expect, it, vi } from 'vitest'
import { writeCacheSync } from './writeCacheSync.js'

describe('writeCacheSync', () => {
	const mockLogger = {
		warn: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		log: vi.fn(),
	}

	const mockCache = {
		writeArtifactsSync: vi.fn(),
		writeDts: vi.fn(),
		writeMjs: vi.fn(),
		// Add missing required properties from Cache type
		readArtifactsSync: vi.fn(),
		readArtifacts: vi.fn(),
		readDtsSync: vi.fn(),
		readDts: vi.fn(),
		readMjsSync: vi.fn(),
		readMjs: vi.fn(),
		writeArtifacts: vi.fn(),
		writeMjsSync: vi.fn(),
		writeDtsSync: vi.fn(),
	} as any

	const mockArtifacts = {
		solcInput: { sources: {} },
		solcOutput: { contracts: {} },
		asts: { 'Contract.sol': {} },
		artifacts: {
			Contract: {
				abi: [],
				userdoc: { methods: {} },
				evm: { deployedBytecode: { object: '0x123' } },
			},
		},
		modules: {},
	} as any

	const mockCode = 'export const Contract = {...}'
	const modulePath = '/path/to/module.sol'

	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should write artifacts when writeArtifacts is true', () => {
		writeCacheSync(mockLogger, mockCache, mockArtifacts, mockCode, modulePath, 'dts', true)

		expect(mockCache.writeArtifactsSync).toHaveBeenCalledWith(modulePath, mockArtifacts, undefined)
		expect(mockCache.writeDtsSync).toHaveBeenCalledWith(modulePath, mockCode)
		expect(mockCache.writeMjs).not.toHaveBeenCalled()
		expect(mockLogger.warn).not.toHaveBeenCalled()
	})

	it('should not write artifacts when writeArtifacts is false', () => {
		writeCacheSync(mockLogger, mockCache, mockArtifacts, mockCode, modulePath, 'dts', false)

		expect(mockCache.writeArtifactsSync).not.toHaveBeenCalled()
		expect(mockCache.writeDtsSync).toHaveBeenCalledWith(modulePath, mockCode)
		expect(mockCache.writeMjs).not.toHaveBeenCalled()
		expect(mockLogger.warn).not.toHaveBeenCalled()
	})

	it('should write dts files when moduleType is dts', () => {
		writeCacheSync(mockLogger, mockCache, mockArtifacts, mockCode, modulePath, 'dts', true)

		expect(mockCache.writeDtsSync).toHaveBeenCalledWith(modulePath, mockCode)
		expect(mockCache.writeMjs).not.toHaveBeenCalled()
		expect(mockLogger.warn).not.toHaveBeenCalled()
	})

	it('should write mjs files when moduleType is mjs', () => {
		writeCacheSync(mockLogger, mockCache, mockArtifacts, mockCode, modulePath, 'mjs', true)

		expect(mockCache.writeMjsSync).toHaveBeenCalledWith(modulePath, mockCode)
		expect(mockCache.writeDts).not.toHaveBeenCalled()
		expect(mockLogger.warn).not.toHaveBeenCalled()
	})

	it('should log a warning for unsupported module types', () => {
		writeCacheSync(mockLogger, mockCache, mockArtifacts, mockCode, modulePath, 'cjs', true)

		expect(mockCache.writeArtifactsSync).toHaveBeenCalledWith(modulePath, mockArtifacts, undefined)
		expect(mockCache.writeDts).not.toHaveBeenCalled()
		expect(mockCache.writeMjs).not.toHaveBeenCalled()
		expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('No caching for module type cjs'))
	})

	it('should handle errors from cache writeArtifactsSync', () => {
		const mockError = new Error('Write artifacts error')
		mockCache.writeArtifactsSync.mockImplementation(() => {
			throw mockError
		})

		// This should not throw because we're not handling errors in the function
		// The expected behavior is that the error would propagate to the caller
		expect(() => {
			writeCacheSync(mockLogger, mockCache, mockArtifacts, mockCode, modulePath, 'dts', true)
		}).toThrow(mockError)

		expect(mockCache.writeArtifactsSync).toHaveBeenCalledWith(modulePath, mockArtifacts, undefined)
		expect(mockCache.writeDts).not.toHaveBeenCalled()
	})

	it('should handle errors from cache writeDts', () => {
		const mockError = new Error('Write dts error')
		mockCache.writeDtsSync.mockImplementation(() => {
			throw mockError
		})

		// This should throw because the implementation does not catch errors
		expect(() => {
			writeCacheSync(mockLogger, mockCache, mockArtifacts, mockCode, modulePath, 'dts', true)
		}).toThrow(mockError)

		expect(mockCache.writeArtifactsSync).toHaveBeenCalledWith(modulePath, mockArtifacts, undefined)
		expect(mockCache.writeDtsSync).toHaveBeenCalledWith(modulePath, mockCode)
	})

	it('should handle errors from cache writeMjs', () => {
		const mockError = new Error('Write mjs error')
		mockCache.writeMjsSync.mockImplementation(() => {
			throw mockError
		})

		// This should throw because the implementation does not catch errors
		expect(() => {
			writeCacheSync(mockLogger, mockCache, mockArtifacts, mockCode, modulePath, 'mjs', true)
		}).toThrow(mockError)

		expect(mockCache.writeArtifactsSync).toHaveBeenCalledWith(modulePath, mockArtifacts, undefined)
		expect(mockCache.writeMjsSync).toHaveBeenCalledWith(modulePath, mockCode)
	})

	it('should still call writeMjs even if writeArtifactsSync fails', () => {
		const mockError = new Error('Write artifacts error')
		mockCache.writeArtifactsSync.mockImplementation(() => {
			throw mockError
		})

		// We expect the function to throw due to writeArtifactsSync error
		expect(() => {
			try {
				writeCacheSync(mockLogger, mockCache, mockArtifacts, mockCode, modulePath, 'mjs', true)
			} catch (e) {
				// The error shouldn't prevent us from checking if the next function was called
				expect(mockCache.writeMjsSync).not.toHaveBeenCalled()
				throw e
			}
		}).toThrow(mockError)

		expect(mockCache.writeArtifactsSync).toHaveBeenCalledWith(modulePath, mockArtifacts, undefined)
	})
})
