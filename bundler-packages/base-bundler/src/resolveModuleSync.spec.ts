import { resolveArtifactsSync } from '@tevm/compiler'
import { generateRuntime } from '@tevm/runtime'
import { runSync } from 'effect/Effect'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readCacheSync } from './readCacheSync.js'
import { resolveModuleSync } from './resolveModuleSync.js'
import { writeCacheSync } from './writeCacheSync.js'

// Mock dependencies
vi.mock('./readCacheSync.js', () => ({
	readCacheSync: vi.fn(),
}))

vi.mock('./writeCacheSync.js', () => ({
	writeCacheSync: vi.fn(),
}))

vi.mock('@tevm/compiler', () => ({
	resolveArtifactsSync: vi.fn(),
}))

vi.mock('@tevm/runtime', () => ({
	generateRuntime: vi.fn(),
}))

vi.mock('effect/Effect', () => ({
	runSync: vi.fn(),
}))

describe('resolveModuleSync', () => {
	const mockLogger = {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		debug: vi.fn(),
		log: vi.fn(),
	}

	const mockConfig = {
		jsonAsConst: [],
		foundryProject: false,
		libs: [],
		remappings: {},
		cacheDir: '/tmp/cache',
	}
	const mockFao = {
		writeFileSync: vi.fn(),
		writeFile: vi.fn(),
		readFile: vi.fn(),
		readFileSync: vi.fn(),
		exists: vi.fn(),
		existsSync: vi.fn(),
		statSync: vi.fn(),
		stat: vi.fn(),
		mkdirSync: vi.fn(),
		mkdir: vi.fn(),
	}
	// Using type assertion for solc as we don't need its full API for testing
	const mockSolc = {} as any
	const modulePath = '/path/to/module.sol'
	const basedir = '/base/dir'
	const cache = {
		readArtifacts: vi.fn(),
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
	const contractPackage = 'tevm/contract'

	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should use cached result when available', () => {
		const mockCachedResult = {
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: { 'Contract.sol': {} },
			artifacts: { Contract: { abi: [], evm: { deployedBytecode: '0x123' } } },
			modules: {},
		}

		const mockCode = 'export const Contract = {...}'
		;(readCacheSync as any).mockReturnValue(mockCachedResult)
		;(runSync as any).mockReturnValue(mockCode)

		const result = resolveModuleSync(
			mockLogger,
			mockConfig,
			mockFao,
			mockSolc,
			modulePath,
			basedir,
			true,
			true,
			'mjs',
			cache,
			contractPackage,
		)

		expect(readCacheSync).toHaveBeenCalledWith(mockLogger, cache, modulePath, true, true)
		expect(resolveArtifactsSync).not.toHaveBeenCalled()
		expect(generateRuntime).toHaveBeenCalledWith(mockCachedResult.artifacts, 'mjs', true, contractPackage)
		expect(result).toEqual({
			solcInput: mockCachedResult.solcInput,
			solcOutput: mockCachedResult.solcOutput,
			asts: mockCachedResult.asts,
			modules: mockCachedResult.modules,
			code: mockCode,
		})
		expect(writeCacheSync).toHaveBeenCalled()
	})

	it('should resolve artifacts when no cache is available', () => {
		const mockResolvedResult = {
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: { 'Contract.sol': {} },
			artifacts: { Contract: { abi: [], evm: { deployedBytecode: '0x123' } } },
			modules: {},
		}

		const mockCode = 'export const Contract = {...}'
		;(readCacheSync as any).mockReturnValue(undefined)
		;(resolveArtifactsSync as any).mockReturnValue(mockResolvedResult)
		;(runSync as any).mockReturnValue(mockCode)

		const result = resolveModuleSync(
			mockLogger,
			mockConfig,
			mockFao,
			mockSolc,
			modulePath,
			basedir,
			true,
			true,
			'mjs',
			cache,
			contractPackage,
		)

		expect(readCacheSync).toHaveBeenCalledWith(mockLogger, cache, modulePath, true, true)
		expect(resolveArtifactsSync).toHaveBeenCalledWith(
			modulePath,
			basedir,
			mockLogger,
			mockConfig,
			true,
			true,
			mockFao,
			mockSolc,
		)
		expect(generateRuntime).toHaveBeenCalledWith(mockResolvedResult.artifacts, 'mjs', true, contractPackage)
		expect(result).toEqual({
			solcInput: mockResolvedResult.solcInput,
			solcOutput: mockResolvedResult.solcOutput,
			asts: mockResolvedResult.asts,
			modules: mockResolvedResult.modules,
			code: mockCode,
		})
		expect(writeCacheSync).toHaveBeenCalled()
	})

	it('should handle the case when no artifacts are present', () => {
		const mockResolvedResult = {
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: {},
			artifacts: {},
			modules: {},
		}
		;(readCacheSync as any).mockReturnValue(undefined)
		;(resolveArtifactsSync as any).mockReturnValue(mockResolvedResult)

		const result = resolveModuleSync(
			mockLogger,
			mockConfig,
			mockFao,
			mockSolc,
			modulePath,
			basedir,
			true,
			true,
			'mjs',
			cache,
			contractPackage,
		)

		expect(runSync).not.toHaveBeenCalled()
		expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('there were no artifacts for'))
		expect(result.code).toContain('there were no artifacts for')
		expect(writeCacheSync).toHaveBeenCalled()
	})

	it('should throw and log errors', () => {
		const mockError = new Error('Resolve artifacts error')
		;(readCacheSync as any).mockReturnValue(undefined)
		;(resolveArtifactsSync as any).mockImplementation(() => {
			throw mockError
		})

		expect(() =>
			resolveModuleSync(
				mockLogger,
				mockConfig,
				mockFao,
				mockSolc,
				modulePath,
				basedir,
				true,
				true,
				'mjs',
				cache,
				contractPackage,
			),
		).toThrow(mockError)

		expect(mockLogger.error).toHaveBeenCalledWith(
			expect.stringContaining('there was an error in tevm plugin resolving .mjs'),
		)
		expect(mockLogger.error).toHaveBeenCalledWith(mockError)
	})

	it('should handle errors when generating runtime', () => {
		const mockResolvedResult = {
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: { 'Contract.sol': {} },
			artifacts: { Contract: { abi: [], evm: { deployedBytecode: '0x123' } } },
			modules: {},
		}

		const mockError = new Error('Runtime generation error')
		;(readCacheSync as any).mockReturnValue(undefined)
		;(resolveArtifactsSync as any).mockReturnValue(mockResolvedResult)
		;(runSync as any).mockImplementation(() => {
			throw mockError
		})

		expect(() =>
			resolveModuleSync(
				mockLogger,
				mockConfig,
				mockFao,
				mockSolc,
				modulePath,
				basedir,
				true,
				true,
				'mjs',
				cache,
				contractPackage,
			),
		).toThrow(mockError)

		expect(mockLogger.error).toHaveBeenCalledWith(
			expect.stringContaining('there was an error in tevm plugin resolving .mjs'),
		)
		expect(mockLogger.error).toHaveBeenCalledWith(mockError)
	})
})