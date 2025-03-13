import { type ModuleType } from '@tevm/runtime'
import { describe, expect, it, vi } from 'vitest'
import { readCache } from './readCache.js'
import { readCacheSync } from './readCacheSync.js'
import { writeCache } from './writeCache.js'
import { writeCacheSync } from './writeCacheSync.js'

describe('cache handling edge cases', () => {
	const mockLogger = {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		log: vi.fn(),
		debug: vi.fn(),
	}

	const mockArtifacts = {
		solcInput: { sources: {} },
		solcOutput: { contracts: {} },
		asts: { 'Contract.sol': {} },
		artifacts: {
			Contract: {
				abi: [],
				userdoc: {
					methods: {},
					kind: 'user',
					version: 1,
				},
				evm: { deployedBytecode: { object: '0x123' } },
			},
		},
		modules: {},
	} as any // Using type assertion to avoid overly complex typing

	const modulePath = '/path/to/module.sol'
	const mockCode = 'export const Contract = {...}'

	describe('complex cache scenarios', () => {
		it('should handle corrupted cache data in readCache', async () => {
			// Create a mock cache that returns corrupted data
			const mockCache = {
				readArtifacts: vi.fn().mockRejectedValue(new Error('Corrupted cache data')),
				// Other required cache methods
				readArtifactsSync: vi.fn(),
				writeArtifacts: vi.fn(),
				writeArtifactsSync: vi.fn(),
				readDtsSync: vi.fn(),
				readDts: vi.fn(),
				readMjsSync: vi.fn(),
				readMjs: vi.fn(),
				writeDtsSync: vi.fn(),
				writeDts: vi.fn(),
				writeMjsSync: vi.fn(),
				writeMjs: vi.fn(),
			}

			const result = await readCache(mockLogger, mockCache, modulePath, true, true)

			// Should return undefined for corrupted cache data
			expect(result).toBeUndefined()
			expect(mockLogger.error).toHaveBeenCalled()
		})

		it('should handle corrupted cache data in readCacheSync', () => {
			// Create a mock cache that throws an error
			const mockCache = {
				readArtifactsSync: vi.fn().mockImplementation(() => {
					throw new Error('Corrupted cache data')
				}),
				// Other required cache methods
				readArtifacts: vi.fn(),
				writeArtifacts: vi.fn(),
				writeArtifactsSync: vi.fn(),
				readDtsSync: vi.fn(),
				readDts: vi.fn(),
				readMjsSync: vi.fn(),
				readMjs: vi.fn(),
				writeDtsSync: vi.fn(),
				writeDts: vi.fn(),
				writeMjsSync: vi.fn(),
				writeMjs: vi.fn(),
			}

			const result = readCacheSync(mockLogger, mockCache, modulePath, true, true)

			// Should return undefined for corrupted cache data
			expect(result).toBeUndefined()
			// readCacheSync logs errors when exceptions occur
			expect(mockLogger.error).toHaveBeenCalledWith(
				expect.stringContaining('there was an error in tevm plugin reading cache for'),
			)
		})

		it('should handle cache with partial data (missing bytecode)', async () => {
			// Create a mock cache with artifacts missing bytecode data
			const artifactsWithoutBytecode = {
				...mockArtifacts,
				artifacts: {
					Contract: {
						abi: [],
						userdoc: {
							methods: {},
							kind: 'user',
							version: 1,
						},
						// Missing evm/bytecode
					},
				},
			} as any

			const mockCache = {
				readArtifacts: vi.fn().mockResolvedValue(artifactsWithoutBytecode),
				// Other required methods
				readArtifactsSync: vi.fn(),
				writeArtifacts: vi.fn(),
				writeArtifactsSync: vi.fn(),
				readDtsSync: vi.fn(),
				readDts: vi.fn(),
				readMjsSync: vi.fn(),
				readMjs: vi.fn(),
				writeDtsSync: vi.fn(),
				writeDts: vi.fn(),
				writeMjsSync: vi.fn(),
				writeMjs: vi.fn(),
			}

			// Request bytecode in the result
			const result = await readCache(mockLogger, mockCache, modulePath, false, true)

			// Should return undefined since bytecode was requested but not available
			expect(result).toBeUndefined()
		})
	})

	describe('cache operations under load', () => {
		it('should handle race conditions in cache writing', async () => {
			// Create a mock cache where writeArtifacts has delayed resolution
			const mockCache = {
				writeArtifacts: vi.fn().mockImplementation(() => {
					return new Promise((resolve) => setTimeout(resolve, 50))
				}),
				writeDts: vi.fn().mockResolvedValue(undefined),
				writeMjs: vi.fn().mockResolvedValue(undefined),
				// Other required methods
				readArtifacts: vi.fn(),
				readArtifactsSync: vi.fn(),
				writeArtifactsSync: vi.fn(),
				readDtsSync: vi.fn(),
				readDts: vi.fn(),
				readMjsSync: vi.fn(),
				readMjs: vi.fn(),
				writeDtsSync: vi.fn(),
				writeMjsSync: vi.fn(),
			}

			// Perform multiple concurrent writes
			const promises = []
			for (let i = 0; i < 3; i++) {
				promises.push(
					writeCache(
						mockLogger,
						mockCache as any,
						mockArtifacts,
						mockCode,
						`${modulePath}${i}`,
						'dts' as ModuleType,
						true,
					),
				)
			}

			// All writes should complete successfully
			await Promise.all(promises)

			// Verify all writes were attempted
			expect(mockCache.writeArtifacts).toHaveBeenCalledTimes(3)
			expect(mockCache.writeDts).toHaveBeenCalledTimes(3)
		})

		it('should handle various module types in writeCacheSync', () => {
			const moduleTypes = ['dts', 'mjs', 'unknown'] as ModuleType[]
			const mockCache = {
				writeArtifactsSync: vi.fn(),
				writeDts: vi.fn(),
				writeMjs: vi.fn(),
				writeDtsSync: vi.fn(),
				writeMjsSync: vi.fn(),
				// Other required methods
				readArtifactsSync: vi.fn(),
				readArtifacts: vi.fn(),
				readDtsSync: vi.fn(),
				readDts: vi.fn(),
				readMjsSync: vi.fn(),
				readMjs: vi.fn(),
				writeArtifacts: vi.fn(),
			}

			// Test each module type
			moduleTypes.forEach((moduleType) => {
				writeCacheSync(mockLogger, mockCache as any, mockArtifacts, mockCode, modulePath, moduleType, true)
			})

			// Verify correct calls based on module type
			expect(mockCache.writeArtifactsSync).toHaveBeenCalledTimes(3) // Once for each module type
			expect(mockCache.writeDts).toHaveBeenCalledTimes(1) // Only for 'dts'
			expect(mockCache.writeMjs).toHaveBeenCalledTimes(1) // Only for 'mjs'
			expect(mockLogger.warn).toHaveBeenCalledTimes(1) // Only for 'unknown'
		})
	})

	describe('memory and performance considerations', () => {
		it('should handle large artifact data efficiently', async () => {
			// Create a cache with "large" artifact data
			const largeArtifacts = {
				...mockArtifacts,
				// Add many contract entries to simulate a large codebase
				artifacts: Object.fromEntries(
					Array.from({ length: 100 }).map((_, i) => [
						`Contract${i}`,
						{
							abi: Array.from({ length: 20 }).map((_, j) => ({
								name: `method${j}`,
								type: 'function',
								inputs: [],
								outputs: [],
								stateMutability: 'nonpayable',
							})),
							userdoc: {
								methods: {},
								kind: 'user',
								version: 1,
							},
							evm: {
								deployedBytecode: {
									object: `0x${'abcdef'.repeat(100)}`, // Large bytecode
								},
							},
						},
					]),
				),
			} as any

			const mockCache = {
				writeArtifacts: vi.fn().mockResolvedValue(undefined),
				writeDts: vi.fn().mockResolvedValue(undefined),
				// Other required methods
				readArtifacts: vi.fn(),
				readArtifactsSync: vi.fn(),
				writeArtifactsSync: vi.fn(),
				readDtsSync: vi.fn(),
				readDts: vi.fn(),
				readMjsSync: vi.fn(),
				readMjs: vi.fn(),
				writeDtsSync: vi.fn(),
				writeMjs: vi.fn(),
				writeMjsSync: vi.fn(),
			}

			// Performance test - time this operation
			const startTime = Date.now()
			await writeCache(mockLogger, mockCache as any, largeArtifacts, mockCode, modulePath, 'dts', true)
			const duration = Date.now() - startTime

			// Should complete reasonably quickly (difficult to set exact threshold)
			expect(duration).toBeLessThan(1000) // Should be much faster than 1 second
			expect(mockCache.writeArtifacts).toHaveBeenCalled()
			expect(mockCache.writeDts).toHaveBeenCalled()
		})
	})
})
