import { bundler } from './bundler'
import { resolveArtifacts, resolveArtifactsSync } from './solc'
import type { SolcInputDescription, SolcOutput } from './solc/solc'
import type { Bundler, FileAccessObject, Logger, ModuleInfo } from './types'
import type { Node } from 'solidity-ast/node'
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
		resolutions: [
			{
				id: 'id',
				rawCode: 'contract TestContract2 {}',
				code: 'contract TestContract2 {}',
				importedIds: ['module2'],
				resolutions: [],
			},
		],
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
		vi.mock('./solc', () => {
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
					resolver.resolveDts('module', 'basedir', false),
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
					resolver.resolveDtsSync('module', 'basedir', false),
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
					resolver.resolveTsModuleSync('module', 'basedir', false),
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
					resolver.resolveTsModule('module', 'basedir', false),
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
					resolver.resolveCjsModuleSync('module', 'basedir', false),
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
					resolver.resolveCjsModule('module', 'basedir', false),
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
					resolver.resolveEsmModuleSync('module', 'basedir', false),
				).toThrow('Test error sync')
				expect((logger.error as Mock).mock.calls).toMatchInlineSnapshot(`
					[
					  [
					    "there was an error in evmts plugin resolving .mjs",
					  ],
					]
				`)
			})
		})

		describe('resolveEsmModule', () => {
			it('should throw an error if there is an issue in resolveArtifacts', async () => {
				mockResolveArtifacts.mockRejectedValueOnce(new Error('Test error'))
				await expect(
					resolver.resolveEsmModule('module', 'basedir', false),
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
			const result = await resolver.resolveDts('module', 'basedir', false)
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
			const result = await resolver.resolveDts('module', 'basedir', false)
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
				const _chainAddressMapTestContract = {\\"10\\":\\"0x123\\"} as const;
				const _nameTestContract = \\"TestContract\\" as const;
				/**
				 * TestContract EvmtsContract
				 * @etherscan-10 https://optimistic.etherscan.io/address/0x123
				 */
				export const TestContract: EvmtsContract<typeof _nameTestContract, typeof _chainAddressMapTestContract, typeof _abiTestContract>;",
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
				      "resolutions": [
				        {
				          "code": "contract TestContract2 {}",
				          "id": "id",
				          "importedIds": [
				            "module2",
				          ],
				          "rawCode": "contract TestContract2 {}",
				          "resolutions": [],
				        },
				      ],
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
			const result = resolver.resolveDtsSync('module', 'basedir', false)
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
			const result = resolver.resolveDtsSync('module', 'basedir', false)
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
				const _chainAddressMapTestContract = {\\"10\\":\\"0x123\\"} as const;
				const _nameTestContract = \\"TestContract\\" as const;
				/**
				 * TestContract EvmtsContract
				 * @etherscan-10 https://optimistic.etherscan.io/address/0x123
				 */
				export const TestContract: EvmtsContract<typeof _nameTestContract, typeof _chainAddressMapTestContract, typeof _abiTestContract>;",
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
				      "resolutions": [
				        {
				          "code": "contract TestContract2 {}",
				          "id": "id",
				          "importedIds": [
				            "module2",
				          ],
				          "rawCode": "contract TestContract2 {}",
				          "resolutions": [],
				        },
				      ],
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
			const result = resolver.resolveTsModuleSync('module', 'basedir', false)
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
			const result = resolver.resolveTsModuleSync('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}} as const
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
				      "resolutions": [
				        {
				          "code": "contract TestContract2 {}",
				          "id": "id",
				          "importedIds": [
				            "module2",
				          ],
				          "rawCode": "contract TestContract2 {}",
				          "resolutions": [],
				        },
				      ],
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
			const result = await resolver.resolveTsModule('module', 'basedir', false)
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
			const result = await resolver.resolveTsModule('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}} as const
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
				      "resolutions": [
				        {
				          "code": "contract TestContract2 {}",
				          "id": "id",
				          "importedIds": [
				            "module2",
				          ],
				          "rawCode": "contract TestContract2 {}",
				          "resolutions": [],
				        },
				      ],
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
			const result = resolver.resolveCjsModuleSync('module', 'basedir', false)
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
			const result = resolver.resolveCjsModuleSync('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "const { evmtsContractFactory } = require('@evmts/core')
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}}
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
				      "resolutions": [
				        {
				          "code": "contract TestContract2 {}",
				          "id": "id",
				          "importedIds": [
				            "module2",
				          ],
				          "rawCode": "contract TestContract2 {}",
				          "resolutions": [],
				        },
				      ],
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
			const result = await resolver.resolveCjsModule('module', 'basedir', false)
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
			const result = await resolver.resolveCjsModule('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "const { evmtsContractFactory } = require('@evmts/core')
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}}
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
				      "resolutions": [
				        {
				          "code": "contract TestContract2 {}",
				          "id": "id",
				          "importedIds": [
				            "module2",
				          ],
				          "rawCode": "contract TestContract2 {}",
				          "resolutions": [],
				        },
				      ],
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
			const result = resolver.resolveEsmModuleSync('module', 'basedir', false)
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
			const result = resolver.resolveEsmModuleSync('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}}
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
				      "resolutions": [
				        {
				          "code": "contract TestContract2 {}",
				          "id": "id",
				          "importedIds": [
				            "module2",
				          ],
				          "rawCode": "contract TestContract2 {}",
				          "resolutions": [],
				        },
				      ],
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
			const result = await resolver.resolveEsmModule('module', 'basedir', false)
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
			const result = await resolver.resolveEsmModule('module', 'basedir', false)
			expect(result).toMatchInlineSnapshot(`
				{
				  "asts": {
				    "TestContract.sol": {
				      "absolutePath": "/absolute/path",
				      "evmVersion": "homestead",
				    },
				  },
				  "code": "import { evmtsContractFactory } from '@evmts/core'
				const _TestContract = {\\"name\\":\\"TestContract\\",\\"abi\\":[],\\"addresses\\":{\\"10\\":\\"0x123\\"}}
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
				      "resolutions": [
				        {
				          "code": "contract TestContract2 {}",
				          "id": "id",
				          "importedIds": [
				            "module2",
				          ],
				          "rawCode": "contract TestContract2 {}",
				          "resolutions": [],
				        },
				      ],
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
