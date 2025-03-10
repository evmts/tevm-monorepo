import { tmpdir } from 'node:os'
import { createCache } from '@tevm/bundler-cache'
import { type ModuleInfo, resolveArtifacts, resolveArtifactsSync } from '@tevm/compiler'
import type { SolcInputDescription, SolcOutput } from '@tevm/solc'
import type { Node } from 'solidity-ast/node.js'
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { bundler } from './bundler.js'
import type { Bundler, FileAccessObject, Logger } from './types.js'

const fao: FileAccessObject = {
	existsSync: vi.fn() as any,
	readFile: vi.fn() as any,
	readFileSync: vi.fn() as any,
	writeFileSync: vi.fn() as any,
	statSync: vi.fn() as any,
	stat: vi.fn() as any,
	mkdirSync: vi.fn() as any,
	exists: vi.fn() as any,
	mkdir: vi.fn() as any,
	writeFile: vi.fn() as any,
}

const mockModules: Record<string, ModuleInfo> = {
	module1: {
		id: 'id',
		rawCode: `import { TestContract } from 'module2'
contract TestContract {}`,
		code: `import { TestContract } from 'module2'
contract TestContract {}`,
		importedIds: ['module2'],
	},
}

const contractPackage = '@tevm/contract'

// Mock @tevm/compiler at the module level
vi.mock('@tevm/compiler', () => {
	return {
		resolveArtifacts: vi.fn(),
		resolveArtifactsSync: vi.fn(),
	}
})

// Create a mock for getContractPath that we can use in tests
const mockGetContractPath = vi.fn().mockReturnValue('fallback/contract/path')

// Mock getContractPath.js before tests
vi.mock('./getContractPath.js', () => ({
  getContractPath: mockGetContractPath
}))

describe(bundler.name, () => {
	it('should fall back to getContractPath when contractPackage is not provided', () => {
		// Save the original process.cwd
		const originalCwd = process.cwd
		// Mock process.cwd
		process.cwd = vi.fn().mockReturnValue('/test/cwd')
		
		// Reset the mock before this specific test
		mockGetContractPath.mockClear()
		
		// We need to re-require the bundler module to use our mocked version
		const { bundler: freshBundler } = require('./bundler.js')
		
		// Create a bundler instance without a contract package
		const mockLogger = { error: vi.fn() }
		const mockConfig = {}
		const mockFao = {}
		const mockSolc = {}
		const mockCache = {}
		
		const bundlerInstance = freshBundler(
			mockConfig,
			mockLogger,
			mockFao,
			mockSolc,
			mockCache,
			undefined
		)
		
		expect(mockGetContractPath).toHaveBeenCalledWith('/test/cwd')
		expect(bundlerInstance).toBeDefined()
		
		// Restore original process.cwd
		process.cwd = originalCwd
	})
	
	let resolver: ReturnType<Bundler>
	let logger: Logger
	let config: any

	const mockAddresses = {
		10: '0x123',
	}
	beforeEach(() => {
		// Reset any mocks that might affect the main tests
		mockGetContractPath.mockReturnValue('fallback/contract/path')
		
		logger = { ...console, error: vi.fn() }
		config = {
			compiler: 'compiler config',
			localContracts: {
				contracts: [{ name: 'TestContract', addresses: mockAddresses }],
			},
		}

		resolver = bundler(
			config as any,
			logger,
			fao,
			require('solc'),
			createCache(tmpdir(), fao, tmpdir()),
			contractPackage,
		)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('error cases', () => {
		describe('resolveDts', () => {
			it('should throw an error if there is an issue in resolveArtifacts', async () => {
				mockResolveArtifacts.mockRejectedValueOnce(new Error('Test error'))
				await expect(resolver.resolveDts('module', 'basedir', false, false)).rejects.toThrow('Test error')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    "there was an error in tevm plugin resolving .dts",
					  ],
					  [
					    [Error: Test error],
					  ],
					]
				`)
			})
		})

		describe('resolveDtsSync', () => {
			it('should throw an error if there is an issue in resolveArtifactsSync', () => {
				mockResolveArtifactsSync.mockImplementation(() => {
					throw new Error('Test error sync')
				})
				expect(() => resolver.resolveDtsSync('module', 'basedir', false, false)).toThrow('Test error sync')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    "there was an error in tevm plugin resolving .dts",
					  ],
					  [
					    [Error: Test error sync],
					  ],
					]
				`)
			})
		})

		describe('resolveTsModuleSync', () => {
			it('should throw an error if there is an issue in resolveArtifactsSync', () => {
				mockResolveArtifactsSync.mockImplementation(() => {
					throw new Error('Test error sync')
				})
				expect(() => resolver.resolveTsModuleSync('module', 'basedir', false, false)).toThrow('Test error sync')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    "there was an error in tevm plugin resolving .ts",
					  ],
					  [
					    [Error: Test error sync],
					  ],
					]
				`)
			})
		})

		describe('resolveTsModule', () => {
			it('should throw an error if there is an issue in resolveArtifacts', async () => {
				mockResolveArtifacts.mockRejectedValueOnce(new Error('Test error'))
				await expect(resolver.resolveTsModule('module', 'basedir', false, false)).rejects.toThrow('Test error')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    "there was an error in tevm plugin resolving .ts",
					  ],
					  [
					    [Error: Test error],
					  ],
					]
				`)
			})
		})

		describe('resolveCjsModuleSync', () => {
			it('should throw an error if there is an issue in resolveArtifactsSync', () => {
				mockResolveArtifactsSync.mockImplementation(() => {
					throw new Error('Test error sync')
				})
				expect(() => resolver.resolveCjsModuleSync('module', 'basedir', false, false)).toThrow('Test error sync')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    "there was an error in tevm plugin resolving .cjs",
					  ],
					  [
					    [Error: Test error sync],
					  ],
					]
				`)
			})
		})

		describe('resolveCjsModule', () => {
			it('should throw an error if there is an issue in resolveArtifacts', async () => {
				mockResolveArtifacts.mockRejectedValueOnce(new Error('Test error'))
				await expect(resolver.resolveCjsModule('module', 'basedir', false, false)).rejects.toThrow('Test error')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    "there was an error in tevm plugin resolving .cjs",
					  ],
					  [
					    [Error: Test error],
					  ],
					]
				`)
			})
		})

		describe('resolveEsmModuleSync', () => {
			it('should throw an error if there is an issue in resolveArtifactsSync', () => {
				mockResolveArtifactsSync.mockImplementation(() => {
					throw new Error('Test error sync')
				})
				expect(() => resolver.resolveEsmModuleSync('module', 'basedir', false, false)).toThrow('Test error sync')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    "there was an error in tevm plugin resolving .mjs",
					  ],
					  [
					    [Error: Test error sync],
					  ],
					]
				`)
			})
		})

		describe('resolveEsmModule', () => {
			it('should throw an error if there is an issue in resolveArtifacts', async () => {
				mockResolveArtifacts.mockRejectedValueOnce(new Error('Test error'))
				await expect(resolver.resolveEsmModule('module', 'basedir', false, false)).rejects.toThrow('Test error')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    "there was an error in tevm plugin resolving .mjs",
					  ],
					  [
					    [Error: Test error],
					  ],
					]
				`)
			})
		})
	})

	const mockResolveArtifacts = resolveArtifacts as Mock
	describe('resolveDts', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce({})
			const result = await resolver.resolveDts('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "// there were no artifacts for module. This is likely a bug in tevm",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				} as any as Record<string, Node>,
			})
			const result = await resolver.resolveDts('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import type { Contract } from '@tevm/contract'
				const _abiTestContract = [] as const;
				const _nameTestContract = "TestContract" as const;
				/**
				 * TestContract Contract (no bytecode)
				 * change file name or add file that ends in '.s.sol' extension if you wish to compile the bytecode
				 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
				 */
				export const TestContract: Contract<typeof _nameTestContract, typeof _abiTestContract, undefined, undefined, undefined, undefined>;",
				  "modules": {
				    "module1": {
				      "code": "import { TestContract } from 'module2'
				contract TestContract {}",
				      "id": "id",
				      "importedIds": [
				        "module2",
				      ],
				      "rawCode": "import { TestContract } from 'module2'
				contract TestContract {}",
				    },
				  },
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	const mockResolveArtifactsSync = resolveArtifactsSync as Mock
	describe('resolveDtsSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveDtsSync('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "// there were no artifacts for module. This is likely a bug in tevm",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifactsSync.mockReturnValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = resolver.resolveDtsSync('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import type { Contract } from '@tevm/contract'
				const _abiTestContract = [] as const;
				const _nameTestContract = "TestContract" as const;
				/**
				 * TestContract Contract (no bytecode)
				 * change file name or add file that ends in '.s.sol' extension if you wish to compile the bytecode
				 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
				 */
				export const TestContract: Contract<typeof _nameTestContract, typeof _abiTestContract, undefined, undefined, undefined, undefined>;",
				  "modules": {
				    "module1": {
				      "code": "import { TestContract } from 'module2'
				contract TestContract {}",
				      "id": "id",
				      "importedIds": [
				        "module2",
				      ],
				      "rawCode": "import { TestContract } from 'module2'
				contract TestContract {}",
				    },
				  },
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveTsModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveTsModuleSync('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "// there were no artifacts for module. This is likely a bug in tevm",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			;(resolveArtifactsSync as Mock).mockReturnValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = resolver.resolveTsModuleSync('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { createContract } from '@tevm/contract'
				const _TestContract = {
				  "name": "TestContract",
				  "humanReadableAbi": []
				} as const
				/**
				 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
				 */
				export const TestContract = createContract(_TestContract)",
				  "modules": {
				    "module1": {
				      "code": "import { TestContract } from 'module2'
				contract TestContract {}",
				      "id": "id",
				      "importedIds": [
				        "module2",
				      ],
				      "rawCode": "import { TestContract } from 'module2'
				contract TestContract {}",
				    },
				  },
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveTsModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce({})
			const result = await resolver.resolveTsModule('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "// there were no artifacts for module. This is likely a bug in tevm",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper dts if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = await resolver.resolveTsModule('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { createContract } from '@tevm/contract'
				const _TestContract = {
				  "name": "TestContract",
				  "humanReadableAbi": []
				} as const
				/**
				 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
				 */
				export const TestContract = createContract(_TestContract)",
				  "modules": {
				    "module1": {
				      "code": "import { TestContract } from 'module2'
				contract TestContract {}",
				      "id": "id",
				      "importedIds": [
				        "module2",
				      ],
				      "rawCode": "import { TestContract } from 'module2'
				contract TestContract {}",
				    },
				  },
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveCjsModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveCjsModuleSync('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "// there were no artifacts for module. This is likely a bug in tevm",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper CommonJS module if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifactsSync.mockReturnValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = resolver.resolveCjsModuleSync('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "const { createContract } = require('@tevm/contract')
				const _TestContract = {
				  "name": "TestContract",
				  "humanReadableAbi": []
				}
				/**
				 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
				 */
				module.exports.TestContract = createContract(_TestContract)",
				  "modules": {
				    "module1": {
				      "code": "import { TestContract } from 'module2'
				contract TestContract {}",
				      "id": "id",
				      "importedIds": [
				        "module2",
				      ],
				      "rawCode": "import { TestContract } from 'module2'
				contract TestContract {}",
				    },
				  },
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveCjsModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce({})
			const result = await resolver.resolveCjsModule('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "// there were no artifacts for module. This is likely a bug in tevm",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper CommonJS module if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = await resolver.resolveCjsModule('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "const { createContract } = require('@tevm/contract')
				const _TestContract = {
				  "name": "TestContract",
				  "humanReadableAbi": []
				}
				/**
				 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
				 */
				module.exports.TestContract = createContract(_TestContract)",
				  "modules": {
				    "module1": {
				      "code": "import { TestContract } from 'module2'
				contract TestContract {}",
				      "id": "id",
				      "importedIds": [
				        "module2",
				      ],
				      "rawCode": "import { TestContract } from 'module2'
				contract TestContract {}",
				    },
				  },
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveEsmModuleSync', () => {
		it('should return an empty string if no artifacts are found', () => {
			mockResolveArtifactsSync.mockReturnValueOnce({})
			const result = resolver.resolveEsmModuleSync('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "// there were no artifacts for module. This is likely a bug in tevm",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper ESM module if artifacts are found', () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifactsSync.mockReturnValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = resolver.resolveEsmModuleSync('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { createContract } from '@tevm/contract'
				const _TestContract = {
				  "name": "TestContract",
				  "humanReadableAbi": []
				}
				/**
				 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
				 */
				export const TestContract = createContract(_TestContract)",
				  "modules": {
				    "module1": {
				      "code": "import { TestContract } from 'module2'
				contract TestContract {}",
				      "id": "id",
				      "importedIds": [
				        "module2",
				      ],
				      "rawCode": "import { TestContract } from 'module2'
				contract TestContract {}",
				    },
				  },
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})

	describe('resolveEsmModule', () => {
		it('should return an empty string if no artifacts are found', async () => {
			mockResolveArtifacts.mockResolvedValueOnce({})
			const result = await resolver.resolveEsmModule('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "// there were no artifacts for module. This is likely a bug in tevm",
				  "modules": undefined,
				  "solcInput": undefined,
				  "solcOutput": undefined,
				}
			`)
		})

		it('should generate proper ESM module if artifacts are found', async () => {
			const artifacts = {
				TestContract: { contractName: 'TestContract', abi: [] },
			}
			mockResolveArtifacts.mockResolvedValueOnce({
				artifacts,
				modules: mockModules,
				asts: {
					'TestContract.sol': {
						absolutePath: '/absolute/path',
						evmVersion: 'homestead',
					},
				},
				solcInput: {
					language: 'Solidity',
					settings: { outputSelection: { sources: {} } },
					sources: {},
				} satisfies SolcInputDescription,
				solcOutput: {
					contracts: {},
					sources: {},
				} satisfies SolcOutput,
			})
			const result = await resolver.resolveEsmModule('module', 'basedir', false, false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { createContract } from '@tevm/contract'
				const _TestContract = {
				  "name": "TestContract",
				  "humanReadableAbi": []
				}
				/**
				 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
				 */
				export const TestContract = createContract(_TestContract)",
				  "modules": {
				    "module1": {
				      "code": "import { TestContract } from 'module2'
				contract TestContract {}",
				      "id": "id",
				      "importedIds": [
				        "module2",
				      ],
				      "rawCode": "import { TestContract } from 'module2'
				contract TestContract {}",
				    },
				  },
				  "solcInput": {
				    "language": "Solidity",
				    "settings": {
				      "outputSelection": {
				        "sources": {},
				      },
				    },
				    "sources": {},
				  },
				  "solcOutput": {
				    "contracts": {},
				    "sources": {},
				  },
				}
			`)
		})
	})
})
