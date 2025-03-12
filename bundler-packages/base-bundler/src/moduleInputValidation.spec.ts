import { describe, expect, it, vi } from 'vitest'
import { resolveModuleAsync } from './resolveModuleAsync.js'
import { resolveModuleSync } from './resolveModuleSync.js'

// This test file focuses specifically on input validation
// for both sync and async resolver methods

describe('module resolvers input validation', () => {
	// Setup simple mocks for dependencies
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

	const mockSolc = {
		version: '0.8.17',
		semver: '0.8.17',
		license: 'MIT',
		lowlevel: {
			compileSingle: vi.fn(),
			compileMulti: vi.fn(),
			compileCallback: vi.fn(),
		},
		compile: vi.fn(),
		features: {},
		loadRemoteVersion: vi.fn(),
		setupMethods: vi.fn(),
	}
	const mockCache = {
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
	const contractPackage = '@tevm/contract'

	// Mock implementations to avoid actual file system interaction
	// and network calls during tests
	vi.mock('./readCache.js', () => ({
		readCache: vi.fn().mockResolvedValue({
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: { 'Contract.sol': {} },
			artifacts: {
				Contract: {
					abi: [],
					userdoc: { methods: {}, kind: 'user', version: 1 },
					evm: { deployedBytecode: { object: '0x123' } },
				},
			},
			modules: {},
		}),
	}))

	vi.mock('./readCacheSync.js', () => ({
		readCacheSync: vi.fn().mockReturnValue({
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: { 'Contract.sol': {} },
			artifacts: {
				Contract: {
					abi: [],
					userdoc: { methods: {}, kind: 'user', version: 1 },
					evm: { deployedBytecode: { object: '0x123' } },
				},
			},
			modules: {},
		}),
	}))

	vi.mock('@tevm/compiler', () => ({
		resolveArtifacts: vi.fn().mockResolvedValue({
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: { 'Contract.sol': {} },
			artifacts: {
				Contract: {
					abi: [],
					userdoc: { methods: {}, kind: 'user', version: 1 },
					evm: { deployedBytecode: { object: '0x123' } },
				},
			},
			modules: {},
		}),
		resolveArtifactsSync: vi.fn().mockReturnValue({
			solcInput: { sources: {} },
			solcOutput: { contracts: {} },
			asts: { 'Contract.sol': {} },
			artifacts: {
				Contract: {
					abi: [],
					userdoc: { methods: {}, kind: 'user', version: 1 },
					evm: { deployedBytecode: { object: '0x123' } },
				},
			},
			modules: {},
		}),
	}))

	vi.mock('@tevm/runtime', () => ({
		generateRuntime: vi.fn().mockReturnValue({
			_tag: 'RuntimeGenerated',
			code: 'export const Contract = {}',
		}),
	}))

	vi.mock('effect/Effect', () => ({
		runPromise: vi.fn().mockResolvedValue('export const Contract = {}'),
		runSync: vi.fn().mockReturnValue('export const Contract = {}'),
	}))

	vi.mock('./writeCache.js', () => ({
		writeCache: vi.fn().mockResolvedValue(undefined),
	}))

	vi.mock('./writeCacheSync.js', () => ({
		writeCacheSync: vi.fn(),
	}))

	// Test invalid module types
	describe('invalid module types', () => {
		it('should handle invalid module type in resolveModuleAsync', async () => {
			const result = await resolveModuleAsync(
				mockLogger,
				mockConfig,
				mockFao,
				mockSolc,
				'contract.sol',
				'/basedir',
				false,
				false,
				'invalid' as any,
				mockCache,
				contractPackage,
			)

			// Should still generate a result
			expect(result).toBeDefined()
			expect(result.code).toBeDefined()
		})

		it('should handle invalid module type in resolveModuleSync', () => {
			const result = resolveModuleSync(
				mockLogger,
				mockConfig,
				mockFao,
				mockSolc,
				'contract.sol',
				'/basedir',
				false,
				false,
				'invalid' as any,
				mockCache,
				contractPackage,
			)

			// Should still generate a result
			expect(result).toBeDefined()
			expect(result.code).toBeDefined()
		})
	})
})
