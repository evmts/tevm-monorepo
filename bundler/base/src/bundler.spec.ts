import { bundler } from './bundler.js'
import type { Bundler, FileAccessObject, Logger } from './types.js'
import {
	type ModuleInfo,
	type SolcInputDescription,
	type SolcOutput,
	resolveArtifacts,
	resolveArtifactsSync,
} from '@evmts/solc'
import type { Node } from 'solidity-ast/node.js'
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const fao: FileAccessObject = {
	existsSync: vi.fn() as any,
	readFile: vi.fn() as any,
	readFileSync: vi.fn() as any,
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

describe(bundler.name, () => {
	let resolver: ReturnType<Bundler>
	let logger: Logger
	let config

	const mockAddresses = {
		10: '0x123',
	}
	beforeEach(() => {
		logger = { ...console, error: vi.fn() }
		config = {
			compiler: 'compiler config',
			localContracts: {
				contracts: [{ name: 'TestContract', addresses: mockAddresses }],
			},
		}

		resolver = bundler(config as any, logger, fao)
		vi.mock('@evmts/solc', () => {
			return {
				resolveArtifacts: vi.fn(),
				resolveArtifactsSync: vi.fn(),
			}
		})
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('error cases', () => {
		describe('resolveDts', () => {
			it('should throw an error if there is an issue in resolveArtifacts', async () => {
				mockResolveArtifacts.mockRejectedValueOnce(new Error('Test error'))
				await expect(
					resolver.resolveDts('module', 'basedir', false, false),
				).rejects.toThrow('Test error')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
				[
				  [
				    [Error: Test error],
				  ],
				  [
				    "there was an error in evmts plugin generating .dts",
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
				expect(() =>
					resolver.resolveDtsSync('module', 'basedir', false, false),
				).toThrow('Test error sync')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    [Error: Test error sync],
					  ],
					  [
					    "there was an error in evmts plugin resolving .dts",
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
				expect(() =>
					resolver.resolveTsModuleSync('module', 'basedir', false, false),
				).toThrow('Test error sync')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    [Error: Test error sync],
					  ],
					  [
					    "there was an error in evmts plugin resolving .ts",
					  ],
					]
				`)
			})
		})

		describe('resolveTsModule', () => {
			it('should throw an error if there is an issue in resolveArtifacts', async () => {
				mockResolveArtifacts.mockRejectedValueOnce(new Error('Test error'))
				await expect(
					resolver.resolveTsModule('module', 'basedir', false, false),
				).rejects.toThrow('Test error')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    [Error: Test error],
					  ],
					  [
					    "there was an error in evmts plugin resolving .ts",
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
				expect(() =>
					resolver.resolveCjsModuleSync('module', 'basedir', false, false),
				).toThrow('Test error sync')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    [Error: Test error sync],
					  ],
					  [
					    "there was an error in evmts plugin resolving .cjs",
					  ],
					]
				`)
			})
		})

		describe('resolveCjsModule', () => {
			it('should throw an error if there is an issue in resolveArtifacts', async () => {
				mockResolveArtifacts.mockRejectedValueOnce(new Error('Test error'))
				await expect(
					resolver.resolveCjsModule('module', 'basedir', false, false),
				).rejects.toThrow('Test error')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    [Error: Test error],
					  ],
					  [
					    "there was an error in evmts plugin resolving .cjs",
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
				expect(() =>
					resolver.resolveEsmModuleSync('module', 'basedir', false, false),
				).toThrow('Test error sync')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    "there was an error in evmts plugin resolving .mjs",
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
				await expect(
					resolver.resolveEsmModule('module', 'basedir', false, false),
				).rejects.toThrow('Test error')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    [Error: Test error],
					  ],
					  [
					    "there was an error in evmts plugin resolving .mjs",
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
			const result = await resolver.resolveDts(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
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
					solcInput: {
						language: 'Solidity',
						settings: { outputSelection: { sources: {} } },
						sources: {},
					} satisfies SolcInputDescription,
					solcOutput: {
						contracts: {},
						sources: {},
					} satisfies SolcOutput,
				} as any as Record<string, Node>,
			})
			const result = await resolver.resolveDts(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
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
				  },
				  "code": "import { EvmtsContract } from '@evmts/core'
				const _abiTestContract = [] as const;
				const _nameTestContract = \\"TestContract\\" as const;
				/**
				 * TestContract EvmtsContract
				 */
				export const TestContract: EvmtsContract<typeof _nameTestContract, typeof _abiTestContract, undefined, undefined>;",
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
				  "solcInput": undefined,
				  "solcOutput": undefined,
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
				  "code": "",
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
				  "code": "import { EvmtsContract } from '@evmts/core'
				const _abiTestContract = [] as const;
				const _nameTestContract = \\"TestContract\\" as const;
				/**
				 * TestContract EvmtsContract
				 */
				export const TestContract: EvmtsContract<typeof _nameTestContract, typeof _abiTestContract, undefined, undefined>;",
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
			const result = resolver.resolveTsModuleSync(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
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
			const result = resolver.resolveTsModuleSync(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"humanReadableAbi\\":[]} as const
				export const TestContract = evmtsContractFactory(_TestContract)",
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
			const result = await resolver.resolveTsModule(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
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
			const result = await resolver.resolveTsModule(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"humanReadableAbi\\":[]} as const
				export const TestContract = evmtsContractFactory(_TestContract)",
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
			const result = resolver.resolveCjsModuleSync(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
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
			const result = resolver.resolveCjsModuleSync(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "const { evmtsContractFactory } = require('@evmts/core')
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"humanReadableAbi\\":[]}
				module.exports.TestContract = evmtsContractFactory(_TestContract)",
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
			const result = await resolver.resolveCjsModule(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
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
			const result = await resolver.resolveCjsModule(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "const { evmtsContractFactory } = require('@evmts/core')
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"humanReadableAbi\\":[]}
				module.exports.TestContract = evmtsContractFactory(_TestContract)",
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
			const result = resolver.resolveEsmModuleSync(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
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
			const result = resolver.resolveEsmModuleSync(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"humanReadableAbi\\":[]}
				export const TestContract = evmtsContractFactory(_TestContract)",
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
			const result = await resolver.resolveEsmModule(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": undefined,
				  "code": "",
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
			const result = await resolver.resolveEsmModule(
				'module',
				'basedir',
				false,
				false,
			)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"humanReadableAbi\\":[]}
				export const TestContract = evmtsContractFactory(_TestContract)",
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
