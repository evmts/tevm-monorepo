import { resolveArtifacts } from '@tevm/compiler'
import { generateRuntime } from '@tevm/runtime'
import { runPromise } from 'effect/Effect'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readCache } from './readCache.js'
import { resolveModuleAsync } from './resolveModuleAsync.js'
import { writeCache } from './writeCache.js'

// Mock dependencies
vi.mock('./readCache.js', () => ({
	readCache: vi.fn(),
}))

vi.mock('./writeCache.js', () => ({
	writeCache: vi.fn(),
}))

vi.mock('@tevm/compiler', () => ({
	resolveArtifacts: vi.fn(),
}))

vi.mock('@tevm/runtime', () => ({
	generateRuntime: vi.fn(),
}))

vi.mock('effect/Effect', () => ({
	runPromise: vi.fn(),
}))

describe('resolveModuleAsync', () => {
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
		;(writeCache as any).mockResolvedValue(undefined)
	})

	it('should use cached result when available', async () => {
		const mockCachedResult = {
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: { 'Contract.sol': {} },
			artifacts: { Contract: { abi: [], evm: { deployedBytecode: '0x123' } } },
			modules: {},
		}

		const mockCode = 'export const Contract = {...}'
		;(readCache as any).mockResolvedValue(mockCachedResult)
		;(runPromise as any).mockResolvedValue(mockCode)

		const result = await resolveModuleAsync(
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

		expect(readCache).toHaveBeenCalledWith(mockLogger, cache, modulePath, true, true)
		expect(resolveArtifacts).not.toHaveBeenCalled()
		expect(generateRuntime).toHaveBeenCalledWith(mockCachedResult.artifacts, 'mjs', true, contractPackage)
		expect(result).toEqual({
			solcInput: mockCachedResult.solcInput,
			solcOutput: mockCachedResult.solcOutput,
			asts: mockCachedResult.asts,
			modules: mockCachedResult.modules,
			code: mockCode,
		})
		expect(writeCache).toHaveBeenCalled()
	})

	it('should resolve artifacts when no cache is available', async () => {
		const mockResolvedResult = {
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: { 'Contract.sol': {} },
			artifacts: { Contract: { abi: [], evm: { deployedBytecode: '0x123' } } },
			modules: {},
		}

		const mockCode = 'export const Contract = {...}'
		;(readCache as any).mockResolvedValue(undefined)
		;(resolveArtifacts as any).mockResolvedValue(mockResolvedResult)
		;(runPromise as any).mockResolvedValue(mockCode)

		const result = await resolveModuleAsync(
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

		expect(readCache).toHaveBeenCalledWith(mockLogger, cache, modulePath, true, true)
		expect(resolveArtifacts).toHaveBeenCalledWith(
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
		expect(writeCache).toHaveBeenCalled()
	})

	it('should handle the case when no artifacts are present', async () => {
		const mockResolvedResult = {
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: {},
			artifacts: {},
			modules: {},
		}
		;(readCache as any).mockResolvedValue(undefined)
		;(resolveArtifacts as any).mockResolvedValue(mockResolvedResult)

		const result = await resolveModuleAsync(
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

		expect(runPromise).not.toHaveBeenCalled()
		expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('there were no artifacts for'))
		expect(result.code).toContain('there were no artifacts for')
		expect(writeCache).toHaveBeenCalled()
	})

	it('should handle errors in writeCache', async () => {
		const mockResolvedResult = {
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: { 'Contract.sol': {} },
			artifacts: { Contract: { abi: [], evm: { deployedBytecode: '0x123' } } },
			modules: {},
		}

		const mockCode = 'export const Contract = {...}'
		const mockError = new Error('Cache write error')
		;(readCache as any).mockResolvedValue(undefined)
		;(resolveArtifacts as any).mockResolvedValue(mockResolvedResult)
		;(runPromise as any).mockResolvedValue(mockCode)
		;(writeCache as any).mockRejectedValue(mockError)

		const result = await resolveModuleAsync(
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

		// Wait for the rejection handler to be called
		await new Promise((resolve) => setTimeout(resolve, 10))

		expect(mockLogger.error).toHaveBeenCalledWith(mockError)
		expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('there was an error writing to the cache'))
		expect(result).toEqual({
			solcInput: mockResolvedResult.solcInput,
			solcOutput: mockResolvedResult.solcOutput,
			asts: mockResolvedResult.asts,
			modules: mockResolvedResult.modules,
			code: mockCode,
		})
	})

	it('should throw and log errors from resolveArtifacts', async () => {
		const mockError = new Error('Resolve artifacts error')
		;(readCache as any).mockResolvedValue(undefined)
		;(resolveArtifacts as any).mockRejectedValue(mockError)

		await expect(
			resolveModuleAsync(
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
		).rejects.toThrow(mockError)

		expect(mockLogger.error).toHaveBeenCalledWith(
			expect.stringContaining('there was an error in tevm plugin resolving .mjs'),
		)
		expect(mockLogger.error).toHaveBeenCalledWith(mockError)
	})
})
