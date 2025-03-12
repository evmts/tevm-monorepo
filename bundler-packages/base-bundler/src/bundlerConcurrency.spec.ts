import { tmpdir } from 'node:os'
import { createCache } from '@tevm/bundler-cache'
import { resolveArtifacts } from '@tevm/compiler'
import { type Mock, describe, expect, it, vi } from 'vitest'
import { bundler } from './bundler.js'

// Mock @tevm/compiler
vi.mock('@tevm/compiler', () => ({
	resolveArtifacts: vi.fn(),
	resolveArtifactsSync: vi.fn(),
}))

describe('bundler concurrency', () => {
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

	const mockSolc = {} as any
	const contractPackage = '@tevm/contract'
	const mockCache = createCache(tmpdir(), mockFao, tmpdir())

	const mockModules = {
		module1: {
			id: 'id',
			rawCode: `import { TestContract } from 'module2'
contract TestContract {}`,
			code: `import { TestContract } from 'module2'
contract TestContract {}`,
			importedIds: ['module2'],
		},
	}

	const resolver = bundler(mockConfig as any, mockLogger, mockFao as any, mockSolc, mockCache, contractPackage)

	const mockResolveArtifacts = resolveArtifacts as Mock

	it('should process multiple files concurrently', async () => {
		// Setup for first module
		const firstArtifacts = {
			Contract1: {
				contractName: 'Contract1',
				abi: [
					{
						name: 'method1',
						type: 'function',
						inputs: [],
						outputs: [],
						stateMutability: 'nonpayable',
					},
				],
				userdoc: {
					methods: {},
					kind: 'user',
					version: 1,
				},
				evm: { deployedBytecode: { object: '0x111' } },
			},
		}

		// Setup for second module
		const secondArtifacts = {
			Contract2: {
				contractName: 'Contract2',
				abi: [
					{
						name: 'method2',
						type: 'function',
						inputs: [],
						outputs: [],
						stateMutability: 'nonpayable',
					},
				],
				userdoc: {
					methods: {},
					kind: 'user',
					version: 1,
				},
				evm: { deployedBytecode: { object: '0x222' } },
			},
		}

		// Mock for first module call
		mockResolveArtifacts.mockImplementationOnce(async () => ({
			artifacts: firstArtifacts,
			modules: mockModules,
			asts: { 'Contract1.sol': {} },
			solcInput: { language: 'Solidity', settings: {}, sources: {} },
			solcOutput: { contracts: {}, sources: {} },
		}))

		// Mock for second module call
		mockResolveArtifacts.mockImplementationOnce(async () => ({
			artifacts: secondArtifacts,
			modules: mockModules,
			asts: { 'Contract2.sol': {} },
			solcInput: { language: 'Solidity', settings: {}, sources: {} },
			solcOutput: { contracts: {}, sources: {} },
		}))

		// Start concurrent processing of both modules
		const firstPromise = resolver.resolveEsmModule('module1.sol', 'basedir', false, true)
		const secondPromise = resolver.resolveEsmModule('module2.sol', 'basedir', false, true)

		// Wait for both to complete
		const [firstResult, secondResult] = await Promise.all([firstPromise, secondPromise])

		// Verify results contain correct contract names
		expect(firstResult.code).toContain('Contract1')
		expect(secondResult.code).toContain('Contract2')

		// Verify correct module names were passed to the compiler
		expect(mockResolveArtifacts).toHaveBeenCalledWith(
			'module1.sol',
			'basedir',
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.anything(),
		)
		expect(mockResolveArtifacts).toHaveBeenCalledWith(
			'module2.sol',
			'basedir',
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.anything(),
		)
	})

	it('should handle multiple module types concurrently', async () => {
		const artifacts = {
			Contract: {
				contractName: 'Contract',
				abi: [
					{
						name: 'method',
						type: 'function',
						inputs: [],
						outputs: [],
						stateMutability: 'nonpayable',
					},
				],
				userdoc: {
					methods: {},
					kind: 'user',
					version: 1,
				},
				evm: { deployedBytecode: { object: '0x111' } },
			},
		}

		// Reset mock and configure for multiple calls
		mockResolveArtifacts.mockReset()
		mockResolveArtifacts.mockImplementation(async () => ({
			artifacts,
			modules: mockModules,
			asts: { 'Contract.sol': {} },
			solcInput: { language: 'Solidity', settings: {}, sources: {} },
			solcOutput: { contracts: {}, sources: {} },
		}))

		// Process the same module with different module types concurrently
		const mjsPromise = resolver.resolveEsmModule('module.sol', 'basedir', false, true)
		const dtsPromise = resolver.resolveDts('module.sol', 'basedir', false, true)

		// Wait for both to complete
		const [mjsResult, dtsResult] = await Promise.all([mjsPromise, dtsPromise])

		// Verify distinct output formats
		expect(mjsResult.code).toContain('export const Contract')
		expect(dtsResult.code).toContain('Contract<')
	})

	it('should handle error in one concurrent operation without affecting others', async () => {
		// Setup for successful module
		const artifacts = {
			Contract: {
				contractName: 'Contract',
				abi: [
					{
						name: 'method',
						type: 'function',
						inputs: [],
						outputs: [],
						stateMutability: 'nonpayable',
					},
				],
				userdoc: {
					methods: {},
					kind: 'user',
					version: 1,
				},
				evm: { deployedBytecode: { object: '0x111' } },
			},
		}

		// Reset mock to clear previous calls
		mockResolveArtifacts.mockReset()

		// Mock for successful call
		mockResolveArtifacts.mockImplementationOnce(async () => ({
			artifacts,
			modules: mockModules,
			asts: { 'Contract.sol': {} },
			solcInput: { language: 'Solidity', settings: {}, sources: {} },
			solcOutput: { contracts: {}, sources: {} },
		}))

		// Mock for failing call
		mockResolveArtifacts.mockImplementationOnce(async () => {
			throw new Error('Compilation failed')
		})

		// Start concurrent operations
		const successPromise = resolver.resolveEsmModule('success.sol', 'basedir', false, true)
		const failPromise = resolver.resolveEsmModule('fail.sol', 'basedir', false, true)

		// Wait for successful operation
		const successResult = await successPromise
		expect(successResult.code).toContain('Contract')

		// Verify failing operation errors
		await expect(failPromise).rejects.toThrow('Compilation failed')
	})

	it('should handle large number of concurrent operations', async () => {
		const numOperations = 5 // Simulate 5 concurrent operations

		// Reset mock
		mockResolveArtifacts.mockReset()

		// Create artifacts for each operation
		const promises: Promise<any>[] = []

		for (let i = 0; i < numOperations; i++) {
			const contractName = `Contract${i}`
			const artifacts = {
				[contractName]: {
					contractName,
					abi: [
						{
							name: `method${i}`,
							type: 'function',
							inputs: [],
							outputs: [],
							stateMutability: 'nonpayable',
						},
					],
					userdoc: {
						methods: {},
						kind: 'user',
						version: 1,
					},
					evm: { deployedBytecode: { object: `0x${i}${i}${i}` } },
				},
			}

			// Setup mock
			mockResolveArtifacts.mockImplementationOnce(async () => ({
				artifacts,
				modules: mockModules,
				asts: { [`Contract${i}.sol`]: {} },
				solcInput: { language: 'Solidity', settings: {}, sources: {} },
				solcOutput: { contracts: {}, sources: {} },
			}))

			// Create promise for this operation
			promises.push(resolver.resolveEsmModule(`module${i}.sol`, 'basedir', false, true))
		}

		// Wait for all operations to complete
		const results = await Promise.all(promises)

		// Verify each result
		for (let i = 0; i < numOperations; i++) {
			if (results[i]) {
				expect(results[i].code).toContain(`Contract${i}`)
			}
		}

		// Verify correct number of calls
		expect(mockResolveArtifacts).toHaveBeenCalledTimes(numOperations)
	})
})
